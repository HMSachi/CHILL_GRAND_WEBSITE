import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import '../../styles/pages/PlanEvent.css';
import event1 from '../../assets/bar.jpg'; // Placeholder
import event2 from '../../assets/dj.jpg'; // Placeholder
import event3 from '../../assets/private_dining.jpg'; // Placeholder

const PastEvents = () => {
    // Mock data - in future this will come from backend
    const pastEvents = [
        { id: 1, title: 'Corporate Gala 2024', date: 'Dec 15, 2024', img: event1, desc: 'A wonderful night of networking and fine dining.' },
        { id: 2, title: 'Smith Wedding', date: 'Nov 20, 2024', img: event2, desc: 'Celebrating love with a magical reception.' },
        { id: 3, title: 'Tech Meetup', date: 'Oct 05, 2024', img: event3, desc: 'Innovative discussions over great food.' },
    ];

    return (
        <div className="past-events-section">
            <SectionHeader
                title="Our Past Events"
                subtitle="Take a look at some of the memorable moments we've hosted."
            />

            <div className="past-events-grid">
                {pastEvents.map((event) => (
                    <Link to={`/event/${event.id}`} key={event.id} className="past-event-link">
                        <div className="past-event-card">
                            <div className="past-event-img">
                                <img src={event.img} alt={event.title} />
                                <span className="event-date">{event.date}</span>
                            </div>
                            <div className="past-event-info">
                                <h3>{event.title}</h3>
                                <p>{event.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PastEvents;
