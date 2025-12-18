import React from 'react';
import '../../styles/pages/About.css';
import qrBg from '../../assets/restaurants.jpg'; // Placeholder
import qrCode from '../../assets/logo.png'; // Placeholder for QR code

const QrCodeSection = () => {
    return (
        <div className="qr-section" style={{ backgroundImage: `url(${qrBg})` }}>
            <div className="qr-overlay">
                <div className="qr-content-left">
                    <h2 className="qr-title">Simple Way To<br />Order Your Foods</h2>
                    <div className="qr-small-card">
                        <img src={qrCode} alt="Small QR" className="small-qr-img" />
                        <div className="qr-text">
                            <span>GET IT ON</span>
                            <strong>QR code</strong>
                        </div>
                    </div>
                </div>
                <div className="qr-card-right">
                    <h3 className="qr-card-title">Scan QR Code</h3>
                    <div className="qr-code-large">
                        <img src={qrCode} alt="Scan QR Code" />
                    </div>
                    <p className="qr-instruction">Scan the QR code and order food.<br />Enjoy your meal!</p>
                    <button className="btn-get-start">Get Start</button>
                </div>
            </div>
        </div>
    );
};

export default QrCodeSection;
