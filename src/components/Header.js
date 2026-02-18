import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import logo from "../assets/logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} className="brand">
          <img src={logo} alt="Desperately Need A Holiday" className="logo" />
          <span className="brand-text">
            Desperately Need A Holiday
            <span className="brand-sub">Curated trips • visas • hotels • cabs</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="desktop-nav" aria-label="Primary">
          {navItems(closeMenu)}
          <NavLink
            to="/custom-package"
            onClick={closeMenu}
            className={({ isActive }) =>
              ["nav-cta", isActive ? "active" : null].filter(Boolean).join(" ")
            }
          >
            Plan a Trip
          </NavLink>
        </nav>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeMenu}
          >
            <motion.nav
              className="mobile-nav"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile"
            >
              <div className="mobile-nav-links">{navItems(closeMenu)}</div>
              <NavLink
                to="/custom-package"
                onClick={closeMenu}
                className={({ isActive }) =>
                  ["mobile-cta", isActive ? "active" : null]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                Plan a Trip
              </NavLink>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* NAV ITEMS */
const navItems = (closeMenu) => (
  <>
    <NavLink
      to="/"
      end
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Home
    </NavLink>
    <NavLink
      to="/packages"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Packages
    </NavLink>
    <NavLink
      to="/hotels"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Hotels
    </NavLink>
    <NavLink
      to="/visa"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Visa
    </NavLink>
    <NavLink
      to="/cab"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Cabs
    </NavLink>
    <NavLink
      to="/about"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      About
    </NavLink>
    <NavLink
      to="/contact"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Contact
    </NavLink>
    <NavLink
      to="/cart"
      onClick={closeMenu}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      Cart
    </NavLink>
  </>
);

export default Header;
