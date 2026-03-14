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
  phone TEXT,
  travellers TEXT,
  traveller_count INTEGER,
  package_name TEXT,
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

    const {
      name,
      phone,
      travellers,
      traveller_count,
      package_name,
      travel_date
    } = req.body;

    const orderId = "TEMP_" + Date.now();

    db.prepare(`
      INSERT INTO bookings (
        order_id,
        amount,
        status,
        name,
        phone,
        travellers,
        traveller_count,
        package_name,
        travel_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      1000,
      "Pending",
      name,
      phone,
      JSON.stringify(travellers),
      traveller_count,
      package_name,
      travel_date
    );

    res.json({
      success: true,
      order_id: orderId
    });

  } catch (err) {

    console.error("Booking error:", err);

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
    const bookings = db.prepare(`
      SELECT * FROM bookings
      ORDER BY created_at DESC
    `).all();

    let rowsHtml = bookings.map(b => `
      <tr>
        <td>${b.id}</td>
        <td>${b.name}</td>
        <td>${b.age}</td>
        <td>${b.phone}</td>
        <td>${b.people_count}</td>
        <td>${b.travel_date}</td>
        <td>${b.status}</td>
        <td>${b.amount || "0"}</td>
        <td>${b.created_at}</td>
      </tr>
    `).join("");

    const html = `
      <html>
      <head>
        <title>Travel Website Bookings</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background:#f4f6f8;
            padding:40px;
          }
          h1{
            text-align:center;
            margin-bottom:30px;
          }
          table{
            width:100%;
            border-collapse:collapse;
            background:white;
            box-shadow:0 5px 20px rgba(0,0,0,0.1);
          }
          th{
            background:#2c3e50;
            color:white;
            padding:12px;
          }
          td{
            padding:10px;
            border-bottom:1px solid #eee;
            text-align:center;
          }
          tr:hover{
            background:#f1f1f1;
          }
        </style>
      </head>

      <body>

      <h1>📋 Booking Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Travellers</th>
            <th>Travel Date</th>
            <th>Status</th>
            <th>Advance Paid</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          ${rowsHtml}
        </tbody>

      </table>

      </body>
      </html>
    `;

    res.send(html);

  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).send("Error loading bookings");
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