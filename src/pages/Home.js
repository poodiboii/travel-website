import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-split-container">
      {/* LEFT: CUSTOM PACKAGE */}
      <Link to="/custom-package" className="home-split custom-trip">
        <div className="split-content">
          <h1>Create a Custom Trip</h1>
          <p>
            Design your holiday exactly the way you want — destination,
            duration, budget, hotels, and experiences.
          </p>
          <button>Start Planning</button>
        </div>
      </Link>

      {/* RIGHT: PACKAGES */}
      <Link to="/packages" className="home-split explore-packages">
        <div className="split-content">
          <h1>Explore Ready Packages</h1>
          <p>
            Browse our curated domestic and international travel packages
            with best prices and inclusions.
          </p>
          <button>View Packages</button>
        </div>
      </Link>
    </div>
  );
}

export default Home;
