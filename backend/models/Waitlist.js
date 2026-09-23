const pool = require('../config/database');

class Waitlist {
  static async create({ application_id, scheme_id, rank, estimated_allotment_date }) {
    const query = `
      INSERT INTO waitlists (application_id, scheme_id, rank, estimated_allotment_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [application_id, scheme_id, rank, estimated_allotment_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByApplicationId(application_id) {
    const query = `
      SELECT w.*, s.name as scheme_name, s.location
      FROM waitlists w
      JOIN schemes s ON w.scheme_id = s.id
      WHERE w.application_id = $1
    `;
    const result = await pool.query(query, [application_id]);
    return result.rows[0];
  }

  static async findBySchemeId(scheme_id) {
    const query = `
      SELECT w.*, a.user_id, u.full_name, u.email
      FROM waitlists w
      JOIN applications a ON w.application_id = a.id
      JOIN users u ON a.user_id = u.id
      WHERE w.scheme_id = $1
      ORDER BY w.rank ASC
    `;
    const result = await pool.query(query, [scheme_id]);
    return result.rows;
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT w.*, s.name as scheme_name, s.location, s.category, s.price
      FROM waitlists w
      JOIN applications a ON w.application_id = a.id
      JOIN schemes s ON w.scheme_id = s.id
      WHERE a.user_id = $1
      ORDER BY w.rank ASC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async updateRank(application_id, new_rank) {
    const query = `
      UPDATE waitlists 
      SET rank = $1, updated_at = CURRENT_TIMESTAMP
      WHERE application_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [new_rank, application_id]);
    return result.rows[0];
  }

  static async delete(application_id) {
    const query = 'DELETE FROM waitlists WHERE application_id = $1 RETURNING id';
    const result = await pool.query(query, [application_id]);
    return result.rows[0];
  }

  static async generateWaitlist(scheme_id) {
    const query = `
      WITH ranked_applications AS (
        SELECT 
          a.id as application_id,
          a.scheme_id,
          ROW_NUMBER() OVER (ORDER BY a.submitted_at ASC) as rank
        FROM applications a
        WHERE a.scheme_id = $1 
          AND a.status IN ('pending', 'under_review')
      )
      INSERT INTO waitlists (application_id, scheme_id, rank)
      SELECT application_id, scheme_id, rank
      FROM ranked_applications
      ON CONFLICT (application_id, scheme_id) 
      DO UPDATE SET rank = EXCLUDED.rank, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [scheme_id]);
    return result.rows;
  }
}

module.exports = Waitlist;
