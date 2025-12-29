import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">

        {/* Logo */}
        <div className="navbar-logo">
          <img
            src={logo}
            alt="Chill Grand Logo"
            className="logo-img"
          />
        </div>

        {/* Links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="#menu" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Menu</a>
          <Link to="/plan-event" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Plan Your Event</Link>
          <Link to="/table-booking" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Table Booking</Link>
          <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/contact" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>

          <div
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
