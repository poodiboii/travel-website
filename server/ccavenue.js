const crypto = require("crypto");

/**
 * CC Avenue Encryption / Decryption
 * Algorithm: AES-128-ECB
 * Key: RAW working key (16 bytes)
 */

function encrypt(plainText) {
  const key = Buffer.from(process.env.CCAVENUE_WORKING_KEY, "hex");

  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

function decrypt(encText) {
  const key = Buffer.from(process.env.CCAVENUE_WORKING_KEY, "hex");

  const decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  decipher.setAutoPadding(true);

  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
