import { syncUserDb, getUsersDb } from '../config/database.js';

// Controller to sync single or batch Clerk users into Neon PostgreSQL DB
export const syncUsers = async (req, res) => {
  try {
    const payload = req.body;
    const result = await syncUserDb(payload);
    return res.json(result);
  } catch (err) {
    console.error('Error syncing users controller:', err);
    return res.status(500).json({ success: false, message: 'Failed to sync users to Neon DB' });
  }
};

// Controller to fetch all registered users from Neon PostgreSQL DB
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsersDb();
    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error('Error getting users controller:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};
