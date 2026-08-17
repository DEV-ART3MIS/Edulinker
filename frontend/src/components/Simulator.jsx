import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { fetchPsychometricQuestions, submitPsychometricTest, fetchPsychometricHistory } from '../services/api';

export default function Simulator({ onRunMatch, onNavigate, onBookDemo }) {
  const { isSignedIn, user } = useUser() || {};

  const [activeTab, setActiveTab] = useState('psychometric'); // 'psychometric' | 'quick'
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('10th Standard (Grade 10)');
  const [board, setBoard] = useState('CBSE');
  const [mode, setMode] = useState('Any Mode');
  const [studentName, setStudentName] = useState('Rahul Verma');

  // Flow State: initially do not show psychometric test questions directly!
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authActionSource, setAuthActionSource] = useState('calculate'); // 'calculate' | 'book-demo'
  const [selectedTutorForAuth, setSelectedTutorForAuth] = useState(null);

  // Psychometric Test State
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testHistory, setTestHistory] = useState([]);

  // Load questions when Grade or Board changes and test is active
  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPsychometricQuestions(grade, board, subject);
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setAnswers({});
        setCurrentStep(0);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await fetchPsychometricHistory();
      if (data.success && data.records) {
        setTestHistory(data.records);
      }
    } catch (err) {
      console.error('Error fetching test history:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'psychometric' && isTestStarted) {
      loadQuestions();
    }
  }, [grade, board, subject, activeTab, isTestStarted]);

  useEffect(() => {
    loadHistory();
  }, []);

  // Update student name automatically if user is logged in via Clerk
  useEffect(() => {
    if (user?.fullName) {
      setStudentName(user.fullName);
    }
  }, [user]);

  const handleOptionSelect = (questionId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleNextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Click handler for Calculate button on initial parameter section
  const handleStartCalculate = (e) => {
    if (e) e.preventDefault();

    if (!isSignedIn) {
      // User is not signed in -> show Auth Modal to redirect to Sign Up (New User) or Sign In (Registered User)
      setAuthActionSource('calculate');
      setShowAuthModal(true);
    } else {
      // User is signed in -> unlock and show the psychometric test
      setIsTestStarted(true);
      loadQuestions();
    }
  };

  // Click handler for Book Demo button on recommended tutors
  const handleBookDemoClick = (tutor) => {
    if (!isSignedIn) {
      setAuthActionSource('book-demo');
      setSelectedTutorForAuth(tutor);
      setShowAuthModal(true);
    } else {
      if (onBookDemo) onBookDemo(tutor);
    }
  };

  const handleSubmitTest = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        studentName: user?.fullName || studentName || 'Rahul Verma',
        grade,
        board,
        subject,
        answers
      };
      const res = await submitPsychometricTest(payload);
      if (res.success) {
        setTestResult(res);
        loadHistory();
        if (onRunMatch && res.record && res.record.recommendedTutors) {
          onRunMatch(res.record.recommendedTutors);
        }
        if (onNavigate) {
          onNavigate('student-dashboard');
        }
      }
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      setAuthActionSource('calculate');
      setShowAuthModal(true);
    } else {
      onRunMatch({ subject, grade, board, mode, maxRate: 2000 });
    }
  };

  return (
    <div className="simulator-box" id="simulator">
      {/* Header Banner & Mode Switcher */}
      <div className="simulator-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🧠 Academic Fit Evaluation & Stream Simulator</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'psychometric' ? 'active' : ''}`}
            onClick={() => setActiveTab('psychometric')}
          >
            📋 Academic Assessment Test (7 Questions)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            ⚡ Quick Match
          </button>
        </div>
      </div>

      {/* Target Parameters Section (Initial View matching image) */}
      <div className="simulator-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            className="form-input"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Class / Grade Level</label>
          <select className="form-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="5th Standard (Grade 5)">5th Standard (Grade 5)</option>
            <option value="6th Standard (Grade 6)">6th Standard (Grade 6)</option>
            <option value="7th Standard (Grade 7)">7th Standard (Grade 7)</option>
            <option value="8th Standard (Grade 8)">8th Standard (Grade 8)</option>
            <option value="9th Standard (Grade 9)">9th Standard (Grade 9)</option>
            <option value="10th Standard (Grade 10)">10th Standard (Grade 10)</option>
            <option value="11th Standard (Grade 11)">11th Standard (Grade 11)</option>
            <option value="12th Standard (Grade 12)">12th Standard (Grade 12)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Curriculum Board</label>
          <select className="form-select" value={board} onChange={(e) => setBoard(e.target.value)}>
            <option value="CBSE">CBSE Board</option>
            <option value="ICSE">ICSE Board</option>
            <option value="State Board">State Board</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Target Subject</label>
          <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Biology">Biology</option>
            <option value="English Literature">English Literature</option>
            <option value="Accountancy & Economics">Accountancy & Economics</option>
          </select>
        </div>
      </div>

      {/* Initial Calculate Action Button (Before test questions are started) */}
      {!isTestStarted && activeTab === 'psychometric' && (
        <div style={{ marginTop: '1rem' }}>
          <button type="button" className="btn-calculate" onClick={handleStartCalculate}>
            <span>⚡ Calculate Academic Match Score (7 Questions)</span>
          </button>
        </div>
      )}

      {/* TAB 1: ACADEMIC TEST QUESTIONS (Unlocked once started & authenticated) */}
      {activeTab === 'psychometric' && isTestStarted && (
        <div className="psychometric-container" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px dashed var(--border-dashed)' }}>
          {!testResult ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge-pill" style={{ backgroundColor: 'var(--pastel-mint)' }}>
                  🎯 Tailored for {grade} • {board}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
                  Question {currentStep + 1} of {questions.length || 7}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="progress-track" style={{ marginBottom: '1.5rem' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${((currentStep + 1) / (questions.length || 7)) * 100}%` }}
                ></div>
              </div>

              {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700 }}>
                  ⏳ Loading Grade ({grade}) & Board ({board}) 7-Question Assessment...
                </div>
              ) : questions.length > 0 ? (
                <div className="question-card">
                  <div className="question-category">{questions[currentStep].category}</div>
                  <h3 className="question-text">{questions[currentStep].question}</h3>

                  <div className="options-list">
                    {questions[currentStep].options.map((opt, idx) => {
                      const isSelected = answers[questions[currentStep].id] === idx;
                      return (
                        <div
                          key={idx}
                          className={`option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleOptionSelect(questions[currentStep].id, idx)}
                        >
                          <div className="radio-indicator">{isSelected ? '✓' : ''}</div>
                          <span>{opt.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="nav-buttons" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handlePrevQuestion}
                      disabled={currentStep === 0}
                      style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
                    >
                      ← Previous
                    </button>

                    {currentStep < questions.length - 1 ? (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleNextQuestion}
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-calculate"
                        onClick={handleSubmitTest}
                        disabled={isSubmitting}
                        style={{ width: 'auto', padding: '0.65rem 1.5rem' }}
                      >
                        {isSubmitting ? '⏳ Updating Database...' : '💾 Submit & Save Academic Test Marks'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>No questions found for selection.</div>
              )}
            </div>
          ) : (
            /* TEST RESULT & SUGGESTIONS DISPLAY */
            <div className="test-results-container">
              <div className="db-sync-badge">
                <span className="dot-green"></span>
                <span>DB Status: <strong>{testResult.dbType || 'Database Synced'}</strong></span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#666' }}>
                  ID: {testResult.record?.id}
                </span>
              </div>

              <div className="result-header-card">
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Academic Score Sheet for {testResult.record?.studentName}
                  </div>
                  <h2 style={{ fontSize: '1.8rem', margin: '0.2rem 0' }}>
                    Total Marks: <span style={{ color: 'var(--terracotta)', fontWeight: 900 }}>{testResult.record?.totalMarks}/100</span>
                  </h2>
                  <div className="profile-badge">
                    Profile: <strong>{testResult.record?.learningStyle}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => setTestResult(null)}>
                    🔄 Retake Assessment
                  </button>
                </div>
              </div>

              {/* Score Breakdown Metrics */}
              <div className="score-breakdown-grid">
                <div className="metric-box">
                  <div className="metric-label">Analytical Thinking</div>
                  <div className="metric-score">{testResult.record?.breakdown?.analytical}%</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${testResult.record?.breakdown?.analytical}%` }}></div></div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Conceptual Depth</div>
                  <div className="metric-score">{testResult.record?.breakdown?.conceptual}%</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${testResult.record?.breakdown?.conceptual}%` }}></div></div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Exam Strategy</div>
                  <div className="metric-score">{testResult.record?.breakdown?.examStrategy}%</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${testResult.record?.breakdown?.examStrategy}%` }}></div></div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Problem Solving</div>
                  <div className="metric-score">{testResult.record?.breakdown?.problemSolving}%</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${testResult.record?.breakdown?.problemSolving}%` }}></div></div>
                </div>
              </div>

              {/* Suggestions Box based on Choice and Marks */}
              <div className="suggestions-box">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>💡 Personalized AI Suggestions for {grade} ({board})</span>
                </h3>
                <ul className="suggestions-list">
                  {testResult.record?.suggestions?.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                  ))}
                </ul>
              </div>

              {/* Recommended Tutors based on Choice & Marks */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                  🎯 Recommended Tutors Matched to Test Profile ({board} • {grade})
                </h3>
                <div className="recommended-tutors-grid">
                  {testResult.record?.recommendedTutors?.map((tut) => (
                    <div key={tut.id} className="rec-tutor-card">
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={tut.avatar} alt={tut.name} className="rec-avatar" />
                        <div>
                          <div style={{ fontWeight: 800 }}>{tut.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#555' }}>₹{tut.hourlyRate}/hr • Rating: ⭐{tut.rating}</div>
                        </div>
                        <div className="match-pill">{tut.matchScore}% Fit</div>
                      </div>
                      <div className="fit-reason" style={{ marginBottom: '0.75rem' }}>
                        📌 {tut.fitReason}
                      </div>

                      {/* Book Demo Button for Recommended Tutor */}
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.85rem' }}
                        onClick={() => handleBookDemoClick(tut)}
                      >
                        Book Free Demo Session →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Saved History Table from Backend Database */}
          {testHistory.length > 0 && (
            <div className="history-section" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px dashed var(--border-dashed)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💾 Recent Database Test Marks History</span>
                <span className="badge-pill" style={{ backgroundColor: 'var(--pastel-gold)' }}>{testHistory.length} Records</span>
              </div>
              <div className="history-scroll-box">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Grade & Board</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Learning Style Profile</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testHistory.slice(0, 5).map(h => (
                      <tr key={h.id}>
                        <td><strong>{h.studentName}</strong></td>
                        <td>{h.grade} • <span className="board-tag">{h.board}</span></td>
                        <td>{h.subject}</td>
                        <td><span className="marks-badge">{h.totalMarks}/100</span></td>
                        <td>{h.learningStyle}</td>
                        <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUICK MATCH FORM */}
      {activeTab === 'quick' && (
        <form onSubmit={handleQuickSubmit}>
          <div className="simulator-grid">
            <div className="form-group">
              <label className="form-label">Learning Mode</label>
              <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="Any Mode">Any Mode</option>
                <option value="Online Only">Online Only</option>
                <option value="In-Person Only">In-Person (Home Tutor)</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-calculate">
            <span>⚡ Calculate Quick Tutor Match</span>
          </button>
        </form>
      )}

      {/* AUTHENTICATION REDIRECTION MODAL (When non-logged-in user clicks Calculate or Book Demo) */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowAuthModal(false)}>
              ✕
            </button>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {authActionSource === 'book-demo' ? 'Account Required to Book Demo' : 'Account Required for Assessment'}
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              {authActionSource === 'book-demo'
                ? `To book a free demo session with ${selectedTutorForAuth?.name || 'this tutor'}, please Sign Up as a new user or Sign In if you already have an account.`
                : `To take the personalized Psychometric Evaluation for ${grade} (${board}) and update your test marks in the database, please Sign Up or Sign In.`}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
                onClick={() => {
                  setShowAuthModal(false);
                  if (onNavigate) onNavigate('sign-up');
                }}
              >
                ✨ New User? Create Account (Sign Up)
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
                onClick={() => {
                  setShowAuthModal(false);
                  if (onNavigate) onNavigate('sign-in');
                }}
              >
                🔑 Already Registered? Log In (Sign In)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
