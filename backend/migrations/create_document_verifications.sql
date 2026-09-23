-- Create document_verifications table
CREATE TABLE IF NOT EXISTS document_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_path TEXT NOT NULL,
  ocr_confidence DECIMAL(5,2),
  extracted_data JSONB,
  verification_result VARCHAR(50) NOT NULL,
  comparisons JSONB,
  reviewed_by INTEGER REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_document_verifications_user_id ON document_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_document_verifications_document_type ON document_verifications(document_type);
CREATE INDEX IF NOT EXISTS idx_document_verifications_result ON document_verifications(verification_result);
