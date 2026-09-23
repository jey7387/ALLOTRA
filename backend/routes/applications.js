const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplication,
  updateApplicationDetails,
  getApplicationStats,
  getMonthlyStats
} = require('../controllers/applicationController');

router.get('/stats', auth, authorize('officer', 'admin'), getApplicationStats);
router.get('/monthly', auth, authorize('officer', 'admin'), getMonthlyStats);
router.get('/my', auth, getMyApplications);
router.get('/', auth, authorize('officer', 'admin'), getAllApplications);
router.get('/:id', auth, getApplicationById);

router.post('/', auth, authorize('citizen'), createApplication);
router.put('/:id', auth, authorize('officer', 'admin'), updateApplication);
router.put('/:id/details', auth, updateApplicationDetails);

module.exports = router;
