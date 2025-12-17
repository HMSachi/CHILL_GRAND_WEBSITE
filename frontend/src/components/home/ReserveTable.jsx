import React from 'react';
import '../../styles/components/ReserveTable.css';

const ReserveTable = () => {
    return (
        <section className="reserve-table" id="booking">
            <div className="container">
                <div className="reserve-content">
                    <div className="reserve-text">
                        <h2>RESERVE <br /> A TABLE</h2>
                        <p>Discover our New Menu!</p>
                    </div>

                    <form className="reserve-form">
                        <div className="form-row">
                            <input type="number" placeholder="No of Guest" className="form-input" />
                            <input type="date" className="form-input" />
                            <input type="time" className="form-input" />
                        </div>

                        <div className="form-row">
                            <input type="text" placeholder="Full Name" className="form-input" />
                            <input type="tel" placeholder="Phone No" className="form-input" />
                        </div>

                        <div className="form-row">
                            <input type="text" placeholder="Table No" className="form-input" />
                            <button type="submit" className="btn-submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ReserveTable;
