import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck, FaShieldHeart, FaArrowRight, FaClock } from "react-icons/fa6";

import { getPackageById, formatINR } from "../data/packages";
import { useCart } from "../context/CartContext";
import "./PackageDetailsPage.css";

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PackageDetailsPage() {
  const { packageId } = useParams();
  const pkg = getPackageById(packageId);

  const nav = useNavigate();
  const { addToCart } = useCart();

  const [travellers, setTravellers] = useState(2);

  const pricing = useMemo(() => {
    if (!pkg) return null;
    const total = pkg.pricePerPerson * travellers;
    const advance = Math.round((total * (pkg.advancePercent || 20)) / 100);
    return { total, advance };
  }, [pkg, travellers]);

  const addThisToCart = () => {
    if (!pkg || !pricing) return;

    // Use a travellers-specific id so changing travellers creates a distinct cart item.
    const itemId = `pkg-${pkg.id}-t${travellers}`;

    addToCart({
      id: itemId,
      name: `${pkg.title} • ${travellers} traveller${travellers > 1 ? "s" : ""}`,
      price: formatINR(pricing.total),
      duration: `${pkg.duration.nights} Nights`,
      image: pkg.image,
      meta: {
        kind: "package",
        baseId: pkg.id,
        travellers,
        pricePerPerson: pkg.pricePerPerson,
        advancePercent: pkg.advancePercent,
        advance: pricing.advance,
        total: pricing.total,
      },
    });

    nav("/cart");
  };

  if (!pkg) return <p style={{ padding: "100px 10%" }}>Package not found.</p>;

  return (
    <div className="pkg-details">
      {/* HERO */}
      <div className="pkg-hero" style={{ backgroundImage: `url(${pkg.image})` }}>
        <div className="pkg-hero-overlay" />
        <div className="container pkg-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="pkg-hero-badges">
              <span className="pill"><FaClock /> {pkg.duration.nights}N/{pkg.duration.days}D</span>
              <span className="pill">{pkg.destination}</span>
              <span className="pill">{pkg.country}</span>
            </div>
            <h1 className="pkg-hero-title">{pkg.title}</h1>
            <p className="pkg-hero-sub">
              Curated itinerary, transparent inclusions and secure online advance payment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sticky section nav */}
      <div className="pkg-nav">
        <div className="container pkg-nav-inner">
          <button onClick={() => scrollToId("highlights")}>Highlights</button>
          <button onClick={() => scrollToId("itinerary")}>Itinerary</button>
          <button onClick={() => scrollToId("inclusions")}>Inclusions</button>
          <button onClick={() => scrollToId("policies")}>Policies</button>
          <button className="pkg-nav-cta" type="button" onClick={addThisToCart}>
            Pay advance <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="container pkg-layout">
        {/* Main */}
        <div className="pkg-main">
          <section id="highlights" className="pkg-section">
            <h2 className="h2">Highlights</h2>
            <div className="grid-2">
              {pkg.highlights.map((h) => (
                <div key={h} className="card">
                  <div className="check"><FaCheck /></div>
                  <div>{h}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="itinerary" className="pkg-section">
            <h2 className="h2">Day-wise itinerary</h2>
            <div className="timeline">
              {pkg.itinerary.map((d) => (
                <div key={d.day} className="timeline-row">
                  <div className="timeline-day">Day {d.day}</div>
                  <div className="timeline-card">
                    <div className="timeline-title">{d.title}</div>
                    <div className="timeline-desc">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="inclusions" className="pkg-section">
            <div className="grid-2">
              <div className="box">
                <h3 className="h3">Inclusions</h3>
                <ul className="list">
                  {pkg.inclusions.map((x) => (
                    <li key={x}><FaCheck /> {x}</li>
                  ))}
                </ul>
              </div>

              <div className="box">
                <h3 className="h3">Exclusions</h3>
                <ul className="list muted">
                  {pkg.exclusions.map((x) => (
                    <li key={x}><FaCheck /> {x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="policies" className="pkg-section">
            <h2 className="h2">Policies & notes</h2>
            <div className="box">
              <ul className="list">
                {pkg.policies?.map((p) => (
                  <li key={p}><FaShieldHeart /> {p}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="pkg-side">
          <div className="side-card">
            <div className="side-price">
              <div>
                <div className="side-price-main">{formatINR(pkg.pricePerPerson)}</div>
                <div className="side-price-sub">per person</div>
              </div>
              <div className="pill">Advance {pkg.advancePercent}%</div>
            </div>

            <div className="side-field">
              <label>Travellers</label>
              <div className="qty">
                <button onClick={() => setTravellers((t) => Math.max(1, t - 1))}>−</button>
                <span>{travellers}</span>
                <button onClick={() => setTravellers((t) => Math.min(12, t + 1))}>+</button>
              </div>
            </div>

            <div className="side-summary">
              <div className="row"><span>Total</span><strong>{formatINR(pricing.total)}</strong></div>
              <div className="row"><span>Advance payable</span><strong>{formatINR(pricing.advance)}</strong></div>
            </div>

            <button className="btn btn-primary" type="button" onClick={addThisToCart}>
              Pay advance & book
            </button>
            <Link className="btn btn-ghost" to="/packages">Back to packages</Link>

            <p className="side-note">
              You can pay advance online to lock your booking. Remaining amount can be paid later.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PackageDetailsPage;
