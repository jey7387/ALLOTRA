const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  generateWaitlist,
  getSchemeWaitlist,
  getMyWaitlist,
  updateWaitlistRank,
  removeFromWaitlist
} = require('../controllers/waitlistController');

router.post('/generate/:scheme_id', auth, authorize('officer', 'admin'), generateWaitlist);
router.get('/scheme/:scheme_id', auth, authorize('officer', 'admin'), getSchemeWaitlist);
router.get('/my', auth, getMyWaitlist);

router.put('/rank/:application_id', auth, authorize('officer', 'admin'), updateWaitlistRank);
router.delete('/:application_id', auth, authorize('officer', 'admin'), removeFromWaitlist);

module.exports = router;
