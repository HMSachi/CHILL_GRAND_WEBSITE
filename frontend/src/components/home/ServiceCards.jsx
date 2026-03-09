import React from 'react';
import '../../styles/components/ServiceCards.css';
import imgRestaurant from '../../assets/restaurants.jpg';
import imgCocktail from '../../assets/cocktail.jpg';
import imgDining from '../../assets/private_dining.jpg';

const ServiceCards = () => {
    const services = [
        {
            id: 1,
            title: 'VIP Karaoke',
            image: imgDining, // Placeholder
        },
        {
            id: 2,
            title: 'Function Hall',
            image: imgRestaurant, // Placeholder
        },
        {
            id: 3,
            title: 'Karaoke Pub',
            image: imgCocktail, // Placeholder
        },
        {
            id: 4,
            title: 'BYOB Facilities',
            image: imgDining, // Placeholder
        },
        {
            id: 5,
            title: 'Take Away & Dining',
            image: imgRestaurant, // Placeholder
        }
    ];

    return (
        <section className="service-cards-section">
            <div className="container">
                <div className="section-header-warehouse">
                    <div className="header-accent">Main Parts</div>
                    <h2 className="header-title">OUR CORE FEATURES</h2>
                </div>

                <div className="service-cards-grid">
                    {services.map((service) => (
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
