import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import { PageLoader } from './components/LoadingSpinner';

// Lazy load pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const CitizenDashboard = React.lazy(() => import('./pages/CitizenDashboard'));
const HousingSchemes = React.lazy(() => import('./pages/HousingSchemes'));
const Apply = React.lazy(() => import('./pages/Apply'));
const MyApplications = React.lazy(() => import('./pages/MyApplications'));
const ApplicationDetails = React.lazy(() => import('./pages/ApplicationDetails'));
const Waitlist = React.lazy(() => import('./pages/Waitlist'));
const OfficerDashboard = React.lazy(() => import('./pages/OfficerDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const SchemeManagement = React.lazy(() => import('./pages/SchemeManagement'));
const Profile = React.lazy(() => import('./pages/Profile'));
const FAQ = React.lazy(() => import('./pages/FAQ'));

// Lazy load feature components
const FavoriteSchemes = React.lazy(() => import('./components/FavoriteSchemes'));
const DraftApplications = React.lazy(() => import('./components/DraftApplications'));
const NewsAnnouncements = React.lazy(() => import('./components/NewsAnnouncements'));
const FAQSection = React.lazy(() => import('./components/FAQSection'));
const DocumentVerification = React.lazy(() => import('./components/DocumentVerification'));

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <PageLoader />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="schemes"
            element={
              <ProtectedRoute>
                <HousingSchemes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="apply/:schemeId"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <Apply />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetails />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="waitlist"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <Waitlist />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="officer"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="admin/schemes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SchemeManagement />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="verification"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <DocumentVerification />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="favorites"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <FavoriteSchemes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="drafts"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <DraftApplications />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="news"
            element={
              <ProtectedRoute>
                <NewsAnnouncements />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
}

export default App;
