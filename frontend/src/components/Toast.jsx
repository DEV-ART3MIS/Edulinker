import React from 'react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '5.5rem', right: '1.5rem', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ background: 'var(--text-primary)', color: 'var(--yellow-accent)', border: '2px solid var(--yellow-accent)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 700, boxShadow: '4px 5px 0px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>📌</span> {toast.message}
        </div>
      ))}
    </div>
  );
}
