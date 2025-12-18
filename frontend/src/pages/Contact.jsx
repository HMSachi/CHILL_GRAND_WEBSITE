import React from "react";
import "../styles/pages/Contact.css";
import glass from "../assets/glass.png";
import SectionHeader from "../components/common/SectionHeader";

const Contact = () => {
  return (
    <div className="contact-page">
      <SectionHeader title="Contact Us" />

      <div className="contact-content">
        <p className="support-text">SUPPORT</p>
        <h2 className="contact-title">Contact With CHILL GRAND</h2>

        <div className="contact-card-wrapper">
          {/* LEFT FORM CARD */}
          <div className="contact-form-card">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your Email" />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Your Message"></textarea>
            </div>

            <div className="button-wrapper">
              <button className="contact-btn">Contact Us</button>
            </div>
          </div>

          {/* CENTER IMAGE */}
          <div className="contact-image">
            <img src={glass} alt="Delicious Food" />
          </div>

          {/* RIGHT INFO CARD */}
          <div className="contact-info-card">
            <p><strong>Email: info@chillgrand.com</strong></p>
            <p><strong>Phone: +1 234 567 890</strong></p>
            <p><strong>Address: 123 Food Street,<br />Flavor Town</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
