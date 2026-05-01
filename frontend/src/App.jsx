import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import './styles/global.css';
import './App.css';

function App() {
  const location = useLocation();
  const isQRweb = ['/categories', '/menu', '/my-orders'].some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app">
      {isQRweb ? <QRNavbar /> : <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
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

        </Routes>
      </main>
      {!isQRweb && <Footer />}
    </div>
  );
}

export default App;
