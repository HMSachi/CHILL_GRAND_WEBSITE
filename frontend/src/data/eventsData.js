// eventsData.js - Contains all dummy data for Events page components

import heroBg from '../assets/event.png';
import djImg from '../assets/karaoke_pub.png';
import corporateImg from '../assets/Corporate Events.png';
import graduationImg from '../assets/Graduation.jpg';
import farewellImg from '../assets/farewell.png';
import engagementPhoto from '../assets/Engagement.jpg';
import meetupImg from '../assets/meetup.png';
import anniversaryImg from '../assets/anniverssary.png';
import familyGatheringImg from '../assets/gathering.png';

// Legacy Event Data from dummy/eventsData.js
import birthdayImg from '../assets/birthday_celebration.png';
import lunchImg from '../assets/dining.png';
import gatheringImg from '../assets/bar2.jpg';
import engagementImg from '../assets/restaurants.jpg';

export const eventsHeroData = {
    heroBg: heroBg
};

export const eventTypesData = [
    {
        id: 1,
        title: "NIGHT PARTIES & DJ",
        desc: "High-energy nights with live DJs.",
        image: djImg,
        tag: "NIGHTLIFE"
    },
    {
        id: 2,
        title: "CORPORATE EVENTS",
        desc: "Premium setups for your business gatherings.",
        image: corporateImg,
        tag: "FORMAL"
    },
    {
        id: 4,
        title: "FAREWELL PARTIES",
        desc: "A grand send-off for your loved ones.",
        image: farewellImg,
        tag: "MEMORIES"
    },
    {
        id: 6,
        title: "MEETUPS",
        desc: "Casual and vibrant spaces to connect.",
        image: meetupImg,
        tag: "CASUAL"
    },
    {
        id: 7,
        title: "ANNIVERSARIES",
        desc: "Intimate dining for your special day.",
        image: anniversaryImg,
        tag: "ROMANCE"
    },
    {
        id: 8,
        title: "FAMILY GATHERINGS",
        desc: "Warm atmosphere for the whole family.",
        image: familyGatheringImg,
        tag: "CASUAL"
    }
];

export const eventTypes = [
    {
        title: 'Cocktail Nights',
        img: birthdayImg,
        desc: 'Experience-driven mixology in a high-energy atmosphere.'
    },
    {
        title: 'Corporate Mixers',
        img: corporateImg,
        desc: 'Sophisticated networking events designed for professionals.'
    },
    {
        title: 'Private Watch Parties',
        img: gatheringImg, // Use imported one from earlier
        desc: 'Exclusive screenings and sports events in your private lounge.'
    },
    {
        title: 'Gourmet Dinners',
        img: lunchImg,
        desc: 'Exquisite fine dining journeys with curated wine pairings.'
    },
];

export const uiLabels = {
    highlights: "Event Highlights",
    entry: "Entry:",
    detailsBtn: "Explore Details",
    backBtn: "Back to Events",
    time: "Time",
    venue: "Venue",
    capacity: "Capacity",
    dressCode: "Dress Code"
};

export const allEvents = [
    {
        id: 1,
        title: 'Corporate Gala 2024',
        date: 'Dec 15, 2024',
        time: '7:00 PM - 11:30 PM',
        location: 'Main Ballroom, Chill Grand',
        description: 'An evening of sophisticated networking and high-end culinary experiences. Join industry leaders for a night that blends business excellence with absolute luxury.',
        coverImg: corporateImg,
        highlights: [
            'Keynote Speeches by Industry Titans',
            'Gourmet 5-Course Signature Dinner',
            'Live Jazz & Orchestral Performance',
            'Exclusive CEO Networking Lounge',
            'Premium Open Bar with Rare Vintages',
            'Commemorative Gift Bags for Guests',
            'Complimentary Valet Parking'
        ],
        capacity: '200 Guests',
        dressCode: 'Black Tie Optional',
        priceRange: 'Invitation Only'
    },
    {
        id: 2,
        title: 'Eternal Love: Smith Wedding',
        date: 'Nov 20, 2024',
        time: '4:00 PM - 1:00 AM',
        location: 'Garden Terrace & Grand Hall',
        description: 'A magical celebration of unity and love. From the sunset ceremony on the terrace to the midnight dance in the Grand Hall, crafted to be unforgettable.',
        coverImg: gatheringImg,
        highlights: [
            'Sunset Garden Terrace Ceremony',
            'Champagne & Hors d\'oeuvres Reception',
            'Full Orchestral Performance',
            'Custom 4-Tier Gourmet Wedding Cake',
            'Late-Night Dessert Extravaganza',
            'Complimentary Floral Arrangement',
            'Luxury Stay at Grand Suite Included'
        ],
        capacity: '150 Guests',
        dressCode: 'Formal Wear',
        priceRange: 'Private Event'
    },
    {
        id: 3,
        title: 'Tech Innovation Meetup',
        date: 'Oct 05, 2024',
        time: '6:30 PM - 9:30 PM',
        location: 'Innovation Lounge, Level 2',
        description: 'Where technology meets creativity. Join local developers and tech leaders for an insightful night of talks, demos, and high-energy networking.',
        coverImg: lunchImg,
        highlights: [
            'Expert Panel Discussion on AI & Future',
            'Innovative Startup Pitch Deck Demos',
            'Open Bar Networking with Free Drinks',
            'Exclusive Tech Swag Giveaways',
            'Live Product Showcase Station',
            'Speed Networking Opportunities',
            'Complimentary High-Speed Wi-Fi Access'
        ],
        capacity: '100 Guests',
        dressCode: 'Smart Casual',
        priceRange: 'Free (Registration Required)'
    },
    {
        id: 4,
        title: 'New Year Bash: Midnight Aura',
        date: 'Dec 31, 2024',
        time: '9:00 PM - 3:00 AM',
        location: 'Rooftop Bar & Lounge',
        description: 'The ultimate countdown to 2025. Experience the city\'s best views, premium drinks, and an electric atmosphere with our resident DJ spinning into the early hours.',
        coverImg: birthdayImg,
        highlights: [
            '360° City View Countdown Fireworks',
            'Unlimited Premium Champagne Bar',
            'Live EDM Beats by Resident DJs',
            'Magical Midnight Confetti Shower',
            'Gourmet Tapas All Night Long',
            'Festive Photo Booth with 360° Video',
            'Early Bird Complimentary Drink'
        ],
        capacity: '250 Guests',
        dressCode: 'Festive & Elegant',
        priceRange: 'Rs. 15,000 per person'
    },
    {
        id: 5,
        title: 'Sommeliers Choice: Wine Tasting',
        date: 'Jan 15, 2025',
        time: '6:00 PM - 9:00 PM',
        location: 'Private Tasting Cellar',
        description: 'An educational and sensory journey through the world\'s finest vineyards. Our master sommelier will guide you through a selection of 8 rare vintages.',
        coverImg: lunchImg,
        highlights: [
            'Tasting of 8 Rare Premium Vintages',
            'Guided Journey with Master Sommelier',
            'Artisan Cheese & Charcuterie Pairings',
            'Limited Edition Detailed Tasting Notes',
            'Personalized Vineyard Recommendations',
            'Exclusive Discount on Featured Bottles',
            'Intimate Atmosphere for Enthusiasts'
        ],
        capacity: '25 Guests',
        dressCode: 'Business Casual',
        priceRange: 'Rs. 8,500 per person'
    },
    {
        id: 6,
        title: 'Jazz Under the Stars',
        date: 'Feb 14, 2025',
        time: '7:30 PM - 11:00 PM',
        location: 'Open-Air Lounge',
        description: 'The ultimate romantic evening under the open sky. Enjoy a soulful jazz quartet performance, accompanied by an exclusive tasting menu designed for two.',
        coverImg: engagementPhoto,
        highlights: [
            'Live Soulful Jazz Quartet Performance',
            'Open-Air Rooftop Stargazing Experience',
            'Complimentary Box of Handmade Truffles',
            'Exquisite 4-Course Gourmet Tasting Menu',
            'Signature Welcome Cocktail on Arrival',
            'Romantic Candlelight Table Setup',
            'Souvenir Rose for Every Couple'
        ],
        capacity: '40 Couples',
        dressCode: 'Evening Formal',
        priceRange: 'Rs. 25,000 per couple'
    }
];

export const upcomingEvents = allEvents.filter(e => e.id >= 4);
export const pastEvents = allEvents.filter(e => e.id <= 3);
