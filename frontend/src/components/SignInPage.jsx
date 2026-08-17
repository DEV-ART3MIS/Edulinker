import React, { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage({ onNavigate, onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState('student');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (onSelectRole) onSelectRole(role);
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: 'var(--bg-cream)',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
          style={{ textDecoration: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}
        >
          ← Back to EduLinker
        </a>
      </div>

      <div style={{
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
        border: '2.5px solid var(--text-primary)',
        borderRadius: '1.25rem',
        boxShadow: '6px 8px 0px var(--text-primary)',
        backgroundColor: '#FFFFFF',
        padding: '1.75rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ margin: '0 0 0.25rem 0', fontWeight: 800, textAlign: 'center', fontSize: '1.5rem' }}>
          Sign In to EduLinker
        </h2>
        <p style={{ textAlign: 'center', color: '#64748B', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
          Select your account role to proceed
        </p>

        {/* 3 Role Selector Buttons: Student, Teacher, Parent */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', width: '100%', marginBottom: '1.25rem' }}>
          <button
            className={`dash-btn-outline ${selectedRole === 'student' ? 'active' : ''}`}
            style={{
              backgroundColor: selectedRole === 'student' ? 'var(--yellow-accent)' : '#FFFFFF',
              textAlign: 'center',
              padding: '0.6rem 0.4rem',
              fontSize: '0.88rem',
              fontWeight: 800
            }}
            onClick={() => handleRoleSelect('student')}
          >
            👦 Student
          </button>

          <button
            className={`dash-btn-outline ${selectedRole === 'teacher' ? 'active' : ''}`}
            style={{
              backgroundColor: selectedRole === 'teacher' ? 'var(--yellow-accent)' : '#FFFFFF',
              textAlign: 'center',
              padding: '0.6rem 0.4rem',
              fontSize: '0.88rem',
              fontWeight: 800
            }}
            onClick={() => handleRoleSelect('teacher')}
          >
            🧑‍🏫 Teacher
          </button>

          <button
            className={`dash-btn-outline ${selectedRole === 'parent' ? 'active' : ''}`}
            style={{
              backgroundColor: selectedRole === 'parent' ? 'var(--yellow-accent)' : '#FFFFFF',
              textAlign: 'center',
              padding: '0.6rem 0.4rem',
              fontSize: '0.88rem',
              fontWeight: 800
            }}
            onClick={() => handleRoleSelect('parent')}
          >
            👨‍👩‍👧 Parent
          </button>
        </div>

        {/* Centered Sign In Form */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1.5px dashed var(--border-dashed)',
          paddingTop: '1.25rem'
        }}>
          <SignIn
            routing="virtual"
            signUpUrl="#sign-up"
            fallbackRedirectUrl={`#${selectedRole}-dashboard`}
          />
        </div>
      </div>
    </div>
  );
}
