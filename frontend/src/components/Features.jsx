import React from 'react';
import { HoverEffect } from './ui/card-hover-effect';

export const featuresList = [
  {
    title: 'Degree & KYC Verified',
    description:
      'Every tutor passes strict background checks, government ID verification, and degree certification auditing before taking their first student.',
    link: '#tutor-directory'
  },
  {
    title: 'Algorithmic Match Score',
    description:
      'No random assignment. Our multi-variable algorithm scores tutors on curriculum alignment, grade expertise, and teaching style fit.',
    link: '#simulator'
  },
  {
    title: 'Free 1-on-1 Demo Session',
    description:
      'Request a risk-free 30-minute trial demo before locking in any weekly subscription or hourly tutoring package.',
    link: '#tutor-directory'
  },
  {
    title: 'Transparent Direct Rates',
    description:
      'Zero hidden middleman agency commissions. Tutors set their true hourly rates and parents pay straightforward transparent fees.',
    link: '#tutor-directory'
  }
];

export default function Features() {
  return (
    <section className="features-section container" id="features">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--terracotta)', textAlign: 'center', marginBottom: '0.5rem' }}>
        / THE EDULINKER DIFFERENCE
      </div>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '1rem' }}>
        Built for parents who demand verified results.
      </h2>

      <div className="max-w-5xl mx-auto px-4">
        <HoverEffect items={featuresList} />
      </div>
    </section>
  );
}
