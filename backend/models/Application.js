const pool = require('../config/database');

class Application {
  static async create({ user_id, scheme_id }) {
    const query = `
      INSERT INTO applications (user_id, scheme_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [user_id, scheme_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT a.*, s.name as scheme_name, s.location, s.category, s.price,
             u.full_name, u.email
      FROM applications a
      JOIN schemes s ON a.scheme_id = s.id
      JOIN users u ON a.user_id = u.id
      WHERE a.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT a.*, s.name as scheme_name, s.location, s.category, s.price, s.image_url
      FROM applications a
      JOIN schemes s ON a.scheme_id = s.id
      WHERE a.user_id = $1
      ORDER BY a.submitted_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findBySchemeId(scheme_id) {
    const query = `
      SELECT a.*, u.full_name, u.email, u.phone
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.scheme_id = $1
      ORDER BY a.submitted_at DESC
    `;
    const result = await pool.query(query, [scheme_id]);
    return result.rows;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT a.*, s.name as scheme_name, s.location, s.category,
             u.full_name, u.email
      FROM applications a
      JOIN schemes s ON a.scheme_id = s.id
      JOIN users u ON a.user_id = u.id
    `;
    const values = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`a.status = $${values.length + 1}`);
      values.push(filters.status);
    }

    if (filters.scheme_id) {
      conditions.push(`a.scheme_id = $${values.length + 1}`);
      values.push(filters.scheme_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.submitted_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
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
      UPDATE applications 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'under_review') as under_review,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'waitlisted') as waitlisted,
        COUNT(*) FILTER (WHERE status = 'allotted') as allotted
      FROM applications
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getMonthlyStats() {
    const query = `
      SELECT 
        DATE_TRUNC('month', submitted_at) as month,
        COUNT(*) as count
      FROM applications
      WHERE submitted_at >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', submitted_at)
      ORDER BY month
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Application;
