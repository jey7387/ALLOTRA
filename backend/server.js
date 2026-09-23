const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const schemeRoutes = require('./routes/schemes');
const applicationRoutes = require('./routes/applications');
const documentRoutes = require('./routes/documents');
const waitlistRoutes = require('./routes/waitlist');
const allotmentRoutes = require('./routes/allotments');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const verificationRoutes = require('./routes/verification');
// const newsRoutes = require('./routes/news');
// const draftRoutes = require('./routes/drafts');
// const favoriteRoutes = require('./routes/favorites');

app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/allotments', allotmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verification', verificationRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/drafts', draftRoutes);
// app.use('/api/favorites', favoriteRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
