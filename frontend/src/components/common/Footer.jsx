import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Footer.css';
import logo from '../../assets/logo.png';
import instagramIcon from '../../assets/inster.png';
import facebookIcon from '../../assets/facebook.png';
import tiktokIcon from '../../assets/ticktock.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Link to="/">
                            <img src={logo} alt="Chill Grand Logo" style={{ height: '80px', width: 'auto' }} />
                        </Link>
                    </div>
                    <p className="footer-hours">Monday - Sunday: 11:00 AM - 11:00 PM</p>
                    <p className="footer-copyright">© 2025 Chill Grand Restaurant | All rights reserved</p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4>About</h4>
                        <ul>
                            <li>0761400071</li>
                            <li>chillgrand@gmail.com</li>
                            <li>Kaduwela Road, Malabe</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/landing">Menu</Link></li>
                            <li><Link to="/plan-event">Plan Event</Link></li>
                            <li><Link to="/table-booking">Table Booking</Link></li>
                            <li><Link to="/about">About us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-newsletter">
                    <div className="social-icons">
                        <span>Follow us</span>
                        <a href="https://www.instagram.com/chill.grand?igsh=MWdjOWljZHR3Ym9ybA==" target="_blank" rel="noopener noreferrer" className="icon"><img src={instagramIcon} alt="Instagram" /></a>
                        <a href="https://www.facebook.com/share/1HGRAjQ2QZ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="icon"><img src={facebookIcon} alt="Facebook" /></a>
                        <a href="https://www.tiktok.com/@chill.grand?_r=1&_t=ZS-980JgkC3ih6" target="_blank" rel="noopener noreferrer" className="icon"><img src={tiktokIcon} alt="TikTok" /></a>
                    </div>

                    <h4>Newsletter</h4>
                    <div className="newsletter-wrapper">
                        <p>Get recent news and updates.</p>
                        <form className="newsletter-form">
                            <div className="newsletter-input-group">
                                <input type="email" placeholder="Email Address" required />
                                <button type="submit" className="btn-subscribe">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
