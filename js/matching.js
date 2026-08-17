// EduLinker - Intelligent Tutor Matching Engine

class MatchingEngine {
  /**
   * Calculates a match score (0 - 100%) between a parent requirement and a tutor.
   * @param {Object} req - Parent criteria { subject, grade, board, mode, maxRate }
   * @param {Object} tutor - Tutor profile object
   * @returns {Object} { score: number, breakdown: Object }
   */
  static calculateMatchScore(req, tutor) {
    let score = 0;
    const breakdown = {
      subjectMatch: false,
      gradeMatch: false,
      boardMatch: false,
      modeMatch: false,
      verificationBonus: false
    };

    // 1. Subject Alignment (35 points)
    if (!req.subject || req.subject === "All Subjects" || tutor.subjects.includes(req.subject)) {
      score += 35;
      breakdown.subjectMatch = true;
    }

    // 2. Class / Grade Level Alignment (25 points)
    if (!req.grade || req.grade === "All Grades" || tutor.classes.includes(req.grade)) {
      score += 25;
      breakdown.gradeMatch = true;
    }

    // 3. Board / Curriculum Alignment (15 points)
    if (!req.board || req.board === "All Boards" || tutor.boards.includes(req.board)) {
      score += 15;
      breakdown.boardMatch = true;
    }

    // 4. Teaching Mode Compatibility (15 points)
    if (!req.mode || req.mode === "Any Mode" || tutor.mode === "Both (In-Person & Online)" || tutor.mode.includes(req.mode)) {
      score += 15;
      breakdown.modeMatch = true;
    }

    // 5. Verification & Rating Quality Bonus (10 points)
    if (tutor.isVerified) {
      score += 5;
      breakdown.verificationBonus = true;
    }
    if (tutor.rating >= 4.9) {
      score += 5;
    }

    // Budget Cap Adjustment (Penalty if tutor rate > budget)
    if (req.maxRate && tutor.hourlyRate > req.maxRate) {
      score = Math.max(10, score - 15);
    }

    return {
      score: Math.min(100, score),
      breakdown
    };
  }

  /**
   * Sorts and ranks tutors by calculated match score.
   */
  static rankTutors(tutors, req) {
    return tutors.map(tutor => {
      const match = MatchingEngine.calculateMatchScore(req, tutor);
      return {
        ...tutor,
        matchScore: match.score,
        matchBreakdown: match.breakdown
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
}
