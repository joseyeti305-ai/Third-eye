# 06 — Feature Hierarchy

## Scoring method

Every feature is scored 1–5 on the four axes mandated by the MVP philosophy, then given an honest verdict:

- **V — User value** (for Persona 1, month 1–3)
- **C — Complexity** (5 = trivial, 1 = brutal; higher is better so the composite reads intuitively)
- **S — Strategic advantage** (moat contribution: data gravity, loop lock-in)
- **D — Differentiation** (does any competitor have this today?)

Verdicts: **P0** (MVP-blocking) · **P1** (v1.0 public release) · **P2** (post-v1, architecture-aware) · **P3** (vision horizon). Priorities here are the *input* to doc 12; where they disagree, doc 12 wins.

---

## Tier 1 — The Core Loop (the product)

The five-stage loop everything serves: **Capture → Structure → Connect → Anchor → Brief.**

| Feature | V | C | S | D | Verdict | Notes |
|---|---|---|---|---|---|---|
| Quick capture (hotkey, ≤3s) (FR-1.1) | 5 | 5 | 4 | 2 | **P0** | Table stakes executed perfectly |
| AI structuring w/ preview (FR-1.2) | 5 | 2 | 5 | 5 | **P0** | The magic trick. Hardest, most valuable |
| Paste-in structuring (FR-1.3) | 4 | 3 | 4 | 4 | **P1** | Same pipeline, longer inputs |
| Voice capture (FR-1.4) | 3 | 4 | 2 | 2 | **P1** | Browser STT feeding FR-1.2; cheap once pipeline exists |
| Connection suggestions queue (FR-5.3) | 5 | 3 | 5 | 4 | **P0** | This is what makes the graph *alive* vs. hand-built |
| Semantic memory / embeddings (FR-5.1) | 5 | 3 | 5 | 3 | **P0** | Substrate for everything in Tier 3 |
| Goal nodes + goal anchoring (FR-3.1/3.2) | 5 | 4 | 5 | 5 | **P0** | The category-defining difference; nobody has it |
| Daily brief (FR-5.4) | 5 | 2 | 5 | 4 | **P1** | Retention engine. P1 only because it needs weeks of user data to be good; ships at v1.0, not MVP demo |

## Tier 2 — The Canvas (the surface)

| Feature | V | C | S | D | Verdict | Notes |
|---|---|---|---|---|---|---|
| Infinite 3D canvas, orbit/fly camera (FR-2.1) | 5 | 2 | 4 | 5 | **P0** | Three.js / react-three-fiber; instanced rendering; founder decision — see cut-lines section |
| On-canvas CRUD + drag-linking (FR-2.2) | 5 | 2 | 5 | 4 | **P0** | *This* is graph-as-workspace; Obsidian's graph can't do it. Harder in 3D — raycast picking + plane-constrained drag |
| Node vitality (grow/fade) (FR-2.3) | 4 | 3 | 4 | 5 | **P0** | The "alive" signature; deterministic decay math |
| Typed node rendering (FR-2.4) | 5 | 4 | 4 | 4 | **P0** | Visual language per doc 11 |
| Search-and-fly (FR-2.5) | 5 | 4 | 3 | 3 | **P0** | Navigation at scale is non-negotiable |
| Focus mode editor (FR-2.8) | 4 | 3 | 3 | 2 | **P1** | The escape hatch (Journey 6); also the thesis hedge |
| Worlds (FR-2.6) | 4 | 3 | 4 | 3 | **P1** | MVP fakes it with goal-clusters; real worlds at v1.0 |
| Layout modes: goal-radial, timeline (FR-2.7) | 3 | 3 | 3 | 4 | **P1** | Goal-radial first; timeline can slip |
| Clustering/LOD/instancing past 1k nodes (NFR-2) | 4 | 2 | 3 | 2 | **P0-arch** | Architecture must support it day 1; polish iteratively |
| Flat-view camera mode (constrained top-down) | 4 | 4 | 3 | 2 | **P0** | Precision-work + accessibility companion to full 3D |
| VR/AR canvas mode | 2 | 1 | 2 | 4 | **P3** | The 3D substrate makes this a future option, not a rewrite |

## Tier 3 — Intelligence surfaces

| Feature | V | C | S | D | Verdict | Notes |
|---|---|---|---|---|---|---|
| Ask-my-brain w/ node citations (FR-5.2) | 5 | 3 | 5 | 4 | **P0** | RAG is commodity; *citations that fly the camera* are not |
| Conversations saved as nodes | 4 | 4 | 5 | 4 | **P0** | Cheap once FR-5.2 exists; deepens data gravity |
| Decision nodes + review loop (FR-4.1/4.2) | 4 | 4 | 5 | 5 | **P1** | Unique, light to build, heavy strategic payoff |
| Goal drift detection (FR-3.4) | 4 | 4 | 4 | 4 | **P1** | Simple recency query, outsized perceived intelligence |
| Tasks + goal progress (FR-3.3) | 4 | 4 | 4 | 3 | **P1** | Must not embarrass vs. Todoist; keep minimal |
| Why-Engine (causal tracing UI) | 3 | 2 | 4 | 5 | **P2** | Edge provenance (P0 schema) makes it possible later |
| Reality Graph (belief/evidence/outcome) | 3 | 2 | 4 | 5 | **P2** | Decision nodes are the on-ramp |
| Opportunity detection engine | 4 | 1 | 5 | 5 | **P2** | Needs months of user data to avoid horoscope-quality output |
| Specialized agents (Research, Trading…) | 4 | 1 | 4 | 4 | **P2/P3** | Agent *architecture* seams reserved in doc 09 |
| Digital twin | 4 | 1 | 5 | 5 | **P3** | Emerges from the corpus; not buildable before it exists |
| Ambient/proactive notifications | 3 | 3 | 3 | 3 | **P2** | Brief is the only proactive channel in v1 — by design |

## Tier 4 — Customization & delight

| Feature | V | C | S | D | Verdict | Notes |
|---|---|---|---|---|---|---|
| 3 shipped themes (FR-6.1) | 4 | 4 | 3 | 4 | **P1** | Token-driven from day 1 (doc 11), so cheap |
| Node style overrides (FR-6.2) | 3 | 4 | 2 | 3 | **P1** | |
| Physics/animation tuning | 2 | 3 | 1 | 3 | **P2** | |
| Custom theme builder + sharing | 2 | 2 | 3 | 4 | **P2** | Community play; premature before community exists |
| Signature motion system (doc 11) | 4 | 3 | 3 | 5 | **P0** | The awe budget lives here, not in feature count |

## Tier 5 — Data & platform

| Feature | V | C | S | D | Verdict | Notes |
|---|---|---|---|---|---|---|
| Passkey auth (FR-7.1) | 4 | 4 | 2 | 3 | **P0** | |
| Full export (FR-7.2) | 4 | 5 | 4 | 3 | **P0** | Trust feature; costs a day, buys the migration story |
| AI provenance + undo (FR-7.3) | 5 | 4 | 4 | 4 | **P0** | Trust is what permits auto-accept later |
| AI audit log (FR-7.4) | 3 | 4 | 3 | 3 | **P1** | |
| Obsidian/Notion importers (FR-1.5) | 5 | 3 | 5 | 3 | **P1-early** | Beachhead weapon (doc 03); first post-MVP item |
| Mobile-web capture + brief | 4 | 3 | 4 | 2 | **P1** | Capture must be everywhere; canvas needn't be |
| Email/extension capture (FR-1.6) | 3 | 3 | 3 | 2 | **P2** | |
| Public API / plugin platform | 2 | 1 | 4 | 2 | **P3** | Platform after product |
| Collaboration/sharing | 1 | 1 | 3 | 2 | **P3** | Anti-persona 4 (doc 04) |

---

## The hard cut lines (co-founder reasoning)

**3D is IN for v1 — founder decision — and we engineer against its known failure modes instead of avoiding them.**
The historical record is honest and bad: 3D graph UIs demo brilliantly and usually work terribly — occlusion, disorienting navigation, illegible labels, and imprecise direct manipulation. The founder's call is that the awe axis and category identity ("your mind, rendered") justify taking this risk head-on. So each failure mode gets a named, P0 mitigation rather than a hope:

| 3D failure mode | P0 mitigation |
|---|---|
| Occlusion (nodes hide nodes) | Layered/shelled layouts (worlds and clusters occupy depth bands, not a uniform ball); focus-dimming: selection fades non-neighborhood nodes to ghosts; frustum declutter |
| Label legibility | Billboarded SDF text always facing camera, distance-tiered (full title → truncated → dot); never texture-mapped text |
| Navigation disorientation | Choreographed camera (search-and-fly, double-click-to-frame, one-key Home reset); soft camera constraints (no roll, clamped pitch); persistent spatial layout so the brain "looks the same tomorrow" |
| Imprecise manipulation (drag-link, multi-select) | Raycast picking with generous hit volumes; drag constrained to camera-parallel plane; **flat-view mode** — a constrained top-down camera for precision sessions and accessibility (also the reduced-motion/low-GPU fallback) |
| Performance | Instanced meshes for nodes, GPU line batching for edges, LOD + cluster proxies past ~1k visible; WebGL2 baseline, WebGPU opportunistic |

**Tripwire:** the Phase-A spike (doc 13) builds exactly this risk list at toy scale and usability-tests it on non-founders. If flat-view usage dominates free-3D usage in beta by a wide margin, we let data renegotiate how much of the product defaults to 3D — the substrate stays either way.

**Agents are cut from v1 — but the pipeline IS an agent.**
The capture-structuring pipeline, connection suggester, and brief generator are, architecturally, three specialized agents reading and writing graph entities (doc 09 formalizes this). Shipping them as invisible infrastructure first means the later "Agents" feature is an *exposure* of proven machinery, not new machinery. Naming/UI for agents waits until there's something trustworthy to name.

**Opportunity detection and digital twin are cut because they're data-hungry, not because they're hard to start.**
A leverage engine running on 40 nodes produces fortune-cookie output and torches trust (the horoscope problem). These features switch on when median corpus size supports them. What we *do* now: make the schema record everything they'll need (edge provenance, interaction events, outcomes) so day-1 users retroactively benefit.

**The brief ships at v1.0, not in the MVP demo — and this is the most debatable call in the document.**
Arguments for P0: it's the retention engine. Arguments for P1: a brief over a week-old graph is thin, and a bad brief is worse than none (Journey 2 failure mode). Resolution: MVP beta cohort gets connection-suggestions + drift flags (deterministic, safe); the generated brief turns on mid-beta once real corpora exist to tune against. If beta retention sags without it, we accelerate.

## Dependency spine

```
Schema/typed entities (08)
  → Capture + AI structuring (FR-1.1/1.2)      → Importers (FR-1.5)
  → Embeddings (FR-5.1)                         → Ask-my-brain (FR-5.2)
      → Connection suggestions (FR-5.3)         → Daily brief (FR-5.4)
Canvas (FR-2.1/2.2/2.4)
  → Vitality (FR-2.3) → Layouts (FR-2.7) → Worlds (FR-2.6)
Goals (FR-3.1/3.2) → Tasks (FR-3.3) → Drift (FR-3.4) → Decisions (FR-4.x)
```

Nothing in P0 depends on anything in P1/P2. Verified against doc 12.

## Open questions

- **OQ-F1:** Rendering stack within the 3D decision: react-three-fiber + drei (ergonomics, ecosystem) vs. hand-rolled Three.js scene management (control, bundle size) — plus force-layout engine choice (d3-force-3d on worker vs. GPU-computed). Answer via the Phase-A technical spike (doc 13) at the 1k-node/60fps-with-bloom bar — this is the largest technical unknown in P0.
- **OQ-F2:** React Flow is dropped from the canvas path (it is a 2D DOM/SVG library). Decide in Phase A whether it still earns a place for auxiliary diagram views (e.g., decision trees in the context panel) or is removed from the stack entirely.
