import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/About.css';
import qrBg from '../../assets/restaurants.jpg'; // Placeholder
import qrCode from '../../assets/logo.png'; // Placeholder for QR code

const QrCodeSection = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/categories');
    };

    return (
        <div className="qr-section" style={{ backgroundImage: `url(${qrBg})` }}>
            <div className="qr-overlay">

                <div className="qr-card-right">
                    <h3 className="qr-card-title">PRIVATE EXPERIENCE</h3>
                    <div className="qr-code-large" onClick={handleGetStarted} style={{ cursor: 'pointer' }}>
                        <img src={qrCode} alt="Scan QR Code" />
                    </div>
                    <p className="qr-instruction">Scan to explorer our <br />digital culinary journey.</p>
                    <button className="btn-get-start" onClick={handleGetStarted}>EXPLORE NOW</button>
                </div>
            </div>
        </div>
    );
};

export default QrCodeSection;
