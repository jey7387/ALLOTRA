const pool = require('../config/database');

class Notification {
  static async create({ user_id, title, message, type }) {
    const query = `
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [user_id, title, message, type];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findUnreadByUserId(user_id) {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 AND is_read = FALSE 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async markAsRead(id) {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async markAllAsRead(user_id) {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM notifications WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Notification;
