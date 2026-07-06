# 11 — Design System

**Name:** *Synapse* (internal). Governs two render worlds that must feel like one product: the **3D canvas** (Three.js scene — materials, light, motion) and the **shell** (DOM UI — panels, command bar, brief). One token system drives both.

## 1. Design intent

Three words the product must evoke, in priority order: **alive → intelligent → precise.**
Reference points: Linear (discipline), Arc (playful confidence), Apple visionOS (spatial restraint), sci-fi HUDs (aesthetic *only where it carries information*). Anti-references: corporate dashboards, gamified productivity apps, and — critically — tech-demo 3D that privileges spectacle over legibility.

**The governing law: every photon carries information.** Glow means vitality. Size means importance. Proximity means relatedness. Pulse means novelty. Depth band means world/cluster. If a visual effect encodes nothing, it does not ship. This is how "futuristic" stays on the right side of "noisy," and it is the design system's enforcement arm for the awe-with-restraint principle (doc 01, principle 4).

## 2. Token architecture

Themes are **token sets, nothing else** (FR-6.1). Three layers:

1. **Primitives:** raw scales — color ramps, spacing (4px base), type scale, radii, blur/bloom intensities, easing curves, durations.
2. **Semantic tokens:** `surface.canvas`, `node.goal.core`, `node.goal.halo`, `edge.supports`, `text.primary`, `vitality.hot/warm/cool/dormant`, `accent.ai` (the AI's signature color), `feedback.success/danger`…
3. **Component tokens:** command bar, context panel, brief card, suggestion chip.

The 3D scene consumes the same semantic tokens (as uniforms/material params): a theme switch retunes *the entire universe* — background nebula, node materials, bloom strength, edge shaders — with no scene code changes. This is what makes FR-6.1/6.2 cheap and the future theme marketplace (P2) possible.

## 3. Launch themes (FR-6.1)

| | **Neural** (default) | **Minimalist** | **Dark Intelligence** |
|---|---|---|---|
| Mood | living tissue of light | paper-quiet, Dana-friendly (doc 04) | ops-room, high-contrast HUD |
| Canvas | near-black blue-violet depth fog, faint starfield | pale gray, no fog, minimal bloom | true black, sharp grid horizon |
| Nodes | soft-glow orbs, organic pulse | flat discs, hairline strokes | faceted cores, crisp rim-light |
| Edges | luminous filaments, strength = brightness | thin lines, strength = weight | vector beams, strength = intensity |
| Accent.ai | cyan | ink blue | signal green |

All three ship in light-shell and dark-shell variants for the DOM UI; the canvas itself is theme-governed. Contrast floors (WCAG AA for shell, defined luminance deltas for canvas labels) are token-level constraints — a theme that violates them fails CI.

## 4. The 3D node language (FR-2.4)

Every node = **core + halo + label**, all instanced:

- **Core:** type-coded geometry — Goal: icosahedral "star" (largest class); Project: octahedron; Task: small cube (satisfying snap on completion); Note/Idea: sphere / tetra-spark; Person: ringed sphere; Decision: bipyramid (two options made solid); Source: flat card; Conversation: twin spheres; Insight: bright shard. Distinct silhouettes at distance beat color-coding (color-blind safe by geometry).
- **Halo:** bloom shell whose radius/intensity = **vitality** (FR-2.3). Hot nodes breathe (subtle 0.1Hz scale oscillation); dormant nodes are matte, near-fogged.
- **Label:** billboarded SDF text, always camera-facing, distance-tiered (doc 06 mitigation table): full title → truncated → none (dot). Labels never overlap: priority declutter by vitality.
- **State overlays:** selection = ring + neighborhood spotlight (non-neighbors fade to ghosts — the occlusion answer); AI-suggested = `accent.ai` dashed halo until ratified (FR-7.3 made visible); completed task = brief flare, then settles dim.

**Edges:** GPU-batched curves; type → line style (supports: directional flow shimmer toward target; blocks: red-shifted, braided; part_of: thick, short-leashed; relates_to: neutral filament; led_to: comet-tail directionality). Strength → width/brightness. Flow animation *only* on the selected neighborhood — a thousand shimmering edges is noise (governing law).

## 5. Space, camera, motion

- **Spatial grammar:** worlds occupy depth-banded shells, not a uniform ball (doc 06 occlusion mitigation); clusters get local "gravity wells"; the Home view frames all worlds like a small galaxy — this *is* the first-open awe shot (Journey 1, step 2).
- **Camera choreography:** all navigation is animated — search-and-fly (FR-2.5) eases along a spline with focus pull (fog tightens, target neighborhood brightens); double-click frames a node; `Home` key returns to the galaxy view; pitch clamped, roll locked (doc 06 disorientation mitigation). Camera moves are 400–800ms, `ease-in-out-cubic`; never teleport, never make the user rebuild their mental map.
- **Motion tiers (shell + canvas):** micro (80–150ms — hover, press), transition (200–350ms — panels, chips), narrative (400–800ms — camera, node birth, edge growth). Node birth = scale-in + halo bloom + edge growth animation (the onboarding "graph is born" moment, Journey 1 step 4, is this animation doing its job).
- **Idle life:** the graph at rest breathes almost imperceptibly (halo drift, distant parallax). Alive, not busy — if a screen-recording looks like a screensaver, we've overdone it.
- **`prefers-reduced-motion` / low-GPU / flat view:** one degradation ladder — camera cuts replace flights, pulses stop, bloom drops, flat-view becomes default (NFR-6). Function is never motion-gated.

## 6. The shell (DOM UI)

- **Layout:** per IA §4 — canvas as ground; rail, command bar, context panel, brief as glass panels *floating over* the scene (translucent blur surfaces so the brain stays visible behind — single-surface feel, D-IA4).
- **Type:** Inter (UI) + JetBrains Mono (data/IDs); scale 12/13/14/16/20/28. Dense but breathable — Persona 1 wants density (doc 04).
- **Command bar (⌘K)** is the flagship shell component: capture, search, navigate, actions; results grouped by kind; every canvas op has a bar equivalent (NFR-6).
- **Core components (build order):** command bar → context panel (node editor: title, type chip, fields, body, connections list) → suggestion chip/queue (Inbox) → brief card → goal tree panel → world switcher → toasts/undo. Each specced with tokens, keyboard map, and empty/loading/error states before build (per execution rule: components before pages).
- **Voice & copy:** the product speaks like a sharp chief of staff — plain, brief, specific, zero exclamation points. AI rationale strings ("linked because both mention Sarah + OSCP") are part of the design language: always shown, always terse. User-facing vocabulary per IA §5 (brain, thought, connection, energy, Inbox).

## 7. Accessibility commitments (NFR-6)

Canvas parity (every operation keyboard/list reachable), WCAG 2.1 AA shell, focus-visible everywhere, full keyboard graph traversal (tab through neighborhood by edge strength), screen-reader graph summaries ("Goal OSCP: 12 connections, 3 open tasks, energy high"), reduced-motion ladder (§5), color-independent meaning (geometry + text always accompany color).

## Decisions

- **D-DS1:** One semantic-token system drives DOM and WebGL; themes are pure token sets.
- **D-DS2:** "Every photon carries information" — decorative-only effects are rejected in review.
- **D-DS3:** Type identity via silhouette first, color second (distance + color-blindness robustness).
- **D-DS4:** All camera movement is choreographed (no teleports); pitch clamped, roll locked.
- **D-DS5:** Shell floats translucent over the canvas; there is no opaque "app page" anywhere in v1.

## Risks

- **R-DS1:** Bloom/translucency GPU cost on mid-range hardware → perf budget in the Phase-A spike includes *worst theme at 1k nodes*; degradation ladder (§5) is the safety net.
- **R-DS2:** Sci-fi drift into kitsch → anti-reference review checklist; Minimalist theme kept honest as the taste control group.

## Open questions

- **OQ-DS1:** Brand identity (logo, name treatment, marketing site language) — separate workstream; not blocking build phase.
- **OQ-DS2:** Sound design (subtle audio feedback on capture/accept) — potentially huge for "alive," easily annoying; prototype behind a default-off flag in beta.
