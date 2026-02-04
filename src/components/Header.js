import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import logo from "../assets/logo.png"; // adjust path if needed

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" onClick={closeMenu}>
          <img
            src={logo}
            alt="Desperately Need A Holiday"
            className="logo"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav-links desktop-nav">
          {navItems(closeMenu)}
        </nav>

        {/* HAMBURGER */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems(closeMenu)}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* NAV ITEMS */
const navItems = (closeMenu) => (
  <>
    <Link to="/" onClick={closeMenu}>Home</Link>
    <Link to="/about" onClick={closeMenu}>About</Link>

    {/* Packages */}
    <Link to="/packages" onClick={closeMenu}>Packages</Link>

    {/* ✅ NEW: Custom Package */}
    <Link to="/custom-package" onClick={closeMenu}>
      Custom Package
    </Link>

    <Link to="/visa" onClick={closeMenu}>Visa Services</Link>
    <Link to="/cab" onClick={closeMenu}>Cab Services</Link>
    <Link to="/hotels" onClick={closeMenu}>Hotels</Link>
    <Link to="/contact" onClick={closeMenu}>Contact</Link>
    <Link to="/cart" onClick={closeMenu}>Cart</Link>
  </>
);

export default Header;
