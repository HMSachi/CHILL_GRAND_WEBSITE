import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import instagramIcon from '../../assets/inster.png';
import facebookIcon from '../../assets/facebook.png';
import tiktokIcon from '../../assets/ticktock.png';
import '../styles/QRFooter.css';

const QRFooter = () => {
    return (
        <footer className="qr-footer">
            <div className="qr-footer-container">
                <div className="qr-footer-brand">
                    <Link to="/landing" className="qr-footer-logo">
                        <img src={logo} alt="Chill Grand Logo" />
                    </Link>
                    <p className="qr-footer-tagline">Experience the finest dining with Chill Grand.</p>
                </div>

                <div className="qr-footer-info">
                    <div className="qr-footer-section">
                        <h4>Contact Us</h4>
                        <p>0761400071</p>
                        <p>chillgrand@gmail.com</p>
                        <p>Kaduwela Road, Malabe</p>
                    </div>

                    <div className="qr-footer-section">
                        <h4>Follow Us</h4>
                        <div className="qr-social-links">
                            <a href="https://www.instagram.com/chill.grand?igsh=MWdjOWljZHR3Ym9ybA==" target="_blank" rel="noopener noreferrer" className="qr-social-icon"><img src={instagramIcon} alt="Instagram" /></a>
                            <a href="https://www.facebook.com/share/1HGRAjQ2QZ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="qr-social-icon"><img src={facebookIcon} alt="Facebook" /></a>
                            <a href="https://www.tiktok.com/@chill.grand?_r=1&_t=ZS-980JgkC3ih6" target="_blank" rel="noopener noreferrer" className="qr-social-icon"><img src={tiktokIcon} alt="TikTok" /></a>
                        </div>
                    </div>
                </div>

                <div className="qr-footer-bottom">
                    <p>© 2025 Chill Grand Restaurant | All rights reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default QRFooter;
