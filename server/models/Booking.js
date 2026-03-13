const db = require("../db");

function createBooking({
  order_id,
  amount,
  status,
  name,
  age,
  phone,
  people_count,
  travel_date
}) {

  try {

    const result = db.prepare(`
      INSERT INTO bookings (
        order_id,
        amount,
        status,
        name,
        age,
        phone,
        people_count,
        travel_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order_id,
      amount,
      status,
      name || null,
      age || null,
      phone || null,
      people_count || null,
      travel_date || null
    );

    return {
      success: true,
      id: result.lastInsertRowid
    };

  } catch (error) {

    console.error("Create booking error:", error);

    return {
      success: false,
      error
    };

  }

}

function fetchBookings({ order = "desc" } = {}) {

  try {

    const rows = db.prepare(`
      SELECT *
      FROM bookings
      ORDER BY created_at ${order === "asc" ? "ASC" : "DESC"}
    `).all();

    return {
      success: true,
      data: rows
    };

  } catch (error) {

    console.error("Fetch bookings error:", error);

    return {
      success: false,
      error
    };

  }

}

module.exports = {
  createBooking,
  fetchBookings
};