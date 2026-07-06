# 12 — MVP Scope Definition

**This document is the binding cut-line.** Where any other document disagrees, this one wins until explicitly revised (index rule). Nothing here is built until the founder says **"Begin Build Phase."**

## 1. The "holy shit" moment, defined precisely

The MVP exists to manufacture one experience:

> **Within 10 minutes of signup, a new user watches their messy, unstructured brain-dump become a living 3D mind — typed, connected, goal-anchored, and queryable — without doing any organizing work themselves. Within 2 weeks, that mind tells them something useful they didn't ask for.**

Two beats: **the birth** (Journey 1) and **the first unprompted insight** (connection suggestion or drift flag that lands). Everything in scope serves one of those two beats. Everything else is out.

## 2. The hypothesis being tested (D-V3, restated)

*An AI-structured, goal-anchored, alive 3D graph changes user behavior where passive note graphs failed.* Falsifiable via PRD §3 metrics: activation ≥ 60%, canvas interaction share ≥ 50%, suggestion acceptance ≥ 40%, D30 ≥ 35%.

## 3. IN (the complete MVP feature list)

**Capture & intelligence**
- Quick capture, ≤ 3s (FR-1.1)
- AI structuring with streaming preview + Inbox review queue (FR-1.2, FR-5.3)
- Embeddings + hybrid retrieval (FR-5.1)
- Ask-my-brain with camera-flying node citations; conversations saved as nodes (FR-5.2)
- Connection suggestions, precision-tuned, max ~7 pending (FR-5.3)
- Drift flags — deterministic goal-staleness signal (FR-3.4 scoped down: a badge, not a brief)

**Canvas (3D)**
- Infinite 3D canvas: orbit/dolly/fly, instanced rendering, LOD, 60fps @ 1k visible (FR-2.1)
- Flat-view constrained camera mode (precision/accessibility/low-GPU)
- On-canvas CRUD + plane-constrained drag-linking + undo (FR-2.2)
- Node vitality: grow/brighten/fade/drift, deterministic (FR-2.3)
- Typed node/edge visual language per doc 11 (FR-2.4)
- Search-and-fly (FR-2.5)
- Node editor in context panel (fields + rich body); **no separate focus mode yet**

**Structure**
- Full node/edge type vocabulary in schema (doc 07); UI creation surfaces: Goal, Project, Task, Note, Idea, Person, Decision (others arrive via AI structuring only)
- Goals + goal anchoring + goal neighborhood view (FR-3.1/3.2)
- Worlds as labels with AI assignment — **single "galaxy" view; world filter, not world switcher UI** (FR-2.6 scoped down)

**Platform**
- Passkey + magic-link auth (FR-7.1)
- Full export (FR-7.2)
- AI provenance marks + per-action undo (FR-7.3)
- One theme: **Neural** (token architecture in place; other themes are token files, deferred)
- Onboarding: the Journey-1 script, exactly

## 4. OUT (explicitly, with the reason)

| Cut | Why | Returns |
|---|---|---|
| Daily brief (generated) | Needs weeks of corpus to be good; bad brief = trust damage (Journey 2 failure mode). Drift flags + Inbox carry the "unprompted insight" beat in MVP | v1.0, mid-beta |
| Focus mode editor (FR-2.8) | Real, but the hypothesis is about the canvas; context-panel editor suffices for MVP-length content | v1.0 |
| Tasks as full system (FR-3.3) | Task *nodes* exist with status; no due-date views, no list tooling | v1.0 |
| Decision review loop (FR-4.2) | Decision nodes exist (typed capture); the 30-day review prompt needs the brief channel | v1.0 |
| Importers (FR-1.5) | Beachhead weapon but big surface (parsing, mapping, dedupe); MVP cohort seeds by pasting | v1.0-early, first item |
| Voice, mobile-web capture | Pipeline reuse, but each is real UI/QA surface | v1.0 |
| Themes 2–3, style overrides | Token architecture makes them cheap *later*; zero hypothesis value now | v1.0 |
| Layout modes (orbital, timeline) | Force layout + goal neighborhood view covers the need | v1.0+ |
| Brief email delivery, notifications | No proactive channels until the brief exists | v1.0+ |
| Agents-as-feature, twin, opportunities, Why-Engine UI, Reality Graph, marketplace, collaboration, API, native apps | Per docs 06/07: architecture seams + schema reserved; product later | P2/P3 |

**Discipline note:** the MVP has **zero** proactive outbound surface (no emails, no notifications). The product must earn attention *inside* the session first. This is the single biggest simplification and it is intentional.

## 5. MVP quality bars (non-negotiable even at MVP)

- The Journey-1 birth animation works, streams, and lands in ≤ 10s perceived latency (OQ-J1).
- 60fps @ 1k visible nodes on a 2022 MacBook Air (the founder's-audience floor machine).
- Zero data loss: optimistic UI + durable write journal from the first build week (NFR-3) — not retrofitted.
- RLS suite + injection canaries green from the first deploy (docs 09/10 gates).
- Structurer acceptance ≥ 40% on the golden set before any external user touches it.

## 6. MVP audience & success protocol

- **Cohort:** founder dogfood (weeks 1–n), then 15–25 hand-recruited Persona-1 users (the interview pool from OQ-C1/R-PE1).
- **Instrumented from day 1:** the PRD §3 metric set, plus flat-view-vs-3D usage ratio (the doc-06 tripwire).
- **Decision gates after 4 weeks of beta:**
  - Activation < 40% → onboarding is broken; stop, fix Journey 1, re-run.
  - Acceptance < 25% → structuring isn't trusted; freeze features, tune pipelines.
  - Canvas share < 30% → **pivot protocol:** the graph demotes from primary workspace to primary *navigation/insight* surface; focus mode accelerates to the center of the product; the 3D canvas remains the home view, review surface, and thinking view. (Pre-committing to this now is what makes the risky thesis safe to test. The 3D substrate survives either outcome.)
  - All bars met → proceed to v1.0 scope (doc 13, Phase D).

## 7. What "MVP done" means

A new user can: sign up with a passkey → experience the birth → capture from anywhere in-app → accept/reject AI structure in the Inbox → see their brain live, breathing, goal-anchored, in 3D at 60fps → ask it questions and fly to cited nodes → watch neglected goals dim and flagged → export everything → trust that nothing was ever changed silently. Nothing more.

## Decisions

- **D-MVP1:** The brief is out of MVP; drift flags + suggestions carry the insight beat.
- **D-MVP2:** No proactive outbound channels in MVP.
- **D-MVP3:** The pivot protocol (§6) is pre-committed — metrics, thresholds, and the pivot shape are agreed *before* build, so the data decides, not sunk-cost feelings.
- **D-MVP4:** One theme, one layout, one language (English) at MVP.

## Open questions

- **OQ-MVP1:** Beta gating — invite codes vs. open-with-quota. Leaning invite codes (cohort quality, cost control, scarcity narrative). Decide at Phase C start.
