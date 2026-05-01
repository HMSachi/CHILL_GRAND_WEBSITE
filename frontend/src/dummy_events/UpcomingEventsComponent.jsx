import React from 'react';
import { Link } from 'react-router-dom';
import './UpcomingEvents.css';

import { upcomingEvents } from '../dummy/eventsData';

const UpcomingEvents = () => {
    return (
        <section className="upcoming-events-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">What's Happening</span>
                    <h2 className="section-title">Upcoming Events</h2>
                </div>

                <div className="events-grid">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="event-card">
                            <div className="event-image-wrapper">
                                <img src={event.coverImg} alt={event.title} className="event-card-img" />
                                <div className="event-date-badge">{event.date}</div>
                            </div>
                            <div className="event-card-content">
                                <h3 className="event-card-title">{event.title}</h3>
                                <p className="event-card-description">{event.highlights && event.highlights[0]} & more...</p>
                                <Link to={`/event/${event.id}`} className="event-card-link">View Details →</Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section-footer">
                    <Link to="/events" className="btn-view-all">View All Events</Link>
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
