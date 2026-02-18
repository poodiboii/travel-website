import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck, FaStar, FaLocationDot, FaArrowRight } from "react-icons/fa6";

import { getHotelById, formatINR } from "../data/hotels";
import { useCart } from "../context/CartContext";

import "./PackageDetailsPage.css"; // reuse details styling

function HotelDetailsPage() {
  const { hotelId } = useParams();
  const hotel = getHotelById(hotelId);

  const nav = useNavigate();
  const { addToCart } = useCart();

  const [nights, setNights] = useState(2);

  const pricing = useMemo(() => {
    if (!hotel) return null;
    const total = hotel.pricePerNight * nights;
    const advance = Math.round((total * (hotel.advancePercent || 15)) / 100);
    return { total, advance };
  }, [hotel, nights]);

  if (!hotel) return <p style={{ padding: "100px 10%" }}>Hotel not found.</p>;

  return (
    <div className="pkg-details">
      <div className="pkg-hero" style={{ backgroundImage: `url(${hotel.image})` }}>
        <div className="pkg-hero-overlay" />
        <div className="container pkg-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="pkg-hero-badges">
              <span className="pill">
                <FaLocationDot /> {hotel.city}
              </span>
              <span className="pill">{hotel.country}</span>
              <span className="pill">
                <FaStar /> {hotel.rating}
              </span>
            </div>
            <h1 className="pkg-hero-title">{hotel.name}</h1>
            <p className="pkg-hero-sub">{hotel.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="pkg-nav">
        <div className="container pkg-nav-inner">
          <button onClick={() => document.getElementById("amenities")?.scrollIntoView({ behavior: "smooth" })}>
            Amenities
          </button>
          <button onClick={() => document.getElementById("policies")?.scrollIntoView({ behavior: "smooth" })}>
            Policies
          </button>

          <button
            className="pkg-nav-cta"
            onClick={() => {
              addToCart({ id: hotel.id, name: hotel.name, price: formatINR(hotel.pricePerNight), image: hotel.image });
              nav("/cart");
            }}
          >
            Pay advance <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="container pkg-layout">
        <div className="pkg-main">
          <section id="amenities" className="pkg-section">
            <h2 className="h2">Amenities</h2>
            <div className="grid-2">
              {hotel.amenities.map((a) => (
                <div key={a} className="card">
                  <div className="check">
                    <FaCheck />
                  </div>
                  <div>{a}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="policies" className="pkg-section">
            <h2 className="h2">Policies & notes</h2>
            <div className="box">
              <ul className="list">
                {hotel.policies?.map((p) => (
                  <li key={p}>
                    <FaCheck /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="pkg-side">
          <div className="side-card">
            <div className="side-price">
              <div>
                <div className="side-price-main">{formatINR(hotel.pricePerNight)}</div>
                <div className="side-price-sub">per night</div>
              </div>
              <div className="pill">Advance {hotel.advancePercent}%</div>
            </div>

            <div className="side-field">
              <label>Nights</label>
              <div className="qty">
                <button onClick={() => setNights((n) => Math.max(1, n - 1))}>−</button>
                <span>{nights}</span>
                <button onClick={() => setNights((n) => Math.min(30, n + 1))}>+</button>
              </div>
            </div>

            <div className="side-summary">
              <div className="row">
                <span>Total</span>
                <strong>{formatINR(pricing.total)}</strong>
              </div>
              <div className="row">
                <span>Advance payable</span>
                <strong>{formatINR(pricing.advance)}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                addToCart({ id: hotel.id, name: hotel.name, price: formatINR(hotel.pricePerNight), image: hotel.image });
                nav("/cart");
              }}
            >
              Pay advance & reserve
            </button>
            <Link className="btn btn-ghost" to="/hotels">
              Back to hotels
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default HotelDetailsPage;
