import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import '../../styles/pages/PlanEvent.css';
import { eventTypes } from '../../dummy/eventsData';

const EventTypes = () => {
    const events = eventTypes;

    return (
        <div className="event-types-section">
            <SectionHeader title="Plan Your Events" />

            <div className="event-types-grid">
                {events.map((event, index) => (
                    <div key={index} className="event-type-card">
                        <div className="event-img-wrapper">
                            <img src={event.img} alt={event.title} />
                        </div>
                        <h3 className="event-type-title">{event.title}</h3>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default EventTypes;
