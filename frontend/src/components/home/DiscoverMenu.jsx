import React, { useRef, useEffect } from "react";
import "../../styles/components/DiscoverMenu.css";

import { discoverMenuItems } from "../../dummy/menuData";

const DiscoverMenu = () => {
    const scrollRef = useRef(null);
    const menuItems = discoverMenuItems;

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
                <div className="section-header-warehouse">
                    <div className="header-accent">Our Selection</div>
                    <h2 className="header-title">DISCOVER MENU</h2>
                </div>

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
