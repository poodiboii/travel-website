// ccavenue.js
// Handles encryption/decryption for CCAvenue payment gateway
// Uses Node.js built-in 'crypto' module (no extra npm install needed)

const crypto = require('crypto');

/**
 * Decrypts the encResp string sent by CCAvenue in the response callback.
 * @param {string} encResp - The encrypted response from CCAvenue (base64 string)
 * @returns {string} - Decrypted plain text (URL-encoded key=value pairs)
 */
function decrypt(encResp) {
  // === IMPORTANT: Replace with YOUR real working key from CCAvenue dashboard ===
  // Go to: CCAvenue Merchant Dashboard → Settings → Working Key (32 chars)
  const WORKING_KEY = process.env.CCAVENUE_WORKING_KEY || 'your-32-character-working-key-here'; // ← CHANGE THIS!

  if (!WORKING_KEY || WORKING_KEY.length !== 32) {
    throw new Error('CCAvenue WORKING_KEY is missing or invalid (must be exactly 32 characters)');
  }

  // Step 1: MD5 hash of working key, then base64 encode it (CCAvenue standard)
  const md5Hash = crypto.createHash('md5').update(WORKING_KEY).digest();
  const key = Buffer.from(md5Hash).toString('base64'); // base64 key for AES

  // Step 2: Fixed IV used by CCAvenue (standard 000102...0f)
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
  ]);

  // Step 3: Create decipher (AES-128-CBC is what CCAvenue uses)
  const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'base64'), iv);

  // Step 4: Decrypt the base64 encResp
  let decrypted = decipher.update(encResp, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted; // returns string like "order_id=123&amount=100&order_status=Success&..."
}

// Optional: Export encrypt too (useful if you need to generate request later)
function encrypt(plainText) {
  const WORKING_KEY = process.env.CCAVENUE_WORKING_KEY || 'your-32-character-working-key-here';

  const md5Hash = crypto.createHash('md5').update(WORKING_KEY).digest();
  const key = Buffer.from(md5Hash).toString('base64');

  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
  ]);

  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'base64'), iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}

module.exports = {
  decrypt,
  encrypt, // optional - you can remove if not needed
};