import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Events.css';
import '../styles/components/UpcomingEvents.css';

// Placeholder images
import event1 from '../assets/bar.jpg';
import event2 from '../assets/dj.jpg';
import event3 from '../assets/private_dining.jpg';

const allEvents = [
    {
        id: 4,
        title: 'New Year Eve Bash',
        date: 'Dec 31, 2024',
        image: event2,
        category: 'upcoming',
        description: 'Count down to midnight with our exclusive DJ performance and a midnight champagne toast.'
    },
    {
        id: 5,
        title: 'Wine Tasting Night',
        date: 'Jan 15, 2025',
        image: event1,
        category: 'upcoming',
        description: 'Explore a curated selection of fine wines paired with gourmet small bites.'
    },
    {
        id: 6,
        title: 'Private Jazz Dinner',
        date: 'Feb 14, 2025',
        image: event3,
        category: 'upcoming',
        description: 'A romantic evening featuring a live jazz quartet and a special Valentine\'s tasting menu.'
    }
];

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
            </div>
        </div>
    );
};

export default Events;
