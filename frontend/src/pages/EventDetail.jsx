import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/pages/EventDetail.css';

// Placeholder imports
import event1 from '../assets/bar.jpg';
import event2 from '../assets/dj.jpg';
import event3 from '../assets/private_dining.jpg';
import food1 from '../assets/food.jpg';
import food2 from '../assets/dessert.jpg';
import food3 from '../assets/cocktail.jpg';

// Mock Data (simulating backend)
const eventsData = [
    {
        id: 1,
        title: 'Corporate Gala 2024',
        date: 'Dec 15, 2024',
        coverImg: event1,
        description: 'A wonderful night of networking and fine dining. The event featured a keynote speech by industry leaders, followed by a gourmet dinner and live jazz performance.',
        gallery: [event1, event2, event3, event1],
        menu: [
            { name: 'Grilled Salmon', img: food1 },
            { name: 'Chocolate Lava Cake', img: food2 },
            { name: 'Signature Cocktail', img: food3 },
        ]
    },
    {
        id: 2,
        title: 'Smith Wedding',
        date: 'Nov 20, 2024',
        coverImg: event2,
        description: 'Celebrating love with a magical reception. The venue was decorated with white roses and fairy lights, creating a romantic atmosphere for the newlyweds and their guests.',
        gallery: [event2, event3, event1, event2],
        menu: [
            { name: 'Roast Chicken', img: food1 },
            { name: 'Wedding Cake', img: food2 },
            { name: 'Champagne', img: food3 },
        ]
    },
    {
        id: 3,
        title: 'Tech Meetup',
        date: 'Oct 05, 2024',
        coverImg: event3,
        description: 'Innovative discussions over great food. Tech enthusiasts gathered to discuss the latest trends in AI and web development, accompanied by a casual buffet.',
        gallery: [event3, event1, event2, event3],
        menu: [
            { name: 'Mini Burgers', img: food1 },
            { name: 'Fruit Tart', img: food2 },
            { name: 'Craft Beer', img: food3 },
        ]
    },
];

const EventDetail = () => {
    const { id } = useParams();

    const event = React.useMemo(() => {
        return eventsData.find(e => e.id === parseInt(id));
    }, [id]);

    if (!event) {
        return <div className="event-not-found"><h2>Event not found</h2><Link to="/plan-event">Back to Events</Link></div>;
    }

    return (
        <div className="event-detail-page">
            {/* HERO SECTION */}
            <div className="detail-hero" style={{ backgroundImage: `url(${event.coverImg})` }}>
                <div className="detail-hero-overlay">
                    <div className="detail-hero-content">
                        <span className="detail-date">{event.date}</span>
                        <h1 className="detail-title">{event.title}</h1>
                    </div>
                </div>
            </div>

            <div className="detail-container">
                {/* OVERVIEW */}
                <section className="detail-section">
                    <h2 className="section-heading">Event Overview</h2>
                    <p className="detail-description">{event.description}</p>
                </section>

                {/* GALLERY */}
                <section className="detail-section">
                    <h2 className="section-heading">Gallery & Decorations</h2>
                    <div className="detail-gallery-grid">
                        {event.gallery.map((img, index) => (
                            <div key={index} className="gallery-item">
                                <img src={img} alt={`Gallery ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOD MENU */}
                <section className="detail-section">
                    <h2 className="section-heading">Food & Drinks Served</h2>
                    <div className="detail-menu-grid">
                        {event.menu.map((item, index) => (
                            <div key={index} className="menu-item-card">
                                <div className="menu-img">
                                    <img src={item.img} alt={item.name} />
                                </div>
                                <h3 className="menu-name">{item.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="back-link-wrapper">
                    <Link to="/plan-event" className="btn-back">← Back to All Events</Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
