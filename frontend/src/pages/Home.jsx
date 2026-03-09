import React from 'react';
import Hero from '../components/home/Hero';
import ServiceCards from '../components/home/ServiceCards';
import DiscoverMenu from '../components/home/DiscoverMenu';
import ReserveTable from '../components/home/ReserveTable';

const Home = () => {
    return (
        <>
            <Hero />
            <ServiceCards />
            <DiscoverMenu />
            <ReserveTable />
        </>
    );
};

export default Home;
