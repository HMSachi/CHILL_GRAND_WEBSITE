import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/PlanEvent.css';
import heroBg from '../../assets/event.png';

const EventHero = () => {
    return (
        <div className="event-hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="event-hero-overlay">
                <div className="hero-content-minimal">
                    <span className="minimal-tagline">Exquisite Experiences</span>
                    <h1 className="minimal-title">Plan Your Event</h1>
                    <Link to="/event-inquiry" className="btn-minimal-gold">
                        Fill The Form
                    </Link>
                </div>
            </div>
            
            {/* Minimal Scroll indicator */}
            <div className="scroll-indicator">
                <span>SCROLL</span>
                <div className="scroll-line"></div>
            </div>
        </div>
    );
};

export default EventHero;
