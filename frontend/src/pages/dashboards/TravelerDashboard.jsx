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
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        const els = ref.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return ref;
}

const TravelerDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isCheckoutActive, setIsCheckoutActive] = useState(false);
    const [savedDestinations, setSavedDestinations] = useState([]);

    // Reset sub-navigation when switching primary tabs
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
        setActiveTab('bookings'); // Simulate a redirect to the bookings page internally
    };

    const handleToggleSave = (slug) => {
        setSavedDestinations(prev =>
            prev.includes(slug)
                ? prev.filter(d => d !== slug)
                : [...prev, slug]
        );
    };

    const handleLogout = () => {
        // TODO: Handle actual logout logic
        navigate('/signin');
    };

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLankaTravel</h2>
                    <span className="badge">Traveler</span>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <button
                            className={activeTab === 'bookings' ? 'active' : ''}
                            onClick={() => handleTabChange('bookings')}
                        >
                            My Bookings
                        </button>
                    </li>
                    <li>
                        <button
                            className={activeTab === 'destinations' ? 'active' : ''}
                            onClick={() => handleTabChange('destinations')}
                        >
                            Explore Destinations
                        </button>
                    </li>
                    <li>
                        <button
                            className={activeTab === 'favorites' ? 'active' : ''}
                            onClick={() => handleTabChange('favorites')}
                        >
                            Saved Destinations
                        </button>
                    </li>
                    <li>
                        <button
                            className={activeTab === 'rewards' ? 'active' : ''}
                            onClick={() => handleTabChange('rewards')}
                        >
                            Rewards & Loyalty
                        </button>
                    </li>
                    <li>
                        <button
                            className={activeTab === 'profile' ? 'active' : ''}
                            onClick={() => handleTabChange('profile')}
                        >
                            Profile Settings
                        </button>
                    </li>
                    <li>
                        <button
                            className={activeTab === 'payments' ? 'active' : ''}
                            onClick={() => handleTabChange('payments')}
                        >
                            Billing & Payments
                        </button>
                    </li>
                    <li className="logout-item">
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-topbar">
                    <h1>Traveler Dashboard</h1>
                    <p>Manage your upcoming trips and personal details.</p>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">
                        {activeTab === 'bookings' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">My Bookings</h2>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleTabChange('destinations')}>New Trip</button>
                                </div>
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧳</div>
                                    <p>You have no upcoming trips.</p>
                                    <button className="btn btn-outline" onClick={() => handleTabChange('destinations')}>Explore Destinations</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'destinations' && (
                            <div>
                                {isCheckoutActive && selectedHotel ? (
                                    <TravelerCheckoutPanel
                                        hotelId={selectedHotel}
                                        onBack={() => setIsCheckoutActive(false)}
                                        onCheckoutComplete={handleCheckoutComplete}
                                    />
                                ) : selectedHotel ? (
                                    <TravelerHotelDetailsPanel
                                        hotelId={selectedHotel}
                                        onBack={() => setSelectedHotel(null)}
                                        onBookNow={() => setIsCheckoutActive(true)}
                                    />
                                ) : selectedDestination ? (
                                    <TravelerDestinationDetailsPanel
                                        destinationSlug={selectedDestination}
                                        onBack={() => setSelectedDestination(null)}
                                        onHotelSelect={(hotelId) => setSelectedHotel(hotelId)}
                                    />
                                ) : (
                                    <TravelerDestinationsPanel
                                        onExplore={(slug) => setSelectedDestination(slug)}
                                        savedDestinations={savedDestinations}
                                        onToggleSave={handleToggleSave}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div>
                                {selectedHotel ? (
                                    <TravelerHotelDetailsPanel
                                        hotelId={selectedHotel}
                                        onBack={() => setSelectedHotel(null)}
                                        onBookNow={() => setIsCheckoutActive(true)}
                                    />
                                ) : selectedDestination ? (
                                    <TravelerDestinationDetailsPanel
                                        destinationSlug={selectedDestination}
                                        onBack={() => setSelectedDestination(null)}
                                        onHotelSelect={(hotelId) => setSelectedHotel(hotelId)}
                                    />
                                ) : (
                                    <TravelerSavedDestinationsPanel
                                        savedDestinations={savedDestinations}
                                        onExplore={(slug) => setSelectedDestination(slug)}
                                        onToggleSave={handleToggleSave}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <MyProfile />
                        )}

                        {activeTab === 'payments' && (
                            <TravelerPaymentsPanel />
                        )}

                        {activeTab === 'rewards' && (
                            <RewardsPanel />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TravelerDashboard;
