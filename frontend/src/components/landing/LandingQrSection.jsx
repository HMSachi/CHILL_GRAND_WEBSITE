import React from 'react';
import { FaUtensils, FaClock, FaStar } from 'react-icons/fa';
import '../../styles/components/landing/LandingQrSection.css';
import logo from '../../assets/logo.png';

const LandingQrSection = () => {
    return (
        <section className="landing-qr-section">
            <div className="qr-section-container">
                <div className="qr-content-grid">
                    <div className="qr-text-area">
                        <h2 className="qr-section-title">
                            Quick & Easy Ordering
                        </h2>
                        <p className="qr-section-description">
                            Simply scan the QR code to access our full menu,
                            place your order, and enjoy your meal without the wait.
                        </p>
                        <div className="qr-features-list">
                            <div className="qr-feature-item">
                                <FaUtensils className="qr-feature-icon" />
                                <span>Browse Full Menu</span>
                            </div>
                            <div className="qr-feature-item">
                                <FaClock className="qr-feature-icon" />
                                <span>Fast Service</span>
                            </div>
                            <div className="qr-feature-item">
                                <FaStar className="qr-feature-icon" />
                                <span>Premium Quality</span>
                            </div>
                        </div>
                    </div>

                    <div className="qr-code-area">
                        <div className="qr-display-card">
                            <div className="qr-card-glow-effect"></div>
                            <img src={logo} alt="QR Code" className="qr-code-image" />
                            <p className="qr-code-label">Scan to Order</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingQrSection;
