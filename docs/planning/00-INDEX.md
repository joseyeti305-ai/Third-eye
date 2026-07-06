# NeuronOS — Phase 1 Planning Documents

**Status:** Planning phase. No application code exists or will be written until the explicit instruction "Begin Build Phase" is given.

**Project codename:** Third-eye · **Product name:** NeuronOS

## Reading order

| # | Document | Answers |
|---|----------|---------|
| 01 | [Product Vision](01-product-vision.md) | Why does this exist? What is the 10-year picture? |
| 02 | [Product Requirements Document](02-prd.md) | What are we building, for whom, and how do we measure success? |
| 03 | [Competitive Analysis](03-competitive-analysis.md) | Who else is in this space and where is our wedge? |
| 04 | [User Personas](04-user-personas.md) | Who exactly are we building for first? |
| 05 | [User Journeys](05-user-journeys.md) | What does a user actually do, minute by minute? |
| 06 | [Feature Hierarchy](06-feature-hierarchy.md) | Every feature, organized, prioritized, and honestly scored |
| 07 | [Information Architecture](07-information-architecture.md) | How is the product's conceptual model structured? |
| 08 | [Database Architecture](08-database-architecture.md) | How is the graph persisted, queried, and scaled? |
| 09 | [AI Architecture](09-ai-architecture.md) | How does the intelligence layer actually work? |
| 10 | [Security Architecture](10-security-architecture.md) | How do we protect the most personal dataset a user will ever create? |
| 11 | [Design System](11-design-system.md) | How does it look, feel, and move? |
| 12 | [MVP Scope Definition](12-mvp-scope.md) | The smallest product that produces the "holy shit" moment |
| 13 | [Development Roadmap](13-development-roadmap.md) | Phased path from empty repo to shipped product |

## How these documents relate

- **Vision (01)** sets the destination. **PRD (02)** sets the first milestone.
- **Competitive Analysis (03)** and **Personas (04)** justify the wedge chosen in the PRD.
- **Journeys (05)** and **Feature Hierarchy (06)** translate the wedge into concrete behavior; every feature is scored against value, complexity, strategy, and differentiation.
- **IA (07) → Database (08) → AI (09)** follow the rule: conceptual model before storage, storage before intelligence.
- **MVP Scope (12)** is the binding contract for the build phase. When a conflict arises between any other document and 12, **12 wins** until it is explicitly revised.
- **Roadmap (13)** sequences everything.

## Standing decisions (apply to all documents)

1. **The graph is the workspace, not a visualization.** Every design decision is tested against this.
2. **The canvas is 3D from day one (Three.js / react-three-fiber).** Founder decision. The known failure modes of 3D graph UIs (occlusion, label legibility, navigation disorientation, imprecise manipulation) are treated as first-class engineering requirements with named mitigations — see 06, 11, and 12 — and a constrained-camera "flat view" exists as an accessibility/fallback mode, not as the product.
3. **Cloud-first on Supabase, with an explicit path to local-first sync later.** Rationale in 08.
4. **AI structures, connects, and briefs in the MVP. Agents, digital twin, and opportunity detection come later.** Rationale in 09 and 12.
5. **Node/edge type system is fixed-plus-extensible from day one** — we never migrate away from a "notes only" schema because we never build one.

## Document conventions

- Every document ends with **Decisions**, **Risks**, and **Open Questions** where applicable.
- "MVP" always refers to the scope frozen in document 12.
- Requirement IDs (e.g. `FR-3.2`) are defined in the PRD and referenced elsewhere.
