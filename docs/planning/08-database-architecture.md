# 08 — Database Architecture

**Status: design document.** Schema sketches below are illustrative DDL for review purposes — no migrations exist or will be created until Build Phase.

## 1. The central question: graph database or relational?

**Decision (D-DB1): PostgreSQL (Supabase) with a node/edge relational model + pgvector. No dedicated graph database (Neo4j, etc.).**

Reasoning:

- Our graph workloads are **shallow**: neighborhood expansion (1–3 hops), goal-closure traversal (depth ≤ 4), viewport queries. Postgres recursive CTEs handle depth-≤4 traversals over per-user graphs (≤ 100k nodes, NFR-2) comfortably. Graph DBs earn their complexity at deep/analytical traversals over huge shared graphs — not our shape.
- We need **vectors + relational + graph in one transaction boundary**. Splitting stores (Neo4j + Postgres + vector DB) triples operational surface, breaks atomicity of "create node + edges + embedding job," and fights Supabase RLS.
- Supabase gives auth, RLS, realtime (canvas live-updates), storage, and edge functions in one platform — maximal leverage for a small team.
- **Tradeoff accepted:** if a future analytical feature (opportunity detection across deep paths) outgrows recursive CTEs, we add a read-side projection (e.g., an in-memory graph service or DuckDB export) — not a primary-store migration.

**Cloud-first vs local-first (tension with the Obsidian beachhead, OQ-C1):** local-first sync (CRDTs) is a company-sized problem by itself and would delay the product a year. v1 is cloud-first with three trust compensations: full one-click export (FR-7.2), no training on user data, encryption posture (doc 10). Local-first remains a named P3 architectural ambition; nothing in this design (UUID identity, event log) forecloses it.

## 2. Core schema (conceptual)

Single database, schema-per-concern. All user-data tables carry `user_id` + RLS (doc 10). All IDs are UUIDv7 (time-ordered → index-friendly, offline-generatable → optimistic UI and future local-first).

### 2.1 `nodes` — one table, all types

```sql
nodes (
  id            uuid pk,              -- uuidv7
  user_id       uuid not null,        -- rls anchor
  type          node_type not null,   -- enum: goal|project|task|note|idea|decision|
                                      --       person|organization|source|conversation|
                                      --       event|insight (+reserved: belief|evidence|
                                      --       outcome|agent|opportunity)
  title         text not null,
  body          jsonb,                -- rich-text doc (ProseMirror-style)
  body_text     text,                 -- extracted plaintext (FTS + embedding input)
  fields        jsonb not null default '{}',  -- type-specific fields
  provenance    provenance not null,  -- user|ai|import
  vitality      real not null default 0.5,    -- cached derived score
  status        text,                 -- type-dependent lifecycle (task/goal/decision)
  created_at / updated_at / last_interacted_at timestamptz,
  deleted_at    timestamptz           -- soft delete; hard purge job later
)
```

**Single-table-inheritance over table-per-type — deliberate.** Type promotion (D-IA2) becomes an UPDATE, not a cross-table move; canvas viewport queries hit one table; polymorphic edges need no union. Cost: type-specific fields live in `fields` jsonb without DB-level column typing. Mitigation: **Zod schemas per type in the application layer are the single source of truth for `fields` shape**, plus CHECK constraints for critical invariants (e.g., goals require `fields->>'target_date'` nullable-but-typed). This is the classic tradeoff; for a 12-type vocabulary with promotion semantics, jsonb wins clearly.

### 2.2 `edges`

```sql
edges (
  id           uuid pk,
  user_id      uuid not null,
  source_id / target_id  uuid → nodes,
  type         edge_type not null,    -- relates_to|supports|blocks|informs|part_of|
                                      -- about|led_to|contradicts
  strength     real not null default 0.5,   -- 0..1, evolves (D-IA5)
  provenance   provenance not null,   -- user|ai_accepted|ai_auto|import
  note         text,
  created_at / updated_at timestamptz,
  deleted_at   timestamptz,
  unique (user_id, source_id, target_id, type) where deleted_at is null
)
```

Symmetric edge types store one row with canonical ordering (`least/greatest` on ids) enforced by trigger — no duplicate mirror rows.

### 2.3 `embeddings`

```sql
embeddings (
  node_id      uuid → nodes,
  chunk_ix     int,                   -- 0 for whole-node; >0 for long-body chunks
  embedding    vector(1536),          -- dimension pinned per model registry entry
  model        text not null,         -- enables re-embedding migrations
  content_hash text not null,         -- skip re-embedding unchanged content
  pk (node_id, chunk_ix)
)
```

Separate table (not a column on `nodes`): embeddings are regenerated on model upgrades, chunked for long bodies, and excluded from most node queries — different lifecycle, different table. Index: HNSW, per-user partial-filtered queries (`where user_id = …` via join; verified in the Phase-A spike for recall/latency at 100k rows).

### 2.4 `worlds` and `node_worlds`

```sql
worlds      (id, user_id, name, color, created_at)
node_worlds (node_id, world_id, assigned_by provenance, pk (node_id, world_id))
```

Pure labeling (D-IA3). World membership never gates RLS — it's presentation, not security.

### 2.5 `interaction_events` — the vitality & twin substrate

```sql
interaction_events (
  id         uuid pk,
  user_id    uuid,
  node_id    uuid,
  kind       text,        -- viewed|edited|linked|completed|cited_in_answer|brief_click…
  weight     real,
  at         timestamptz
) partition by range (at)   -- monthly partitions; cold partitions archived
```

Append-only. This is the raw feed for: vitality (FR-2.3), edge-strength co-activation, drift detection (FR-3.4), and — later — the digital twin and opportunity engine (D-IA5: record now, exploit later). **Vitality is computed, cached, decayed:**

```
vitality(node) = σ( w_r·recency_decay(last_interacted)
                  + w_f·log(1+interactions_30d)
                  + w_c·log(1+active_edge_count) )
```

Recomputed incrementally on event ingest + nightly decay sweep writing `nodes.vitality`. Deterministic and explainable per FR-2.3 ("why is this hot?" → show the three terms).

### 2.6 `suggestions` — the AI review queue

```sql
suggestions (
  id         uuid pk,
  user_id    uuid,
  kind       text,      -- new_node|new_edge|world_assignment|type_promotion
  payload    jsonb,     -- full proposed entity/entities
  rationale  text,      -- shown to user; trust requires "because"
  score      real,
  status     text,      -- pending|accepted|rejected|expired
  source     text,      -- capture_pipeline|connection_scan|brief
  created_at / resolved_at timestamptz
)
```

Suggestions are staged here and materialize into `nodes`/`edges` only on acceptance (or per auto-accept policy) — this table *is* FR-5.3/FR-7.3 enforced structurally: the AI cannot mutate the graph except through it (except provenance-marked `ai_auto` capture results, which are still individually undoable via the audit log).

### 2.7 Supporting tables

- `captures` — raw inbound text/audio-transcript before structuring; never deleted (reprocessable as pipelines improve).
- `briefs` — generated briefs + per-item action tracking (north-star metric source).
- `conversations` / `messages` — ask-my-brain sessions (also projected as Conversation nodes).
- `ai_actions` — audit log (doc 10): every model call's purpose, node refs, model, tokens, and resulting mutations.
- `user_settings`, `themes` — preferences, theme tokens.

## 3. Query patterns & indexing (the four that matter)

| Pattern | Serves | Approach |
|---|---|---|
| **Frustum load** — nodes/edges near camera, vitality-ranked, LOD-capped | FR-2.1, NFR-2 | Server-computed 3D layout persisted per node (`layout_x/y/z` per world/layout-mode); btree on `(user_id, world?, vitality desc)`; camera-frustum bounding-volume query + edge fetch for loaded pairs; distant clusters served as pre-aggregated proxy nodes. Client never receives the full graph. |
| **Neighborhood expansion** — k-hop around a node | canvas expand, FR-3.2 | Recursive CTE, depth ≤ 4, breadth-capped, `strength`-ordered |
| **Hybrid retrieval** — semantic ∪ keyword ∪ graph-proximity | FR-5.1/5.2/5.3 | pgvector HNSW + Postgres FTS (`body_text` tsvector, GIN) fused with reciprocal-rank; graph-proximity boost applied in the ranking layer (doc 09) |
| **Drift/brief scans** — per-user aggregates | FR-3.4, FR-5.4 | Nightly batch over `interaction_events` partitions; no realtime cost |

**Layout persistence decision (D-DB2):** node positions (x, y, z) are computed server-side (background 3D force simulation per world, depth-banded per the occlusion strategy in doc 06) and persisted, with client-side local relaxation for smoothness. Pure client-side force layout at 10k+ nodes melts laptops and makes positions non-deterministic across devices; persisted layout also makes "the graph looks the same tomorrow" true — spatial memory is a load-bearing UX asset in 3D, where re-shuffled positions are far more disorienting than in 2D.

## 4. Realtime, cache, queues

- **Supabase Realtime** on `nodes`/`edges`/`suggestions` for live canvas updates (capture lands while canvas open — Journey 3 step 4).
- **Redis — deferred (D-DB3).** v1 needs: job queue (structuring, embedding, nightly sweeps) → **pgmq/Graphile-Worker-style Postgres queue** is sufficient at v1 scale and keeps one datastore; rate-limit counters → Postgres. Redis enters when queue throughput or session-cache pressure demands it. Challenging the stack brief here deliberately: adding Redis on day 1 is premature operational surface.
- **Optimistic UI + write journal** (NFR-3): client assigns UUIDv7, renders instantly, journals mutations durably (IndexedDB) until server-acked. Multi-device conflicts: per-field last-writer-wins + `node_versions` history table (bodies keep last N versions) so nothing is silently lost.

## 5. Scale ceiling & exits

Design target (NFR-2): 100k nodes / 500k edges / 5M interaction events per user; ~10k users on one Supabase instance ≈ 10⁹ event rows → partitioning + archival handles it. Known exits if wrong: read replicas (Supabase-native), event archival to object storage, per-shard user placement (user data is perfectly shardable — zero cross-user queries by design).

## Decisions

- **D-DB1:** Postgres/Supabase + pgvector; no graph DB; no second datastore in v1.
- **D-DB2:** Server-computed, persisted graph layout; client relaxes locally.
- **D-DB3:** Postgres-based job queue; Redis deferred until measured need.
- **D-DB4:** Single `nodes` table (STI) + jsonb `fields` validated by per-type Zod schemas.
- **D-DB5:** UUIDv7 everywhere; soft deletes; append-only `interaction_events` and `captures`.
- **D-DB6:** AI mutations flow through `suggestions` (or provenance-marked + audited auto-path); structural enforcement of FR-7.3.

## Risks

- **R-DB1:** pgvector HNSW recall/latency at scale with per-user filtering — Phase-A spike measures this before commitment; exit: partitioned indexes or pgvector→pgvecto.rs.
- **R-DB2:** jsonb field drift between app versions — mitigated by versioned Zod registry + migration-on-read pattern.
- **R-DB3:** Server layout jobs are novel surface (a force sim in a worker) — spike alongside R-DB1; fallback: hybrid (server seeds, client owns positions, positions synced as data).

## Open questions

- **OQ-DB1:** Embedding dimensionality/model choice (cost vs. quality) — resolved by doc 09 cost model with measured tokens during Phase A.
- **OQ-DB2:** How much body-version history to retain on free tier (storage cost vs. trust promise) — product call at beta.
