import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoBanner from './components/VideoBanner';
import Simulator from './components/Simulator';
import Features from './components/Features';
import TutorDirectory from './components/TutorDirectory';
import DemoModal from './components/DemoModal';
import Toast from './components/Toast';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import LoaderScreen from './components/LoaderScreen';

import DashboardLayout from './components/dashboards/DashboardLayout';
import StudentDashboard from './components/dashboards/StudentDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

import {
  fetchTutors,
  calculateMatch,
  requestDemo,
  fetchStudentDashboard,
  fetchTeacherDashboard,
  fetchParentDashboard,
  fetchAdminDashboard,
  linkParentParCode,
  sendTeacherNotificationApi,
  approveKyc,
  generateParCode,
  enrollStudentApi,
  unenrollStudentApi,
  syncUsersApi
} from './services/api';

export default function App() {
  const { isSignedIn, user } = useUser() || {};

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'sign-in' | 'sign-up' | 'student-dashboard' | 'teacher-dashboard' | 'parent-dashboard' | 'admin-dashboard'
  const [activePortalRole, setActivePortalRole] = useState(() => localStorage.getItem('edulinker_user_role') || 'student'); // 'student' | 'teacher' | 'parent' | 'admin'

  const userName = user?.fullName || user?.firstName || user?.username || localStorage.getItem('edulinker_user_name') || 'Samruddhi';

  const [tutors, setTutors] = useState([]);
  const [activeChip, setActiveChip] = useState('ALL');
  const [hasCompletedPsychometric, setHasCompletedPsychometric] = useState(() => localStorage.getItem('edulinker_psychometric_completed') === 'true');
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState(null);
  const [demoAuthModalTutor, setDemoAuthModalTutor] = useState(null);

  const [studentDashData, setStudentDashData] = useState(null);
  const [teacherDashData, setTeacherDashData] = useState(null);
  const [parentDashData, setParentDashData] = useState(null);
  const [adminDashData, setAdminDashData] = useState(null);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (user?.fullName) {
      localStorage.setItem('edulinker_user_name', user.fullName);
    } else if (user?.firstName) {
      localStorage.setItem('edulinker_user_name', user.firstName);
    }

    if (user) {
      const uData = {
        id: user.id,
        name: user.fullName || user.firstName || 'EduLinker User',
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || 'user@example.com',
        role: activePortalRole || 'student',
        grade: localStorage.getItem('edulinker_grade') || '10th Standard',
        board: localStorage.getItem('edulinker_board') || 'CBSE Board'
      };
      syncUsersApi(uData).catch(err => console.error('Auto user sync error:', err));
    }
  }, [user, activePortalRole]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleNavigate = (view) => {
    if (view.endsWith('-dashboard') || view === 'dashboard') {
      if (!isSignedIn) {
        addToast('🔒 Please Sign In or Sign Up first to access your Dashboard!');
        setCurrentView('sign-in');
        return;
      }
      if (!hasCompletedPsychometric) {
        addToast('🎯 Please complete your Psychometric Match Test first to unlock your Dashboard!');
        setCurrentView('landing');
        setTimeout(() => {
          const el = document.getElementById('simulator');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }
    }
    setCurrentView(view);
  };

  const loadTutors = async (subject = 'ALL') => {
    try {
      const data = await fetchTutors(subject);
      if (data.success) {
        setTutors(data.tutors);
      }
    } catch (err) {
      console.error('Error fetching tutors:', err);
    }
  };

  const loadDashboards = async () => {
    try {
      const userCode = generateParCode(userName);
      const [sData, tData, pData, aData] = await Promise.all([
        fetchStudentDashboard(userCode),
        fetchTeacherDashboard(userName),
        fetchParentDashboard(userCode),
        fetchAdminDashboard()
      ]);

      if (sData.success) setStudentDashData(sData);
      if (tData.success) setTeacherDashData(tData);
      if (pData.success) setParentDashData(pData);
      if (aData.success) setAdminDashData(aData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  useEffect(() => {
    loadTutors();
    loadDashboards();
  }, [userName]);

  const handleRunMatch = (matchedTutors) => {
    setHasCompletedPsychometric(true);
    localStorage.setItem('edulinker_psychometric_completed', 'true');
    if (Array.isArray(matchedTutors)) {
      setTutors(matchedTutors);
    }
    loadDashboards();
    setActivePortalRole('student');
    localStorage.setItem('edulinker_user_role', 'student');

    if (isSignedIn) {
      addToast('🎯 Psychometric evaluation completed! Opening your Student Dashboard...');
      setCurrentView('student-dashboard');
    } else {
      addToast('🎯 Psychometric evaluation completed! Please Sign In or Sign Up to view your Dashboard.');
      setCurrentView('sign-in');
    }
  };

  const handleBookDemo = (tutor) => {
    if (!isSignedIn) {
      setDemoAuthModalTutor(tutor);
    } else {
      setSelectedTutorForDemo(tutor);
    }
  };

  const handleSubmitDemo = async (demoPayload) => {
    try {
      const res = await requestDemo(demoPayload);
      if (res.success) {
        addToast(`✅ Demo requested with ${demoPayload.tutorName}!`);
        setSelectedTutorForDemo(null);
        loadDashboards();
      }
    } catch (err) {
      addToast('❌ Failed to request demo.');
    }
  };

  const handlePortalSwitch = (role) => {
    setActivePortalRole(role);
    localStorage.setItem('edulinker_user_role', role);
    handleNavigate(`${role}-dashboard`);
  };

  const handleLinkParCode = async (parCode) => {
    try {
      const res = await linkParentParCode(parCode, userName, 'parent@example.com');
      if (res.success) {
        addToast(`✅ Linked with Student PAR-CODE: ${parCode}!`);
        loadDashboards();
      }
    } catch (err) {
      addToast('❌ Error linking account.');
    }
  };

  const handleSendNotification = async (payload) => {
    try {
      const res = await sendTeacherNotificationApi({ ...payload, teacherName: userName });
      if (res.success) {
        addToast('📢 Notification broadcasted to Student & Parent!');
        loadDashboards();
      }
    } catch (err) {
      addToast('❌ Error sending notification.');
    }
  };

  const handleApproveKycAdmin = async (tutorId) => {
    try {
      await approveKyc(tutorId);
      addToast(`🛡️ KYC approved for tutor ${tutorId}`);
      loadDashboards();
    } catch (err) {
      addToast('❌ Error approving KYC.');
    }
  };

  const handleEnrollTutor = async (tutor) => {
    try {
      const userCode = generateParCode(userName);
      const tutorName = tutor.name || tutor.tutorName;
      const subject = Array.isArray(tutor.subject) ? tutor.subject[0] : (tutor.subject || 'General');
      await enrollStudentApi({ parCode: userCode, studentName: userName, tutorName, subject });
      loadDashboards();
    } catch (err) {
      console.error('Error enrolling tutor:', err);
    }
  };

  const handleDeEnrollTutor = async (tutor) => {
    try {
      const userCode = generateParCode(userName);
      const tutorName = tutor.tutorName || tutor.name;
      const subject = Array.isArray(tutor.subject) ? tutor.subject[0] : (tutor.subject || 'General');
      await unenrollStudentApi({ parCode: userCode, studentName: userName, tutorName, subject });
      loadDashboards();
    } catch (err) {
      console.error('Error de-enrolling tutor:', err);
    }
  };

  // Render Dashboard Views
  if (currentView.endsWith('-dashboard') || currentView === 'dashboard') {
    if (!isSignedIn || !hasCompletedPsychometric) {
      handleNavigate(currentView);
    }
    const role = currentView.startsWith('dashboard') ? activePortalRole : currentView.replace('-dashboard', '');
    return (
      <DashboardLayout
        activePortal={role}
        userName={userName}
        onSwitchPortal={handlePortalSwitch}
        onLogout={() => setCurrentView('landing')}
        onOpenNotifications={() => addToast('🔔 3 new notifications in your feed.')}
      >
        {role === 'student' && (
          <StudentDashboard
            dashboardData={studentDashData}
            userName={userName}
            allTutors={tutors}
            onEnrollTutor={handleEnrollTutor}
            onDeEnrollTutor={handleDeEnrollTutor}
            onNavigateToDirectory={() => setCurrentView('landing')}
            onCopyCodeSuccess={() => addToast('📋 PAR-CODE copied to clipboard!')}
          />
        )}
        {role === 'teacher' && (
          <TeacherDashboard
            dashboardData={teacherDashData}
            userName={userName}
            onSendNotification={handleSendNotification}
          />
        )}
        {role === 'parent' && (
          <ParentDashboard
            dashboardData={parentDashData}
            userName={userName}
            onLinkParCode={handleLinkParCode}
          />
        )}
        {role === 'admin' && (
          <AdminDashboard
            dashboardData={adminDashData}
            onApproveKyc={handleApproveKycAdmin}
          />
        )}
        <Toast toasts={toasts} />
      </DashboardLayout>
    );
  }

  if (currentView === 'sign-in') {
    return (
      <div>
        <Navbar onNavigate={handleNavigate} activePortalRole={activePortalRole} userName={userName} hasCompletedPsychometric={hasCompletedPsychometric} />
        <SignInPage
          onNavigate={handleNavigate}
          onSelectRole={(role) => {
            setActivePortalRole(role);
            localStorage.setItem('edulinker_user_role', role);
          }}
        />
        <Toast toasts={toasts} />
      </div>
    );
  }

  if (currentView === 'sign-up') {
    return (
      <div>
        <Navbar onNavigate={handleNavigate} activePortalRole={activePortalRole} userName={userName} hasCompletedPsychometric={hasCompletedPsychometric} />
        <SignUpPage
          onNavigate={handleNavigate}
          onSelectRole={(role) => {
            setActivePortalRole(role);
            localStorage.setItem('edulinker_user_role', role);
          }}
        />
        <Toast toasts={toasts} />
      </div>
    );
  }

  return (
    <div>
      <Navbar onNavigate={handleNavigate} activePortalRole={activePortalRole} userName={userName} hasCompletedPsychometric={hasCompletedPsychometric} />
      <Hero />
      <VideoBanner />
      <div className="container">
        <Simulator
          onRunMatch={handleRunMatch}
          onNavigate={handleNavigate}
          onBookDemo={handleBookDemo}
        />
      </div>
      <Features />
      <TutorDirectory
        tutors={tutors}
        activeChip={activeChip}
        onSelectChip={(chip) => setActiveChip(chip)}
        onBookDemo={handleBookDemo}
        hasCompletedPsychometric={hasCompletedPsychometric}
      />

      <DemoModal
        tutor={selectedTutorForDemo}
        onClose={() => setSelectedTutorForDemo(null)}
        onSubmitDemo={handleSubmitDemo}
      />

      {/* Global Auth Redirection Modal when booking demo as unauthenticated user */}
      {demoAuthModalTutor && (
        <div className="modal-overlay" onClick={() => setDemoAuthModalTutor(null)}>
          <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Sign In Required to Book Demo
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
              To book a free demo session with <strong>{demoAuthModalTutor.name}</strong>, please sign in to your EduLinker account.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={() => { setDemoAuthModalTutor(null); setCurrentView('sign-in'); }}
              >
                Already Registered? Log In (Sign In)
              </button>

              <button
                className="btn-secondary"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={() => { setDemoAuthModalTutor(null); setCurrentView('sign-up'); }}
              >
                New User? Create Account (Sign Up)
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoadingScreen && <LoaderScreen onComplete={() => setIsLoadingScreen(false)} />}

      <Toast toasts={toasts} />
    </div>
  );
}
