'use client';

import { useMemo, useState } from 'react';
import { useSpike } from '../store';

const panel: React.CSSProperties = {
  position: 'absolute',
  background: 'rgba(10, 12, 28, 0.72)',
  border: '1px solid rgba(122, 162, 255, 0.25)',
  borderRadius: 10,
  padding: '10px 12px',
  color: '#c9d2ff',
  font: '12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
  backdropFilter: 'blur(8px)',
};

export function Hud() {
  const fps = useSpike((s) => s.fps);
  const nodeCount = useSpike((s) => s.nodeCount);
  const setNodeCount = useSpike((s) => s.setNodeCount);
  const flat = useSpike((s) => s.flat);
  const toggleFlat = useSpike((s) => s.toggleFlat);
  const goHome = useSpike((s) => s.goHome);
  const flyTo = useSpike((s) => s.flyTo);
  const graph = useSpike((s) => s.graph);
  const selected = useSpike((s) => s.selected);
  const [q, setQ] = useState('');

  const selectedNode = selected != null ? graph.nodes[selected] : null;

  const matches = useMemo(() => {
    if (q.length < 2) return [];
    const needle = q.toLowerCase();
    return graph.nodes.filter((n) => n.title.toLowerCase().includes(needle)).slice(0, 6);
  }, [q, graph]);

  return (
    <>
      <div style={{ ...panel, top: 12, left: 12 }} data-testid="hud">
        <div style={{ fontWeight: 700, color: '#e8ecff', marginBottom: 4 }}>NeuronOS · spike A1 — 3D canvas</div>
        <div data-testid="fps">fps {fps}</div>
        <div>
          nodes{' '}
          {[1000, 5000, 10000].map((n) => (
            <button
              key={n}
              onClick={() => setNodeCount(n)}
              style={{
                margin: '0 3px',
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid rgba(122,162,255,.35)',
                background: nodeCount === n ? 'rgba(122,162,255,.35)' : 'transparent',
                color: '#c9d2ff',
                cursor: 'pointer',
              }}
            >
              {n / 1000}k
            </button>
          ))}
          <span style={{ opacity: 0.7 }}> · edges {graph.edges.length}</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <button onClick={goHome} style={btn}>Home (H)</button>
          <button onClick={toggleFlat} style={btn} data-testid="flat-toggle">{flat ? 'flat ✓ → 3D' : 'flat view'}</button>
        </div>
        <div style={{ marginTop: 8, opacity: 0.65 }}>
          drag bg: orbit · wheel: dolly · drag node: move (camera plane)
          <br />
          click: focus neighborhood · dbl-click: frame node
        </div>
      </div>

      <div style={{ ...panel, top: 12, right: 12, width: 240 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search & fly…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,.06)',
            border: '1px solid rgba(122,162,255,.3)',
            borderRadius: 6,
            padding: '6px 8px',
            color: '#e8ecff',
            outline: 'none',
            font: 'inherit',
          }}
        />
        {matches.map((m) => (
          <div
            key={m.id}
            onClick={() => {
              flyTo(m.id);
              setQ('');
            }}
            style={{ padding: '4px 2px', cursor: 'pointer', borderBottom: '1px solid rgba(122,162,255,.12)' }}
          >
            <span style={{ opacity: 0.6 }}>{m.type}</span> {m.title}
          </div>
        ))}
        {selectedNode && (
          <div style={{ marginTop: 8 }} data-testid="selection">
            <div style={{ color: '#fff', fontWeight: 700 }}>{selectedNode.title}</div>
            <div style={{ opacity: 0.7 }}>
              {selectedNode.type} · world {selectedNode.world} · energy {(selectedNode.vitality * 100) | 0}%
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const btn: React.CSSProperties = {
  marginRight: 6,
  padding: '3px 10px',
  borderRadius: 6,
  border: '1px solid rgba(122,162,255,.35)',
  background: 'transparent',
  color: '#c9d2ff',
  cursor: 'pointer',
  font: 'inherit',
};
