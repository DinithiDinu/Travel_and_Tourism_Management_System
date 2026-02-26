import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import './Auth.css';

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

const LoginPage = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        // TODO: integrate API
        await new Promise(res => setTimeout(res, 1000));
        setStatus('idle');

        let role = 'traveler';
        let dashRoute = '/dashboard/traveler';

        // Mock backend role resolution
        if (form.email.includes('admin')) {
            role = 'admin';
            dashRoute = '/dashboard/admin';
        } else if (form.email.includes('provider')) {
            role = 'provider';
            dashRoute = '/dashboard/provider';
        } else if (form.email.includes('rider')) {
            role = 'rider';
            dashRoute = '/dashboard/rider';
        }

        localStorage.setItem('userRole', role);

        // Mock first-login password change requirement
        if ((role === 'provider' || role === 'rider') && form.password === 'changeme') {
            navigate('/update-password');
        } else {
            navigate(dashRoute);
        }
    };

    return (
        <div ref={pageRef} className="auth-page">
            <Navbar badge="Guest" />

            <header className="auth-header section">
                <div className="container">
                    <h1 className="section-title">Welcome Back</h1>
                    <p className="section-subtitle">Sign in to manage your bookings and explore more.</p>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', marginTop: '20px', fontSize: '0.9rem', display: 'inline-block', textAlign: 'left' }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Demo Credentials:</p>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            <li><strong>Admin:</strong> admin@test.com</li>
                            <li><strong>Traveler:</strong> user@test.com</li>
                            <li><strong>Provider/Rider (First Login):</strong> provider@test.com / rider@test.com (Password: changeme)</li>
                        </ul>
                    </div>
                </div>
                <div className="wave-container">
                    <TopWave />
                </div>
            </header>

            <section className="auth-section section">
                <div className="container">
                    <div className="auth-card reveal">
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="form-actions">
                                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Don&rsquo;t have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LoginPage;
