# 04 — User Personas

## Targeting strategy

v1 targets **one primary persona** hard, with a secondary persona kept in view for message-testing. Products in this category die from persona sprawl ("it's for everyone who thinks!"). The build order, defaults, and onboarding are tuned for Persona 1 exclusively.

Answering OQ-V1 from the vision doc: **we open with the power-user beachhead (P1), not the mass ambitious-professional market (P2).** P1 has existing intent, exportable data, evangelism habits, and tolerance for v1 rough edges. P2 is the year-2 expansion once AI structuring removes the effort barrier that keeps them out of these tools today.

---

## Persona 1 (PRIMARY): "Marcus" — The Systematic Ambitious

- **Profile:** 28–45, self-directed operator: indie founder / senior IC / serious trader / career-changer. Runs 3–5 concurrent life tracks (business, learning, health, finances, relationships) *deliberately*.
- **Current stack:** an Obsidian or Notion setup he built over months and half-abandoned; Todoist; ChatGPT daily; a trading journal or business dashboard in a spreadsheet.
- **Jobs to be done:**
  1. "Keep everything I learn and decide in one place that stays organized *without me maintaining it*."
  2. "Know each morning what actually matters across all my tracks."
  3. "Stop re-making decisions I already made and re-learning things I already learned."
- **Pains:** maintenance tax killed his second brain ("my vault is a graveyard"); knowledge and tasks live in different apps so goals drift silently; ChatGPT gives generic advice because it doesn't know him.
- **Gains sought:** compounding memory, cross-domain insight ("my trading discipline notes apply to my diet problem"), an advisor that has context.
- **Willingness to pay:** $15–30/mo without blinking if the daily brief is good. Already pays for ChatGPT + 2 tools.
- **Success moment:** week 3 — the brief connects a conversation node from World A to a goal in World B and he acts on it. That's when he tells his group chat.
- **Design implications:** keyboard-first everything; density and speed over hand-holding; import his vault day 1; never make him file/tag manually; dark theme default.
- **Note:** the founder of this project matches this persona (multi-track: business, trading, cybersecurity learning, personal goals). Useful for dogfooding; dangerous for generalization — validate with non-founder users constantly.

## Persona 2 (SECONDARY, year-2 wedge): "Dana" — The Overwhelmed High-Performer

- **Profile:** 30–50, director/VP or established freelancer. Ambitious but *not* a systems hobbyist — never adopted Obsidian because it looked like homework.
- **Jobs:** "Remember what was said and promised across 30 weekly conversations"; "make my scattered ambition legible"; "feel on top of it without a Sunday-night organizing ritual."
- **Pains:** capture happens (Apple Notes, email-to-self) but retrieval never does; goals exist only in her head; tool-setup effort is the absolute blocker.
- **What she needs from us that Marcus doesn't:** zero-config onboarding, mobile capture as first-class, briefs that read like a chief-of-staff wrote them, forgiving aesthetics (Minimalist theme, less HUD).
- **Why not now:** she won't tolerate v1 friction and won't migrate data herself. She arrives when structuring is invisible and mobile capture is native. Kept in view so we don't build power-user-only walls (e.g., everything must remain achievable without keyboard shortcuts — NFR-6 aligns).

## Persona 3 (VALIDATION-ONLY): "Ken" — The Tool Tourist

- Productivity-YouTube enthusiast; tries every new tool for a weekend; churns.
- **Not a target.** Listed as an *anti-persona* to guard metrics and design against: Ken inflates signups and D1, then vanishes. Ignore feedback asking for gamification, streaks, or template galleries in v1. Activation metric (PRD §3) is designed to separate Marcus from Ken.

## Persona 4 (ANTI-PERSONA): Teams & Enterprises

- Any request involving shared workspaces, permissions models, admin seats, SSO. Out of scope for ≥ 1 year (D-V2). The correct answer to enterprise inbound in year 1 is "no."

---

## Persona-driven priority checks

Every feature in doc 06 was scored asking "does Marcus need this in month 1?" Examples of how this cut:

| Feature | Marcus month-1? | Verdict |
|---|---|---|
| Obsidian import | Yes — his vault is his life | Elevated (early post-MVP) |
| Theme marketplace | No — he wants *one great* dark theme | Deferred P2 |
| Mobile capture | Partially — quick text capture yes, canvas no | Mobile = capture+brief only (D-P1) |
| Trading agent | He'd love it, but it's a separate product's worth of work | Deferred; trading world works fine with generic nodes |
| Decision nodes | Yes — traders/founders live on decisions | P1, kept in v1.0 |

## Risks

- **R-PE1: Founder-persona bias.** Building for ourselves risks over-fitting (e.g., trading features, HUD maximalism). Mitigation: 15–20 interviews with non-founder Marcus-types pre-beta (ties to OQ-C1); a standing rule that any feature only the founder wants goes to P2.
- **R-PE2: Beachhead too small.** Obsidian-refugee Marcus population may be < 100k truly reachable. Acceptable: v1 needs hundreds of retained users, not millions; P2 expansion is the volume play.

## Open questions

- **OQ-PE1:** Where do reachable Marcus-types concentrate? (Hypotheses: r/ObsidianMD, PKM Twitter/X, indie-hacker communities, trading Discords.) Needs a lightweight channel test before launch.
