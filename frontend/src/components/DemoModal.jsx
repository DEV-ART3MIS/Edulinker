import React, { useState } from 'react';

export default function DemoModal({ tutor, onClose, onSubmitDemo }) {
  const [parentName, setParentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 10');
  const [requestedTime, setRequestedTime] = useState('');
  const [mode, setMode] = useState('Online Demo (Zoom)');

  if (!tutor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitDemo({
      tutorId: tutor.id,
      tutorName: tutor.name,
      parentName,
      studentGrade,
      requestedTime,
      mode
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: '2px solid #173300', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}>✕</button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed var(--border-dashed)', paddingBottom: '1rem' }}>
          <img src={tutor.avatar} alt={tutor.name} style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid #173300' }} />
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Book Demo with {tutor.name}</h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-body)', fontWeight: 600 }}>{tutor.qualification} • ₹{tutor.hourlyRate}/hr</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Parent / Guardian Full Name</label>
            <input type="text" className="form-input" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="e.g. Ramesh Kumar" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Student Grade</label>
              <select className="form-select" value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)}>
                <option value="5th Standard">5th Standard</option>
                <option value="6th Standard">6th Standard</option>
                <option value="7th Standard">7th Standard</option>
                <option value="8th Standard">8th Standard</option>
                <option value="9th Standard">9th Standard</option>
                <option value="10th Standard">10th Standard</option>
                <option value="11th Standard">11th Standard</option>
                <option value="12th Standard">12th Standard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Demo Mode</label>
              <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="Online Demo (Zoom)">Online Demo (Zoom)</option>
                <option value="In-Person Trial Visit">In-Person Trial Visit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Date & Time Slot</label>
            <input type="text" className="form-input" value={requestedTime} onChange={(e) => setRequestedTime(e.target.value)} placeholder="e.g. Tomorrow at 5:30 PM" required />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Confirm Free Demo Request 🎉
          </button>
        </form>
      </div>
    </div>
  );
}
