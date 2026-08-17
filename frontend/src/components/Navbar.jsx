import React from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar({ onNavigate, activePortalRole = 'student', userName = '', hasCompletedPsychometric = false }) {
  const { isSignedIn, user } = useUser() || {};
  const displayName = userName || user?.firstName || user?.fullName || localStorage.getItem('edulinker_user_name') || 'Samruddhi';

  const handleDashboardBtnClick = () => {
    onNavigate(`${activePortalRole}-dashboard`);
  };

  return (
    <div className="navbar-wrapper">
      <header className="navbar container">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }} className="logo-group">
          <div className="logo-text">EduLinker</div>
        </a>

        <nav>
          <ul className="nav-links">
            <li><a href="#simulator" className="nav-link" onClick={() => onNavigate('landing')}>Match Engine</a></li>
            <li><a href="#features" className="nav-link" onClick={() => onNavigate('landing')}>Why EduLinker</a></li>
            <li><a href="#tutor-directory" className="nav-link" onClick={() => onNavigate('landing')}>Explore Tutors</a></li>
          </ul>
        </nav>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          {/* DASHBOARD ACTION BUTTON - ONLY SHOWN AFTER SIGNED IN & PSYCHOMETRIC TEST COMPLETED */}
          {isSignedIn && hasCompletedPsychometric && (
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'capitalize' }}
              onClick={handleDashboardBtnClick}
            >
              🎓 {displayName}'s Dashboard
            </button>
          )}

          <SignedOut>
            <button
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
              onClick={() => onNavigate('sign-in')}
            >
              Sign In
            </button>

            <button
              className="btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
              onClick={() => onNavigate('sign-up')}
            >
              Get Started →
            </button>
          </SignedOut>

          <SignedIn>
            <UserButton showName appearance={{ elements: { userButtonBox: { flexDirection: 'row-reverse' } } }} />
          </SignedIn>
        </div>
      </header>
    </div>
  );
}
