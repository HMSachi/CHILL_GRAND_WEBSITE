// eventsData.js - Contains all dummy data for Events page components

import heroBg from '../assets/event.png';
import djImg from '../assets/dj.jpg';
import corporateImg from '../assets/Corporate Events.png';
import graduationImg from '../assets/Graduation.jpg';
import farewellImg from '../assets/farewell.png';
import engagementPhoto from '../assets/Engagement.jpg';
import meetupImg from '../assets/meetup.png';
import anniversaryImg from '../assets/anniverssary.png';
import familyGatheringImg from '../assets/gathering.png';

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
        id: 3,
        title: "GRADUATION PARTIES",
        desc: "Celebrate your achievements in style.",
        image: graduationImg,
        tag: "CELEBRATION"
    },
    {
        id: 4,
        title: "FAREWELL PARTIES",
        desc: "A grand send-off for your loved ones.",
        image: farewellImg,
        tag: "MEMORIES"
    },
    {
        id: 5,
        title: "ENGAGEMENTS",
        desc: "Romantic and elegant settings.",
        image: engagementPhoto,
        tag: "ROMANCE"
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
