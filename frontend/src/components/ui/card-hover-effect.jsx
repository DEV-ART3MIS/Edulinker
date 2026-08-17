import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const HoverEffect = ({ items, className = '' }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        padding: '1.5rem 0'
      }}
      className={className}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link || '#'}
          key={item?.link || idx}
          style={{
            position: 'relative',
            display: 'block',
            padding: '0.25rem',
            height: '100%',
            width: '100%',
            textDecoration: 'none',
            color: 'inherit'
          }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                style={{
                  position: 'absolute',
                  inset: 0,
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'var(--yellow-accent, #FFDE59)',
                  borderRadius: '1.5rem',
                  display: 'block',
                  border: '2.5px solid #173300',
                  boxShadow: '4px 6px 0px #173300',
                  zIndex: 0
                }}
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({ className = '', children }) => {
  return (
    <div
      style={{
        borderRadius: '1.25rem',
        height: '100%',
        width: '100%',
        padding: '1.5rem',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #173300',
        position: 'relative',
        zIndex: 20,
        boxShadow: '4px 6px 0px #173300',
        transition: 'transform 0.2s ease'
      }}
      className={className}
    >
      <div style={{ position: 'relative', zIndex: 50 }}>
        <div style={{ padding: '0.2rem 0' }}>{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className = '', children }) => {
  return (
    <h4
      style={{
        color: '#173300',
        fontWeight: 800,
        letterSpacing: '0.02em',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        fontSize: '1.25rem'
      }}
      className={className}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({ className = '', children }) => {
  return (
    <p
      style={{
        marginTop: '0.5rem',
        color: '#475569',
        letterSpacing: '0.01em',
        lineHeight: 1.6,
        fontSize: '0.92rem'
      }}
      className={className}
    >
      {children}
    </p>
  );
};
