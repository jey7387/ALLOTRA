# State Housing Board Allotment & Waitlist Portal

A modern, production-quality full-stack web application for managing housing board allotments and waitlists. Built with a focus on clean UI, smooth user experience, and efficient functionality.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Lucide React** - Icons
- **Recharts** - Charts
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## 📋 Features

### For Citizens
- ✅ User registration and login
- ✅ Browse available housing schemes
- ✅ Multi-step application form with document upload
- ✅ Track application status in real-time
- ✅ Visual waitlist tracking with progress rings
- ✅ Download allotment letters
- ✅ Profile management

### For Officers
- ✅ View and filter pending applications
- ✅ Verify uploaded documents
- ✅ Approve or reject applications
- ✅ Generate waitlists for schemes
- ✅ Approve housing allotments
- ✅ Dashboard with analytics

### For Administrators
- ✅ Manage users (CRUD operations)
- ✅ Create and manage housing schemes
- ✅ View comprehensive reports
- ✅ Monitor system performance
- ✅ Manage officer accounts

## 🎨 Design

- **Modern SaaS-style interface** inspired by Linear, Notion, and Stripe
- **White background** with blue primary color and emerald accents
- **Rounded cards** with soft shadows
- **Large spacing** and smooth animations
- **Fully responsive** layout
- **Loading skeletons** and empty states
- **Toast notifications** for user feedback

## 📁 Project Structure

```
Allotra/
├── backend/                 # Express.js API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
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

4. Set up PostgreSQL database:
```bash
createdb housing_board
psql -d housing_board -f config/schema.sql
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📊 Database Schema

The application uses the following tables:
- **users** - User accounts and authentication
- **schemes** - Housing scheme information
- **applications** - Application submissions
- **application_details** - Detailed application information
- **documents** - Uploaded documents
- **waitlists** - Waitlist management
- **allotments** - Housing allotments
- **notifications** - User notifications

## 🔐 API Endpoints

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
- `POST /api/applications` - Create application (Citizen)
- `PUT /api/applications/:id` - Update application (Officer/Admin)

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

## 👥 User Roles

### Citizen
- Register and login
- View and apply for housing schemes
- Upload documents
- Track application progress
- View waitlist position
- Download allotment letter

### Officer
- Verify applications
- Approve or reject documents
- Generate waitlists
- Approve allotments
- View dashboard analytics

### Admin
- Manage users
- Manage housing schemes
- View reports
- Manage officers

## 🎯 Key Features

### Modern UI/UX
- Clean, minimalist design
- Smooth animations and transitions
- Responsive layout for all devices
- Intuitive navigation

### Waitlist Visualization
- Circular progress rings
- Real-time position tracking
- Movement indicators
- Estimated allotment dates
- Application timeline

### Multi-Step Application Form
- Progress indicator
- Form validation
- Document upload
- Review before submission

### Dashboard Analytics
- Summary cards with statistics
- Recent activity feeds
- Status breakdowns
- Quick action buttons

## 🧪 Testing

To test the application:

1. Register a new user or use demo accounts
2. Apply for a housing scheme
3. Upload required documents
4. Check waitlist position
5. Use officer account to verify applications
6. Use admin account to manage users and schemes

## 📝 Notes

- The application uses JWT for authentication
- File uploads are handled with Multer
- All passwords are hashed with Bcrypt
- The database uses PostgreSQL with parameterized queries
- The frontend proxies API requests through Vite

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Run database migrations
3. Build and start the server

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure API proxy for production

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Development

Built with modern web development best practices:
- MVC architecture for backend
- Component-based architecture for frontend
- RESTful API design
- Responsive design principles
- Clean code standards

---

**Note**: This is a portfolio-quality project suitable for software engineering interviews and demonstrations.
