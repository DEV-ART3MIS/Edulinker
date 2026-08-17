import { getDbTutors, getPsychometricRecords, getDemoRequestsDb } from '../config/database.js';

// In-Memory store for Dashboard notifications & parent-student links
const dashboardStore = {
  notifications: [
    {
      id: "notif-1",
      teacherName: "Dr. Rajesh Deshmukh",
      targetParCode: "PAR-8829-KPR",
      title: "Calculus & Geometry Test Announcement",
      message: "Upcoming Chapter 4 Mathematics timed assessment scheduled for Friday at 5:00 PM. Please review NCERT & Board sample questions.",
      type: "ANNOUNCEMENT",
      createdAt: "2026-08-17T07:30:00.000Z"
    },
    {
      id: "notif-2",
      teacherName: "Sunita Patil",
      targetParCode: "PAR-8829-KPR",
      title: "Physics Attendance Update (97%)",
      message: "Aarav has maintained 97% attendance in Physics mechanics modules. Great performance in numerical practice drills!",
      type: "ATTENDANCE",
      createdAt: "2026-08-16T14:15:00.000Z"
    },
    {
      id: "notif-3",
      teacherName: "Amitabh Joshi",
      targetParCode: "PAR-8829-KPR",
      title: "Computer Science Assignment Score: 92/100",
      message: "Data Structures & Python Data Types submission graded with 92% marks.",
      type: "GRADE",
      createdAt: "2026-08-15T11:00:00.000Z"
    }
  ],
  linkedParents: [
    {
      parCode: "PAR-8829-KPR",
      parentName: "Sanjay Patel",
      parentEmail: "sanjay.patel@example.com",
      studentName: "Aarav Patel",
      linkedAt: "2026-08-17T06:00:00.000Z"
    }
  ],
  studentEnrollments: [
    {
      id: "enr-101",
      studentName: "Aarav Patel",
      studentParCode: "PAR-8829-KPR",
      grade: "Grade 10",
      tutorId: "tut-kp-001",
      tutorName: "Dr. Rajesh Deshmukh",
      subject: "Mathematics",
      attendancePercent: 97,
      scorePercent: 88,
      status: "ACCEPTED",
      requestedDate: "2026-08-10"
    },
    {
      id: "enr-102",
      studentName: "Aarav Patel",
      studentParCode: "PAR-8829-KPR",
      grade: "Grade 10",
      tutorId: "tut-kp-002",
      tutorName: "Sunita Patil",
      subject: "Physics",
      attendancePercent: 86,
      scorePercent: 85,
      status: "ACCEPTED",
      requestedDate: "2026-08-12"
    },
    {
      id: "enr-103",
      studentName: "Aarav Patel",
      studentParCode: "PAR-8829-KPR",
      grade: "Grade 10",
      tutorId: "tut-kp-003",
      tutorName: "Amitabh Joshi",
      subject: "Chemistry",
      attendancePercent: 96,
      scorePercent: 92,
      status: "ACCEPTED",
      requestedDate: "2026-08-14"
    },
    {
      id: "enr-104",
      studentName: "Rohan Varma",
      studentParCode: "PAR-9412-STUD",
      grade: "Grade 10",
      tutorId: "tut-kp-001",
      tutorName: "Dr. Rajesh Deshmukh",
      subject: "Mathematics",
      attendancePercent: 90,
      scorePercent: 82,
      status: "PENDING",
      requestedDate: "2026-08-16"
    }
  ]
};

// 1. Student Dashboard API
export const getStudentDashboard = async (req, res) => {
  try {
    const studentParCode = req.query.parCode || "PAR-8829-KPR";
    const studentName = req.query.studentName || "Samruddhi";

    const allPsychometric = await getPsychometricRecords();
    const studentTestResult = allPsychometric.find(
      r => r.studentName?.toLowerCase() === studentName.toLowerCase() ||
           r.studentName?.toLowerCase().includes("samruddhi") ||
           r.studentName?.toLowerCase().includes("aarav")
    ) || allPsychometric[0] || {
      totalMarks: 88,
      learningStyle: "Visual & Conceptual Learner",
      grade: "Grade 10",
      board: "CBSE",
      breakdown: { analytical: 90, conceptual: 100, examStrategy: 75, problemSolving: 85 }
    };

    const studentNotifs = dashboardStore.notifications.filter(n => n.targetParCode === studentParCode || n.targetParCode === "ALL");
    const studentEnrollments = dashboardStore.studentEnrollments.filter(
      e => e.studentParCode === studentParCode || e.studentName?.toLowerCase() === studentName.toLowerCase()
    );

    return res.json({
      success: true,
      studentProfile: {
        name: studentName,
        parCode: studentParCode,
        grade: studentTestResult.grade || "Grade 10",
        board: studentTestResult.board || "CBSE",
        avgScorePercent: studentTestResult.totalMarks || 88,
        enrolledSubjectsCount: 3,
        teachersEnrolledCount: studentEnrollments.length || 3,
        subjects: ["Mathematics", "Physics", "Chemistry"]
      },
      enrolledTutors: studentEnrollments,
      testScoreSheet: studentTestResult,
      notifications: studentNotifs
    });
  } catch (err) {
    console.error("Error fetching student dashboard:", err);
    return res.status(500).json({ success: false, message: "Server error fetching student dashboard" });
  }
};

// 2. Parent Dashboard API
export const getParentDashboard = async (req, res) => {
  try {
    const { parCode = "PAR-8829-KPR", parentEmail = "parent@example.com" } = req.query;

    const isLinked = dashboardStore.linkedParents.find(p => p.parCode === parCode || p.parentEmail === parentEmail);

    const allPsychometric = await getPsychometricRecords();
    const childTestResult = allPsychometric[0] || {
      totalMarks: 88,
      learningStyle: "Visual & Conceptual Learner",
      grade: "Grade 10",
      board: "CBSE",
      breakdown: { analytical: 90, conceptual: 100, examStrategy: 75, problemSolving: 85 },
      suggestions: ["Focus on timed board sample papers."]
    };

    const childEnrollments = dashboardStore.studentEnrollments.filter(e => e.studentParCode === parCode || e.studentParCode === "PAR-8829-KPR");
    const teacherNotifs = dashboardStore.notifications.filter(n => n.targetParCode === parCode || n.targetParCode === "PAR-8829-KPR" || n.targetParCode === "ALL");

    return res.json({
      success: true,
      isLinked: !!isLinked,
      parCode,
      parentProfile: {
        name: isLinked ? isLinked.parentName : "Parent User",
        email: parentEmail
      },
      childProfile: {
        name: isLinked ? isLinked.studentName : "Samruddhi",
        parCode,
        grade: childTestResult.grade || "Grade 10",
        board: childTestResult.board || "CBSE",
        avgMarks: childTestResult.totalMarks || 88,
        attendanceAvg: "95%"
      },
      enrolledTutors: childEnrollments,
      testScoreSheet: childTestResult,
      notificationsFromTeachers: teacherNotifs
    });
  } catch (err) {
    console.error("Error fetching parent dashboard:", err);
    return res.status(500).json({ success: false, message: "Server error fetching parent dashboard" });
  }
};

// 3. Link Parent to Student via Unique PAR-CODE
export const linkParentAccount = async (req, res) => {
  try {
    const { parCode, parentName = "Parent User", parentEmail } = req.body;

    if (!parCode) {
      return res.status(400).json({ success: false, message: "Please enter a valid unique Student PAR-CODE" });
    }

    // Verify PAR-CODE validity
    const normalizedCode = parCode.trim().toUpperCase();
    
    const newLink = {
      parCode: normalizedCode,
      parentName,
      parentEmail: parentEmail || "parent@example.com",
      studentName: "Aarav Patel",
      linkedAt: new Date().toISOString()
    };

    dashboardStore.linkedParents.push(newLink);

    return res.json({
      success: true,
      message: `Successfully linked account to Student PAR-CODE: ${normalizedCode}!`,
      link: newLink
    });
  } catch (err) {
    console.error("Error linking parent account:", err);
    return res.status(500).json({ success: false, message: "Server error linking parent account" });
  }
};

// 4. Teacher Dashboard API
export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherName = req.query.teacherName || "Dr. Rajesh Deshmukh";

    const studentRequests = dashboardStore.studentEnrollments;
    const sentNotifications = dashboardStore.notifications;

    return res.json({
      success: true,
      teacherProfile: {
        name: teacherName,
        location: "Kopargaon, San Francisco",
        subjects: ["Mathematics", "Physics", "Chemistry"],
        hourlyRate: 500,
        experienceYears: 5,
        qualification: "M.Sc Mathematics",
        rating: 4.95
      },
      stats: {
        subjectsOfferedCount: 3,
        hourlyRate: 500,
        experienceYears: 5,
        studentRequestsCount: studentRequests.length
      },
      studentRequests,
      sentNotifications
    });
  } catch (err) {
    console.error("Error fetching teacher dashboard:", err);
    return res.status(500).json({ success: false, message: "Server error fetching teacher dashboard" });
  }
};

// 5. Send Notification from Teacher to Students & Parents
export const sendTeacherNotification = async (req, res) => {
  try {
    const { teacherName = "Dr. Rajesh Deshmukh", targetParCode = "PAR-8829-KPR", title, message, type = "ANNOUNCEMENT" } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message content are required" });
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      teacherName,
      targetParCode,
      title,
      message,
      type,
      createdAt: new Date().toISOString()
    };

    dashboardStore.notifications.unshift(newNotif);

    return res.status(201).json({
      success: true,
      message: "Notification broadcasted successfully to student and parent!",
      notification: newNotif
    });
  } catch (err) {
    console.error("Error sending teacher notification:", err);
    return res.status(500).json({ success: false, message: "Server error broadcasting notification" });
  }
};

// 7. Enroll Student with Tutor
export const enrollStudentTutor = async (req, res) => {
  try {
    const { parCode = "PAR-8829-KPR", studentName = "Samruddhi", tutorName, subject } = req.body;

    if (!tutorName || !subject) {
      return res.status(400).json({ success: false, message: "Tutor name and subject are required" });
    }

    const existingIndex = dashboardStore.studentEnrollments.findIndex(
      e => (e.studentParCode === parCode || e.studentName === studentName) && e.tutorName?.toLowerCase() === tutorName.toLowerCase()
    );

    if (existingIndex >= 0) {
      dashboardStore.studentEnrollments[existingIndex].status = "ACCEPTED";
    } else {
      dashboardStore.studentEnrollments.unshift({
        id: `enr-${Date.now()}`,
        studentName,
        studentParCode: parCode,
        grade: "Grade 10",
        tutorId: `tut-${Date.now()}`,
        tutorName,
        subject,
        attendancePercent: 100,
        scorePercent: 90,
        status: "ACCEPTED",
        requestedDate: new Date().toISOString().split('T')[0]
      });
    }

    return res.json({
      success: true,
      message: `Enrolled with ${tutorName} for ${subject}`,
      enrollments: dashboardStore.studentEnrollments
    });
  } catch (err) {
    console.error("Error enrolling tutor:", err);
    return res.status(500).json({ success: false, message: "Server error enrolling tutor" });
  }
};

// 8. De-Enroll Student from Tutor
export const unenrollStudentTutor = async (req, res) => {
  try {
    const { parCode = "PAR-8829-KPR", studentName = "Samruddhi", tutorName, subject } = req.body;

    if (!tutorName) {
      return res.status(400).json({ success: false, message: "Tutor name is required for de-enrollment" });
    }

    dashboardStore.studentEnrollments = dashboardStore.studentEnrollments.filter(
      e => !( (e.studentParCode === parCode || e.studentName === studentName) && e.tutorName?.toLowerCase() === tutorName.toLowerCase() )
    );

    return res.json({
      success: true,
      message: `De-enrolled from ${tutorName}`,
      enrollments: dashboardStore.studentEnrollments
    });
  } catch (err) {
    console.error("Error de-enrolling tutor:", err);
    return res.status(500).json({ success: false, message: "Server error de-enrolling tutor" });
  }
};

// 9. Admin Dashboard API
export const getAdminDashboardData = async (req, res) => {
  try {
    const tutors = await getDbTutors('ALL', 'ALL');
    const demos = await getDemoRequestsDb();
    const pendingKyc = tutors.filter(t => t.kycStatus === 'PENDING_VERIFICATION');

    return res.json({
      success: true,
      stats: {
        totalTutorsCount: tutors.length,
        pendingKycCount: pendingKyc.length,
        totalDemosCount: demos.length,
        linkedParentsCount: dashboardStore.linkedParents.length
      },
      tutors,
      pendingKycTutors: pendingKyc,
      demoRequests: demos,
      linkedParents: dashboardStore.linkedParents
    });
  } catch (err) {
    console.error("Error fetching admin dashboard:", err);
    return res.status(500).json({ success: false, message: "Server error fetching admin dashboard" });
  }
};
