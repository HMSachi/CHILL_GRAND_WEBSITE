import React from 'react';
import '../../styles/pages/About.css';
import { aboutTeamData } from '../../data/aboutData';

const AboutTeam = () => {
    return (
        <div className="team-gallery-section">
            <div className="team-gallery-container">
                
                {/* Image is fully visible, no crop, no text overlay */}
                <div className="team-gallery-image-frame">
                    <img src={aboutTeamData.teamImage} alt="Our Team" className="team-image" />
                </div>

                {/* Minimal, shortened text below the image */}
                <div className="team-gallery-content">
                    <div className="tg-title-area">
                        <span className="tg-eyebrow">The Visionaries</span>
                        <h2>The Hearts Behind <span>Chill Grand</span></h2>
                        <p className="tg-subtitle">
                            A family united by passion, precision, and genuine connection. Every member brings something irreplaceable to our story.
                        </p>
                        <p className="tg-desc">
                            From our award-winning chefs who craft every dish with meticulous care, to the master mixologists who turn every cocktail into an experience, our team is the true embodiment of hospitality excellence.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutTeam;
