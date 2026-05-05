import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../styles/pages/WaiterLogin.css';

const WaiterLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });

            const user = response.data.user;
            if (user.role === 'WAITER' || user.role === 'CASHIER' || user.role === 'ADMIN') {
                sessionStorage.setItem('waiter_token', response.data.token);
                sessionStorage.setItem('waiter_user', JSON.stringify(user));
                onLogin(user);
            } else {
                setError('Access denied. Waiter account required.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="waiter-login-page">
            <div className="login-card">
                <img src={logo} alt="Chill Grand" className="login-logo" />
                <h1 className="login-title">Waiter Access</h1>
                <p className="login-subtitle">Please sign in to your staff account</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WaiterLogin;
