import React, { useState } from 'react';

export const Card = React.memo(({ card, index, hovered, setHovered, renderCard }) => {
  const isHovered = hovered === index;
  const isAnyHovered = hovered !== null;
  const isBlurred = isAnyHovered && !isHovered;

  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: isBlurred ? 'blur(4px)' : 'none',
        opacity: isBlurred ? 0.6 : 1,
        transform: isHovered ? 'scale(1.02)' : isBlurred ? 'scale(0.98)' : 'scale(1)',
        zIndex: isHovered ? 10 : 1,
        position: 'relative'
      }}
    >
      {renderCard ? (
        renderCard(card, index)
      ) : (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1.25rem',
            height: '22rem',
            width: '100%',
            backgroundColor: '#173300',
            border: '2.5px solid #173300',
            boxShadow: '4px 6px 0px #173300'
          }}
        >
          {card.src && (
            <img
              src={card.src}
              alt={card.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '1.5rem',
              transition: 'opacity 0.3s ease',
              opacity: isHovered ? 1 : 0.8
            }}
          >
            <div style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800 }}>
              {card.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export function FocusCards({ cards, children, renderCard, className = '' }) {
  const [hovered, setHovered] = useState(null);

  if (children) {
    const childrenArray = React.Children.toArray(children);
    return (
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          width: '100%',
          alignItems: 'stretch'
        }}
      >
        {childrenArray.map((child, index) => {
          const isHovered = hovered === index;
          const isAnyHovered = hovered !== null;
          const isBlurred = isAnyHovered && !isHovered;

          return (
            <div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isBlurred ? 'blur(4px)' : 'none',
                opacity: isBlurred ? 0.6 : 1,
                transform: isHovered ? 'scale(1.02)' : isBlurred ? 'scale(0.98)' : 'scale(1)',
                zIndex: isHovered ? 10 : 1,
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.75rem',
        width: '100%',
        alignItems: 'stretch'
      }}
    >
      {cards?.map((card, index) => (
        <Card
          key={card.id || card.title || index}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          renderCard={renderCard}
        />
      ))}
    </div>
  );
}

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Forest Adventure",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Valley of life",
      src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Sala behta hi jayega",
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Camping is for pros",
      src: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "The road not taken",
      src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "The First Rule",
      src: "https://assets.aceternity.com/the-first-rule.png",
    },
  ];

  return <FocusCards cards={cards} />;
}
