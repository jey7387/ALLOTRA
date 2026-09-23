const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  uploadDocument,
  getApplicationDocuments,
  verifyDocument,
  deleteDocument
} = require('../controllers/documentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  }
});

router.post('/upload', auth, upload.single('document'), uploadDocument);
router.get('/application/:application_id', auth, getApplicationDocuments);

router.put('/:id/verify', auth, authorize('officer', 'admin'), verifyDocument);
router.delete('/:id', auth, deleteDocument);

module.exports = router;
