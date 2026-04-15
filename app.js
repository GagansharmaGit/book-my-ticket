require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./src/modules/auth/auth.route");
const seatsRouter = require("./src/modules/seats/seats.route");
const ApiError = require("./src/common/utils/api-error");
const pool = require("./src/common/config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/seats", seatsRouter);

app.get("/seats", async (req, res) => {
  const result = await pool.query("SELECT * FROM seats ORDER BY id ASC");
  res.send(result.rows);
});

app.put("/:id/:name", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.params.name;

    const conn = await pool.connect();
    await conn.query("BEGIN");

    const sql =
      "SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE";
    const result = await conn.query(sql, [id]);

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      conn.release();
      res.send({ error: "Seat already booked" });
      return;
    }

    const sqlU = "UPDATE seats SET isbooked = 1, name = $2 WHERE id = $1";
    const updateResult = await conn.query(sqlU, [id, name]);

    await conn.query("COMMIT");
    conn.release();
    res.send(updateResult);
  } catch (ex) {
    console.error(ex);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors.length > 0 ? err.errors : undefined,
    });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
