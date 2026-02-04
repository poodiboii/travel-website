import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";
import "./Contact.css";

function Contact() {
  return (
    <PageWrapper>
      <section className="contact-page">
        {/* HERO SECTION */}
        <motion.div
          className="contact-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Contact Us</h1>
          <p>
            Planning a trip? Need assistance with packages, visas, hotels, or cab
            services? We’re here to help you every step of the way.
          </p>
        </motion.div>

        {/* CONTACT CONTENT */}
        <div className="contact-container">
          {/* LEFT INFO */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Get in Touch</h2>
            <p>
              At <strong>Desperately Need A Holiday</strong>, we believe travel
              should be stress-free. Reach out to us for personalized travel
              solutions, exclusive deals, and expert guidance.
            </p>

            <div className="contact-details">
              <p><strong>Email:</strong> holiday@ihrsindia.co.in</p>
              <p><strong>Phone:</strong> +91 9999359448</p>
              <p><strong>Working Hours:</strong> Mon – Sat, 9:00 AM – 7:00 PM</p>
            </div>
           <a
  href="https://wa.me/919999359448?text=Hello%20I%20am%20interested%20in%20booking%20a%20travel%20package"
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-btn"
>
  💬 Chat on WhatsApp
</a>



            {/* GOOGLE MAP */}
            <div className="contact-map">
              <iframe
                title="Desperately Need A Holiday Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.6008598195244!2d77.13823711075425!3d28.491564690367646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1ef0ec50e18f%3A0x88b6a76aa09169ab!2sDesperately%20Need%20A%20Holiday!5e0!3m2!1sen!2sin!4v1768282177757!5m2!1sen!2sin"
                width="100%"
                height="260"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a
  href="https://www.google.com/maps/dir/?api=1&destination=Desperately+Need+A+Holiday"
  target="_blank"
  rel="noopener noreferrer"
  className="directions-btn"
>
   Get Directions
</a>


            
          </motion.div>

          {/* RIGHT FORM */}
          <motion.form
            className="contact-form"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Send Us a Message</h2>

            <input type="text" placeholder="Your Full Name" required />
            <input type="email" placeholder="Your Email Address" required />
            <input type="text" placeholder="Phone Number" />
            <textarea
              rows="5"
              placeholder="Tell us about your travel plans"
              required
            ></textarea>

            <motion.button
              className="btn primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Enquiry
            </motion.button>
          </motion.form>
        </div>

        {/* EXTRA INFO */}
        <motion.div
          className="contact-extra"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why Contact Us?</h2>
          <ul>
            <li>✔ Customized travel packages</li>
            <li>✔ Trusted visa & documentation support</li>
            <li>✔ Reliable cab & hotel partnerships</li>
            <li>✔ Transparent pricing with no hidden charges</li>
          </ul>
        </motion.div>
      </section>
    </PageWrapper>
  );
}

export default Contact;
