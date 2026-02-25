import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './GuestHomePage.css';

/* ─── Data ─────────────────────────────────────────────── */
const DESTINATIONS = [
    {
        id: 1,
        image: '/assets/Sigiriya.jpg',
        alt: 'Sigiriya Rock Fortress',
        badge: 'Cultural',
        title: 'Sigiriya',
        description:
            'The ancient rock fortress and palace ruin surrounded by the remains of an extensive network of gardens.',
    },
    {
        id: 2,
        image: '/assets/Ella.jpg',
        alt: 'Ella Train',
        badge: 'Nature',
        title: 'Ella',
        description:
            'A small town in the Badulla District, famous for its tea plantations and the Nine Arch Bridge.',
    },
    {
        id: 3,
        image: '/assets/Mirissa.jpg',
        alt: 'Mirissa Beach',
        badge: 'Beach',
        title: 'Mirissa',
        description:
            'A small town on the south coast, a popular tourist destination for whale watching and surfing.',
    },
    {
        id: 4,
        image: '/assets/hiking.jpg',
        alt: 'Horton Plains',
        badge: 'Hiking',
        title: 'Horton Plains',
        description:
            "Discover the breathtaking World's End precipice and trek through misty cloud forests rich in biodiversity.",
    },
    {
        id: 5,
        image: '/assets/hikkaduwa.jpg',
        alt: 'Hikkaduwa Nightlife',
        badge: 'Party',
        title: 'Hikkaduwa',
        description:
            'Experience the vibrant nightlife, beach parties, and festivals in the coastal town of Hikkaduwa.',
    },
];

const SERVICES = [
    {
        id: 1,
        badgeClass: 'badge-transport',
        badgeLabel: 'Transport',
        title: 'Professional Riders',
        description:
            'Travel in comfort and safety with our fleet of modern vehicles and experienced drivers who know every twist and turn of the island\'s roads.',
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

/* ─── Hero Wave SVG ─────────────────────────────────────── */
const HeroWave = () => (
    <div className="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
                fill="white"
                fillOpacity="1"
                d="M0,192L40,197.3C80,203,160,213,240,197.3C320,181,400,139,480,138.7C560,139,640,181,720,197.3C800,213,880,203,960,181.3C1040,160,1120,128,1200,128C1280,128,1360,160,1400,176L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            />
        </svg>
    </div>
);

/* ─── Scroll Reveal Hook ────────────────────────────────── */
function useScrollReveal() {
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        const elements = containerRef.current?.querySelectorAll('.reveal');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return containerRef;
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

/* ─── Main Page ─────────────────────────────────────────── */
const GuestHomePage = () => {
    const pageRef = useScrollReveal();

    return (
        <div ref={pageRef}>
            <Navbar badge="Guest" />

            {/* Hero */}
            <header className="hero" id="home">
                <div className="hero-overlay" />
                <div className="hero-content container">
                    <h1 className="hero-title">
                        Experience the Wonder of <br />
                        <span className="highlight">Sri Lanka</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover ancient ruins, golden beaches, and lush misty mountains.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/destinations" className="btn btn-primary">
                            Explore Destinations
                        </Link>
                        <Link to="/contact" className="btn btn-outline">
                            Plan My Trip
                        </Link>
                    </div>
                </div>
                <HeroWave />
            </header>

            {/* Featured Destinations */}
            <section className="destinations section" id="destinations">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Popular Destinations</h2>
                        <p className="section-subtitle">Handpicked experiences for your perfect getaway.</p>
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
                                        Explore <span className="arrow">&rarr;</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Riders & Guides */}
            <section className="riders-guides section" id="team">
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

export default GuestHomePage;
