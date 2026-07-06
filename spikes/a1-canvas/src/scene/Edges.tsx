'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { neighborhood } from '../graph/generate';
import { useSpike } from '../store';

/**
 * All edges in a single LineSegments draw call.
 * Brightness = strength; selection rewrites the color buffer (neighborhood pops, rest ghost).
 */
export function Edges() {
  const graph = useSpike((s) => s.graph);
  const selected = useSpike((s) => s.selected);
  const positionsVersion = useSpike((s) => s.positionsVersion);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { geometry, positions, colors } = useMemo(() => {
    const positions = new Float32Array(graph.edges.length * 6);
    const colors = new Float32Array(graph.edges.length * 6);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return { geometry, positions, colors };
  }, [graph]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Positions: on graph change and on drag.
  useEffect(() => {
    graph.edges.forEach((e, i) => {
      positions.set(graph.nodes[e.source].pos, i * 6);
      positions.set(graph.nodes[e.target].pos, i * 6 + 3);
    });
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingSphere();
  }, [graph, geometry, positions, positionsVersion]);

  // Colors: on selection change.
  useEffect(() => {
    const hood = selected != null ? neighborhood(graph, selected) : null;
    const base = new THREE.Color('#3b4a8f');
    const hot = new THREE.Color('#7aa2ff');
    const c = new THREE.Color();
    graph.edges.forEach((e, i) => {
      const inHood = hood?.edgeIds.has(e.id) ?? false;
      const ghost = hood != null && !inHood;
      c.copy(inHood ? hot : base).multiplyScalar(ghost ? 0.05 : 0.25 + e.strength * (inHood ? 1.6 : 0.75));
      colors.set([c.r, c.g, c.b], i * 6);
      colors.set([c.r, c.g, c.b], i * 6 + 3);
    });
    geometry.attributes.color.needsUpdate = true;
  }, [graph, geometry, colors, selected]);

  return (
    <lineSegments ref={lineRef} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </lineSegments>
  );
}
