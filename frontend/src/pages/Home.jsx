import React from 'react';
import Hero from '../components/home/Hero';
import ServiceCards from '../components/home/ServiceCards';
import GalleryWall from '../components/home/GalleryWall';
import UpcomingEvents from '../components/home/UpcomingEvents';

const Home = () => {
    return (
        <div className="home-container">
            <Hero />
            <ServiceCards />
            <UpcomingEvents />
            <GalleryWall />
        </div>
    );
};

export default Home;
