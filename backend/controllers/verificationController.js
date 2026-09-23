const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

// Extract fields from OCR text based on document type
const extractFields = (text, documentType) => {
  const extracted = {};
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  switch (documentType) {
    case 'aadhaar':
      // Extract Aadhaar number (12 digits, possibly with spaces)
      const aadhaarMatch = text.match(/\d{4}\s*\d{4}\s*\d{4}/);
      if (aadhaarMatch) {
        extracted.aadhaarNumber = aadhaarMatch[0].replace(/\s/g, '');
      }

      // Extract name (usually appears after "Name" or before DOB)
      const nameMatch = text.match(/(?:Name|NAME)[:\s]+([A-Za-z\s]+)/i);
      if (nameMatch) {
        extracted.name = nameMatch[1].trim();
      }

      // Extract DOB (DD-MM-YYYY or DD/MM/YYYY format)
      const dobMatch = text.match(/\d{2}[-\/]\d{2}[-\/]\d{4}/);
      if (dobMatch) {
        extracted.dateOfBirth = dobMatch[0];
      }

      // Extract gender
      const genderMatch = text.match(/(?:Male|Female|Other)/i);
      if (genderMatch) {
        extracted.gender = genderMatch[0];
      }

      // Detect document type
      if (text.toLowerCase().includes('aadhaar') || text.toLowerCase().includes('uidai')) {
        extracted.detectedType = 'aadhaar';
      }

      break;

    case 'income':
      // Extract certificate number (more flexible pattern)
      const certMatch = text.match(/(?:Certificate|Cert|No\.|Number)[:\s]*([A-Za-z0-9\/\-]+)/i);
      if (certMatch) {
        extracted.certificateNumber = certMatch[1];
      }

      // Extract income - look for currency symbols and numbers (more flexible)
      const incomePatterns = [
        /(?:Income|Annual Income|Total Income)[:\s]*[₹$Rs.]?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
        /₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:per annum|p\.a\.|annual)/i,
        /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rupees|Rs\.)/i
      ];
      for (const pattern of incomePatterns) {
        const incomeMatch = text.match(pattern);
        if (incomeMatch) {
          extracted.income = incomeMatch[1].replace(/,/g, '');
          break;
        }
      }

      // Extract name (more flexible)
      const namePatterns = [
        /(?:Name|NAME)[:\s]+([A-Za-z\s]+)/i,
        /(?:Certified that|This is to certify that)\s+([A-Za-z\s]+)/i
      ];
      for (const pattern of namePatterns) {
        const nameMatch = text.match(pattern);
        if (nameMatch) {
          extracted.name = nameMatch[1].trim();
          break;
        }
      }

      // Extract issue date (more flexible)
      const datePatterns = [
        /(?:Issue|Issued|Date)[:\s]*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,
        /(\d{2}[-\/]\d{2}[-\/]\d{4})/
      ];
      for (const pattern of datePatterns) {
        const dateMatch = text.match(pattern);
        if (dateMatch) {
          extracted.issueDate = dateMatch[1];
          break;
        }
      }

      // Detect document type
      if (text.toLowerCase().includes('income') || text.toLowerCase().includes('certificate')) {
        extracted.detectedType = 'income';
      }

      break;

    case 'address':
      // Extract name (more flexible)
      const addressNamePatterns = [
        /(?:Name|NAME)[:\s]+([A-Za-z\s]+)/i,
        /(?:To|Smt\.|Shri\.|Mr\.|Ms\.)[:\s]*([A-Za-z\s]+)/i
      ];
      for (const pattern of addressNamePatterns) {
        const nameMatch = text.match(pattern);
        if (nameMatch) {
          extracted.name = nameMatch[1].trim();
          break;
        }
      }

      // Extract address (more flexible - look for common address patterns)
      const addressPatterns = [
        /(?:Address|Addr|Residence|Res)[:\s]*([^\n]+)/i,
        /(?:No\.|Door|Flat|House)[:\s]*([^\n]+)/i,
        /(?:Street|St\.|Road|Rd\.|Lane|Ln\.)[:\s]*([^\n]+)/i,
        /(?:City|Town|Village)[:\s]*([^\n]+)/i,
        /(?:District|Dist)[:\s]*([^\n]+)/i,
        /(?:State)[:\s]*([^\n]+)/i,
        /(?:Pin|Pincode|Postal Code)[:\s]*(\d{6})/i
      ];
      
      const addressParts = [];
      for (const pattern of addressPatterns) {
        const match = text.match(pattern);
        if (match) {
          addressParts.push(match[1].trim());
        }
      }
      
      // Also try to extract multi-line address by looking for address keywords
      const addressLines = [];
      let inAddress = false;
      for (const line of lines) {
        if (line.toLowerCase().includes('address') || line.toLowerCase().includes('residence')) {
          inAddress = true;
          continue;
        }
        if (inAddress && (line.toLowerCase().includes('date') || line.toLowerCase().includes('sign') || line.toLowerCase().includes('signature'))) {
          break;
        }
        if (inAddress && line.length > 5) { // Only include substantial lines
          addressLines.push(line);
        }
      }
      
      if (addressLines.length > 0) {
        extracted.address = addressLines.join(', ');
      } else if (addressParts.length > 0) {
        extracted.address = addressParts.join(', ');
      }

      // Detect document type
      if (text.toLowerCase().includes('address') || text.toLowerCase().includes('proof') || 
          text.toLowerCase().includes('residence') || text.toLowerCase().includes('utility')) {
        extracted.detectedType = 'address';
      }

      break;

    default:
      // Generic extraction
      extracted.detectedType = 'unknown';
  }

  return extracted;
};

// Process OCR on image
const processImageOCR = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });
    
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR processing failed');
  }
};

// Convert PDF to images and process OCR
const processPdfOCR = async (pdfPath) => {
  try {
    // PDF processing requires additional system dependencies (poppler-utils)
    // For now, we'll return an error directing users to use image files
    throw new Error('PDF processing requires poppler-utils system installation. Please upload image files (JPG/PNG) for OCR processing.');
  } catch (error) {
    console.error('PDF OCR Error:', error);
    throw new Error('PDF OCR processing failed: ' + error.message);
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded:', {
      originalname: req.file.originalname,
      path: req.file.path,
      filename: req.file.filename,
      mimetype: req.file.mimetype
    });

    res.json({
      message: 'Document uploaded successfully',
      filePath: req.file.path,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Process OCR
exports.processOCR = async (req, res) => {
  try {
    const { filePath, documentType } = req.body;

    if (!filePath) {
      return res.status(400).json({ message: 'File path required' });
    }

    console.log('OCR Request:', { filePath, documentType, mimeType: req.body.mimeType });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: 'File not found at path: ' + filePath });
    }

    let ocrResult;
    
    if (req.body.mimeType === 'application/pdf') {
      ocrResult = await processPdfOCR(filePath);
    } else {
      ocrResult = await processImageOCR(filePath);
    }

    console.log('OCR Result:', { confidence: ocrResult.confidence, textLength: ocrResult.text.length });

    // Extract fields based on document type
    const extractedFields = extractFields(ocrResult.text, documentType);

    res.json({
      message: 'OCR processed successfully',
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      extractedFields,
      detectedType: extractedFields.detectedType || 'unknown'
    });
  } catch (error) {
    console.error('OCR Processing Error:', error);
    res.status(500).json({ 
      message: 'OCR failed: Unable to extract readable information. Please upload a clearer document.',
      error: error.message 
    });
  }
};

// Verify document
exports.verifyDocument = async (req, res) => {
  try {
    const { extractedFields, documentType, applicationId } = req.body;
    const userId = req.user.userId; // JWT contains userId, not id

    console.log('Verification request:', { userId, documentType, extractedFields, user: req.user });

    // Get user's application data
    const applicationQuery = `
      SELECT a.*, u.full_name, ad.current_address, ad.annual_income
      FROM applications a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN application_details ad ON a.id = ad.application_id
      WHERE a.user_id = $1
      LIMIT 1
    `;
    const applicationResult = await pool.query(applicationQuery, [userId]);
    
    if (applicationResult.rows.length === 0) {
      // If no application exists, use user data for basic comparison
      const userQuery = 'SELECT * FROM users WHERE id = $1';
      const userResult = await pool.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        console.error('User not found in database:', userId);
        return res.status(404).json({ message: 'User not found. Please log out and log in again.' });
      }
      
      const userData = userResult.rows[0];
      
      // Basic comparison with user data
      const comparisons = [];
      let allMatched = true;
      
      if (extractedFields.name) {
        const nameMatch = extractedFields.name.toLowerCase().includes(userData.full_name.toLowerCase()) ||
                          userData.full_name.toLowerCase().includes(extractedFields.name.toLowerCase());
        comparisons.push({
          field: 'Name',
          extracted: extractedFields.name,
          application: userData.full_name,
          matched: nameMatch
        });
        if (!nameMatch) allMatched = false;
      }
      
      // Determine verification result
      let result = allMatched ? 'VERIFIED' : 'MISMATCH';
      let status = allMatched ? 'success' : 'error';
      
      if (req.body.confidence < 70) {
        result = 'REQUIRES ADMIN REVIEW';
        status = 'warning';
      }

      // Store verification result
      const insertQuery = `
        INSERT INTO document_verifications 
        (user_id, document_type, file_path, ocr_confidence, extracted_data, verification_result, comparisons)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;
      await pool.query(insertQuery, [
        userId,
        documentType,
        req.body.filePath,
        req.body.confidence,
        JSON.stringify(extractedFields),
        result,
        JSON.stringify(comparisons)
      ]);

      return res.json({
        result,
        status,
        comparisons,
        confidence: req.body.confidence,
        verificationDate: new Date().toISOString(),
        officialAuthVerification: 'Not connected'
      });
    }

    const applicationData = applicationResult.rows[0];

    // Perform field comparisons
    const comparisons = [];
    let allMatched = true;

    // Name comparison
    if (extractedFields.name) {
      const nameMatch = extractedFields.name.toLowerCase().includes(applicationData.full_name.toLowerCase()) ||
                        applicationData.full_name.toLowerCase().includes(extractedFields.name.toLowerCase());
      comparisons.push({
        field: 'Name',
        extracted: extractedFields.name,
        application: applicationData.full_name,
        matched: nameMatch
      });
      if (!nameMatch) allMatched = false;
    }

    // Address comparison
    if (extractedFields.address && applicationData.current_address) {
      const addressMatch = extractedFields.address.toLowerCase().includes(applicationData.current_address.toLowerCase()) ||
                          applicationData.current_address.toLowerCase().includes(extractedFields.address.toLowerCase());
      comparisons.push({
        field: 'Address',
        extracted: extractedFields.address,
        application: applicationData.current_address,
        matched: addressMatch
      });
      if (!addressMatch) allMatched = false;
    }

    // Income comparison
    if (extractedFields.income && applicationData.annual_income) {
      const extractedIncome = parseFloat(extractedFields.income.replace(/,/g, ''));
      const applicationIncome = parseFloat(applicationData.annual_income);
      const incomeMatch = Math.abs(extractedIncome - applicationIncome) < (applicationIncome * 0.1); // Allow 10% variance
      comparisons.push({
        field: 'Income',
        extracted: extractedFields.income,
        application: applicationData.annual_income.toString(),
        matched: incomeMatch
      });
      if (!incomeMatch) allMatched = false;
    }

    // Document type validation
    const typeMatch = extractedFields.detectedType === documentType;
    if (!typeMatch) {
      allMatched = false;
    }

    // Determine verification result
    let result = 'VERIFIED';
    let status = 'success';
    
    if (!typeMatch) {
      result = 'DOCUMENT TYPE MISMATCH';
      status = 'error';
    } else if (!allMatched) {
      result = 'MISMATCH';
      status = 'error';
    } else if (req.body.confidence < 70) {
      result = 'REQUIRES ADMIN REVIEW';
      status = 'warning';
    }

    // Store verification result
    const insertQuery = `
      INSERT INTO document_verifications 
      (user_id, document_type, file_path, ocr_confidence, extracted_data, verification_result, comparisons)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    await pool.query(insertQuery, [
      userId,
      documentType,
      req.body.filePath,
      req.body.confidence,
      JSON.stringify(extractedFields),
      result,
      JSON.stringify(comparisons)
    ]);

    res.json({
      result,
      status,
      comparisons,
      confidence: req.body.confidence,
      verificationDate: new Date().toISOString(),
      officialAuthVerification: 'Not connected'
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// Get verification history
exports.getVerificationHistory = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT contains userId, not id
    
    const query = `
      SELECT dv.*, u.full_name as reviewer
      FROM document_verifications dv
      LEFT JOIN users u ON dv.reviewed_by = u.id
      WHERE dv.user_id = $1
      ORDER BY dv.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch verification history', error: error.message });
  }
};
