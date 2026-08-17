import React, { useState } from 'react';

export default function AdminDashboard({ dashboardData, onApproveKyc, activeTab = 'overview' }) {
  const [approvedIds, setApprovedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const [demoStatuses, setDemoStatuses] = useState({});

  const stats = dashboardData?.stats || {
    totalTutorsCount: 25,
    pendingKycCount: 2,
    totalDemosCount: 4,
    linkedParentsCount: 3
  };

  const pendingKyc = dashboardData?.pendingKycTutors || [
    { id: 'tut-kp-005', name: 'Vikas Jadhav', qualification: 'M.A. English, B.Ed', experienceYears: 8, location: 'Kankuri Road, Kopargaon' },
    { id: 'tut-kp-006', name: 'Priya Kulkarni', qualification: 'M.Sc Organic Chemistry', experienceYears: 6, location: 'Station Road, Kopargaon' }
  ];

  const tutors = dashboardData?.tutors || [];
  const demos = dashboardData?.demoRequests || [
    { id: 'd1', parentName: 'Ramesh Patel', tutorName: 'Dr. Rajesh Deshmukh', subject: 'Mathematics', requestedTime: 'Tomorrow 5:00 PM', mode: 'Online Demo (Zoom)' },
    { id: 'd2', parentName: 'Sunita Sharma', tutorName: 'Neha Landge', subject: 'Accountancy & Economics', requestedTime: 'Thursday 4:00 PM', mode: 'In-Person Trial Visit' }
  ];

  const linkedParents = dashboardData?.linkedParents || [
    { parCode: 'PAR-SAM7382-KPR', parentName: 'Sanjay Patel', studentName: 'Samruddhi' },
    { parCode: 'PAR-AAR8829-KPR', parentName: 'Ramesh Patel', studentName: 'Aarav Patel' }
  ];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleApprove = (id) => {
    if (onApproveKyc) onApproveKyc(id);
    setApprovedIds(prev => [...prev, id]);
    triggerToast('🛡️ Teacher KYC Approved successfully!');
  };

  const handleReject = (id) => {
    setRejectedIds(prev => [...prev, id]);
    triggerToast('❌ Teacher KYC Rejected.');
  };

  const toggleDemoStatus = (id) => {
    setDemoStatuses(prev => ({
      ...prev,
      [id]: prev[id] === 'CONFIRMED' ? 'COMPLETED' : 'CONFIRMED'
    }));
    triggerToast('📅 Demo booking status updated!');
  };

  return (
    <div className="dash-content-grid">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#173300',
          color: '#FFFFFF',
          padding: '0.85rem 1.35rem',
          borderRadius: '0.75rem',
          fontWeight: 800,
          zIndex: 9999,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          {toastMsg}
        </div>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--yellow-accent)' }}>🧑‍🏫</div>
          <div>
            <div className="metric-value">{stats.totalTutorsCount}</div>
            <div className="metric-label">Total Verified Tutors</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-peach)' }}>🛡️</div>
          <div>
            <div className="metric-value">{pendingKyc.filter(t => !approvedIds.includes(t.id) && !rejectedIds.includes(t.id)).length}</div>
            <div className="metric-label">Pending KYC Approvals</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-mint)' }}>📅</div>
          <div>
            <div className="metric-value">{demos.length}</div>
            <div className="metric-label">Demo Bookings</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-purple)' }}>🔗</div>
          <div>
            <div className="metric-value">{linkedParents.length}</div>
            <div className="metric-label">Linked Accounts</div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="dash-split-layout">
        {/* Left Column */}
        <div className="dash-col-left">
          {(activeTab === 'overview' || activeTab === 'kyc') && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <h3 className="dash-card-title">🛡️ Teacher KYC Approvals & Verification</h3>
                <span className="badge-tag-pending">
                  {pendingKyc.filter(t => !approvedIds.includes(t.id) && !rejectedIds.includes(t.id)).length} PENDING
                </span>
              </div>

              <div className="requests-list">
                {pendingKyc.map((t, idx) => {
                  const isApproved = approvedIds.includes(t.id);
                  const isRejected = rejectedIds.includes(t.id);
                  return (
                    <div key={idx} className="request-row-item">
                      <div>
                        <div style={{ fontWeight: 800 }}>{t.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {t.qualification} • {t.experienceYears} Yrs Exp • {t.location}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isApproved ? (
                          <span className="badge-status-accepted">APPROVED ✅</span>
                        ) : isRejected ? (
                          <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.35rem 0.75rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>REJECTED ✕</span>
                        ) : (
                          <>
                            <button className="dash-btn-primary" style={{ padding: '0.35rem 0.75rem' }} onClick={() => handleApprove(t.id)}>
                              Approve KYC
                            </button>
                            <button className="dash-btn-outline" style={{ padding: '0.35rem 0.75rem', color: '#DC2626', borderColor: '#DC2626' }} onClick={() => handleReject(t.id)}>
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(activeTab === 'overview' || activeTab === 'tutors') && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>
                📍 Verified Educator Directory Management
              </h3>
              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Tutor Name</th>
                      <th>Qualification</th>
                      <th>Location</th>
                      <th>Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutors.slice(0, 15).map((t, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{t.name}</td>
                        <td>{t.qualification}</td>
                        <td>{t.location}</td>
                        <td style={{ fontWeight: 800 }}>₹{t.hourlyRate}/hr</td>
                        <td><span className="badge-status-accepted">VERIFIED</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>⚙️ Platform System Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Platform Operating Region</label>
                  <input type="text" className="form-input" defaultValue="Kopargaon, Maharashtra" readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Express Match Engine Algorithm Threshold</label>
                  <input type="text" className="form-input" defaultValue="75% Minimum Fit Match Score" />
                </div>
                <button className="dash-btn-primary" onClick={() => triggerToast('✅ System settings saved!')}>
                  Save System Configuration
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="dash-col-right">
          {(activeTab === 'overview' || activeTab === 'links') && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>
                🔗 Linked Parent-Student Accounts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {linkedParents.map((l, i) => (
                  <div key={i} className="link-account-row">
                    <div>
                      <div style={{ fontWeight: 800 }}>Parent: {l.parentName}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Child: {l.studentName}</div>
                    </div>
                    <span className="par-code-pill">{l.parCode}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'overview' || activeTab === 'demos') && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>
                📅 Parent Demo Session Bookings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {demos.map((d, i) => {
                  const status = demoStatuses[d.id || i] || 'CONFIRMED';
                  return (
                    <div key={i} className="demo-booking-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 800 }}>Parent: {d.parentName}</div>
                        <button
                          className="dash-btn-outline"
                          style={{ padding: '0.2rem 0.65rem', fontSize: '0.75rem' }}
                          onClick={() => toggleDemoStatus(d.id || i)}
                        >
                          {status === 'CONFIRMED' ? 'Mark Completed' : 'Completed ✅'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                        Tutor: {d.tutorName} ({d.subject})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Requested: {d.requestedTime} • {d.mode}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
