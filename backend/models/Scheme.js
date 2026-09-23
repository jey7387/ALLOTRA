const pool = require('../config/database');

class Scheme {
  static async create({ name, description, location, category, price, total_units, available_units, application_deadline, eligibility_criteria, image_url }) {
    const query = `
      INSERT INTO schemes (name, description, location, category, price, total_units, available_units, application_deadline, eligibility_criteria, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [name, description, location, category, price, total_units, available_units, application_deadline, eligibility_criteria, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM schemes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM schemes';
    const values = [];
    const conditions = [];

    if (filters.category) {
      conditions.push(`category = $${values.length + 1}`);
      values.push(filters.category);
    }

    if (filters.available_only) {
      conditions.push(`available_units > 0`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';
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
      UPDATE schemes 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM schemes WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateAvailableUnits(id, change) {
    const query = `
      UPDATE schemes 
      SET available_units = available_units + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [change, id]);
    return result.rows[0];
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_schemes,
        SUM(total_units) as total_units,
        SUM(available_units) as available_units,
        COUNT(*) FILTER (WHERE available_units > 0) as active_schemes
      FROM schemes
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Scheme;
