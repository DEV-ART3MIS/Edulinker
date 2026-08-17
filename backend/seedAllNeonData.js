import pg from 'pg';
import dotenv from 'dotenv';
import { memoryStore } from './store.js';

dotenv.config();

const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!neonUrl) {
  console.error('❌ NEON_DATABASE_URL is missing in environment variables!');
  process.exit(1);
}

async function seedOnlineDatabase() {
  console.log('🔄 Connecting to Neon PostgreSQL Online Database...');
  const pool = new pg.Pool({ connectionString: neonUrl, ssl: { rejectUnauthorized: false } });

  try {
    // 1. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tutors (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        title VARCHAR(255),
        avatar TEXT,
        location VARCHAR(255),
        mode VARCHAR(100),
        hourly_rate INT,
        rating NUMERIC(3,2),
        total_reviews INT,
        subjects_json TEXT,
        classes_json TEXT,
        boards_json TEXT,
        is_verified BOOLEAN DEFAULT true,
        degree_verified BOOLEAN DEFAULT true,
        kyc_status VARCHAR(50) DEFAULT 'APPROVED',
        bio TEXT,
        qualification VARCHAR(255),
        experience_years INT,
        grade_tier VARCHAR(100) DEFAULT 'All Standards (5th to 12th)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        role VARCHAR(50),
        grade VARCHAR(100),
        board VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_enrollments (
        id VARCHAR(100) PRIMARY KEY,
        student_name VARCHAR(255),
        student_par_code VARCHAR(100),
        grade VARCHAR(100),
        tutor_id VARCHAR(100),
        tutor_name VARCHAR(255),
        subject VARCHAR(100),
        attendance_percent INT,
        score_percent INT,
        status VARCHAR(50),
        requested_date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS psychometric_results (
        id VARCHAR(100) PRIMARY KEY,
        student_name VARCHAR(255),
        grade VARCHAR(100),
        board VARCHAR(100),
        subject VARCHAR(100),
        total_marks INT,
        learning_style VARCHAR(100),
        breakdown_json TEXT,
        suggestions_json TEXT,
        recommended_tutors_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS demo_requests (
        id VARCHAR(100) PRIMARY KEY,
        parent_name VARCHAR(255),
        student_grade VARCHAR(100),
        subject VARCHAR(100),
        tutor_id VARCHAR(100),
        tutor_name VARCHAR(255),
        requested_time VARCHAR(100),
        mode VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS teacher_registrations (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(100),
        qualification VARCHAR(255),
        experience_years INT,
        location VARCHAR(255),
        subjects_json TEXT,
        boards_json TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure grade_tier column exists
    await pool.query(`ALTER TABLE tutors ADD COLUMN IF NOT EXISTS grade_tier VARCHAR(100) DEFAULT 'All Standards (5th to 12th)';`);

    // 2. Seed All 50 Tutors
    let tutorCount = 0;
    for (const t of memoryStore.tutors) {
      await pool.query(
        `INSERT INTO tutors (id, name, title, avatar, location, mode, hourly_rate, rating, total_reviews, subjects_json, classes_json, boards_json, is_verified, degree_verified, kyc_status, bio, qualification, experience_years, grade_tier)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           title = EXCLUDED.title,
           avatar = EXCLUDED.avatar,
           location = EXCLUDED.location,
           mode = EXCLUDED.mode,
           hourly_rate = EXCLUDED.hourly_rate,
           rating = EXCLUDED.rating,
           total_reviews = EXCLUDED.total_reviews,
           subjects_json = EXCLUDED.subjects_json,
           classes_json = EXCLUDED.classes_json,
           boards_json = EXCLUDED.boards_json,
           bio = EXCLUDED.bio,
           qualification = EXCLUDED.qualification,
           experience_years = EXCLUDED.experience_years,
           grade_tier = EXCLUDED.grade_tier;`,
        [
          t.id,
          t.name,
          t.title,
          t.avatar,
          t.location,
          t.mode,
          t.hourlyRate,
          t.rating,
          t.totalReviews,
          JSON.stringify(t.subjects),
          JSON.stringify(t.classes),
          JSON.stringify(t.boards),
          t.isVerified,
          t.degreeVerified,
          t.kycStatus,
          t.bio,
          t.qualification,
          t.experienceYears,
          t.gradeTier || 'All Standards (5th to 12th)'
        ]
      );
      tutorCount++;
    }

    // 3. Seed Registered Users (Students, Parents, Teachers, Admin)
    const registeredUsers = [
      { id: 'user_2sX89a1b2c3d4e5f', name: 'Samruddhi Deshmukh', email: 'samruddhi@example.com', role: 'student', grade: '10th Standard', board: 'CBSE Board' },
      { id: 'user_2sY90b2c3d4e5f6g', name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com', role: 'student', grade: '12th Standard', board: 'CBSE Board' },
      { id: 'user_2sZ01c3d4e5f6g7h', name: 'Ananya Patel', email: 'ananya.patel@gmail.com', role: 'student', grade: '8th Standard', board: 'ICSE Board' },
      { id: 'user_2sW12d3e4f5g6h7i', name: 'Aditya Kulkarni', email: 'aditya.kulkarni@gmail.com', role: 'student', grade: '9th Standard', board: 'State Board' },
      { id: 'user_2sV23e4f5g6h7i8j', name: 'Priya Sonawane', email: 'priya.sonawane@gmail.com', role: 'student', grade: '11th Standard', board: 'CBSE Board' },
      { id: 'user_2sA12d4e5f6g7h8i', name: 'Dr. Rajesh Deshmukh', email: 'rajesh.maths@edulinker.com', role: 'teacher', grade: 'All Standards (5th-12th)', board: 'CBSE & State Board' },
      { id: 'user_2sB23e5f6g7h8i9j', name: 'Sunita Patil', email: 'sunita.physics@edulinker.com', role: 'teacher', grade: '9th-12th Standard', board: 'State Board' },
      { id: 'user_2sC34f6g7h8i9j0k', name: 'Suresh Deshmukh', email: 'suresh.parent@gmail.com', role: 'parent', grade: '10th Standard', board: 'CBSE Board' },
      { id: 'user_2sD45g7h8i9j0k1l', name: 'Admin Manager', email: 'admin@edulinker.com', role: 'admin', grade: 'System Administrator', board: 'All Boards' }
    ];

    let userCount = 0;
    for (const u of registeredUsers) {
      await pool.query(`
        INSERT INTO users (id, name, email, role, grade, board, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          grade = EXCLUDED.grade,
          board = EXCLUDED.board;
      `, [u.id, u.name, u.email, u.role, u.grade, u.board]);
      userCount++;
    }

    // 4. Seed Student Enrollments
    const enrollments = [
      { id: 'enr-101', studentName: 'Samruddhi Deshmukh', studentParCode: 'PAR-SAM9911-KPR', grade: '10th Standard', tutorId: 'tut-kp-001', tutorName: 'Dr. Rajesh Deshmukh', subject: 'Mathematics', attendancePercent: 97, scorePercent: 88, status: 'ACTIVE' },
      { id: 'enr-102', studentName: 'Samruddhi Deshmukh', studentParCode: 'PAR-SAM9911-KPR', grade: '10th Standard', tutorId: 'tut-kp-002', tutorName: 'Sunita Patil', subject: 'Physics', attendancePercent: 86, scorePercent: 85, status: 'ACTIVE' },
      { id: 'enr-103', studentName: 'Samruddhi Deshmukh', studentParCode: 'PAR-SAM9911-KPR', grade: '10th Standard', tutorId: 'tut-kp-003', tutorName: 'Amitabh Joshi', subject: 'Chemistry', attendancePercent: 96, scorePercent: 92, status: 'ACTIVE' },
      { id: 'enr-104', studentName: 'Rohan Sharma', studentParCode: 'PAR-ROH8822-KPR', grade: '12th Standard', tutorId: 'tut-kp-037', tutorName: 'Dr. Avinash Tambe', subject: 'Physics JEE', attendancePercent: 94, scorePercent: 91, status: 'ACTIVE' },
      { id: 'enr-105', studentName: 'Ananya Patel', studentParCode: 'PAR-ANA7733-KPR', grade: '8th Standard', tutorId: 'tut-kp-007', tutorName: 'Rameshwar Shinde', subject: 'Vedic Maths', attendancePercent: 98, scorePercent: 95, status: 'ACTIVE' }
    ];

    let enrCount = 0;
    for (const e of enrollments) {
      await pool.query(`
        INSERT INTO student_enrollments (id, student_name, student_par_code, grade, tutor_id, tutor_name, subject, attendance_percent, score_percent, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          attendance_percent = EXCLUDED.attendance_percent,
          score_percent = EXCLUDED.score_percent,
          status = EXCLUDED.status;
      `, [e.id, e.studentName, e.studentParCode, e.grade, e.tutorId, e.tutorName, e.subject, e.attendancePercent, e.scorePercent, e.status]);
      enrCount++;
    }

    // 5. Seed Test Score Sheets (Psychometric / Academic Evaluation)
    const testRecords = [
      {
        id: 'eval-101',
        studentName: 'Samruddhi Deshmukh',
        grade: '10th Standard',
        board: 'CBSE',
        subject: 'Mathematics',
        totalMarks: 88,
        learningStyle: 'Visual & Conceptual Learner',
        breakdown: { analytical: 90, conceptual: 100, examStrategy: 75, problemSolving: 85 },
        suggestions: [
          '🎯 Target Profile: Evaluated for 10th Standard under CBSE Board.',
          '🌟 High Potential (Marks: 88/100): Exceptional grasp on core math principles.',
          '📘 CBSE Specific Suggestion: Focus on NCERT line-by-line derivations & case study questions.'
        ],
        recommendedTutors: [
          { id: 'tut-kp-001', name: 'Dr. Rajesh Deshmukh', matchScore: 98, fitReason: 'Top fit for Visual & Conceptual profile with 12+ yrs experience.' },
          { id: 'tut-kp-021', name: 'Sanjay Nikam', matchScore: 95, fitReason: '10th Board Algebra & Geometry master coach in Kopargaon.' }
        ]
      },
      {
        id: 'eval-102',
        studentName: 'Rohan Sharma',
        grade: '12th Standard',
        board: 'CBSE',
        subject: 'Physics',
        totalMarks: 92,
        learningStyle: 'Logical & Practical Problem Solver',
        breakdown: { analytical: 95, conceptual: 92, examStrategy: 88, problemSolving: 93 },
        suggestions: [
          '🎯 Target Profile: Evaluated for 12th Standard under CBSE Board.',
          '🚀 Stream Focus Alignment: Strong aptitude fit for Science Stream (PCM - Engineering & IT Track).'
        ],
        recommendedTutors: [
          { id: 'tut-kp-037', name: 'Dr. Avinash Tambe', matchScore: 99, fitReason: 'Ph.D. IIT Kharagpur senior physics JEE & Board faculty.' }
        ]
      }
    ];

    let evalCount = 0;
    for (const r of testRecords) {
      await pool.query(`
        INSERT INTO psychometric_results (id, student_name, grade, board, subject, total_marks, learning_style, breakdown_json, suggestions_json, recommended_tutors_json, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          total_marks = EXCLUDED.total_marks,
          learning_style = EXCLUDED.learning_style,
          breakdown_json = EXCLUDED.breakdown_json,
          suggestions_json = EXCLUDED.suggestions_json,
          recommended_tutors_json = EXCLUDED.recommended_tutors_json;
      `, [r.id, r.studentName, r.grade, r.board, r.subject, r.totalMarks, r.learningStyle, JSON.stringify(r.breakdown), JSON.stringify(r.suggestions), JSON.stringify(r.recommendedTutors)]);
      evalCount++;
    }

    console.log('===========================================================');
    console.log('🎉 ONLINE NEON POSTGRESQL DATABASE FULLY SEEDED AND SYNCED!');
    console.log(`✅ Tutors / Teachers: ${tutorCount} (Grade 5th-8th, 9th-10th, 11th-12th)`);
    console.log(`✅ Registered Users: ${userCount} (Students, Parents, Teachers, Admin)`);
    console.log(`✅ Student Enrollments: ${enrCount}`);
    console.log(`✅ Evaluation Records: ${evalCount}`);
    console.log('===========================================================');

  } catch (err) {
    console.error('❌ Error seeding online Neon database:', err);
  } finally {
    await pool.end();
  }
}

seedOnlineDatabase();
