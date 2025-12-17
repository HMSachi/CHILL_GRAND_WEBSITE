import React, { useState, useEffect } from 'react';
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
          <a href="#home" className="nav-link">Home</a>
          <a href="#menu" className="nav-link">Menu</a>
          <a href="#events" className="nav-link">Plan Your Event</a>
          <a href="#booking" className="nav-link">Table Booking</a>
          <a href="#about" className="nav-link">About Us</a>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="btn-primary">Contact Us</button>

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
