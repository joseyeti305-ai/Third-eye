# 05 — User Journeys

All journeys are written for Persona 1 ("Marcus", doc 04). Each journey names the emotional beat it must land, the requirements it exercises (PRD IDs), and its failure mode. These are the scripts the MVP is validated against — if a journey can't be walked in the shipped product, the MVP is not done.

---

## Journey 1 — First Contact: "The graph is born" (minute 0 → 10)

**Beat to land: awe, then ownership.** The cold-start killer (Risk in doc 01/02).

1. **Sign up** with a passkey — one gesture, no password ceremony. *(FR-7.1)*
2. **The void:** a dark canvas with a single pulsing node: *You*. One input line: *"What are you working toward right now?"* No dashboard, no template gallery, no 12-step tour.
3. Marcus types: *"Building my consulting business, getting OSCP certified, fixing my sleep."*
4. **The birth moment:** the AI structures this live — three Goal nodes bloom out of *You* with animated edges, each asking one smart follow-up ("OSCP — target date?"). The graph is *moving* within 60 seconds of signup. *(FR-1.2, FR-3.1)*
5. **Seeding:** "Tell me more about any of these — or paste anything: notes, a plan, a braindump." Marcus pastes a messy planning note. It explodes into ~10 typed nodes (tasks, ideas, a person, a decision-candidate) pre-wired to the right goals, shown as a *proposal* he confirms with one click. *(FR-1.2, FR-1.3, FR-5.3)*
6. **First ask:** prompt suggests "ask your brain something." He asks "what should I focus on this week?" — answer cites his own nodes; clicking a citation flies the camera to it. *(FR-5.2, FR-2.5)*
7. **Exit state:** ≥ 1 goal, ≥ 15 nodes, ≥ 60% connected — the activation bar (PRD §3). The graph already looks like *his mind*, not a template.

**Failure mode:** any step that asks Marcus to file, tag, choose a folder, or watch a tutorial. If step 4 latency exceeds ~10s of dead air, the magic dies — stream the structuring visually (nodes appear as they're parsed).

---

## Journey 2 — Daily loop: "Two minutes in the morning" (day 5, steady state)

**Beat: trust — it was thinking while I slept.**

1. Opens NeuronOS with coffee. The canvas greets with subtle overnight diffs: two nodes glow "new connections suggested."
2. **The brief** *(FR-5.4)*: what changed yesterday · "OSCP: nothing new in 6 days" drift flag *(FR-3.4)* · decision review due *(FR-4.2)* · one insight: "Your note on client onboarding friction relates to the churn idea from March — consider linking." 90 seconds to read.
3. He accepts the suggested connection (one click — edge animates in) and dismisses the second suggestion (system learns). *(FR-5.3)*
4. From the drift flag, he opens the OSCP goal neighborhood, adds a task for tonight. *(FR-3.2, FR-3.3)*
5. Closes tab. Total: < 5 minutes. **Two Insight Actions logged** (north-star metric).

**Failure mode:** a mediocre brief. One generic or wrong insight teaches him to skip it forever. Empty-over-mediocre rule (FR-5.4) exists for this journey.

---

## Journey 3 — Capture under fire: "Thought at a red light" (any day)

**Beat: zero-friction trust — nothing is ever lost.**

1. Mid-task (or on phone), Marcus has a thought: *"Ping Sarah about the pentest referral — could fund the OSCP exam fee."*
2. Hotkey (or mobile web capture bar) → types it raw → enter → back to work. **≤ 3 seconds.** *(FR-1.1, NFR-7)*
3. Async, the pipeline: creates Task "Ping Sarah re: pentest referral," links to existing Person node *Sarah*, links `supports` → Goal *OSCP* (exam fee reasoning captured in the edge note). *(FR-1.2, FR-5.1)*
4. Next canvas visit, the new node pulses once in the review queue; he glances, accepts. Later, auto-accept mode makes even that glance optional.

**Failure mode:** capture requiring *any* decision at capture time (type? world? goal?). The user's job is emptying their head; classification is our job.

---

## Journey 4 — Thinking session: "Work happens on the canvas" (week 2+)

**Beat: the graph is a workspace, not a chart.** This journey is the direct test of the product's riskiest thesis (D-V3).

1. Saturday deep-work. Marcus opens the Business world *(FR-2.6)*, switches to goal-centric orbital layout — the consulting goal at center, everything orbiting in 3D by relevance; he orbits the camera around the structure to read it. *(FR-2.7)*
2. He spots visual truth: the "content marketing" cluster is bright and dense; the "referral pipeline" cluster is faded and thin — despite referrals being his stated priority. The vitality system just told him something his task list never would. *(FR-2.3)*
3. He works *on the canvas*: drags an idea node onto the referral cluster (drag moves on the camera-parallel plane — no z-fumbling), creates three task nodes by double-click, links them, opens one node in the focus panel to write a paragraph of plan. For a burst of precise rearranging he taps into flat view, then returns to full 3D. *(FR-2.2, FR-2.8, FR-2.1)*
4. He asks-my-brain: "everything I know about how I've gotten clients before" — the answer assembles nodes from two worlds; he pins the useful ones into view and links two of them to the referral goal. *(FR-5.2)*
5. Session ends with the conversation itself saved as a node, linked where it happened.

**Failure mode:** if he instinctively hunts for a documents list and treats the canvas as a report, the thesis is failing — this is measurable (PRD §3, graph interaction share) and triggers the doc-12 pivot plan, not denial.

---

## Journey 5 — Decision with a memory: "The review" (week 4+)

**Beat: NeuronOS closes loops other tools never open.**

1. Weeks ago Marcus logged a Decision node: *"Take the low-budget client at a discount?"* — options, assumptions ("will lead to referrals"), chosen: yes, review in 30 days. *(FR-4.1)*
2. The brief prompts the review on day 30. *(FR-4.2)*
3. He logs the outcome: client was fine, referral assumption **false**. Lesson recorded on the node; the assumption edge is marked contradicted.
4. Months later, facing a similar discount decision, ask-my-brain surfaces this record *with the outcome*. Past-Marcus advises present-Marcus. *(FR-5.1, FR-5.2)*

**Failure mode:** decision logging feels like paperwork. The Decision node form must be 4 fields and 60 seconds, AI-prefilled from context wherever possible; full Reality-Graph structure stays deferred (FR-4.3) so v1 stays light.

---

## Journey 6 — The escape hatch: "I just need to write" (any time)

**Beat: canvas-first never means canvas-only.**

1. Marcus needs to draft a long proposal. He opens the node in **focus mode** — full-width editor, graph reduced to a neighborhood mini-map. *(FR-2.8)*
2. Writes for an hour. Mentions of existing entities get quiet inline link suggestions; no popups.
3. Done → zooms back out; the document is one (bright, grown) node among many.

**Failure mode:** making long-form writing fight the canvas. If we force it, users leave for real editors and take the rest of their life with them.

---

## Journey map summary

| Journey | Validates | Primary metrics | MVP-blocking? |
|---|---|---|---|
| 1 First contact | Cold-start solution, awe | Activation rate | **Yes** |
| 2 Daily loop | Intelligence value | Brief open rate, Insight Actions | Yes (brief is P1; suggestions P0) |
| 3 Capture | Frictionless input | Capture latency, captures/week | **Yes** |
| 4 Thinking session | Graph-as-workspace thesis | Canvas interaction share | **Yes** |
| 5 Decision review | Outcome loop | Decisions logged, reviews completed | No (v1.0, not MVP) |
| 6 Escape hatch | Long-form coexistence | Focus-mode usage without churn | No (v1.0) |

## Open questions

- **OQ-J1:** Journey 1 step 4 requires streaming AI structuring with live canvas animation — technically the hardest single moment in the product. Needs an early spike (roadmap, doc 13) to confirm feasibility of the ≤ 10s perceived-latency bar.
- **OQ-J2:** Does the review queue (Journey 3 step 4) become nagging at scale? Beta-test batch-review vs. inline-pulse patterns.
