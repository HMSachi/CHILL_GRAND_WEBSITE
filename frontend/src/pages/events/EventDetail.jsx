import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/pages/EventDetail.css';

import { allEvents, uiLabels } from '../../data/eventsData';

const EventDetail = () => {
    const { id } = useParams();

    const event = React.useMemo(() => {
        return allEvents.find(e => e.id === parseInt(id));
    }, [id]);

    if (!event) {
        return (
            <div className="event-not-found">
                <h2>Event not found</h2>
                <Link to="/events">{uiLabels.backBtn}</Link>
            </div>
        );
    }

    return (
        <div className="event-detail-page-premium">
            {/* Cinematic Background Overlay */}
            <div className="premium-bg-fix"></div>
            <div className="gold-particles"></div>

            <section className="premium-hero" style={{ backgroundImage: `url(${event.coverImg})` }}>
                <div className="hero-vignette"></div>
                <div className="premium-hero-overlay">
                    <div className="container hero-inner">
                        <div className="hero-content-box fade-in-up">
                            <div className="badge-wrapper">
                                <span className="event-badge-premium">{event.date}</span>
                            </div>
                            <h1 className="main-title-luxury">{event.title}</h1>
                            <div className="location-reveal">
                                <span className="location-icon">✧</span>
                                <p className="hero-subtext-elegant">{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK INFO BAR - UPGRADED GLASS */}
            <section className="quick-info-bar-floating">
                <div className="container info-grid-luxury">
                    <div className="info-item-premium">
                        <div className="info-icon-glow">🕒</div>
                        <div className="info-text-luxury">
                            <strong>{uiLabels.time}</strong>
                            <span>{event.time}</span>
                        </div>
                    </div>
                    <div className="info-item-premium">
                        <div className="info-icon-glow">📍</div>
                        <div className="info-text-luxury">
                            <strong>{uiLabels.venue}</strong>
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <div className="info-item-premium">
                        <div className="info-icon-glow">👥</div>
                        <div className="info-text-luxury">
                            <strong>{uiLabels.capacity}</strong>
                            <span>{event.capacity}</span>
                        </div>
                    </div>
                    <div className="info-item-premium">
                        <div className="info-icon-glow">👔</div>
                        <div className="info-text-luxury">
                            <strong>{uiLabels.dressCode}</strong>
                            <span>{event.dressCode}</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container main-content-wrapper">
                {/* OVERVIEW & HIGHLIGHTS */}
                <div className="overview-highlights-row">
                    <section className="overview-card-premium">
                        <h2 className="section-title-premium" style={{ fontStyle: 'normal' }}>{event.title}</h2>
                        <p className="description-text">{event.description}</p>
                        <div className="price-tag">
                            <strong>{uiLabels.entry}</strong> <span>{event.priceRange}</span>
                        </div>
                    </section>

                    <section className="highlights-card">
                        <h2 className="section-title-premium">{uiLabels.highlights}</h2>
                        <ul className="highlights-list">
                            {event.highlights?.map((h, i) => (
                                <li key={i}><span className="check-icon">✦</span> {h}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
