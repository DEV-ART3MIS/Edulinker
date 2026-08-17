import React from 'react';

export default function VideoBanner() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1.5rem 0 2.5rem 0', padding: 0, textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', padding: '0 1rem' }}>
        <video
          src="/background-after-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '520px',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent'
          }}
        />
      </div>
    </div>
  );
}
