import * as THREE from 'three';
import { NodeType } from '../graph/types';

// Neural theme tokens (doc 11 §3), spike-scoped.
export const BG = '#06070f';
export const FOG_COLOR = '#0a0c1c';

// Type identity: silhouette first (geometry), color second (D-DS3).
export const NODE_COLOR: Record<NodeType, string> = {
  goal: '#ffd166',
  project: '#8b5cf6',
  task: '#38bdf8',
  note: '#7dd3fc',
  idea: '#f472b6',
  person: '#34d399',
  decision: '#fb923c',
  source: '#a3a3c2',
  conversation: '#67e8f9',
  insight: '#fef08a',
};

export const NODE_SCALE: Record<NodeType, number> = {
  goal: 3.2,
  project: 1.9,
  task: 1.0,
  note: 1.1,
  idea: 1.0,
  person: 1.5,
  decision: 1.5,
  source: 1.2,
  conversation: 1.2,
  insight: 1.3,
};

// One geometry per type, low-poly (instanced thousands of times).
export function nodeGeometry(type: NodeType): THREE.BufferGeometry {
  switch (type) {
    case 'goal': return new THREE.IcosahedronGeometry(1, 1);
    case 'project': return new THREE.OctahedronGeometry(1, 0);
    case 'task': return new THREE.BoxGeometry(1.3, 1.3, 1.3);
    case 'idea': return new THREE.TetrahedronGeometry(1.2, 0);
    case 'person': return new THREE.TorusGeometry(0.9, 0.35, 8, 18);
    case 'decision': return new THREE.OctahedronGeometry(1, 0).scale(0.8, 1.5, 0.8);
    case 'source': return new THREE.BoxGeometry(1.6, 2.1, 0.25);
    case 'insight': return new THREE.ConeGeometry(0.9, 1.8, 6);
    case 'conversation':
    case 'note':
    default: return new THREE.SphereGeometry(1, 12, 10);
  }
}

/** Brightness encodes vitality (every photon carries information, D-DS2). */
export function nodeColor(type: NodeType, vitality: number, dimmed: boolean): THREE.Color {
  const c = new THREE.Color(NODE_COLOR[type]);
  // Hot nodes exceed 1.0 → picked up by bloom threshold.
  c.multiplyScalar(dimmed ? 0.06 : 0.35 + vitality * 1.35);
  return c;
}

export function nodeScale(type: NodeType, vitality: number): number {
  return NODE_SCALE[type] * (0.55 + vitality * 0.9);
}
