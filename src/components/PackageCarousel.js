import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PackageCarousel.css";

// ✅ Import images from assets
import goaImg from "../assets/goa-beach-holiday.png";
import manaliImg from "../assets/manali-mountain-escape.png";
import rajasthanImg from "../assets/royal-rajasthan-tour.png";
import baliImg from "../assets/bali-international-trip.png";
import dubaiImg from "../assets/dubai-luxury-tour.png";

// ✅ Local package data for carousel
const carouselPackages = [
  {
    id: "goa-beach-holiday",
    name: "Goa Beach Holiday",
    duration: "3 Nights / 4 Days",
    price: "₹15,999",
    image: goaImg,
  },
  {
    id: "manali-mountain-escape",
    name: "Manali Mountain Escape",
    duration: "4 Nights / 5 Days",
    price: "₹18,499",
    image: manaliImg,
  },
  {
    id: "royal-rajasthan-tour",
    name: "Royal Rajasthan Tour",
    duration: "5 Nights / 6 Days",
    price: "₹24,999",
    image: rajasthanImg,
  },
  {
    id: "bali-international-trip",
    name: "Bali International Trip",
    duration: "5 Nights / 6 Days",
    price: "₹79,999",
    image: baliImg,
  },
  {
    id: "dubai-luxury-tour",
    name: "Dubai Luxury Tour",
    duration: "4 Nights / 5 Days",
    price: "₹89,999",
    image: dubaiImg,
  },
];

function PackageCarousel() {
  const [index, setIndex] = useState(0);

  // ✅ Auto-scroll every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselPackages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Show 3 sections (desktop), auto-adjust via CSS
  const visiblePackages = [
    carouselPackages[index],
    carouselPackages[(index + 1) % carouselPackages.length],
    carouselPackages[(index + 2) % carouselPackages.length],
  ];

  return (
    <section className="carousel-section">
      <div className="carousel-wrapper">
        {visiblePackages.map((pkg) => (
          <Link
            key={pkg.id}
            to={`/packages/${pkg.id}`}
            className="carousel-card"
          >
            <img src={pkg.image} alt={pkg.name} />

            <div className="carousel-info">
              <h3>{pkg.name}</h3>
              <p>{pkg.duration}</p>
              <span>{pkg.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PackageCarousel;
