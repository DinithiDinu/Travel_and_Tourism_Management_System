import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import './AboutPage.css';

/* ─── Data ──────────────────────────────────────────────── */
const FEATURES = [
    {
        id: 1,
        icon: '🛡️',
        title: 'Safety First',
        description:
            'Your safety is our priority. We vet all our drivers and guides, and provide 24/7 support throughout your trip.',
    },
    {
        id: 2,
        icon: '📍',
        title: 'Local Expertise',
        description:
            'Our team consists of locals who know the hidden gems, the best times to visit, and the stories behind the sights.',
    },
    {
        id: 3,
        icon: '✨',
        title: 'Curated Experiences',
        description:
            "We don't just offer tours; we craft experiences.From authentic cuisine to off- the - beaten - path adventures.",
    },
];

const SERVICES = [
    {
        id: 1,
        badgeClass: 'badge-transport',
        badgeLabel: 'Transport',
        title: 'Professional Riders',
        description:
            "Travel in comfort and safety with our fleet of modern vehicles and experienced drivers who know every twist and turn of the island's roads.",
        linkLabel: 'Book Your Ride',
    },
    {
        id: 2,
        badgeClass: 'badge-guide',
        badgeLabel: 'Guidance',
        title: 'Expert Guides',
        description:
            'Uncover the hidden stories and rich history of Sri Lanka with our knowledgeable guides, dedicated to providing you with an authentic experience.',
        linkLabel: 'Find a Guide',
    },
];

const FAQS = [
    {
        id: 1,
        question: 'How do I book a tour?',
        answer:
            'Simply choose your destination or package and click "Book Now". You can also contact our support team for customized itineraries.',
    },
    {
        id: 2,
        question: 'Are the guides licensed?',
        answer:
            'Yes, all our guides and riders are government-licensed professionals with extensive training and experience.',
    },
    {
        id: 3,
        question: 'Can I cancel my booking?',
        answer:
            'We offer flexible cancellation policies. Bookings cancelled 48 hours in advance are eligible for a full refund.',
    },
    {
        id: 4,
        question: 'Is travel insurance included?',
        answer:
            'Basic travel insurance is included in our premium packages. For standard bookings, we recommend purchasing comprehensive travel insurance separately.',
    },
];

/* ─── Scroll Reveal Hook ────────────────────────────────── */
function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('revealed');
                        observer.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        const els = ref.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ─── FAQ Item ──────────────────────────────────────────── */
const FaqItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                <span>{question}</span>
                <span className="faq-toggle">{open ? '×' : '+'}</span>
            </button>
            <div className="faq-answer" aria-hidden={!open}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

/* ─── Page ──────────────────────────────────────────────── */
const AboutPage = () => {
    const pageRef = useScrollReveal();

    return (
        <div ref={pageRef}>
            <Navbar badge="Guest" />

            {/* Page Header */}
            <header className="about-page-header" style={{ position: 'relative' }}>
                <div className="container">
                    <h1 className="section-title">About Us</h1>
                    <p className="section-subtitle">Dedicated to making your journey unforgettable.</p>
                </div>
                <div style={{ color: '#fff' }}>
                    <TopWave />
                </div>
            </header>

            {/* Mission & Vision */}
            <section className="mission section">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-content reveal">
                            <h2 className="section-title text-left">Our Mission</h2>
                            <p>
                                To showcase the breathtaking beauty and rich culture of Sri Lanka to the world,
                                providing travelers with safe, authentic, and unforgettable experiences that respect
                                local communities and the environment.
                            </p>
                        </div>
                        <div className="mission-content reveal">
                            <h2 className="section-title text-left">Our Vision</h2>
                            <p>
                                To be the most trusted and preferred travel partner for exploring Sri Lanka, known
                                for our exceptional service, sustainable practices, and passion for sharing our
                                island home.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="story section bg-light">
                <div className="container">
                    <div className="story-content text-center reveal">
                        <h2 className="section-title">Our Story</h2>
                        <div className="story-text">
                            <p>
                                The Travel Sri Lanka journey began in 2015 with a simple idea: to show travelers the
                                Sri Lanka we know and love—beyond the guidebooks. Founded by a group of passionate
                                locals who spent years exploring every corner of the island, we realized that the
                                best experiences weren't found in luxury resorts, but in hidden waterfalls, the
                                home-cooked meals in rural villages, and the stories shared by smiling locals.
                            </p>
                            <p>
                                What started as a small blog sharing travel tips has grown into a full-service
                                travel community. Today, we connect thousands of adventurers with reliable
                                transport, expert guides, and curated itineraries, all while maintaining the
                                personal touch and local authenticity that sparked our beginning.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="features section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Us?</h2>
                        <p className="section-subtitle">We go the extra mile to ensure your journey is perfect.</p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((f) => (
                            <div key={f.id} className="feature-item text-center reveal">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon">{f.icon}</div>
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="riders-guides section" id="services">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">
                            Ensuring your journey is safe, comfortable, and enlightening.
                        </p>
                    </div>
                    <div className="services-grid">
                        {SERVICES.map((svc) => (
                            <article key={svc.id} className="service-card reveal">
                                <span className={`service-badge ${svc.badgeClass}`}>{svc.badgeLabel}</span>
                                <h3 className="service-title">{svc.title}</h3>
                                <p className="service-description">{svc.description}</p>
                                <Link to="/contact" className="service-link">
                                    {svc.linkLabel} <span className="arrow">&rarr;</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq section" id="faq">
                <div className="container faq-container">
                    <div className="section-header">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-list">
                        {FAQS.map((faq) => (
                            <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
