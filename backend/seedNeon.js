import pg from 'pg';
import dotenv from 'dotenv';
import { memoryStore } from './store.js';

dotenv.config();

const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!neonUrl) {
  console.error('❌ NEON_DATABASE_URL is missing in environment variables!');
  process.exit(1);
}

async function seed() {
  const pool = new pg.Pool({ connectionString: neonUrl, ssl: { rejectUnauthorized: false } });
  try {
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
    `);

    // Ensure grade_tier column exists if table was previously created
    await pool.query(`ALTER TABLE tutors ADD COLUMN IF NOT EXISTS grade_tier VARCHAR(100) DEFAULT 'All Standards (5th to 12th)';`);

    let count = 0;
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
      count++;
    }
    console.log(`✅ [Neon DB Seed]: Successfully seeded and updated all ${count} Kopargaon tutors across Grade 5th-8th, 9th-10th, and 11th-12th into Neon PostgreSQL DB!`);
  } catch (err) {
    console.error('Error seeding tutors to Neon DB:', err);
  } finally {
    await pool.end();
  }
}

seed();
