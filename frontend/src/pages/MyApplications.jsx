import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import StatusChip from '../components/StatusChip';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my');
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      under_review: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      waitlisted: AlertCircle,
      allotted: CheckCircle,
    };
    return icons[status] || Clock;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track and manage your housing applications</p>
      </div>

      {/* Applications List */}
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
          {applications.map((application) => {
            const StatusIcon = getStatusIcon(application.status);
            
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          application.status === 'approved' || application.status === 'allotted'
                            ? 'bg-green-100'
                            : application.status === 'rejected'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                        }`}>
                          <StatusIcon className={`h-5 w-5 ${
                            application.status === 'approved' || application.status === 'allotted'
                              ? 'text-green-600'
                              : application.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.scheme_name}
                          </h3>
                          <p className="text-sm text-gray-500">{application.location}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-gray-500">Application ID</span>
                          <p className="font-medium text-gray-900">#{application.id}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Submitted On</span>
                          <p className="font-medium text-gray-900 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(application.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Price</span>
                          <p className="font-medium text-gray-900">
                            ₹{Number(application.price).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Status</span>
                          <div className="mt-1">
                            <StatusChip status={application.status} />
                          </div>
                        </div>
                      </div>

                      {application.waitlist && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-purple-600 font-medium">Waitlist Position</span>
                              <p className="text-2xl font-bold text-purple-700">
                                #{application.waitlist.rank}
                              </p>
                            </div>
                            {application.waitlist.estimated_allotment_date && (
                              <div className="text-right">
                                <span className="text-xs text-purple-600 font-medium">Est. Allotment</span>
                                <p className="text-sm text-purple-700">
                                  {new Date(application.waitlist.estimated_allotment_date).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {application.allotment && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-green-600 font-medium">Unit Number</span>
                              <p className="text-lg font-bold text-green-700">
                                {application.allotment.unit_number}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-green-600 font-medium">Allotment Date</span>
                              <p className="text-sm text-green-700">
                                {new Date(application.allotment.allotment_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Link to={`/applications/${application.id}`}>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                          <Eye className="h-5 w-5" />
                        </button>
                      </Link>
                      {(application.status === 'allotted' || application.status === 'approved') && (
                        <button
                          onClick={() => toast.success('Allotment letter downloaded')}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Download Allotment Letter"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
