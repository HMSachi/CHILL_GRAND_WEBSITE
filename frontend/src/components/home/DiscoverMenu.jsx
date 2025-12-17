import React, { useRef, useEffect } from "react";
import "../../styles/components/DiscoverMenu.css";

import imgRestaurant from "../../assets/restaurants.jpg";
import imgCocktail from "../../assets/cocktail.jpg";
import imgDining from "../../assets/private_dining.jpg";
import imgDessert from "../../assets/dessert.jpg";

const DiscoverMenu = () => {
    const scrollRef = useRef(null);

    const menuItems = [
        {
            title: "Special Menus",
            subtitle: "Discover our special menus",
            image: imgRestaurant,
            id: 1
        },
        {
            title: "Cocktails",
            subtitle: "Enjoy!",
            image: imgCocktail,
            id: 2
        },
        {
            title: "Fine Dining",
            subtitle: "Experience luxury",
            image: imgDining,
            id: 3
        },
        {
            title: "Desserts",
            subtitle: "Sweet treats",
            image: imgDessert,
            id: 4
        }
    ];

    const infiniteItems = [...menuItems, ...menuItems, ...menuItems];

    useEffect(() => {
        const container = scrollRef.current;
        let animationId;
        let pause = false;
        const speed = 0.4;

        const scroll = () => {
            if (!pause && container) {
                container.scrollLeft += speed;
                if (container.scrollLeft >= container.scrollWidth / 3) {
                    container.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(scroll);
        };

        container.addEventListener("mouseenter", () => pause = true);
        container.addEventListener("mouseleave", () => pause = false);

        animationId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <section className="discover-menu">
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
