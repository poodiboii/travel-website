import { useEffect, useState } from "react";
import "./Hero.css";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const images = [hero1, hero2, hero3];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5500); // 5.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Travel destination"
          className={`hero-bg ${index === current ? "active" : ""}`}
        />
      ))}

      <div className="hero-overlay" />

      <div className="hero-content">
        <h2>Explore the World With Us</h2>
        <p>Your perfect escape starts here.</p>
        <a href="/packages" className="btn">
          View Packages
        </a>
      </div>
    </section>
  );
}

export default Hero;
