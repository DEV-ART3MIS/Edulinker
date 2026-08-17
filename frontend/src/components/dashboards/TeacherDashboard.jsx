import React, { useState } from 'react';

export default function TeacherDashboard({ dashboardData, userName, onSendNotification, activeTab = 'overview' }) {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('ANNOUNCEMENT');
  const [targetCode, setTargetCode] = useState('PAR-8829-KPR');
  const [sendSuccess, setSendSuccess] = useState(false);

  // Profile Form States
  const [teacherName, setTeacherName] = useState(userName || 'Samruddhi');
  const [hourlyRate, setHourlyRate] = useState(1200);
  const [location, setLocation] = useState('Kopargaon, Maharashtra');
  const [qualification, setQualification] = useState('M.Sc Mathematics / CA Coach');
  const [experience, setExperience] = useState(8);

  const [studentRequests, setStudentRequests] = useState([
    { id: 'enr-104', studentName: 'Aarav Patel (Grade 10)', requestedDate: '2026-08-16', status: 'PENDING', subject: 'Mathematics' },
    { id: 'enr-105', studentName: 'Riya Sharma (Grade 12)', requestedDate: '2026-08-16', status: 'PENDING', subject: 'Economics' },
    { id: 'enr-101', studentName: 'Kunal Verma (Grade 11)', requestedDate: '2026-08-10', status: 'ACCEPTED', subject: 'Physics' }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 'att-1', studentName: 'Aarav Patel', grade: 'Grade 10', subject: 'Mathematics', attendancePercent: 97, status: 'PRESENT' },
    { id: 'att-2', studentName: 'Riya Sharma', grade: 'Grade 12', subject: 'Economics', attendancePercent: 86, status: 'PRESENT' },
    { id: 'att-3', studentName: 'Kunal Verma', grade: 'Grade 11', subject: 'Physics', attendancePercent: 92, status: 'ABSENT' }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 'asg-1', title: 'Chapter 4 Calculus & Derivatives Test', subject: 'Mathematics', grade: 'Grade 10', dueDate: '2026-08-22' },
    { id: 'asg-2', title: 'Ray Optics Numerical Problem Set', subject: 'Physics', grade: 'Grade 11', dueDate: '2026-08-25' }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAcceptRequest = (id) => {
    setStudentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
    triggerToast('✅ Student request accepted!');
  };

  const handleDeclineRequest = (id) => {
    setStudentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'DECLINED' } : r));
    triggerToast('❌ Student request declined.');
  };

  const toggleAttendance = (id) => {
    setAttendanceRecords(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
        const nextPercent = nextStatus === 'PRESENT' ? Math.min(100, a.attendancePercent + 3) : Math.max(50, a.attendancePercent - 3);
        return { ...a, status: nextStatus, attendancePercent: nextPercent };
      }
      return a;
    }));
    triggerToast('✅ Attendance log updated!');
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    if (onSendNotification) {
      onSendNotification({
        teacherName: teacherName,
        targetParCode: targetCode,
        title: notifTitle,
        message: notifMessage,
        type: notifType
      });
    }

    setSendSuccess(true);
    triggerToast('📢 Notification broadcasted!');
    setTimeout(() => {
      setSendSuccess(false);
      setShowBroadcastModal(false);
      setNotifTitle('');
      setNotifMessage('');
    }, 1200);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowProfileModal(false);
    triggerToast('✅ Teacher profile updated!');
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
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-mint)' }}>📖</div>
          <div>
            <div className="metric-value">3</div>
            <div className="metric-label">Subjects Offered</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--yellow-accent)' }}>💰</div>
          <div>
            <div className="metric-value">₹{hourlyRate}</div>
            <div className="metric-label">Hourly Rate</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-peach)' }}>🏅</div>
          <div>
            <div className="metric-value">{experience}+ Years</div>
            <div className="metric-label">Experience</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-purple)' }}>📩</div>
          <div>
            <div className="metric-value">{studentRequests.filter(r => r.status === 'PENDING').length} Pending</div>
            <div className="metric-label">Student Requests</div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="dash-split-layout">
        {/* Left Column */}
        <div className="dash-col-left">
          {/* OVERVIEW / CLASSES TAB */}
          {(activeTab === 'overview' || activeTab === 'classes') && (
            <div className="dash-card">
              <div className="dash-card-header">
                <h3 className="dash-card-title">📖 My Assigned Classes & Subjects</h3>
                <button className="dash-btn-primary" onClick={() => setShowAddClassModal(true)}>
                  + Add New Class
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                <span className="subject-chip-pill" style={{ backgroundColor: 'var(--pastel-mint)' }}>Mathematics (Grade 9-12)</span>
                <span className="subject-chip-pill" style={{ backgroundColor: 'var(--pastel-peach)' }}>Physics (Grade 10-12)</span>
                <span className="subject-chip-pill" style={{ backgroundColor: 'var(--pastel-purple)' }}>Accountancy & Economics</span>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {(activeTab === 'overview' || activeTab === 'requests') && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <h3 className="dash-card-title">📫 Student Demo & Enrollment Requests</h3>
                <span className="badge-tag-pending">
                  {studentRequests.filter(r => r.status === 'PENDING').length} PENDING
                </span>
              </div>

              <div className="requests-list">
                {studentRequests.map((r) => (
                  <div key={r.id} className="request-row-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="req-avatar-circle">👦</div>
                      <div>
                        <div style={{ fontWeight: 800 }}>{r.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Subject: {r.subject} • Date: {r.requestedDate}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {r.status === 'PENDING' ? (
                        <>
                          <button className="dash-btn-primary" style={{ padding: '0.35rem 0.85rem' }} onClick={() => handleAcceptRequest(r.id)}>
                            Accept
                          </button>
                          <button className="dash-btn-outline" style={{ padding: '0.35rem 0.85rem', color: '#DC2626', borderColor: '#DC2626' }} onClick={() => handleDeclineRequest(r.id)}>
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className={r.status === 'ACCEPTED' ? 'badge-status-accepted' : 'badge-status-pending'} style={{ backgroundColor: r.status === 'DECLINED' ? '#FEE2E2' : undefined, color: r.status === 'DECLINED' ? '#DC2626' : undefined }}>
                          {r.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {(activeTab === 'overview' || activeTab === 'attendance') && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>
                ✅ Interactive Student Attendance Log
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {attendanceRecords.map((a) => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #173300', padding: '0.75rem 1rem', borderRadius: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{a.studentName}</strong> ({a.grade})
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{a.subject} • Attendance: {a.attendancePercent}%</div>
                    </div>
                    <button
                      className="dash-btn-outline"
                      style={{ backgroundColor: a.status === 'PRESENT' ? '#D1FAE5' : '#FEE2E2', color: a.status === 'PRESENT' ? '#065F46' : '#991B1B', fontWeight: 800 }}
                      onClick={() => toggleAttendance(a.id)}
                    >
                      {a.status === 'PRESENT' ? '✅ MARKED PRESENT' : '❌ MARKED ABSENT'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSIGNMENTS TAB */}
          {activeTab === 'assignments' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <h3 className="dash-card-title">📝 Homework & Test Assignments</h3>
                <button className="dash-btn-primary" onClick={() => setShowAssignmentModal(true)}>
                  + Create Assignment
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {assignments.map((asg) => (
                  <div key={asg.id} style={{ border: '2px solid #173300', borderRadius: '0.85rem', padding: '0.85rem', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                      <span>{asg.title}</span>
                      <span className="marks-badge">{asg.grade}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.3rem' }}>Subject: {asg.subject} • Due Date: {asg.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>🗓️ My Teaching Timetable</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ border: '2px solid #173300', padding: '0.85rem', borderRadius: '0.85rem' }}>
                  <strong>Mathematics 10th Standard</strong> — Today at 5:00 PM (Zoom)
                </div>
                <div style={{ border: '2px solid #173300', padding: '0.85rem', borderRadius: '0.85rem' }}>
                  <strong>Physics 11th Standard</strong> — Tomorrow at 4:00 PM (In-Person Kopargaon Center)
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>⚙️ Teacher Profile Settings</h3>
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Teacher Name</label>
                  <input type="text" className="form-input" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Qualification & Title</label>
                  <input type="text" className="form-input" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Hourly Rate (₹)</label>
                    <input type="number" className="form-input" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teaching Experience (Yrs)</label>
                    <input type="number" className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="dash-btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save Teacher Profile 🎉
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="dash-col-right">
          {/* Teacher Profile Card */}
          <div className="dash-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="profile-avatar-circle" style={{ backgroundColor: 'var(--pastel-mint)' }}>🧑‍🏫</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{teacherName}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{location}</span>
              </div>
            </div>

            <div className="profile-detail-box">
              <div className="detail-row">
                <span>Experience</span>
                <strong>{experience}+ years</strong>
              </div>
              <div className="detail-row">
                <span>Qualification</span>
                <strong>{qualification}</strong>
              </div>
              <div className="detail-row">
                <span>Rate</span>
                <strong style={{ color: '#059669' }}>₹{hourlyRate}/hr</strong>
              </div>
            </div>

            <button className="dash-btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setShowProfileModal(true)}>
              ✏️ Update Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="dash-card">
            <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>⚡ Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button className="dash-btn-primary" style={{ width: '100%' }} onClick={() => setShowBroadcastModal(true)}>
                📢 Broadcast Announcement
              </button>
              <button className="dash-btn-outline" style={{ width: '100%' }} onClick={() => setShowAssignmentModal(true)}>
                📝 Create New Assignment
              </button>
              <button className="dash-btn-outline" style={{ width: '100%' }} onClick={() => triggerToast('✅ Attendance logs synced for all students!')}>
                ✅ Sync Attendance Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Notification Modal */}
      {(showBroadcastModal || activeTab === 'broadcast') && (
        <div className="modal-overlay" onClick={() => setShowBroadcastModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>📢 Send Notification to Student & Parent</h3>
              <button className="modal-close" onClick={() => setShowBroadcastModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {sendSuccess ? (
              <div className="success-banner" style={{ margin: '1.5rem 0', backgroundColor: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: '0.75rem', fontWeight: 800 }}>
                ✅ Notification successfully sent to Student and Parent!
              </div>
            ) : (
              <form onSubmit={handleBroadcastSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Target Student PAR-CODE</label>
                  <input
                    type="text"
                    value={targetCode}
                    onChange={(e) => setTargetCode(e.target.value)}
                    className="form-input"
                    placeholder="e.g. PAR-SAM7382-KPR or ALL"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Notification Type</label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value)}
                    className="form-select"
                  >
                    <option value="ANNOUNCEMENT">📢 Announcement</option>
                    <option value="ATTENDANCE">✅ Attendance Update</option>
                    <option value="GRADE">🏆 Grade Report</option>
                    <option value="HOMEWORK">📝 Homework Reminder</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Notification Title</label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Calculus Chapter 4 Test Alert"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label className="form-label">Notification Message</label>
                  <textarea
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="form-input"
                    rows="3"
                    placeholder="Write announcement details for student & parent..."
                    required
                  />
                </div>

                <button type="submit" className="dash-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  🚀 Broadcast Notification Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* UPDATE PROFILE MODAL */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>✏️ Update Teacher Profile</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input type="text" className="form-input" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Hourly Rate (₹)</label>
                <input type="number" className="form-input" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
              </div>
              <button type="submit" className="dash-btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowAssignmentModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>📝 Create New Assignment</h3>
            <form onSubmit={(e) => { e.preventDefault(); setShowAssignmentModal(false); triggerToast('✅ New assignment created!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Assignment Title</label>
                <input type="text" className="form-input" placeholder="e.g. Chapter 5 Integration Quiz" required />
              </div>
              <div className="form-group">
                <label className="form-label">Target Grade Level</label>
                <select className="form-select">
                  <option value="Grade 10">10th Standard</option>
                  <option value="Grade 11">11th Standard</option>
                  <option value="Grade 12">12th Standard</option>
                </select>
              </div>
              <button type="submit" className="dash-btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                Publish Assignment 🎉
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
