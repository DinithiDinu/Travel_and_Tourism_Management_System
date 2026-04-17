import { Link } from 'react-router-dom';
import './Footer.css';

const FooterWaveSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
            fill="#111827"
            fillOpacity="1"
            d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,138.7C672,128,768,128,864,149.3C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
    </svg>
);

const SocialIcon = ({ href, children, label }) => (
    <a href={href} className="social-icon" aria-label={label} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
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
                    {/* Brand Col */}
                    <div className="footer-col">
                        <Link to="/" className="footer-logo">
                            SriLanka<span>Travel</span>
                        </Link>
                        <p>Curating the finest travel experiences in the<br />Pearl of the Indian Ocean since 2020.</p>
                        <div className="social-links" style={{ marginTop: '1.5rem' }}>
                            <SocialIcon href="#" label="Instagram">
                                {/* Instagram */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="#" label="Facebook">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="#" label="X (Twitter)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="#" label="YouTube">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                                </svg>
                            </SocialIcon>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/destinations">Destinations</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-col">
                        <h4>Stay Updated</h4>
                        <p>Get exclusive deals and travel inspiration delivered to your inbox.</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Your email address" />
                            <button type="button">→</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom container">
                    <p>© 2026 Ideatech (Pvt) Ltd. All rights reserved.</p>
                    <a href="#top" className="scroll-top-btn" aria-label="Scroll to top" onClick={scrollToTop}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
