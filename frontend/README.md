# Housing Board Frontend

## Overview

This is the frontend application for the State Housing Board Allotment & Waitlist Portal. Built with React, Vite, and Tailwind CSS, it provides a modern, responsive interface for citizens, officers, and administrators.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Lucide React (Icons)
- Recharts (Charts)
- React Hot Toast (Notifications)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Features

### For Citizens
- Register and login
- Browse housing schemes
- Apply for schemes with multi-step form
- Upload documents
- Track application status
- View waitlist position with visual progress
- Download allotment letters

### For Officers
- View pending applications
- Verify documents
- Approve or reject applications
- Generate waitlists
- Approve allotments
- View dashboard analytics

### For Administrators
- Manage users
- Manage housing schemes
- View comprehensive reports
- Monitor system performance
- Manage officers

## Pages

- **Landing Page** - Modern landing page with features and benefits
- **Login/Register** - Authentication pages
- **Citizen Dashboard** - Overview of applications and quick actions
- **Housing Schemes** - Browse and filter available schemes
- **Apply** - Multi-step application form
- **My Applications** - Track all applications
- **Waitlist** - Visual waitlist tracking with progress rings
- **Officer Dashboard** - Application verification and management
- **Admin Dashboard** - System management and analytics
- **Profile** - User profile management

## Components

### UI Components
- **Layout** - Navigation and layout structure
- **Card** - Reusable card component with variants
- **Button** - Button with multiple variants and sizes
- **Input** - Form inputs with validation
- **StatusChip** - Status badges
- **LoadingSpinner** - Loading states
- **EmptyState** - Empty state displays
- **ProgressBar** - Progress indicators
- **Modal** - Dialog modals

### Context
- **AuthContext** - Authentication state management

### Services
- **API** - Axios instance with interceptors

## Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Accent**: Emerald (#10b981)
- **Background**: White
- **Text**: Gray (#1f2937)

### Typography
- Modern, clean typography
- Large headings
- Readable body text
- Proper spacing

### Components
- Rounded corners (xl)
- Soft shadows
- Smooth animations
- Responsive layout

## Environment Variables

No environment variables required for frontend. The API proxy is configured in `vite.config.js`.

## Folder Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── services/      # API services
├── utils/         # Utility functions
├── App.jsx        # Main app component
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
