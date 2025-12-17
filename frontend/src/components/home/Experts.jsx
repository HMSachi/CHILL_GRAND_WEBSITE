import React from 'react';
import '../../styles/components/Experts.css';

const Experts = () => {
    const experts = [
        {
            name: 'Thomas Walim',
            role: 'Dessert specialist',
            image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 1
        },
        {
            name: 'James Jhonson',
            role: 'Chef Master',
            image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 2
        },
        {
            name: 'Room Minal',
            role: 'Dessert specialist',
            image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            id: 3
        }
    ];

    return (
        <section className="experts-section" id="about">
            <div className="container">
                <h2 className="section-title text-center">Meet Our Experts</h2>
                <div className="underline"></div>

                <div className="experts-grid">
                    {experts.map((expert) => (
                        <div className="expert-card" key={expert.id}>
                            <div className="expert-image-wrapper">
                                <img src={expert.image} alt={expert.name} />
                            </div>
                            <div className="expert-info">
                                <p className="expert-role">{expert.role}</p>
                                <h3>{expert.name}</h3>
                                <div className="expert-socials">
                                    <span className="social-dot"></span>
                                    <span className="social-dot"></span>
                                    <span className="social-dot"></span>
                                </div>
                                <div className="signature">
                                    {/* Placeholder for signature */}
                                    <span className="signature-line">Signature</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experts;
