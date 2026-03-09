import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/UpcomingEvents.css';

// Placeholder images
import event1 from '../../assets/bar.jpg';
import event2 from '../../assets/dj.jpg';
import event3 from '../../assets/private_dining.jpg';

const upcomingEvents = [
    {
        id: 4,
        title: 'New Year Eve Bash',
        date: 'Dec 31, 2024',
        image: event2,
        description: 'Count down to midnight with our exclusive DJ performance and a midnight champagne toast.'
    },
    {
        id: 5,
        title: 'Wine Tasting Night',
        date: 'Jan 15, 2025',
        image: event1,
        description: 'Explore a curated selection of fine wines paired with gourmet small bites.'
    },
    {
        id: 6,
        title: 'Private Jazz Dinner',
        date: 'Feb 14, 2025',
        image: event3,
        description: 'A romantic evening featuring a live jazz quartet and a special Valentine\'s tasting menu.'
    }
];

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
                                <img src={event.image} alt={event.title} className="event-card-img" />
                                <div className="event-date-badge">{event.date}</div>
                            </div>
                            <div className="event-card-content">
                                <h3 className="event-card-title">{event.title}</h3>
                                <p className="event-card-description">{event.description}</p>
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
