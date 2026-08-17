import { getDbTutors, approveTutorKycDb, getDemoRequestsDb } from '../config/database.js';

export const getAdminStats = async (req, res) => {
  try {
    const tutors = await getDbTutors('ALL', 'ALL');
    const demos = await getDemoRequestsDb();
    const pendingKyc = tutors.filter(t => t.kycStatus === 'PENDING_VERIFICATION');

    return res.json({
      success: true,
      stats: {
        totalTutors: tutors.length,
        pendingKycCount: pendingKyc.length,
        totalDemosCount: demos.length,
      },
      pendingKycTutors: pendingKyc
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching admin stats' });
  }
};

export const approveKycStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await approveTutorKycDb(id);
    return res.json({
      success: true,
      message: `KYC approved for tutor ${id}`
    });
  } catch (err) {
    console.error('Error approving KYC status:', err);
    return res.status(500).json({ success: false, message: 'Server error approving KYC' });
  }
};
