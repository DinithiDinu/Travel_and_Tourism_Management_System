import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

const ForgotPasswordPage = () => {
    const pageRef = useScrollReveal();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        // TODO: call API to send password reset email
        await new Promise(res => setTimeout(res, 1000));
        setStatus('sent');
    };

    return (
        <div ref={pageRef} className="auth-page">
            <Navbar badge="Guest" />

            <header className="auth-header section">
                <div className="container">
                    <h1 className="section-title">Forgot Password</h1>
                    <p className="section-subtitle">We will send you a code to reset your password.</p>
                </div>
                <div className="wave-container">
                    <TopWave />
                </div>
            </header>

            <section className="auth-section section">
                <div className="container">
                    <div className="auth-card reveal">
                        {status === 'sent' ? (
                            <div className="success-message" style={{ textAlign: 'center' }}>
                                <div className="success-icon" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>✉️</div>
                                <h2>Check Your Email</h2>
                                <p>If an account exists for {email}, we have sent a password reset OTP.</p>
                                <Link to="/verify-password" className="btn-submit" style={{ display: 'block', textDecoration: 'none', marginTop: '20px' }}>
                                    Enter OTP
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={status === 'sending'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={status === 'sending' || !email}
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        )}

                        <div className="auth-footer">
                            <p>Remember your password? <Link to="/signin" className="auth-link">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ForgotPasswordPage;
