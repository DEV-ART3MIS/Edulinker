import React, { useState } from 'react';
import { generateParCode } from '../../services/api';

const defaultDirectoryTeachers = [
  {
    id: 'tut-kp-001',
    name: 'Dr. Rajesh Deshmukh',
    subject: 'Mathematics',
    gradeLevel: '5th to 12th Standard',
    location: 'Kopargaon Center / Online',
    hourlyRate: 500,
    experienceYears: 12,
    rating: 4.95,
    matchPercentage: 98,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Specialist in Higher Mathematics, Calculus, Trigonometry & Competitive Exam prep for 5th-12th std.'
  },
  {
    id: 'tut-kp-002',
    name: 'Sunita Patil',
    subject: 'Physics',
    gradeLevel: '6th to 12th Standard',
    location: 'Sanjivani Road, Kopargaon',
    hourlyRate: 450,
    experienceYears: 9,
    rating: 4.9,
    matchPercentage: 96,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Ex-College Lecturer in Physics, Mechanics, Electromagnetism & Optics with hands-on experiments.'
  },
  {
    id: 'tut-kp-003',
    name: 'Amitabh Joshi',
    subject: 'Chemistry',
    gradeLevel: '7th to 12th Standard',
    location: 'Station Road, Kopargaon',
    hourlyRate: 480,
    experienceYears: 10,
    rating: 4.88,
    matchPercentage: 94,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'M.Sc Organic Chemistry specialist covering Reaction Mechanisms, Physical Chemistry & Board prep.'
  },
  {
    id: 'tut-kp-004',
    name: 'Neha Landge',
    subject: 'Economics & Accountancy',
    gradeLevel: '8th to 12th Standard',
    location: 'College Road, Kopargaon',
    hourlyRate: 550,
    experienceYears: 7,
    rating: 4.92,
    matchPercentage: 95,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    bio: 'Chartered Accountant & Educator specializing in Commerce, Economics and Accountancy.'
  },
  {
    id: 'tut-kp-005',
    name: 'Meenal Thorat',
    subject: 'Biology & Life Sciences',
    gradeLevel: '5th to 12th Standard',
    location: 'Kankuri Road, Kopargaon',
    hourlyRate: 420,
    experienceYears: 6,
    rating: 4.85,
    matchPercentage: 92,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    bio: 'M.Sc Biotechnology, simplifying Botany, Zoology, Human Anatomy, and Cell Biology for std 5-12.'
  },
  {
    id: 'tut-kp-006',
    name: 'Vikas Jadhav',
    subject: 'English & Soft Skills',
    gradeLevel: '5th to 12th Standard',
    location: 'Kopargaon City Center',
    hourlyRate: 400,
    experienceYears: 8,
    rating: 4.87,
    matchPercentage: 90,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'M.A. English & B.Ed. Literature, Grammar, Essay Writing and Spoken English coach.'
  },
  {
    id: 'tut-kp-007',
    name: 'Anjali Deshpande',
    subject: 'Computer Science & Coding',
    gradeLevel: '5th to 12th Standard',
    location: 'Online / Kopargaon',
    hourlyRate: 600,
    experienceYears: 5,
    rating: 4.96,
    matchPercentage: 97,
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    bio: 'B.Tech CS Software Engineer teaching Python, Java, Data Structures & Web Development.'
  }
];

export default function StudentDashboard({ dashboardData, userName, allTutors, onEnrollTutor, onDeEnrollTutor, onNavigateToDirectory, onCopyCodeSuccess, activeTab = 'overview' }) {
  const [copied, setCopied] = useState(false);
  const [selectedScoreTutor, setSelectedScoreTutor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(null);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Editable Student Profile State
  const userParCode = generateParCode(userName || 'Samruddhi');
  const [profileName, setProfileName] = useState(userName || 'Samruddhi');
  const [grade, setGrade] = useState('10th Standard');
  const [board, setBoard] = useState('CBSE Board');
  const [email, setEmail] = useState('samruddhi@example.com');

  // Search & Filter State inside Find Teachers Tab and Overview Section
  const [tutorSearch, setTutorSearch] = useState('');
  const [tutorFilterChip, setTutorFilterChip] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  // Dynamic Enrolled Tutors State
  const [enrolledTutorsList, setEnrolledTutorsList] = useState(
    dashboardData?.enrolledTutors || [
      { id: 'enr-101', tutorName: 'Dr. Rajesh Deshmukh', subject: 'Mathematics', attendancePercent: 97, scorePercent: 88, nextClass: 'Today at 5:00 PM' },
      { id: 'enr-102', tutorName: 'Sunita Patil', subject: 'Physics', attendancePercent: 86, scorePercent: 85, nextClass: 'Tomorrow at 4:00 PM' },
      { id: 'enr-103', tutorName: 'Amitabh Joshi', subject: 'Chemistry', attendancePercent: 96, scorePercent: 92, nextClass: 'Friday at 6:00 PM' }
    ]
  );

  // Combine passed allTutors or default Directory Teachers
  const availableDirectoryTeachers = (allTutors && allTutors.length > 0) ? allTutors : defaultDirectoryTeachers;

  // Derived subjects list from enrolled tutors
  const enrolledSubjects = Array.from(new Set(enrolledTutorsList.map(t => Array.isArray(t.subject) ? t.subject[0] : String(t.subject || 'General'))));

  const student = {
    name: profileName,
    parCode: userParCode,
    grade: grade,
    board: board,
    avgScorePercent: dashboardData?.studentProfile?.avgScorePercent || 88,
    enrolledSubjectsCount: enrolledSubjects.length,
    teachersEnrolledCount: enrolledTutorsList.length,
    subjects: enrolledSubjects
  };

  const notifs = [
    { id: 'n1', teacherName: 'Dr. Rajesh Deshmukh', title: 'Calculus & Geometry Test Announcement', message: 'Chapter 4 assessment Friday 5 PM. Prepare derivatives formulas.', createdAt: 'Today 10:30 AM' },
    { id: 'n2', teacherName: 'Sunita Patil', title: 'Physics Ray Optics Homework Uploaded', message: 'Please complete Exercise 3.2 problems by Thursday.', createdAt: 'Yesterday' }
  ];

  const assignmentsList = [
    { id: 'a1', title: 'Higher Calculus & Integration Drill', subject: 'Mathematics', teacher: 'Dr. Rajesh Deshmukh', dueDate: '2026-08-20', status: 'PENDING', maxMarks: 50 },
    { id: 'a2', title: 'Ray Optics & Refraction Lab Report', subject: 'Physics', teacher: 'Sunita Patil', dueDate: '2026-08-18', status: 'SUBMITTED', maxMarks: 30 },
    { id: 'a3', title: 'Organic Reaction Mechanism Assignment', subject: 'Chemistry', teacher: 'Amitabh Joshi', dueDate: '2026-08-22', status: 'PENDING', maxMarks: 40 }
  ];

  const scoreSheet = dashboardData?.testScoreSheet || {
    totalMarks: 88,
    learningStyle: 'Visual & Conceptual Learner',
    breakdown: { analytical: 90, conceptual: 100, examStrategy: 75, problemSolving: 85 }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(student.parCode);
    setCopied(true);
    if (onCopyCodeSuccess) onCopyCodeSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setShowProfileModal(false);
    triggerToast('✅ Profile credentials saved successfully!');
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    setShowAssignmentModal(null);
    triggerToast('🚀 Assignment solution submitted to teacher!');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplyText('');
    triggerToast('💬 Message sent to your teacher!');
  };

  // Handle Dynamic Enrollment with a Teacher
  const handleEnrollTeacher = (teacher) => {
    const teacherName = teacher.name || teacher.tutorName;
    const isAlreadyEnrolled = enrolledTutorsList.some(
      t => (t.tutorName || t.name)?.toLowerCase() === teacherName?.toLowerCase() || t.id === teacher.id
    );

    if (isAlreadyEnrolled) {
      triggerToast(`⚠️ You are already enrolled with ${teacherName}!`);
      return;
    }

    const sub = Array.isArray(teacher.subjects || teacher.subject)
      ? (teacher.subjects || teacher.subject)[0]
      : (teacher.subject || teacher.subjects || 'General');

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      tutorName: teacherName,
      subject: sub,
      attendancePercent: 100,
      scorePercent: 90,
      nextClass: 'Scheduled Weekly'
    };

    setEnrolledTutorsList(prev => [newEnrollment, ...prev]);
    if (onEnrollTutor) onEnrollTutor(teacher);
    triggerToast(`🎉 Successfully Enrolled with ${teacherName} for ${sub}!`);
  };

  // Handle Dynamic De-Enrollment from a Teacher
  const handleDeEnrollTeacher = (teacher) => {
    const teacherName = teacher.tutorName || teacher.name;
    setEnrolledTutorsList(prev => prev.filter(
      t => (t.tutorName || t.name)?.toLowerCase() !== teacherName?.toLowerCase() && t.id !== teacher.id
    ));
    if (onDeEnrollTutor) onDeEnrollTutor(teacher);
    triggerToast(`❌ De-enrolled from ${teacherName}`);
  };

  // Filter teachers in Find & Match section and Overview Search Queue
  const searchFilteredTeachers = availableDirectoryTeachers.filter(t => {
    if (!t) return false;
    const tName = String(t.name || t.tutorName || t.title || '').toLowerCase();

    const rawSub = t.subjects || t.subject || '';
    const tSub = Array.isArray(rawSub) ? rawSub.join(' ').toLowerCase() : String(rawSub).toLowerCase();

    const tLoc = String(t.location || '').toLowerCase();

    const rawClasses = t.classes || t.gradeLevel || '';
    const tGrade = Array.isArray(rawClasses) ? rawClasses.join(' ').toLowerCase() : String(rawClasses).toLowerCase();

    const tBio = String(t.bio || t.qualification || '').toLowerCase();
    const query = (tutorSearch || '').toLowerCase().trim();

    const matchesSearch = !query ||
      tName.includes(query) ||
      tSub.includes(query) ||
      tLoc.includes(query) ||
      tGrade.includes(query) ||
      tBio.includes(query);

    const matchesSubject = tutorFilterChip === 'ALL' || tSub.includes(tutorFilterChip.toLowerCase());

    let matchesGrade = true;
    if (gradeFilter !== 'ALL') {
      const gNum = gradeFilter.replace(/[^0-9]/g, '');
      matchesGrade = tGrade.includes(gradeFilter.toLowerCase()) ||
                     (gNum && (tGrade.includes(`${gNum}th`) || tGrade.includes(`grade ${gNum}`) || tGrade.includes('5th to 12th')));
    }

    return matchesSearch && matchesSubject && matchesGrade;
  });

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
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--yellow-accent)' }}>🎓</div>
          <div>
            <div className="metric-value">{student.grade.split(' ')[0]}</div>
            <div className="metric-label">Current Grade</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-mint)' }}>🏆</div>
          <div>
            <div className="metric-value">{student.avgScorePercent}%</div>
            <div className="metric-label">Avg. Test Score</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-peach)' }}>📚</div>
          <div>
            <div className="metric-value">{student.enrolledSubjectsCount}</div>
            <div className="metric-label">Subjects Enrolled</div>
          </div>
        </div>

        <div className="dash-metric-card" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="metric-icon-bubble" style={{ backgroundColor: 'var(--pastel-purple)' }}>🧑‍🏫</div>
          <div>
            <div className="metric-value">{student.teachersEnrolledCount}</div>
            <div className="metric-label">Teachers Enrolled</div>
          </div>
        </div>
      </div>

      {/* TABS CONTENT WRAPPER */}
      <div className="dash-split-layout">
        {/* Left Column */}
        <div className="dash-col-left">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3 className="dash-card-title">📖 My Enrolled Subjects</h3>
                  <button className="dash-btn-primary" onClick={onNavigateToDirectory}>
                    Find Teachers →
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {student.subjects.map((sub, i) => (
                    <span key={i} className="subject-chip-pill">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dash-card">
                <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>
                  👨‍🏫 Enrolled Tutors & Attendance
                </h3>
                <div className="tutor-attendance-list">
                  {enrolledTutorsList.map((t, idx) => (
                    <div key={idx} className="tutor-att-row">
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{t.tutorName}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Subject: {t.subject}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div className="attendance-badge" style={{
                          backgroundColor: (t.attendancePercent || 100) >= 90 ? 'var(--pastel-mint)' : 'var(--pastel-peach)'
                        }}>
                          Attendance: {t.attendancePercent || 100}%
                        </div>
                        <button
                          className="dash-btn-outline"
                          style={{ padding: '0.35rem 0.85rem' }}
                          onClick={() => setSelectedScoreTutor(t)}
                        >
                          View Score
                        </button>
                        <button
                          className="dash-btn-outline"
                          style={{ padding: '0.35rem 0.85rem', color: '#DC2626', borderColor: '#DC2626', fontWeight: 800 }}
                          onClick={() => handleDeEnrollTeacher(t)}
                        >
                          ❌ De-Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <h3 className="dash-card-title">📋 Academic Evaluation & Score Sheet</h3>
                  <span className="marks-badge">MARKS: {scoreSheet.totalMarks}/100</span>
                </div>
                <div style={{ fontWeight: 800, color: '#059669', marginBottom: '0.85rem' }}>
                  🧠 Profile: {scoreSheet.learningStyle}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="domain-score-box">
                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Analytical Thinking</span>
                    <div className="meter-bg-bar"><div className="meter-fill-bar" style={{ width: `${scoreSheet.breakdown?.analytical || 90}%`, backgroundColor: '#3B82F6' }}></div></div>
                  </div>
                  <div className="domain-score-box">
                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Conceptual Mastery</span>
                    <div className="meter-bg-bar"><div className="meter-fill-bar" style={{ width: `${scoreSheet.breakdown?.conceptual || 100}%`, backgroundColor: '#10B981' }}></div></div>
                  </div>
                </div>
              </div>

              {/* OVERVIEW QUICK TEACHER SEARCH QUEUE */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 className="dash-card-title">🔍 Find & Search Kopargaon Tutors</h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                      Search 25 verified Kopargaon teachers for 5th Std to 12th Std right from your Overview!
                    </p>
                  </div>
                  <button className="dash-btn-primary" onClick={() => setShowDirectoryModal(true)}>
                    Browse All Directory →
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Search by teacher name, subject, or location..."
                    value={tutorSearch}
                    onChange={(e) => setTutorSearch(e.target.value)}
                    style={{ flex: 2, minWidth: '220px' }}
                  />

                  <select className="form-select" value={tutorFilterChip} onChange={(e) => setTutorFilterChip(e.target.value)} style={{ flex: 1, minWidth: '150px' }}>
                    <option value="ALL">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Economics">Economics & Accounts</option>
                    <option value="English">English</option>
                    <option value="Computer">Computer Science</option>
                  </select>

                  <select className="form-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ flex: 1, minWidth: '140px' }}>
                    <option value="ALL">All Standards</option>
                    <option value="5th">5th Standard</option>
                    <option value="6th">6th Standard</option>
                    <option value="7th">7th Standard</option>
                    <option value="8th">8th Standard</option>
                    <option value="9th">9th Standard</option>
                    <option value="10th">10th Standard</option>
                    <option value="11th">11th Standard</option>
                    <option value="12th">12th Standard</option>
                  </select>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '1rem' }}>
                  FOUND {searchFilteredTeachers.length} VERIFIED TEACHERS IN KOPARGAON
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {searchFilteredTeachers.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#FAF9F5', borderRadius: '0.75rem', border: '2px dashed #173300' }}>
                      <p style={{ margin: 0, fontWeight: 800 }}>No teachers match your search filter.</p>
                    </div>
                  ) : (
                    searchFilteredTeachers.slice(0, 4).map((t, idx) => {
                      const teacherName = t.name || t.tutorName;
                      const isEnrolled = enrolledTutorsList.some(
                        enr => (enr.tutorName || enr.name)?.toLowerCase() === teacherName?.toLowerCase() || enr.id === t.id
                      );

                      return (
                        <div key={idx} style={{ border: '2px solid #173300', borderRadius: '1rem', padding: '1rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{teacherName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                              {Array.isArray(t.subjects || t.subject) ? (t.subjects || t.subject).join(', ') : (t.subject || 'General')} • {Array.isArray(t.classes) ? t.classes.join(', ') : (t.gradeLevel || '5th to 12th Std')}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>📍 {t.location || 'Kopargaon Center'} • ⭐ {t.rating || 4.9} ({t.experienceYears || 8}+ Yrs Exp)</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ fontWeight: 900, marginRight: '0.5rem' }}>₹{t.hourlyRate || 500}/hr</div>
                            {isEnrolled ? (
                              <span style={{ padding: '0.4rem 0.85rem', borderRadius: '0.5rem', backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 800, fontSize: '0.85rem' }}>
                                ✅ ENROLLED
                              </span>
                            ) : (
                              <button className="dash-btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }} onClick={() => handleEnrollTeacher(t)}>
                                🚀 Enroll Now
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: FIND TEACHERS / TUTORS SEARCH & ENROLLMENT */}
          {activeTab === 'tutors' && (
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 className="dash-card-title">🔍 Find & Match Teachers</h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                    Search verified Kopargaon educators for 5th Std to 12th Std and enroll directly!
                  </p>
                </div>
                <button className="dash-btn-primary" onClick={() => setShowDirectoryModal(true)}>
                  Browse All Directory
                </button>
              </div>

              {/* SEARCH & FILTERS CONTROLS */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="🔍 Search by teacher name, subject, or location..."
                  value={tutorSearch}
                  onChange={(e) => setTutorSearch(e.target.value)}
                  style={{ flex: 2, minWidth: '240px' }}
                />

                <select className="form-select" value={tutorFilterChip} onChange={(e) => setTutorFilterChip(e.target.value)} style={{ flex: 1, minWidth: '160px' }}>
                  <option value="ALL">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Economics">Economics & Accounts</option>
                  <option value="English">English</option>
                  <option value="Computer">Computer Science</option>
                </select>

                <select className="form-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ flex: 1, minWidth: '150px' }}>
                  <option value="ALL">All Standards</option>
                  <option value="5th">5th Standard</option>
                  <option value="6th">6th Standard</option>
                  <option value="7th">7th Standard</option>
                  <option value="8th">8th Standard</option>
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                </select>
              </div>

              {/* SEARCH RESULTS COUNT */}
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '1rem' }}>
                FOUND {searchFilteredTeachers.length} VERIFIED TEACHERS IN KOPARGAON
              </div>

              {/* TEACHERS LIST WITH DIRECT ENROLLMENT BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {searchFilteredTeachers.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FAF9F5', borderRadius: '1rem', border: '2px dashed #173300' }}>
                    <div style={{ fontSize: '2rem' }}>🔍</div>
                    <h4 style={{ margin: '0.5rem 0 0.2rem 0', fontWeight: 800 }}>No teachers match your search.</h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>Try clearing your search query or selecting "All Subjects".</p>
                  </div>
                ) : (
                  searchFilteredTeachers.map((t, idx) => {
                    const teacherName = t.name || t.tutorName;
                    const isEnrolled = enrolledTutorsList.some(
                      enr => (enr.tutorName || enr.name)?.toLowerCase() === teacherName?.toLowerCase() || enr.id === t.id
                    );

                    return (
                      <div key={idx} style={{
                        border: '2.5px solid #173300',
                        borderRadius: '1.25rem',
                        padding: '1.2rem',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '4px 4px 0px #173300',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                              src={t.photo || t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                              alt={teacherName}
                              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #173300' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{teacherName}</h4>
                                <span className="marks-badge" style={{ backgroundColor: 'var(--yellow-accent)', color: '#173300', fontSize: '0.75rem' }}>
                                  {t.matchPercentage || 95}% Match Fit
                                </span>
                              </div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669', marginTop: '0.15rem' }}>
                                {Array.isArray(t.subjects || t.subject) ? (t.subjects || t.subject).join(', ') : (t.subject || 'General')} • {Array.isArray(t.classes) ? t.classes.join(', ') : (t.gradeLevel || '5th to 12th Std')}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.1rem' }}>
                                📍 {t.location || 'Kopargaon Center'} • ⭐ {t.rating || '4.9'} ({t.experienceYears || '8+'} Yrs Exp)
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                              ₹{t.hourlyRate || 500}<span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/hr</span>
                            </div>
                          </div>
                        </div>

                        {t.bio && (
                          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.4 }}>
                            {t.bio}
                          </p>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', justifyContent: 'flex-end' }}>
                          {isEnrolled ? (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <span style={{
                                padding: '0.55rem 1.25rem',
                                borderRadius: '0.75rem',
                                backgroundColor: '#D1FAE5',
                                color: '#065F46',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                border: '2px solid #059669',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}>
                                ✅ ENROLLED
                              </span>
                              <button
                                className="dash-btn-outline"
                                style={{ padding: '0.55rem 1rem', fontSize: '0.9rem', color: '#DC2626', borderColor: '#DC2626', fontWeight: 800 }}
                                onClick={() => handleDeEnrollTeacher(t)}
                              >
                                ❌ De-Enroll
                              </button>
                            </div>
                          ) : (
                            <button
                              className="dash-btn-primary"
                              style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
                              onClick={() => handleEnrollTeacher(t)}
                            >
                              🚀 Enroll to Teacher Now
                            </button>
                          )}

                          <button
                            className="dash-btn-outline"
                            style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
                            onClick={() => triggerToast(`📅 Free Demo requested with ${teacherName}! Educator will contact you.`)}
                          >
                            🎥 Book Free Demo
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MY ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>📚 Active Course Enrollments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {enrolledTutorsList.map((t, i) => (
                  <div key={i} style={{ border: '2px solid #173300', borderRadius: '1rem', padding: '1rem', backgroundColor: '#FAF9F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontWeight: 800 }}>{t.subject} — {t.tutorName}</h4>
                      <span className="marks-badge">{t.attendancePercent || 100}% Attendance</span>
                    </div>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#475569' }}>Next Live Lecture: <strong>{t.nextClass || 'Scheduled Weekly'}</strong></p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="dash-btn-outline" onClick={() => triggerToast(`📖 Downloaded Syllabus & Notes for ${t.subject}`)}>
                        Download Syllabus Notes
                      </button>
                      <button className="dash-btn-outline" onClick={() => triggerToast(`✉️ Message sent to ${t.tutorName}`)}>
                        Contact Educator
                      </button>
                      <button
                        className="dash-btn-outline"
                        style={{ color: '#DC2626', borderColor: '#DC2626', fontWeight: 800 }}
                        onClick={() => handleDeEnrollTeacher(t)}
                      >
                        ❌ De-Enroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>📝 Assignments & Homework Drills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {assignmentsList.map((a) => (
                  <div key={a.id} style={{ border: '2px solid #173300', borderRadius: '1rem', padding: '1rem', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="notif-tag" style={{ backgroundColor: 'var(--yellow-accent)' }}>{a.subject}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: a.status === 'SUBMITTED' ? '#059669' : '#D97706' }}>
                        {a.status === 'SUBMITTED' ? '✅ SUBMITTED' : '⏳ DUE: ' + a.dueDate}
                      </span>
                    </div>
                    <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 800 }}>{a.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Teacher: {a.teacher}</p>
                    <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                      {a.status !== 'SUBMITTED' ? (
                        <button className="dash-btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={() => setShowAssignmentModal(a)}>
                          Upload Solution →
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>Solution Verified ✅</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROGRESS & SCORES */}
          {activeTab === 'progress' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>📈 Performance Analytics & Progress</h3>
              <div style={{ border: '2px solid #173300', borderRadius: '1rem', padding: '1.5rem', backgroundColor: '#FAF9F5' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>Overall Academic Performance: 88%</h4>
                <div className="meter-bg-bar" style={{ height: '14px', marginBottom: '1rem' }}>
                  <div className="meter-fill-bar" style={{ width: '88%', backgroundColor: '#059669' }}></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '0.75rem', border: '1.5px solid #173300' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>MATHEMATICS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#173300' }}>92%</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '0.75rem', border: '1.5px solid #173300' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>PHYSICS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#173300' }}>86%</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '0.75rem', border: '1.5px solid #173300' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>CHEMISTRY</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#173300' }}>90%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>🗓️ Live Weekly Class Timetable</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {enrolledTutorsList.map((t, idx) => (
                  <div key={idx} style={{ border: '2px solid #173300', borderRadius: '0.85rem', padding: '1rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{t.subject} Live Class</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Tutor: {t.tutorName} • {t.nextClass || 'Scheduled Weekly'}</div>
                    </div>
                    <button className="dash-btn-outline" onClick={() => setShowRescheduleModal(t)}>
                      Request Reschedule
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MESSAGES & NOTIFS */}
          {activeTab === 'messages' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>💬 Live Messages & Broadcast Feed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifs.map(n => (
                  <div key={n.id} style={{ border: '2px solid #173300', borderRadius: '1rem', padding: '1rem', backgroundColor: '#FAF9F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 800, color: '#173300' }}>👨‍🏫 {n.teacherName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{n.createdAt}</span>
                    </div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 800 }}>{n.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155' }}>{n.message}</p>
                    <form onSubmit={handleSendReply} style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Type reply to teacher..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ flex: 1, padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                      />
                      <button type="submit" className="dash-btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                        Send Reply
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="dash-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1rem' }}>⚙️ Student Account Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Grade / Standard</label>
                  <select className="form-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="5th Standard">5th Standard</option>
                    <option value="6th Standard">6th Standard</option>
                    <option value="7th Standard">7th Standard</option>
                    <option value="8th Standard">8th Standard</option>
                    <option value="9th Standard">9th Standard</option>
                    <option value="10th Standard">10th Standard</option>
                    <option value="11th Standard">11th Standard</option>
                    <option value="12th Standard">12th Standard</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Curriculum Board</label>
                  <select className="form-select" value={board} onChange={(e) => setBoard(e.target.value)}>
                    <option value="CBSE Board">CBSE Board</option>
                    <option value="ICSE Board">ICSE Board</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
                <button className="dash-btn-primary" onClick={() => triggerToast('✅ Account settings updated!')}>
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column / Sidebar Metrics */}
        <div className="dash-col-right">
          <div className="dash-card">
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>👤 Student Profile</h4>
            <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>Name: <strong>{student.name}</strong></div>
              <div>Grade: <strong>{student.grade}</strong></div>
              <div>Board: <strong>{student.board}</strong></div>
              <div>Unique PAR-CODE:</div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span className="marks-badge" style={{ backgroundColor: 'var(--yellow-accent)', color: '#173300', fontSize: '0.85rem' }}>
                  {student.parCode}
                </span>
                <button className="dash-btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <button className="dash-btn-outline" style={{ marginTop: '0.85rem', width: '100%' }} onClick={() => setShowProfileModal(true)}>
              ✏️ Edit Profile
            </button>
          </div>

          <div className="dash-card">
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>📌 Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="dash-btn-primary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => setShowDirectoryModal(true)}>
                🔍 Search All Tutors Directory
              </button>
              <button className="dash-btn-outline" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => triggerToast('📅 Opening calendar schedule...')}>
                🗓️ View Timetable Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULL KOPARGAON EDUCATOR DIRECTORY SEARCH & ENROLLMENT MODAL */}
      {showDirectoryModal && (
        <div className="modal-overlay" onClick={() => setShowDirectoryModal(false)}>
          <div className="modal-content" style={{ maxWidth: '900px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem' }}>🏫 Kopargaon Educator Directory</h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                  Browse & search 25 verified Kopargaon teachers for 5th Std to 12th Std with direct enrollment!
                </p>
              </div>
              <button className="modal-close-btn" style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 800 }} onClick={() => setShowDirectoryModal(false)}>✕</button>
            </div>

            {/* SEARCH & FILTERS CONTROLS */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Search by teacher name, subject, location, or qualification..."
                value={tutorSearch}
                onChange={(e) => setTutorSearch(e.target.value)}
                style={{ flex: 2, minWidth: '240px' }}
              />

              <select className="form-select" value={tutorFilterChip} onChange={(e) => setTutorFilterChip(e.target.value)} style={{ flex: 1, minWidth: '160px' }}>
                <option value="ALL">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Economics">Economics & Accounts</option>
                <option value="English">English</option>
                <option value="Computer">Computer Science</option>
              </select>

              <select className="form-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ flex: 1, minWidth: '150px' }}>
                <option value="ALL">All Standards</option>
                <option value="5th">5th Standard</option>
                <option value="6th">6th Standard</option>
                <option value="7th">7th Standard</option>
                <option value="8th">8th Standard</option>
                <option value="9th">9th Standard</option>
                <option value="10th">10th Standard</option>
                <option value="11th">11th Standard</option>
                <option value="12th">12th Standard</option>
              </select>
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '1rem' }}>
              FOUND {searchFilteredTeachers.length} VERIFIED TEACHERS IN KOPARGAON
            </div>

            {/* DIRECTORY TEACHERS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {searchFilteredTeachers.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FAF9F5', borderRadius: '1rem', border: '2px dashed #173300' }}>
                  <div style={{ fontSize: '2rem' }}>🔍</div>
                  <h4 style={{ margin: '0.5rem 0 0.2rem 0', fontWeight: 800 }}>No teachers match your search filters.</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>Try clearing your search or selecting "All Subjects".</p>
                </div>
              ) : (
                searchFilteredTeachers.map((t, idx) => {
                  const teacherName = t.name || t.tutorName;
                  const isEnrolled = enrolledTutorsList.some(
                    enr => (enr.tutorName || enr.name)?.toLowerCase() === teacherName?.toLowerCase() || enr.id === t.id
                  );

                  return (
                    <div key={idx} style={{
                      border: '2px solid #173300',
                      borderRadius: '1rem',
                      padding: '1rem',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '3px 3px 0px #173300',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          <img
                            src={t.photo || t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                            alt={teacherName}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #173300' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{teacherName}</h4>
                              <span className="marks-badge" style={{ backgroundColor: 'var(--yellow-accent)', color: '#173300', fontSize: '0.75rem' }}>
                                {t.matchPercentage || 96}% Fit
                              </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginTop: '0.1rem' }}>
                              {Array.isArray(t.subjects || t.subject) ? (t.subjects || t.subject).join(', ') : (t.subject || 'General')} • {Array.isArray(t.classes) ? t.classes.join(', ') : (t.gradeLevel || '5th to 12th Std')}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              📍 {t.location || 'Kopargaon Center'} • ⭐ {t.rating || 4.9} ({t.experienceYears || 8}+ Yrs Exp)
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                            ₹{t.hourlyRate || 500}<span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/hr</span>
                          </div>
                        </div>
                      </div>

                      {t.bio && (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.35 }}>
                          {t.bio}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                        {isEnrolled ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ padding: '0.4rem 0.85rem', borderRadius: '0.5rem', backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 800, fontSize: '0.85rem' }}>
                              ✅ ENROLLED
                            </span>
                            <button className="dash-btn-outline" style={{ color: '#DC2626', borderColor: '#DC2626', fontWeight: 800, fontSize: '0.85rem' }} onClick={() => handleDeEnrollTeacher(t)}>
                              ❌ De-Enroll
                            </button>
                          </div>
                        ) : (
                          <button className="dash-btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }} onClick={() => handleEnrollTeacher(t)}>
                            🚀 Enroll to Teacher Now
                          </button>
                        )}
                        <button
                          className="dash-btn-outline"
                          style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                          onClick={() => triggerToast(`📅 Free Demo requested with ${teacherName}!`)}
                        >
                          🎥 Book Demo
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPDATE PROFILE MODAL */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>✏️ Update Student Profile</h3>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Student Full Name</label>
                <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Class / Grade Level</label>
                <select className="form-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value="5th Standard">5th Standard</option>
                  <option value="6th Standard">6th Standard</option>
                  <option value="7th Standard">7th Standard</option>
                  <option value="8th Standard">8th Standard</option>
                  <option value="9th Standard">9th Standard</option>
                  <option value="10th Standard">10th Standard</option>
                  <option value="11th Standard">11th Standard</option>
                  <option value="12th Standard">12th Standard</option>
                </select>
              </div>
              <button type="submit" className="dash-btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                Save Profile Updates
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowAssignmentModal(null)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              📤 Submit Homework: {showAssignmentModal.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
              Subject: {showAssignmentModal.subject} • Assigned by {showAssignmentModal.teacher}
            </p>
            <form onSubmit={handleAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Your Solution / Written Answer Notes</label>
                <textarea className="form-input" rows={4} placeholder="Type your step-by-step solution here..." required></textarea>
              </div>
              <button type="submit" className="dash-btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                Submit Assignment Solution 🎉
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(null)}>
          <div className="modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              🗓️ Reschedule {showRescheduleModal.subject} Class
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
              Tutor: {showRescheduleModal.tutorName}
            </p>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Preferred New Date & Time</label>
              <input type="text" className="form-input" placeholder="e.g. Saturday at 4:00 PM" required />
            </div>
            <button
              className="dash-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              onClick={() => { setShowRescheduleModal(null); triggerToast('📅 Reschedule request sent to educator!'); }}
            >
              Send Reschedule Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
