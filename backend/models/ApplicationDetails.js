const pool = require('../config/database');

class ApplicationDetails {
  static async create({ application_id, family_members, annual_income, occupation, current_address, city, state, pincode }) {
    const query = `
      INSERT INTO application_details (application_id, family_members, annual_income, occupation, current_address, city, state, pincode)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [application_id, family_members, annual_income, occupation, current_address, city, state, pincode];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByApplicationId(application_id) {
    const query = 'SELECT * FROM application_details WHERE application_id = $1';
    const result = await pool.query(query, [application_id]);
    return result.rows[0];
  }

  static async update(application_id, updates) {
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

    values.push(application_id);
    const query = `
      UPDATE application_details 
      SET ${fields.join(', ')}
      WHERE application_id = $${paramCount}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = ApplicationDetails;
