import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp,
  Eye,
  Check,
  X
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import StatusChip from '../components/StatusChip';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import { ApplicationStatusChart, MonthlyApplicationsChart, ApprovalRateChart } from '../components/Charts';
import api from '../services/api';
import toast from 'react-hot-toast';

const OfficerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    monthly: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/applications?status=${filter}`);
      setApplications(response.data);

      const statsResponse = await api.get('/applications/stats');
      const monthlyResponse = await api.get('/applications/monthly');
      
      console.log('Stats response:', statsResponse.data);
      console.log('Monthly response:', monthlyResponse.data);
      
      // Ensure stats data has all required fields
      const safeStats = {
        pending: statsResponse.data?.pending || 0,
        under_review: statsResponse.data?.under_review || 0,
        approved: statsResponse.data?.approved || 0,
        rejected: statsResponse.data?.rejected || 0,
        waitlisted: statsResponse.data?.waitlisted || 0,
        total_applications: statsResponse.data?.total_applications || 0,
        monthly: Array.isArray(monthlyResponse.data) ? monthlyResponse.data : []
      };
      
      console.log('Safe stats:', safeStats);
      
      setStats(safeStats);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to fetch dashboard data');
      // Set default values on error
      setStats({
        pending: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        waitlisted: 0,
        total_applications: 0,
        monthly: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (application) => {
    try {
      const response = await api.get(`/applications/${application.id}`);
      setSelectedApplication(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch application details');
    }
  };

  const handleVerifyDocument = async (documentId, status, remarks) => {
    try {
      await api.put(`/documents/${documentId}/verify`, { status, remarks });
      toast.success('Document verified successfully');
      if (selectedApplication) {
        const response = await api.get(`/applications/${selectedApplication.id}`);
        setSelectedApplication(response.data);
      }
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to verify document');
    }
  };

  const handleUpdateApplication = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}`, { status });
      toast.success(`Application ${status} successfully`);
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleGenerateWaitlist = async (schemeId) => {
    try {
      await api.post(`/waitlist/generate/${schemeId}`);
      toast.success('Waitlist generated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to generate waitlist');
    }
  };

  if (loading) return <PageLoader />;

  const statCards = [
    {
      title: 'Pending Applications',
      value: stats.pending,
      icon: Clock,
      color: 'primary',
    },
    {
      title: 'Under Review',
      value: stats.under_review,
      icon: FileText,
      color: 'warning',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'success',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'danger',
    },
  ];

  const filterOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'waitlisted', label: 'Waitlisted' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Officer Dashboard</h1>
        <p className="text-gray-600">Manage applications and verify documents</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            primary: 'bg-primary-100 text-primary-600',
            warning: 'bg-yellow-100 text-yellow-600',
            success: 'bg-green-100 text-green-600',
            danger: 'bg-red-100 text-red-600',
          };

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
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
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent>
            <ShieldCheck className="h-8 w-8 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Pending Reviews</h3>
            <p className="text-primary-100 mb-4">{stats.pending} applications awaiting review</p>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setFilter('pending');
              }}
              className="w-full"
            >
              Review Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white border-0 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent>
            <Users className="h-8 w-8 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Generate Waitlist</h3>
            <p className="text-accent-100 mb-4">Create waitlists for approved schemes</p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                if (applications.length > 0 && applications[0].scheme_id) {
                  handleGenerateWaitlist(applications[0].scheme_id);
                } else {
                  toast.error('No scheme available to generate waitlist');
                }
              }}
            >
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent>
            <TrendingUp className="h-8 w-8 mb-4 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
            <p className="text-purple-100 mb-4">Track application trends and metrics</p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Analytics dashboard coming soon!');
              }}
            >
              Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationStatusChart data={stats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalRateChart data={stats} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyApplicationsChart data={stats.monthly || []} />
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <EmptyState
              icon="file"
              title={`No ${filter} applications`}
              description="There are no applications in this category"
            />
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{application.full_name}</h4>
                      <p className="text-sm text-gray-500">{application.scheme_name}</p>
                      <p className="text-xs text-gray-400 mt-1">Applied: {new Date(application.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusChip status={application.status} />
                    <button
                      onClick={() => handleViewDetails(application)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Application Details"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Applicant Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Applicant Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium">{selectedApplication.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{selectedApplication.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium">{selectedApplication.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Scheme:</span>
                  <p className="font-medium">{selectedApplication.scheme_name}</p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            {selectedApplication.details && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Family Members:</span>
                    <p className="font-medium">{selectedApplication.details.family_members}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Annual Income:</span>
                    <p className="font-medium">₹{Number(selectedApplication.details.annual_income).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Occupation:</span>
                    <p className="font-medium">{selectedApplication.details.occupation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <p className="font-medium">{selectedApplication.details.current_address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
              {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                <div className="space-y-3">
                  {selectedApplication.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{doc.document_type}</p>
                        <StatusChip status={doc.status} />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerifyDocument(doc.id, 'approved', 'Document verified')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(doc.id, 'rejected', 'Document rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="danger" onClick={() => handleUpdateApplication(selectedApplication.id, 'rejected')}>
                Reject Application
              </Button>
              <Button variant="success" onClick={() => handleUpdateApplication(selectedApplication.id, 'approved')}>
                Approve Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OfficerDashboard;
