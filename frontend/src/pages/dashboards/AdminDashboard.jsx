import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../../components/dashboard/MyProfile';
import PricingEnginePanel from '../../components/dashboard/PricingEnginePanel';
import UserManagementPanel from '../../components/dashboard/UserManagementPanel';
import GuidesManagementPanel from '../../components/dashboard/GuidesManagementPanel';
import FinanceManagementPanel from '../../components/dashboard/FinanceManagementPanel';
import TripBookingPanel from '../../components/dashboard/TripBookingPanel';
import RidesServicesPanel from '../../components/dashboard/RidesServicesPanel';

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
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'users', icon: '👥', label: 'User Management' },
    { id: 'guides', icon: '🧭', label: 'Guide Management' },
    { id: 'finance', icon: '💰', label: 'Finance' },
    { id: 'trips', icon: '🧳', label: 'Trip & Booking' },
    { id: 'rides', icon: '🚗', label: 'Rides & Services' },
    { id: 'pricing', icon: '🏷️', label: 'Pricing Engine' },
    { id: 'profile', icon: '👤', label: 'Profile Settings' },
];

const StatCard = ({ value, label, color = '#0d9488', icon }) => (
    <div style={{ padding: '28px', background: '#fff', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
        <h3 style={{ fontSize: '2.2rem', color, marginBottom: '6px', fontWeight: '800', letterSpacing: '-0.02em' }}>{value}</h3>
        <p style={{ color: '#64748b', fontWeight: '500', fontSize: '0.92rem', margin: 0 }}>{label}</p>
    </div>
);

const AdminDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const activeLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Dashboard';

    const handleLogout = () => navigate('/signin');

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLanka<span>Travel</span></h2>
                    <span className="badge">Admin</span>
                </div>
                <ul className="sidebar-menu">
                    {NAV_ITEMS.map(({ id, icon, label }) => (
                        <li key={id}>
                            <button className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
                                <span className="nav-icon">{icon}</span>{label}
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
                        <p>Admin control panel — manage all platform features.</p>
                    </div>
                    <div className="dashboard-avatar" title="Admin Profile" onClick={() => setActiveTab('profile')}>AD</div>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">

                        {activeTab === 'overview' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">System Overview</h2>
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Live data from backend</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                                    <StatCard icon="🧑‍🤝‍🧑" value="—" label="Total Users" />
                                    <StatCard icon="🧭" value="—" label="Registered Guides" color="#d97706" />
                                    <StatCard icon="🧳" value="—" label="Total Bookings" color="#6d28d9" />
                                    <StatCard icon="🚗" value="—" label="Active Rides" color="#0369a1" />
                                    <StatCard icon="💰" value="—" label="Monthly Revenue" color="#059669" />
                                    <StatCard icon="🏆" value="—" label="Avg Guide Rating" color="#d97706" />
                                </div>
                                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                        📌 Navigate to each section in the sidebar to manage live backend data. All panels are connected to the Spring Boot API running on <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>localhost:8080</code>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && <UserManagementPanel />}
                        {activeTab === 'guides' && <GuidesManagementPanel />}
                        {activeTab === 'finance' && <FinanceManagementPanel />}
                        {activeTab === 'trips' && <TripBookingPanel />}
                        {activeTab === 'rides' && <RidesServicesPanel />}
                        {activeTab === 'pricing' && <PricingEnginePanel />}
                        {activeTab === 'profile' && <MyProfile />}

                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
