import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import QRNavbar from './QRweb/components/QRNavbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Events from './pages/events/Events';
import Contact from './pages/Contact';
import TableBooking from './pages/TableBooking';
import About from './pages/About';
import PlanEvent from './pages/PlanEvent';
import EventDetail from './pages/events/EventDetail';
import EventInquiry from './pages/events/EventInquiry';
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
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const isQRweb = ['/categories', '/menu', '/my-orders', '/landing'].some(path =>
    location.pathname.startsWith(path)
  );
  const isKDS = location.pathname === '/kds-portal-9922';
  const isWaiter = location.pathname === '/waiter-portal-4421';
  const isBeverage = location.pathname === '/beverage-portal-7731';
  const { finalBill } = useOrder();

  // Reset transform and scroll to top on page change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.style.transform = '';
      mainRef.current.style.transition = '';
      mainRef.current.style.opacity = '';
      mainRef.current.style.boxShadow = '';
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Real iPhone-style Edge Drag & Swipe-to-Go-Back for Mobile & Tablet
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    let isHorizontalDetermined = false;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (location.pathname === '/' || isKDS || isWaiter || isBeverage) return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      // Only initiate if touch starts near the left edge (< 65px), exactly like iOS
      if (clientX < 65) {
        touchStartX = clientX;
        touchStartY = clientY;
        touchStartTime = Date.now();
        isSwiping = true;
        isHorizontalDetermined = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!isSwiping || !mainRef.current) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;

      // Determine movement direction on initial drag
      if (!isHorizontalDetermined) {
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
          // User is scrolling vertically, cancel swipe
          isSwiping = false;
          return;
        }
        if (deltaX > 10) {
          isHorizontalDetermined = true;
        }
      }

      // Dragging right
      if (deltaX > 0) {
        mainRef.current.style.transition = 'none';
        mainRef.current.style.transform = `translateX(${deltaX}px)`;
        mainRef.current.style.boxShadow = '-12px 0 30px rgba(0, 0, 0, 0.7)';
        mainRef.current.style.opacity = `${Math.max(0.7, 1 - (deltaX / window.innerWidth) * 0.25)}`;
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping || !mainRef.current) return;
      isSwiping = false;

      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      const elapsedTime = Date.now() - touchStartTime;
      const velocity = deltaX / Math.max(elapsedTime, 1);
      const screenWidth = window.innerWidth;

      // Trigger navigation if dragged past 28% of screen OR quick flick (velocity > 0.45)
      const shouldGoBack = (deltaX > screenWidth * 0.28 || (deltaX > 70 && velocity > 0.45));

      if (shouldGoBack) {
        // Slide out to the right like iOS
        mainRef.current.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.9, 0.4, 1), opacity 0.22s ease';
        mainRef.current.style.transform = 'translateX(100vw)';
        mainRef.current.style.opacity = '0.6';

        setTimeout(() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/');
          }
          if (mainRef.current) {
            mainRef.current.style.transform = '';
            mainRef.current.style.transition = '';
            mainRef.current.style.opacity = '';
            mainRef.current.style.boxShadow = '';
          }
        }, 220);
      } else {
        // Snap back into place
        mainRef.current.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.9, 0.4, 1), opacity 0.22s ease';
        mainRef.current.style.transform = 'translateX(0)';
        mainRef.current.style.opacity = '1';

        setTimeout(() => {
          if (mainRef.current) {
            mainRef.current.style.transition = '';
            mainRef.current.style.boxShadow = '';
          }
        }, 220);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [location.pathname, navigate, isKDS, isWaiter, isBeverage]);

  return (
    <div className="app">
      {!isKDS && !isWaiter && !isBeverage && (isQRweb ? <QRNavbar /> : <Navbar />)}
      <main ref={mainRef}>
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
