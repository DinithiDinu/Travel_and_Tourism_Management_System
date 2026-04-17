import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import MyProfile from '../../components/dashboard/MyProfile';
import RewardsPanel from '../../components/dashboard/RewardsPanel';
import TravelerDestinationsPanel from '../../components/dashboard/TravelerDestinationsPanel';
import TravelerDestinationDetailsPanel from '../../components/dashboard/TravelerDestinationDetailsPanel';
import TravelerHotelDetailsPanel from '../../components/dashboard/TravelerHotelDetailsPanel';
import TravelerCheckoutPanel from '../../components/dashboard/TravelerCheckoutPanel';
import TravelerPaymentsPanel from '../../components/dashboard/TravelerPaymentsPanel';
import TravelerSavedDestinationsPanel from '../../components/dashboard/TravelerSavedDestinationsPanel';
import RaiseTicket from '../../components/dashboard/RaiseTicket';
import MyTickets from '../../components/dashboard/MyTickets';
import GiveFeedback from '../../components/dashboard/GiveFeedback';
import MyFeedback from '../../components/dashboard/MyFeedback';
import MyBookingsPanel from '../../components/dashboard/MyBookingsPanel';

function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        const els = ref.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return ref;
}

const NAV_ITEMS = [
    { id: 'bookings', icon: '🧳', label: 'My Bookings' },
    { id: 'destinations', icon: '🗺️', label: 'Explore Destinations' },
    { id: 'favorites', icon: '❤️', label: 'Saved Destinations' },
    { id: 'rewards', icon: '🏆', label: 'Rewards & Loyalty' },
    { id: 'profile', icon: '👤', label: 'Profile Settings' },
    { id: 'payments', icon: '💳', label: 'Billing & Payments' },
    { id: 'tickets', icon: '🎫', label: 'Support & Complaints' },
    { id: 'myTickets', icon: '📋', label: 'My Tickets' },
    { id: 'feedback', label: 'Feedback & Reviews' },
    { id: 'myFeedback', label: 'My Feedback' },
];

const TravelerDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("travelerActiveTab") || 'bookings'
    );

    const [selectedDestination, setSelectedDestination] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState(null);
    const [isCheckoutActive, setIsCheckoutActive] = useState(false);
    const [savedDestinations, setSavedDestinations] = useState([]);

    useEffect(() => {
        const savedTab = localStorage.getItem("travelerActiveTab");
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, [location]);


    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        localStorage.setItem("travelerActiveTab", tabId);

        if (tabId !== 'destinations') {
            setSelectedDestination(null);
            setSelectedHotel(null);
            setIsCheckoutActive(false);
        }
    };

    const handleCheckoutComplete = () => {
        setIsCheckoutActive(false);
        setSelectedHotel(null);
        setSelectedDestination(null);
        setSelectedBookingForCheckout(null);
        setActiveTab('bookings');
    };

    const handlePayBooking = (bookingId) => {
        setSelectedBookingForCheckout(bookingId);
        setIsCheckoutActive(true);
    };

    const handleToggleSave = (slug) => {
        setSavedDestinations(prev =>
            prev.includes(slug) ? prev.filter(d => d !== slug) : [...prev, slug]
        );
    };

    const handleLogout = () => {
        // Clear all auth data so the next login starts fresh
        localStorage.removeItem('travelerActiveTab');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/signin');
    };

    const activeLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Dashboard';

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLanka<span>Travel</span></h2>
                    <span className="badge">Traveler</span>
                </div>
                <ul className="sidebar-menu">
                    {NAV_ITEMS.map(({ id, icon, label }) => (
                        <li key={id}>
                            <button
                                className={activeTab === id ? 'active' : ''}
                                onClick={() => handleTabChange(id)}
                            >
                                <span className="nav-icon">{icon}</span>
                                {label}
                            </button>
                        </li>
                    ))}
                    <li className="logout-item">
                        <button className="logout-btn" onClick={handleLogout}>
                            <span className="nav-icon">🚪</span> Logout
                        </button>
                    </li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-topbar">
                    <div className="dashboard-topbar-left">
                        <h1>{activeLabel}</h1>
                        <p>Manage your upcoming trips and personal details.</p>
                    </div>
                    <div className="dashboard-avatar" title="My Profile" onClick={() => handleTabChange('profile')}>
                        TU
                    </div>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">
                        {activeTab === 'bookings' && (
                            <div>
                                {isCheckoutActive && selectedBookingForCheckout ? (
                                    <TravelerCheckoutPanel bookingId={selectedBookingForCheckout} onBack={() => {setIsCheckoutActive(false); setSelectedBookingForCheckout(null);}} onCheckoutComplete={handleCheckoutComplete} />
                                ) : (
                                    <MyBookingsPanel onNewTrip={() => handleTabChange('destinations')} onPayBooking={handlePayBooking} />
                                )}
                            </div>
                        )}

                        {activeTab === 'destinations' && (
                            <div>
                                {isCheckoutActive && selectedHotel ? (
                                    <TravelerCheckoutPanel hotelId={selectedHotel} onBack={() => setIsCheckoutActive(false)} onCheckoutComplete={handleCheckoutComplete} />
                                ) : selectedHotel ? (
                                    <TravelerHotelDetailsPanel hotelId={selectedHotel} onBack={() => setSelectedHotel(null)} onBookNow={() => setIsCheckoutActive(true)} />
                                ) : selectedDestination ? (
                                    <TravelerDestinationDetailsPanel destinationSlug={selectedDestination} onBack={() => setSelectedDestination(null)} onHotelSelect={(hotelId) => setSelectedHotel(hotelId)} />
                                ) : (
                                    <TravelerDestinationsPanel onExplore={(slug) => setSelectedDestination(slug)} savedDestinations={savedDestinations} onToggleSave={handleToggleSave} />
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div>
                                {selectedHotel ? (
                                    <TravelerHotelDetailsPanel hotelId={selectedHotel} onBack={() => setSelectedHotel(null)} onBookNow={() => setIsCheckoutActive(true)} />
                                ) : selectedDestination ? (
                                    <TravelerDestinationDetailsPanel destinationSlug={selectedDestination} onBack={() => setSelectedDestination(null)} onHotelSelect={(hotelId) => setSelectedHotel(hotelId)} />
                                ) : (
                                    <TravelerSavedDestinationsPanel savedDestinations={savedDestinations} onExplore={(slug) => setSelectedDestination(slug)} onToggleSave={handleToggleSave} />
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && <MyProfile />}
                        {activeTab === 'payments' && <TravelerPaymentsPanel />}
                        {activeTab === 'rewards' && <RewardsPanel />}
                        {activeTab === 'tickets' && <RaiseTicket />}
                        {activeTab === 'myTickets' && <MyTickets />}
                        {activeTab === 'feedback' && <GiveFeedback />}
                        {activeTab === 'myFeedback' && <MyFeedback />}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TravelerDashboard;
