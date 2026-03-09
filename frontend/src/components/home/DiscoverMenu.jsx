import React, { useRef, useEffect } from "react";
import "../../styles/components/DiscoverMenu.css";

import imgRestaurant from "../../assets/restaurants.jpg";
import imgCocktail from "../../assets/cocktail.jpg";
import imgDining from "../../assets/private_dining.jpg";
import imgDessert from "../../assets/dessert.jpg";
import Music from "../../assets/dj.jpg";

const DiscoverMenu = () => {
    const scrollRef = useRef(null);

    const menuItems = [
        {
            title: "Gourmet Mains",
            subtitle: "Exquisite culinary creations",
            image: imgRestaurant,
            id: 1
        },
        {
            title: "Signature Cocktails",
            subtitle: "Crafted by experts",
            image: imgCocktail,
            id: 2
        },
        {
            title: "Pub Snacks",
            subtitle: "Perfect pairings",
            image: imgDining,
            id: 3
        },
        {
            title: "Craft Collection",
            subtitle: "Premium spirits",
            image: imgDessert,
            id: 4
        },
        {
            title: "Classic Bites",
            subtitle: "Always a favorite",
            image: imgRestaurant,
            id: 5
        },
        {
            title: "Lunch Specials",
            subtitle: "Mid-day delight",
            image: imgDining,
            id: 6
        },
        {
            title: "Evening Vibes",
            subtitle: "Nightlife energy",
            image: imgCocktail,
            id: 7
        },
        {
            title: "Private Events",
            subtitle: "Celebrate in style",
            image: Music,
            id: 8
        },
        {
            title: "Weekly Brunch",
            subtitle: "Weekend relaxation",
            image: imgRestaurant,
            id: 9
        },
        {
            title: "Late Night Menu",
            subtitle: "After hours snacks",
            image: imgCocktail,
            id: 10
        }
    ];

    const infiniteItems = [...menuItems, ...menuItems, ...menuItems];

    useEffect(() => {
        const container = scrollRef.current;
        let animationId;
        let pause = false;
        const speed = 0.8; // Slightly faster for smoother feel

        const setupScroll = () => {
            if (!container || !container.children[0]) return;

            const card = container.children[0];
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
            const singleSetWidth = (cardWidth + gap) * menuItems.length;

            // Initialize scroll position to the start of the second set
            if (container.scrollLeft === 0) {
                container.scrollLeft = singleSetWidth;
            }

            const scroll = () => {
                if (!pause && container) {
                    container.scrollLeft -= speed;

                    // If we have scrolled past the start (into the first set), reset to the second set
                    if (container.scrollLeft <= 0) {
                        container.scrollLeft = singleSetWidth;
                    }
                }
                animationId = requestAnimationFrame(scroll);
            };

            // Cancel previous animation if any
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(scroll);
        };

        // Wait for layout to be ready
        setTimeout(setupScroll, 100);

        container.addEventListener("mouseenter", () => pause = true);
        container.addEventListener("mouseleave", () => pause = false);

        return () => {
            cancelAnimationFrame(animationId);
            container.removeEventListener("mouseenter", () => pause = true);
            container.removeEventListener("mouseleave", () => pause = false);
        };
    }, [menuItems.length]);

    return (
        <section className="discover-menu" id="menu">
            <div className="container">
                <h2 className="section-title">Discover Menu</h2>
                <div className="underline"></div>

                <div className="menu-scroll-container" ref={scrollRef}>
                    {infiniteItems.map((item, index) => (
                        <div className="menu-card" key={`${item.id}-${index}`}>

                            <div className="menu-image-wrapper">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="menu-bg"
                                />

                                <div className="menu-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.subtitle}</p>
                                </div>
                            </div>

                            <button className="btn-see-menu">
                                See<br />More
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DiscoverMenu;
