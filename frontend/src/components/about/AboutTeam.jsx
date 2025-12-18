import React from 'react';
import '../../styles/pages/About.css';
import teamImage from '../../assets/bar.jpg'; // Placeholder

const AboutTeam = () => {
    return (
        <div className="about-section about-team">
            <div className="about-image-left">
                <img src={teamImage} alt="Our Team" />
            </div>
            <div className="about-content-right">
                <span className="section-subtitle">OUR TEAM</span>
                <h2 className="section-title">Use the Tips & Recipes of quality</h2>
                <button className="btn-read-more">READ MORE</button>
            </div>
        </div>
    );
};

export default AboutTeam;
