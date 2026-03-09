import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/About.css';
import chefImage from '../../assets/private_dining.jpg'; // Placeholder

const AboutIntro = () => {
    return (
        <div className="about-section about-intro">
            <div className="about-content-left">
                <span className="section-subtitle">SINCE 2025 — THE LEGACY</span>
                <h2 className="section-title">
                    A WORLD OF <br />
                    <span>GOURMET EXCELLENCE</span> <br />
                    & VIBRANT SPIRITS
                </h2>
                <p className="section-description">
                    Chill Grand is where the fusion of culinary mastery and a high-energy bar atmosphere comes to life. We believe that every meal should be an event, and every drink a celebration. Our curated selection of gourmet dishes and artisanal cocktails are designed to intrigue the senses and create unforgettable memories.
                </p>

            </div>
        </div>
    );
};

export default AboutIntro;
