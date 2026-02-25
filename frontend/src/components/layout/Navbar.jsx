import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ badge }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen((o) => !o);
    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="nav-wrapper">
            <nav className="navbar" id="navbar">

                {/* Logo */}
                <div className="nav-left">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        SriLanka<span>Travel</span>
                    </Link>
                    {badge && <span className="nav-badge">{badge}</span>}
                </div>

                {/* Centred Nav Links */}
                <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
                    {[
                        { to: '/', label: 'Home' },
                        { to: '/destinations', label: 'Destinations' },
                        { to: '/about', label: 'About' },
                        { to: '/contact', label: 'Contact' },
                    ].map(({ to, label }) => (
                        <li key={to}>
                            <NavLink to={to} onClick={closeMenu} end={to === '/'}>
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right Side */}
                <div className="nav-right">
                    <Link to="/signin" className="nav-text-link" onClick={closeMenu}>Sign in</Link>
                    <Link to="/signup" className="btn btn-dark" onClick={closeMenu}>Sign Up</Link>
                    <button
                        className={`hamburger${menuOpen ? ' active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </button>
                </div>

            </nav>
        </div>
    );
};

export default Navbar;
