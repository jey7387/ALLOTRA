import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import Button from './Button';

const ExportToPDF = ({ data, filename = 'document' }) => {
  const handleExportPDF = () => {
    // Create a simple text-based PDF export
    const printWindow = window.open('', '_blank');
    const content = generatePrintContent(data);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1e40af;
              margin: 0;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              color: #1e3a8a;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .row {
              display: flex;
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              width: 200px;
              color: #4b5563;
            }
            .value {
              flex: 1;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-approved { background: #d1fae5; color: #065f46; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .status-allotted { background: #dbeafe; color: #1e40af; }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Housing Board Allotment Portal</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const generatePrintContent = (data) => {
    if (!data) return '<p>No data available</p>';

    let content = `
      <div class="header">
        <h1>Housing Board Allotment Portal</h1>
        <p>Application Details</p>
      </div>
    `;

    // Application Info
    if (data.id) {
      content += `
        <div class="section">
          <h2>Application Information</h2>
          <div class="row">
            <span class="label">Application ID:</span>
            <span class="value">#${data.id}</span>
          </div>
          <div class="row">
            <span class="label">Scheme:</span>
            <span class="value">${data.scheme_name || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Status:</span>
            <span class="value">
              <span class="status status-${data.status}">${data.status?.replace('_', ' ').toUpperCase()}</span>
            </span>
          </div>
          <div class="row">
            <span class="label">Submitted On:</span>
            <span class="value">${new Date(data.submitted_at).toLocaleString()}</span>
          </div>
        </div>
      `;
    }

    // Applicant Info
    if (data.full_name || data.email || data.phone) {
      content += `
        <div class="section">
          <h2>Applicant Information</h2>
          <div class="row">
            <span class="label">Full Name:</span>
            <span class="value">${data.full_name || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Email:</span>
            <span class="value">${data.email || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Phone:</span>
            <span class="value">${data.phone || 'N/A'}</span>
          </div>
        </div>
      `;
    }

    // Scheme Info
    if (data.location || data.price) {
      content += `
        <div class="section">
          <h2>Scheme Information</h2>
          <div class="row">
            <span class="label">Location:</span>
            <span class="value">${data.location || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Price:</span>
            <span class="value">₹${Number(data.price || 0).toLocaleString()}</span>
          </div>
        </div>
      `;
    }

    // Application Details
    if (data.details) {
      content += `
        <div class="section">
          <h2>Application Details</h2>
          <div class="row">
            <span class="label">Family Members:</span>
            <span class="value">${data.details.family_members || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Annual Income:</span>
            <span class="value">₹${Number(data.details.annual_income || 0).toLocaleString()}</span>
          </div>
          <div class="row">
            <span class="label">Occupation:</span>
            <span class="value">${data.details.occupation || 'N:A'}</span>
          </div>
          <div class="row">
            <span class="label">Address:</span>
            <span class="value">${data.details.current_address || 'N/A'}</span>
          </div>
        </div>
      `;
    }

    // Waitlist Info
    if (data.waitlist) {
      content += `
        <div class="section">
          <h2>Waitlist Information</h2>
          <div class="row">
            <span class="label">Current Rank:</span>
            <span class="value">#${data.waitlist.rank}</span>
          </div>
          ${data.waitlist.estimated_allotment_date ? `
            <div class="row">
              <span class="label">Est. Allotment:</span>
              <span class="value">${new Date(data.waitlist.estimated_allotment_date).toLocaleDateString()}</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Allotment Info
    if (data.allotment) {
      content += `
        <div class="section">
          <h2>Allotment Details</h2>
          <div class="row">
            <span class="label">Unit Number:</span>
            <span class="value">${data.allotment.unit_number}</span>
          </div>
          <div class="row">
            <span class="label">Allotment Date:</span>
            <span class="value">${new Date(data.allotment.allotment_date).toLocaleString()}</span>
          </div>
        </div>
      `;
    }

    return content;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="secondary"
        onClick={handleExportPDF}
        className="flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        <span>Export PDF</span>
      </Button>
    </div>
  );
};

export default ExportToPDF;
