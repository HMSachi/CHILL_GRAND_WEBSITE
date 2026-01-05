import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../dummy/menuItemsData';
import '../styles/TrendingSection.css';

const TrendingSection = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const trendingItems = menuItems.filter(item => item.trending);

    // Duplicate items for seamless looping
    const displayItems = [...trendingItems, ...trendingItems];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || isPaused) return;

        let animationFrameId;
        let lastTimestamp = 0;
        const speed = 1.0; // Pixels per frame

        const scroll = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (scrollContainer) {
                scrollContainer.scrollLeft += speed;

                // Reset to start when we've scrolled past the first set of items
                // We use half of scrollWidth because we duplicated the items
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPaused, trendingItems.length]);

    return (
        <div className="trending-section">
            <h2 className="trending-title">Trending Now</h2>
            <div
                className="trending-scroll-container"
                ref={scrollRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {displayItems.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className="trending-card"
                        onClick={() => navigate(`/menu/${item.categoryId}`)}
                    >
                        <div className="trending-image-wrapper">
                            <img src={item.image} alt={item.name} className="trending-image" />
                            <div className="trending-badge">Trending</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingSection;
