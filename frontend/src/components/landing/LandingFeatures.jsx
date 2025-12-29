import React from 'react';
import { FaUtensils, FaClock, FaStar } from 'react-icons/fa';
import '../../styles/components/landing/LandingFeatures.css';

const LandingFeatures = () => {
    return (
        <section className="landing-features-section">
            <div className="features-section-container">
                <h2 className="features-section-title">
                    Why Choose Chill Grand?
                </h2>

                <div className="features-cards-grid">
                    <div className="features-card">
                        <div className="features-card-icon">
                            <FaUtensils />
                        </div>
                        <h3>Exquisite Cuisine</h3>
                        <p>Handcrafted dishes made with the finest ingredients</p>
                    </div>

                    <div className="features-card">
                        <div className="features-card-icon">
                            <FaClock />
                        </div>
                        <h3>Quick Service</h3>
                        <p>Order via QR code and get served in minutes</p>
                    </div>

                    <div className="features-card">
                        <div className="features-card-icon">
                            <FaStar />
                        </div>
                        <h3>Premium Experience</h3>
                        <p>Luxury ambiance with exceptional service</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;
