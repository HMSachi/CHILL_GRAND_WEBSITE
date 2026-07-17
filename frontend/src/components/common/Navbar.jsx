import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">

        {/* Desktop Links - Left */}
        <div className="navbar-links left">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/plan-event" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Plan Event</NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Happenings</NavLink>
        </div>

        {/* Logo - Centered */}
        <div className="navbar-logo">
          <NavLink to="/">
            <img src={logo} alt="Chill Grand Logo" className="logo-img" />
          </NavLink>
        </div>

        {/* Desktop Links - Right */}
        <div className="navbar-links right">
          <NavLink to="/table-booking" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reservations</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </div>

        {/* Mobile Toggle */}
        <div className="navbar-mobile-toggle">
          <div
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        {/* Mobile Menu (Overlay) */}
        <div className={`navbar-mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-links">
            <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/plan-event" onClick={() => setMobileMenuOpen(false)}>Plan Event</NavLink>
            <NavLink to="/events" onClick={() => setMobileMenuOpen(false)}>Happenings</NavLink>
            <NavLink to="/table-booking" onClick={() => setMobileMenuOpen(false)}>Reservations</NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
