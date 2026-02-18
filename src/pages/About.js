import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";
import { FaCrown, FaHandshake, FaWandMagicSparkles } from "react-icons/fa6";
import "./About.css";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function About() {
  return (
    <PageWrapper>
      <div className="about">
        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-bg" aria-hidden />
          <div className="about-hero-orb orb-1" aria-hidden />
          <div className="about-hero-orb orb-2" aria-hidden />
          <div className="about-hero-orb orb-3" aria-hidden />

          <div className="container about-hero-inner">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div className="about-kicker" variants={fadeUp}>
                <span className="about-kicker-pill">
                  <FaCrown /> Premium travel, without the stress
                </span>
              </motion.div>

              <motion.h1 className="about-title" variants={fadeUp}>
                About <span className="about-title-accent">Us</span>
              </motion.h1>

              <motion.p className="about-sub" variants={fadeUp}>
                We design trips that feel effortless—beautifully planned,
                transparently priced, and supported end-to-end.
              </motion.p>

              <motion.div className="about-stats" variants={fadeUp}>
                <div className="stat">
                  <div className="stat-value">Luxury</div>
                  <div className="stat-label">Presentation</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Secure</div>
                  <div className="stat-label">Online Payments</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Trusted</div>
                  <div className="stat-label">Partner Network</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* STORY + OFFERING */}
        <section className="section">
          <div className="container">
            <motion.div
              className="about-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.div className="about-card" variants={fadeUp}>
                <div className="about-card-icon">
                  <FaWandMagicSparkles />
                </div>
                <h2 className="about-h2">Who We Are</h2>
                <p className="about-p">
                  <strong>Desperately Need A Holiday</strong> was created with one
                  simple goal — to make travel stress-free and accessible for
                  everyone. Whether it’s a short domestic getaway or a luxurious
                  international vacation, we curate experiences you’ll never
                  forget.
                </p>
                <p className="about-p">
                  From customized travel packages to visa assistance, premium
                  hotel stays, and reliable cab services, we manage every detail
                  so you can focus on enjoying your journey.
                </p>
              </motion.div>

              <motion.div className="about-card" variants={fadeUp}>
                <div className="about-card-icon">
                  <FaHandshake />
                </div>
                <h2 className="about-h2">What We Offer</h2>
                <ul className="about-list">
                  <li>✔ Domestic & International Travel Packages</li>
                  <li>✔ Visa Assistance & Documentation</li>
                  <li>✔ Exclusive Hotel Partnerships</li>
                  <li>✔ Comfortable Cab & Transfer Services</li>
                  <li>✔ End-to-End Travel Planning</li>
                </ul>

                <div className="about-cta-row">
                  <a className="btn btn-primary" href="/custom-package">
                    Plan a trip
                  </a>
                  <a className="btn btn-ghost" href="/packages">
                    Explore packages
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* VALUES */}
        <section className="section about-values">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <h2 className="about-h2-center">Why Choose Us?</h2>
                <p className="about-center-sub">
                  Premium planning, trusted partners, and transparent pricing—no
                  surprises, just great trips.
                </p>
              </motion.div>

              <motion.div className="values-grid" variants={stagger}>
                <motion.div className="value" variants={fadeUp}>
                  <h3>Personalized Planning</h3>
                  <p>
                    Every traveler is unique. We tailor trips to match your
                    budget, preferences, and travel goals.
                  </p>
                </motion.div>

                <motion.div className="value" variants={fadeUp}>
                  <h3>Trusted Network</h3>
                  <p>
                    We collaborate with reliable airlines, hotels, and transport
                    providers to ensure quality service.
                  </p>
                </motion.div>

                <motion.div className="value" variants={fadeUp}>
                  <h3>Transparent Pricing</h3>
                  <p>
                    No hidden costs. What you see is what you pay — complete
                    peace of mind.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div className="about-bottom" variants={fadeUp}>
                <div className="about-bottom-inner">
                  <div>
                    <div className="about-bottom-title">Ready to book?</div>
                    <div className="about-bottom-sub">
                      Pay advance online and let us handle the rest.
                    </div>
                  </div>
                  <a className="btn btn-primary" href="/packages">
                    Book & Pay Advance
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default About;
