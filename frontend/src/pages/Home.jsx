import React from 'react';
import Hero from '../components/home/Hero';
import ServiceCards from '../components/home/ServiceCards';
import DiscoverMenu from '../components/home/DiscoverMenu';
import ReserveTable from '../components/home/ReserveTable';
import FeaturedDishes from '../components/home/FeaturedDishes';
import Experts from '../components/home/Experts';

const Home = () => {
    return (
        <>
            <Hero />
            <ServiceCards />
            <DiscoverMenu />
            <ReserveTable />
            <FeaturedDishes />
            <Experts />
        </>
    );
};

export default Home;
