import React from 'react';
import '../../styles/components/ServiceCards.css';
import imgRestaurant from '../../assets/restaurants.jpg';
import imgCocktail from '../../assets/cocktail.jpg';
import imgDining from '../../assets/private_dining.jpg';

const ServiceCards = () => {
    const services = [
        {
            title: 'Restaurant',
            image: imgRestaurant,
        },
        {
            title: 'Cocktail Bar',
            image: imgCocktail,
        },
        {
            title: 'Private Dining',
            image: imgDining,
        }
    ];

    return (
        <section className="service-cards-section">
            <div className="container">
                <div className="service-cards-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
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
