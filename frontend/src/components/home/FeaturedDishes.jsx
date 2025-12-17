import React, { useState, useEffect } from 'react';
import '../../styles/components/FeaturedDishes.css';

const FeaturedDishes = () => {
    const dishes = [
        {
            name: 'Grilled Fried Chicken',
            price: 'Rs.2500.00',
            image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 1
        },
        {
            name: 'Mixed Green Salad',
            price: 'Rs.1000.00',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 2
        },
        {
            name: 'Pasta',
            price: 'Rs.1850.00',
            image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 3
        },
        {
            name: 'Beef Burger',
            price: 'Rs.1500.00',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 4
        },
        {
            name: 'Seafood Pizza',
            price: 'Rs.2200.00',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 5
        },
        {
            name: 'Chocolate Cake',
            price: 'Rs.850.00',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 6
        }
    ];

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
