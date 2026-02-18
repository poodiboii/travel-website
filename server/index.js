require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const { decrypt } = require("./ccavenue");
const paymentRoutes = require("./payment");
const authRoutes = require("./auth");

console.log(
  "🔐 CC Avenue Working Key Length:",
  process.env.CCAVENUE_WORKING_KEY.length
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes);

app.post("/payment-response", (req, res) => {
  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  try {
    const encryptedResponse = req.body.encResp;
    const decryptedData = decrypt(encryptedResponse);
    console.log("✅ Payment Response (decrypted):", decryptedData);
    res.redirect(`${frontend}/payment-success`);
  } catch (e) {
    console.error(e);
    res.redirect(`${frontend}/payment-failed`);
  }
});

app.post("/payment-cancel", (req, res) => {
  const frontend = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  res.redirect(`${frontend}/payment-failed`);
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
