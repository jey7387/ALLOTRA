const pool = require('../config/database');

class Document {
  static async create({ application_id, document_type, file_path }) {
    const query = `
      INSERT INTO documents (application_id, document_type, file_path)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [application_id, document_type, file_path];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByApplicationId(application_id) {
    const query = 'SELECT * FROM documents WHERE application_id = $1 ORDER BY uploaded_at DESC';
    const result = await pool.query(query, [application_id]);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM documents WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE documents 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM documents WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Document;
