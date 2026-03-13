require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { decrypt } = require("./ccavenue");

const app = express();

// Import routes
const paymentRoutes = require("./payment");
const authRoutes = require("./auth");

// Supabase client
const supabase = require("./supabase");

/* ================================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================================
   ROUTES
================================ */
app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes);

/* ================================
   CCAVENUE PAYMENT RESPONSE HANDLER (real one)
================================ */
app.post("/payment-response", async (req, res) => {
  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";

  if (!frontend) {
    console.error("FRONTEND_BASE_URL is not set in environment variables");
    return res.status(500).send("Server configuration error");
  }

  try {
    const encryptedResponse = req.body.encResp;

    if (!encryptedResponse) {
      console.warn("No encResp received in payment response");
      return res.redirect(`${frontend}/payment-failed?reason=no_response`);
    }

    const decryptedData = decrypt(encryptedResponse);
    const params = new URLSearchParams(decryptedData);

    const orderId   = params.get("order_id");
    const amount    = params.get("amount");
    const status    = params.get("order_status");

    if (!orderId || !amount || !status) {
      console.warn("Missing required CCAvenue parameters", { orderId, amount, status });
      return res.redirect(`${frontend}/payment-failed?reason=invalid_response`);
    }

    console.log(`Payment callback received → Order: ${orderId} | Status: ${status} | Amount: ${amount}`);

    if (status === "Success") {
      console.log("About to insert booking into Supabase...");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          order_id: orderId,
          amount: Number(amount),
          status: "Success"
        });

      console.log("Supabase insert result:", { data, error });

      if (error) {
        console.error("Supabase insert failed:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return res.redirect(`${frontend}/payment-failed?reason=database_error`);
      }

      console.log(`✅ Booking saved successfully → Order ID: ${orderId}`);
      return res.redirect(`${frontend}/payment-success?order_id=${orderId}`);
    }

    console.log(`Payment unsuccessful → Status: ${status}`);
    return res.redirect(`${frontend}/payment-failed?status=${status}`);

  } catch (err) {
    console.error("Error processing payment response:", err.stack || err);
    return res.redirect(`${frontend}/payment-failed?reason=server_error`);
  }
});

/* ================================
   TEST ENDPOINT - Simulate CCAvenue callback
================================ */
app.post("/test-payment-callback", async (req, res) => {
  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  const { simulateStatus = "Success" } = req.body;

  console.log(`[TEST CALLBACK] Simulating payment with status: ${simulateStatus}`);

  const fakeOrderId = `TEST_${Date.now()}`;
  const fakeParams = new URLSearchParams({
    order_id: fakeOrderId,
    amount: "1499.00",
    order_status: simulateStatus
  });

  try {
    if (simulateStatus === "Success") {
      console.log("[TEST] About to insert fake booking into Supabase...");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          order_id: fakeOrderId,
          amount: Number(fakeParams.get("amount")),
          status: "Success"
        });

      console.log("[TEST] Supabase insert result:", { data, error });

      if (error) {
        console.error("[TEST] Supabase insert failed:", {
          message: error.message,
          code: error.code,
          details: error.details
        });
        return res.redirect(`${frontend}/payment-failed?reason=test_db_error`);
      }

      console.log(`[TEST] ✅ Fake booking saved → Order ID: ${fakeOrderId}`);
      return res.redirect(`${frontend}/payment-success?order_id=${fakeOrderId}`);
    } else {
      console.log("[TEST] Simulating failed payment");
      return res.redirect(`${frontend}/payment-failed?reason=test_failed`);
    }
  } catch (err) {
    console.error("[TEST] Server error:", err.stack || err);
    return res.redirect(`${frontend}/payment-failed?reason=test_server_error`);
  }
});

// Optional: payment cancel route
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

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  process.exit(0);
});