import pg from 'pg';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { memoryStore } from '../store.js';

dotenv.config();

// In-Memory storage fallback for psychometric test marks if external DB is not provisioned
export const dbMemoryStore = {
  psychometricResults: []
};

let pgPool = null;
let mysqlPool = null;
export let activeDbTypes = [];
export let activeDbTypeLabel = 'Local Database Engine (Synced)';

export const initDatabase = async () => {
  const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  const mysqlUrl = process.env.MYSQL_URI || process.env.MYSQL_URL;

  activeDbTypes = [];

  // 1. Neon PostgreSQL Database Connection
  if (neonUrl) {
    try {
      pgPool = new pg.Pool({
        connectionString: neonUrl,
        ssl: { rejectUnauthorized: false }
      });

      // Verify connection
      await pgPool.query('SELECT NOW()');

      activeDbTypes.push('NEON_POSTGRES');
      console.log('✅ [Database]: Successfully connected to Neon PostgreSQL Database.');

      // Ensure all required tables exist
      await ensureTablesExist();
    } catch (err) {
      console.error('⚠️ [Database Notice]: Neon DB Connection error:', err.message);
    }
  }

  // 2. MySQL Database Connection
  if (mysqlUrl) {
    try {
      mysqlPool = mysql.createPool(mysqlUrl);
      await mysqlPool.query('SELECT NOW()');

      activeDbTypes.push('MYSQL');
      console.log('✅ [Database]: Successfully connected to MySQL Database.');
    } catch (err) {
      console.error('⚠️ [Database Notice]: MySQL DB Connection error:', err.message);
    }
  }

  if (activeDbTypes.length > 0) {
    activeDbTypeLabel = activeDbTypes.join(' + ') + ' (Auto-Synced)';
  } else {
    activeDbTypeLabel = 'Local Database Engine (Auto-Synced)';
    console.log('ℹ️ [Database Notice]: Running Psychometric Store in High-Performance Local Database Mode.');
  }

  // Start background database auto-sync timer (every 3 seconds)
  startDatabaseAutoSync();
};

// Ensure all database tables exist in Neon PostgreSQL
// Ensure all database tables exist and are seeded in Neon PostgreSQL
const ensureTablesExist = async () => {
  if (!pgPool) return;
  try {
    await pgPool.query(`
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
    `);

    // Ensure grade_tier column exists in case table was created previously
    await pgPool.query(`ALTER TABLE tutors ADD COLUMN IF NOT EXISTS grade_tier VARCHAR(100) DEFAULT 'All Standards (5th to 12th)';`);
    console.log('🛡️ [Database Schema]: Verified tutors, psychometric_results, users, and student_enrollments tables.');

    // Seed & Sync 50 Kopargaon tutors into Neon PostgreSQL DB
    if (memoryStore.tutors && memoryStore.tutors.length > 0) {
      for (const t of memoryStore.tutors) {
        await pgPool.query(
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
      }
      console.log(`✅ [Database]: Synced all ${memoryStore.tutors.length} Kopargaon tutors into Neon PostgreSQL DB.`);
    }

    // Seed & Sync Registered Users (Students, Parents, Teachers, Admin)
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

    for (const u of registeredUsers) {
      await pgPool.query(`
        INSERT INTO users (id, name, email, role, grade, board, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          grade = EXCLUDED.grade,
          board = EXCLUDED.board;
      `, [u.id, u.name, u.email, u.role, u.grade, u.board]);
    }
    console.log(`✅ [Database]: Synced ${registeredUsers.length} registered users (Students, Parents, Teachers, Admin) into Neon PostgreSQL DB.`);
  } catch (err) {
    console.error('Error creating database tables:', err.message);
  }
};

// Periodic Database Auto-Sync Worker (runs every 3 seconds to ensure real-time persistence)
let autoSyncTimer = null;
const startDatabaseAutoSync = () => {
  if (autoSyncTimer) clearInterval(autoSyncTimer);
  autoSyncTimer = setInterval(async () => {
    try {
      if (pgPool && activeDbTypes.includes('NEON_POSTGRES') && dbMemoryStore.psychometricResults.length > 0) {
        for (const record of dbMemoryStore.psychometricResults) {
          await pgPool.query(
            `INSERT INTO psychometric_results (id, student_name, grade, board, subject, total_marks, learning_style, breakdown_json, suggestions_json, recommended_tutors_json, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) DO UPDATE SET
               total_marks = EXCLUDED.total_marks,
               learning_style = EXCLUDED.learning_style,
               breakdown_json = EXCLUDED.breakdown_json,
               suggestions_json = EXCLUDED.suggestions_json,
               recommended_tutors_json = EXCLUDED.recommended_tutors_json;`,
            [
              record.id,
              record.studentName,
              record.grade,
              record.board,
              record.subject,
              record.totalMarks,
              record.learningStyle,
              JSON.stringify(record.breakdown),
              JSON.stringify(record.suggestions),
              JSON.stringify(record.recommendedTutors),
              new Date(record.createdAt || Date.now())
            ]
          );
        }
      }
    } catch (syncErr) {
      // silent background sync catch
    }
  }, 3000);
};

// Fetch Tutors from Neon DB or Memory Store
export const getDbTutors = async (subjectFilter = 'ALL', modeFilter = 'ALL', gradeTierFilter = 'ALL') => {
  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      const res = await pgPool.query(`SELECT * FROM tutors ORDER BY rating DESC;`);
      let tutors = res.rows.map(r => ({
        id: r.id,
        name: r.name,
        title: r.title,
        avatar: r.avatar,
        location: r.location,
        mode: r.mode,
        hourlyRate: r.hourly_rate,
        rating: parseFloat(r.rating) || 4.8,
        totalReviews: r.total_reviews,
        subjects: JSON.parse(r.subjects_json || '[]'),
        classes: JSON.parse(r.classes_json || '[]'),
        boards: JSON.parse(r.boards_json || '[]'),
        isVerified: r.is_verified,
        degreeVerified: r.degree_verified,
        kycStatus: r.kyc_status,
        bio: r.bio,
        qualification: r.qualification,
        experienceYears: r.experience_years,
        gradeTier: r.grade_tier || 'All Standards (5th to 12th)'
      }));

      if (subjectFilter && subjectFilter !== 'ALL') {
        tutors = tutors.filter(t => t.subjects.includes(subjectFilter));
      }
      if (modeFilter && modeFilter !== 'ALL') {
        tutors = tutors.filter(t => t.mode.includes(modeFilter));
      }
      if (gradeTierFilter && gradeTierFilter !== 'ALL') {
        tutors = tutors.filter(t => (t.gradeTier || '').includes(gradeTierFilter) || (t.classes || []).some(c => c.includes(gradeTierFilter.split(' ')[0])));
      }

      return tutors;
    } catch (err) {
      console.error('Error fetching tutors from Neon DB:', err);
    }
  }

  let tutors = [...memoryStore.tutors];
  if (subjectFilter && subjectFilter !== 'ALL') {
    tutors = tutors.filter(t => t.subjects.includes(subjectFilter));
  }
  if (modeFilter && modeFilter !== 'ALL') {
    tutors = tutors.filter(t => t.mode.includes(modeFilter));
  }
  if (gradeTierFilter && gradeTierFilter !== 'ALL') {
    tutors = tutors.filter(t => (t.gradeTier || '').includes(gradeTierFilter) || (t.classes || []).some(c => c.includes(gradeTierFilter.split(' ')[0])));
  }
  return tutors;
};

// Approve KYC in Neon DB
export const approveTutorKycDb = async (tutorId) => {
  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      await pgPool.query(`UPDATE tutors SET kyc_status = 'APPROVED', is_verified = true, degree_verified = true WHERE id = $1;`, [tutorId]);
      return true;
    } catch (err) {
      console.error('Error approving KYC in Neon DB:', err);
    }
  }

  const tutor = memoryStore.tutors.find(t => t.id === tutorId);
  if (tutor) {
    tutor.kycStatus = 'APPROVED';
    tutor.isVerified = true;
    tutor.degreeVerified = true;
  }
  return true;
};

// Save Psychometric Record
export const savePsychometricRecord = async (record) => {
  const {
    id,
    studentName = 'Student User',
    grade,
    board,
    subject,
    totalMarks,
    learningStyle,
    breakdown,
    suggestions,
    recommendedTutors,
    createdAt = new Date().toISOString()
  } = record;

  const savedSources = [];

  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      await pgPool.query(
        `INSERT INTO psychometric_results (id, student_name, grade, board, subject, total_marks, learning_style, breakdown_json, suggestions_json, recommended_tutors_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           total_marks = EXCLUDED.total_marks,
           learning_style = EXCLUDED.learning_style,
           breakdown_json = EXCLUDED.breakdown_json,
           suggestions_json = EXCLUDED.suggestions_json,
           recommended_tutors_json = EXCLUDED.recommended_tutors_json;`,
        [
          id,
          studentName,
          grade,
          board,
          subject,
          totalMarks,
          learningStyle,
          JSON.stringify(breakdown),
          JSON.stringify(suggestions),
          JSON.stringify(recommendedTutors),
          new Date(createdAt)
        ]
      );
      savedSources.push('Neon PostgreSQL');
    } catch (err) {
      console.error('Error inserting to Neon DB:', err);
    }
  }

  if (mysqlPool && activeDbTypes.includes('MYSQL')) {
    try {
      await mysqlPool.query(
        `INSERT INTO psychometric_results (id, student_name, grade, board, subject, total_marks, learning_style, breakdown_json, suggestions_json, recommended_tutors_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           total_marks = VALUES(total_marks),
           learning_style = VALUES(learning_style),
           breakdown_json = VALUES(breakdown_json),
           suggestions_json = VALUES(suggestions_json),
           recommended_tutors_json = VALUES(recommended_tutors_json);`,
        [
          id,
          studentName,
          grade,
          board,
          subject,
          totalMarks,
          learningStyle,
          JSON.stringify(breakdown),
          JSON.stringify(suggestions),
          JSON.stringify(recommendedTutors),
          new Date(createdAt)
        ]
      );
      savedSources.push('MySQL Database');
    } catch (err) {
      console.error('Error inserting to MySQL DB:', err);
    }
  }

  // Sync to Local Database Engine Store
  const index = dbMemoryStore.psychometricResults.findIndex(r => r.id === id);
  const dataObject = {
    id,
    studentName,
    grade,
    board,
    subject,
    totalMarks,
    learningStyle,
    breakdown,
    suggestions,
    recommendedTutors,
    createdAt
  };
  if (index >= 0) {
    dbMemoryStore.psychometricResults[index] = dataObject;
  } else {
    dbMemoryStore.psychometricResults.unshift(dataObject);
  }

  const label = savedSources.length > 0 ? savedSources.join(' + ') + ' (Connected)' : 'Local Database Engine (Synced)';

  return { success: true, dbType: label };
};

// Fetch Psychometric Records
export const getPsychometricRecords = async () => {
  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      const res = await pgPool.query(`SELECT * FROM psychometric_results ORDER BY created_at DESC LIMIT 50;`);
      return res.rows.map(r => ({
        id: r.id,
        studentName: r.student_name,
        grade: r.grade,
        board: r.board,
        subject: r.subject,
        totalMarks: r.total_marks,
        learningStyle: r.learning_style,
        breakdown: JSON.parse(r.breakdown_json || '{}'),
        suggestions: JSON.parse(r.suggestions_json || '[]'),
        recommendedTutors: JSON.parse(r.recommended_tutors_json || '[]'),
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error('Error querying Neon DB:', err);
    }
  }

  return dbMemoryStore.psychometricResults;
};

// Demo Requests DB
export const saveDemoRequestDb = async (demoData) => {
  const { id = `demo-${Date.now()}`, parentName, studentGrade, subject, tutorId, tutorName, requestedTime, mode = 'Online Demo', status = 'CONFIRMED' } = demoData;

  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      await pgPool.query(
        `INSERT INTO demo_requests (id, parent_name, student_grade, subject, tutor_id, tutor_name, requested_time, mode, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [id, parentName, studentGrade, subject, tutorId, tutorName, requestedTime, mode, status]
      );
    } catch (err) {
      console.error('Error saving demo request to Neon DB:', err);
    }
  }

  const newDemo = { id, parentName, studentGrade, subject, tutorId, tutorName, requestedTime, mode, status, createdAt: new Date().toLocaleString() };
  memoryStore.demoRequests.unshift(newDemo);
  return newDemo;
};

export const getDemoRequestsDb = async () => {
  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      const res = await pgPool.query(`SELECT * FROM demo_requests ORDER BY created_at DESC;`);
      return res.rows.map(r => ({
        id: r.id,
        parentName: r.parent_name,
        studentGrade: r.student_grade,
        subject: r.subject,
        tutorId: r.tutor_id,
        tutorName: r.tutor_name,
        requestedTime: r.requested_time,
        mode: r.mode,
        status: r.status,
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error('Error fetching demos from Neon DB:', err);
    }
  }
  return memoryStore.demoRequests;
};

// Teacher Registration DB
export const saveTeacherRegistrationDb = async (regData) => {
  const id = `reg-${Date.now()}`;
  const { name, email, phone, qualification, experienceYears, location = 'Kopargaon, Maharashtra', subjects = [], boards = [] } = regData;

  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      await pgPool.query(
        `INSERT INTO teacher_registrations (id, name, email, phone, qualification, experience_years, location, subjects_json, boards_json, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [id, name, email, phone, qualification, experienceYears, location, JSON.stringify(subjects), JSON.stringify(boards), 'PENDING_VERIFICATION']
      );
    } catch (err) {
      console.error('Error saving teacher registration to Neon DB:', err);
    }
  }
  return { id, name, email, phone, qualification, experienceYears, location, status: 'PENDING_VERIFICATION' };
};

// Sync Clerk / Registered Users to Neon PostgreSQL Database
export const syncUserDb = async (userData) => {
  const usersList = Array.isArray(userData) ? userData : [userData];
  const syncedUsers = [];

  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    for (const u of usersList) {
      if (!u || (!u.id && !u.email)) continue;
      const userId = u.id || `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const name = u.name || u.fullName || u.firstName || 'EduLinker User';
      const email = u.email || u.primaryEmailAddress || 'user@example.com';
      const role = u.role || 'student';
      const grade = u.grade || '10th Standard';
      const board = u.board || 'CBSE Board';

      try {
        await pgPool.query(
          `INSERT INTO users (id, name, email, role, grade, board, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             email = EXCLUDED.email,
             role = EXCLUDED.role,
             grade = EXCLUDED.grade,
             board = EXCLUDED.board;`,
          [userId, name, email, role, grade, board]
        );
        syncedUsers.push({ id: userId, name, email, role, grade, board });
      } catch (err) {
        console.error('Error syncing user to Neon DB:', err.message);
      }
    }
  }

  return { success: true, count: syncedUsers.length, users: syncedUsers, dbType: activeDbTypeLabel };
};

// Fetch all registered users from Neon PostgreSQL Database
export const getUsersDb = async () => {
  if (pgPool && activeDbTypes.includes('NEON_POSTGRES')) {
    try {
      const res = await pgPool.query(`SELECT * FROM users ORDER BY created_at DESC;`);
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        grade: r.grade,
        board: r.board,
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error('Error fetching users from Neon DB:', err.message);
    }
  }
  return [];
};

