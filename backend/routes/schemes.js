const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  getSchemeStats
} = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.get('/stats', getSchemeStats);
router.get('/:id', getSchemeById);

router.post('/', auth, authorize('admin'), createScheme);
router.put('/:id', auth, authorize('admin'), updateScheme);
router.delete('/:id', auth, authorize('admin'), deleteScheme);

module.exports = router;
