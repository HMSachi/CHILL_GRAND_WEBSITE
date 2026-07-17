import React, { useState, useEffect } from 'react';
import '../../styles/components/FeaturedDishes.css';

import { featuredDishes } from '../../data/dishesData';

const FeaturedDishes = () => {
    const dishes = featuredDishes;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);

    // Responsive items count
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % (dishes.length - itemsToShow + 1)
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? 0 : prevIndex - 1
        );
    };

    // Disable buttons at boundaries
    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex >= dishes.length - itemsToShow;

    return (
        <section className="featured-dishes">
            <div className="container">
                <h2 className="section-title text-center">Featured Dishes</h2>
                <div className="underline"></div>

                <div className="carousel-container">
                    <button
                        className={`nav-btn prev-btn ${isPrevDisabled ? 'disabled' : ''}`}
                        onClick={prevSlide}
                        disabled={isPrevDisabled}
                    >
                        &lt;
                    </button>

                    <div className="dishes-viewport">
                        <div
                            className="dishes-track"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
                            }}
                        >
                            {dishes.map((dish) => (
                                <div
                                    className="dish-card-wrapper"
                                    key={dish.id}
                                    style={{ flex: `0 0 ${100 / itemsToShow}%` }}
                                >
                                    <div className="dish-card">
                                        <div className="dish-image-container">
                                            <div className="dish-bg-shape"></div>
                                            <img src={dish.image} alt={dish.name} className="dish-img" />
                                        </div>
                                        <div className="dish-info">
                                            <h3>{dish.name}</h3>
                                            <div className="dish-price-row">
                                                <span className="price">{dish.price}</span>
                                                <button className="btn-add">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className={`nav-btn next-btn ${isNextDisabled ? 'disabled' : ''}`}
                        onClick={nextSlide}
                        disabled={isNextDisabled}
                    >
                        &gt;
                    </button>
                </div>

                <div className="pagination-dots">
                    {Array.from({ length: dishes.length - itemsToShow + 1 }).map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedDishes;
