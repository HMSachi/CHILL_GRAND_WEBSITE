import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import '../../styles/pages/PlanEvent.css';
import { eventTypes } from '../../dummy/eventsData';

const EventTypes = () => {
    const types = [
        { id: '01', title: '🎉 Birthday Parties', desc: 'Curated celebrations with vibrant energy and custom décor.', img: eventTypes[0].img },
        { id: '02', title: '💍 Wedding / Engagement', desc: 'Timeless ceremonies and elegant receptions in our grand hall.', img: eventTypes[1].img },
        { id: '03', title: '🎂 Anniversaries', desc: 'Intimate and romantic settings for your special milestones.', img: eventTypes[2].img },
        { id: '04', title: '👨‍👩‍👧 Family Gatherings', desc: 'Warm and inviting spaces for cherished family moments.', img: eventTypes[3].img },
        { id: '05', title: '💼 Corporate Events', desc: 'Sleek, professional networking in an elite environment.', img: eventTypes[1].img },
        { id: '06', title: '🎓 Graduation / Farewell', desc: 'Sophisticated parties to mark the end of an era.', img: eventTypes[0].img },
        { id: '07', title: '🍽️ Private Dining', desc: 'Exquisite fine dining journeys in complete privacy.', img: eventTypes[3].img },
        { id: '08', title: '🎶 DJ / Live Music', desc: 'High-energy nights with the city’s best performers.', img: eventTypes[2].img },
    ];

    return (
        <section className="event-types-section">
            <div className="section-header">
                <span className="section-tag">Bespoke Experiences</span>
                <h2 className="section-title">Celebrate Signature Moments</h2>
                <div className="section-divider"></div>
            </div>

            <div className="events-mosaic">
                {types.map((type, idx) => (
                    <div key={idx} className="mosaic-item">
                        <img src={type.img} alt={type.title} />
                        <div className="mosaic-light-leak"></div>
                        <div className="mosaic-overlay">
                            <span className="mosaic-number">{type.id}</span>
                            <span className="mosaic-category">Experience</span>
                            <h3>{type.title}</h3>
                            <p className="mosaic-desc">{type.desc}</p>
                            <Link to="/event-inquiry" className="mosaic-link">Request Proposal</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EventTypes;
