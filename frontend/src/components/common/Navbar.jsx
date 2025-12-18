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
          <Link to="/">
            <img
              src={logo}
              alt="Chill Grand Logo"
              className="logo-img"
            />
          </Link>
        </div>

        {/* Links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/plan-event" className="nav-link">Plan Your Event</Link>
          <Link to="/table-booking" className="nav-link">Table Booking</Link>
          <Link to="/about" className="nav-link">About Us</Link>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/contact" className="btn-primary">Contact Us</Link>

          <div
            className="mobile-menu-toggle"
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
