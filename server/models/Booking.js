const supabase = require("../supabase");

/* CREATE BOOKING */

async function createBooking({
  order_id,
  amount,
  status,
  name,
  phone,
  travellers,
  traveller_count,
  package_name,
  travel_date
}) {

  try {

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          order_id,
          amount,
          status,
          name,
          phone,
          travellers,
          traveller_count,
          package_name,
          travel_date
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      data
    };

  } catch (error) {

    console.error("Create booking error:", error);

    return {
      success: false,
      error
    };

  }

}

/* FETCH BOOKINGS */

async function fetchBookings({ order = "desc" } = {}) {

  try {

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: order === "asc" });

    if (error) throw error;

    return {
      success: true,
      data
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