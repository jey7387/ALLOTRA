const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createAllotment,
  getMyAllotments,
  getSchemeAllotments,
  getAllotmentStats
} = require('../controllers/allotmentController');

router.get('/stats', auth, authorize('officer', 'admin'), getAllotmentStats);
router.get('/my', auth, getMyAllotments);
router.get('/scheme/:scheme_id', auth, authorize('officer', 'admin'), getSchemeAllotments);

router.post('/', auth, authorize('officer', 'admin'), createAllotment);

module.exports = router;
