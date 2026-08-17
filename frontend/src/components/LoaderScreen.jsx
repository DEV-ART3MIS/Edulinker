import React, { useState, useEffect } from 'react';

export default function LoaderScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing EduLinker Network...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const statuses = [
      'Connecting to Neon PostgreSQL Database...',
      'Loading 50 Verified Kopargaon Educators...',
      'Configuring 5th to 12th Grade Tiers...',
      'Syncing Academic Fit Engine...',
      'EduLinker Network Ready!'
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(timer);
          setStatusText(statuses[4]);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 650); // duration of exit animation
          }, 350);
          return 100;
        }

        // Update status message based on progress bracket
        if (next < 25) setStatusText(statuses[0]);
        else if (next < 55) setStatusText(statuses[1]);
        else if (next < 80) setStatusText(statuses[2]);
        else setStatusText(statuses[3]);

        return next;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`vector-loader-overlay ${isExiting ? 'exit-reveal' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#0D1E00', // Premium EduLinker Dark Olive Background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        overflow: 'hidden',
        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Dynamic Vector Background Grid & Particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(217, 249, 157, 0.12) 0%, transparent 60%),
                            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          opacity: 0.8
        }}
      />

      {/* VECTOR DRAWING CONTAINER */}
      <div style={{ position: 'relative', width: '240px', height: '240px', marginBottom: '2rem' }}>
        {/* Outer Orbiting Glow Ring */}
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, animation: 'spinVector 12s linear infinite' }}
        >
          <circle
            cx="120"
            cy="120"
            r="110"
            stroke="url(#orbitGradient)"
            strokeWidth="2"
            strokeDasharray="12 8"
          />
          <defs>
            <linearGradient id="orbitGradient" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D9F99D" />
              <stop offset="0.5" stopColor="#10B981" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulsing Aura Circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: 'rgba(217, 249, 157, 0.08)',
            border: '1.5px solid rgba(217, 249, 157, 0.3)',
            boxShadow: '0 0 40px rgba(217, 249, 157, 0.25)',
            animation: 'pulseAura 2.5s ease-in-out infinite'
          }}
        />

        {/* MAIN VECTOR ART SVG: GRADUATION CAP & ACADEMIC EMBLEM */}
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {/* Animated Vector Shield Outline */}
          <path
            d="M120 30L180 55V115C180 155 154 191 120 205C86 191 60 155 60 115V55L120 30Z"
            stroke="#D9F99D"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="vector-draw-path"
            style={{
              strokeDasharray: '600',
              strokeDashoffset: `${600 - (600 * progress) / 100}`,
              transition: 'stroke-dashoffset 0.15s ease-out',
              filter: 'drop-shadow(0 0 8px #D9F99D)'
            }}
          />

          {/* Inner Vector Graduation Cap */}
          <path
            d="M120 75L160 95L120 115L80 95L120 75Z"
            fill="url(#capGrad)"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M95 103V125C95 133 106 140 120 140C134 140 145 133 145 125V103"
            stroke="#D9F99D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Cap Tassel */}
          <path
            d="M160 95V130C160 135 163 138 165 140"
            stroke="#FDE047"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="165" cy="142" r="3" fill="#FDE047" />

          {/* Vector Network Nodes & Connecting Lines */}
          <circle cx="120" cy="50" r="4" fill="#D9F99D" />
          <circle cx="80" cy="120" r="4" fill="#10B981" />
          <circle cx="160" cy="120" r="4" fill="#3B82F6" />
          <circle cx="120" cy="180" r="5" fill="#FDE047" />

          <defs>
            <linearGradient id="capGrad" x1="80" y1="75" x2="160" y2="115" gradientUnits="userSpaceOnUse">
              <stop stopColor="#173300" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* BRAND & TITLE */}
      <div style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            margin: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #D9F99D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          EduLinker
        </h1>
        <p style={{ margin: '0.3rem 0 1.5rem 0', fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          5th–12th Grade Educator Match Platform
        </p>

        {/* PROGRESS BAR */}
        <div
          style={{
            width: '280px',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            overflow: 'hidden',
            margin: '0 auto 1rem auto',
            border: '1px solid rgba(217, 249, 157, 0.2)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #10B981 0%, #D9F99D 50%, #FDE047 100%)',
              borderRadius: '999px',
              transition: 'width 0.15s ease-out',
              boxShadow: '0 0 12px #D9F99D'
            }}
          />
        </div>

        {/* PERCENTAGE & DYNAMIC STATUS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '280px', margin: '0 auto', fontSize: '0.82rem', fontFamily: 'monospace' }}>
          <span style={{ color: '#D9F99D', fontWeight: 700 }}>{statusText}</span>
          <span style={{ color: '#FDE047', fontWeight: 900 }}>{progress}%</span>
        </div>
      </div>

      {/* KEYFRAME ANIMATION STYLES */}
      <style>{`
        @keyframes spinVector {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseAura {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
        }
        .vector-loader-overlay.exit-reveal {
          opacity: 0 !important;
          transform: scale(1.06) !important;
          filter: blur(8px) !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
