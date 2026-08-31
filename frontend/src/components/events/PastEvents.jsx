import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import '../../styles/pages/PlanEvent.css';
import { pastEvents } from '../../data/eventsData';

const PastEvents = () => {
    const events = pastEvents;

    return (
        <div className="past-events-section">
            <SectionHeader
                title="Our Past Events"
                subtitle="Take a look at some of the memorable moments we've hosted."
            />

            <div className="all-events-grid">
                {events.map((event) => (
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
                                Explore Moments <span>→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PastEvents;
