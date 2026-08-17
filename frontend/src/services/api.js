import axios from 'axios';

const API_BASE = '/api';

export const fetchTutors = async (subject = 'ALL') => {
  const res = await axios.get(`${API_BASE}/tutors`, { params: { subject } });
  return res.data;
};

export const calculateMatch = async (criteria) => {
  const res = await axios.post(`${API_BASE}/match`, criteria);
  return res.data;
};

export const requestDemo = async (payload) => {
  const res = await axios.post(`${API_BASE}/demos`, payload);
  return res.data;
};

export const fetchAdminStats = async () => {
  const res = await axios.get(`${API_BASE}/admin/stats`);
  return res.data;
};

export const approveKyc = async (tutorId) => {
  const res = await axios.patch(`${API_BASE}/admin/kyc/${tutorId}`);
  return res.data;
};

export const fetchDemoRequests = async () => {
  const res = await axios.get(`${API_BASE}/demos`);
  return res.data;
};

export const fetchPsychometricQuestions = async (grade, board, subject) => {
  const res = await axios.get(`${API_BASE}/psychometric/questions`, { params: { grade, board, subject } });
  return res.data;
};

export const submitPsychometricTest = async (payload) => {
  const res = await axios.post(`${API_BASE}/psychometric/submit`, payload);
  return res.data;
};

export const fetchPsychometricHistory = async () => {
  const res = await axios.get(`${API_BASE}/psychometric/history`);
  return res.data;
};

// Dashboard API Functions
export function generateParCode(userName = 'User') {
  if (!userName) return 'PAR-8829-KPR';
  let hash = 0;
  const cleanName = userName.trim();
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }
  const positive = (Math.abs(hash) % 8999) + 1000;
  let prefix = cleanName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  if (prefix.length < 3) prefix = (prefix + 'EDU').substring(0, 3);
  return `PAR-${prefix}${positive}-KPR`;
}

export const fetchStudentDashboard = async (parCode = 'PAR-8829-KPR') => {
  const res = await axios.get(`${API_BASE}/dashboard/student`, { params: { parCode } });
  return res.data;
};

export const fetchParentDashboard = async (parCode = 'PAR-8829-KPR') => {
  const res = await axios.get(`${API_BASE}/dashboard/parent`, { params: { parCode } });
  return res.data;
};

export const linkParentParCode = async (parCode, parentName, parentEmail) => {
  const res = await axios.post(`${API_BASE}/dashboard/parent/link`, { parCode, parentName, parentEmail });
  return res.data;
};

export const fetchTeacherDashboard = async (teacherName = 'Dr. Rajesh Deshmukh') => {
  const res = await axios.get(`${API_BASE}/dashboard/teacher`, { params: { teacherName } });
  return res.data;
};

export const sendTeacherNotificationApi = async (payload) => {
  const res = await axios.post(`${API_BASE}/dashboard/teacher/notify`, payload);
  return res.data;
};

export const fetchAdminDashboard = async () => {
  const res = await axios.get(`${API_BASE}/dashboard/admin`);
  return res.data;
};

export const enrollStudentApi = async (payload) => {
  const res = await axios.post(`${API_BASE}/dashboard/enroll`, payload);
  return res.data;
};

export const unenrollStudentApi = async (payload) => {
  const res = await axios.post(`${API_BASE}/dashboard/unenroll`, payload);
  return res.data;
};

export const syncUsersApi = async (userData) => {
  const res = await axios.post(`${API_BASE}/users/sync`, userData);
  return res.data;
};

export const fetchUsersApi = async () => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data;
};

