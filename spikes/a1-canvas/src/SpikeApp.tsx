'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { Scene } from './scene/Scene';
import { useSpike } from './store';
import { Hud } from './ui/Hud';

export default function SpikeApp() {
  const goHome = useSpike((s) => s.goHome);
  const select = useSpike((s) => s.select);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') goHome();
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goHome, select]);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 130, 320], fov: 55, near: 0.5, far: 2500 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => select(null)}
        onCreated={() => {
          (window as unknown as { __sceneReady?: boolean }).__sceneReady = true; // headless-verification hook
        }}
      >
        <Scene />
      </Canvas>
      <Hud />
    </div>
  );
}
