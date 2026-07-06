# 09 — AI Architecture

**Principle:** AI is the operating layer, not a chat feature. Concretely, that means AI in NeuronOS is a small set of **pipelines that read and write graph entities**, plus one conversational surface. Everything is provenance-marked, auditable, and reversible (FR-7.3, D-DB6).

## 1. The system at a glance

```
                       ┌────────────────────────────┐
   capture / paste ──► │  STRUCTURER (pipeline)     │──► suggestions / nodes+edges
                       ├────────────────────────────┤
   node writes    ──►  │  EMBEDDER (pipeline)       │──► embeddings
                       ├────────────────────────────┤
   nightly + events ─► │  CONNECTOR (pipeline)      │──► edge suggestions
                       ├────────────────────────────┤
   nightly         ──► │  BRIEFER (pipeline)        │──► daily brief
                       ├────────────────────────────┤
   user question   ──► │  ORACLE (conversational)   │──► answers + node citations
                       └────────────────────────────┘
                                    ▲
                     CONTEXT ENGINE (shared retrieval + user context)
```

Five workers, one shared retrieval substrate. Note the deliberate framing: **these are the first five agents.** The v2 "Agents" feature (Research Agent, Trading Agent…) is the same pattern — a worker with a system role, graph-read tools, and suggestion-write access — exposed with user-facing identity. We ship the architecture now, the anthropomorphization later (doc 06 cut-lines).

## 2. The Context Engine (shared substrate)

Every pipeline calls one internal service: `retrieve(query, kinds, k, filters)`.

**Hybrid ranking** (FR-5.1): candidates from three channels, fused:

1. **Semantic:** pgvector HNSW over node/chunk embeddings.
2. **Lexical:** Postgres FTS over `body_text` (names, acronyms, tickers — where embeddings are weak).
3. **Graph proximity:** boost candidates within ≤ 2 hops of anchor nodes (current selection, active goal, nodes cited earlier in the conversation), weighted by edge strength.

Fusion: reciprocal-rank fusion, then a rerank stage (small cross-encoder or LLM rerank) only for Oracle queries where quality matters most.

**User context block:** a continuously maintained compact summary injected into every generative call: active goals + status, current worlds, top-vitality nodes, stated preferences, recent brief feedback. Regenerated incrementally (event-driven, debounced), capped at ~1.5k tokens. This is the *embryo of the digital twin* — v1 keeps it simple and inspectable (user can view and edit it: "what does my brain believe about me?").

## 3. The pipelines

### 3.1 Structurer (FR-1.2/1.3) — the magic trick

Input: raw capture text (+ user context block + retrieval of likely-related nodes).
Output: JSON proposal — nodes (typed per doc 07 vocabulary), edges, world assignments, each with confidence + one-line rationale.

- **Two-stage:** (a) fast classification/extraction with a small model; (b) linking pass that sees retrieval results and proposes edges to *existing* nodes. Stage (b) is where the product lives — a structurer that never connects to what you already know is just a fancy form-filler.
- **Confidence routing:** high-confidence single-node captures (Journey 3's "ping Sarah" case) can auto-apply as `ai_auto` provenance when the user has enabled auto-accept; anything multi-node, ambiguous, or goal-affecting goes to the suggestions queue with preview (Journey 1/3).
- **Streaming:** proposals stream entity-by-entity so the canvas can animate nodes into existence during onboarding (OQ-J1) — the API contract must be incremental from day 1, not batch-then-render.
- **Latency budget (NFR-1):** ≤ 8s p50 end-to-end. Stage (a) on a fast model ≤ 1.5s; retrieval ≤ 300ms; stage (b) streaming starts ≤ 3s.

### 3.2 Embedder

Triggered on node create/update (content-hash gated, D-DB4 §2.3). Chunks long bodies; embeds title+summary as chunk 0. Model pinned per registry entry; re-embedding is a background migration when the registry changes.

### 3.3 Connector (FR-5.3)

Runs nightly + on bursts of new nodes. For recent/high-vitality nodes: retrieve nearest non-connected neighbors → LLM judges "is this a real relationship, of which type, and *why*" → writes `suggestions` rows with rationale. Hard rules: max N pending suggestions per user (default ~7 — an overflowing inbox kills Journey 3), never re-suggest a rejected pair (rejections are stored and embedded as negative signal), suggestion score threshold tuned to hit the 40% acceptance floor (PRD §3) — *precision over recall, always*.

### 3.4 Briefer (FR-5.4)

Nightly per active user: deterministic scans first (drift flags FR-3.4, decision reviews due FR-4.2, activity diff) → LLM composes the brief from those facts + at most one Connector-sourced insight. **The LLM formats and prioritizes; it does not invent.** Every brief line carries node citations. Better-empty-than-mediocre enforced by a minimum-material threshold — no material, no brief, no shame.

### 3.5 Oracle (FR-5.2)

Conversational RAG over the graph with three product-specific properties:

1. **Citations are nodes** — answers return `[node_id]` refs; UI renders them as chips that fly the camera (IA §4.4).
2. **Conversations persist as graph entities** (Conversation nodes, `about` edges to cited nodes) — asking questions *grows the brain*.
3. **Tool-use, not context-stuffing:** Oracle gets tools (`search_nodes`, `expand_neighborhood`, `get_goal_tree`, `get_node`) and iterates — honest about what's in the graph vs. general knowledge; instructed to distinguish "your notes say X" from "generally, Y."

## 4. Model strategy

**Decision (D-AI1): model-agnostic routing layer from day 1.** Every call goes through an internal gateway declaring `(task, quality_tier, max_tokens, schema)`; the gateway maps to a provider/model from config. Rationale: frontier pricing/quality shifts quarterly; we are a *consumer* of models, never coupled to one (competitive risk R-C1 hedging too).

| Task | Tier | Notes |
|---|---|---|
| Structurer stage (a), classification | fast/cheap | Structured output, low creativity |
| Structurer stage (b), Connector judge | mid | Needs judgment; volume moderate |
| Briefer compose | mid | Daily, per-user, cacheable prompt prefix |
| Oracle | top | User-facing quality moment; where the money goes |
| Embeddings | dedicated embedding model | Dimension pinned in registry |

**Cost model (NFR-5, fills OQ-P2):** modeled per active user/day = structurer calls (captures/day × ~2 stages) + connector batch + brief + oracle queries. Placeholder budget target: **≤ $0.15/active-day p50** (~$4.50/mo heavy user) — to be replaced with measured numbers in Phase A; free-tier quotas derive from this line, not vibes. Levers if over: tier-downgrade structurer (b), brief every-other-day on free, prompt-prefix caching (user context block is cache-friendly by design).

## 5. Trust & safety properties (product-level)

- **Nothing silent:** all writes via `suggestions` or provenance-marked auto-path with per-action undo (D-DB6); `ai_actions` audit log user-viewable (FR-7.4).
- **No training on user data; no cross-user data flow.** Retrieval, context, and prompts are strictly single-tenant (doc 10).
- **Rationale everywhere:** every suggestion/brief-item carries a one-liner "because…" — explainability is a retention feature, not compliance theater.
- **Prompt-injection posture:** captured/imported content is *data*, never instructions — pipelines run with fixed system prompts, structured outputs, and no tools that exfiltrate (Oracle's tools are read-only over the user's own graph). Imported web/article content is the main vector; sanitize and treat as quoted material.
- **Failure honesty:** pipeline failures leave the raw capture safe in `captures` with a visible "unprocessed" state — degraded AI must never mean lost thoughts (NFR-3).

## 6. Evaluation (how we know it works)

Golden-set evals from day 1, run in CI against the gateway: (a) structurer typing accuracy + linking precision on a curated capture corpus; (b) connector precision@k against founder-labeled pairs; (c) oracle faithfulness (answers cite real nodes, no fabricated graph content); (d) brief factuality (every line traceable to a scan fact). Live metrics: acceptance rates by pipeline (PRD §3), undo rates, brief click-throughs. **Acceptance-rate floors are release gates, not dashboards** — a pipeline below floor ships off by default.

## Decisions

- **D-AI1:** Provider-agnostic model gateway; per-task tier routing; registry-pinned models.
- **D-AI2:** Five pipelines, one Context Engine; future "agents" reuse this exact seam.
- **D-AI3:** Deterministic-facts-then-LLM-composition for the brief; LLM never originates facts there.
- **D-AI4:** Streaming structured output is a day-1 API contract (onboarding awe depends on it).
- **D-AI5:** User context block is user-visible and editable — the twin starts transparent.

## Risks

- **R-AI1:** Structurer linking precision below trust threshold on small graphs (little to link to) → onboarding tunes stage (b) conservative early; acceptance-rate gate before auto-accept unlocks.
- **R-AI2:** Cost model blows past budget at heavy usage → levers listed §4; quotas are per-pipeline, so Oracle (visible value) is throttled last.
- **R-AI3:** Latency budget missed on cheap tiers → fallback: show typed-but-unlinked node instantly, linking arrives as a follow-up suggestion (degrade gracefully along the value chain).

## Open questions

- **OQ-AI1:** Rerank stage — worth the latency for Oracle at v1 corpus sizes? Measure in Phase B with real graphs.
- **OQ-AI2:** Auto-accept unlock criteria (per-user acceptance history? per-type?) — design during beta with real acceptance data.
