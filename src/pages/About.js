import PageWrapper from "../components/PageWrapper";
import "./About.css";

function About() {
  return (
    <PageWrapper>
      <section className="about-page">
        {/* HERO */}
        <div className="about-hero">
          <h1>About Us</h1>
         
        </div>

        {/* MAIN CONTENT */}
        <div className="about-content">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              <strong>Desperately Need A Holiday</strong> was created with one
              simple goal — to make travel stress-free and accessible for
              everyone. Whether it’s a short domestic getaway or a luxurious
              international vacation, we curate experiences you’ll never forget.
            </p>

            <p>
              From customized travel packages to visa assistance, premium hotel
              stays, and reliable cab services, we manage every detail so you can
              focus on enjoying your journey.
            </p>
          </div>

          <div className="about-text">
            <h2>What We Offer</h2>
            <ul>
              <li>✔ Domestic & International Travel Packages</li>
              <li>✔ Visa Assistance & Documentation</li>
              <li>✔ Exclusive Hotel Partnerships</li>
              <li>✔ Comfortable Cab & Transfer Services</li>
              <li>✔ End-to-End Travel Planning</li>
            </ul>
          </div>
        </div>

        {/* VALUES */}
        <div className="about-values">
          <h2>Why Choose Us?</h2>

          <div className="values-grid">
            <div className="value-card">
              <h3>Personalized Planning</h3>
              <p>
                Every traveler is unique. We tailor trips to match your budget,
                preferences, and travel goals.
              </p>
            </div>

            <div className="value-card">
              <h3>Trusted Network</h3>
              <p>
                We collaborate with reliable airlines, hotels, and transport
                providers to ensure quality service.
              </p>
            </div>

            <div className="value-card">
              <h3>Transparent Pricing</h3>
              <p>
                No hidden costs. What you see is what you pay — complete peace of
                mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default About;
