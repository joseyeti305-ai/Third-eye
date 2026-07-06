'use client';

import { Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense, useRef } from 'react';
import { useSpike } from '../store';
import { CameraRig } from './CameraRig';
import { Edges } from './Edges';
import { Labels } from './Labels';
import { NodesInstanced } from './NodesInstanced';
import { FOG_COLOR } from './theme';

function FpsMeter() {
  const setFps = useSpike((s) => s.setFps);
  const frames = useRef(0);
  const acc = useRef(0);
  useFrame((_, delta) => {
    frames.current += 1;
    acc.current += delta;
    if (acc.current >= 0.5) {
      setFps(Math.round(frames.current / acc.current));
      frames.current = 0;
      acc.current = 0;
    }
  });
  return null;
}

function ClickAway() {
  const select = useSpike((s) => s.select);
  const { gl } = useThree();
  // Pointer-miss = deselect (r3f onPointerMissed on Canvas also works; kept here for cohesion).
  gl.domElement.style.touchAction = 'none';
  return null;
}

export function Scene() {
  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, 0.0028]} />
      <Stars radius={600} depth={80} count={1600} factor={5} saturation={0.4} fade speed={0.4} />
      <NodesInstanced />
      <Edges />
      {/* Isolated so a slow/failed font load degrades to "no labels", never a blank app */}
      <Suspense fallback={null}>
        <Labels />
      </Suspense>
      <CameraRig />
      <FpsMeter />
      <ClickAway />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.25} />
      </EffectComposer>
    </>
  );
}
