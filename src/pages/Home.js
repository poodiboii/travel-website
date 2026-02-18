import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaWandMagicSparkles, FaCompass } from "react-icons/fa6";
import "./Home.css";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.55, ease: "easeOut" },
  }),
};

function Home() {
  return (
    <div className="home">
      <div className="container">
        <motion.div
          className="home-intro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="home-kicker">Desperately Need A Holiday</p>
          <h1 className="home-title">
            Plan travel that feels effortless.
            <span className="home-title-accent"> Book & pay online.</span>
          </h1>
          <p className="home-sub">
            Choose a custom-made trip or pick a ready package. We’ll take care of
            the details—hotels, visas, cabs and more.
          </p>
        </motion.div>

        <div className="home-split">
          {/* LEFT: CUSTOM PACKAGE */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="show"
          >
            <Link to="/custom-package" className="home-card home-card--custom">
              <div className="home-card-overlay" />
              <div className="home-card-content">
                <div className="home-card-badge">
                  <FaWandMagicSparkles /> Custom
                </div>

                <h2>Create a Custom Trip</h2>
                <p>
                  Design your holiday exactly the way you want—destination,
                  duration, budget, hotels, and experiences.
                </p>

                <div className="home-card-actions">
                  <span className="btn btn-primary">
                    Start Planning <FaArrowRight />
                  </span>
                  <span className="home-card-hint">Best for tailored trips</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* RIGHT: PACKAGES */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="show"
          >
            <Link to="/packages" className="home-card home-card--packages">
              <div className="home-card-overlay" />
              <div className="home-card-content">
                <div className="home-card-badge">
                  <FaCompass /> Curated
                </div>

                <h2>Explore Ready Packages</h2>
                <p>
                  Browse curated domestic and international packages with clear
                  inclusions, pricing and smooth booking.
                </p>

                <div className="home-card-actions">
                  <span className="btn btn-ghost">
                    View Packages <FaArrowRight />
                  </span>
                  <span className="home-card-hint">Fastest to book</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="home-trust"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: "easeOut" }}
        >
          <div className="home-trust-item">
            <span className="home-trust-value">24/7</span>
            <span className="home-trust-label">Support</span>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-value">Secure</span>
            <span className="home-trust-label">Online Payments</span>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-value">Verified</span>
            <span className="home-trust-label">Partners</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
