import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'NeuronOS — spike A1: 3D canvas',
  description: 'Phase A de-risk spike: instanced 3D graph rendering, camera choreography, labels, selection, drag.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#06070f' }}>{children}</body>
    </html>
  );
}
