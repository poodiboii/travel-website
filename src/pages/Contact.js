import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaClock,
  FaLocationDot,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa6";
import "./Contact.css";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | success

  return (
    <PageWrapper>
      <div className="contact">
        {/* HERO */}
        <section className="contact-hero">
          <div className="contact-hero-bg" aria-hidden />
          <div className="container contact-hero-inner">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.h1 className="contact-title" variants={fadeUp}>
                Contact <span className="contact-title-accent">Us</span>
              </motion.h1>
              <motion.p className="contact-sub" variants={fadeUp}>
                Planning a trip? Need assistance with packages, visas, hotels, or
                cab services? We’re here to help you every step of the way.
              </motion.p>

              <motion.div className="contact-pill-row" variants={fadeUp}>
                <span className="pill2">
                  <FaCheck /> Professional support
                </span>
                <span className="pill2">
                  <FaCheck /> Fast response
                </span>
                <span className="pill2">
                  <FaCheck /> Secure booking flow
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* MAIN */}
        <section className="section">
          <div className="container">
            <motion.div
              className="contact-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {/* LEFT: INFO */}
              <motion.div className="panel" variants={fadeUp}>
                <div className="panel-head">
                  <h2 className="panel-title">Get in Touch</h2>
                  <p className="panel-sub">
                    At <strong>Desperately Need A Holiday</strong>, we believe
                    travel should be stress-free. Reach out to us for
                    personalized travel solutions, exclusive deals, and expert
                    guidance.
                  </p>
                </div>

                <div className="info-cards">
                  <div className="info-card">
                    <div className="info-ic">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="info-k">Email</div>
                      <div className="info-v">holiday@ihrsindia.co.in</div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-ic">
                      <FaPhone />
                    </div>
                    <div>
                      <div className="info-k">Phone</div>
                      <div className="info-v">+91 9999359448</div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-ic">
                      <FaClock />
                    </div>
                    <div>
                      <div className="info-k">Working Hours</div>
                      <div className="info-v">Mon – Sat, 9:00 AM – 7:00 PM</div>
                    </div>
                  </div>
                </div>

                <div className="contact-actions">
                  <a
                    href="https://wa.me/919999359448?text=Hello%20I%20am%20interested%20in%20booking%20a%20travel%20package"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Chat on WhatsApp <FaArrowRight />
                  </a>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Desperately+Need+A+Holiday"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    Get Directions <FaLocationDot />
                  </a>
                </div>

                <div className="map-wrap">
                  <iframe
                    title="Desperately Need A Holiday Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.6008598195244!2d77.13823711075425!3d28.491564690367646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1ef0ec50e18f%3A0x88b6a76aa09169ab!2sDesperately%20Need%20A%20Holiday!5e0!3m2!1sen!2sin!4v1768282177757!5m2!1sen!2sin"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </motion.div>

              {/* RIGHT: FORM */}
              <motion.div className="panel panel-form" variants={fadeUp}>
                <div className="panel-head">
                  <h2 className="panel-title">Send Us a Message</h2>
                  <p className="panel-sub">
                    Share your travel plan and we’ll respond with options and a
                    clean booking flow.
                  </p>
                </div>

                {status === "success" && (
                  <div className="success">
                    <strong>Enquiry received.</strong> We’ll get back to you
                    shortly.
                  </div>
                )}

                <form
                  className="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStatus("success");
                  }}
                >
                  <div className="field">
                    <label className="label">Your Full Name</label>
                    <input className="input" type="text" placeholder="Your Full Name" required />
                  </div>

                  <div className="field">
                    <label className="label">Your Email Address</label>
                    <input className="input" type="email" placeholder="Your Email Address" required />
                  </div>

                  <div className="field">
                    <label className="label">Phone Number</label>
                    <input className="input" type="text" placeholder="Phone Number" />
                  </div>

                  <div className="field full">
                    <label className="label">Tell us about your travel plans</label>
                    <textarea
                      className="input"
                      rows={6}
                      placeholder="Tell us about your travel plans"
                      required
                    />
                  </div>

                  <div className="form-actions full">
                    <motion.button
                      className="btn btn-primary"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                    >
                      Submit Enquiry <FaArrowRight />
                    </motion.button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setStatus("idle")}
                    >
                      Reset
                    </button>
                  </div>

                  <p className="fineprint full">
                    We never share your contact details. This form is for enquiry
                    & booking assistance only.
                  </p>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* EXTRA INFO (same content) */}
        <section className="section contact-extra">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.h2 className="extra-title" variants={fadeUp}>
                Why Contact Us?
              </motion.h2>
              <motion.ul className="extra-list" variants={stagger}>
                <motion.li variants={fadeUp}>✔ Customized travel packages</motion.li>
                <motion.li variants={fadeUp}>✔ Trusted visa & documentation support</motion.li>
                <motion.li variants={fadeUp}>✔ Reliable cab & hotel partnerships</motion.li>
                <motion.li variants={fadeUp}>✔ Transparent pricing with no hidden charges</motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default Contact;
