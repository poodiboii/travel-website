require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const { decrypt } = require("./ccavenue");
const paymentRoutes = require("./payment");

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

app.post("/payment-response", (req, res) => {
  try {
    const encryptedResponse = req.body.encResp;
    const decryptedData = decrypt(encryptedResponse);
    console.log("✅ Payment Success:", decryptedData);
    res.redirect("http://localhost:3000/payment-success");
  } catch (e) {
    console.error(e);
    res.redirect("http://localhost:3000/payment-failed");
  }
});

app.post("/payment-cancel", (req, res) => {
  res.redirect("http://localhost:3000/payment-failed");
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
