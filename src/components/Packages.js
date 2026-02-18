import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMagnifyingGlass, FaGlobe, FaLocationDot, FaClock } from "react-icons/fa6";

import { packages, formatINR } from "../data/packages";
import { useCart } from "../context/CartContext";
import "./Packages.css";

function Packages() {
  const nav = useNavigate();
  const { addToCart } = useCart();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const normalized = q.trim().toLowerCase();

    let list = packages.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const hay = `${p.title} ${p.destination} ${p.country}`.toLowerCase();
      const matchesQ = !normalized || hay.includes(normalized);
      return matchesCategory && matchesQ;
    });

    if (sort === "priceLow") list = [...list].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    if (sort === "priceHigh") list = [...list].sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [q, category, sort]);

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
              <h1 className="packages-title">Packages that feel premium</h1>
              <p className="packages-sub">
                Transparent inclusions, clean itineraries, and a smooth “Book & Pay” checkout.
                Pick a destination—or use search and filters.
              </p>
            </div>

            <Link to="/custom-package" className="btn btn-primary">
              Plan a Custom Trip
            </Link>
          </div>

          <div className="packages-controls">
            <div className="control">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <FaMagnifyingGlass color="#64748b" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search destination (Dubai, Bali, Goa…)"
                />
              </div>
            </div>

            <div className="control">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All</option>
                <option value="international">International</option>
                <option value="domestic">Domestic</option>
              </select>
            </div>

            <div className="control">
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
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              className="pkg-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.45, ease: "easeOut" }}
              onClick={(e) => {
                // If user clicks a button/link inside the card, don't override.
                const interactive = e.target.closest("a, button");
                if (interactive) return;
                nav(`/packages/${p.id}`);
              }}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") nav(`/packages/${p.id}`);
              }}
            >
              {/* Clickable hero area */}
              <Link to={`/packages/${p.id}`} aria-label={`Open ${p.title}`}>
                <img className="pkg-img" src={p.image} alt={p.title} />
              </Link>

              <div className="pkg-body">
                <div className="pkg-meta">
                  <span className="pkg-chip">
                    <FaLocationDot /> {p.destination}
                  </span>
                  <span className="pkg-chip muted">
                    <FaGlobe /> {p.country}
                  </span>
                  <span className="pkg-chip muted">
                    <FaClock /> {p.duration.nights}N/{p.duration.days}D
                  </span>
                </div>

                <div>
                  <div className="pkg-name">{p.title}</div>
                  <div className="pkg-desc">
                    {p.highlights.slice(0, 2).join(" • ")}
                  </div>
                </div>

                <div className="pkg-footer">
                  <div className="pkg-price">
                    {formatINR(p.pricePerPerson)}
                    <small>per person • advance {p.advancePercent}%</small>
                  </div>

                  <div className="pkg-actions">
                    <Link to={`/packages/${p.id}`} className="btn btn-ghost">
                      View details
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        // Add to cart and take user to cart to finalize later
                        addToCart({
                          id: p.id,
                          name: p.title,
                          price: formatINR(p.pricePerPerson),
                          duration: `${p.duration.nights} Nights`,
                          image: p.image,
                        });
                        nav("/cart");
                      }}
                    >
                      Pay advance
                    </button>
                  </div>
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

export default Packages;
