import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../../styles/pages/PlanEvent.css';
import { eventsHeroData } from '../../data/eventsData';

const EventHero = () => {
    return (
        <section className="event-hero" style={{ backgroundImage: `url(${eventsHeroData.heroBg})` }}>
            <div className="event-hero-overlay">
                <div className="hero-content-minimal">
                    <span className="minimal-tagline">Exquisite Experiences</span>
                    <h1 className="minimal-title">Plan Your Event</h1>
                    <div className="hero-btn-container">
                        <Link to="/event-inquiry" className="btn-minimal-gold">
                            Fill The Form
                        </Link>
                        <Link to="/event-inquiry?track=true" className="btn-minimal-gold">
                            <FaSearch /> Track / View Your Booking Status
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Minimal Scroll indicator */}
            <div className="scroll-indicator">
                <span>SCROLL</span>
                <div className="scroll-line"></div>
            </div>
        </section>
    );
};

export default EventHero;
