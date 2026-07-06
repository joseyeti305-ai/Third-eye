export type NodeType =
  | 'goal'
  | 'project'
  | 'task'
  | 'note'
  | 'idea'
  | 'person'
  | 'decision'
  | 'source'
  | 'conversation'
  | 'insight';

export interface GNode {
  id: number;
  type: NodeType;
  title: string;
  world: number;
  /** 0..1 — drives size + brightness (FR-2.3) */
  vitality: number;
  pos: [number, number, number];
}

export interface GEdge {
  id: number;
  source: number;
  target: number;
  /** 0..1 — drives edge brightness */
  strength: number;
}

export interface Graph {
  nodes: GNode[];
  edges: GEdge[];
  /** adjacency: nodeId -> edge ids */
  adjacency: Map<number, number[]>;
}
