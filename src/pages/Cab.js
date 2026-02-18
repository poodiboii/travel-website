import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMagnifyingGlass, FaCheck, FaArrowRight } from "react-icons/fa6";

import { cabCities, formatCabRate } from "../data/cabs";
import { useCart } from "../context/CartContext";
import "./Cab.css";

function Cab() {
  const nav = useNavigate();
  const { addToCart } = useCart();

  const [q, setQ] = useState("");
  const [service, setService] = useState("all");

  const services = useMemo(() => {
    const set = new Set();
    cabCities.forEach((c) => c.services.forEach((s) => set.add(s)));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    return cabCities.filter((c) => {
      const matchesQ = !normalized || c.city.toLowerCase().includes(normalized);
      const matchesService = service === "all" || c.services.includes(service);
      return matchesQ && matchesService;
    });
  }, [q, service]);

  return (
    <div className="cab">
      <div className="container">
        <motion.div
          className="cab-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="cab-title">Cab services</h1>
          <p className="cab-sub">
            Airport transfers, city rides and outstation journeys—book with a smooth advance payment flow.
          </p>

          <div className="cab-controls">
            <div className="control">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <FaMagnifyingGlass color="#64748b" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search city (Delhi, Goa, Jaipur…)"
                />
              </div>
            </div>

            <div className="control">
              <select value={service} onChange={(e) => setService(e.target.value)}>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All services" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="cab-grid">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              className="cab-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.45, ease: "easeOut" }}
            >
              <div className="cab-city">{c.city}</div>
              <div className="cab-rate">
                {formatCabRate(c)}
                <small>advance {c.advancePercent}%</small>
              </div>

              <div className="services">
                {c.services.map((s) => (
                  <span key={s} className="chip">
                    <FaCheck /> {s}
                  </span>
                ))}
              </div>

              <div className="actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    addToCart({
                      id: `cab-${c.id}`,
                      name: `Cab Service • ${c.city}`,
                      price: `₹${c.price}/${c.unit}`,
                      image: null,
                    });
                    nav("/cart");
                  }}
                >
                  Pay advance <FaArrowRight />
                </button>

                <button className="btn btn-ghost" type="button" onClick={() => nav("/contact")}>
                  Contact
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ marginTop: 18 }}>
            <p className="lead">No results. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cab;
