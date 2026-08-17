import React from 'react';

export default function AdminDrawer({ isOpen, onClose, stats, pendingTutors, demos, onApproveKyc }) {
  if (!isOpen) return null;

  return (
    <aside className="admin-drawer" style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed var(--border-dashed)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>⚙️ Admin Control Center</h3>
        <button onClick={onClose} style={{ background: 'none', border: '2px solid #173300', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}>✕</button>
      </div>

      <div style={{ background: 'var(--bg-cream)', border: '2px solid #173300', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Registered Tutors</div>
        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalTutors || 0}</div>
      </div>

      <div style={{ background: 'var(--bg-cream)', border: '2px solid #173300', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Pending KYC Audit</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--terracotta)' }}>{stats?.pendingKycCount || 0}</div>
      </div>

      <div style={{ background: 'var(--bg-cream)', border: '2px solid #173300', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Total Demo Requests</div>
        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalDemosCount || 0}</div>
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '1.5rem 0 0.75rem 0' }}>Pending Credentials Audit</h4>
      <div>
        {pendingTutors && pendingTutors.length > 0 ? (
          pendingTutors.map((t) => (
            <div key={t.id} style={{ background: '#FFF', border: '1.5px solid #173300', padding: '0.75rem', borderRadius: 8, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#666' }}>{t.qualification}</div>
              </div>
              <button className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => onApproveKyc(t.id)}>
                Approve KYC
              </button>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#666' }}>✓ All tutor KYC credentials verified.</p>
        )}
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '1.5rem 0 0.75rem 0' }}>Recent Demo Booking Enquiries</h4>
      <div>
        {demos && demos.map((d) => (
          <div key={d.id} style={{ background: '#FCFAF5', border: '1.5px solid #173300', padding: '0.85rem', borderRadius: 8, marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem' }}>
              <span>{d.parentName} ({d.studentGrade})</span>
              <span style={{ background: '#FFEB5B', padding: '0.1rem 0.4rem', borderRadius: 4, border: '1px solid #173300', fontSize: '0.75rem' }}>{d.status}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#444', marginTop: '0.2rem' }}>
              Tutor: <strong>{d.tutorName}</strong> • {d.subject}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#777', marginTop: '0.2rem' }}>
              📅 {d.requestedTime} ({d.mode})
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
