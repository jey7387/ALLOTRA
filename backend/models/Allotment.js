const pool = require('../config/database');

class Allotment {
  static async create({ application_id, scheme_id, unit_number, allotment_date, possession_date, allotted_by }) {
    const query = `
      INSERT INTO allotments (application_id, scheme_id, unit_number, allotment_date, possession_date, allotted_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [application_id, scheme_id, unit_number, allotment_date, possession_date, allotted_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByApplicationId(application_id) {
    const query = `
      SELECT a.*, s.name as scheme_name, s.location
      FROM allotments a
      JOIN schemes s ON a.scheme_id = s.id
      WHERE a.application_id = $1
    `;
    const result = await pool.query(query, [application_id]);
    return result.rows[0];
  }

  static async findBySchemeId(scheme_id) {
    const query = `
      SELECT a.*, u.full_name as applicant_name
      FROM allotments a
      JOIN applications app ON a.application_id = app.id
      JOIN users u ON app.user_id = u.id
      WHERE a.scheme_id = $1
      ORDER BY a.allotment_date DESC
    `;
    const result = await pool.query(query, [scheme_id]);
    return result.rows;
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT a.*, s.name as scheme_name, s.location, s.category, s.price
      FROM allotments a
      JOIN applications app ON a.application_id = app.id
      JOIN schemes s ON a.scheme_id = s.id
      WHERE app.user_id = $1
      ORDER BY a.allotment_date DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_allotments,
        COUNT(*) FILTER (WHERE allotment_date >= CURRENT_DATE - INTERVAL '30 days') as recent_allotments
      FROM allotments
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Allotment;
