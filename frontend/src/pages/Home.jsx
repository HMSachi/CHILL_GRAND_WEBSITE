import Hero from '../components/home/Hero';
import ServiceCards from '../components/home/ServiceCards';
import GalleryWall from '../components/home/GalleryWall';

const Home = () => {
    return (
        <div className="home-container">
            <Hero />
            <ServiceCards />
            <GalleryWall />
        </div>
    );
};

export default Home;
