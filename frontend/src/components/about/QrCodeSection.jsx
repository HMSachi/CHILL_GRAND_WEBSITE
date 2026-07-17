import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/About.css';
import qrBg from '../../assets/restaurants.jpg';
import qrCode from '../../assets/qr_premium.png';

const QrCodeSection = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/categories');
    };

    return (
        <section className="qr-section" style={{ backgroundImage: `url(${qrBg})` }}>
            <div className="qr-overlay">
                <div className="qr-container">
                    <div className="qr-card-premium">
                        <div className="qr-card-badge">SMART MENU</div>
                        <h2 className="qr-card-title">INSTANT <br /><span>ORDERING</span></h2>

                        <div className="qr-visual-wrapper" onClick={handleGetStarted}>
                            <div className="qr-floating-bg"></div>
                            <div className="qr-code-frame">
                                <img src={qrCode} alt="Scan QR Code" className="qr-image" />
                            </div>
                        </div>

                        <div className="qr-content-bottom">
                            <p className="qr-description">
                                Skip the wait. Scan to explore our <br />
                                <strong>Digital Culinary Journey</strong> and order <br />
                                directly from your table.
                            </p>

                            <button className="btn-premium-explore" onClick={handleGetStarted}>
                                <span className="btn-text">EXPLORE THE MENU</span>
                                <span className="btn-icon">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QrCodeSection;
