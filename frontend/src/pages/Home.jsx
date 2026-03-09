import React from 'react';
import Hero from '../components/home/Hero';
import ServiceCards from '../components/home/ServiceCards';
import DiscoverMenu from '../components/home/DiscoverMenu';
import ReserveTable from '../components/home/ReserveTable';
import UpcomingEvents from '../components/home/UpcomingEvents';

const Home = () => {
    return (
        <>
            <Hero />
            <ServiceCards />
            <UpcomingEvents />
            <DiscoverMenu />
            <ReserveTable />
        </>
    );
};

export default Home;
