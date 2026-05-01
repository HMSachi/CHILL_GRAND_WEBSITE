import React from 'react';
import '../../styles/pages/About.css';
import dining1 from '../../assets/about.jpg';
import bar1 from '../../assets/bar.jpg';
import bar2 from '../../assets/bar2.jpg';
import aboutImg from '../../assets/about2.jpg';
import dining2 from '../../assets/restaurants.jpg';

const AboutStory = () => {
    return (
        <section className="about-story-section">
            <div className="about-story-grid">
                {/* Row 1 */}
                <div className="story-image-item">
                    <img src={dining1} alt="Chill Grand Burger" />
                </div>

                <div className="story-content-item">
                    <div className="story-content-inner">
                        <span className="story-label">STORY OF CHILL GRAND</span>
                        <p className="story-text">
                            Chill Grand is a modern kitchen and pub created with freshness and vibrancy in mind.
                            Every detail is handcrafted to ensure a unique atmosphere where gourmet excellence
                            meets a high-energy pulse.
                        </p>
                        <div className="story-brand">
                            <h2 className="story-title-bottom">CHILL GRAND</h2>
                            <span className="brand-tag">RESTAURANT & PUB</span>
                        </div>
                    </div>
                </div>

                <div className="story-image-item">
                    <img src={aboutImg} alt="Chill Grand Dining" />
                </div>

                {/* Row 2 */}
                <div className="story-image-item">
                    <img src={bar1} alt="Chill Grand Cocktail" />
                </div>

                <div className="story-image-item">
                    <img src={dining2} alt="Chill Grand Private Dining" />
                </div>

                <div className="story-image-item">
                    <img src={bar2} alt="Chill Grand Bartender" />
                </div>
            </div>
        </section>
    );
};

export default AboutStory;
