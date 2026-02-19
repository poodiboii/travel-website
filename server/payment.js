const express = require("express");
const router = express.Router();
const { encrypt } = require("./ccavenue");

function ccavenueConfig() {
  const env = (process.env.CCAVENUE_ENV || "prod").toLowerCase();

  const pick = (name) => {
    const v = process.env[name];
    if (!v) return null;
    return v;
  };

  const cfg = {
    env,
    merchantId:
      (env === "test" && pick("CCAVENUE_MERCHANT_ID_TEST")) ||
      pick("CCAVENUE_MERCHANT_ID"),
    accessCode:
      (env === "test" && pick("CCAVENUE_ACCESS_CODE_TEST")) ||
      pick("CCAVENUE_ACCESS_CODE"),
    // Working key is used by ccavenue.js directly via process.env.CCAVENUE_WORKING_KEY.
    // We'll swap it here when test keys are provided.
    workingKey:
      (env === "test" && pick("CCAVENUE_WORKING_KEY_TEST")) ||
      pick("CCAVENUE_WORKING_KEY"),
    gatewayUrl:
      env === "test"
        ? "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
        : "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
    redirectUrl: pick("CCAVENUE_REDIRECT_URL") || "http://localhost:5000/payment-response",
    cancelUrl: pick("CCAVENUE_CANCEL_URL") || "http://localhost:5000/payment-cancel",
  };

  if (!cfg.merchantId || !cfg.accessCode || !cfg.workingKey) {
    throw new Error(
      "Missing CC Avenue config. Set CCAVENUE_MERCHANT_ID/ACCESS_CODE/WORKING_KEY (and *_TEST when CCAVENUE_ENV=test)."
    );
  }

  // Ensure crypto uses the selected working key
  process.env.CCAVENUE_WORKING_KEY = cfg.workingKey;

  return cfg;
}

/**
 * POST: /api/initiate-payment
 */
router.post("/initiate-payment", (req, res) => {
  console.log("🟢 /api/initiate-payment hit");
  console.log("🟢 Request body:", req.body);

  try {
    const {
      order_id,
      amount,
      billing_name,
      billing_email,
      billing_tel,
    } = req.body;

    if (!order_id || !amount) {
      console.error("🔴 Missing order_id or amount");
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* 🔐 CC Avenue merchant parameters */
    const cfg = ccavenueConfig();

    const merchantData =
      `merchant_id=${cfg.merchantId}` +
      `&order_id=${encodeURIComponent(order_id)}` +
      `&currency=INR` +
      `&amount=${encodeURIComponent(amount)}` +
      `&redirect_url=${encodeURIComponent(cfg.redirectUrl)}` +
      `&cancel_url=${encodeURIComponent(cfg.cancelUrl)}` +
      `&billing_name=${encodeURIComponent(billing_name || "Guest")}` +
      `&billing_email=${encodeURIComponent(billing_email || "guest@example.com")}` +
      `&billing_tel=${encodeURIComponent(billing_tel || "9999999999")}`;



    console.log("🟡 Merchant data (plain):", merchantData);

    /* 🔒 Encrypt request */
    const encryptedData = encrypt(merchantData);

    console.log("🟢 Encryption successful");
    console.log("🟢 encRequest length:", encryptedData.length);

    /* ✅ Send encrypted payload to frontend */
    return res.status(200).json({
      encRequest: encryptedData,
      accessCode: cfg.accessCode,
      gatewayUrl: cfg.gatewayUrl,
      env: cfg.env,
    });

  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    return res.status(500).json({ error: "Payment initiation failed" });
  }
});

module.exports = router;
const Booking = require("./models/Booking");

/* VIEW ALL BOOKINGS */
router.get("/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
