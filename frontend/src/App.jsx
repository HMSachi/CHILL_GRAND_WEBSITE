import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import QRNavbar from './QRweb/components/QRNavbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Contact from './pages/Contact';
import TableBooking from './pages/TableBooking';
import About from './pages/About';
import PlanEvent from './pages/PlanEvent';
import EventDetail from './pages/EventDetail';
import EventInquiry from './pages/EventInquiry';
import VirtualTour from './pages/VirtualTour';
import LandingPage from './QRweb/QRPages/LandingPage';
import CategoriesPage from './QRweb/QRPages/CategoriesPage';
import MenuItemsPage from './QRweb/QRPages/MenuItemsPage';
import MyOrdersPage from './QRweb/QRPages/MyOrdersPage';
import ChefDashboard from './pages/ChefDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import './styles/global.css';
import './App.css';

function App() {
  const location = useLocation();
  const isQRweb = ['/landing', '/categories', '/menu', '/my-orders'].some(path =>
    location.pathname.startsWith(path)
  );
  const isKDS = location.pathname === '/kds-portal-9922';
  const isWaiter = location.pathname === '/waiter-portal-4421';

  return (
    <div className="app">
      {!isKDS && !isWaiter && (isQRweb ? <QRNavbar /> : <Navbar />)}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kds-portal-9922" element={<ChefDashboard />} />
          <Route path="/waiter-portal-4421" element={<WaiterDashboard />} />

          <Route path="/landing" element={<LandingPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/menu/:categoryId" element={<MenuItemsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/table-booking" element={<TableBooking />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/plan-event" element={<PlanEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event-inquiry" element={<EventInquiry />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />

        </Routes>
      </main>
      {!isQRweb && !isKDS && !isWaiter && <Footer />}
    </div>
  );
}

export default App;
