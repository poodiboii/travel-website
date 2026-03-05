import React, { useEffect, useState } from "react";
import "./AdminBookings.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/bookings`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="admin-loading">Loading bookings...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-table">
        <div className="admin-header">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Amount</span>
          <span>Date</span>
        </div>

        {bookings.length === 0 && (
          <div className="admin-empty">No bookings yet.</div>
        )}

        {bookings.map((b, index) => (
          <div key={index} className="admin-row">
            <span>{b.name || "-"}</span>
            <span>{b.email || "-"}</span>
            <span>{b.phone || "-"}</span>
            <span>₹{b.amount || "-"}</span>
            <span>
              {b.createdAt
                ? new Date(b.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBookings;
