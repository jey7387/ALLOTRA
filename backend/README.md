# Housing Board Backend API

## Overview

This is the backend API for the State Housing Board Allotment & Waitlist Portal. It provides RESTful endpoints for managing housing schemes, applications, waitlists, and allotments.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- Bcrypt (password hashing)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=housing_board
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Set up PostgreSQL database:
```bash
# Create database
createdb housing_board

# Run schema
psql -d housing_board -f config/schema.sql
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `GET /api/schemes/stats` - Get scheme statistics
- `POST /api/schemes` - Create scheme (Admin only)
- `PUT /api/schemes/:id` - Update scheme (Admin only)
- `DELETE /api/schemes/:id` - Delete scheme (Admin only)

### Applications
- `GET /api/applications/my` - Get my applications
- `GET /api/applications` - Get all applications (Officer/Admin)
- `GET /api/applications/:id` - Get application by ID
- `GET /api/applications/stats` - Get application statistics (Officer/Admin)
- `POST /api/applications` - Create application (Citizen)
- `PUT /api/applications/:id` - Update application (Officer/Admin)
- `PUT /api/applications/:id/details` - Update application details

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/application/:application_id` - Get application documents
- `PUT /api/documents/:id/verify` - Verify document (Officer/Admin)
- `DELETE /api/documents/:id` - Delete document

### Waitlist
- `POST /api/waitlist/generate/:scheme_id` - Generate waitlist (Officer/Admin)
- `GET /api/waitlist/scheme/:scheme_id` - Get scheme waitlist (Officer/Admin)
- `GET /api/waitlist/my` - Get my waitlist position
- `PUT /api/waitlist/rank/:application_id` - Update waitlist rank (Officer/Admin)
- `DELETE /api/waitlist/:application_id` - Remove from waitlist (Officer/Admin)

### Allotments
- `GET /api/allotments/my` - Get my allotments
- `GET /api/allotments/scheme/:scheme_id` - Get scheme allotments (Officer/Admin)
- `GET /api/allotments/stats` - Get allotment statistics (Officer/Admin)
- `POST /api/allotments` - Create allotment (Officer/Admin)

### Notifications
- `GET /api/notifications` - Get my notifications
- `GET /api/notifications/unread` - Get unread notifications
- `POST /api/notifications` - Create notification (Admin)
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)

## User Roles

- **Citizen**: Can apply for schemes, upload documents, track applications
- **Officer**: Can verify applications, generate waitlists, approve allotments
- **Admin**: Can manage users, schemes, and view all data

## Database Schema

The application uses the following tables:
- users
- schemes
- applications
- application_details
- documents
- waitlists
- allotments
- notifications

## Security

- JWT authentication for protected routes
- Role-based access control
- Password hashing with bcrypt
- File upload validation
- SQL injection prevention with parameterized queries
