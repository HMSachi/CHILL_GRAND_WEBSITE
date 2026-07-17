import React from 'react';
import '../../styles/pages/About.css';
import { aboutStoryData } from '../../data/aboutData';

const AboutStory = () => {
    return (
        <section className="about-story-section">
            <div className="about-story-grid">
                {/* Row 1 */}
                <div className="story-image-item">
                    <img src={aboutStoryData.dining1} alt="Chill Grand Burger" />
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
                    <img src={aboutStoryData.aboutImg} alt="Chill Grand Dining" />
                </div>

                {/* Row 2 */}
                <div className="story-image-item">
                    <img src={aboutStoryData.bar1} alt="Chill Grand Bar" />
                </div>

                <div className="story-image-item middle-story">
                    <img src={aboutStoryData.dining2} alt="Chill Grand Experience" />
                </div>

                <div className="story-image-item">
                    <img src={aboutStoryData.bar2} alt="Chill Grand Bartender" />
                </div>
            </div>
        </section>
    );
};

export default AboutStory;
