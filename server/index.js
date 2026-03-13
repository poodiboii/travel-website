require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { decrypt } = require("./ccavenue");

// SQLite connection
const db = require("./db");

const app = express();

/* ================================
   INITIALIZE SQLITE TABLE
================================ */

db.prepare(`
CREATE TABLE IF NOT EXISTS bookings (
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
)
`).run();

/* ================================
   IMPORT ROUTES
================================ */

const paymentRoutes = require("./payment");
const authRoutes = require("./auth");

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
   ROUTES
================================ */

app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes);

/* ================================
   CREATE BOOKING
================================ */

app.post("/api/book", (req, res) => {

  try {

    const { name, age, phone, people_count, travel_date } = req.body;

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

    res.json({
      success: true,
      message: "Booking stored successfully",
      order_id: orderId
    });

  } catch (error) {

    console.error("Booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to store booking"
    });

  }

});

/* ================================
   VIEW BOOKINGS (NEW)
================================ */

app.get("/api/bookings", (req, res) => {

  try {

    const bookings = db.prepare(`
      SELECT * FROM bookings
      ORDER BY created_at DESC
    `).all();

    res.json(bookings);

  } catch (error) {

    console.error("Fetch bookings error:", error);

    res.status(500).json({
      error: "Failed to fetch bookings"
    });

  }

});

/* ================================
   CCAVENUE PAYMENT RESPONSE
================================ */

app.post("/payment-response", async (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";

  try {

    const encryptedResponse = req.body.encResp;

    if (!encryptedResponse) {
      return res.redirect(`${frontend}/payment-failed?reason=no_response`);
    }

    const decryptedData = decrypt(encryptedResponse);
    const params = new URLSearchParams(decryptedData);

    const orderId = params.get("order_id");
    const amount = params.get("amount");
    const status = params.get("order_status");

    console.log(`Payment callback → ${orderId} | ${status}`);

    if (status === "Success") {

      db.prepare(`
        UPDATE bookings
        SET status = ?, amount = ?
        WHERE order_id = ?
      `).run("Success", Number(amount), orderId);

      return res.redirect(`${frontend}/payment-success?order_id=${orderId}`);
    }

    return res.redirect(`${frontend}/payment-failed?status=${status}`);

  } catch (err) {

    console.error("Payment error:", err);

    return res.redirect(`${frontend}/payment-failed?reason=server_error`);

  }

});

/* ================================
   TEST PAYMENT
================================ */

app.get("/test-booking", (req, res) => {

  const fakeId = "TEST_" + Date.now();

  db.prepare(`
    INSERT INTO bookings (order_id, amount, status)
    VALUES (?, ?, ?)
  `).run(fakeId, 1499, "Success");

  res.json({
    message: "Test booking inserted",
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