import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMagnifyingGlass,
  FaLocationDot,
  FaStar,
  FaBed,
  FaCheck,
} from "react-icons/fa6";

import { hotels, formatINR } from "../data/hotels";
import { useCart } from "../context/CartContext";

// Reuse Packages portal styling for consistency
import "./Packages.css";

function HotelsList() {
  const nav = useNavigate();
  const { addToCart } = useCart();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    let list = hotels.filter((h) => {
      const hay = `${h.name} ${h.city} ${h.country}`.toLowerCase();
      return !normalized || hay.includes(normalized);
    });

    if (sort === "priceLow") list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "priceHigh") list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [q, sort]);

  return (
    <div className="packages-page">
      <div className="container">
        <motion.div
          className="packages-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="packages-hero-top">
            <div>
              <h1 className="packages-title">Hotels you’ll love</h1>
              <p className="packages-sub">
                Clean listings, transparent pricing and a smooth “Reserve & Pay Advance” flow.
              </p>
            </div>
            <Link to="/custom-package" className="btn btn-primary">
              Plan a Trip
            </Link>
          </div>

          <div className="packages-controls">
            <div className="control">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <FaMagnifyingGlass color="#64748b" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search city or hotel (Goa, Dubai…)"
                />
              </div>
            </div>

            <div className="control" style={{ gridColumn: "2 / span 2" }}>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="priceLow">Price: low → high</option>
                <option value="priceHigh">Price: high → low</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="packages-grid">
          {filtered.map((h, i) => (
            <motion.article
              key={h.id}
              className="pkg-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.45, ease: "easeOut" }}
              onClick={(e) => {
                const interactive = e.target.closest("a, button");
                if (interactive) return;
                nav(`/hotels/${h.id}`);
              }}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") nav(`/hotels/${h.id}`);
              }}
            >
              <Link to={`/hotels/${h.id}`} aria-label={`Open ${h.name}`}>
                <img className="pkg-img" src={h.image} alt={h.name} />
              </Link>

              <div className="pkg-body">
                <div className="pkg-meta">
                  <span className="pkg-chip">
                    <FaLocationDot /> {h.city}
                  </span>
                  <span className="pkg-chip muted">
                    <FaStar /> {h.rating}
                  </span>
                  <span className="pkg-chip muted">
                    <FaBed /> {h.country}
                  </span>
                </div>

                <div>
                  <div className="pkg-name">{h.name}</div>
                  <div className="pkg-desc">{h.description}</div>
                </div>

                <div className="pkg-footer">
                  <div className="pkg-price">
                    {formatINR(h.pricePerNight)}
                    <small>per night • advance {h.advancePercent}%</small>
                  </div>

                  <div className="pkg-actions">
                    <Link to={`/hotels/${h.id}`} className="btn btn-ghost">
                      View details
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        addToCart({
                          id: h.id,
                          name: h.name,
                          price: formatINR(h.pricePerNight),
                          image: h.image,
                        });
                        nav("/cart");
                      }}
                    >
                      Pay advance
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {h.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="pkg-chip muted">
                      <FaCheck /> {a}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="container" style={{ marginTop: 18 }}>
            <p className="lead">No results. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelsList;
