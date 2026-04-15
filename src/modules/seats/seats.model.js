const pool = require("../../common/config/db");

const SeatsModel = {
  async getAllSeats() {
    const result = await pool.query(
      "SELECT id, name, isbooked, user_id FROM seats ORDER BY id ASC"
    );
    return result.rows;
  },

  async getSeatById(seatId) {
    const result = await pool.query("SELECT * FROM seats WHERE id = $1", [
      seatId,
    ]);
    return result.rows[0] || null;
  },

  async bookSeat(seatId, userId, username) {
    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");

      const lockSql = `
        SELECT id, isbooked
        FROM seats
        WHERE id = $1 AND isbooked = 0
        FOR UPDATE
      `;
      const lockResult = await conn.query(lockSql, [seatId]);

      if (lockResult.rowCount === 0) {
        await conn.query("ROLLBACK");
        return { success: false, reason: "Seat is already booked or does not exist" };
      }

      const updateSql = `
        UPDATE seats
        SET isbooked = 1,
            name     = $2,
            user_id  = $3
        WHERE id = $1
        RETURNING id, name, isbooked, user_id
      `;
      const updateResult = await conn.query(updateSql, [seatId, username, userId]);

      await conn.query("COMMIT");
      return { success: true, seat: updateResult.rows[0] };
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  },

  async getUserBookings(userId) {
    const result = await pool.query(
      "SELECT id, name, isbooked, user_id FROM seats WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );
    return result.rows;
  },
};

module.exports = SeatsModel;
