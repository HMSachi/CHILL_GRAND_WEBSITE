import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/BackButton.css';

const BackButton = ({ to, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button className="back-btn" onClick={handleClick}>
            <FaArrowLeft />
        </button>
    );
};

export default BackButton;
