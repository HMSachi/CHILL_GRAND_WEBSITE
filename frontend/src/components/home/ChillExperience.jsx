import React, { useRef, useEffect } from "react";
import "../../styles/components/ChillExperience.css";
import bar1 from "../../assets/bar.jpg";
import bar2 from "../../assets/bar2.jpg";
import party1 from "../../assets/private_dining.jpg";
import scene1 from "../../assets/restaurants.jpg";

const experienceItems = [
    {
        id: 1,
        title: "LIVE MUSIC & DJs",
        subtitle: "VIBRANT NIGHTLIFE",
        image: bar1
    },
    {
        id: 2,
        title: "SIGNATURE COCKTAILS",
        subtitle: "ARTISANAL MIXOLOGY",
        image: bar2
    },
    {
        id: 3,
        title: "PRIVATE PARTIES",
        subtitle: "EXCLUSIVE CELEBRATIONS",
        image: party1
    },
    {
        id: 4,
        title: "PREMIUM SPIRITS",
        subtitle: "CURATED COLLECTION",
        image: scene1
    }
];

const ChillExperience = () => {
    const scrollRef = useRef(null);
    const items = experienceItems;
    const infiniteItems = [...items, ...items, ...items];

    useEffect(() => {
        const container = scrollRef.current;
        let animationId;
        let pause = false;
        const speed = 0.8;

        const setupScroll = () => {
            if (!container || !container.children[0]) return;

            const card = container.children[0];
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
            const singleSetWidth = (cardWidth + gap) * items.length;

            if (container.scrollLeft === 0) {
                container.scrollLeft = singleSetWidth;
            }

            const scroll = () => {
                if (!pause && container) {
                    container.scrollLeft -= speed;
                    if (container.scrollLeft <= 0) {
                        container.scrollLeft = singleSetWidth;
                    }
                }
                animationId = requestAnimationFrame(scroll);
            };

            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(scroll);
        };

        setTimeout(setupScroll, 100);

        const onEnter = () => pause = true;
        const onLeave = () => pause = false;

        container.addEventListener("mouseenter", onEnter);
        container.addEventListener("mouseleave", onLeave);

        return () => {
            cancelAnimationFrame(animationId);
            if (container) {
                container.removeEventListener("mouseenter", onEnter);
                container.removeEventListener("mouseleave", onLeave);
            }
        };
    }, [items.length]);

    return (
        <section className="chill-experience" id="experience">
            <div className="container">
                <div className="section-header-warehouse">
                    <div className="header-accent">The Atmosphere</div>
                    <h2 className="header-title">CHILL VIBES</h2>
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
                                BROWSE<br />MOMENTS
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ChillExperience;
