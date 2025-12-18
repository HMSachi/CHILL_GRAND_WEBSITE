import React from 'react';
import '../../styles/pages/About.css';

const Testimonials = () => {
    return (
        <div className="testimonials-section">
            <span className="section-subtitle center-title">FEATURES</span>
            <h2 className="section-title center-title">Why people choose us?</h2>
            <p className="section-description center-desc">
                We offer restaurant-quality meals at prices that are budget-friendly, giving customers the best value for their money.
            </p>

            <div className="testimonials-grid">
                {/* Card 1 */}
                <div className="testimonial-card">
                    <div className="quote-icon">❝</div>
                    <p className="review-text">
                        "Lorem ipsum dolor sit amet consectetur. Suspendisse aliquet tellus adipiscing condimentum donec blandit. Dignissim nunc facilisi pretium id molestie lectus duis."
                    </p>
                    <div className="review-stars">★★★★★</div>
                    <h4 className="reviewer-name">John</h4>
                    <span className="reviewer-role">Business Man</span>
                </div>

                {/* Card 2 */}
                <div className="testimonial-card">
                    <div className="quote-icon">❝</div>
                    <p className="review-text">
                        "Lorem ipsum dolor sit amet consectetur. Suspendisse aliquet tellus adipiscing condimentum donec blandit. Dignissim nunc facilisi pretium id molestie lectus duis."
                    </p>
                    <div className="review-stars">★★★★★</div>
                    <h4 className="reviewer-name">John</h4>
                    <span className="reviewer-role">Business Man</span>
                </div>
            </div>

            <div className="carousel-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
};

export default Testimonials;
