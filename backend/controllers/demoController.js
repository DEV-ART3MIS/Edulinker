import { saveDemoRequestDb, getDemoRequestsDb } from '../config/database.js';

export const createDemoRequest = async (req, res) => {
  try {
    const { parentName, studentGrade, subject, tutorId, tutorName, requestedTime, mode } = req.body;

    if (!parentName || !tutorId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newDemo = await saveDemoRequestDb({
      parentName,
      studentGrade: studentGrade || 'Grade 10',
      subject: subject || 'Mathematics',
      tutorId,
      tutorName: tutorName || 'Verified Educator',
      requestedTime: requestedTime || 'Tomorrow at 5:00 PM',
      mode: mode || 'Online Demo',
      status: 'CONFIRMED'
    });

    return res.status(201).json({
      success: true,
      message: 'Demo session requested successfully',
      demo: newDemo
    });
  } catch (err) {
    console.error('Error creating demo request:', err);
    return res.status(500).json({ success: false, message: 'Server error booking demo' });
  }
};

export const getDemoRequests = async (req, res) => {
  try {
    const demos = await getDemoRequestsDb();
    return res.json({
      success: true,
      count: demos.length,
      demos
    });
  } catch (err) {
    console.error('Error getting demo requests:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching demos' });
  }
};
