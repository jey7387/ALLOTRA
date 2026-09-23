# Setup Guide - State Housing Board Portal

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create a new database**:
```bash
createdb housing_board
```

3. **Run the schema** to create all tables:
```bash
psql -d housing_board -f backend/config/schema.sql
```

## Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables** in `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=housing_board
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Start the backend server**:
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Creating Initial Users

Since there's no user registration for officers/admins, you'll need to create them directly in the database:

### Create an Admin User
```sql
INSERT INTO users (full_name, email, phone, password, role, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@housing.gov',
  '9876543210',
  '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', -- Hash of 'admin123'
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

### Create an Officer User
```sql
INSERT INTO users (full_name, email, phone, password, role, created_at, updated_at)
VALUES (
  'Officer User',
  'officer@housing.gov',
  '9876543211',
  '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', -- Hash of 'officer123'
  'officer',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

**Note**: For testing purposes, you can use a simple password hash. In production, always use proper password hashing.

## Create Sample Housing Schemes

```sql
INSERT INTO schemes (name, description, location, price, total_units, available_units, category, start_date, end_date, status, created_at, updated_at)
VALUES 
(
  'Green Valley Housing Scheme',
  'Affordable housing for low-income families',
  'Green Valley, New Delhi',
  1500000,
  100,
  80,
  'LIG',
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Sunrise Apartments',
  'Premium housing for middle-income families',
  'Sunrise City, Mumbai',
  3500000,
  50,
  30,
  'MIG',
  '2024-03-01',
  '2024-11-30',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

## Testing the Application

### 1. Test Citizen Flow
- Register as a new citizen at `http://localhost:3000/register`
- Login with your credentials
- Browse housing schemes at `http://localhost:3000/schemes`
- Apply for a scheme using the multi-step form
- Upload documents
- View your applications at `http://localhost:3000/applications`
- Check waitlist status at `http://localhost:3000/waitlist`

### 2. Test Officer Flow
- Login as officer (email: `officer@housing.gov`)
- View pending applications
- Verify documents
- Approve or reject applications
- Generate waitlists
- View analytics charts

### 3. Test Admin Flow
- Login as admin (email: `admin@housing.gov`)
- View dashboard analytics
- Manage users
- Create and manage housing schemes
- View comprehensive reports

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `POST /api/schemes` - Create scheme (Admin)
- `PUT /api/schemes/:id` - Update scheme (Admin)
- `DELETE /api/schemes/:id` - Delete scheme (Admin)

### Applications
- `GET /api/applications/my` - Get my applications
- `GET /api/applications` - Get all applications (Officer/Admin)
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Create application (Citizen)
- `PUT /api/applications/:id` - Update application (Officer/Admin)
- `GET /api/applications/stats` - Get application statistics (Officer/Admin)
- `GET /api/applications/monthly` - Get monthly statistics (Officer/Admin)

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/application/:id` - Get application documents
- `PUT /api/documents/:id/verify` - Verify document (Officer/Admin)

### Waitlist
- `POST /api/waitlist/generate/:schemeId` - Generate waitlist (Officer/Admin)
- `GET /api/waitlist/my` - Get my waitlist position
- `GET /api/waitlist/scheme/:schemeId` - Get scheme waitlist (Officer/Admin)

### Allotments
- `POST /api/allotments` - Create allotment (Officer/Admin)
- `GET /api/allotments/my` - Get my allotments
- `GET /api/allotments/scheme/:schemeId` - Get scheme allotments (Officer/Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Ensure the database `housing_board` exists

### Frontend won't start
- Ensure backend is running on port 5000
- Check if port 3000 is available
- Verify all dependencies are installed

### Database connection errors
- Check PostgreSQL service status
- Verify connection string in `.env`
- Ensure database user has proper permissions

### File upload errors
- Ensure `uploads` directory exists in backend
- Check Multer configuration in `documents.js` route
- Verify file size limits

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment variables
2. Use a strong JWT secret
3. Configure CORS for production domain
4. Use a production-grade database
5. Set up SSL/TLS
6. Configure proper logging

### Frontend
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure API proxy for production backend URL
4. Enable gzip compression
5. Set up proper caching headers

## Security Considerations

- Change default passwords immediately
- Use environment variables for sensitive data
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS in production
- Regular security audits
- Keep dependencies updated

## Support

For issues or questions, refer to the main README.md file or check the code documentation.
