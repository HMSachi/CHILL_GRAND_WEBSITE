import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/PlanEvent.css';
import { eventsHeroData } from '../../data/eventsData';

const EventHero = () => {
    return (
        <section className="event-hero" style={{ backgroundImage: `url(${eventsHeroData.heroBg})` }}>
            <div className="event-hero-overlay">
                <div className="event-hero-content">
                    <h1 className="event-hero-title fade-up">
                        PLAN YOUR <span className="title-gold">EVENT</span>
                    </h1>
                    <div className="event-divider-line fade-up-delay-2">
                        <span className="divider-diamond">◆</span>
                    </div>
                    <p className="event-hero-description fade-up-delay-2">
                        From vibrant celebrations and cocktail nights to corporate gatherings, craft unforgettable memories at Chill Grand.
                    </p>
                    <div className="event-hero-actions fade-up-delay-3">
                        <Link to="/event-inquiry" className="btn-event-primary">
                            <span className="btn-event-shine"></span>
                            <span className="btn-event-text">Fill The Form</span>
                        </Link>
                        <Link to="/event-inquiry?track=true" className="btn-event-secondary">
                            <span className="btn-event-text">Track Booking Status</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventHero;
