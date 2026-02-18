const crypto = require("crypto");

/**
 * CC Avenue Encryption / Decryption
 *
 * CC Avenue's typical integration uses:
 * - AES-128-CBC
 * - key = MD5(working_key) (16 bytes)
 * - iv = 0x00..0f
 *
 * Your previous implementation used AES-128-ECB and treated WORKING_KEY as hex,
 * which commonly leads to: "10002 Working is empty".
 */

const IV = Buffer.from("000102030405060708090a0b0c0d0e0f", "hex");

function deriveKey(workingKey) {
  if (!workingKey) throw new Error("Missing CCAVENUE_WORKING_KEY");
  // CC Avenue expects md5 of the working key string.
  return crypto.createHash("md5").update(String(workingKey)).digest(); // 16 bytes
}

function encrypt(plainText) {
  const key = deriveKey(process.env.CCAVENUE_WORKING_KEY);
  const cipher = crypto.createCipheriv("aes-128-cbc", key, IV);
  let encrypted = cipher.update(String(plainText), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encText) {
  const key = deriveKey(process.env.CCAVENUE_WORKING_KEY);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, IV);
  let decrypted = decipher.update(String(encText), "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
