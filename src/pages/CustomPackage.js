import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomPackage.css";

/* DATA */
const COUNTRY_CITY_DATA = {
  Thailand: ["Bangkok", "Phuket", "Pattaya"],
  Bali: ["Ubud", "Kuta", "Seminyak"],
  Dubai: ["Dubai City", "Abu Dhabi"],
  Singapore: ["Sentosa", "Marina Bay"],
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
};

function CustomPackage() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sightseeing, setSightseeing] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showItinerary, setShowItinerary] = useState(false);

  const toggleSightseeing = (place) => {
    setSightseeing((prev) =>
      prev.includes(place)
        ? prev.filter((p) => p !== place)
        : [...prev, place]
    );
  };

  return (
    <section className="custom-page">
      {/* HERO */}
      <div className="custom-hero">
        <h1>Design Your Custom Holiday</h1>
        <p>Choose your destination, experiences & travel dates</p>
      </div>

      {/* BUILDER — 3 COLUMNS */}
      <div className="custom-builder three-column">
        {/* COLUMN 1 — COUNTRY */}
        <div className="glass-card">
          <h3>Select Country</h3>
          <div className="option-grid">
            {Object.keys(COUNTRY_CITY_DATA).map((c) => (
              <button
                key={c}
                className={`option-tile ${country === c ? "active" : ""}`}
                onClick={() => {
                  setCountry(c);
                  setCity("");
                  setSightseeing([]);
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* COLUMN 2 — CITY */}
        <AnimatePresence>
          {country && (
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3>Select City</h3>
              <div className="option-grid">
                {COUNTRY_CITY_DATA[country].map((c) => (
                  <button
                    key={c}
                    className={`option-tile ${city === c ? "active" : ""}`}
                    onClick={() => {
                      setCity(c);
                      setSightseeing([]);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLUMN 3 — SIGHTSEEING */}
        <AnimatePresence>
          {city && (
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3>Select Sightseeing</h3>
              <div className="option-grid">
                {(SIGHTSEEING_DATA[city] || []).map((s) => (
                  <button
                    key={s}
                    className={`option-tile ${
                      sightseeing.includes(s) ? "active" : ""
                    }`}
                    onClick={() => toggleSightseeing(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TRAVEL DATES */}
      <motion.div
        className="glass-card"
        style={{ maxWidth: "900px", margin: "60px auto 0" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>Select Travel Dates</h3>
        <div className="date-picker">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </motion.div>

      {/* SUMMARY */}
      <motion.div
        className="summary-panel wide"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>Your Custom Plan</h3>

        <ul>
          <li><span>Country</span>{country || "—"}</li>
          <li><span>City</span>{city || "—"}</li>
          <li><span>Sightseeing</span>{sightseeing.join(", ") || "—"}</li>
          <li>
            <span>Dates</span>
            {startDate && endDate ? `${startDate} → ${endDate}` : "—"}
          </li>
        </ul>

        <button
          className="glow-button"
          onClick={() => setShowItinerary(!showItinerary)}
        >
          {showItinerary ? "Hide Itinerary" : "View Final Itinerary"}
        </button>

        <p className="summary-note">
          Tailored by experts • Flexible • Premium experiences
        </p>
      </motion.div>

      {/* ITINERARY */}
      <AnimatePresence>
        {showItinerary && (
          <motion.div
            className="itinerary-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="itinerary-content">
              <div className="itinerary-day">
                <h4>Day 1</h4>
                <p>Arrival, hotel check-in and leisure exploration.</p>
              </div>
              <div className="itinerary-day">
                <h4>Day 2</h4>
                <p>City sightseeing and curated experiences.</p>
              </div>
              <div className="itinerary-day">
                <h4>Day 3</h4>
                <p>Optional activities and departure.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CustomPackage;
