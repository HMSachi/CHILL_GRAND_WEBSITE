import React from 'react';
import '../../styles/pages/About.css';
import teamImage from '../../assets/visionaries.png';

const AboutTeam = () => {
    return (
        <div className="about-section about-team">
            <div className="about-image-left">
                <img src={teamImage} alt="Our Team" />
            </div>
            <div className="about-content-right">
                <span className="section-subtitle">THE VISIONARIES</span>
                <h2 className="section-title">Crafting the <span>Atmosphere of Chill</span></h2>
                <p className="section-description">
                    Our team consists of award-winning chefs and master mixologists who are passionate about the art of hospitality. We don't just serve food and drinks; we curate experiences that stay with you.
                </p>
            </div>
        </div>
    );
};

export default AboutTeam;
