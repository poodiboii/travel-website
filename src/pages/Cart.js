import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const ADVANCE_AMOUNT = 1000;

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const [showBreakdown, setShowBreakdown] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  const [travelDate, setTravelDate] = useState("");
  const [travellerCount, setTravellerCount] = useState(1);
  const [travellers, setTravellers] = useState([{ name: "", age: "" }]);

  const [phoneNumber, setPhoneNumber] = useState("");

  const totalAdvance = cartItems.length > 0 ? ADVANCE_AMOUNT : 0;

  const toggleBreakdown = (id) => {
    setShowBreakdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTravellerCountChange = (count) => {
    setTravellerCount(count);
    setTravellers(
      Array.from({ length: count }, (_, i) => ({
        name: travellers[i]?.name || "",
        age: travellers[i]?.age || "",
      }))
    );
  };

  const handleTravellerChange = (index, field, value) => {
    const updated = [...travellers];
    updated[index][field] = value;
    setTravellers(updated);
  };

  const isFormValid =
    travelDate &&
    phoneNumber &&
    travellers.every((t) => t.name.trim() !== "" && t.age.trim() !== "");

  const handleCheckout = () => setShowDetails(true);

  /* FINAL CHECKOUT + SAVE BOOKING */
  const handleFinalPayment = async () => {
    if (!isFormValid) return;

    try {

      /* SAVE BOOKING FIRST */
      const bookingPayload = {
        name: travellers[0]?.name || "Guest",
        phone: phoneNumber,
        traveller_count: travellerCount,
        travellers: travellers,
        package_name: cartItems[0]?.name || "Custom Trip",
        travel_date: travelDate
      };

      console.log("Saving booking:", bookingPayload);

      await fetch(`${API_URL}/api/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingPayload)
      });

      /* START PAYMENT */
      const payload = {
        order_id: `ORDER_${Date.now()}`,
        amount: ADVANCE_AMOUNT.toFixed(2),
        billing_name: travellers[0]?.name || "Guest",
        billing_email: "guest@example.com",
        billing_tel: phoneNumber,
      };

      console.log("Sending payment request:", payload);

      const res = await fetch(`${API_URL}/api/initiate-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("Payment API response:", data);

      if (!data.encRequest || !data.accessCode) {
        alert("Payment initialization failed.");
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";

      form.action =
        data.gatewayUrl ||
        "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const encInput = document.createElement("input");
      encInput.type = "hidden";
      encInput.name = "encRequest";
      encInput.value = data.encRequest;

      const accessInput = document.createElement("input");
      accessInput.type = "hidden";
      accessInput.name = "access_code";
      accessInput.value = data.accessCode;

      form.appendChild(encInput);
      form.appendChild(accessInput);

      document.body.appendChild(form);

      form.submit();

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment service unavailable. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-box">
          <h2>Your cart is empty</h2>
          <p>Explore our curated packages and reserve your holiday.</p>
          <Link to="/packages" className="btn-checkout">
            Browse Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Reservation Cart</h2>

      <div className="cart-table">
        <div className="cart-header">
          <span>Package</span>
          <span>Advance</span>
          <span>Details</span>
          <span>Remove</span>
        </div>

        {cartItems.map((item) => {
          const numericPrice =
            typeof item.price === "number"
              ? item.price
              : Number((item.price || "").toString().replace(/[^0-9]/g, "")) || 0;

          const balance = Math.max(0, numericPrice - ADVANCE_AMOUNT);

          return (
            <div key={item.id} className="cart-row">
              <div className="cart-package">
                {item.image && <img src={item.image} alt={item.name} />}
                <span>{item.name}</span>
              </div>

              <span>₹{ADVANCE_AMOUNT}</span>

              <button
                className="btn-breakdown"
                onClick={() => toggleBreakdown(item.id)}
              >
                {showBreakdown[item.id] ? "Hide Breakdown" : "View Breakdown"}
              </button>

              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>

              {showBreakdown[item.id] && (
                <div className="payment-breakdown">
                  <p><strong>Full Price:</strong> ₹{numericPrice}</p>
                  <p><strong>Advance Payable Now:</strong> ₹1000</p>
                  <p><strong>Balance:</strong> ₹{balance}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <p><strong>Advance Payable Now:</strong> ₹1000</p>

        <button className="btn-checkout" onClick={handleCheckout}>
          Pay ₹1000 Advance
        </button>

        <button className="btn-clear" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      {showDetails && (
        <div className="modal-overlay">
          <div className="modal-card">

            <button
              className="close-btn"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>

            <h2>Traveller Details</h2>

            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />

            <input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <select
              value={travellerCount}
              onChange={(e) =>
                handleTravellerCountChange(Number(e.target.value))
              }
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            {travellers.map((t, i) => (
              <div key={i}>
                <input
                  placeholder="Name"
                  value={t.name}
                  onChange={(e) =>
                    handleTravellerChange(i, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Age"
                  value={t.age}
                  onChange={(e) =>
                    handleTravellerChange(i, "age", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              className="btn-checkout"
              onClick={handleFinalPayment}
              disabled={!isFormValid}
            >
              Confirm & Pay ₹1000
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;