// EduLinker - Seed Database & Data Store

const SEED_DATA = {
  subjects: [
    "Mathematics", "Physics", "Chemistry", "Computer Science", 
    "Biology", "English Literature", "Accountancy & Economics", "Vedic Maths"
  ],
  classes: [
    "Grade 1-5 (Primary)", "Grade 6-8 (Middle)", 
    "Grade 9-10 (High School)", "Grade 11-12 (Senior Sec)"
  ],
  boards: ["CBSE", "ICSE", "IB Diploma", "Cambridge (IGCSE)"],
  modes: ["Both (In-Person & Online)", "Online Only", "In-Person Only"],

  tutors: [
    {
      id: "tut-101",
      name: "Dr. Ananya Sharma",
      title: "Ph.D. Mathematics (IIT Delhi) | 8+ Yrs Exp",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      location: "South Extension, New Delhi",
      mode: "Both (In-Person & Online)",
      hourlyRate: 1200,
      rating: 4.95,
      totalReviews: 48,
      subjects: ["Mathematics", "Physics", "Vedic Maths"],
      classes: ["Grade 9-10 (High School)", "Grade 11-12 (Senior Sec)"],
      boards: ["CBSE", "ICSE", "IB Diploma"],
      isVerified: true,
      degreeVerified: true,
      kycStatus: "APPROVED",
      bio: "Ex-Visiting Faculty at Delhi University. Specializes in Calculus, Coordinate Geometry, and Advanced Problem Solving for Grade 9-12. 98% of my students score >95 in Board exams.",
      qualification: "Ph.D. in Applied Mathematics (IIT Delhi)",
      experienceYears: 8
    },
    {
      id: "tut-102",
      name: "Rohan Varma",
      title: "B.Tech Computer Science (IIT Bombay) | Coding Specialist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      location: "Indiranagar, Bengaluru",
      mode: "Online Only",
      hourlyRate: 1500,
      rating: 4.98,
      totalReviews: 64,
      subjects: ["Computer Science", "Mathematics"],
      classes: ["Grade 6-8 (Middle)", "Grade 9-10 (High School)", "Grade 11-12 (Senior Sec)"],
      boards: ["CBSE", "ICSE", "IB Diploma", "Cambridge (IGCSE)"],
      isVerified: true,
      degreeVerified: true,
      kycStatus: "APPROVED",
      bio: "Full-stack software engineer & mentor. Teaches Python, Java, Data Structures, AP Computer Science, and IGCSE Computer Studies with hands-on coding projects.",
      qualification: "B.Tech CS (IIT Bombay)",
      experienceYears: 6
    },
    {
      id: "tut-103",
      name: "Kavita Nair",
      title: "M.Sc Organic Chemistry | Senior IB Educator",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
      location: "Bandra West, Mumbai",
      mode: "Both (In-Person & Online)",
      hourlyRate: 1100,
      rating: 4.89,
      totalReviews: 32,
      subjects: ["Chemistry", "Biology"],
      classes: ["Grade 9-10 (High School)", "Grade 11-12 (Senior Sec)"],
      boards: ["IB Diploma", "Cambridge (IGCSE)", "ICSE"],
      isVerified: true,
      degreeVerified: true,
      kycStatus: "APPROVED",
      bio: "Former Head of Science at St. Xavier's High School. Expert in IB Chemistry Higher Level (HL) and Standard Level (SL) Internal Assessments (IA).",
      qualification: "M.Sc Chemistry (St. Xavier's)",
      experienceYears: 11
    },
    {
      id: "tut-104",
      name: "Vikramaditya Roy",
      title: "M.A. English (Oxford University Alum)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      location: "Park Street, Kolkata",
      mode: "Online Only",
      hourlyRate: 950,
      rating: 4.92,
      totalReviews: 29,
      subjects: ["English Literature"],
      classes: ["Grade 6-8 (Middle)", "Grade 9-10 (High School)", "Grade 11-12 (Senior Sec)"],
      boards: ["CBSE", "ICSE", "IB Diploma", "Cambridge (IGCSE)"],
      isVerified: true,
      degreeVerified: true,
      kycStatus: "APPROVED",
      bio: "Focuses on creative writing, literary analysis, essay structuring, and public speaking. Prepares students for ICSE/IB English Literature essays and SAT English.",
      qualification: "M.A. English Literature (University of Oxford)",
      experienceYears: 7
    },
    {
      id: "tut-105",
      name: "Pooja Deshmukh",
      title: "Chartered Accountant (CA) & Economics Educator",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=250&q=80",
      location: "Kothrud, Pune",
      mode: "Both (In-Person & Online)",
      hourlyRate: 1300,
      rating: 4.91,
      totalReviews: 21,
      subjects: ["Accountancy & Economics", "Mathematics"],
      classes: ["Grade 11-12 (Senior Sec)"],
      boards: ["CBSE", "ICSE"],
      isVerified: true,
      degreeVerified: true,
      kycStatus: "APPROVED",
      bio: "Practicing CA with a passion for teaching. Simplifies complex balance sheets, microeconomics models, and cash flow statements for 11th & 12th Commerce students.",
      qualification: "FCA, B.Com (H)",
      experienceYears: 9
    },
    {
      id: "tut-106",
      name: "Siddharth Malhotra",
      title: "B.Sc Physics (IISc Bangalore)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
      location: "Jayanagar, Bengaluru",
      mode: "In-Person Only",
      hourlyRate: 850,
      rating: 4.85,
      totalReviews: 18,
      subjects: ["Physics", "Mathematics"],
      classes: ["Grade 6-8 (Middle)", "Grade 9-10 (High School)"],
      boards: ["CBSE", "ICSE"],
      isVerified: false,
      degreeVerified: false,
      kycStatus: "PENDING_VERIFICATION",
      bio: "Enthusiastic science mentor building fundamental conceptual clarity in Mechanics, Optics, and Electromagnetism using practical experiments.",
      qualification: "B.Sc Physics (IISc)",
      experienceYears: 4
    }
  ],

  demoRequests: [
    {
      id: "demo-801",
      parentName: "Sanjay Singhania",
      studentGrade: "Grade 10",
      subject: "Mathematics",
      tutorId: "tut-101",
      tutorName: "Dr. Ananya Sharma",
      requestedTime: "Tomorrow at 5:00 PM",
      mode: "Online Demo",
      status: "CONFIRMED",
      createdAt: "2026-08-16 14:30"
    },
    {
      id: "demo-802",
      parentName: "Meera Kapoor",
      studentGrade: "Grade 12",
      subject: "Computer Science",
      tutorId: "tut-102",
      tutorName: "Rohan Varma",
      requestedTime: "Saturday at 11:00 AM",
      mode: "Online Demo",
      status: "PENDING_TUTOR_ACCEPT",
      createdAt: "2026-08-16 15:45"
    }
  ]
};

// LocalStorage Persistence Wrapper
class StorageManager {
  static getTutors() {
    const data = localStorage.getItem("edulinker_tutors");
    return data ? JSON.parse(data) : SEED_DATA.tutors;
  }

  static saveTutors(tutors) {
    localStorage.setItem("edulinker_tutors", JSON.stringify(tutors));
  }

  static getDemoRequests() {
    const data = localStorage.getItem("edulinker_demos");
    return data ? JSON.parse(data) : SEED_DATA.demoRequests;
  }

  static saveDemoRequest(request) {
    const current = StorageManager.getDemoRequests();
    current.unshift(request);
    localStorage.setItem("edulinker_demos", JSON.stringify(current));
  }

  static updateTutorKyc(tutorId, status) {
    const tutors = StorageManager.getTutors();
    const index = tutors.findIndex(t => t.id === tutorId);
    if (index !== -1) {
      tutors[index].kycStatus = status;
      tutors[index].isVerified = (status === 'APPROVED');
      tutors[index].degreeVerified = (status === 'APPROVED');
      StorageManager.saveTutors(tutors);
    }
    return tutors;
  }
}
