import React from 'react';
import { Link } from 'react-router-dom';
import './Events.css';
import './UpcomingEvents.css';

import { allEvents } from '../dummy/eventsData';

const Events = () => {
    return (
        <div className="events-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Upcoming Events</h1>
                    <p className="page-description">Join us for these special occasions at Chill Grand.</p>
                </div>

                <div className="all-events-grid">
                    {allEvents.map(event => (
                        <div key={event.id} className="event-card-premium">
                            <div className="card-image-box">
                                <img src={event.coverImg} alt={event.title} />
                                <div className="card-date-overlay">{event.date}</div>
                            </div>
                            <div className="card-details">
                                <span className="card-location-tag">{event.location}</span>
                                <h3 className="card-title">{event.title}</h3>
                                <p className="card-excerpt">{event.highlights && event.highlights[0]} & more...</p>
                                <Link to={`/event/${event.id}`} className="card-btn-view">
                                    Explore Details <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
