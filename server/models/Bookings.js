const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    orderId: String,
    amount: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
