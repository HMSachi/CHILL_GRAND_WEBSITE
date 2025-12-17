import React from 'react';
import '../../styles/components/Footer.css';
import logo from '../../assets/logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src={logo} alt="Chill Grand Logo" style={{ height: '80px', width: 'auto' }} />
                    </div>
                    <p className="footer-hours">Monday - Sunday: 10:00am - 10:00pm</p>
                    <p className="footer-copyright">© 2025 Chill Grand Restaurant | All rights reserved</p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4>About</h4>
                        <ul>
                            <li>0345678901</li>
                            <li>chillgrand@gmail.com</li>
                            <li>No 053,</li>
                            <li>Malabe</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Explore</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#events">Plan Event</a></li>
                            <li><a href="#booking">Table Booking</a></li>
                            <li><a href="#about">About us</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-newsletter">
                    <div className="social-icons">
                        <span>Follow us</span>
                        <div className="icon">FB</div>
                        <div className="icon">IG</div>
                        <div className="icon">WA</div>
                    </div>

                    <h4>Newsletter</h4>
                    <p>Get recent news and updates.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Email Address" />
                        <button type="submit" className="btn-secondary">Subscribe</button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
