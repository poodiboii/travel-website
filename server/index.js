require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { decrypt } = require("./ccavenue");
const supabase = require("./supabase");

const app = express();

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
  res.send("Backend running 🚀");
});

/* ================================
   SAVE BOOKING (FROM CART)
================================ */

app.post("/api/book", async (req, res) => {

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

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          order_id: orderId,
          amount: 1000,
          status: "Pending",
          name,
          phone,
          travellers,
          traveller_count,
          package_name,
          travel_date
        }
      ]);

    if (error) throw error;

    console.log("Booking saved:", orderId);

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

app.get("/api/bookings", async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {

    console.error("Fetch bookings error:", err);

    res.status(500).json({
      error: err.message
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
      return res.redirect(`${frontend}/payment-failed`);
    }

    const decryptedData = decrypt(encryptedResponse);

    const params = new URLSearchParams(decryptedData);

    const orderId = params.get("order_id");
    const amount = params.get("amount");
    const status = params.get("order_status");

    console.log("Payment response:", orderId, status);

    if (status === "Success") {

      const { error } = await supabase
        .from("bookings")
        .update({
          status: "Success",
          amount: Number(amount)
        })
        .eq("order_id", orderId);

      if (error) throw error;

      return res.redirect(`${frontend}/payment-success?order_id=${orderId}`);
    }

    return res.redirect(`${frontend}/payment-failed`);

  } catch (err) {

    console.error("Payment callback error:", err);

    return res.redirect(`${frontend}/payment-failed`);

  }

});

/* ================================
   TEST BOOKING
================================ */

app.get("/test-booking", async (req, res) => {

  const fakeId = "TEST_" + Date.now();

  const { error } = await supabase
    .from("bookings")
    .insert([
      {
        order_id: fakeId,
        amount: 1000,
        status: "Success",
        name: "Test User",
        phone: "9999999999",
        travellers: [],
        traveller_count: 1,
        package_name: "Test Package",
        travel_date: "2026-01-01"
      }
    ]);

  if (error) {
    res.status(500).send(error.message);
    return;
  }

  res.json({
    message: "Test booking inserted",
    order_id: fakeId
  });

});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;
const path = require("path");

/* Serve React build */
app.use(express.static(path.join(__dirname, "../build")));

/* Catch-all route for React */
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});