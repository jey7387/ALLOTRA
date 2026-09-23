import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, FileText, List, Shield, User, LogOut, Heart, Bell, HelpCircle, Clock, Scan } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home', show: true },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', show: !!user },
    { path: '/schemes', icon: FileText, label: 'Schemes', show: !!user },
    { path: '/applications', icon: List, label: 'Applications', show: !!user },
    { path: '/verification', icon: Scan, label: 'Document Verification', show: !!user && user.role === 'citizen' },
    { path: '/favorites', icon: Heart, label: 'Favorites', show: !!user && user.role === 'citizen' },
    { path: '/drafts', icon: FileText, label: 'Drafts', show: !!user && user.role === 'citizen' },
    { path: '/news', icon: Bell, label: 'News', show: !!user },
    { path: '/faq', icon: HelpCircle, label: 'FAQ', show: !!user },
    { path: '/waitlist', icon: Clock, label: 'Waitlist', show: !!user && user.role === 'citizen' },
    { path: '/officer', icon: Shield, label: 'Officer Panel', show: !!user && user.role === 'officer' },
    { path: '/admin', icon: Shield, label: 'Admin Panel', show: !!user && user.role === 'admin' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Housing Board</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.filter(item => item.show).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              {user && <NotificationCenter />}
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                    >
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {user.full_name}
                      </span>
                    </button>
                    
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2 slide-up">
            {navItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            {!user && (
              <div className="pt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center btn btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-x-hidden">
        <Outlet />
      </main>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-100/50 mt-auto flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">Housing Board</span>
              </div>
              <p className="text-sm text-gray-600">
                Empowering citizens with affordable housing solutions through transparent and efficient allotment processes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/schemes" className="hover:text-blue-600 transition-colors">Housing Schemes</Link></li>
                <li><Link to="/applications" className="hover:text-blue-600 transition-colors">My Applications</Link></li>
                <li><Link to="/waitlist" className="hover:text-blue-600 transition-colors">Waitlist Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Email: support@housing.gov</li>
                <li>Phone: 1800-XXX-XXXX</li>
                <li>Address: Housing Board Office, State Capital</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              © 2024 State Housing Board. All rights reserved. Built with ❤️ for citizens.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
