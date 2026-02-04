import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "./Packages"; // Make sure Packages.js exports `packages`
import "./PackageSlider.css";

function PackageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-scroll every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % packages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (id) => {
    navigate(`/packages/${id}`);
  };

  return (
    <div className="slider-container">
      {packages.map((pkg, index) => (
        <div
          key={pkg.id}
          className={`slide ${index === currentIndex ? "active" : ""}`}
          onClick={() => handleClick(pkg.id)}
        >
          <img src={`/images/${pkg.id}.jpg`} alt={pkg.name} />
          <div className="slide-info">
            <h2>{pkg.name}</h2>
            <p>{pkg.duration}</p>
            <p>{pkg.description}</p>
            <p className="slide-price">{pkg.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PackageSlider;
