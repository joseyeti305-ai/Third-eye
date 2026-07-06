# 02 — Product Requirements Document (PRD)

**Scope of this PRD:** NeuronOS v1.0 (MVP through first public release). The 10-year vision lives in doc 01; this document covers only what v1 must do. The binding cut-line is doc 12.

## 1. Objective

Ship a product where a user can:

1. **Capture anything** (text, paste, voice-to-text) in under 3 seconds, and have AI turn it into typed nodes and relationships automatically.
2. **See and work in their graph** — a beautiful, alive 3D canvas where nodes are created, edited, linked, and organized in space.
3. **Anchor everything to goals** — define goals, see what connects to them, see what's drifting.
4. **Receive intelligence** — a daily brief and on-demand "ask my brain" answers grounded in their own graph.

Success = a user who, after 30 days, says "this thing knows me and I can't go back to Notion/Obsidian."

## 2. Target user (v1)

Primary persona: **the Systematic Ambitious** — a person running multiple serious life tracks (career/business, learning, health/personal) who already tried second-brain tooling and found it high-effort/low-return. Full personas in doc 04. Explicitly *not* targeting teams, students-casual, or enterprise in v1.

## 3. Success metrics

| Metric | Target (day-90 post-launch) | Why |
|---|---|---|
| North star: Weekly Insight Actions / active user | ≥ 5 | Measures the full loop (see doc 01) |
| D30 retention (activated users) | ≥ 35% | Category-defining products retain; note apps churn |
| Activation: user reaches "living graph" state (≥ 1 goal, ≥ 15 nodes, ≥ 60% nodes connected) within first session | ≥ 60% of signups | Kills the cold-start risk or proves it |
| Daily brief open rate | ≥ 50% of DAU | Is the intelligence worth reading? |
| AI suggestion acceptance rate (connections) | ≥ 40% | Is the auto-structuring trusted? |
| Median capture-to-structured latency | ≤ 8s | The magic must feel instant-ish |
| Graph interaction share | ≥ 50% of session time on canvas | Tests the graph-as-workspace thesis |

## 4. Functional requirements

Priority: **P0** = MVP-blocking · **P1** = v1.0 release · **P2** = post-v1 (listed for architectural awareness only).

### FR-1 Capture

- **FR-1.1 (P0)** Global quick-capture: keyboard shortcut opens an input from anywhere in the app; plain text in, dismiss, done. ≤ 3s interaction.
- **FR-1.2 (P0)** AI structuring: captured input is parsed into one or more typed nodes (Note, Task, Idea, Person, Goal-candidate, Decision-candidate…) with proposed edges to existing nodes. User sees a preview and can accept/edit/reject. Auto-accept mode available once trust is established.
- **FR-1.3 (P1)** Paste-in structuring: long pasted content (article, meeting notes) becomes a source node + extracted entity nodes.
- **FR-1.4 (P1)** Voice capture via browser speech-to-text (transcript follows FR-1.2 pipeline).
- **FR-1.5 (P2)** Importers: Markdown vault (Obsidian), Notion export. *(P2 for build order, but scheduled early in roadmap — importers are the cold-start weapon.)*
- **FR-1.6 (P2)** Email/share-sheet/browser-extension capture.

### FR-2 Graph canvas

- **FR-2.1 (P0)** Infinite 3D canvas (Three.js): orbit/dolly/fly camera over a spatial graph of typed nodes and edges; 60fps target at ≤ 1,000 visible nodes; instancing + clustering/LOD beyond that. Includes a constrained "flat view" camera mode (top-down, orthographic-feel) for precision work and accessibility.
- **FR-2.2 (P0)** On-canvas CRUD: create node (double-click / command), edit in a focus panel, link by drag, delete with undo.
- **FR-2.3 (P0)** Node vitality: node visual weight (size/brightness) derives from recency × frequency × connectivity; unused nodes fade/shrink over time. Deterministic and explainable (user can see why a node is "hot").
- **FR-2.4 (P0)** Typed rendering: each node type has a distinct default shape/color/icon per the design system (doc 11).
- **FR-2.5 (P0)** Search-and-fly: fuzzy + semantic search; selecting a result animates the camera to the node.
- **FR-2.6 (P1)** Worlds: named subgraph contexts (Life, Business, Learning…) with fast switching; nodes may belong to multiple worlds; cross-world edges visible on demand.
- **FR-2.7 (P1)** Layout modes: 3D force-directed (default), goal-centric orbital (goals at center, satellites by relevance), timeline corridor.
- **FR-2.8 (P1)** Focus mode: distraction-free editor view of a single node with its local neighborhood in a mini-map — the escape hatch if canvas-first fails for long-form work.
- **FR-2.9 (P2)** Theme marketplace, shareable worlds, VR/AR canvas mode.

### FR-3 Goals & execution

- **FR-3.1 (P0)** Goal nodes: title, why, target date, status, progress; visually dominant on the canvas.
- **FR-3.2 (P0)** Everything links to goals: any node can be connected to a goal with a typed edge (`supports`, `blocks`, `informs`); the goal's neighborhood view shows its whole support structure.
- **FR-3.3 (P1)** Tasks: task nodes with status/due date; a goal view lists its open tasks; completing a task strengthens the task→goal edge and feeds progress.
- **FR-3.4 (P1)** Drift signal: goals with no new connected activity for N days are flagged in the brief ("Cybersecurity cert: nothing new in 12 days").
- **FR-3.5 (P2)** Plans/milestones as generated structures; AI plan decomposition.

### FR-4 Decisions

- **FR-4.1 (P1)** Decision nodes: context, options considered, assumptions, chosen option, review date.
- **FR-4.2 (P1)** Outcome logging: at review date the brief prompts "how did this turn out?"; outcome + lessons recorded on the node.
- **FR-4.3 (P2)** Decision pattern analysis across the corpus; Reality Graph (belief/evidence/outcome typed subgraph); Why-Engine causal tracing UI.

### FR-5 Intelligence

- **FR-5.1 (P0)** Semantic memory: every node embedded; hybrid (semantic + keyword + graph-proximity) retrieval.
- **FR-5.2 (P0)** Ask-my-brain: chat over the user's own graph with citations that are *clickable nodes* (answers fly the camera to sources). Conversations are themselves saved as nodes.
- **FR-5.3 (P0)** Connection suggestions: background job proposes edges between related nodes; surfaced as a review queue, never auto-applied silently.
- **FR-5.4 (P1)** Daily brief: one generated briefing per day — what changed, goal drift, decision reviews due, 1–3 suggested actions, at most 1 "insight" (non-obvious connection). Quality bar: better empty than mediocre.
- **FR-5.5 (P2)** Opportunity detection engine, specialized agents (Research, Trading, etc.), digital twin model, proactive ambient notifications.

### FR-6 Customization

- **FR-6.1 (P1)** Themes: ship 3 at launch (Neural [default], Minimalist, Dark Intelligence); theme = design-token set (doc 11).
- **FR-6.2 (P1)** Per-type node style overrides (color, shape, glow) within theme constraints.
- **FR-6.3 (P2)** Physics tuning, custom themes, theme sharing/marketplace.

### FR-7 Account & data

- **FR-7.1 (P0)** Auth: passkeys primary, email magic-link fallback (doc 10).
- **FR-7.2 (P0)** Full export: entire graph as JSON + Markdown bundle, one click, no lock-in games.
- **FR-7.3 (P0)** AI transparency: every AI-created/modified node or edge is provenance-marked (`created_by: ai`) and individually reversible.
- **FR-7.4 (P1)** Audit log of all AI actions, viewable by the user.

## 5. Non-functional requirements

- **NFR-1 Performance:** 3D canvas 60fps @ 1k visible nodes on a mid-range laptop GPU (WebGL2 baseline, WebGPU where available; instanced rendering mandatory); interaction latency < 100ms; capture round-trip (FR-1.2) ≤ 8s p50 / ≤ 20s p95; app cold load ≤ 2.5s p75.
- **NFR-2 Scale (v1):** design for 100k nodes / 500k edges per user without architectural change; UI virtualizes, never loads full graph client-side beyond viewport needs.
- **NFR-3 Reliability:** no data loss, period. Optimistic UI with durable write queue; conflict-safe (single-user, multi-device: last-writer-wins per field with version history).
- **NFR-4 Security & privacy:** doc 10 is normative. Headlines: zero-trust posture, RLS on every table, encryption at rest + in transit, no training on user data, LLM calls minimized to necessary context.
- **NFR-5 Cost:** AI cost per active user must be modeled before build; embedding + structuring + brief ≤ target $X/user/mo with tiered model routing (doc 09). Freemium limits are designed around this, not around feature-crippling.
- **NFR-6 Accessibility:** the graph is inherently visual; every canvas operation must also be achievable via search/list/keyboard. WCAG 2.1 AA for all non-canvas UI; reduced-motion mode disables ambience without disabling function.
- **NFR-7 Platform:** responsive web app (desktop-first; the canvas experience targets ≥ 13" screens). Mobile web = capture + brief + search only in v1. Native apps deferred.

## 6. Explicitly out of scope for v1

Collaboration/sharing, plugins/API platform, agents beyond the core pipeline, digital twin, opportunity engine, 3D mode, theme marketplace, native mobile/desktop apps, offline-first sync, integrations beyond import (calendar, email). Each is real roadmap (doc 13) — none blocks the core loop.

## 7. Pricing posture (directional, not final)

- **Free:** full graph, limited AI actions/month (enough to feel the magic, not enough to live on).
- **Pro (~$12–20/mo):** unmetered daily briefs, generous structuring quota, all themes, priority models.
- Rationale: the moat is data gravity; the cost is AI. Never meter *storage or export* (that would fight the moat and the trust story); meter *intelligence*.

## 8. Key risks (PRD-level)

| Risk | Mitigation |
|---|---|
| Graph-as-workspace thesis fails (users want an editor) | FR-2.8 focus mode is the hedge; metric §3 "graph interaction share" is the tripwire; pivot plan in doc 12 |
| AI structuring is wrong often enough to break trust | Preview-before-apply (FR-1.2), provenance + undo (FR-7.3), acceptance-rate metric with 40% floor |
| Cold start: empty graph = no awe | Onboarding designs a guided goal + seed session (doc 05, Journey 1); importers prioritized right after MVP |
| AI unit economics under free tier | NFR-5 modeling before build; metering from day 1 |
| Performance collapse on large graphs | NFR-2 architecture (frustum-driven loading, instancing, LOD) is a day-1 constraint, not an optimization |
| 3D interaction failure modes (occlusion, label legibility, disorientation, imprecise manipulation) | Named mitigations are P0 requirements: layered layouts, billboarded SDF labels, camera choreography with home/reset, flat-view mode, focus-dimming (docs 06 & 11); usability-tested in Phase A spike before full build |

## Decisions

- **D-P1:** Desktop-web-first; mobile is capture-only in v1. The awe surface needs pixels.
- **D-P2:** AI suggestions are always visible-and-reversible; nothing silently mutates the graph. Trust is a feature.
- **D-P3:** Meter intelligence, never storage/export.
- **D-P4:** P0 set = FR-1.1–1.2, FR-2.1–2.5, FR-3.1–3.2, FR-5.1–5.3, FR-7.1–7.3. Everything else waits.

## Open questions

- **OQ-P1:** Brief delivery time/channel (in-app only vs. email digest) — decide during beta from behavior.
- **OQ-P2:** Exact free-tier AI quota — needs the cost model from doc 09 filled with real token measurements during build.
- **OQ-P3:** Product name/trademark check for "NeuronOS" — do before public launch.
