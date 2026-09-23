const pool = require('../config/database');

class Favorite {
  static async create({ user_id, scheme_id, scheme_name }) {
    const query = `
      INSERT INTO favorites (user_id, scheme_id, scheme_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, scheme_id) DO NOTHING
      RETURNING *
    `;
    const values = [user_id, scheme_id, scheme_name];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT f.*
      FROM favorites f
      LEFT JOIN schemes s ON f.scheme_id = s.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findByUserAndScheme(user_id, scheme_id) {
    const query = 'SELECT * FROM favorites WHERE user_id = $1 AND scheme_id = $2';
    const result = await pool.query(query, [user_id, scheme_id]);
    return result.rows[0];
  }

  static async delete(user_id, scheme_id) {
    const query = 'DELETE FROM favorites WHERE user_id = $1 AND scheme_id = $2 RETURNING id';
    const result = await pool.query(query, [user_id, scheme_id]);
    return result.rows[0];
  }

  static async checkFavorite(user_id, scheme_id) {
    const query = 'SELECT EXISTS(SELECT 1 FROM favorites WHERE user_id = $1 AND scheme_id = $2) as exists';
    const result = await pool.query(query, [user_id, scheme_id]);
    return result.rows[0].exists;
  }
}

module.exports = Favorite;
