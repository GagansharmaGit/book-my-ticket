const pool = require("../../common/config/db");
const AuthModel = {
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  },

  async findByUsername(username) {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  async create({ username, email, passwordHash }) {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash]
    );
    return result.rows[0];
  },
};

module.exports = AuthModel;
