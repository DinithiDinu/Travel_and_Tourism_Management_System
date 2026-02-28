import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ badge }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => setMenuOpen((o) => !o);
    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="nav-wrapper">
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">

                {/* Logo */}
                <div className="nav-left">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        <svg className="logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="13" stroke="#0d9488" strokeWidth="2" />
                            <path d="M14 6 C10 10, 6 14, 10 18 C12 20, 14 22, 14 22 C14 22, 16 20, 18 18 C22 14, 18 10, 14 6Z" fill="#0d9488" opacity="0.8" />
                            <circle cx="14" cy="11" r="2.5" fill="white" />
                        </svg>
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
                    <Link to="/signup" className="btn btn-primary btn-nav" onClick={closeMenu}>Sign Up</Link>
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
