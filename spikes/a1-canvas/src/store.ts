import { create } from 'zustand';
import { generateGraph } from './graph/generate';
import { Graph } from './graph/types';

export type CameraCommand =
  | { kind: 'fly'; nodeId: number; seq: number }
  | { kind: 'home'; seq: number }
  | null;

interface SpikeState {
  nodeCount: number;
  graph: Graph;
  /** bumped whenever node positions mutate (drag) so edges/labels refresh */
  positionsVersion: number;
  selected: number | null;
  flat: boolean;
  fps: number;
  cameraCommand: CameraCommand;

  setNodeCount: (n: number) => void;
  select: (id: number | null) => void;
  toggleFlat: () => void;
  setFps: (f: number) => void;
  flyTo: (nodeId: number) => void;
  goHome: () => void;
  bumpPositions: () => void;
}

let seq = 0;

export const useSpike = create<SpikeState>((set) => ({
  nodeCount: 5000,
  graph: generateGraph(5000),
  positionsVersion: 0,
  selected: null,
  flat: false,
  fps: 0,
  cameraCommand: null,

  setNodeCount: (n) => set({ nodeCount: n, graph: generateGraph(n), selected: null, positionsVersion: 0 }),
  select: (id) => set({ selected: id }),
  toggleFlat: () => set((s) => ({ flat: !s.flat })),
  setFps: (f) => set({ fps: f }),
  flyTo: (nodeId) => set({ cameraCommand: { kind: 'fly', nodeId, seq: ++seq }, selected: nodeId }),
  goHome: () => set({ cameraCommand: { kind: 'home', seq: ++seq }, selected: null }),
  bumpPositions: () => set((s) => ({ positionsVersion: s.positionsVersion + 1 })),
}));
