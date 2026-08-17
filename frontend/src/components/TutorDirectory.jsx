import React, { useState } from 'react';
import TutorCard from './TutorCard';
import { FocusCards } from '@/components/ui/focus-cards';

export default function TutorDirectory({ tutors, activeChip, onSelectChip, onBookDemo, hasCompletedPsychometric }) {
  const [selectedGradeTier, setSelectedGradeTier] = useState('ALL');
  const subjects = ['ALL', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accountancy & Economics', 'English Literature'];

  const gradeTiers = [
    { id: 'ALL', label: 'All 50 Educators' },
    { id: '5th to 8th Standard', label: '🌱 5th to 8th Std (Foundation)' },
    { id: '9th to 10th Standard', label: '🎓 9th & 10th Std (Board Specialists)' },
    { id: '11th to 12th Standard', label: '🚀 11th & 12th Std (Entrance & Stream Experts)' }
  ];

  // Filter tutors by Grade Tier and Subject
  const filteredTutors = tutors.filter((t) => {
    const matchesSubject = activeChip === 'ALL' || (t.subjects && t.subjects.includes(activeChip));
    const matchesGradeTier = selectedGradeTier === 'ALL' ||
      t.gradeTier === selectedGradeTier ||
      (t.classes && t.classes.some(c => c.includes(selectedGradeTier.split(' ')[0])));
    return matchesSubject && matchesGradeTier;
  });

  return (
    <section className="tutor-section container" id="tutor-directory">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>🏫 Verified Kopargaon Tutors Directory</h2>
          <p style={{ color: 'var(--text-body)', fontWeight: 500, margin: '0.3rem 0 0 0' }}>
            Explore 50 verified educators categorized by grade level (5th-8th, 9th-10th, 11th-12th) and subject specializations.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="marks-badge" style={{ backgroundColor: 'var(--pastel-mint)', color: '#065F46', fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
            SHOWING {filteredTutors.length} VERIFIED TEACHERS
          </span>
        </div>
      </div>

      {/* GRADE TIER SELECTOR TABS */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {gradeTiers.map((tier) => (
          <button
            key={tier.id}
            className={`tab-btn ${selectedGradeTier === tier.id ? 'active' : ''}`}
            onClick={() => setSelectedGradeTier(tier.id)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '0.75rem',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              border: selectedGradeTier === tier.id ? '2px solid #173300' : '2px solid #E2E8F0',
              backgroundColor: selectedGradeTier === tier.id ? '#173300' : '#FFFFFF',
              color: selectedGradeTier === tier.id ? '#FFFFFF' : '#334155'
            }}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* SUBJECT FILTER CHIPS */}
      <div className="filter-chips" style={{ marginBottom: '2rem' }}>
        {subjects.map((subj) => (
          <button
            key={subj}
            className={`chip ${activeChip === subj ? 'active' : ''}`}
            onClick={() => onSelectChip(subj)}
          >
            {subj === 'ALL' ? 'All Subjects' : subj}
          </button>
        ))}
      </div>

      <FocusCards>
        {filteredTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} onBookDemo={onBookDemo} hasCompletedPsychometric={hasCompletedPsychometric} />
        ))}
      </FocusCards>
    </section>
  );
}
