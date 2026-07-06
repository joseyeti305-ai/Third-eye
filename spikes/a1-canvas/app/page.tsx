'use client';

import dynamic from 'next/dynamic';

// Client-only: three.js has no SSR story worth having.
const SpikeApp = dynamic(() => import('../src/SpikeApp'), { ssr: false });

export default function Page() {
  return <SpikeApp />;
}
