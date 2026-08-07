import React from 'react';
import logo from '../../assets/logo.png';
import '../../styles/components/PortalLoginCard.css';

/**
 * PortalLoginCard — reusable login UI for Chef, Waiter and Beverage portals.
 *
 * Props
 * ─────
 * title        {string}   Portal heading, e.g. "Kitchen Portal"
 * subtitle     {string}   Small label under the title
 * accentColor  {string}   CSS colour for the button + focus ring (default: #3b82f6)
 * footerLabel  {string}   Tiny text at the bottom (e.g. portal URL hint)
 *
 * Form state (controlled by the parent — ZERO logic lives here)
 * ─────────────────────────────────────────────────────────────
 * usernameValue  {string}
 * passwordValue  {string}
 * onUsernameChange {fn}
 * onPasswordChange {fn}
 * onSubmit         {fn}   Called with the SyntheticEvent
 * error            {string|null}
 * loading          {bool}
 * submitLabel      {string}   Button text when idle    (default: "Sign In")
 * loadingLabel     {string}   Button text when loading (default: "Authenticating...")
 */
const PortalLoginCard = ({
    title        = 'Portal Login',
    subtitle     = 'Sign in to your staff account',
    accentColor  = '#3b82f6',
    footerLabel  = '',
    usernameValue,
    passwordValue,
    onUsernameChange,
    onPasswordChange,
    onSubmit,
    error        = '',
    loading      = false,
    submitLabel  = 'Sign In',
    loadingLabel = 'Authenticating...',
}) => {
    return (
        <div className="portal-login-overlay">
            <div
                className="portal-login-card"
                style={{ '--portal-accent': accentColor }}
            >
                {/* Logo */}
                <img
                    src={logo}
                    alt="Chill Grand"
                    className="portal-login-logo"
                />

             

                {/* Heading */}
                <h1 className="portal-login-title">{title}</h1>
                <p className="portal-login-subtitle">{subtitle}</p>

                {/* Form — all state and handlers come from the parent */}
                <form className="portal-login-form" onSubmit={onSubmit}>
                    <div className="portal-login-field">
                        <label className="portal-login-label">Username</label>
                        <input
                            type="text"
                            className="portal-login-input"
                            placeholder="Enter your username"
                            value={usernameValue}
                            onChange={onUsernameChange}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="portal-login-field">
                        <label className="portal-login-label">Password</label>
                        <input
                            type="password"
                            className="portal-login-input"
                            placeholder="••••••••"
                            value={passwordValue}
                            onChange={onPasswordChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="portal-login-error">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="portal-login-btn"
                        disabled={loading}
                        style={{ background: accentColor }}
                    >
                        {loading ? loadingLabel : submitLabel}
                    </button>
                </form>

                {footerLabel && (
                    <p className="portal-login-footer">{footerLabel}</p>
                )}
            </div>
        </div>
    );
};

export default PortalLoginCard;
