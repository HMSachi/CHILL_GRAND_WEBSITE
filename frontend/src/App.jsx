import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import QRNavbar from './QRweb/components/QRNavbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Events from './dummy_events/Events';
import Contact from './pages/Contact';
import TableBooking from './pages/TableBooking';
import About from './pages/About';
import PlanEvent from './pages/PlanEvent';
import EventDetail from './dummy_events/EventDetail';
import EventInquiry from './dummy_events/EventInquiry';
import CategoriesPage from './QRweb/QRPages/CategoriesPage';
import MenuItemsPage from './QRweb/QRPages/MenuItemsPage';
import MyOrdersPage from './QRweb/QRPages/MyOrdersPage';
import ChefDashboard from './pages/ChefDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import BeverageDashboard from './pages/BeverageDashboard';
import VirtualTour from './pages/VirtualTour';
import FinalBillModal from './QRweb/components/FinalBillModal';
import { useOrder } from './QRweb/QRPages/OrderContext';
import './styles/global.css';
import './App.css';

function App() {
  const location = useLocation();
  const isQRweb = ['/categories', '/menu', '/my-orders', '/landing'].some(path =>
    location.pathname.startsWith(path)
  );
  const isKDS = location.pathname === '/kds-portal-9922';
  const isWaiter = location.pathname === '/waiter-portal-4421';
  const isBeverage = location.pathname === '/beverage-portal-7731';
  const { finalBill } = useOrder();

  return (
    <div className="app">
      {!isKDS && !isWaiter && !isBeverage && (isQRweb ? <QRNavbar /> : <Navbar />)}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Navigate to={`/categories${location.search}`} replace />} />
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
          <Route path="/kds-portal-9922" element={<ChefDashboard />} />
          <Route path="/waiter-portal-4421" element={<WaiterDashboard />} />
          <Route path="/beverage-portal-7731" element={<BeverageDashboard />} />
        </Routes>
      </main>
      {!isQRweb && !isKDS && !isWaiter && !isBeverage && <Footer />}
      {isQRweb && <FinalBillModal bill={finalBill} />}
    </div>
  );
}

export default App;
