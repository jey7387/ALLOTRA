import React, { useState } from 'react';
import { X, Download, Eye, FileText, Image as ImageIcon, File } from 'lucide-react';

const DocumentPreview = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    if (fileType?.includes('pdf')) {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const isImage = document.file_type?.includes('image');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = document.file_path;
    link.download = document.document_type || 'document';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              {getFileIcon(document.file_type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{document.document_type}</h3>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isImage ? (
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              <img
                src={document.file_path}
                alt={document.document_type}
                className="w-full h-auto rounded-xl"
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Document Preview</h4>
              <p className="text-gray-600 text-center mb-4">
                This file type cannot be previewed. Please download to view.
              </p>
              <button
                onClick={handleDownload}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                document.status === 'approved' ? 'bg-green-100 text-green-800' :
                document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </span>
              {document.verified_by && (
                <span className="text-gray-500">
                  Verified by Officer
                </span>
              )}
            </div>
            {document.remarks && (
              <p className="text-gray-600 italic">"{document.remarks}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
