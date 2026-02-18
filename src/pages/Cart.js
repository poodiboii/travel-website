import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

/* 🔒 SINGLE SOURCE OF TRUTH */
const ADVANCE_AMOUNT = 1000; // ₹1000 flat advance for ALL payments

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [showBreakdown, setShowBreakdown] = useState({});

  const mockPaymentsEnabled = useMemo(() => {
    const mode = (process.env.REACT_APP_PAYMENT_MODE || "").toLowerCase();
    if (mode === "live") return false;
    if (mode === "mock") return true;
    return process.env.NODE_ENV !== "production";
  }, []);

  const [showDetails, setShowDetails] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [travellerCount, setTravellerCount] = useState(1);
  const [travellers, setTravellers] = useState([{ name: "", age: "" }]);

  /* ✅ FIXED ADVANCE (NOT DEPENDENT ON CART VALUE) */
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
    travellers.every(
      (t) => t.name.trim() !== "" && t.age.trim() !== ""
    );

  const handleCheckout = () => setShowDetails(true);

  /* 🧪 MOCK PAYMENT */
  const handleMockPayment = (status) => {
    if (!isFormValid) return;

    const orderId = `MOCK_${Date.now()}`;
    setShowDetails(false);

    if (status === "success") clearCart();

    const path = status === "success" ? "/payment-success" : "/payment-failed";
    navigate(
      `${path}?mock=1&order_id=${orderId}&amount=${ADVANCE_AMOUNT}`
    );
  };

  /* 💳 CC AVENUE PAYMENT */
  const handleFinalPayment = async () => {
    if (!isFormValid) return;

    if (mockPaymentsEnabled) {
      handleMockPayment("success");
      return;
    }

    const payload = {
      order_id: `ORDER_${Date.now()}`,
      amount: ADVANCE_AMOUNT.toFixed(2), // 🔥 ALWAYS 1000
      billing_name: travellers[0]?.name || "Guest",
      billing_email: "guest@example.com",
      billing_tel: "9999999999",
    };

    try {
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.encRequest || !data.accessCode) {
        alert("Payment initialization failed");
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
      console.error("Payment Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  /* EMPTY CART */
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
          const numericPrice = Number(item.price.replace(/[^0-9]/g, ""));

          return (
            <div key={item.id} className="cart-row">
              <div className="cart-package">
                <img src={item.image} alt={item.name} />
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
                  <p><strong>Balance:</strong> ₹{numericPrice - 1000}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <p><strong>Advance Payable Now:</strong> ₹1000</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          ₹1000 is an adjustable advance. Balance payable later.
        </p>
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
            <button className="close-btn" onClick={() => setShowDetails(false)}>
              ✕
            </button>

            <h2>Traveller Details</h2>

            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
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
              {mockPaymentsEnabled
                ? "Confirm (Mock Payment)"
                : "Confirm & Pay ₹1000"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
