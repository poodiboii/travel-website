const Database = require("better-sqlite3");

// Create or open SQLite database
const db = new Database("database.db");

// Enable foreign keys (good practice)
db.exec("PRAGMA foreign_keys = ON");

// Create bookings table if it does not exist
db.exec(`
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT UNIQUE,
  amount REAL,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("SQLite database connected and bookings table ready.");

module.exports = db;