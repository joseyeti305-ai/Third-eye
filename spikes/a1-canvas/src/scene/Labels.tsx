'use client';

import { Billboard, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { GNode } from '../graph/types';
import { useSpike } from '../store';

const MAX_LABELS = 56;
const tmp = new THREE.Vector3();

interface Entry {
  node: GNode;
  /** distance tier: 0 = near (full), 1 = mid (truncated) */
  tier: number;
}

/**
 * SDF billboard labels for the top-K most label-worthy nodes
 * (score = vitality vs. camera distance), re-ranked ~4×/second.
 * Distance tiers: full title → truncated → nothing (doc 06 legibility mitigation).
 */
export function Labels() {
  const graph = useSpike((s) => s.graph);
  const selected = useSpike((s) => s.selected);
  const camera = useThree((s) => s.camera);
  const [entries, setEntries] = useState<Entry[]>([]);
  const acc = useRef(0);

  useFrame((_, delta) => {
    acc.current += delta;
    if (acc.current < 0.25) return;
    acc.current = 0;
    const scored: { n: GNode; d: number; score: number }[] = [];
    for (const n of graph.nodes) {
      const d = tmp.set(...n.pos).distanceTo(camera.position);
      if (d > 260) continue;
      const boost = n.id === selected ? 10 : n.type === 'goal' ? 2.2 : 1;
      scored.push({ n, d, score: (boost * (0.2 + n.vitality)) / (30 + d) });
    }
    scored.sort((a, b) => b.score - a.score);
    setEntries(scored.slice(0, MAX_LABELS).map(({ n, d }) => ({ node: n, tier: d < 90 ? 0 : 1 })));
  });

  return (
    <group>
      {entries.map(({ node, tier }) => {
        const text = tier === 0 ? node.title : node.title.length > 14 ? node.title.slice(0, 13) + '…' : node.title;
        const size = (tier === 0 ? 1.55 : 1.2) * (node.type === 'goal' ? 1.5 : 1);
        return (
          <Billboard key={node.id} position={[node.pos[0], node.pos[1] + 4.5, node.pos[2]]}>
            <Text
              font="/fonts/label.ttf" // local: troika's default font + unicode-resolver hit a CDN, which is blocked/offline-hostile and suspends the whole app
              fontSize={size}
              color={node.id === selected ? '#ffffff' : '#c9d2ff'}
              outlineWidth={size * 0.06}
              outlineColor="#05060e"
              anchorX="center"
              anchorY="bottom"
              maxWidth={40}
            >
              {text}
            </Text>
          </Billboard>
        );
      })}
    </group>
  );
}
