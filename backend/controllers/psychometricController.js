import { memoryStore } from '../store.js';
import { savePsychometricRecord, getPsychometricRecords, activeDbTypeLabel } from '../config/database.js';

// Helper function to build 7 customized questions by grade level, stream & board
const buildGradeQuestions = (grade = '', board = 'CBSE', subject = 'Mathematics') => {
  const isJunior = grade.includes('5th') || grade.includes('6th') || grade.includes('7th') || grade.includes('8th') || grade.includes('Grade 1-5') || grade.includes('Grade 6-8');
  const isHighSchool = grade.includes('9th') || grade.includes('10th') || grade.includes('Grade 9-10');
  
  if (isJunior) {
    return [
      {
        id: 'q1',
        category: 'Learning Preference',
        question: `When learning a new ${subject} concept in ${grade.split(' ')[0] || 'Junior'} school, what helps you understand fastest?`,
        options: [
          { label: 'A. Seeing colorful diagrams, visual illustrations, and video demos', points: { conceptual: 25, analytical: 15, examStrategy: 15, problemSolving: 20 } },
          { label: 'B. Listening to real-life stories and step-by-step teacher explanations', points: { conceptual: 25, analytical: 20, examStrategy: 10, problemSolving: 15 } },
          { label: 'C. Doing hands-on activities, drawing graphs, or working with models', points: { conceptual: 20, analytical: 15, examStrategy: 15, problemSolving: 25 } },
          { label: 'D. Reading summary revision notes and repeating textbook practice questions', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 15 } }
        ]
      },
      {
        id: 'q2',
        category: 'Problem Solving Style',
        question: 'When faced with a challenging problem in your homework or test, what is your first step?',
        options: [
          { label: 'A. Break it down into small simple steps and solve systematically', points: { conceptual: 20, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Look up a similar solved example in your notebook or textbook', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 15 } },
          { label: 'C. Ask your teacher or home tutor to explain the core logic', points: { conceptual: 25, analytical: 15, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Try creative guesses and trial-and-error until you spot the pattern', points: { conceptual: 20, analytical: 20, examStrategy: 10, problemSolving: 25 } }
        ]
      },
      {
        id: 'q3',
        category: 'Subject Interest & Focus',
        question: 'Which subject area do you feel most excited to explore during daily study time?',
        options: [
          { label: 'A. Mathematics & Number Puzzles (Logical & Calculation focus)', points: { conceptual: 20, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Science & Experiments (Exploring how the physical world works)', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'C. Languages & Literature (Reading stories, grammar & essay writing)', points: { conceptual: 25, analytical: 15, examStrategy: 20, problemSolving: 15 } },
          { label: 'D. Computer Science & Technology (Coding, games & digital logic)', points: { conceptual: 20, analytical: 25, examStrategy: 15, problemSolving: 25 } }
        ]
      },
      {
        id: 'q4',
        category: 'Homework & Independent Study',
        question: 'How do you usually complete daily school homework and assignments?',
        options: [
          { label: 'A. Complete everything independently right after returning from school', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'B. Work with a personal tutor who guides you through difficult questions step-by-step', points: { conceptual: 25, analytical: 15, examStrategy: 20, problemSolving: 15 } },
          { label: 'C. Study in short 20-minute bursts with regular breaks', points: { conceptual: 15, analytical: 20, examStrategy: 20, problemSolving: 25 } },
          { label: 'D. Revise key textbook exercises together with parents or peers', points: { conceptual: 20, analytical: 20, examStrategy: 20, problemSolving: 15 } }
        ]
      },
      {
        id: 'q5',
        category: 'Exam Preparation Approach',
        question: 'How do you prepare when school term exams are approaching?',
        options: [
          { label: 'A. Follow a daily revision timetable covering one chapter at a time', points: { conceptual: 25, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'B. Intensive problem-solving practice sessions a week before exams', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 25 } },
          { label: 'C. Group study and explaining difficult concepts to classmates', points: { conceptual: 25, analytical: 15, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Memorizing important textbook exercise answers and definitions', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 15 } }
        ]
      },
      {
        id: 'q6',
        category: 'Concept Retention Technique',
        question: 'What technique helps you remember science terms, formulas, and rules long term?',
        options: [
          { label: 'A. Drawing visual mind maps, charts, and colorful summaries', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'B. Solving 10+ practice questions per topic until it becomes automatic', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 25 } },
          { label: 'C. Explaining the topic back to your tutor or parents in your own words', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Reading quick flashcards and formula sheets repeatedly', points: { conceptual: 15, analytical: 15, examStrategy: 25, problemSolving: 15 } }
        ]
      },
      {
        id: 'q7',
        category: 'Tutor Mentorship Goal',
        question: `What kind of support do you want most from your home/online tutor for ${board} ${subject}?`,
        options: [
          { label: 'A. A patient tutor who breaks complex topics into very easy steps', points: { conceptual: 25, analytical: 15, examStrategy: 20, problemSolving: 20 } },
          { label: 'B. An encouraging mentor who builds strong study discipline and confidence', points: { conceptual: 20, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'C. A fun teacher who uses real-world examples and practical experiments', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 25 } },
          { label: 'D. An exam specialist who conducts regular test drills and marks practice papers', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 20 } }
        ]
      }
    ];
  } else if (isHighSchool) {
    // Grade 9 & 10 (High School - Stream Choice & 10th Board focus)
    return [
      {
        id: 'q1',
        category: 'Stream Choice After 10th',
        question: 'Which academic stream track are you planning to choose after completing your 10th Standard board exams?',
        options: [
          { label: 'A. Science Stream (PCM - Physics, Chem, Math) → Engineering, IT & Technology Track', points: { conceptual: 25, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Science Stream (PCB - Physics, Chem, Bio) → Medical, Healthcare & Biotech Track', points: { conceptual: 25, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'C. Commerce Stream → CA, Accountancy, Economics & Business Studies Track', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. Arts & Humanities Stream → Civil Services, Law, Media & Design Track', points: { conceptual: 25, analytical: 15, examStrategy: 20, problemSolving: 15 } }
        ]
      },
      {
        id: 'q2',
        category: '10th Board Exam Strategy',
        question: `What is your primary preparation focus for your 10th ${board} Board examinations?`,
        options: [
          { label: 'A. Achieving deep conceptual clarity on line-by-line textbook principles', points: { conceptual: 25, analytical: 25, examStrategy: 15, problemSolving: 20 } },
          { label: 'B. Solving previous 10-year board sample papers and specimen questions', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 25 } },
          { label: 'C. Speed and accuracy optimization under timed 3-hour exam conditions', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. Mastering tricky HOTS (Higher Order Thinking Skills) & competency-based items', points: { conceptual: 25, analytical: 25, examStrategy: 20, problemSolving: 25 } }
        ]
      },
      {
        id: 'q3',
        category: 'Problem Solving Rigor',
        question: 'When tackling non-routine or tricky multi-concept questions, how do you work?',
        options: [
          { label: 'A. Derive from first principles equations and synthesize the solution step-by-step', points: { conceptual: 25, analytical: 25, examStrategy: 15, problemSolving: 25 } },
          { label: 'B. Match formula patterns with standard textbook numerical examples', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 20 } },
          { label: 'C. Visualize the problem using vector diagrams, geometry, or flowcharts', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Apply elimination strategy on multiple choice options or trial shortcuts', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 20 } }
        ]
      },
      {
        id: 'q4',
        category: 'Error Analysis',
        question: 'When you lose marks in mock tests or school exams, what is usually the main reason?',
        options: [
          { label: 'A. Conceptual gap in understanding application-oriented questions', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 15 } },
          { label: 'B. Calculation slip-ups, sign mistakes, or misreading question details', points: { conceptual: 10, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'C. Running out of time towards the end of the question paper', points: { conceptual: 15, analytical: 15, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. Incomplete answer presentation according to board marking schemes', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 15 } }
        ]
      },
      {
        id: 'q5',
        category: 'Subject Domain Focus',
        question: 'Which subject domain do you naturally enjoy most and plan to excel in for higher studies?',
        options: [
          { label: 'A. Mathematics & Physics (Calculus, Mechanics, Trigonometry)', points: { conceptual: 20, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Biology & Chemistry (Organic reactions, Cell Biology, Physiology)', points: { conceptual: 25, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'C. Commerce & Economics (Financial Statements, Markets, Accountancy)', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. Computer Science & Coding (Python, Data Structures, Algorithms)', points: { conceptual: 25, analytical: 25, examStrategy: 15, problemSolving: 25 } }
        ]
      },
      {
        id: 'q6',
        category: 'Pre-Board Syllabus Revision',
        question: 'How do you keep extensive 9th & 10th board syllabus fresh before final pre-boards?',
        options: [
          { label: 'A. Active recall through challenging mixed-chapter problem sets', points: { conceptual: 20, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Structured formula notebooks, quick flashcards, and summary binders', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 15 } },
          { label: 'C. Teaching concepts back to study partners or explaining to your tutor', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Taking timed weekly 3-hour full-length mock examinations', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 25 } }
        ]
      },
      {
        id: 'q7',
        category: 'Tutor & Mentorship Fit',
        question: 'What tutor background & mentorship style will best prepare you for 10th Board success & stream entry?',
        options: [
          { label: 'A. An IIT/Engineering alumnus who provides advanced problem-solving depth', points: { conceptual: 25, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. A Senior Medical/Biology specialist who focuses on conceptual diagrams & terms', points: { conceptual: 25, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'C. A Chartered Accountant / Commerce expert who builds strong financial logic', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. A Board Exam ranker who focuses strictly on high-yield marking schemes and time management', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 20 } }
        ]
      }
    ];
  } else {
    // Grade 11 & 12 (Senior Secondary - Specialized Stream & Entrance Exam focus)
    return [
      {
        id: 'q1',
        category: 'Stream Specialization & Target Entrance',
        question: 'Which stream specialization track and competitive entrance exam are you preparing for in 11th/12th?',
        options: [
          { label: 'A. Engineering / Physics & Math Track (Targeting JEE Main/Advanced, MHT-CET)', points: { conceptual: 25, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Medical & Biological Sciences Track (Targeting NEET, Pharmacy, Biotech)', points: { conceptual: 25, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'C. Commerce & Financial Studies Track (Targeting CA Foundation, CS, B.Com Hons)', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. Humanities & Management Track (Targeting CLAT Law, UPSC Civil Services, IPMAT)', points: { conceptual: 25, analytical: 15, examStrategy: 20, problemSolving: 15 } }
        ]
      },
      {
        id: 'q2',
        category: 'Advanced Problem Solving',
        question: 'In Senior Secondary 11th/12th subjects, how do you handle complex 5-mark & competitive numericals?',
        options: [
          { label: 'A. Derive foundational equations from first principles and synthesize logically', points: { conceptual: 25, analytical: 25, examStrategy: 15, problemSolving: 25 } },
          { label: 'B. Apply standardized formula shortcuts, numerical tricks, and dimensional analysis', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 20 } },
          { label: 'C. Break down into vector diagrams, graphical models, and geometric representations', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Timed option elimination and rapid pattern matching strategies', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 20 } }
        ]
      },
      {
        id: 'q3',
        category: '12th Board vs Entrance Exam Balance',
        question: 'How are you balancing 12th Board exam prep with competitive entrance exams (JEE/NEET/CET/CA)?',
        options: [
          { label: 'A. 50-50 equal balance with dedicated daily slots for both theory & MCQs', points: { conceptual: 25, analytical: 25, examStrategy: 20, problemSolving: 20 } },
          { label: 'B. Focus 70% on Board NCERT line-by-line derivations & answer writing', points: { conceptual: 25, analytical: 15, examStrategy: 25, problemSolving: 15 } },
          { label: 'C. Focus 70% on Entrance exam speed drills and high-difficulty numerical practice', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 25 } },
          { label: 'D. Rely on weekly test series analysis and targeted doubt resolution', points: { conceptual: 20, analytical: 20, examStrategy: 20, problemSolving: 20 } }
        ]
      },
      {
        id: 'q4',
        category: 'Retention Across 2-Year Syllabus',
        question: 'How do you keep 2 full years of 11th & 12th syllabus fresh in Physics, Chemistry, Math, Bio or Commerce?',
        options: [
          { label: 'A. Active recall through mixed-chapter comprehensive problem sets', points: { conceptual: 20, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Maintaining personal formula binders, quick flashcards, and reaction summaries', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 15 } },
          { label: 'C. Explaining complex concepts to peers and revising with your tutor', points: { conceptual: 25, analytical: 20, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Taking timed weekly 3-hour full-length mock examinations', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 25 } }
        ]
      },
      {
        id: 'q5',
        category: 'Target Career Goal',
        question: 'What is your primary career goal after completing 12th Standard graduation?',
        options: [
          { label: 'A. Software Engineer / Artificial Intelligence & Data Scientist', points: { conceptual: 20, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Medical Doctor / Surgeon / Clinical Researcher', points: { conceptual: 25, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'C. Chartered Accountant / Financial Analyst / Investment Banker', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'D. Corporate Lawyer / Civil Servant (IAS/IPS) / Business Manager', points: { conceptual: 25, analytical: 15, examStrategy: 20, problemSolving: 15 } }
        ]
      },
      {
        id: 'q6',
        category: 'Time Management Under Pressure',
        question: 'Under strict 3-hour exam conditions, what is your strategy to maximize your overall score?',
        options: [
          { label: 'A. Solve high-weightage topics first to secure maximum marks upfront', points: { conceptual: 20, analytical: 25, examStrategy: 25, problemSolving: 20 } },
          { label: 'B. Rapid first pass through easy items, then spend time on difficult numericals', points: { conceptual: 15, analytical: 25, examStrategy: 25, problemSolving: 25 } },
          { label: 'C. Maintain steady chronological pace with strict 2-minute limits per question', points: { conceptual: 20, analytical: 20, examStrategy: 20, problemSolving: 20 } },
          { label: 'D. Option elimination strategy on tough MCQs to minimize negative marks', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 20 } }
        ]
      },
      {
        id: 'q7',
        category: 'Mentorship & Tutor Support',
        question: 'What specific support do you expect most from your 1-on-1 subject educator?',
        options: [
          { label: 'A. Rigorous advanced problem-solving drills & JEE/NEET level coaching', points: { conceptual: 25, analytical: 25, examStrategy: 20, problemSolving: 25 } },
          { label: 'B. Board exam step-wise marking rubrics & model answer writing guidance', points: { conceptual: 25, analytical: 20, examStrategy: 25, problemSolving: 15 } },
          { label: 'C. Patient 1-on-1 conceptual doubt clearing and foundational re-explanations', points: { conceptual: 25, analytical: 15, examStrategy: 15, problemSolving: 20 } },
          { label: 'D. Regular mock test analysis, speed optimization, and stress management', points: { conceptual: 15, analytical: 20, examStrategy: 25, problemSolving: 20 } }
        ]
      }
    ];
  }
};

// Question bank API endpoint: returns 7 grade-tailored questions for every grade
export const getQuestions = (req, res) => {
  const { grade = '10th Standard', board = 'CBSE', subject = 'Mathematics' } = req.query;
  const questions = buildGradeQuestions(grade, board, subject);

  return res.json({
    success: true,
    grade,
    board,
    subject,
    totalQuestions: questions.length,
    questions
  });
};

// Evaluate Academic Fit Test, Generate Suggestions, Match Tutors, and Update Database
export const submitTest = async (req, res) => {
  try {
    const { studentName = 'Student User', grade = '10th Standard', board = 'CBSE', subject = 'Mathematics', answers = {} } = req.body;

    let analyticalScore = 0;
    let conceptualScore = 0;
    let examStrategyScore = 0;
    let problemSolvingScore = 0;

    const questionList = buildGradeQuestions(grade, board, subject);

    questionList.forEach(q => {
      const selectedIdx = answers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx]) {
        const pts = q.options[selectedIdx].points;
        analyticalScore += pts.analytical || 0;
        conceptualScore += pts.conceptual || 0;
        examStrategyScore += pts.examStrategy || 0;
        problemSolvingScore += pts.problemSolving || 0;
      } else {
        analyticalScore += 18;
        conceptualScore += 18;
        examStrategyScore += 18;
        problemSolvingScore += 18;
      }
    });

    const numQ = questionList.length || 7;
    analyticalScore = Math.min(100, Math.round((analyticalScore / (numQ * 25)) * 100));
    conceptualScore = Math.min(100, Math.round((conceptualScore / (numQ * 25)) * 100));
    examStrategyScore = Math.min(100, Math.round((examStrategyScore / (numQ * 25)) * 100));
    problemSolvingScore = Math.min(100, Math.round((problemSolvingScore / (numQ * 25)) * 100));

    const totalMarks = Math.round((analyticalScore + conceptualScore + examStrategyScore + problemSolvingScore) / 4);

    // Determine Learning Style Profile & Stream Recommendation
    let learningStyle = 'Analytical & Conceptual Thinker';
    if (conceptualScore >= analyticalScore && conceptualScore >= examStrategyScore) {
      learningStyle = 'Visual & Conceptual Learner';
    } else if (examStrategyScore >= analyticalScore && examStrategyScore >= conceptualScore) {
      learningStyle = 'Exam Strategy & Speed Optimizer';
    } else if (problemSolvingScore >= 80) {
      learningStyle = 'Logical & Practical Problem Solver';
    }

    // Stream recommendation logic for 10th-12th std
    let streamRecommendation = '';
    const q1Choice = answers['q1'];
    if (grade.includes('9th') || grade.includes('10th') || grade.includes('11th') || grade.includes('12th')) {
      if (q1Choice === 0) streamRecommendation = 'Science Stream (PCM - Engineering & IT Track)';
      else if (q1Choice === 1) streamRecommendation = 'Science Stream (PCB - Medical & Healthcare Track)';
      else if (q1Choice === 2) streamRecommendation = 'Commerce Stream (CA, Accountancy & Finance Track)';
      else if (q1Choice === 3) streamRecommendation = 'Arts & Humanities (Civil Services & Law Track)';
    }

    // Generate Tailored Suggestions based on choices and marks
    const suggestions = [];
    suggestions.push(`🎯 **Target Profile**: Evaluated for **${grade}** under **${board} Board** (${subject}).`);
    if (streamRecommendation) {
      suggestions.push(`🚀 **Stream Focus Alignment**: Strong aptitude fit for **${streamRecommendation}**.`);
    }

    if (totalMarks >= 85) {
      suggestions.push(`🌟 **High Potential (Marks: ${totalMarks}/100)**: Exceptional grasp! Focus on advanced Higher Order Thinking Skills (HOTS) and speed acceleration.`);
    } else if (totalMarks >= 70) {
      suggestions.push(`📈 **Solid Foundation (Marks: ${totalMarks}/100)**: Strong baseline. Target weak conceptual spots and timed mock test drills.`);
    } else {
      suggestions.push(`💡 **Growth Priority (Marks: ${totalMarks}/100)**: Benefit greatly from 1-on-1 personalized tutoring with step-by-step foundation building.`);
    }

    if (board === 'CBSE') {
      suggestions.push(`📘 **CBSE Specific Suggestion**: Focus on NCERT line-by-line questions and CBSE competency-based sample papers.`);
    } else if (board === 'ICSE') {
      suggestions.push(`📗 **ICSE Specific Suggestion**: Master exact definitions, scientific terminology, and detailed written answer structures.`);
    } else {
      suggestions.push(`📙 **State Board Suggestion**: Prioritize textbook exercise mastery, standard proofs, and past board marking schemes.`);
    }

    if (learningStyle.includes('Visual')) {
      suggestions.push(`🧠 **Learning Style Tip**: Use mind maps, visual diagrams, and real-world analogies during study sessions.`);
    } else if (learningStyle.includes('Exam Strategy')) {
      suggestions.push(`⏱️ **Learning Style Tip**: Practice timed sectional tests to maximize speed and eliminate calculation slip-ups.`);
    } else {
      suggestions.push(`🔬 **Learning Style Tip**: Focus on first-principles derivation to master challenging multi-concept problems.`);
    }

    // Match Tutors based on test marks & stream fit
    const recommendedTutors = memoryStore.tutors.map(t => {
      let compatibility = 75;

      if (t.boards.includes(board)) compatibility += 10;

      const isGradeEligible = t.classes.some(c => 
        c.toLowerCase() === grade.toLowerCase() ||
        grade.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(grade.toLowerCase().split(' ')[0]) ||
        (t.experienceYears >= 5)
      );
      if (isGradeEligible) compatibility += 10;

      if (t.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(s.toLowerCase()))) compatibility += 5;

      if (totalMarks >= 80 && t.experienceYears >= 7) compatibility += 5;
      if (t.rating >= 4.9) compatibility += 5;

      const matchScore = Math.min(99, compatibility);
      let fitReason = `Matches your ${learningStyle} profile with ${t.rating}★ rating and ${t.experienceYears}+ years experience in ${board}.`;

      return {
        id: t.id,
        name: t.name,
        title: t.title,
        avatar: t.avatar,
        hourlyRate: t.hourlyRate,
        rating: t.rating,
        matchScore,
        fitReason,
        boards: t.boards,
        subjects: t.subjects
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    const recordId = `eval-${Date.now()}`;
    const newRecord = {
      id: recordId,
      studentName,
      grade,
      board,
      subject,
      totalMarks,
      learningStyle,
      streamRecommendation,
      breakdown: {
        analytical: analyticalScore,
        conceptual: conceptualScore,
        examStrategy: examStrategyScore,
        problemSolving: problemSolvingScore
      },
      suggestions,
      recommendedTutors,
      createdAt: new Date().toISOString()
    };

    // Save record into backend database
    const dbResult = await savePsychometricRecord(newRecord);

    return res.json({
      success: true,
      message: 'Academic evaluation test marks successfully updated in backend database!',
      dbType: dbResult.dbType,
      record: newRecord
    });
  } catch (err) {
    console.error('Error submitting evaluation test:', err);
    return res.status(500).json({ success: false, message: 'Server error processing test score' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const records = await getPsychometricRecords();
    return res.json({
      success: true,
      activeDbType: activeDbTypeLabel,
      count: records.length,
      records
    });
  } catch (err) {
    console.error('Error fetching test history:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};
