const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

router.get('/dashboard', auth, authorize('admin'), getDashboardStats);
router.get('/users', auth, authorize('admin'), getAllUsers);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
