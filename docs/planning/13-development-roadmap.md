# 13 — Development Roadmap

**Gate zero:** no application code, migrations, or infrastructure until the founder says **"Begin Build Phase."** Everything below is the plan that instruction activates.

Durations assume a ~2-engineer-equivalent build velocity (founder + AI-assisted development). They are estimates for sequencing and honesty, not commitments.

## Phase 0 — Validation (now; parallel with anything)

- 15–20 Persona-1 interviews (OQ-C1, R-PE1): second-brain history, cloud-trust objections (R-SEC3), brief appetite, willingness to pay.
- Channel probe (OQ-PE1): where do reachable users concentrate; start a build-in-public surface early (audience compounds like the graph does).
- Name/trademark check (OQ-P3).
- **Exit criteria:** ≥ 10 interviews confirming the maintenance-tax pain + no fatal cloud objection from majority; name cleared.

## Phase A — De-risk spikes (~3–4 weeks) ← first build-phase work

Two spikes answer the two scariest technical questions **before** committing to full build. Spike code is throwaway by definition (this is not placeholder architecture — it is disposable evidence).

**A1 — The 3D canvas spike (OQ-F1, R-DS1, doc 06 mitigation table):**
5k synthetic nodes → instanced rendering + SDF billboarded labels + bloom + LOD/cluster proxies + camera choreography + plane-constrained drag + flat view. Measure: fps on 2022 MacBook Air, interaction latency, and — critically — hand it to 3 non-founders and watch them navigate. Decides: r3f vs. raw Three.js, layout engine (d3-force-3d worker vs. GPU), and whether any doc-06 mitigation needs redesign.

**A2 — The pipeline spike (OQ-J1, R-AI1, R-DB1, OQ-DB1):**
Real capture corpus (founder's actual notes) → structurer two-stage streaming → typed proposals → pgvector hybrid retrieval at 100k synthetic embeddings. Measure: p50/p95 latency vs. the 8s budget, typing/linking precision vs. the 40% floor, retrieval recall, real token costs → **fills the NFR-5 cost model with measured numbers** (OQ-P2, OQ-DB1).

- **Exit criteria:** both spikes meet bars, or findings force a documented revision of docs 06/08/09/12 *before* Phase B. Gate, not theater.

## Phase B — MVP build (~10–14 weeks)

Order follows the execution rules: schema → APIs → components → surfaces.

| Sprint block | Delivers | Traces to |
|---|---|---|
| B1 Foundations (2w) | Repo/CI, Supabase project, schema + RLS + RLS test suite, auth (passkeys/magic link), model gateway skeleton, token system | docs 08/10/09, D-DS1 |
| B2 Graph core (2–3w) | Node/edge/world APIs, write journal + optimistic sync, layout worker (server 3D force), export | FR-2.2, FR-7.2, NFR-3, D-DB2 |
| B3 Canvas (3–4w) | Production canvas from A1 learnings: rendering, vitality, camera, CRUD, drag-link, flat view, search-and-fly, context-panel editor | FR-2.1–2.5 |
| B4 Intelligence (2–3w) | Structurer + Embedder + Connector on the job queue; Inbox; Oracle with flying citations; eval suite + injection canaries in CI | FR-1.1/1.2, FR-5.1–5.3, doc 09 §6 |
| B5 Goals & polish (2w) | Goal nodes/anchoring/neighborhood, drift flags, onboarding (Journey 1 script), Neural theme final, instrumentation of all PRD §3 metrics | FR-3.1/3.2/3.4 |

- Continuous: founder dogfoods from B3 onward (own real data — the first Persona-1 user).
- **Exit criteria:** doc 12 §7 walkthrough passes end-to-end + §5 quality bars green.

## Phase C — Private beta (~6–8 weeks, overlaps late B)

- 15–25 invited Persona-1 users (the interview pool). Invite codes (OQ-MVP1 pending).
- Weekly cohort reviews against the doc-12 §6 gates; pipeline tuning on real graphs (acceptance floors as release gates).
- Mid-beta, corpus permitting: **turn on the Briefer** for opt-in users (D-MVP1's return path) — measure open rate before it graduates.
- **Exit criteria:** doc 12 §6 decision gates — proceed, fix, or execute the pivot protocol. This phase exists to make that call with data.

## Phase D — v1.0 public launch (~8–10 weeks after beta gate)

Scope = the P1 set (doc 06), informed by beta:

- **Growth spine:** Obsidian importer first, then Notion (FR-1.5 — the beachhead weapon, doc 03); mobile-web capture + brief; voice capture.
- **Retention spine:** daily brief GA (FR-5.4); decision review loop (FR-4.1/4.2); tasks + goal progress (FR-3.3); focus mode (FR-2.8).
- **Surface completion:** worlds UI + goal-orbital & timeline layouts (FR-2.6/2.7); Minimalist + Dark Intelligence themes; style overrides (FR-6.1/6.2); AI audit log UI (FR-7.4).
- **Business:** pricing live per PRD §7 with Phase-A-measured quotas; trust page (doc 10 posture, subprocessors, deletion map); incident runbook (doc 10 §7); launch push through Phase-0 channels.

## Phase E — Deepening (post-launch, sequenced by data)

Candidate order (re-prioritized quarterly against the north-star metric): Reality Graph + decision pattern surfacing → Why-Engine UI over accumulated `led_to` edges → opportunity detection (switches on per-user at corpus thresholds, doc 06) → agents-as-feature (exposing doc 09 seams) → user context block grows into the transparent digital twin → theme creation/sharing → email/extension capture → API. Local-first/E2EE research track remains open (D-SEC2, P3).

## Standing cadence (all phases)

- Docs are law: material deviation from docs 01–12 requires editing the doc in the same PR (decision log discipline).
- Metrics reviewed weekly from first deploy; eval suite + RLS suite + injection canaries block every release.
- Each phase ends with a written retro: what the plan got wrong, which doc changed.

## Top risks to the roadmap itself

| Risk | Mitigation |
|---|---|
| Spike results invalidate the 3D bar on floor hardware | Phase-A gate exists precisely to force the conversation early, with doc-06's degradation ladder as negotiation space |
| Solo-founder bandwidth: 5 pipelines + 3D canvas + shell is a lot | Phase order front-loads the two hardest systems; everything in D is deferrable without killing the hypothesis |
| Beta cohort too small/homogeneous to trust gates | Recruit from ≥ 3 channels; gates use behavior, not opinions |
| Scope creep re-entering via beta feedback | Doc 12 is the contract; new ideas file into Phase E, not Phase C |

## Open questions

- **OQ-R1:** Build-in-public degree — full transparency vs. quiet until beta. Marketing call, decide in Phase 0.
- **OQ-R2:** Second engineer / design contractor timing — revisit at Phase B start with honest velocity data from Phase A.
