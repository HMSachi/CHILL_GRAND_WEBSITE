import React, { useRef, useEffect, useState } from 'react';
import { categories } from '../dummy/categories';
import '../styles/pages/Menu.css';
import qrPng from '../assets/qr.png';
import dishPng from '../assets/dish.png';
import orderPng from '../assets/order.png';
import c1Img from '../assets/c1.jpg';

const Menu = () => {
  const sliderRef = useRef(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const metricsRef = useRef({ stride: 1, itemsPerView: 1 });

  const recalcPages = () => {
    const el = sliderRef.current; if (!el || el.children.length === 0) return;
    const first = el.children[0];
    let stride = first.getBoundingClientRect().width;
    if (el.children.length > 1) {
      const a = el.children[0].offsetLeft;
      const b = el.children[1].offsetLeft;
      const diff = b - a; if (diff > 0) stride = diff;
    }
    const itemsPerView = Math.max(1, Math.round(el.clientWidth / stride));
    const pages = Math.max(1, Math.ceil(categories.length / itemsPerView));
    metricsRef.current = { stride, itemsPerView };
    setPageCount(pages);
    setActivePage((p) => Math.min(p, pages - 1));
  };

  useEffect(() => {
    recalcPages();
    const onResize = () => recalcPages();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollBy = (dir) => {
    const el = sliderRef.current; if (!el) return;
    const amount = el.clientWidth * 0.8; el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const scrollToPage = (page) => {
    const el = sliderRef.current; if (!el) return;
    const { stride, itemsPerView } = metricsRef.current;
    const left = page * itemsPerView * stride;
    el.scrollTo({ left, behavior: 'smooth' });
    setActivePage(page);
  };

  useEffect(() => {
    const el = sliderRef.current; if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { stride, itemsPerView } = metricsRef.current;
        if (stride <= 0) return;
        const leftIndex = Math.round(el.scrollLeft / stride);
        const currentPage = Math.floor(leftIndex / Math.max(1, itemsPerView));
        setActivePage((p) => (currentPage !== p ? currentPage : p));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="menu-page">
      <div className="menu-hero">
        <div className="container menu-hero-container">
          <div className="menu-hero-content">
            <h1 className="menu-hero-title">Explore Menu</h1>
            <p className="menu-hero-sub">Discover our best food collection for this month.</p>
            <div className="menu-hero-actions">
              <button className="btn-primary">Order Now</button>
            </div>


            <form className="menu-hero-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" aria-label="Email" />
              <button type="submit" className="btn-secondary">Subscribe</button>
            </form>
          </div>
          <div className="menu-hero-art" aria-hidden="true" />
        </div>
      </div>

      <div className="container">
        {/* Category slider */}
        <section className="category-section">
          <h2 className="category-title">Choose a Category</h2>
          <div className="category-underline" />

          <div className="category-slider-wrap">
            <button className="slider-btn left" aria-label="Prev" onClick={() => scrollBy(-1)}>‹</button>

            <div className="category-slider" ref={sliderRef}>
              {categories.map((c, idx) => (
                <div className="category-card" key={idx}>
                  <div className="category-thumb">
                    <img src={c.img} alt={c.title} />
                  </div>
                  <h3 className="category-name">{c.title}</h3>
                </div>
              ))}
            </div>

            <button className="slider-btn right" aria-label="Next" onClick={() => scrollBy(1)}>›</button>
          </div>

          <div className="category-dots">
            {Array.from({ length: pageCount }).map((_, i) => (
              <span
                key={i}
                className={`dot ${i === activePage ? 'active' : ''}`}
                onClick={() => scrollToPage(i)}
                role="button"
                aria-label={`Go to page ${i + 1}`}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollToPage(i)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* How We Work section */}
      <section className="how-section">
        <div className="container">
          <div className="how-shell">
            <div className="how-content">
              <p className="how-kicker">Easy order in 3 steps</p>
              <h2 className="how-title">How We Work</h2>

              <div className="how-steps">
                <div className="how-step">
                  <span className="how-num">1</span>
                  <div className="how-icon" aria-hidden><img src={qrPng} alt="QR Code" style={{ width: 56, height: 56, objectFit: 'contain' }} /></div>
                  <h3 className="how-step-title">Explore Menu Using QR</h3>
                  <p className="how-step-text">View the full menu right on your phone in seconds.</p>
                </div>
                <div className="how-step">
                  <span className="how-num">2</span>
                  <div className="how-icon" aria-hidden><img src={dishPng} alt="Dish" style={{ width: 56, height: 56, objectFit: 'contain' }} /></div>
                  <h3 className="how-step-title">Choose a Dish</h3>
                  <p className="how-step-text">Find your favorites and discover new specials.</p>
                </div>
                <div className="how-step">
                  <span className="how-num">3</span>
                  <div className="how-icon" aria-hidden><img src={orderPng} alt="Order" style={{ width: 56, height: 56, objectFit: 'contain' }} /></div>
                  <h3 className="how-step-title">Place Order</h3>
                  <p className="how-step-text">Order in one tap and we’ll prepare it fresh.</p>
                </div>
              </div>
            </div>

            <div className="how-visual" aria-hidden="true">
              <div className="how-circle">
                <img src={c1Img} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Menu;
