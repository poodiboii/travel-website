require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { decrypt } = require("./ccavenue");
const Booking = require("./models/Booking");

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

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================================
   ROUTES
================================ */

app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes);

/* ================================
   BOOKING API ROUTE (NEW)
================================ */

app.post("/api/book", (req, res) => {

  try {

    console.log("Booking request received:", req.body);

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
   CCAVENUE PAYMENT RESPONSE HANDLER
================================ */

app.post("/payment-response", async (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";

  if (!frontend) {
    console.error("FRONTEND_BASE_URL is not set");
    return res.status(500).send("Server configuration error");
  }

  try {

    const encryptedResponse = req.body.encResp;

    if (!encryptedResponse) {
      console.warn("No encResp received");
      return res.redirect(`${frontend}/payment-failed?reason=no_response`);
    }

    const decryptedData = decrypt(encryptedResponse);
    const params = new URLSearchParams(decryptedData);

    const orderId = params.get("order_id");
    const amount = params.get("amount");
    const status = params.get("order_status");

    if (!orderId || !amount || !status) {
      console.warn("Missing required parameters");
      return res.redirect(`${frontend}/payment-failed?reason=invalid_response`);
    }

    console.log(`Payment callback → Order: ${orderId} | Status: ${status}`);

    if (status === "Success") {

      db.prepare(`
        INSERT INTO bookings (order_id, amount, status)
        VALUES (?, ?, ?)
      `).run(orderId, Number(amount), "Success");

      console.log(`Booking saved → Order ID: ${orderId}`);

      return res.redirect(`${frontend}/payment-success?order_id=${orderId}`);
    }

    return res.redirect(`${frontend}/payment-failed?status=${status}`);

  } catch (err) {

    console.error("Payment error:", err);

    return res.redirect(`${frontend}/payment-failed?reason=server_error`);

  }
});

/* ================================
   TEST ENDPOINT
================================ */

app.post("/test-payment-callback", async (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  const fakeOrderId = `TEST_${Date.now()}`;

  try {

    db.prepare(`
      INSERT INTO bookings (order_id, amount, status)
      VALUES (?, ?, ?)
    `).run(fakeOrderId, 1499.00, "Success");

    console.log(`Fake booking saved → ${fakeOrderId}`);

    return res.redirect(`${frontend}/payment-success?order_id=${fakeOrderId}`);

  } catch (err) {

    console.error("Test error:", err);

    return res.redirect(`${frontend}/payment-failed?reason=test_server_error`);

  }
});

/* ================================
   PAYMENT CANCEL
================================ */

app.post("/payment-cancel", (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";

  res.redirect(`${frontend}/payment-failed?reason=cancelled`);

});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ================================
   GRACEFUL SHUTDOWN
================================ */

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  process.exit(0);
});