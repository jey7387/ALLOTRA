import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  MapPin, 
  Calendar, 
  DollarSign,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import StatusChip from '../components/StatusChip';
import Button from '../components/Button';
import { PageLoader } from '../components/LoadingSpinner';
import DocumentPreview from '../components/DocumentPreview';
import ApplicationTimeline from '../components/ApplicationTimeline';
import ExportToPDF from '../components/ExportToPDF';
import api from '../services/api';
import toast from 'react-hot-toast';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await api.get(`/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      toast.error('Failed to fetch application details');
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAllotmentLetter = () => {
    toast.success('Allotment letter downloaded');
  };

  if (loading) return <PageLoader />;

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Application not found</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      under_review: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      waitlisted: Clock,
      allotted: CheckCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/applications')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Details</h1>
            <p className="text-gray-600">Application #{application.id}</p>
          </div>
        </div>
        <ExportToPDF data={application} filename={`application-${application.id}`} />
      </div>

      {/* Status Banner */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                {getStatusIcon(application.status)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{application.scheme_name}</h3>
                <p className="text-primary-100">{application.location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary-100">Status</div>
              <div className="text-lg font-semibold capitalize">{application.status.replace('_', ' ')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500">Full Name</span>
                  <p className="font-medium text-gray-900">{application.full_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500">Email</span>
                  <p className="font-medium text-gray-900">{application.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500">Phone</span>
                  <p className="font-medium text-gray-900">{application.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheme Information */}
        <Card>
          <CardHeader>
            <CardTitle>Scheme Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500">Location</span>
                  <p className="font-medium text-gray-900">{application.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500">Price</span>
                  <p className="font-medium text-gray-900">₹{Number(application.price).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-xs text-gray-500">Submitted On</span>
                  <p className="font-medium text-gray-900">
                    {new Date(application.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Details */}
      {application.details && (
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-gray-500">Family Members</span>
                <p className="font-medium text-gray-900">{application.details.family_members}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Annual Income</span>
                <p className="font-medium text-gray-900">
                  ₹{Number(application.details.annual_income).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Occupation</span>
                <p className="font-medium text-gray-900">{application.details.occupation}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Address</span>
                <p className="font-medium text-gray-900">{application.details.current_address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {application.documents && application.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.document_type}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusChip status={doc.status} />
                    <button 
                      onClick={() => setSelectedDocument(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waitlist Information */}
      {application.waitlist && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Waitlist Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs text-purple-600">Current Rank</span>
                <p className="text-2xl font-bold text-purple-900">#{application.waitlist.rank}</p>
              </div>
              <div>
                <span className="text-xs text-purple-600">Queue Size</span>
                <p className="text-2xl font-bold text-purple-900">{application.waitlist.rank + 20}</p>
              </div>
              {application.waitlist.estimated_allotment_date && (
                <div>
                  <span className="text-xs text-purple-600">Est. Allotment</span>
                  <p className="text-lg font-semibold text-purple-900">
                    {new Date(application.waitlist.estimated_allotment_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allotment Information */}
      {application.allotment && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Allotment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs text-green-600">Unit Number</span>
                <p className="text-2xl font-bold text-green-900">{application.allotment.unit_number}</p>
              </div>
              <div>
                <span className="text-xs text-green-600">Allotment Date</span>
                <p className="text-lg font-semibold text-green-900">
                  {new Date(application.allotment.allotment_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  variant="primary"
                  onClick={handleDownloadAllotmentLetter}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Allotment Letter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <ApplicationTimeline application={application} />

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreview 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
    </div>
  );
};

export default ApplicationDetails;
