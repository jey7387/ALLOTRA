import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Home,
  ArrowRight
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import StatusChip from '../components/StatusChip';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    waitlisted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/applications/my');
      setApplications(response.data);

      const total = response.data.length;
      const pending = response.data.filter(app => app.status === 'pending').length;
      const approved = response.data.filter(app => app.status === 'approved' || app.status === 'allotted').length;
      const waitlisted = response.data.filter(app => app.status === 'waitlisted').length;

      setStats({ total, pending, approved, waitlisted });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: FileText,
      color: 'primary',
      trend: '+2 this month',
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'warning',
      trend: 'Awaiting action',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'success',
      trend: 'Congratulations!',
    },
    {
      title: 'Waitlisted',
      value: stats.waitlisted,
      icon: AlertCircle,
      color: 'accent',
      trend: 'Check position',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's an overview of your housing applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            primary: 'bg-primary-100 text-primary-600',
            warning: 'bg-yellow-100 text-yellow-600',
            success: 'bg-green-100 text-green-600',
            accent: 'bg-accent-100 text-accent-600',
          };

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-gray-500">{stat.trend}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
          <CardContent>
            <Home className="h-8 w-8 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Browse Schemes</h3>
            <p className="text-primary-100 mb-4">Explore available housing schemes</p>
            <Link to="/schemes">
              <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center">
                View Schemes
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white border-0">
          <CardContent>
            <FileText className="h-8 w-8 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">My Applications</h3>
            <p className="text-accent-100 mb-4">Track your application status</p>
            <Link to="/applications">
              <button className="bg-white text-accent-600 px-4 py-2 rounded-lg font-medium hover:bg-accent-50 transition-colors flex items-center">
                View Applications
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent>
            <TrendingUp className="h-8 w-8 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Waitlist Status</h3>
            <p className="text-purple-100 mb-4">Check your current position</p>
            <Link to="/waitlist">
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center">
                Check Position
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <EmptyState
              icon="file"
              title="No applications yet"
              description="Start by applying for a housing scheme"
              action={
                <Link to="/schemes">
                  <button className="btn btn-primary">
                    Browse Schemes
                  </button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Home className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{application.scheme_name}</h4>
                      <p className="text-sm text-gray-500">{application.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusChip status={application.status} />
                    <Link to={`/applications/${application.id}`}>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CitizenDashboard;
