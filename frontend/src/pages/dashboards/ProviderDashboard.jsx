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

const ProviderDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('requests');

    const handleLogout = () => {
        navigate('/signin');
    };

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLankaTravel</h2>
                    <span className="badge">Provider</span>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>
                            New Requests
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>
                            My Schedule
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'earnings' ? 'active' : ''} onClick={() => setActiveTab('earnings')}>
                            Earnings
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                            Service Profile
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
                    <h1>Provider Dashboard</h1>
                    <p>Manage your rides, tours, and availability.</p>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">
                        {activeTab === 'requests' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">New Service Requests</h2>
                                </div>
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
                                    <p>You have no pending requests.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schedule' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">My Schedule</h2>
                                </div>
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                    <p>Your upcoming trips will appear here.</p>
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
                                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0' }}>$340.00</h3>
                                    </div>
                                    <div style={{ padding: '30px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
                                        <p style={{ color: '#64748b', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>This Month</p>
                                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0' }}>$1,250.00</h3>
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

export default ProviderDashboard;
