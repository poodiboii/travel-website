const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_EMAIL = "pooravbatra54@gmail.com";
const ADMIN_PASSWORD = "pooravbatra"; // change if needed
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Missing credentials" });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email: ADMIN_EMAIL },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    ok: true,
    token,
    user: { role: "admin", email: ADMIN_EMAIL }
  });
});

router.get("/me", (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ ok: false, error: "Missing token" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    return res.json({
      ok: true,
      user: { role: payload.role, email: payload.email }
    });
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
});

module.exports = router;
