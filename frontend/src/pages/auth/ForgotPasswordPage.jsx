import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        await new Promise(res => setTimeout(res, 1000));
        setStatus('sent');
    };

    return (
        <div className="auth-page">
            {/* Left Photo Panel */}
            <div className="auth-photo-panel">
                <img src="/assets/Ella.jpg" alt="Ella, Sri Lanka" />
                <div className="auth-photo-overlay" />
                <div className="auth-photo-content">
                    <Link to="/" className="auth-photo-logo">SriLanka<span>Travel</span></Link>
                    <div className="auth-photo-quote">
                        <p>"Every journey begins with a single step. We're here to make every step unforgettable."</p>
                        <cite>— SriLanka Travel</cite>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-form-inner">
                    {status === 'sent' ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>✉️</div>
                            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Check Your Email</h1>
                            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.7' }}>
                                If an account exists for <strong>{email}</strong>, we've sent a password reset OTP.
                            </p>
                            <Link to="/verify-password" className="btn-submit" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                                Enter OTP →
                            </Link>
                            <div className="auth-footer">
                                <p>Remember your password? <Link to="/signin" className="auth-link">Sign In</Link></p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="auth-form-header">
                                <h1>Forgot Password 🔐</h1>
                                <p>We'll send you a code to reset your password.</p>
                            </div>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" placeholder="you@example.com"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        required disabled={status === 'sending'} />
                                </div>
                                <button type="submit" className="btn-submit" disabled={status === 'sending' || !email}>
                                    {status === 'sending' ? 'Sending…' : 'Send Reset Link →'}
                                </button>
                            </form>
                            <div className="auth-footer">
                                <p>Remember your password? <Link to="/signin" className="auth-link">Sign In</Link></p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
