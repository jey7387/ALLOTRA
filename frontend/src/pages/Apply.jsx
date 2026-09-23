import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import Input from '../components/Input';
import { Textarea, Select } from '../components/Input';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { PageLoader } from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const Apply = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Details
    full_name: '',
    phone: '',
    occupation: '',
    current_address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Family Details
    family_members: '',
    
    // Income Details
    annual_income: '',
    
    // Documents
    documents: [],
    
    // Document types tracking
    documentTypes: {
      identity_proof: null, // Aadhaar/PAN
      address_proof: null,
      income_certificate: null,
      photo: null
    }
  });

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Family Details', icon: Users },
    { number: 3, title: 'Income Details', icon: DollarSign },
    { number: 4, title: 'Documents', icon: FileText },
    { number: 5, title: 'Review', icon: CheckCircle },
  ];

  useEffect(() => {
    fetchSchemeDetails();
  }, [schemeId]);

  const fetchSchemeDetails = async () => {
    try {
      const response = await api.get(`/schemes/${schemeId}`);
      setScheme(response.data);
    } catch (error) {
      toast.error('Failed to fetch scheme details');
      navigate('/schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const documentType = e.target.getAttribute('data-document-type');
    
    if (documentType) {
      // Upload specific document type
      setFormData({
        ...formData,
        documents: [...formData.documents, ...files],
        documentTypes: {
          ...formData.documentTypes,
          [documentType]: files[0]
        }
      });
    } else {
      // Upload general documents
      setFormData({
        ...formData,
        documents: [...formData.documents, ...files],
      });
    }
  };

  const handleRemoveDocument = (docType) => {
    if (docType) {
      // Remove specific document type
      setFormData({
        ...formData,
        documents: formData.documents.filter(file => file !== formData.documentTypes[docType]),
        documentTypes: {
          ...formData.documentTypes,
          [docType]: null
        }
      });
    } else {
      // Remove from general documents list
      setFormData({
        ...formData,
        documents: formData.documents.filter((_, i) => i !== index),
      });
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Create application
      await createApplication();
    } else if (currentStep === 4) {
      // Validate mandatory documents before proceeding
      const mandatoryDocs = ['identity_proof', 'address_proof', 'income_certificate', 'photo'];
      const missingDocs = mandatoryDocs.filter(docType => !formData.documentTypes[docType]);
      
      if (missingDocs.length > 0) {
        toast.error('Please upload all mandatory documents before proceeding');
        return;
      }
      setCurrentStep(prev => prev + 1);
    } else if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const createApplication = async () => {
    try {
      setSubmitting(true);
      const response = await api.post('/applications', {
        scheme_id: schemeId,
        details: {
          family_members: parseInt(formData.family_members),
          annual_income: parseFloat(formData.annual_income),
          occupation: formData.occupation,
          current_address: formData.current_address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      });
      setApplicationId(response.data.id);
      setCurrentStep(prev => prev + 1);
      toast.success('Application created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      if (!applicationId) {
        toast.error('Application ID not found. Please start over.');
        navigate('/schemes');
        return;
      }
      
      // Upload documents with proper types
      const documentTypeMap = {
        identity_proof: 'Identity Proof',
        address_proof: 'Address Proof',
        income_certificate: 'Income Certificate',
        photo: 'Passport Photo'
      };
      
      for (const [docType, file] of Object.entries(formData.documentTypes)) {
        if (file) {
          const formDataObj = new FormData();
          formDataObj.append('document', file);
          formDataObj.append('application_id', applicationId);
          formDataObj.append('document_type', documentTypeMap[docType] || docType);
          
          await api.post('/documents/upload', formDataObj, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }
      
      // Upload additional documents
      const mandatoryDocs = ['identity_proof', 'address_proof', 'income_certificate', 'photo'];
      const additionalDocs = formData.documents.filter((_, index) => index >= mandatoryDocs.length);
      
      for (const file of additionalDocs) {
        const formDataObj = new FormData();
        formDataObj.append('document', file);
        formDataObj.append('application_id', applicationId);
        formDataObj.append('document_type', 'Additional Document');
        
        await api.post('/documents/upload', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Application submitted successfully!');
      navigate('/applications');
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Scheme</h1>
        <p className="text-gray-600">{scheme?.name}</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            <ProgressBar value={currentStep} max={steps.length} color="primary" />
          </div>

          <div className="flex justify-between">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? 'bg-primary-100'
                        : isCompleted
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${currentStep === steps.length ? 'bg-green-100' : 'bg-primary-100'}`}>
              <CurrentIcon className={`h-6 w-6 ${currentStep === steps.length ? 'text-green-600' : 'text-primary-600'}`} />
            </div>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
              <Input
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Your occupation"
                required
              />
              <Textarea
                label="Current Address"
                name="current_address"
                value={formData.current_address}
                onChange={handleChange}
                placeholder="Enter your current address"
                rows={3}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
                <Input
                  label="PIN Code"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="123456"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Input
                label="Number of Family Members"
                name="family_members"
                type="number"
                value={formData.family_members}
                onChange={handleChange}
                placeholder="Enter number of family members"
                required
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Include all dependent family members who will be residing with you.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Input
                label="Annual Income (₹)"
                name="annual_income"
                type="number"
                value={formData.annual_income}
                onChange={handleChange}
                placeholder="Enter your annual income"
                required
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Please provide accurate income information. This will be verified during the application process.
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Mandatory Documents:</strong> All documents marked with * are required and must be uploaded before proceeding.
                </p>
              </div>

              {/* Identity Proof */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Identity Proof (Aadhaar/PAN) *
                  </h4>
                  {formData.documentTypes.identity_proof && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <button
                        onClick={() => handleRemoveDocument('identity_proof')}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    data-document-type="identity_proof"
                    className="hidden"
                    id="identity-upload"
                  />
                  <label
                    htmlFor="identity-upload"
                    className="cursor-pointer"
                  >
                    {formData.documentTypes.identity_proof ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{formData.documentTypes.identity_proof.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Aadhaar or PAN</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Address Proof */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Address Proof *
                  </h4>
                  {formData.documentTypes.address_proof && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <button
                        onClick={() => handleRemoveDocument('address_proof')}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    data-document-type="address_proof"
                    className="hidden"
                    id="address-upload"
                  />
                  <label
                    htmlFor="address-upload"
                    className="cursor-pointer"
                  >
                    {formData.documentTypes.address_proof ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{formData.documentTypes.address_proof.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Address Proof</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Income Certificate */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Income Certificate *
                  </h4>
                  {formData.documentTypes.income_certificate && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <button
                        onClick={() => handleRemoveDocument('income_certificate')}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    data-document-type="income_certificate"
                    className="hidden"
                    id="income-upload"
                  />
                  <label
                    htmlFor="income-upload"
                    className="cursor-pointer"
                  >
                    {formData.documentTypes.income_certificate ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{formData.documentTypes.income_certificate.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Income Certificate</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Passport Photo */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Passport Size Photo *
                  </h4>
                  {formData.documentTypes.photo && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <button
                        onClick={() => handleRemoveDocument('photo')}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    data-document-type="photo"
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer"
                  >
                    {formData.documentTypes.photo ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{formData.documentTypes.photo.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Passport Photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Additional Documents */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Additional Documents (Optional)</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="additional-upload"
                  />
                  <label
                    htmlFor="additional-upload"
                    className="cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload Additional Documents</p>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Full Name:</span>
                    <p className="font-medium">{formData.full_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Occupation:</span>
                    <p className="font-medium">{formData.occupation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <p className="font-medium">{formData.current_address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Family & Income</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Family Members:</span>
                    <p className="font-medium">{formData.family_members}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Annual Income:</span>
                    <p className="font-medium">₹{Number(formData.annual_income).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Identity Proof:</span>
                    <span className={formData.documentTypes.identity_proof ? 'text-green-600 font-medium' : 'text-red-600'}>
                      {formData.documentTypes.identity_proof ? 'Uploaded' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Address Proof:</span>
                    <span className={formData.documentTypes.address_proof ? 'text-green-600 font-medium' : 'text-red-600'}>
                      {formData.documentTypes.address_proof ? 'Uploaded' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Income Certificate:</span>
                    <span className={formData.documentTypes.income_certificate ? 'text-green-600 font-medium' : 'text-red-600'}>
                      {formData.documentTypes.income_certificate ? 'Uploaded' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Passport Photo:</span>
                    <span className={formData.documentTypes.photo ? 'text-green-600 font-medium' : 'text-red-600'}>
                      {formData.documentTypes.photo ? 'Uploaded' : 'Missing'}
                    </span>
                  </div>
                  {formData.documents.length > 4 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Additional Documents:</span>
                      <span className="text-gray-700 font-medium">{formData.documents.length - 4} files</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Ready to Submit:</strong> Please review all information carefully before submitting your application.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation Buttons */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Apply;
