import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './GuestHomePage.css';

/* ─── Data ────────────────────────────────────────────────── */
const DESTINATIONS = [
    { id: 1, image: '/assets/Sigiriya.jpg', alt: 'Sigiriya Rock Fortress', badge: 'Cultural', title: 'Sigiriya', description: 'The ancient rock fortress and palace ruin surrounded by the remains of an extensive network of gardens, water gardens, and moats.' },
    { id: 2, image: '/assets/Ella.jpg', alt: 'Ella Train', badge: 'Nature', title: 'Ella', description: 'A small town in the Badulla District, famous for its stunning tea plantations, misty mountains, and the iconic Nine Arch Bridge.' },
    { id: 3, image: '/assets/Mirissa.jpg', alt: 'Mirissa Beach', badge: 'Beach', title: 'Mirissa', description: 'A south-coast paradise renowned for whale watching, surfing, and sunset cocktails on pristine golden shores.' },
    { id: 4, image: '/assets/hiking.jpg', alt: 'Horton Plains', badge: 'Hiking', title: 'Horton Plains', description: "Discover the breathtaking World's End precipice and trek through misty cloud forests teeming with rare biodiversity." },
    { id: 5, image: '/assets/hikkaduwa.jpg', alt: 'Hikkaduwa Nightlife', badge: 'Beach', title: 'Hikkaduwa', description: 'Experience vibrant coral reefs, beach parties, and the pulsating street life of Sri Lanka\'s favorite coastal town.' },
];

const SERVICES = [
    { id: 1, icon: '🚐', badgeClass: 'badge-transport', badgeLabel: 'Transport', title: 'Professional Riders', description: "Travel in comfort and safety with our fleet of modern vehicles and experienced drivers who know every twist and turn of the island's roads.", linkLabel: 'Book Your Ride' },
    { id: 2, icon: '🧭', badgeClass: 'badge-guide', badgeLabel: 'Guidance', title: 'Expert Guides', description: 'Uncover the hidden stories and rich history of Sri Lanka with our knowledgeable guides, dedicated to providing an authentic experience.', linkLabel: 'Find a Guide' },
    { id: 3, icon: '🏨', badgeClass: 'badge-hotel', badgeLabel: 'Stay', title: 'Curated Stays', description: 'Handpicked hotels, boutique villas, and eco-lodges at every destination — comfort that matches the magic of Sri Lanka.', linkLabel: 'Browse Stays' },
];

const STATS = [
    { value: 50, suffix: '+', label: 'Destinations' },
    { value: 10, suffix: 'k+', label: 'Happy Travelers' },
    { value: 200, suffix: '+', label: 'Expert Guides' },
    { value: 98, suffix: '%', label: '5-Star Reviews' },
];

const TESTIMONIALS = [
    { initials: 'SK', name: 'Sophie K.', country: '🇩🇪 Germany', quote: 'Absolutely breathtaking! The team organised everything flawlessly. Sigiriya at sunrise was a dream I will never forget.' },
    { initials: 'RJ', name: 'Raj J.', country: '🇦🇺 Australia', quote: 'The guide was incredibly knowledgeable and passionate. We got off the beaten track and discovered the real Sri Lanka.' },
    { initials: 'ML', name: 'Marie L.', country: '🇫🇷 France', quote: 'From Ella to Mirissa — every moment was magical. Professional, punctual, and truly caring about our experience.' },
    { initials: 'AL', name: 'Alex L.', country: '🇬🇧 UK', quote: 'SriLanka Travel elevated our honeymoon beyond expectations. The private beach dinner they arranged was extraordinary.' },
];

const FAQS = [
    { id: 1, question: 'How do I book a tour?', answer: 'Simply choose your destination or package and click "Book Now". You can also contact our support team for fully customised itineraries.' },
    { id: 2, question: 'Are the guides licensed?', answer: 'Yes — all our guides and riders are government-licensed professionals with extensive training, first-aid certification, and years of experience.' },
    { id: 3, question: 'Can I cancel my booking?', answer: 'We offer flexible cancellation. Bookings cancelled 48 hours in advance are eligible for a full refund, no questions asked.' },
    { id: 4, question: 'Is travel insurance included?', answer: 'Basic travel insurance is included in our premium packages. For standard bookings, we strongly recommend purchasing comprehensive travel insurance.' },
];

/* ─── Hooks ─────────────────────────────────────────────── */
function useScrollReveal() {
    const containerRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } }),
            { threshold: 0.1 }
        );
        const elements = containerRef.current?.querySelectorAll('.reveal');
        elements?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return containerRef;
}

function useCounter(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                setCount(Math.floor(progress * target));
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, { threshold: 0.5 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);
    return [count, ref];
}

/* ─── Sub Components ─────────────────────────────────────── */
const CounterStat = ({ value, suffix, label }) => {
    const [count, ref] = useCounter(value);
    return (
        <div className="stat-item" ref={ref}>
            <span className="stat-value">{count}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

const FaqItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                <span>{question}</span>
                <span className="faq-toggle">+</span>
            </button>
            <div className="faq-answer" aria-hidden={!open}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

/* ─── Main Page ──────────────────────────────────────────── */
const GuestHomePage = () => {
    const pageRef = useScrollReveal();

    return (
        <div ref={pageRef}>
            <Navbar badge="Guest" />

            {/* ── HERO ── */}
            <header className="hero" id="home">
                <div className="hero-background">
                    <img src="/assets/Sigiriya.jpg" alt="Sri Lanka" />
                    <div className="hero-overlay" />
                </div>
                <div className="hero-content container">
                    <span className="hero-eyebrow">✈ Discover the Pearl of the Indian Ocean</span>
                    <h1 className="hero-title">
                        Experience the<br />
                        <span className="hero-title-accent">Wonder of Sri Lanka</span>
                    </h1>
                    <p className="hero-subtitle">
                        Ancient ruins, golden beaches, misty mountains — and the warmth of a culture that will steal your heart.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/destinations" className="btn btn-gold btn-lg">
                            Explore Destinations <span className="arrow">→</span>
                        </Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">
                            Plan My Trip
                        </Link>
                    </div>
                </div>

                {/* Stats Strip */}
                <div className="hero-stats">
                    {STATS.map((s) => (
                        <CounterStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
                    ))}
                </div>

                <div className="hero-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path fill="white" fillOpacity="1"
                            d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,133.3C840,139,960,117,1080,96C1200,75,1320,53,1380,42.7L1440,32L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z" />
                    </svg>
                </div>
            </header>

            {/* ── DESTINATIONS ── */}
            <section className="destinations section" id="destinations">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Where to Go</span>
                        <h2 className="section-title">Popular <em>Destinations</em></h2>
                        <p className="section-subtitle">Handpicked experiences for your perfect Sri Lankan getaway. Scroll to explore.</p>
                    </div>
                    <div className="destinations-grid">
                        {DESTINATIONS.map((dest) => (
                            <article key={dest.id} className="card destination-card reveal">
                                <div className="card-image">
                                    <img src={dest.image} alt={dest.alt} loading="lazy" />
                                    <div className="card-badge">{dest.badge}</div>
                                </div>
                                <div className="card-content">
                                    <h3>{dest.title}</h3>
                                    <p>{dest.description}</p>
                                    <Link to={`/destinations/${dest.title.toLowerCase().replace(/\s+/g, '-')}`} className="card-link">
                                        Explore <span className="arrow">→</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ── */}
            <section className="why-us section" id="why-us">
                <div className="container">
                    <div className="why-us-inner">
                        <div className="why-us-photo reveal">
                            <img src="/assets/Ella.jpg" alt="Ella Train Bridge" />
                            <div className="why-us-badge-float">
                                <span className="wub-top">⭐ 4.9 / 5</span>
                                <span className="wub-bottom">Avg. rating</span>
                            </div>
                        </div>
                        <div className="why-us-text">
                            <span className="section-label">Why SriLanka Travel</span>
                            <h2 className="section-title">Crafted with <em>Passion</em></h2>
                            <p className="why-us-desc">We are not just a booking platform. We are a team of local experts who live and breathe Sri Lanka — from misty hill country to ancient cities to sun-kissed shores.</p>
                            <ul className="why-us-list">
                                {['Personalised itineraries crafted by local insiders',
                                    'Government-licensed guides & certified drivers',
                                    'Real-time support throughout your journey',
                                    '48-hour flexible cancellation policy'].map((item, i) => (
                                        <li key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                            <span className="check-icon">✓</span> {item}
                                        </li>
                                    ))}
                            </ul>
                            <Link to="/about" className="btn btn-primary btn-lg" style={{ marginTop: '2rem' }}>
                                Our Story <span className="arrow">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section className="services section" id="team">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">What We Offer</span>
                        <h2 className="section-title">Our <em>Services</em></h2>
                        <p className="section-subtitle">Ensuring your journey is safe, comfortable, and deeply authentic.</p>
                    </div>
                    <div className="services-grid">
                        {SERVICES.map((svc, i) => (
                            <article key={svc.id} className="service-card reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                                <div className="service-icon-wrap">{svc.icon}</div>
                                <span className={`service-badge ${svc.badgeClass}`}>{svc.badgeLabel}</span>
                                <h3 className="service-title">{svc.title}</h3>
                                <p className="service-description">{svc.description}</p>
                                <Link to="/contact" className="service-link">
                                    {svc.linkLabel} <span className="arrow">→</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="testimonials section" id="testimonials">
                <div className="testimonials-inner">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label" style={{ background: 'rgba(255,255,255,0.15)', color: '#fde68a' }}>Traveler Stories</span>
                            <h2 className="section-title" style={{ color: '#fff' }}>What Our <em style={{ color: '#fcd34d' }}>Travelers</em> Say</h2>
                        </div>
                        <div className="testimonials-grid">
                            {TESTIMONIALS.map((t, i) => (
                                <div key={t.name} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <div className="test-quote">"</div>
                                    <p className="test-text">{t.quote}</p>
                                    <div className="test-author">
                                        <div className="test-avatar">{t.initials}</div>
                                        <div>
                                            <strong>{t.name}</strong>
                                            <span>{t.country}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="faq section" id="faq">
                <div className="container faq-container">
                    <div className="section-header">
                        <span className="section-label">Have Questions?</span>
                        <h2 className="section-title">Frequently <em>Asked</em></h2>
                    </div>
                    <div className="faq-list">
                        {FAQS.map((faq) => (
                            <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA STRIP ── */}
            <section className="cta-strip">
                <div className="container cta-strip-inner">
                    <div>
                        <h2>Ready to start your Sri Lanka adventure?</h2>
                        <p>Join thousands of happy travelers. Book your trip today.</p>
                    </div>
                    <div className="cta-strip-buttons">
                        <Link to="/signup" className="btn btn-gold btn-lg">Get Started Free</Link>
                        <Link to="/destinations" className="btn btn-outline btn-lg">Browse Destinations</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default GuestHomePage;
