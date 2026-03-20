import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaWandMagicSparkles,
  FaLocationDot,
  FaCalendarDays,
  FaUsers,
  FaIndianRupeeSign,
  FaHotel,
  FaPlane,
  FaCar,
  FaPassport,
  FaArrowRight,
} from "react-icons/fa6";

import PageWrapper from "../components/PageWrapper";
import { useCart } from "../context/CartContext";
import "./CustomPackage.css";

/* 🔒 FIXED ADVANCE */
const ADVANCE_AMOUNT = 1000;

/* DATA */
const COUNTRY_CITY_DATA = {
  Thailand: ["Bangkok", "Phuket", "Pattaya"],
  Bali: ["Ubud", "Kuta", "Seminyak"],
  Dubai: ["Dubai City", "Abu Dhabi"],
  Singapore: ["Sentosa", "Marina Bay"],
  India: ["Goa", "Manali", "Jaipur", "Kerala"],
};

const SIGHTSEEING_DATA = {
  Bangkok: ["Temple Tour", "Floating Market", "City Cruise"],
  Phuket: ["Island Hopping", "Phi Phi Tour", "Sunset Cruise"],
  Pattaya: ["Coral Island", "Alcazar Show"],
  Ubud: ["Rice Terraces", "Bali Swing", "Monkey Forest"],
  Kuta: ["Beach Time", "Water Sports"],
  Seminyak: ["Beach Clubs", "Shopping"],
  "Dubai City": ["Burj Khalifa", "Dubai Mall", "City Tour"],
  "Abu Dhabi": ["Ferrari World", "Grand Mosque"],
  Sentosa: ["Universal Studios", "Cable Car"],
  "Marina Bay": ["Gardens by the Bay", "SkyPark"],
  Goa: ["North Goa", "South Goa", "Beach Day"],
  Manali: ["Solang Valley", "Local sightseeing"],
  Jaipur: ["Amer Fort", "City Palace"],
  Kerala: ["Backwaters", "Tea estates"],
};

function nightsBetween(a, b) {
  if (!a || !b) return null;
  const start = new Date(a);
  const end = new Date(b);
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

function CustomPackage() {
  const nav = useNavigate();
  const { addToCart } = useCart();

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sightseeing, setSightseeing] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [budget, setBudget] = useState(60000);

  const tripNights = useMemo(
    () => nightsBetween(startDate, endDate),
    [startDate, endDate]
  );

  const isReady = country && city && startDate && endDate;

  const cityOptions = country ? COUNTRY_CITY_DATA[country] || [] : [];
  const sightseeingOptions = city ? SIGHTSEEING_DATA[city] || [] : [];

  /* ✅ FIXED ADD TO CART */
  function addPlanToCart() {
    const item = {
      id: `custom-${Date.now()}`,
      name: `Custom Trip • ${country} • ${city}`,

      // 🔥 CRITICAL FIX (NUMBER ONLY)
      price: Number(budget),

      image: null,
      advance: ADVANCE_AMOUNT,

      meta: {
        country,
        city,
        sightseeing,
        startDate,
        endDate,
        travellers: adults + children,
        nights: tripNights,
      },
    };

    console.log("🟢 Adding to cart:", item); // DEBUG

    addToCart(item);

    nav("/cart");
  }

  return (
    <PageWrapper>
      <div className="ctp">
        <section className="ctp-hero">
          <h1>Build Your Custom Trip</h1>
        </section>

        <div className="container ctp-layout">
          <div className="ctp-main">
            {/* COUNTRY */}
            <div className="ctp-card">
              <h3>Select Country</h3>
              {Object.keys(COUNTRY_CITY_DATA).map((c) => (
                <button key={c} onClick={() => {
                  setCountry(c);
                  setCity("");
                }}>
                  {c}
                </button>
              ))}
            </div>

            {/* CITY */}
            {country && (
              <div className="ctp-card">
                <h3>Select City</h3>
                {cityOptions.map((c) => (
                  <button key={c} onClick={() => setCity(c)}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* SIGHTSEEING */}
            {city && (
              <div className="ctp-card">
                <h3>Sightseeing</h3>
                {sightseeingOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSightseeing((prev) =>
                        prev.includes(s)
                          ? prev.filter((x) => x !== s)
                          : [...prev, s]
                      )
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* DATES */}
            <div className="ctp-card">
              <h3>Dates</h3>
              <input type="date" onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {/* BUDGET */}
            <div className="ctp-card">
              <h3>Budget</h3>
              <input
                type="range"
                min={10000}
                max={300000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <p>₹{budget}</p>
            </div>

            {/* CTA */}
            <button
              onClick={addPlanToCart}
              disabled={!isReady}
              className="btn btn-primary"
            >
              Add to Cart <FaArrowRight />
            </button>
          </div>

          {/* SUMMARY */}
          <div className="ctp-side">
            <h3>Summary</h3>

            <p>{country} - {city}</p>
            <p>{tripNights} nights</p>
            <p>₹{budget}</p>

            <hr />

            <p><strong>Advance:</strong> ₹1000</p>
            <p style={{ fontSize: "0.8rem" }}>
              ₹1000 will be adjusted in final payment
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default CustomPackage;