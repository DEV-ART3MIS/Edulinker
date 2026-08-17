import { getDbTutors } from '../config/database.js';

export const getTutors = async (req, res) => {
  try {
    const { subject = 'ALL', mode = 'ALL' } = req.query;
    const tutors = await getDbTutors(subject, mode);
    return res.json({ success: true, count: tutors.length, tutors });
  } catch (err) {
    console.error('Error in getTutors controller:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching tutors' });
  }
};

export const getTutorById = async (req, res) => {
  try {
    const tutors = await getDbTutors('ALL', 'ALL');
    const tutor = tutors.find(t => t.id === req.params.id);
    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }
    return res.json({ success: true, tutor });
  } catch (err) {
    console.error('Error in getTutorById controller:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching tutor' });
  }
};
