# 07 — Information Architecture

This document defines the *conceptual model*: the entities users think in, the relationships between them, and the surfaces through which they're reached. Doc 08 maps this model to storage; doc 11 maps it to visuals.

## 1. The primitive: everything is a node or an edge

There are exactly two first-class primitives. No folders, no pages, no databases, no separate "task list" data structure. Anything that looks like a list or a panel is a *view over the graph*.

### 1.1 Node

Every node shares a common core, regardless of type:

| Aspect | Meaning |
|---|---|
| Identity | Stable ID, type, title |
| Content | Body (rich text/Markdown), type-specific structured fields |
| Vitality | Derived score from recency × interaction frequency × connectivity — drives visual weight (FR-2.3) |
| Provenance | `created_by`: user / ai / import — never ambiguous (FR-7.3) |
| Membership | Zero or more worlds |
| Memory | Embedding(s) for semantic retrieval (invisible to user) |

### 1.2 Node types (v1 vocabulary)

A fixed, curated vocabulary at launch. **Deliberate constraint:** user-defined types are P2. Rationale: the AI structurer must classify reliably into a known set; a folksonomy of user types would wreck classification precision and cross-user learning. The set was chosen so that everything in the vision maps onto it:

| Type | Role | Type-specific fields (conceptual) |
|---|---|---|
| **Goal** | Organizing gravity; outcomes | why, target date, status, progress |
| **Project** | Bounded effort serving goals | status, timeframe |
| **Task** | Atomic executable | status, due, effort |
| **Note** | Free-form knowledge | — |
| **Idea** | Speculative thought; may promote to Project/Task | maturity |
| **Decision** | Choice record | context, options, assumptions, choice, review date, outcome |
| **Person** | Human in the user's world | relationship context, contact hints |
| **Organization** | Company/institution | kind (employer, client, target…) |
| **Source** | External material (book, article, video, paper) | url/ref, author, status (to-read/read) |
| **Conversation** | Saved ask-my-brain sessions; imported meeting notes | participants, date |
| **Event** | Time-anchored occurrence | when, where |
| **Insight** | Distilled realization — often AI-proposed, user-ratified | confidence |

Reserved for later phases (schema-aware now, UI later): **Belief**, **Evidence**, **Outcome** (Reality Graph, FR-4.3), **Agent**, **Opportunity**. They cost nothing to reserve and save a migration.

*Type promotion* is a first-class operation (Idea → Project, Note → Decision): the node keeps its ID, history, and edges — only its type and fields change. This matters because real thought matures; tools that make you "re-create as task" lose the lineage.

### 1.3 Edge

Edges are typed, directional (with symmetric types where sensible), and carry:

| Aspect | Meaning |
|---|---|
| Type | From the edge vocabulary below |
| Strength | 0–1, evolves: reinforced by co-activation (user traverses/works both ends), decays with neglect — the substance behind "relationships have strength" |
| Provenance | user / ai-suggested-accepted / ai-auto / import |
| Note | Optional human/AI annotation ("supports because: exam fee") |

### 1.4 Edge types (v1 vocabulary)

Kept small — every added edge type taxes both the user's comprehension and the classifier's precision:

| Type | Direction | Example |
|---|---|---|
| `relates_to` | symmetric | Default association; what AI suggestions usually propose |
| `supports` | A → B | Task supports Goal; Evidence supports Decision |
| `blocks` | A → B | Task blocks Task; risk blocks Goal |
| `informs` | A → B | Source informs Decision; Note informs Project |
| `part_of` | A → B | Task part_of Project; Project part_of Goal |
| `about` | A → B | Note about Person; Conversation about Project |
| `led_to` | A → B | Causality — the Why-Engine's raw material (FR-4.3) accumulating from day 1 |
| `contradicts` | symmetric | Evidence contradicts assumption; note contradicts note |

## 2. Worlds

A **World** is a named lens over the graph, not a container. Formally: a labeled subset of nodes.

- A node may belong to **multiple worlds** (a Person can live in Business *and* Life).
- Cross-world edges always exist; they render dimmed by default and fully on demand — cross-domain leverage is a core promise, so worlds must organize without severing.
- v1 ships with suggested worlds (Life, Business, Learning — matching Persona 1's tracks) but they're user-defined labels, not hardcoded.
- AI assigns world membership at capture time (part of FR-1.2 structuring); user corrects.
- **The Home view is "All Worlds"** — the whole brain, with world tint-coding. Worlds filter; they are not "vaults."

## 3. Derived structures (views, never storage)

| View | What it is | Serves |
|---|---|---|
| **Goal neighborhood** | A goal + its transitive support structure (`supports`/`part_of`/`blocks` closure, depth-limited) | FR-3.2, Journey 4 |
| **Review queue** | Pending AI suggestions (nodes, edges, world assignments) | FR-5.3, Journey 3 |
| **Brief** | Generated daily document; itself saved as a Conversation-type node (briefs are part of the graph's memory) | FR-5.4 |
| **Task list** | All open Tasks, groupable by goal/due — a *projection*, so it can't drift from the graph | FR-3.3 |
| **Timeline** | Nodes by creation/event date | FR-2.7 |

## 4. Application surfaces & navigation

```
┌─────────────────────────────────────────────────────────────┐
│ Command bar (⌘K): search · capture · navigate · actions      │
├──────────┬──────────────────────────────────────┬───────────┤
│ Rail     │                                      │ Context   │
│ · Home   │            THE CANVAS                │ panel     │
│ · Worlds │   (the primary surface, ~always      │ (selected │
│ · Goals  │    visible; all else overlays it)    │  node:    │
│ · Brief  │                                      │  content, │
│ · Queue  │                                      │  edges,   │
│ · Chat   │                                      │  history) │
└──────────┴──────────────────────────────────────┴───────────┘
```

Navigation principles:

1. **One primary surface.** The canvas is always the ground; lists, brief, chat, and queue open as panels/overlays over it, never as separate "apps." Leaving the canvas should feel like blinking, not navigating.
2. **⌘K is the spine.** Every action reachable from the command bar; the mouse is optional (Persona 1) and the canvas is skippable (NFR-6 accessibility: every graph operation has a list/keyboard equivalent through the command bar and context panel).
3. **Focus mode** (FR-2.8) is a canvas state (zoomed-to-one-node with editor affordances), not a separate route — reinforcing that documents live *in* the graph.
4. **Ask-my-brain citations navigate.** Chat panel answers cite nodes; clicking flies the camera (FR-5.2). Navigation and intelligence are the same system.
5. **Mobile web** exposes exactly: capture bar, brief, search, node reader. No canvas. (D-P1.)

## 5. Naming (user-facing vocabulary)

| Internal | User-facing | Rejected alternatives |
|---|---|---|
| Graph/canvas | **your Brain** | "graph" (technical), "map" (static) |
| Node | **thought** (generic) or its type name ("goal", "note") | "node" (cold) — but power users will say node; fine |
| Edge | **connection** | "link" (webby), "relationship" (long) |
| Vitality | **energy** | "score" (gamified feel) |
| Review queue | **Inbox** | "queue" (mechanical) |

## Decisions

- **D-IA1:** Two primitives only; every list/panel is a projection of the graph. Prevents the app from silently becoming a normal notes app with a graph tab.
- **D-IA2:** Fixed type vocabulary at launch; reserved types pre-declared; promotion preserves identity.
- **D-IA3:** Worlds are labels/lenses, not containers. No hierarchy of folders anywhere in the product.
- **D-IA4:** Single-surface architecture — canvas as ground, everything else overlays.
- **D-IA5:** Edge strength and `led_to` causality are recorded from day 1 even though no v1 feature fully exploits them — they are the raw material for Why-Engine, Reality Graph, and opportunity detection (cheap now, impossible to backfill later).

## Risks

- **R-IA1:** Type vocabulary too rigid for real users → mitigation: `Note` is a safe catch-all; promotion is cheap; add types based on observed misclassification clusters, not requests.
- **R-IA2:** Single-surface may frustrate users who want a "documents list" home → mitigation: rail views exist; watch beta behavior (ties to the doc-12 pivot tripwire).

## Open questions

- **OQ-IA1:** Should Task completion archive the node visually (fade to a "done" layer) or keep it as permanent graph history at reduced vitality? Leaning permanent-but-faded (memory is the product); test in beta.
