import { useParams } from "react-router-dom";
import { packages } from "../components/Packages";
import { useCart } from "../context/CartContext";
import confetti from "canvas-confetti";
import "./PackageDetailsPage.css";

function PackageDetailsPage() {
  const { packageId } = useParams();
  const { addToCart } = useCart();

  const pkg = packages.find((p) => p.id === packageId);

  if (!pkg) {
    return <p style={{ padding: "100px 10%" }}>Package not found.</p>;
  }

  /* 🔹 Smooth scroll helper */
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* 🎉 Confetti animation */
  const fireConfetti = () => {
    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#0d6efd", "#22c55e", "#38bdf8"],
    });
  };

  return (
    <div className="package-details-page">
      {/* HERO */}
      <div
        className="details-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${pkg.image})`,
        }}
      >
        <h1>{pkg.name}</h1>
        <p>{pkg.duration}</p>
      </div>

      {/* STICKY NAV */}
      <div className="details-nav">
        <button onClick={() => scrollToSection("hotels")}>Hotels</button>
        <button onClick={() => scrollToSection("cab")}>Cab Services</button>
        <button onClick={() => scrollToSection("sightseeing")}>Sightseeing</button>
        <button onClick={() => scrollToSection("itinerary")}>Itinerary</button>
      </div>

      {/* CTA */}
      <div className="details-cta">
        <button
          className="add-to-cart-btn"
          onClick={() => {
            addToCart(pkg);
            fireConfetti();
          }}
        >
          Reserve This Package
        </button>
      </div>

      {/* HOTEL */}
      <section id="hotels" className="details-section">
        <h2>Hotel Stay</h2>
        <div className="details-box">
          <p>Handpicked premium hotels with daily breakfast.</p>
          <ul>
            <li>City center or prime locations</li>
            <li>Verified & sanitized properties</li>
            <li>24x7 support during stay</li>
          </ul>
        </div>
      </section>

      {/* CAB */}
      <section id="cab" className="details-section alt">
        <h2>Cab Services</h2>
        <div className="details-box">
          <ul>
            <li>Airport pickup & drop</li>
            <li>Private sightseeing transfers</li>
            <li>Experienced drivers</li>
          </ul>
        </div>
      </section>

      {/* SIGHTSEEING */}
      <section id="sightseeing" className="details-section">
        <h2>Sightseeing</h2>
        <div className="details-box">
          <ul>
            <li>Top attractions covered</li>
            <li>Entry tickets included</li>
            <li>Guided tours (where applicable)</li>
          </ul>
        </div>
      </section>

      {/* ITINERARY */}
      <section id="itinerary" className="details-section alt">
        <h2>Detailed Itinerary</h2>

        <div className="itinerary-box">
          <h4>Day 1</h4>
          <p>Arrival, hotel check-in & leisure time.</p>
        </div>

        <div className="itinerary-box">
          <h4>Day 2</h4>
          <p>City sightseeing & local attractions.</p>
        </div>

        <div className="itinerary-box">
          <h4>Day 3</h4>
          <p>Optional activities or shopping.</p>
        </div>

        <div className="itinerary-box">
          <h4>Day 4</h4>
          <p>Checkout & airport transfer.</p>
        </div>
      </section>
    </div>
  );
}

export default PackageDetailsPage;
