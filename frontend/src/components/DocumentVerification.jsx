import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Eye, Download, Clock, Shield, AlertCircle } from 'lucide-react';
import Card from './Card';
import { CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import StatusChip from './StatusChip';
import api from '../services/api';
import toast from 'react-hot-toast';

const DocumentVerification = () => {
  const [selectedDocType, setSelectedDocType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, uploaded, error
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle, processing, completed, error
  const [extractedData, setExtractedData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [filePath, setFilePath] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);

  const documentTypes = [
    { id: 'aadhaar', name: 'Aadhaar Card', required: true, icon: '🪪' },
    { id: 'income', name: 'Income Certificate', required: true, icon: '📄' },
    { id: 'address', name: 'Address Proof', required: true, icon: '🏠' },
    { id: 'caste', name: 'Caste Certificate', required: false, icon: '📋' },
    { id: 'disability', name: 'Disability Certificate', required: false, icon: '♿' },
    { id: 'voter', name: 'Voter ID', required: false, icon: '🗳️' },
  ];

  // Fetch verification history on component mount
  React.useEffect(() => {
    fetchVerificationHistory();
  }, []);

  const fetchVerificationHistory = async () => {
    try {
      const response = await api.get('/verification/history');
      setVerificationHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch verification history:', error);
      // Don't show error toast on initial load - user might not be authenticated yet
      if (error.response?.status === 401) {
        console.log('User not authenticated');
      } else if (error.response?.status === 404) {
        console.log('Verification history endpoint not found');
      }
    }
  };

  const mockApplicationData = {
    name: 'Ravi Kumar',
    dateOfBirth: '12-05-1998',
    address: '123 Anna Nagar, Chennai',
    income: '250000',
    category: 'General'
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type - only images supported for now
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG and PNG image files are supported for OCR. PDF files are not currently supported.');
        setUploadStatus('error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        setUploadStatus('error');
        return;
      }

      setUploadedFile(file);
      setUploadStatus('uploading');

      // Upload to backend
      const formData = new FormData();
      formData.append('document', file);

      try {
        const response = await api.post('/verification/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFilePath(response.data.filePath);
        setUploadStatus('uploaded');
        toast.success('Document uploaded successfully');
      } catch (error) {
        toast.error('Upload failed: ' + (error.response?.data?.message || error.message));
        setUploadStatus('error');
      }
    }
  };

  const processOCR = async () => {
    if (!filePath || !selectedDocType) {
      toast.error('Please upload a document and select document type');
      return;
    }

    setOcrStatus('processing');

    try {
      const response = await api.post('/verification/ocr', {
        filePath,
        documentType: selectedDocType,
        mimeType: uploadedFile.type
      });

      setExtractedData(response.data.extractedFields);
      setOcrConfidence(response.data.confidence);
      setOcrStatus('completed');
      toast.success('OCR processing completed');
    } catch (error) {
      toast.error('OCR failed: ' + (error.response?.data?.message || error.message));
      setOcrStatus('error');
    }
  };

  const verifyDocument = async () => {
    if (!extractedData) {
      toast.error('No extracted data to verify');
      return;
    }

    try {
      const response = await api.post('/verification/verify', {
        extractedFields: extractedData,
        documentType: selectedDocType,
        filePath,
        confidence: ocrConfidence
      });

      setVerificationResult(response.data);
      toast.success('Verification completed');
      
      // Refresh verification history
      fetchVerificationHistory();
    } catch (error) {
      toast.error('Verification failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetVerification = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setOcrStatus('idle');
    setExtractedData(null);
    setVerificationResult(null);
    setSelectedDocType('');
    setFilePath(null);
    setOcrConfidence(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Document Verification</h1>
            <p className="text-blue-100">Upload and verify your eligibility documents using OCR technology</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <div>
                <div className="text-sm font-medium">Secure Verification</div>
                <div className="text-xs text-blue-100">OCR-based validation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Document Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {documentTypes.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocType(doc.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedDocType === doc.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{doc.icon}</div>
                <div className="font-medium text-gray-900">{doc.name}</div>
                {doc.required && (
                  <div className="text-xs text-red-500 mt-1">Required</div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      {selectedDocType && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <input
                type="file"
                id="document-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600 mb-2">
                  {uploadStatus === 'idle' && 'Click to upload or drag and drop'}
                  {uploadStatus === 'uploading' && 'Uploading...'}
                  {uploadStatus === 'uploaded' && 'File uploaded successfully'}
                  {uploadStatus === 'error' && 'Error uploading file'}
                </div>
                <div className="text-sm text-gray-400">
                  JPG, PNG (Max 5MB)
                </div>
              </label>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                </div>
              )}
            </div>

            {uploadStatus === 'uploaded' && ocrStatus === 'idle' && (
              <div className="mt-4">
                <Button onClick={processOCR} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Start OCR Processing
                </Button>
              </div>
            )}

            {ocrStatus === 'processing' && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Processing document with OCR...</span>
                </div>
              </div>
            )}

            {ocrStatus === 'completed' && !verificationResult && (
              <div className="mt-4">
                <Button onClick={verifyDocument} className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* OCR Results */}
      {ocrStatus === 'completed' && extractedData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extracted Information */}
          <Card>
            <CardHeader>
              <CardTitle>Extracted Information</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>OCR Completed</span>
                <span className="ml-2">Confidence: {ocrConfidence}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extractedData.name && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Name</div>
                    <div className="font-medium">{extractedData.name}</div>
                  </div>
                )}
                {extractedData.dateOfBirth && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Date of Birth</div>
                    <div className="font-medium">{extractedData.dateOfBirth}</div>
                  </div>
                )}
                {extractedData.aadhaarNumber && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Aadhaar Number</div>
                    <div className="font-medium">{extractedData.aadhaarNumber}</div>
                  </div>
                )}
                {extractedData.address && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="font-medium">{extractedData.address}</div>
                  </div>
                )}
                {extractedData.income && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Income</div>
                    <div className="font-medium">₹{extractedData.income}</div>
                  </div>
                )}
                {extractedData.certificateNumber && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Certificate Number</div>
                    <div className="font-medium">{extractedData.certificateNumber}</div>
                  </div>
                )}
                {extractedData.issueDate && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Issue Date</div>
                    <div className="font-medium">{extractedData.issueDate}</div>
                  </div>
                )}
                {extractedData.gender && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Gender</div>
                    <div className="font-medium">{extractedData.gender}</div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <strong>Note:</strong> OCR extracts text content from documents. 
                    This does not verify official authenticity or government issuance.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Results */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Results</CardTitle>
            </CardHeader>
            <CardContent>
              {verificationResult ? (
                <div className="space-y-4">
                  {/* Final Result Badge */}
                  <div className={`p-4 rounded-xl text-center ${
                    verificationResult.status === 'success' ? 'bg-green-50' :
                    verificationResult.status === 'error' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      verificationResult.status === 'success' ? 'text-green-600' :
                      verificationResult.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {verificationResult.result}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Verified on {new Date(verificationResult.verificationDate).toLocaleString()}
                    </div>
                  </div>

                  {/* Field Comparisons */}
                  {verificationResult.comparisons && verificationResult.comparisons.length > 0 && (
                    <div className="space-y-2">
                      {verificationResult.comparisons.map((comp, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            comp.matched ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{comp.field}</span>
                            {comp.matched ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-500">Extracted</div>
                              <div className={comp.matched ? 'text-green-700' : 'text-red-700'}>
                                {comp.extracted}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Application</div>
                              <div className="text-gray-700">{comp.application}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Official Auth Verification Status */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <strong>Official issuer verification:</strong> {verificationResult.officialAuthVerification || 'Not connected'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button onClick={resetVerification} variant="secondary" className="flex-1">
                      Upload Another
                    </Button>
                    {verificationResult.status === 'warning' && (
                      <Button variant="primary" className="flex-1">
                        Request Admin Review
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Click "Verify Document" to compare extracted data with your application</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle>Verification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verificationHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No verification history available
              </div>
            ) : (
              verificationHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{item.document_type}</div>
                      <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusChip
                      status={item.verification_result === 'VERIFIED' ? 'success' : 
                             item.verification_result === 'MISMATCH' || item.verification_result === 'DOCUMENT TYPE MISMATCH' ? 'error' : 'warning'}
                      label={item.verification_result}
                    />
                    <div className="text-sm text-gray-500">{item.reviewer || 'System'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentVerification;
