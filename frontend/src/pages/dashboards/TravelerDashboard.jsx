import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../../components/dashboard/MyProfile';
import RewardsPanel from '../../components/dashboard/RewardsPanel';
import TravelerDestinationsPanel from '../../components/dashboard/TravelerDestinationsPanel';
import TravelerDestinationDetailsPanel from '../../components/dashboard/TravelerDestinationDetailsPanel';
import TravelerHotelDetailsPanel from '../../components/dashboard/TravelerHotelDetailsPanel';
import TravelerCheckoutPanel from '../../components/dashboard/TravelerCheckoutPanel';
import TravelerPaymentsPanel from '../../components/dashboard/TravelerPaymentsPanel';
import TravelerSavedDestinationsPanel from '../../components/dashboard/TravelerSavedDestinationsPanel';

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
];

const TravelerDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isCheckoutActive, setIsCheckoutActive] = useState(false);
    const [savedDestinations, setSavedDestinations] = useState([]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
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
        setActiveTab('bookings');
    };

    const handleToggleSave = (slug) => {
        setSavedDestinations(prev =>
            prev.includes(slug) ? prev.filter(d => d !== slug) : [...prev, slug]
        );
    };

    const handleLogout = () => navigate('/signin');

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
                                <div className="panel-header">
                                    <h2 className="panel-title">My Bookings</h2>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleTabChange('destinations')}>+ New Trip</button>
                                </div>
                                <div className="empty-state">
                                    <div className="empty-icon">🧳</div>
                                    <p>You have no upcoming trips yet.<br />Start exploring and plan your dream Sri Lanka adventure!</p>
                                    <button className="btn btn-outline-dark" onClick={() => handleTabChange('destinations')}>
                                        Explore Destinations →
                                    </button>
                                </div>
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
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TravelerDashboard;
