import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Building2, 
  FileText, 
  TrendingUp,
  Settings,
  UserPlus,
  Trash2,
  Eye
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import { UserDistributionChart, ApplicationStatusChart, HousingAvailabilityChart, MonthlyApplicationsChart } from '../components/Charts';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total_users: 0, citizens: 0, officers: 0, admins: 0 },
    schemes: { total_schemes: 0, total_units: 0, available_units: 0 },
    applications: { 
      total_applications: 0, 
      pending_verification: 0,
      eligible: 0,
      rejected: 0,
      waitlisted: 0,
      allotted: 0,
      monthly: []
    },
    byScheme: [],
    byLocation: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse, monthlyResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/applications/monthly'),
      ]);
      
      // Ensure stats data has all required fields
      const safeStats = {
        users: {
          total_users: statsResponse.data?.users?.total_users || 0,
          citizens: statsResponse.data?.users?.citizens || 0,
          officers: statsResponse.data?.users?.officers || 0,
          admins: statsResponse.data?.users?.admins || 0,
        },
        schemes: {
          total_schemes: statsResponse.data?.schemes?.total_schemes || 0,
          total_units: statsResponse.data?.schemes?.total_units || 0,
          available_units: statsResponse.data?.schemes?.available_units || 0,
        },
        applications: {
          total_applications: statsResponse.data?.applications?.total_applications || 0,
          pending_verification: statsResponse.data?.applications?.pending_verification || 0,
          eligible: statsResponse.data?.applications?.eligible || 0,
          rejected: statsResponse.data?.applications?.rejected || 0,
          waitlisted: statsResponse.data?.applications?.waitlisted || 0,
          allotted: statsResponse.data?.applications?.allotted || 0,
          monthly: Array.isArray(monthlyResponse.data) ? monthlyResponse.data : []
        },
        byScheme: statsResponse.data?.byScheme || [],
        byLocation: statsResponse.data?.byLocation || []
      };
      
      setStats(safeStats);
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
    } catch (error) {
      console.error('Admin dashboard data fetch error:', error);
      toast.error('Failed to fetch dashboard data');
      // Set default values on error
      setStats({
        users: { total_users: 0, citizens: 0, officers: 0, admins: 0 },
        schemes: { total_schemes: 0, total_units: 0, available_units: 0 },
        applications: { 
          total_applications: 0, 
          pending_verification: 0,
          eligible: 0,
          rejected: 0,
          waitlisted: 0,
          allotted: 0,
          monthly: []
        },
        byScheme: [],
        byLocation: []
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data);
      setIsUserModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  if (loading) return <PageLoader />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'schemes', label: 'Schemes', icon: Building2 },
    { id: 'applications', label: 'Applications', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, schemes, and monitor system performance</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.users.total_users}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-accent-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.schemes.total_schemes}</div>
                <div className="text-sm text-gray-600">Active Schemes</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.applications.total_applications}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.schemes.available_units}</div>
                <div className="text-sm text-gray-600">Available Units</div>
              </CardContent>
            </Card>
          </div>

          {/* User Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">{stats.users.citizens}</div>
                  <div className="text-sm text-gray-600">Citizens</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-600 mb-2">{stats.users.officers}</div>
                  <div className="text-sm text-gray-600">Officers</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{stats.users.admins}</div>
                  <div className="text-sm text-gray-600">Admins</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <UserDistributionChart data={stats.users} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationStatusChart data={{
                  pending: stats.applications.pending_verification,
                  under_review: 0,
                  approved: stats.applications.eligible,
                  rejected: stats.applications.rejected,
                  waitlisted: stats.applications.waitlisted
                }} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Housing Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <HousingAvailabilityChart data={stats.schemes} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyApplicationsChart data={stats.applications.monthly || []} />
              </CardContent>
            </Card>
          </div>

          {/* Application Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.applications.total_applications}</div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.applications.pending_verification}</div>
                  <div className="text-sm text-gray-600">Pending Verification</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stats.applications.eligible}</div>
                  <div className="text-sm text-gray-600">Eligible</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">{stats.applications.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{stats.applications.waitlisted}</div>
                  <div className="text-sm text-gray-600">Waitlisted</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{stats.applications.allotted}</div>
                  <div className="text-sm text-gray-600">Allotted</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications by Scheme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <FileText className="h-12 w-12 mr-2" />
                  <span>Chart data will be loaded from API</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <Building2 className="h-12 w-12 mr-2" />
                  <span>Chart data will be loaded from API</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <TrendingUp className="h-12 w-12 mr-2" />
                  <span>Chart data will be loaded from API</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allotment Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <Users className="h-12 w-12 mr-2" />
                  <span>Chart data will be loaded from API</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Waitlist Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <FileText className="h-12 w-12 mr-2" />
                <span>Chart data will be loaded from API</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button variant="primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <EmptyState icon="inbox" title="No users found" description="There are no users in the system" />
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'officer' ? 'bg-accent-100 text-accent-700' :
                        'bg-primary-100 text-primary-700'
                      }`}>
                        {user.role}
                      </span>
                      <button 
                        onClick={() => handleViewUser(user.id)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'schemes' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scheme Management</CardTitle>
              <Button variant="primary" onClick={() => navigate('/admin/schemes')}>
                <Building2 className="h-4 w-4 mr-2" />
                Manage Schemes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Housing Schemes</h3>
              <p className="text-gray-500 mb-4">Create, edit, and manage housing schemes</p>
              <Button variant="secondary" onClick={() => navigate('/admin/schemes')}>
                Go to Scheme Management
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'applications' && (
        <Card>
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon="file"
              title="Application Analytics"
              description="View detailed application statistics and trends"
              action={<Button variant="secondary">View Analytics</Button>}
            />
          </CardContent>
        </Card>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium">{selectedUser.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Role:</span>
                  <p className="font-medium capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created At:</span>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">0</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="bg-accent-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-accent-600">0</div>
                  <div className="text-sm text-gray-600">Documents</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Allotments</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setIsUserModalOpen(false)}>
                Close
              </Button>
              <Button variant="danger" onClick={() => {
                handleDeleteUser(selectedUser.id);
                setIsUserModalOpen(false);
              }}>
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
