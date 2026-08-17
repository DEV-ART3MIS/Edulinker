import { getDbTutors } from '../config/database.js';

export const calculateMatches = async (req, res) => {
  try {
    const { subject, grade, board, mode, maxRate } = req.body;
    const dbTutors = await getDbTutors('ALL', 'ALL');

    const rankedTutors = dbTutors.map(tutor => {
      let score = 0;
      
      // Subject Match (35%)
      if (!subject || subject === 'All Subjects' || tutor.subjects.includes(subject)) {
        score += 35;
      }

      // Grade Level (25%)
      if (!grade || grade === 'All Grades' || tutor.classes.includes(grade)) {
        score += 25;
      }

      // Board Curriculum (15%)
      if (!board || board === 'All Boards' || tutor.boards.includes(board)) {
        score += 15;
      }

      // Mode (15%)
      if (!mode || mode === 'Any Mode' || tutor.mode === 'Both (In-Person & Online)' || tutor.mode.includes(mode)) {
        score += 15;
      }

      // Quality Bonus (10%)
      if (tutor.isVerified) score += 5;
      if (tutor.rating >= 4.9) score += 5;

      // Penalty for exceeding budget
      if (maxRate && tutor.hourlyRate > maxRate) {
        score = Math.max(10, score - 15);
      }

      return {
        ...tutor,
        matchScore: Math.min(100, score)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      criteria: { subject, grade, board, mode, maxRate },
      resultsCount: rankedTutors.length,
      tutors: rankedTutors
    });
  } catch (err) {
    console.error('Error calculating matches:', err);
    return res.status(500).json({ success: false, message: 'Server error calculating matches' });
  }
};
