import { Link } from 'react-router-dom';
import './Footer.css';

const FooterWaveSVG = ({ fill = '#1a1a1a' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
            fill={fill}
            fillOpacity="1"
            d="M0,192L40,197.3C80,203,160,213,240,197.3C320,181,400,139,480,138.7C560,139,640,181,720,197.3C800,213,880,203,960,181.3C1040,160,1120,128,1200,128C1280,128,1360,160,1400,176L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
    </svg>
);

const Footer = () => {
    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="footer-wave">
                <FooterWaveSVG />
            </div>
            <div className="footer-content-wrapper">
                <div className="container footer-container">
                    <div className="footer-col">
                        <Link to="/" className="footer-logo">
                            SriLanka<span>Travel</span>
                        </Link>
                        <p>Curating the best travel experiences in the pearl of the Indian Ocean.</p>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/destinations">Destinations</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom container">
                    <p>&copy; 2026 Ideatech (Pvt) Ltd. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#top" className="scroll-top-btn" aria-label="Scroll to top" onClick={scrollToTop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 15l-6-6-6 6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
