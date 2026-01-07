import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../styles/QRNavbar.css';

const QRNavbar = () => {
    return (
        <nav className="qr-navbar">
            <div className="qr-navbar-container">
                <Link to="/landing" className="qr-logo-link">
                    <img src={logo} alt="Chill Grand Logo" className="qr-logo-img" />
                </Link>
            </div>
        </nav>
    );
};

export default QRNavbar;
