import { GEdge, GNode, Graph, NodeType } from './types';

// Deterministic RNG so perf runs are comparable across machines.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NON_GOAL_TYPES: [NodeType, number][] = [
  ['note', 0.3],
  ['task', 0.22],
  ['idea', 0.13],
  ['project', 0.08],
  ['person', 0.08],
  ['source', 0.07],
  ['decision', 0.05],
  ['conversation', 0.05],
  ['insight', 0.02],
];

const WORDS_A = ['OSCP', 'Client', 'Referral', 'Sleep', 'Consulting', 'Pentest', 'Marketing', 'Onboarding', 'Runway', 'Discipline', 'Momentum', 'Pipeline', 'Sarah', 'Chapter', 'Retro', 'Risk', 'Focus', 'Outreach', 'Lab', 'Exam'];
const WORDS_B = ['strategy', 'follow-up', 'notes', 'plan', 'review', 'insight', 'draft', 'call', 'experiment', 'summary', 'framework', 'checklist', 'journal', 'idea', 'question', 'lesson', 'thread', 'brief', 'sketch', 'map'];

/**
 * Synthetic brain:
 * - `worlds` occupy concentric depth bands (shells) — the doc-06 occlusion mitigation.
 * - each world has goal-centered clusters (gravity wells); members scatter around them.
 * - edges: dense intra-cluster, sparse cross-cluster / cross-world.
 */
export function generateGraph(nodeCount: number, seed = 42): Graph {
  const rnd = mulberry32(seed);
  const worlds = 3;
  const goalsPerWorld = 4;
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];

  const pickType = (): NodeType => {
    let r = rnd();
    for (const [t, w] of NON_GOAL_TYPES) {
      if ((r -= w) <= 0) return t;
    }
    return 'note';
  };
  const title = () => `${WORDS_A[(rnd() * WORDS_A.length) | 0]} ${WORDS_B[(rnd() * WORDS_B.length) | 0]}`;

  // Goal cluster centers, per world shell.
  const centers: { world: number; goalId: number; c: [number, number, number] }[] = [];
  let id = 0;
  for (let w = 0; w < worlds; w++) {
    const shellR = 60 + w * 55; // depth bands
    for (let g = 0; g < goalsPerWorld; g++) {
      const theta = (g / goalsPerWorld) * Math.PI * 2 + w * 0.7 + rnd() * 0.3;
      const phi = Math.PI / 2 + (rnd() - 0.5) * 0.9; // biased to equator band, avoids a uniform ball
      const c: [number, number, number] = [
        shellR * Math.sin(phi) * Math.cos(theta),
        shellR * Math.cos(phi) * 0.55, // squash vertically: galaxy, not sphere
        shellR * Math.sin(phi) * Math.sin(theta),
      ];
      const goal: GNode = { id: id++, type: 'goal', title: title(), world: w, vitality: 0.75 + rnd() * 0.25, pos: c };
      nodes.push(goal);
      centers.push({ world: w, goalId: goal.id, c });
    }
  }

  // Members scattered around cluster centers (gaussian-ish via sum of uniforms).
  const g3 = () => (rnd() + rnd() + rnd() - 1.5) * 2;
  while (nodes.length < nodeCount) {
    const k = centers[(rnd() * centers.length) | 0];
    const spread = 16 + rnd() * 10;
    const n: GNode = {
      id: id++,
      type: pickType(),
      title: title(),
      world: k.world,
      vitality: Math.min(1, Math.max(0.05, rnd() * rnd() + rnd() * 0.35)), // most nodes cool, few hot
      pos: [k.c[0] + g3() * spread, k.c[1] + g3() * spread * 0.6, k.c[2] + g3() * spread],
    };
    nodes.push(n);
    // Anchor edge into the cluster: to the goal or a random earlier member of the same cluster region.
    const anchor = rnd() < 0.35 ? k.goalId : Math.max(0, n.id - 1 - ((rnd() * 40) | 0));
    if (anchor !== n.id) edges.push({ id: edges.length, source: n.id, target: anchor, strength: 0.35 + rnd() * 0.6 });
    // Occasional second edge; rarely cross-world (the leverage links).
    if (rnd() < 0.45) {
      const t = (rnd() * n.id) | 0;
      if (t !== n.id) edges.push({ id: edges.length, source: n.id, target: t, strength: 0.15 + rnd() * 0.5 });
    }
  }

  const adjacency = new Map<number, number[]>();
  for (const e of edges) {
    (adjacency.get(e.source) ?? adjacency.set(e.source, []).get(e.source)!).push(e.id);
    (adjacency.get(e.target) ?? adjacency.set(e.target, []).get(e.target)!).push(e.id);
  }
  return { nodes, edges, adjacency };
}

export function neighborhood(graph: Graph, nodeId: number): { nodeIds: Set<number>; edgeIds: Set<number> } {
  const nodeIds = new Set<number>([nodeId]);
  const edgeIds = new Set<number>();
  for (const eid of graph.adjacency.get(nodeId) ?? []) {
    const e = graph.edges[eid];
    edgeIds.add(eid);
    nodeIds.add(e.source === nodeId ? e.target : e.source);
  }
  return { nodeIds, edgeIds };
}
