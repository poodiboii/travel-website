const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  const adminEmail = requireEnv("ADMIN_EMAIL");
  const adminPassword = requireEnv("ADMIN_PASSWORD");
  const jwtSecret = requireEnv("JWT_SECRET");

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email: adminEmail },
    jwtSecret,
    { expiresIn: "7d" }
  );

  return res.json({ ok: true, token, user: { role: "admin", email: adminEmail } });
});

router.get("/me", (req, res) => {
  try {
    const jwtSecret = requireEnv("JWT_SECRET");
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: "Missing token" });

    const payload = jwt.verify(token, jwtSecret);
    return res.json({ ok: true, user: { role: payload.role, email: payload.email } });
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
});

module.exports = router;
