const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const {
  uploadDocument,
  processOCR,
  verifyDocument,
  getVerificationHistory
} = require('../controllers/verificationController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed'));
  }
});

// Upload document
router.post('/upload', auth, upload.single('document'), uploadDocument);

// Process OCR on uploaded document
router.post('/ocr', auth, processOCR);

// Verify document against application data
router.post('/verify', auth, verifyDocument);

// Get verification history
router.get('/history', auth, getVerificationHistory);

module.exports = router;
