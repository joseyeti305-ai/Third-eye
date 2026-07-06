# 01 — Product Vision Document

## One sentence

**NeuronOS is a personal intelligence operating system: a living knowledge graph where an AI layer helps you remember, think, decide, and execute — organized around your goals, not your files.**

## The problem

Modern knowledge tools solve *storage*, not *intelligence*:

- **Note apps** (Notion, Obsidian, Apple Notes) are write-mostly graveyards. Retrieval is manual, synthesis is manual, and nothing connects notes to outcomes. The median note is never read again.
- **Task managers** (Todoist, Linear, Things) track execution but are amnesiac about *why* a task exists and what knowledge informed it.
- **AI chat** (ChatGPT, Claude) is brilliant in the moment but structurally forgetful; every conversation starts from near-zero personal context, and its output evaporates when the tab closes.

The result: people's knowledge, goals, decisions, and actions live in four disconnected silos. The compounding value of a lifetime of thinking is lost.

## The insight

Three shifts make a new category possible now:

1. **LLMs can structure unstructured input.** For the first time, "just write / talk / paste" can produce typed entities and relationships automatically. The historical failure of graph tools — that manual linking is too much work — is solvable.
2. **Embeddings make personal semantic memory cheap.** pgvector-class infra means every thought a user has ever recorded is retrievable by meaning, not keyword, at consumer price points.
3. **People now expect AI to *act*, not just answer.** The bar has moved from "search my notes" to "brief me, connect this, tell me what matters."

## The vision (10-year picture)

A person opens NeuronOS each morning and sees **their own mind, rendered**: goals at the center, live projects glowing around them, this week's decisions and conversations orbiting, stale ideas fading at the edges. The system has already read everything they captured yesterday, connected it, and prepared a brief: *what changed, what matters, what to do, what opportunity just became visible.*

Over years, the graph becomes the user's **externalized cognition**:

- **Memory:** everything captured, typed, linked, and retrievable by meaning.
- **Thinking:** the graph surfaces non-obvious connections between distant nodes.
- **Deciding:** decisions are first-class records with assumptions and outcomes; the system learns the user's decision patterns and warns against repeating past mistakes.
- **Executing:** every task traces back through projects to goals; drift from stated priorities is visible, not hidden.
- **Leverage:** the system spots combinations — skills × relationships × market context — the user cannot see because the relevant nodes live in different "worlds" of their life.

The endgame is a **digital twin**: not a chatbot imitation of the user, but a structural model of their goals, beliefs, evidence, patterns, and history that makes every AI interaction start from deep context instead of zero.

## Product principles

1. **The graph is the workspace.** Not a side-panel visualization of a document store. Creating, linking, and working happen *on the canvas*. (This is the single most important — and most contrarian — principle; see Risks.)
2. **Outcomes over notes.** Goals are the organizing gravity of the graph. A note that connects to nothing decays; the UI makes that decay visible and honest.
3. **AI is the operating layer, not a sidebar.** Capture → structure → connect → brief is the core loop, and AI runs every step of it.
4. **Earn awe, respect attention.** The product must be beautiful enough to produce a first-open "whoa," and quiet enough that it interrupts only when the insight is worth it. Ambient, not needy.
5. **The user owns their mind.** Full export at all times, transparent AI actions (every AI-created node/edge is marked and reversible), and a security posture appropriate for the most sensitive dataset a person will ever create.
6. **Alive by default.** The graph visibly evolves — frequently touched nodes grow and brighten; neglected ones fade and drift. The interface reflects the user's actual behavior, not their aspirational filing system.

## What NeuronOS is NOT

- Not a note-taking app with a graph view bolted on.
- Not a team wiki or collaboration suite (single-player first; sharing comes much later).
- Not a general AI chatbot with persistence bolted on.
- Not a productivity methodology (no forced GTD/PARA/Zettelkasten dogma — the graph adapts to the user).
- Not a plugin platform at launch. Extensibility is a phase-3+ concern; a platform with no product is nothing.

## Why we win

| Moat | Mechanism |
|---|---|
| **Data gravity** | Every day of use makes the user's graph more valuable and switching more costly. A 2-year-old NeuronOS graph is irreplaceable. |
| **Compounding context** | AI quality scales with accumulated personal context. Competitors starting from generic RAG-over-notes cannot match briefings grounded in typed goals, decisions, and outcomes. |
| **Category position** | "Personal Intelligence OS" is an empty category. Obsidian owns "linked notes," Notion owns "workspace," ChatGPT owns "assistant." Nobody owns "your externalized mind." |
| **Taste** | Sci-fi-grade visual quality is a real differentiator in a market of gray productivity tools — and it is hard to retrofit. |

## Honest risks to this vision (co-founder view)

1. **The graph-as-workspace bet is unproven.** Obsidian's graph is beloved in screenshots and rarely used for actual work; most users live in the editor. Our counter-thesis is that Obsidian's graph fails because it is *read-only and untyped* — it visualizes files rather than being the place work happens. If typed nodes + AI auto-linking + on-canvas editing don't change that behavior, we must be willing to pivot the graph from "primary surface" to "primary *navigation* surface" with a strong focused-editing mode. The MVP is designed to test exactly this (see doc 12).
2. **Awe decays; utility retains.** A gorgeous first-run means nothing if week 4 retention depends on the daily brief being genuinely useful. Beauty gets the demo; the memory-and-brief loop gets the retention. We invest in both, in that order of *marketing* but the reverse order of *engineering*.
3. **The empty-graph cold start.** A living brain with 3 nodes is a dead brain. Onboarding must produce a meaningful graph in the first 10 minutes (guided goal setup + import + AI structuring), or the core promise is invisible.
4. **Scope gravity.** This vision names ~12 major systems. Companies die building all of them at 20% depth. The MVP scope (doc 12) is deliberately brutal.

## North-star metric

**Weekly Insight Actions:** the number of times per week a user acts on something NeuronOS surfaced (opens a brief item, accepts a suggested connection, completes a goal-linked task, follows up on a surfaced opportunity). This measures the whole loop — capture → intelligence → action — not vanity usage.

Supporting metrics: D30 retention, nodes created per week (capture health), % of nodes connected to a goal (graph coherence), brief open rate.

## Decisions

- **D-V1:** Product organizes around goals/outcomes, not documents. Irreversible by design — the schema, IA, and AI layer all assume it.
- **D-V2:** Single-player product for at least the first year. Collaboration is a distraction until the personal loop retains.
- **D-V3:** The MVP exists to validate one thing: *does an AI-structured, goal-anchored graph change user behavior where passive note graphs failed?*

## Open questions

- **OQ-V1:** Is the first wedge "second brain power users" (small, high willingness-to-pay, evangelists) or "ambitious professionals who never adopted a second brain" (huge, but cold-start-sensitive)? Personas doc (04) takes a position: power users first, as beachhead.
- **OQ-V2:** Pricing philosophy — AI costs are per-user and real; freemium must be designed around AI-metering from day one, not bolted on. Flagged for PRD.
