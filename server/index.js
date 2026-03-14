require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { decrypt } = require("./ccavenue");
const db = require("./db");

const app = express();

/* ================================
   DATABASE INITIALIZATION (RESET)
================================ */

try {
  db.exec(`
    DROP TABLE IF EXISTS bookings;

    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      amount REAL,
      status TEXT,
      name TEXT,
      age INTEGER,
      phone TEXT,
      people_count INTEGER,
      travel_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Bookings table recreated with correct schema");
} catch (err) {
  console.error("Database initialization error:", err);
}

/* ================================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ================================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================================
   CREATE BOOKING (FROM CART)
================================ */

app.post("/api/book", (req, res) => {
  try {
    console.log("Incoming booking:", req.body);

    const name = req.body.name || "Guest";
    const age = Number(req.body.age) || 0;
    const phone = req.body.phone || "0000000000";
    const people_count = Number(req.body.people_count) || 1;
    const travel_date = req.body.travel_date || "";

    const orderId = "TEMP_" + Date.now();

    db.prepare(`
      INSERT INTO bookings (
        order_id,
        amount,
        status,
        name,
        age,
        phone,
        people_count,
        travel_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      0,
      "Pending",
      name,
      age,
      phone,
      people_count,
      travel_date
    );

    console.log("Booking saved:", orderId);

    res.json({
      success: true,
      order_id: orderId
    });

  } catch (err) {
    console.error("BOOKING INSERT ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

/* ================================
   VIEW BOOKINGS
================================ */

app.get("/api/bookings", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM bookings
      ORDER BY created_at DESC
    `).all();

    res.json(rows);

  } catch (err) {
    console.error("Fetch bookings error:", err);

    res.status(500).json({
      error: "Failed to fetch bookings"
    });
  }
});

/* ================================
   CCAVENUE PAYMENT RESPONSE
================================ */

app.post("/payment-response", (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";

  try {

    const encryptedResponse = req.body.encResp;

    if (!encryptedResponse) {
      console.warn("No payment response received");
      return res.redirect(`${frontend}/payment-failed`);
    }

    const decryptedData = decrypt(encryptedResponse);
    const params = new URLSearchParams(decryptedData);

    const orderId = params.get("order_id");
    const amount = params.get("amount");
    const status = params.get("order_status");

    console.log("Payment response:", orderId, status);

    if (status === "Success") {

      db.prepare(`
        UPDATE bookings
        SET status = ?, amount = ?
        WHERE order_id = ?
      `).run("Success", Number(amount), orderId);

      console.log("Payment success updated");

      return res.redirect(`${frontend}/payment-success?order_id=${orderId}`);
    }

    return res.redirect(`${frontend}/payment-failed`);

  } catch (err) {

    console.error("Payment callback error:", err);

    return res.redirect(`${frontend}/payment-failed`);

  }
});

/* ================================
   TEST BOOKING ROUTE
================================ */

app.get("/test-booking", (req, res) => {

  const fakeId = "TEST_" + Date.now();

  db.prepare(`
    INSERT INTO bookings (order_id, amount, status)
    VALUES (?, ?, ?)
  `).run(fakeId, 1499, "Success");

  res.json({
    message: "Test booking created",
    order_id: fakeId
  });

});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});