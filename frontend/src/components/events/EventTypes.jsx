import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/PlanEvent.css';
import { eventTypesData } from '../../data/eventsData';

const EventTypes = () => {
    const navigate = useNavigate();
    const categories = eventTypesData;

    return (
        <section className="event-types-section">
            <div className="section-header">
                <span className="section-tag">Special Events</span>
                <h2 className="section-title">Celebrate Every Moment</h2>
                <div className="section-divider"></div>
            </div>

            <div className="events-mosaic">
                {categories.map((type, idx) => (
                    <div key={idx} className="mosaic-item" onClick={() => navigate(`/events/${type.id}`)}>
                        <img src={type.image} alt={type.title} />
                        <div className="mosaic-light-leak"></div>
                        <div className="mosaic-overlay">
                            <span className="mosaic-number">{type.id}</span>
                            <span className="mosaic-category">Experience</span>
                            <h3>{type.title}</h3>
                            <p className="mosaic-desc">{type.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EventTypes;
