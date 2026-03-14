import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {

    try {

      const res = await fetch(`${API_URL}/admin/bookings`);
      const data = await res.json();

      setBookings(data);
      setLoading(false);

    } catch (err) {

      console.error("Error loading bookings:", err);
      setLoading(false);

    }

  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading bookings...</h2>;
  }

  return (

    <div style={{ padding: "40px" }}>

      <h1 style={{ textAlign: "center" }}>📊 Booking Dashboard</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "30px"
        }}
      >

        <thead>

          <tr style={{ background: "#222", color: "#fff" }}>

            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Package</th>
            <th>Travellers</th>
            <th>Travel Date</th>
            <th>Status</th>
            <th>Amount</th>

          </tr>

        </thead>

        <tbody>

          {bookings.map((b) => {

            const travellers =
              b.travellers?.map(t => `${t.name} (${t.age})`).join(", ") || "-";

            return (

              <tr key={b.id} style={{ borderBottom: "1px solid #ddd" }}>

                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.package_name}</td>
                <td>{travellers}</td>
                <td>{b.travel_date}</td>
                <td>{b.status}</td>
                <td>₹{b.amount}</td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );

}

export default AdminBookings;