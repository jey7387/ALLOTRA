const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createNotification,
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

router.get('/my', auth, getMyNotifications);
router.get('/unread', auth, getUnreadNotifications);

router.post('/', auth, authorize('admin'), createNotification);
router.put('/:id/read', auth, markAsRead);
router.put('/mark-all-read', auth, markAllAsRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
