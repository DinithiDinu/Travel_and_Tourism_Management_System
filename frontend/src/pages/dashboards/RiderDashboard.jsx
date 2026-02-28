import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../../components/dashboard/MyProfile';

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

const RiderDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('rides');

    const handleLogout = () => {
        // TODO: Handle actual logout logic
        navigate('/signin');
    };

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLanka<span>Travel</span></h2>
                    <span className="badge">Rider</span>
                </div>
                <ul className="sidebar-menu">
                    {[
                        { id: 'rides', icon: '🚗', label: 'My Rides' },
                        { id: 'earnings', icon: '💵', label: 'Earnings' },
                        { id: 'profile', icon: '👤', label: 'Profile Settings' },
                    ].map(({ id, icon, label }) => (
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
                        <h1>Rider Dashboard</h1>
                        <p>Manage your upcoming trips, vehicle details, and earnings.</p>
                    </div>
                    <div className="dashboard-avatar" title="Rider Profile">RD</div>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">
                        {activeTab === 'rides' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">My Rides</h2>
                                    <button className="btn btn-primary btn-sm">Find Requests</button>
                                </div>
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
                                    <p>You have no upcoming rides scheduled.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'earnings' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">Earnings Report</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '20px' }}>
                                    <div style={{ padding: '30px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
                                        <p style={{ color: '#64748b', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>This Week</p>
                                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0' }}>$150.00</h3>
                                    </div>
                                    <div style={{ padding: '30px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
                                        <p style={{ color: '#64748b', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>This Month</p>
                                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0' }}>$600.00</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <MyProfile />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RiderDashboard;
