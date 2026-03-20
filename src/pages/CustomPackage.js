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
  FaBowlFood,
  FaStar,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa6";

import PageWrapper from "../components/PageWrapper";
import { useCart } from "../context/CartContext";
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
  return list.includes(value)
    ? list.filter((x) => x !== value)
    : [...list, value];
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
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

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

  const [hotelStars, setHotelStars] = useState(4);
  const [mealPlan, setMealPlan] = useState("Breakfast");

  const [needFlights, setNeedFlights] = useState(true);
  const [needHotel, setNeedHotel] = useState(true);
  const [needVisa, setNeedVisa] = useState(false);
  const [needCab, setNeedCab] = useState(true);

  const [budget, setBudget] = useState(60000);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const tripNights = useMemo(
    () => nightsBetween(startDate, endDate),
    [startDate, endDate]
  );

  const cityOptions = country ? COUNTRY_CITY_DATA[country] : [];
  const sightseeingOptions = city ? SIGHTSEEING_DATA[city] : [];

  const isReady =
    country && city && startDate && endDate && adults >= 1;

  const summary = {
    destination: [country, city].join(" • "),
    dates: `${formatDate(startDate)} → ${formatDate(endDate)}`,
    duration: `${tripNights || 0} nights`,
    travellers: `${adults} adult${children ? `, ${children} child` : ""}`,
    hotel: `${hotelStars}★ • ${mealPlan}`,
    visa: needVisa ? "Included" : "Not included",
    flights: needFlights ? "Included" : "Not included",
    sights: sightseeing.join(", "),
    budget: `₹${budget}`,
  };

  function addPlanToCart() {
    addToCart({
      id: `custom-${Date.now()}`,
      name: `Custom Trip • ${country} • ${city}`,
      price: budget, // ✅ FIXED
      image: null,
      advance: 1000, // ✅ NEW
      meta: summary,
      lead: { name, phone, email, notes },
    });

    nav("/cart");
  }

  return (
    <PageWrapper>
      <div className="ctp">
        <section className="ctp-hero">
          <div className="ctp-hero-bg" />
          <div className="container">
            <h1>Build Your Custom Trip</h1>
          </div>
        </section>

        <div className="container ctp-layout">
          <div className="ctp-main">
            <button onClick={addPlanToCart}>Add to Cart</button>
          </div>

          <aside className="ctp-side">
            <div className="side-card">
              <h3>Summary</h3>
              <p>{summary.destination}</p>
              <p>{summary.budget}</p>

              <div className="kv">
                <span>Advance Payable</span>
                <strong>₹1000</strong>
              </div>

              <p style={{ fontSize: "0.85rem" }}>
                ₹1000 will be adjusted in final payment.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}

export default CustomPackage;