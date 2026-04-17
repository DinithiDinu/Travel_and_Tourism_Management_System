import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../../components/dashboard/MyProfile';
import GuideServicesPanel from '../../components/dashboard/GuideServicesPanel';
import FinanceManagementPanel from '../../components/dashboard/FinanceManagementPanel';

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

const Guidedashboard = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('guide_services');

    const handleLogout = () => {
        navigate('/signin');
    };

    return (
        <div ref={pageRef} className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>SriLanka<span>Travel</span></h2>
                    <span className="badge">Guide</span>
                </div>
                <ul className="sidebar-menu">
                    {[
                        { id: 'guide_services', label: 'Guide Services' },                        { id: 'earnings', label: 'Earnings' },
                        { id: 'earnings', label: 'Earnings' },
                        { id: 'profile', label: 'Guide Profile' },
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
                        <h1>Guide Dashboard</h1>
                        <p>Manage your tours, guide services, availability, and earnings.</p>
                    </div>
                    <div className="dashboard-avatar" title="Guide Profile">PR</div>
                </header>

                <div className="dashboard-content reveal">
                    <section className="dashboard-panel">

                        {activeTab === 'guide_services' && <GuideServicesPanel />}


                        {activeTab === 'earnings' && <FinanceManagementPanel />}

                        {activeTab === 'profile' && (
                            <MyProfile />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Guidedashboard;
