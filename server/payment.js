const express = require("express");
const router = express.Router();
const { encrypt } = require("./ccavenue");

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
  const merchantData =
  `merchant_id=${process.env.CCAVENUE_MERCHANT_ID}` +
  `&order_id=${encodeURIComponent(order_id)}` +
  `&currency=INR` +
  `&amount=${encodeURIComponent(amount)}` +
  `&redirect_url=${encodeURIComponent("http://localhost:5000/payment-response")}` +
  `&cancel_url=${encodeURIComponent("http://localhost:5000/payment-cancel")}` +
  `&billing_name=${encodeURIComponent(billing_name)}` +
  `&billing_email=${encodeURIComponent(billing_email)}` +
  `&billing_tel=${encodeURIComponent(billing_tel)}`;



    console.log("🟡 Merchant data (plain):", merchantData);

    /* 🔒 Encrypt request */
    const encryptedData = encrypt(merchantData);

    console.log("🟢 Encryption successful");
    console.log("🟢 encRequest length:", encryptedData.length);

    /* ✅ Send encrypted payload to frontend */
    return res.status(200).json({
      encRequest: encryptedData,
      accessCode: process.env.CCAVENUE_ACCESS_CODE,
    });

  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    return res.status(500).json({ error: "Payment initiation failed" });
  }
});

module.exports = router;
