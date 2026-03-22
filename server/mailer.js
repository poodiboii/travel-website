// mailer.js
// Sends payment confirmation emails via SMTP using Nodemailer

const nodemailer = require("nodemailer");

/* ================================
   SMTP TRANSPORTER
================================ */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "us2.smtp.mailhostbox.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // TLS on port 587
  auth: {
    user: process.env.SMTP_USER || "holiday@ihrsindia.co.in",
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // allow self-signed certs (common with mailhostbox)
  },
});

/* ================================
   SEND PAYMENT CONFIRMATION EMAIL
================================ */

async function sendPaymentConfirmation({ orderId, amount, name, email, phone, packageName, travelDate, travellerCount }) {

  // Skip if no valid customer email
  if (!email || email === "guest@example.com") {
    console.log("⚠️ No valid customer email — skipping confirmation mail.");
    return null;
  }

  const senderEmail = process.env.SMTP_USER || "holiday@ihrsindia.co.in";
  const companyName = "IHRS India";

  /* ---- Email to Customer ---- */

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #1a73e8; color: #fff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Payment Confirmation</h1>
      </div>
      <div style="padding: 24px;">
        <p>Dear <strong>${name || "Traveller"}</strong>,</p>
        <p>Thank you for your booking! Your payment has been received successfully.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Order ID</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${orderId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Amount Paid</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">₹${amount}</td>
          </tr>
          ${packageName ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Package</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${packageName}</td>
          </tr>` : ""}
          ${travelDate ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Travel Date</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${travelDate}</td>
          </tr>` : ""}
          ${travellerCount ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;">Travellers</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right;">${travellerCount}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 10px 0; color: #666;">Status</td>
            <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #2e7d32;">✅ Success</td>
          </tr>
        </table>

        <p>Our team will confirm availability and share the final itinerary shortly.</p>
        <p style="color: #666; font-size: 13px;">If you have any questions, please reply to this email or contact us.</p>
      </div>
      <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} ${companyName}. All rights reserved.
      </div>
    </div>
  `;

  /* ---- Email to Admin (company) ---- */

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">🔔 New Payment Received</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Order ID</td>
          <td style="padding: 8px 0; font-weight: bold;">${orderId}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Amount</td>
          <td style="padding: 8px 0; font-weight: bold;">₹${amount}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Customer Name</td>
          <td style="padding: 8px 0;">${name || "N/A"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Email</td>
          <td style="padding: 8px 0;">${email}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Phone</td>
          <td style="padding: 8px 0;">${phone || "N/A"}</td>
        </tr>
        ${packageName ? `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Package</td>
          <td style="padding: 8px 0;">${packageName}</td>
        </tr>` : ""}
        ${travelDate ? `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; color: #666;">Travel Date</td>
          <td style="padding: 8px 0;">${travelDate}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 8px 0; color: #666;">Status</td>
          <td style="padding: 8px 0; font-weight: bold; color: #2e7d32;">Success</td>
        </tr>
      </table>
    </div>
  `;

  try {

    // Send to customer
    await transporter.sendMail({
      from: `"${companyName}" <${senderEmail}>`,
      to: email,
      subject: `Payment Confirmation - Order #${orderId}`,
      html: customerHtml,
    });

    console.log(`✅ Confirmation email sent to customer: ${email}`);

    // Send copy to admin/company
    await transporter.sendMail({
      from: `"${companyName} Bookings" <${senderEmail}>`,
      to: senderEmail,
      subject: `🔔 New Payment - Order #${orderId} - ₹${amount}`,
      html: adminHtml,
    });

    console.log(`✅ Admin notification sent to: ${senderEmail}`);

    return true;

  } catch (err) {

    console.error("❌ Email send error:", err.message);
    return false;

  }

}

module.exports = { sendPaymentConfirmation, transporter };
