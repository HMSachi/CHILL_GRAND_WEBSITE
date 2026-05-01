import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetail.css';

import { allEvents, uiLabels } from '../dummy/eventsData';

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
        <div className="event-detail-page-v2">
            {/* PRE-HEADER NAV */}
            <div className="detail-nav">
                <div className="container">
                    <Link to="/events" className="back-btn-minimal">
                        <span>←</span> {uiLabels.backBtn}
                    </Link>
                </div>
            </div>

            {/* HERO SECTION */}
            <section className="premium-hero" style={{ backgroundImage: `url(${event.coverImg})` }}>
                <div className="premium-hero-overlay">
                    <div className="container hero-inner">
                        <div className="hero-content-box">
                            <span className="event-badge">{event.date}</span>
                            <h1 className="main-title">{event.title}</h1>
                            <p className="hero-subtext">{event.location}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK INFO BAR */}
            <section className="quick-info-bar">
                <div className="container info-grid">
                    <div className="info-item">
                        <span className="info-icon">🕒</span>
                        <div className="info-text">
                            <strong>{uiLabels.time}</strong>
                            <span>{event.time}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">📍</span>
                        <div className="info-text">
                            <strong>{uiLabels.venue}</strong>
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">👥</span>
                        <div className="info-text">
                            <strong>{uiLabels.capacity}</strong>
                            <span>{event.capacity}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">👔</span>
                        <div className="info-text">
                            <strong>{uiLabels.dressCode}</strong>
                            <span>{event.dressCode}</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container main-content-wrapper">
                {/* OVERVIEW & HIGHLIGHTS */}
                <div className="overview-highlights-row">
                    <section className="overview-card">
                        <p className="description-text">{event.description}</p>
                        <div className="price-tag">
                            <strong>{uiLabels.entry}</strong> {event.priceRange}
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
