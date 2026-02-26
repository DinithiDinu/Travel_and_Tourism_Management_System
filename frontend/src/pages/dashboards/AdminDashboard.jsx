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

const AdminDashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        navigate('/signin');
    };

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLankaTravel</h2>
                    <span className="badge">Admin</span>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                            Overview
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'travelers' ? 'active' : ''} onClick={() => setActiveTab('travelers')}>
                            Manage Travelers
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'providers' ? 'active' : ''} onClick={() => setActiveTab('providers')}>
                            Manage Providers
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                            Platform Settings
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                            Profile Settings
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
                    <h1>Admin Dashboard</h1>
                    <p>Manage users, providers, and platform settings.</p>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">
                        {activeTab === 'overview' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">System Overview</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>152</h3>
                                        <p style={{ color: 'var(--text-light)' }}>Total Travelers</p>
                                    </div>
                                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>48</h3>
                                        <p style={{ color: 'var(--text-light)' }}>Active Providers</p>
                                    </div>
                                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>$12.4k</h3>
                                        <p style={{ color: 'var(--text-light)' }}>Monthly Revenue</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'travelers' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">Manage Travelers</h2>
                                </div>
                                <p style={{ color: 'var(--text-light)' }}>Traveler management grid displays here.</p>
                            </div>
                        )}

                        {activeTab === 'providers' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">Manage Providers (Riders/Guides)</h2>
                                </div>
                                <p style={{ color: 'var(--text-light)' }}>Provider management grid displays here.</p>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <div className="panel-header">
                                    <h2 className="panel-title">Platform Settings</h2>
                                </div>
                                <p style={{ color: 'var(--text-light)' }}>Application controls displays here.</p>
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

export default AdminDashboard;
