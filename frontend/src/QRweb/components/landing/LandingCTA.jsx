import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode } from 'react-icons/fa';
import '../../styles/components/landing/LandingCTA.css';

const LandingCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="landing-cta-section">
            <div className="cta-section-content">
                <h2 className="cta-section-title">Ready to Experience Excellence?</h2>
                <p className="cta-section-description">
                    Join thousands of satisfied diners who trust Chill Grand
                </p>
                <button className="cta-action-btn" onClick={() => navigate('/categories')}>
                    <FaQrcode className="cta-btn-icon" />
                    View Categories Now
                </button>
            </div>
            <div className="cta-background-effects">
                <div className="cta-effect-shape cta-shape-one"></div>
                <div className="cta-effect-shape cta-shape-two"></div>
            </div>
        </section>
    );
};

export default LandingCTA;
