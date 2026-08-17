import React, { useState } from 'react';
import { generateParCode } from '../../services/api';

export default function ParentDashboard({ dashboardData, userName, onLinkParCode, activeTab = 'overview' }) {
  const [inputParCode, setInputParCode] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showContactModal, setShowContactModal] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [messageText, setMessageText] = useState('');

  // Parent Profile State
  const [parentName, setParentName] = useState(userName || 'Samruddhi');
  const [parentEmail, setParentEmail] = useState('parent@example.com');
  const [phone, setPhone] = useState('+91 98234 56789');

  const childCode = generateParCode(userName || 'Samruddhi');

  const parent = {
    name: parentName,
    email: parentEmail
  };

  const child = dashboardData?.childProfile || {
    name: userName || 'Samruddhi',
    parCode: childCode,
    grade: '10th Standard',
    board: 'CBSE Board',
    avgMarks: 88,
    attendanceAvg: '95%'
  };

  const scoreSheet = dashboardData?.testScoreSheet || {
    totalMarks: 88,
    learningStyle: 'Visual & Conceptual Learner',
    breakdown: { analytical: 90, conceptual: 100, examStrategy: 75, problemSolving: 85 }
  };

  const tutors = dashboardData?.enrolledTutors || [
    { id: 'e1', tutorName: 'Dr. Rajesh Deshmukh', subject: 'Mathematics', attendancePercent: 97, scorePercent: 88, phone: '+91 98765 43210' },
    { id: 'e2', tutorName: 'Sunita Patil', subject: 'Physics', attendancePercent: 86, scorePercent: 85, phone: '+91 98765 43211' },
    { id: 'e3', tutorName: 'Amitabh Joshi', subject: 'Chemistry', attendancePercent: 96, scorePercent: 92, phone: '+91 98765 43212' }
  ];

  const teacherNotifs = dashboardData?.notificationsFromTeachers || [
    { id: 'n1', teacherName: 'Dr. Rajesh Deshmukh', title: 'Calculus & Geometry Test Announcement', message: 'Chapter 4 assessment Friday 5 PM.', createdAt: 'Today' },
    { id: 'n2', teacherName: 'Sunita Patil', title: 'Physics Attendance Update (97%)', message: 'Maintained 97% attendance in physics mechanics.', createdAt: 'Yesterday' }
  ];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!inputParCode) return;

    if (!inputParCode.toUpperCase().startsWith('PAR-')) {
      setErrorMsg('Invalid Code format! Code must start with PAR- (e.g. PAR-SAM7382-KPR)');
      return;
    }

    setErrorMsg('');
    if (onLinkParCode) {
      onLinkParCode(inputParCode.trim().toUpperCase());
    }

    setLinkSuccess(true);
    triggerToast(`✅ Linked with Student PAR-CODE: ${inputParCode.trim().toUpperCase()}!`);
    setTimeout(() => setLinkSuccess(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setShowContactModal(null);
    setMessageText('');
    triggerToast('💬 Message sent to educator!');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    triggerToast('✅ Parent account settings updated!');
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

      {/* Registered Parent User Greeting Banner */}
      <div style={{ marginBottom: '1rem', padding: '1rem 1.25rem', backgroundColor: '#FFFFFF', border: '2.5px solid var(--text-primary)', borderRadius: '1.25rem', boxShadow: '4px 6px 0px var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B' }}>LOGGED IN PARENT:</span>
          <h2 style={{ margin: '0.1rem 0 0 0', fontWeight: 800, fontSize: '1.35rem' }}>👋 Welcome, {parent.name}! ({parent.email})</h2>
        </div>
        <span className="par-code-pill" style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
          Linked Child: {child.name} ({child.parCode})
        </span>
      </div>

      {/* Unique PAR-CODE Link Banner */}
      <div className="dash-card link-account-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem' }}>
              🔗 Link Child Account with Unique PAR-CODE
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: '#334155' }}>
              Enter the unique student code from your child's student dashboard to unlock progress, attendance, and test score sheets.
            </p>
          </div>

          <form onSubmit={handleLinkSubmit} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={inputParCode}
              onChange={(e) => setInputParCode(e.target.value)}
              placeholder="Enter PAR-CODE (e.g. PAR-SAM7382-KPR)"
              className="dash-input-field"
              style={{ width: '260px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}
              required
            />
            <button type="submit" className="dash-btn-primary">
              Link Account
            </button>
          </form>
        </div>

        {errorMsg && <div style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>⚠️ {errorMsg}</div>}
        {linkSuccess && <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>✅ Account Linked Successfully to {child.name}!</div>}
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--yellow-accent)' }}>🆔</div>
          <div>
            <div className="metric-value" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{child.parCode}</div>
            <div className="metric-label">Child PAR-CODE</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-mint)' }}>🏆</div>
          <div>
            <div className="metric-value">{child.avgMarks}/100</div>
            <div className="metric-label">Academic Assessment Score</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-peach)' }}>✅</div>
          <div>
            <div className="metric-value">{child.attendanceAvg}</div>
            <div className="metric-label">Overall Attendance</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-purple)' }}>🧑‍🏫</div>
          <div>
            <div className="metric-value">{tutors.length}</div>
            <div className="metric-label">Selected Tutors</div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="dash-split-layout">
        {/* Left Column */}
        <div className="dash-col-left">
          {/* TAB: SCORESHEET */}
          {(activeTab === 'overview' || activeTab === 'scoresheet') && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <h3 className="dash-card-title">📋 Child Academic Evaluation Score Sheet</h3>
                <span className="marks-badge" style={{ fontSize: '1rem' }}>
                  MARKS: {scoreSheet.totalMarks}/100
                </span>
              </div>

              <div style={{ marginBottom: '1.2rem', padding: '0.85rem', backgroundColor: 'var(--bg-cream)', borderRadius: '12px', border: '1.5px solid var(--text-primary)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Learning Style Profile:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
                  🧠 {scoreSheet.learningStyle}
                </div>
              </div>

              {/* 4 Domain Score Meters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="domain-score-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Analytical Thinking</span>
                    <span>{scoreSheet.breakdown?.analytical || 90}%</span>
                  </div>
                  <div className="meter-bg-bar">
                    <div className="meter-fill-bar" style={{ width: `${scoreSheet.breakdown?.analytical || 90}%`, backgroundColor: '#3B82F6' }}></div>
                  </div>
                </div>

                <div className="domain-score-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Conceptual Mastery</span>
                    <span>{scoreSheet.breakdown?.conceptual || 100}%</span>
                  </div>
                  <div className="meter-bg-bar">
                    <div className="meter-fill-bar" style={{ width: `${scoreSheet.breakdown?.conceptual || 100}%`, backgroundColor: '#10B981' }}></div>
                  </div>
                </div>

                <div className="domain-score-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Exam Strategy</span>
                    <span>{scoreSheet.breakdown?.examStrategy || 75}%</span>
                  </div>
                  <div className="meter-bg-bar">
                    <div className="meter-fill-bar" style={{ width: `${scoreSheet.breakdown?.examStrategy || 75}%`, backgroundColor: '#F59E0B' }}></div>
                  </div>
                </div>

                <div className="domain-score-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Problem Solving Speed</span>
                    <span>{scoreSheet.breakdown?.problemSolving || 85}%</span>
                  </div>
                  <div className="meter-bg-bar">
                    <div className="meter-fill-bar" style={{ width: `${scoreSheet.breakdown?.problemSolving || 85}%`, backgroundColor: '#8B5CF6' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TUTORS / ATTENDANCE */}
          {(activeTab === 'overview' || activeTab === 'tutors' || activeTab === 'attendance') && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>
                👨‍🏫 Selected Tutors & Class Attendance
              </h3>
              <div className="tutor-attendance-list">
                {tutors.map((t, idx) => (
                  <div key={idx} className="tutor-att-row">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{t.tutorName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Subject: {t.subject}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="attendance-badge" style={{ backgroundColor: 'var(--pastel-mint)' }}>
                        Attendance: {t.attendancePercent}%
                      </div>
                      <button className="dash-btn-primary" style={{ padding: '0.35rem 0.85rem' }} onClick={() => setShowContactModal(t)}>
                        Contact Educator
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>⚙️ Parent Account Settings</h3>
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Parent Full Name</label>
                  <input type="text" className="form-input" value={parentName} onChange={(e) => setParentName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <button type="submit" className="dash-btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save Account Settings 🎉
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="dash-col-right">
          {/* Notifications from Teachers */}
          <div className="dash-card">
            <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
              <h3 className="dash-card-title">🔔 Teacher Notifications for Parents</h3>
              <span className="badge-tag-pending">{teacherNotifs.length} NEW</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {teacherNotifs.map((n, i) => (
                <div key={i} className="notif-feed-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="notif-tag" style={{ backgroundColor: 'var(--yellow-accent)' }}>
                      {n.teacherName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                      {n.createdAt}
                    </span>
                  </div>
                  <h4 style={{ margin: '0.4rem 0 0.2rem 0', fontWeight: 800 }}>{n.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155' }}>{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT EDUCATOR MODAL */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              💬 Contact {showContactModal.tutorName}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1rem' }}>
              Subject: <strong>{showContactModal.tutorName} ({showContactModal.subject})</strong> • Phone: {showContactModal.phone}
            </p>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Message / Inquiry for Educator</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Type your message about attendance, marks or scheduling..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="dash-btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                Send Message to Educator ✉️
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
