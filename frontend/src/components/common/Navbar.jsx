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

        {/* Desktop Links - Left */}
        <div className="navbar-links left">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/plan-event" className="nav-link">Plan Event</Link>
          <Link to="/events" className="nav-link">Upcoming Events</Link>
        </div>

        {/* Logo - Centered */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Chill Grand Logo" className="logo-img" />
          </Link>
        </div>

        {/* Desktop Links - Right */}
        <div className="navbar-links right">
          <Link to="/virtual-tour" className="nav-link">360 Tour</Link>
          <Link to="/table-booking" className="nav-link">Reservations</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Mobile Toggle */}
        <div className="navbar-mobile-toggle">
          <div
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        {/* Mobile Menu (Overlay) */}
        <div className={`navbar-mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/plan-event" onClick={() => setMobileMenuOpen(false)}>Plan Event</Link>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)}>Upcoming Events</Link>
            <Link to="/virtual-tour" onClick={() => setMobileMenuOpen(false)}>360 Tour</Link>
            <Link to="/table-booking" onClick={() => setMobileMenuOpen(false)}>Reservations</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
