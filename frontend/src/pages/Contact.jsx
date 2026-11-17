import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import "../styles/pages/Contact.css";
import glass from "../assets/glass.png";
import SectionHeader from "../components/common/SectionHeader";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/website/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to connect to server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <SectionHeader title="Contact Us" />

      <div className="contact-content">


        <div className="contact-card-wrapper">
          {/* LEFT FORM CARD */}
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">

                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {status.message && (
                <p style={{ color: status.type === 'success' ? 'green' : 'red', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {status.message}
                </p>
              )}

              <div className="button-wrapper">
                <button type="submit" className="contact-btn" disabled={loading}>
                  {loading ? "Sending..." : "Contact Us"}
                </button>
              </div>
            </form>
          </div>

          {/* CENTER IMAGE */}
          <div className="contact-image" data-aos="zoom-in" data-aos-delay="200">
            <img src={glass} alt="Delicious Glass" />
          </div>

          {/* RIGHT INFO CARD */}
          <div className="contact-info-card">
            <a href="mailto:chillgrand@gmail.com" className="contact-info-item">
              <div className="info-icon-badge">
                <Mail size={18} />
              </div>
              <div className="info-text-group">
                <span className="info-label">Email</span>
                <span className="info-value">chillgrand@gmail.com</span>
              </div>
            </a>

            <div className="info-divider" />

            <a href="tel:0761400071" className="contact-info-item">
              <div className="info-icon-badge">
                <Phone size={18} />
              </div>
              <div className="info-text-group">
                <span className="info-label">Phone</span>
                <span className="info-value">0761400071</span>
              </div>
            </a>

            <div className="info-divider" />

            <div className="contact-info-item">
              <div className="info-icon-badge">
                <MapPin size={18} />
              </div>
              <div className="info-text-group">
                <span className="info-label">Address</span>
                <span className="info-value">Kaduwela Road, Malabe, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
