import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import './DestinationsPage.css';

/* ─── Destination Data ──────────────────────────────────── */
const BASE_DESTINATIONS = [
    {
        id: 1,
        image: '/assets/Sigiriya.jpg',
        alt: 'Sigiriya Rock Fortress',
        badge: 'Cultural',
        title: 'Sigiriya',
        description: 'The ancient rock fortress and palace ruin surrounded by the remains of an extensive network of gardens.',
        slug: 'sigiriya',
    },
    {
        id: 2,
        image: '/assets/Ella.jpg',
        alt: 'Ella Train',
        badge: 'Nature',
        title: 'Ella',
        description: 'A small town in the Badulla District, famous for its tea plantations and the Nine Arch Bridge.',
        slug: 'ella',
    },
    {
        id: 3,
        image: '/assets/Mirissa.jpg',
        alt: 'Mirissa Beach',
        badge: 'Beach',
        title: 'Mirissa',
        description: 'A small town on the south coast, a popular tourist destination for whale watching and surfing.',
        slug: 'mirissa',
    },
    {
        id: 4,
        image: '/assets/hiking.jpg',
        alt: 'Horton Plains',
        badge: 'Hiking',
        title: 'Horton Plains',
        description: "Discover the breathtaking World's End precipice and trek through misty cloud forests rich in biodiversity.",
        slug: 'horton-plains',
    },
    {
        id: 5,
        image: '/assets/hikkaduwa.jpg',
        alt: 'Hikkaduwa Nightlife',
        badge: 'Party',
        title: 'Hikkaduwa',
        description: 'Experience the vibrant nightlife, beach parties, and festivals in the coastal town of Hikkaduwa.',
        slug: 'hikkaduwa',
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1588258524675-a48a3f89839c?q=80&w=1000&auto=format&fit=crop',
        alt: 'Yala National Park',
        badge: 'Wildlife',
        title: 'Yala',
        description: "Leopards and diverse wildlife safaris in one of Sri Lanka's finest national parks.",
        slug: 'yala',
    },
];

/* Build 15-card array by repeating (mirrors the original JS cloning) */
const TARGET_COUNT = 15;
const CARDS = Array.from(
    { length: TARGET_COUNT },
    (_, i) => ({ ...BASE_DESTINATIONS[i % BASE_DESTINATIONS.length], uid: i })
);

const CARD_WIDTH = 330; // px — spacing between cards
const TOTAL_WIDTH = CARDS.length * CARD_WIDTH;
const AUTO_SCROLL_SPEED = 1;      // px per frame
const IDLE_TIMEOUT = 2000;        // ms before auto-scroll resumes
const MAX_DIST = 1000;

/* ─── Carousel ──────────────────────────────────────────── */
const PerspectiveCarousel = () => {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const stateRef = useRef({
        currentScroll: 0,
        targetScroll: 0,
        currentTilt: 0,
        targetTilt: 0,
        isDragging: false,
        startX: 0,
        lastX: 0,
        isInteracting: false,
        idleTimer: null,
        rafId: null,
    });

    useEffect(() => {
        const s = stateRef.current;
        const container = containerRef.current;
        if (!container) return;

        /* ── helpers ── */
        const resetIdleTimer = () => {
            clearTimeout(s.idleTimer);
            s.isInteracting = true;
            s.idleTimer = setTimeout(() => { s.isInteracting = false; }, IDLE_TIMEOUT);
        };

        /* ── wheel ── */
        const onWheel = (e) => {
            s.targetScroll += e.deltaY * 0.5;
            resetIdleTimer();
        };

        /* ── mouse tilt ── */
        const onMouseMove = (e) => {
            const y = e.clientY / window.innerHeight;
            s.targetTilt = (y - 0.5) * 20;
        };

        /* ── touch ── */
        const onTouchStart = (e) => {
            s.isDragging = true;
            s.startX = e.touches[0].clientX;
            s.lastX = s.startX;
            resetIdleTimer();
        };
        const onTouchMove = (e) => {
            if (!s.isDragging) return;
            const currentX = e.touches[0].clientX;
            s.targetScroll -= (currentX - s.lastX) * 1.5;
            s.lastX = currentX;
            e.preventDefault();
        };
        const onTouchEnd = () => {
            s.isDragging = false;
            resetIdleTimer();
        };

        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('mousemove', onMouseMove);
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        container.addEventListener('touchmove', onTouchMove, { passive: false });
        container.addEventListener('touchend', onTouchEnd);

        /* ── rAF animation loop ── */
        const animate = () => {
            // Auto-scroll when idle
            if (!s.isInteracting && !s.isDragging) {
                s.targetScroll += AUTO_SCROLL_SPEED;
            }

            // Smooth lerp
            s.currentScroll += (s.targetScroll - s.currentScroll) * 0.08;
            s.currentTilt += (s.targetTilt - s.currentTilt) * 0.1;

            // Tilt the whole container
            container.style.transform = `rotateX(${s.currentTilt}deg)`;

            // Per-card transforms
            cardRefs.current.forEach((card, index) => {
                if (!card) return;
                const itemBaseX = index * CARD_WIDTH;
                let relativeX = (itemBaseX - s.currentScroll) % TOTAL_WIDTH;

                if (relativeX < -TOTAL_WIDTH / 2) relativeX += TOTAL_WIDTH;
                if (relativeX > TOTAL_WIDTH / 2) relativeX -= TOTAL_WIDTH;

                const distFromCenter = Math.abs(relativeX);
                const progress = Math.min(distFromCenter / MAX_DIST, 1);

                const z = -progress * 250;
                const rotateY = relativeX > 0 ? -progress * 30 : progress * 30;
                const opacity = 1 - progress * 0.2;
                const blur = progress * 2;

                card.style.transform = `translateX(${relativeX}px) translateZ(${z}px) rotateY(${rotateY}deg)`;
                card.style.filter = `brightness(${opacity}) blur(${blur}px)`;
                card.style.zIndex = String(Math.round(100 - progress * 100));
            });

            s.rafId = requestAnimationFrame(animate);
        };

        s.rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(s.rafId);
            clearTimeout(s.idleTimer);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
        };
    }, []);

    return (
        <div className="cylinder-viewport">
            <div className="cylinder-stage">
                <div className="cylinder" ref={containerRef}>
                    {CARDS.map((dest, i) => (
                        <article
                            key={dest.uid}
                            className="cylinder-card"
                            ref={(el) => (cardRefs.current[i] = el)}
                        >
                            <div className="card-image">
                                <img src={dest.image} alt={dest.alt} loading="lazy" draggable={false} />
                                <div className="card-badge">{dest.badge}</div>
                            </div>
                            <div className="card-content">
                                <h3>{dest.title}</h3>
                                <p>{dest.description}</p>
                                <Link to={`/destinations/${dest.slug}`} className="card-link">
                                    Explore <span className="arrow">&rarr;</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── Page ──────────────────────────────────────────────── */
const DestinationsPage = () => (
    <div>
        <Navbar badge="Guest" />

        <div className="page-header" style={{ position: 'relative' }}>
            <div className="container">
                <h1 className="section-title">Explore Destinations</h1>
                <p className="section-subtitle">
                    Scroll, drag, or use your mouse wheel — let Sri Lanka come to you.
                </p>
            </div>
            <div style={{ color: '#fff' }}>
                <TopWave />
            </div>
        </div>

        {/* Desktop 3D Cylinder */}
        <div className="desktop-only">
            <PerspectiveCarousel />
        </div>

        {/* Mobile Sticky Stacking Cards */}
        <div className="mobile-only container">
            <div className="motion-scroller">
                {BASE_DESTINATIONS.map((dest) => (
                    <article key={dest.id} className="card destination-card">
                        <div className="card-image">
                            <img src={dest.image} alt={dest.alt} loading="lazy" />
                            <div className="card-badge">{dest.badge}</div>
                        </div>
                        <div className="card-content">
                            <h3>{dest.title}</h3>
                            <p>{dest.description}</p>
                            <Link to={`/destinations/${dest.slug}`} className="card-link">
                                Explore <span className="arrow">&rarr;</span>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>

        <Footer />
    </div>
);

export default DestinationsPage;
