require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const { decrypt } = require("./ccavenue");
const paymentRoutes = require("./payment");
const authRoutes = require("./auth");

/* ================================
   ✅ CONNECT MONGODB
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.error("🔴 MongoDB Error:", err));

/* ================================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes);

/* ================================
   PAYMENT RESPONSE (SAVE HERE)
================================ */
const Booking = require("./models/Booking");

app.post("/payment-response", async (req, res) => {
  const frontend = process.env.FRONTEND_BASE_URL;

  try {
    const encryptedResponse = req.body.encResp;
    const decryptedData = decrypt(encryptedResponse);

    const params = new URLSearchParams(decryptedData);
    const orderId = params.get("order_id");
    const amount = params.get("amount");
    const status = params.get("order_status");

    if (status === "Success") {
      await Booking.create({
        orderId,
        amount,
        status,
      });

      console.log("✅ Booking saved to DB");
      return res.redirect(`${frontend}/payment-success`);
    }

    res.redirect(`${frontend}/payment-failed`);
  } catch (e) {
    console.error(e);
    res.redirect(`${frontend}/payment-failed`);
  }
});

app.post("/payment-cancel", (req, res) => {
  res.redirect(`${process.env.FRONTEND_BASE_URL}/payment-failed`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Backend running");
});
