import React from 'react';
import '../../styles/components/ServiceCards.css';
import { services } from '../../data/mainData';

const ServiceCards = () => {
    const servicesData = services;

    return (
        <section className="service-cards-section">
            <div className="container">
                <div className="section-header-warehouse">
                    <div className="header-accent">EXPERIENCE EXCELLENCE</div>
                    <h2 className="header-title">DISCOVER OUR SPACES</h2>
                    <div className="header-line"></div>
                </div>

                <div className="service-cards-grid">
                    {servicesData.map((service) => (
                        <div className="service-card" key={service.id}>
                            <div className="service-card-inner">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="service-card-image"
                                />

                                {/* Vertical title for collapsed state */}
                                <div className="service-card-title-vertical">
                                    <span>{service.title}</span>
                                </div>
                                
                                {/* Full content for expanded state */}
                                <div className="service-card-content">
                                    <div className="service-card-accent">CHILL GRAND</div>
                                    <div className="service-card-title-row">
                                        <h3 className="service-card-title">{service.title}</h3>
                                        <span className="service-card-arrow">→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceCards;
