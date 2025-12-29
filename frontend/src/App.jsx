import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import TableBooking from './pages/TableBooking';
import About from './pages/About';
import PlanEvent from './pages/PlanEvent';
import EventDetail from './pages/EventDetail';
import EventInquiry from './pages/EventInquiry';
import LandingPage from './pages/LandingPage';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/table-booking" element={<TableBooking />} />
          <Route path="/about" element={<About />} />
          <Route path="/plan-event" element={<PlanEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event-inquiry" element={<EventInquiry />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
