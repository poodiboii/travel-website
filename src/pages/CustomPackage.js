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
  FaPassport,
  FaBowlFood,
  FaStar,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa6";

import PageWrapper from "../components/PageWrapper";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import "./CustomPackage.css";


/* -----------------------------
   Data (extend anytime)
------------------------------ */
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
  Manali: ["Solang Valley", "Local sightseeing", "Cafe hopping"],
  Jaipur: ["Amer Fort", "City Palace", "Markets"],
  Kerala: ["Backwaters", "Tea estates", "Beaches"],
};

const TRAVEL_STYLE = [
  "Luxury",
  "Honeymoon",
  "Family",
  "Friends",
  "Adventure",
  "Relaxation",
  "Workcation",
];

const INTERESTS = [
  "Beaches",
  "Nature",
  "Shopping",
  "Food",
  "Theme Parks",
  "Nightlife",
  "Culture",
  "Photography",
  "Wildlife",
];

const HOTEL_RATING = [
  { label: "3★", value: 3 },
  { label: "4★", value: 4 },
  { label: "5★", value: 5 },
];

const MEAL_PLANS = ["Room only", "Breakfast", "Half board", "Full board"];

/* -----------------------------
   Helpers
------------------------------ */
function toggleFrom(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function nightsBetween(a, b) {
  if (!a || !b) return null;
  const start = new Date(a);
  const end = new Date(b);
  const ms = end - start;
  if (!Number.isFinite(ms)) return null;
  const nights = Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  return nights;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function CustomPackage() {
  const nav = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Destination
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sightseeing, setSightseeing] = useState([]);

  // Dates + travellers
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Preferences
  const [styles, setStyles] = useState([]);
  const [interests, setInterests] = useState([]);
  const [hotelStars, setHotelStars] = useState(4);
  const [mealPlan, setMealPlan] = useState("Breakfast");

  // Services
  const [needFlights, setNeedFlights] = useState(true);
  const [needHotel, setNeedHotel] = useState(true);
  const [needVisa, setNeedVisa] = useState(false);
  const [needCab, setNeedCab] = useState(true);

  const [budget, setBudget] = useState(60000);


  // Advance (fixed)
  const advanceAmount = 1000;

  // Contact (for later wiring)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const tripNights = useMemo(() => nightsBetween(startDate, endDate), [startDate, endDate]);
  const travellers = adults + children;

  const cityOptions = country ? COUNTRY_CITY_DATA[country] || [] : [];
  const sightseeingOptions = city ? SIGHTSEEING_DATA[city] || [] : [];

  const isReady = Boolean(country && city && startDate && endDate && adults >= 1);

  const summary = useMemo(() => {
    return {
      destination: [country, city].filter(Boolean).join(" • ") || "—",
      dates: startDate && endDate ? `${formatDate(startDate)} → ${formatDate(endDate)}` : "—",
      duration: tripNights != null ? `${tripNights} nights` : "—",
      travellers: `${adults} adult${adults > 1 ? "s" : ""}${children ? `, ${children} child` : ""}`,
      hotel: needHotel ? `${hotelStars}★ • ${mealPlan}` : "Not included",
      visa: needVisa ? "Included" : "Not included",
      flights: needFlights ? "Included" : "Not included",
      styles: styles.length ? styles.join(", ") : "—",
      interests: interests.length ? interests.slice(0, 4).join(", ") : "—",
      sights: sightseeing.length ? sightseeing.join(", ") : "—",
      advance: `₹${advanceAmount.toLocaleString("en-IN")}`,
    };
  }, [
    country,
    city,
    startDate,
    endDate,
    tripNights,
    adults,
    children,
    hotelStars,
    mealPlan,
    needHotel,
    needVisa,
    needFlights,
    styles,
    interests,
    sightseeing,
    advanceAmount,
  ]);

  function resetDestination(nextCountry) {
    setCountry(nextCountry);
    setCity("");
    setSightseeing([]);
  }

  async function addPlanToCart() {
  if (loading) return; // 🚫 prevent double click

  setLoading(true);

  try {
    const { error } = await supabase.from("custom_packages").insert([
      {
        country,
        city,
        sightseeing,
        start_date: startDate,
        end_date: endDate,
        adults,
        children,
        hotel_stars: hotelStars,
        meal_plan: mealPlan,
        need_flights: needFlights,
        need_hotel: needHotel,
        need_visa: needVisa,
        need_cab: needCab,
        budget,
        name,
        phone,
        email,
        notes,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to save");
      setLoading(false);
      return;
    }

    addToCart({
      id: `custom-${Date.now()}`,
      name: `Custom Trip • ${country} • ${city}`,
      price: budget,
      advance: 1000,
      meta: summary,
    });

    nav("/cart");
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
    setLoading(false);
  }

}

  return (
    <PageWrapper>
      <div className="ctp">
        {/* Hero */}
        <section className="ctp-hero">
          <div className="ctp-hero-bg" aria-hidden />
          <div className="container ctp-hero-inner">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div className="ctp-kicker" variants={fadeUp}>
                <span className="ctp-kicker-pill">
                  <FaWandMagicSparkles /> Custom Trip Planner
                </span>
              </motion.div>
              <motion.h1 className="ctp-title" variants={fadeUp}>
                Design a trip that feels <span className="ctp-accent">tailor‑made</span>.
              </motion.h1>
              <motion.p className="ctp-sub" variants={fadeUp}>
                Select destination, dates, travellers and preferences. We'll turn it into a clean itinerary
                with transparent pricing and a smooth booking flow.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="section">
          <div className="container ctp-layout">
            {/* Main builder */}
            <motion.div
              className="ctp-main"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
            >
              {/* Step: Destination */}
              <motion.div className="ctp-card" variants={fadeUp}>
                <div className="ctp-card-head">
                  <div className="ctp-step">01</div>
                  <div>
                    <h2 className="ctp-h2">
                      <FaLocationDot /> Destination
                    </h2>
                    <p className="ctp-p">Pick a country and city, then choose sightseeing.</p>
                  </div>
                </div>

                <div className="ctp-grid2">
                  <div>
                    <div className="ctp-label">Country</div>
                    <div className="chip-grid">
                      {Object.keys(COUNTRY_CITY_DATA).map((c) => (
                        <button
                          type="button"
                          key={c}
                          className={`chip ${country === c ? "active" : ""}`}
                          onClick={() => resetDestination(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="ctp-label">City</div>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={country || "empty"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="chip-grid"
                      >
                        {country ? (
                          cityOptions.map((c) => (
                            <button
                              type="button"
                              key={c}
                              className={`chip ${city === c ? "active" : ""}`}
                              onClick={() => {
                                setCity(c);
                                setSightseeing([]);
                              }}
                            >
                              {c}
                            </button>
                          ))
                        ) : (
                          <div className="muted">Select a country first.</div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="ctp-label">Sightseeing</div>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={city || "empty"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="chip-grid"
                    >
                      {city ? (
                        sightseeingOptions.map((s) => (
                          <button
                            type="button"
                            key={s}
                            className={`chip ${sightseeing.includes(s) ? "active" : ""}`}
                            onClick={() => setSightseeing((prev) => toggleFrom(prev, s))}
                          >
                            {s}
                          </button>
                        ))
                      ) : (
                        <div className="muted">Select a city to see experiences.</div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Step: Dates & Travellers */}
              <motion.div className="ctp-card" variants={fadeUp}>
                <div className="ctp-card-head">
                  <div className="ctp-step">02</div>
                  <div>
                    <h2 className="ctp-h2">
                      <FaCalendarDays /> Dates & Travellers
                    </h2>
                    <p className="ctp-p">Set dates and traveller count for accurate planning.</p>
                  </div>
                </div>

                <div className="ctp-grid2">
                  <div className="field">
                    <div className="ctp-label">Start date</div>
                    <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="field">
                    <div className="ctp-label">End date</div>
                    <input className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div className="ctp-grid2" style={{ marginTop: 12 }}>
                  <div>
                    <div className="ctp-label">
                      <FaUsers /> Adults
                    </div>
                    <div className="qty">
                      <button type="button" onClick={() => setAdults((v) => Math.max(1, v - 1))}>
                        −
                      </button>
                      <span>{adults}</span>
                      <button type="button" onClick={() => setAdults((v) => Math.min(12, v + 1))}>
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="ctp-label">Children</div>
                    <div className="qty">
                      <button type="button" onClick={() => setChildren((v) => Math.max(0, v - 1))}>
                        −
                      </button>
                      <span>{children}</span>
                      <button type="button" onClick={() => setChildren((v) => Math.min(12, v + 1))}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="muted" style={{ marginTop: 10 }}>
                  {tripNights != null ? `Estimated duration: ${tripNights} nights` : "Select dates to calculate trip length."}
                </div>
              </motion.div>

              {/* Step: Preferences */}
              <motion.div className="ctp-card" variants={fadeUp}>
                <div className="ctp-card-head">
                  <div className="ctp-step">03</div>
                  <div>
                    <h2 className="ctp-h2">
                      <FaStar /> Preferences
                    </h2>
                    <p className="ctp-p">Tell us the vibe and what you enjoy.</p>
                  </div>
                </div>

                <div>
                  <div className="ctp-label">Travel style</div>
                  <div className="chip-grid">
                    {TRAVEL_STYLE.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`chip ${styles.includes(s) ? "active" : ""}`}
                        onClick={() => setStyles((prev) => toggleFrom(prev, s))}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="ctp-label">Interests</div>
                  <div className="chip-grid">
                    {INTERESTS.map((x) => (
                      <button
                        type="button"
                        key={x}
                        className={`chip ${interests.includes(x) ? "active" : ""}`}
                        onClick={() => setInterests((prev) => toggleFrom(prev, x))}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Step: Services & Advance */}
              <motion.div className="ctp-card" variants={fadeUp}>
                <div className="ctp-card-head">
                  <div className="ctp-step">04</div>
                  <div>
                    <h2 className="ctp-h2">
                      <FaIndianRupeeSign /> Services & Advance
                    </h2>
                    <p className="ctp-p">Select what you want included.</p>
                  </div>
                </div>

                <div className="service-grid">
                  <button type="button" className={`service ${needFlights ? "on" : ""}`} onClick={() => setNeedFlights((v) => !v)}>
                    <FaPlane /> Flights
                  </button>
                  <button type="button" className={`service ${needHotel ? "on" : ""}`} onClick={() => setNeedHotel((v) => !v)}>
                    <FaHotel /> Hotels
                  </button>
                  <button type="button" className={`service ${needVisa ? "on" : ""}`} onClick={() => setNeedVisa((v) => !v)}>
                    <FaPassport /> Visa
                  </button>
                </div>

                <div className="ctp-grid2" style={{ marginTop: 12 }}>
                  <div>
                    <div className="ctp-label">Hotel category</div>
                    <div className="chip-grid">
                      {HOTEL_RATING.map((s) => (
                        <button
                          type="button"
                          key={s.value}
                          className={`chip ${hotelStars === s.value ? "active" : ""}`}
                          onClick={() => setHotelStars(s.value)}
                          disabled={!needHotel}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="ctp-label">Meal plan</div>
                    <div className="chip-grid">
                      {MEAL_PLANS.map((m) => (
                        <button
                          type="button"
                          key={m}
                          className={`chip ${mealPlan === m ? "active" : ""}`}
                          onClick={() => setMealPlan(m)}
                          disabled={!needHotel}
                        >
                          <FaBowlFood /> {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="advance-section" style={{ marginTop: 12 }}>
                  <div className="advance-top">
                    <div className="ctp-label">Advance payment (fixed)</div>
                    <div className="advance-value">₹1,000</div>
                  </div>
                  <div className="advance-note muted" style={{ fontSize: 14, marginTop: 8 }}>
                    * Advance will be adjusted in final payment
                  </div>
                </div>
              </motion.div>

              {/* Step: Contact (kept simple, not wired) */}
              <motion.div className="ctp-card" variants={fadeUp}>
                <div className="ctp-card-head">
                  <div className="ctp-step">05</div>
                  <div>
                    <h2 className="ctp-h2">Contact details</h2>
                    <p className="ctp-p">Optional for now—helps us reach you quickly.</p>
                  </div>
                </div>

                <div className="ctp-grid2">
                  <div className="field">
                    <div className="ctp-label">Name</div>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="field">
                    <div className="ctp-label">Phone</div>
                    <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
                  </div>
                </div>
                <div className="field" style={{ marginTop: 12 }}>
                  <div className="ctp-label">Email</div>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                </div>
                <div className="field" style={{ marginTop: 12 }}>
                  <div className="ctp-label">Notes / special requests</div>
                  <textarea className="input" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything specific? (rooms, occasions, pickup times…)" />
                </div>

                <div className="cta-row" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!isReady}
                    onClick={addPlanToCart}
                  >
                    Pay ₹1,000 advance <FaArrowRight />
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => nav("/packages")}>
                    Explore packages
                  </button>
                </div>

                {!isReady && (
                  <div className="muted" style={{ marginTop: 10 }}>
                    Select destination + dates to enable "Pay ₹1,000 advance".
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Summary side */}
            <aside className="ctp-side">
              <div className="side-card">
                <div className="side-title">Your trip summary</div>

                <div className="kv">
                  <span>Destination</span>
                  <strong>{summary.destination}</strong>
                </div>
                <div className="kv">
                  <span>Dates</span>
                  <strong>{summary.dates}</strong>
                </div>
                <div className="kv">
                  <span>Duration</span>
                  <strong>{summary.duration}</strong>
                </div>
                <div className="kv">
                  <span>Travellers</span>
                  <strong>{summary.travellers}</strong>
                </div>

                <div className="divider" />

                <div className="kv">
                  <span>Hotels</span>
                  <strong>{summary.hotel}</strong>
                </div>
                <div className="kv">
                  <span>Flights</span>
                  <strong>{summary.flights}</strong>
                </div>
                <div className="kv">
                  <span>Visa</span>
                  <strong>{summary.visa}</strong>
                </div>

                <div className="divider" />

                <div className="kv">
                  <span>Advance payment</span>
                  <strong>{summary.advance}</strong>
                </div>
                <div className="advance-note-side muted" style={{ fontSize: 12, marginTop: 4 }}>
                  * Will be adjusted in final payment
                </div>

                <div className="side-tags">
                  <div className="tag">
                    <FaCheck /> {summary.styles}
                  </div>
                  <div className="tag">
                    <FaCheck /> {summary.interests}
                  </div>
                  <div className="tag">
                    <FaCheck /> {summary.sights}
                  </div>
                </div>

                <div className="cta-row" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!isReady}
                    onClick={addPlanToCart}
                  >
                    Pay ₹1,000 advance <FaArrowRight />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setCountry("");
                      setCity("");
                      setSightseeing([]);
                      setStartDate("");
                      setEndDate("");
                      setAdults(2);
                      setChildren(0);
                      setStyles([]);
                      setInterests([]);
                      setHotelStars(4);
                      setMealPlan("Breakfast");
                      setNeedFlights(true);
                      setNeedHotel(true);
                      setNeedVisa(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setNotes("");
                    }}
                  >
                    Reset
                  </button>
                </div>

                <p className="side-note">
                  This is a planner. Next we'll connect it to a real quote engine and checkout flow.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default CustomPackage;