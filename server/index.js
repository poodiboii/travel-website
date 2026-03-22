require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { decrypt } = require("./ccavenue");
const supabase = require("./supabase");
const { sendPaymentConfirmation } = require("./mailer");

/* Import routers */
const paymentRouter = require("./payment");
const authRouter = require("./auth");

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
   MOUNT ROUTERS
================================ */

app.use("/api", paymentRouter);  // handles /api/initiate-payment, /api/admin/bookings
app.use("/api/auth", authRouter); // handles /api/auth/login, /api/auth/me

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
   CCAVENUE PAYMENT RESPONSE (SUCCESS/FAILURE)
================================ */

app.post("/payment-response", async (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "https://travel-website-4-tor2.onrender.com";

  try {

    const encryptedResponse = req.body.encResp;

    if (!encryptedResponse) {
      return res.redirect(`${frontend}/payment-failed`);
    }

    const decryptedData = decrypt(encryptedResponse);

    const params = new URLSearchParams(decryptedData);

    const orderId     = params.get("order_id");
    const amount      = params.get("amount");
    const status      = params.get("order_status");
    const billingName = params.get("billing_name");
    const billingEmail = params.get("billing_email");
    const billingTel  = params.get("billing_tel");
    const trackingId  = params.get("tracking_id");

    console.log(`Payment response: Order=${orderId}, Status=${status}, Amount=${amount}`);

    if (status === "Success") {

      /* Update booking status in Supabase */
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "Success",
          amount: Number(amount)
        })
        .eq("order_id", orderId);

      if (error) {
        console.error("Supabase update error:", error);
      }

      /* Fetch booking details for email */
      let bookingDetails = {};
      try {
        const { data: booking } = await supabase
          .from("bookings")
          .select("*")
          .eq("order_id", orderId)
          .single();

        if (booking) {
          bookingDetails = booking;
        }
      } catch (fetchErr) {
        console.error("Booking fetch for email error:", fetchErr);
      }

      /* Send confirmation email */
      try {
        await sendPaymentConfirmation({
          orderId,
          amount,
          name: billingName || bookingDetails.name,
          email: billingEmail,
          phone: billingTel || bookingDetails.phone,
          packageName: bookingDetails.package_name || null,
          travelDate: bookingDetails.travel_date || null,
          travellerCount: bookingDetails.traveller_count || null,
        });
      } catch (emailErr) {
        console.error("Email send error (non-blocking):", emailErr);
        // Don't block redirect if email fails
      }

      return res.redirect(
        `${frontend}/payment-success?order_id=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amount)}&tracking_id=${encodeURIComponent(trackingId || "")}`
      );
    }

    /* Handle other statuses: Failure, Aborted, Invalid */
    const failReason = status || "Unknown";

    /* Update booking status */
    if (orderId) {
      await supabase
        .from("bookings")
        .update({ status: failReason })
        .eq("order_id", orderId);
    }

    return res.redirect(
      `${frontend}/payment-failed?order_id=${encodeURIComponent(orderId || "")}&reason=${encodeURIComponent(failReason)}`
    );

  } catch (err) {

    console.error("Payment callback error:", err);

    return res.redirect(`${frontend}/payment-failed`);

  }

});

/* ================================
   CCAVENUE PAYMENT CANCEL
================================ */

app.post("/payment-cancel", async (req, res) => {

  const frontend = process.env.FRONTEND_BASE_URL || "https://travel-website-4-tor2.onrender.com";

  try {

    const encryptedResponse = req.body.encResp;

    if (encryptedResponse) {

      const decryptedData = decrypt(encryptedResponse);
      const params = new URLSearchParams(decryptedData);
      const orderId = params.get("order_id");
      const status = params.get("order_status") || "Cancelled";

      console.log(`Payment cancelled: Order=${orderId}, Status=${status}`);

      /* Update booking status */
      if (orderId) {
        await supabase
          .from("bookings")
          .update({ status: "Cancelled" })
          .eq("order_id", orderId);
      }

      return res.redirect(
        `${frontend}/payment-failed?order_id=${encodeURIComponent(orderId || "")}&reason=Cancelled`
      );

    }

    return res.redirect(`${frontend}/payment-failed?reason=Cancelled`);

  } catch (err) {

    console.error("Payment cancel error:", err);

    return res.redirect(`${frontend}/payment-failed?reason=Cancelled`);

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
