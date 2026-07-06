'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSpike } from '../store';

export const HOME_POS = new THREE.Vector3(0, 130, 320);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const FLAT_POS = new THREE.Vector3(0, 420, 0.01);

/**
 * Camera choreography (doc 06 disorientation mitigations):
 * - orbit with clamped pitch, locked roll, damped inertia
 * - fly-to (search / double-click) along a smooth ease, never a teleport
 * - Home reset key; flat view = constrained top-down (rotate disabled)
 */
export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const flat = useSpike((s) => s.flat);
  const command = useSpike((s) => s.cameraCommand);
  const graph = useSpike((s) => s.graph);
  const anim = useRef<{ fromPos: THREE.Vector3; toPos: THREE.Vector3; fromTarget: THREE.Vector3; toTarget: THREE.Vector3; t: number; dur: number } | null>(null);
  const lastSeq = useRef(0);

  const startAnim = (camera: THREE.Camera, toPos: THREE.Vector3, toTarget: THREE.Vector3, dur = 0.9) => {
    const controls = controlsRef.current;
    if (!controls) return;
    anim.current = {
      fromPos: camera.position.clone(),
      toPos,
      fromTarget: controls.target.clone(),
      toTarget,
      t: 0,
      dur,
    };
  };

  // React to fly/home commands.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!command || !controls || command.seq === lastSeq.current) return;
    lastSeq.current = command.seq;
    const camera = controls.object;
    if (command.kind === 'home') {
      startAnim(camera, flat ? FLAT_POS.clone() : HOME_POS.clone(), HOME_TARGET.clone(), 1.1);
    } else {
      const n = graph.nodes[command.nodeId];
      if (!n) return;
      const target = new THREE.Vector3(...n.pos);
      // Approach position: offset back along current view direction, slightly above.
      const dir = camera.position.clone().sub(target).normalize();
      if (flat) dir.set(0, 1, 0.001).normalize();
      const toPos = target.clone().add(dir.multiplyScalar(flat ? 90 : 72)).add(new THREE.Vector3(0, flat ? 0 : 14, 0));
      startAnim(camera, toPos, target, 0.85);
    }
  }, [command, flat, graph]);

  // Flat-view transitions.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    startAnim(controls.object, flat ? FLAT_POS.clone() : HOME_POS.clone(), HOME_TARGET.clone(), 0.9);
  }, [flat]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    const a = anim.current;
    if (!controls || !a) return;
    a.t = Math.min(1, a.t + delta / a.dur);
    const k = 1 - Math.pow(1 - a.t, 3); // ease-out cubic
    controls.object.position.lerpVectors(a.fromPos, a.toPos, k);
    controls.target.lerpVectors(a.fromTarget, a.toTarget, k);
    controls.update();
    if (a.t >= 1) anim.current = null;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enableRotate={!flat}
      minPolarAngle={0.12}
      maxPolarAngle={1.52}
      minDistance={12}
      maxDistance={900}
      zoomSpeed={0.9}
      panSpeed={0.8}
      screenSpacePanning={flat}
    />
  );
}
