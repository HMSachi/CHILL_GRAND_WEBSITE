import React from 'react';
import '../../styles/components/ServiceCards.css';
import { services } from '../../dummy/mainData';

const ServiceCards = () => {
    const servicesData = services;

    return (
        <section className="service-cards-section">
            <div className="container">
                <div className="section-header-warehouse">
                    <div className="header-accent">Main Parts</div>
                    <h2 className="header-title">OUR CORE FEATURES</h2>
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

                                <div className="service-card-title">
                                    {service.title}
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
