import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import '../../styles/pages/PlanEvent.css';
import birthdayImg from '../../assets/dj.jpg'; // Placeholder
import engagementImg from '../../assets/restaurants.jpg'; // Placeholder
import gatheringImg from '../../assets/bar2.jpg'; // Placeholder
import lunchImg from '../../assets/private_dining.jpg'; // Placeholder

const EventTypes = () => {
    const events = [
        { title: 'Birthday Parties', img: birthdayImg },
        { title: 'Engagements', img: engagementImg },
        { title: 'Gatherings', img: gatheringImg },
        { title: 'Private Lunch', img: lunchImg },
    ];

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

            <div className="event-types-action">
                <Link to="/event-inquiry" className="btn-book-event">
                    Fill the form to book the event
                </Link>
            </div>
        </div>
    );
};

export default EventTypes;
