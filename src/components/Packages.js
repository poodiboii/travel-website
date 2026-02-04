import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Packages.css";

/* Images (temporary reuse – you can replace later) */
import thailandImg from "../assets/bali-international-trip.png";
import singaporeImg from "../assets/dubai-luxury-tour.png";
import indonesiaImg from "../assets/bali-international-trip.png";
import dubaiImg from "../assets/dubai-luxury-tour.png";
import vietnamImg from "../assets/bali-international-trip.png";

/* REAL PACKAGES DATA */
export const packages = [
  {
    id: "4n-thailand-paradise",
    name: "4N Thai Paradise Getaway",
    price: "₹19,000",
    duration: "4 Nights",
    description:
      "3★ Hotel + Coral Island Tour + Safari World & Marine Park + Intercity & Airport Transfers. Valid till 31 March 2026.",
    type: "international",
    image: thailandImg,
  },
  {
    id: "3n-singapore",
    name: "3N Singapore Package",
    price: "₹46,499",
    duration: "3 Nights",
    description:
      "Hotel Boss (4★) + Universal Studios + Gardens by the Bay + Night Safari + Sentosa Cable Car + Madame Tussauds + Wings of Time + Airport Transfers.",
    type: "international",
    image: singaporeImg,
  },
  {
    id: "5n-indonesia-kuta-ubud",
    name: "5N Indonesia Package (Kuta & Ubud)",
    price: "₹31,999",
    duration: "5 Nights",
    description:
      "4★ Hotels + Water Sports + Nusa Penida Tour + Kintamani Tour + Bali Swing + ATV Ride + Tegenungan Waterfall + Airport Transfers.",
    type: "international",
    image: indonesiaImg,
  },
  {
    id: "4n-dubai",
    name: "4N Dubai Package",
    price: "₹47,699",
    duration: "4 Nights",
    description:
      "Jannah Hotel Apartments & Villas + Breakfast + Burj Khalifa (124 & 125) + Dubai City Tour + Desert Safari + Dhow Cruise + UAE Visa + Airport Transfers.",
    type: "international",
    image: dubaiImg,
  },
  {
    id: "4n-vietnam-hanoi-danang",
    name: "4N Vietnam Package (Hanoi → Danang)",
    price: "₹29,499",
    duration: "4 Nights",
    description:
      "Hotels + Halong Bay Cruise + Hanoi City Tour + Hoi An Ancient Town + Ba Na Hills + Golden Bridge + Indian Buffet Lunch + Airport Transfers.",
    type: "international",
    image: vietnamImg,
  },
];

function Packages() {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  /* ❤️ Wishlist */
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  /* Filter + Search */
  let filtered = packages.filter((pkg) => {
    const matchesType =
      selectedType === "all" || pkg.type === selectedType;

    const matchesSearch = pkg.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  /* Sorting */
  if (sortBy === "priceLow") {
    filtered.sort(
      (a, b) =>
        Number(a.price.replace(/[^0-9]/g, "")) -
        Number(b.price.replace(/[^0-9]/g, ""))
    );
  }

  if (sortBy === "priceHigh") {
    filtered.sort(
      (a, b) =>
        Number(b.price.replace(/[^0-9]/g, "")) -
        Number(a.price.replace(/[^0-9]/g, ""))
    );
  }

  return (
    <section className="packages-section" id="packages">
      <div className="packages-header">
        <h2>AVAILABLE PACKAGES</h2>

        <div className="package-search-wrapper">
          <input
            type="text"
            placeholder=" Search by destination..."
            className="package-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="package-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>

        <select
          className="package-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Packages</option>
          <option value="international">International</option>
        </select>
      </div>

      <div className="packages-wrapper">
        {filtered.length === 0 ? (
          <p>No packages found.</p>
        ) : (
          filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="package-row"
              style={{
                backgroundImage: `linear-gradient(
                  rgba(0,0,0,0.55),
                  rgba(0,0,0,0.55)
                ), url(${pkg.image})`,
              }}
            >
              <button
                className="wishlist-btn"
                onClick={() => toggleWishlist(pkg.id)}
              >
                {wishlist.includes(pkg.id) ? "❤️" : "🤍"}
              </button>

              <div className="package-info">
                <h3>{pkg.name}</h3>
                <p className="package-duration">{pkg.duration}</p>
                <p className="package-description">{pkg.description}</p>
              </div>

              <div className="package-action">
                <p className="package-price">{pkg.price} / person</p>
                <Link to={`/packages/${pkg.id}`} className="package-link">
                  Know More →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Packages;
