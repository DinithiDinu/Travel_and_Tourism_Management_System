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

const UpdatePasswordPage = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('updating');
        // TODO: integrate API
        await new Promise(res => setTimeout(res, 1000));
        setStatus('updated');
    };

    return (
        <div ref={pageRef} className="auth-page">
            <Navbar badge="Guest" />

            <header className="auth-header section">
                <div className="container">
                    <h1 className="section-title">Set New Password</h1>
                    <p className="section-subtitle">Please securely store your new password.</p>
                </div>
                <div className="wave-container">
                    <TopWave />
                </div>
            </header>

            <section className="auth-section section">
                <div className="container">
                    <div className="auth-card reveal">
                        {status === 'updated' ? (
                            <div className="success-message" style={{ textAlign: 'center' }}>
                                <div className="success-icon" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>✓</div>
                                <h2>Password Updated!</h2>
                                <p>Your password has been successfully reset.</p>
                                <button className="btn-submit" onClick={() => navigate('/signin')} style={{ display: 'block', textDecoration: 'none', marginTop: '20px' }}>
                                    Go to Sign In
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'updating'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'updating'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={status === 'updating'}
                                >
                                    {status === 'updating' ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default UpdatePasswordPage;
