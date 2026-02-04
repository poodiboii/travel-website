import { useState } from "react";
import "./About.css";

function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="about-section" id="about">
      <div className="about-card">
        <h2 className="about-title">About Us</h2>

        {/* SHORT PREVIEW */}
        <p className="about-preview">
          <strong>Desperately Need A Holiday</strong> is a professionally managed
          travel company focused on delivering stress-free, reliable and
          memorable travel experiences for modern travelers.
        </p>

        {/* EXPANDABLE CONTENT */}
        {expanded && (
          <div className="about-full">
            <p>
              We specialize in thoughtfully curated domestic and international
              holidays, visa services, hotels, and end-to-end travel planning.
              Every itinerary is designed with transparency, comfort, and
              customer trust at its core.
            </p>

            <p>
              Our team works closely with verified partners and service providers
              to ensure seamless bookings, clear communication, and dependable
              support at every stage of your journey.
            </p>

            <p className="about-highlight">
              With us, your travel is not just planned — it is professionally
              managed.
            </p>
          </div>
        )}

        {/* TOGGLE BUTTON */}
        <button
          className="about-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>

        {/* CTA */}
        <div className="about-buttons">
          <a href="/packages" className="btn primary">
            View Packages
          </a>
          <a href="/contact" className="btn secondary">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
