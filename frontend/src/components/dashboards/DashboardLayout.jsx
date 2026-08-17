import React, { useState } from 'react';
import { generateParCode } from '../../services/api';

export default function DashboardLayout({
  activePortal = 'student', // 'student' | 'teacher' | 'parent' | 'admin'
  userName = 'Samruddhi',
  onLogout,
  children,
  notificationCount = 3,
  onOpenNotifications
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const portalConfig = {
    student: {
      badge: '🎒 STUDENT PORTAL',
      title: 'Student Dashboard',
      subtitle: `Welcome back, ${userName}! Grade 10 — 3 subjects enrolled 📚`,
      menu: [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'tutors', label: 'Find Teachers', icon: '🔍' },
        { id: 'enrollments', label: 'My Enrollments', icon: '📚' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'progress', label: 'Progress & Scores', icon: '📈' },
        { id: 'schedule', label: 'Schedule', icon: '🗓️' },
        { id: 'messages', label: 'Messages & Notifs', icon: '💬' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ]
    },
    teacher: {
      badge: '🧑‍🏫 TEACHER PORTAL',
      title: 'Teacher Dashboard',
      subtitle: `Welcome, ${userName}! Kopargaon, Maharashtra 🏫`,
      menu: [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'classes', label: 'My Classes', icon: '🏫' },
        { id: 'requests', label: 'Student Requests', icon: '📩' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'attendance', label: 'Attendance Log', icon: '✅' },
        { id: 'broadcast', label: 'Send Announcement', icon: '📢' },
        { id: 'schedule', label: 'Schedule', icon: '🗓️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ]
    },
    parent: {
      badge: '👨‍👩‍👧 PARENT PORTAL',
      title: 'Parent Dashboard',
      subtitle: `Tracking child progress for ${userName} (Code: ${generateParCode(userName)}) 🎯`,
      menu: [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'scoresheet', label: 'Child Score Sheet', icon: '📋' },
        { id: 'attendance', label: 'Attendance Track', icon: '✅' },
        { id: 'tutors', label: 'Enrolled Tutors', icon: '👨‍🏫' },
        { id: 'notifications', label: 'Teacher Updates', icon: '🔔' },
        { id: 'settings', label: 'Account Settings', icon: '⚙️' }
      ]
    },
    admin: {
      badge: '👑 ADMIN PORTAL',
      title: 'Admin Dashboard',
      subtitle: `System Control Center • EduLinker Operations 🛡️`,
      menu: [
        { id: 'overview', label: 'Overview & Stats', icon: '📊' },
        { id: 'kyc', label: 'Teacher KYC Approvals', icon: '🛡️' },
        { id: 'tutors', label: 'Tutor Directory', icon: '👨‍🏫' },
        { id: 'demos', label: 'Demo Bookings', icon: '📅' },
        { id: 'links', label: 'Parent-Student Links', icon: '🔗' },
        { id: 'settings', label: 'System Settings', icon: '⚙️' }
      ]
    }
  };

  const currentConfig = portalConfig[activePortal] || portalConfig.student;

  return (
    <div className="dash-root-container">
      {/* Left Sidebar (Responsive Overlay for Mobile) */}
      <aside className={`dash-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="dash-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🎓</span>
              <span className="logo-text">EduLinker</span>
            </div>
            <button className="mobile-close-btn" onClick={() => setMobileSidebarOpen(false)}>✕</button>
          </div>
          <span className="portal-pill-badge">{currentConfig.badge}</span>
        </div>

        {/* Navigation Menu */}
        <nav className="dash-nav-list">
          {currentConfig.menu.map((item) => (
            <button
              key={item.id}
              className={`dash-nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileSidebarOpen(false);
              }}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="dash-sidebar-footer">
          <div className="dash-user-avatar">
            {activePortal === 'student' && '👧'}
            {activePortal === 'teacher' && '🧑‍🏫'}
            {activePortal === 'parent' && '👨‍👩‍👧'}
            {activePortal === 'admin' && '👑'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dash-user-name">
              {userName}
            </div>
            <div className="dash-user-role" style={{ textTransform: 'capitalize' }}>
              {activePortal} Account
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dash-main-wrapper">
        {/* Top Header Bar */}
        <header className="dash-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="mobile-menu-toggle" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              ☰ Menu
            </button>
            <div>
              <h1 className="dash-header-title">{currentConfig.title}</h1>
              <p className="dash-header-subtitle">{currentConfig.subtitle}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Notification Bell */}
            <button className="dash-icon-btn" title="Notifications" onClick={onOpenNotifications}>
              <span>🔔</span>
              {notificationCount > 0 && <span className="dash-notif-badge">{notificationCount}</span>}
            </button>

            <button className="dash-logout-btn" style={{ backgroundColor: 'var(--yellow-accent)', color: '#173300' }} onClick={onLogout}>
              🏠 Return to Home
            </button>

            {/* Logout / Exit */}
            <button className="dash-logout-btn" onClick={onLogout}>
              🚪 Log Out
            </button>
          </div>
        </header>

        {/* Body Content with activeTab passed */}
        <main className="dash-body-content">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { activeTab });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
}
