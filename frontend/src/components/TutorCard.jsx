import React from 'react';
import { useUser } from '@clerk/clerk-react';

export default function TutorCard({ tutor, onBookDemo, hasCompletedPsychometric }) {
  const { isSignedIn } = useUser() || {};

  // Show match score percentage ONLY IF registered AND completed psychometric test
  const showMatchBadge = Boolean(isSignedIn && hasCompletedPsychometric && tutor.matchScore);

  return (
    <div className="tutor-card" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {showMatchBadge && (
        <div className="match-score-badge">
          ⚡ {tutor.matchScore}% MATCH
        </div>
      )}

      <div>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingRight: showMatchBadge ? '75px' : '0px'
        }}>
          <img src={tutor.avatar} alt={tutor.name} className="tutor-avatar" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span>{tutor.name}</span>
              {tutor.isVerified && (
                <span
                  className="instagram-verified-tick"
                  title="Verified Educator"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '19px',
                    height: '19px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}
                >
                  ✓
                </span>
              )}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', fontWeight: 500, marginTop: '0.15rem' }}>{tutor.title}</div>
            <div style={{ fontSize: '0.85rem', color: '#DD6C3E', fontWeight: 700, marginTop: '0.2rem' }}>
              ★ {tutor.rating} <span style={{ color: '#555', fontWeight: 400 }}>({tutor.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
          {tutor.subjects?.map((s) => (
            <span key={s} className="meta-pill" style={{ background: '#A8E5E5' }}>{s}</span>
          ))}
          {tutor.boards?.map((b) => (
            <span key={b} className="meta-pill" style={{ background: '#F6D0FF' }}>{b}</span>
          ))}
          <span className="meta-pill" style={{ background: '#FDE68A' }}>{tutor.mode}</span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '1.25rem' }}>{tutor.bio}</p>
      </div>

      <div style={{ borderTop: '1.5px dashed var(--border-dashed)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
          ₹{tutor.hourlyRate} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-body)' }}>/ hr</span>
        </div>
        <button className="btn-primary" onClick={() => onBookDemo(tutor)}>
          Book Demo
        </button>
      </div>
    </div>
  );
}
