'use client';

import { ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { neighborhood } from '../graph/generate';
import { GNode, NodeType } from '../graph/types';
import { useSpike } from '../store';
import { nodeColor, nodeGeometry, nodeScale } from './theme';

const tmpMatrix = new THREE.Matrix4();
const tmpQuat = new THREE.Quaternion();
const tmpScale = new THREE.Vector3();

interface Group {
  type: NodeType;
  nodes: GNode[];
  geometry: THREE.BufferGeometry;
}

/**
 * All nodes rendered as one InstancedMesh per node type (10 draw calls total).
 * Selection focus-dimming rewrites instance colors in place — no re-mount.
 * Drag is camera-parallel-plane constrained (doc 06 mitigation).
 */
export function NodesInstanced() {
  const graph = useSpike((s) => s.graph);
  const selected = useSpike((s) => s.selected);
  const select = useSpike((s) => s.select);
  const flyTo = useSpike((s) => s.flyTo);
  const bumpPositions = useSpike((s) => s.bumpPositions);

  const meshRefs = useRef<Map<NodeType, THREE.InstancedMesh>>(new Map());
  const drag = useRef<{ node: GNode; plane: THREE.Plane; moved: boolean } | null>(null);

  const groups = useMemo<Group[]>(() => {
    const byType = new Map<NodeType, GNode[]>();
    for (const n of graph.nodes) (byType.get(n.type) ?? byType.set(n.type, []).get(n.type)!).push(n);
    return [...byType.entries()].map(([type, nodes]) => ({ type, nodes, geometry: nodeGeometry(type) }));
  }, [graph]);

  useEffect(() => () => groups.forEach((g) => g.geometry.dispose()), [groups]);

  // Write matrices once per graph; colors on graph or selection change.
  useEffect(() => {
    for (const g of groups) {
      const mesh = meshRefs.current.get(g.type);
      if (!mesh) continue;
      g.nodes.forEach((n, i) => {
        tmpScale.setScalar(nodeScale(n.type, n.vitality));
        tmpMatrix.compose(new THREE.Vector3(...n.pos), tmpQuat, tmpScale);
        mesh.setMatrixAt(i, tmpMatrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [groups]);

  useEffect(() => {
    const hood = selected != null ? neighborhood(graph, selected) : null;
    for (const g of groups) {
      const mesh = meshRefs.current.get(g.type);
      if (!mesh) continue;
      g.nodes.forEach((n, i) => {
        const dimmed = hood != null && !hood.nodeIds.has(n.id);
        mesh.setColorAt(i, nodeColor(n.type, n.vitality, dimmed));
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [groups, graph, selected]);

  const onDown = (g: Group) => (e: ThreeEvent<PointerEvent>) => {
    if (e.instanceId == null) return;
    e.stopPropagation();
    const node = g.nodes[e.instanceId];
    select(node.id);
    // Drag plane: through the node, facing the camera → drag never fumbles in z.
    const normal = new THREE.Vector3();
    e.camera.getWorldDirection(normal);
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(...node.pos));
    drag.current = { node, plane, moved: false };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onMove = (g: Group) => (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    const hit = new THREE.Vector3();
    if (!e.ray.intersectPlane(d.plane, hit)) return;
    d.moved = true;
    d.node.pos = [hit.x, hit.y, hit.z];
    const mesh = meshRefs.current.get(d.node.type);
    const idx = g.nodes.indexOf(d.node);
    if (mesh && idx >= 0) {
      tmpScale.setScalar(nodeScale(d.node.type, d.node.vitality));
      tmpMatrix.compose(hit, tmpQuat, tmpScale);
      mesh.setMatrixAt(idx, tmpMatrix);
      mesh.instanceMatrix.needsUpdate = true;
    }
    bumpPositions(); // edges + labels follow
  };

  const onUp = () => {
    drag.current = null;
  };

  const onDouble = (g: Group) => (e: ThreeEvent<MouseEvent>) => {
    if (e.instanceId == null) return;
    e.stopPropagation();
    flyTo(g.nodes[e.instanceId].id);
  };

  return (
    <group>
      {groups.map((g) => (
        <instancedMesh
          key={`${g.type}-${g.nodes.length}`}
          ref={(m) => {
            if (m) meshRefs.current.set(g.type, m);
          }}
          args={[g.geometry, undefined, g.nodes.length]}
          onPointerDown={onDown(g)}
          onPointerMove={onMove(g)}
          onPointerUp={onUp}
          onDoubleClick={onDouble(g)}
        >
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      ))}
    </group>
  );
}
