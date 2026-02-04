import "./Footer.css";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Copyright */}
        <p className="footer-text">
          © 2012 Desperately Need A Holiday.
          <br />
          All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="social-icons">
          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/desperatelyneeda"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link"
            whileHover={{ scale: 1.25, y: -6 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaInstagram />
          </motion.a>

          {/* Facebook */}
          <motion.a
            href="https://www.facebook.com/share/17kqCZPJSU/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="social-link"
            whileHover={{ scale: 1.25, y: -6 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaFacebookF />
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href="https://www.linkedin.com/company/desperately-need-a-holiday/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-link"
            whileHover={{ scale: 1.25, y: -6 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaLinkedinIn />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
