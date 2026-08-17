import React from 'react';

export default function ViewSwitcher({ currentRole, onSelectRole }) {
  return (
    <div className="view-switcher-bar">
      <button
        className={`switcher-btn ${currentRole === 'parent' ? 'active' : ''}`}
        onClick={() => onSelectRole('parent')}
      >
        <span>👨‍👩‍👧</span> Parent View
      </button>
      <button
        className={`switcher-btn ${currentRole === 'tutor' ? 'active' : ''}`}
        onClick={() => onSelectRole('tutor')}
      >
        <span>👨‍🏫</span> Tutor Portal
      </button>
      <button
        className={`switcher-btn ${currentRole === 'admin' ? 'active' : ''}`}
        onClick={() => onSelectRole('admin')}
      >
        <span>🛡️</span> Admin View
      </button>
    </div>
  );
}
