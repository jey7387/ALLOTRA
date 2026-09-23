const pool = require('../config/database');

class Draft {
  static async create({ user_id, scheme_id, scheme_name, data, completion_percentage }) {
    const query = `
      INSERT INTO drafts (user_id, scheme_id, scheme_name, data, completion_percentage)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [user_id, scheme_id, scheme_name, JSON.stringify(data || {}), completion_percentage || 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT d.*, s.name as scheme_name, s.location, s.price
      FROM drafts d
      LEFT JOIN schemes s ON d.scheme_id = s.id
      WHERE d.user_id = $1
      ORDER BY d.updated_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM drafts WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        if (key === 'data') {
          fields.push(`${key} = $${paramCount}::jsonb`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE drafts 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM drafts WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Draft;
