import React from 'react';

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-tag-pill">
        <span>✨ ANTI-GENERIC MARKETPLACE</span>
        <span>•</span>
      </div>

      <h1 className="hero-title">
        Find the perfect tutor for your child. <br />
        <span className="highlight">Zero scope creep</span> in learning.
      </h1>

      <p className="hero-subtitle">
        EduLinker algorithms match your student's exact curriculum (CBSE, ICSE, IB), grade level, and subject goals with top-tier educators in 0.4 seconds.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <a href="#simulator" className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.85rem 1.75rem' }}>
          Launch Match Calculator →
        </a>
        <a href="#tutor-directory" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '0.85rem 1.75rem' }}>
          Browse 1,200+ Tutors
        </a>
      </div>
    </section>
  );
}
