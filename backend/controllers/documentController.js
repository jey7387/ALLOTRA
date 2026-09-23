const Document = require('../models/Document');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

exports.uploadDocument = async (req, res) => {
  try {
    const { application_id, document_type } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;

    if (!file_path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const application = await Application.findById(application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const document = await Document.create({
      application_id,
      document_type,
      file_path
    });

    await Notification.create({
      user_id: application.user_id,
      title: 'Document Uploaded',
      message: `Your ${document_type} has been uploaded successfully.`,
      type: 'success'
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
};

exports.getApplicationDocuments = async (req, res) => {
  try {
    const { application_id } = req.params;
    const documents = await Document.findByApplicationId(application_id);

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const verified_by = req.user.userId;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updatedDocument = await Document.update(id, {
      status,
      remarks,
      verified_by,
      verified_at: new Date()
    });

    const application = await Application.findById(document.application_id);
    await Notification.create({
      user_id: application.user_id,
      title: 'Document Verified',
      message: `Your document has been ${status}. ${remarks || ''}`,
      type: status === 'approved' ? 'success' : 'warning'
    });

    res.json({
      message: 'Document verified successfully',
      document: updatedDocument
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ message: 'Error verifying document' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.delete(id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
};
