import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const VerifyPasswordPage = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState('idle');

    const handleVerify = async (e) => {
        e.preventDefault();
        setStatus('verifying');
        // TODO: integrate API
        await new Promise(res => setTimeout(res, 1000));
        setStatus('idle');
        navigate('/update-password');
    };

    return (
        <div className="auth-page">
            {/* Left Photo Panel */}
            <div className="auth-photo-panel">
                <img src="/assets/hiking.jpg" alt="Horton Plains, Sri Lanka" />
                <div className="auth-photo-overlay" />
                <div className="auth-photo-content">
                    <Link to="/" className="auth-photo-logo">SriLanka<span>Travel</span></Link>
                    <div className="auth-photo-quote">
                        <p>"Secure your journey. The safety of your adventure starts here."</p>
                        <cite>— SriLanka Travel Security</cite>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-form-inner">
                    <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: '#0f766e', textDecoration: 'none', fontWeight: 600 }}>
                        &larr; Back to Home
                    </Link>
                    <div className="auth-form-header">
                        <h1>Verify Email ✉️</h1>
                        <p>Enter the 6-digit code sent to your email.</p>
                    </div>

                    <form onSubmit={handleVerify} noValidate>
                        <div className="form-group">
                            <label htmlFor="otp">Verification Code</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                maxLength={6}
                                style={{ textAlign: 'center', letterSpacing: '0.6em', fontSize: '1.4rem', fontWeight: '600' }}
                                required
                                disabled={status === 'verifying'}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={status === 'verifying' || otp.length < 6}
                        >
                            {status === 'verifying' ? 'Verifying...' : 'Verify Code →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Didn&rsquo;t receive a code? <button type="button" className="resend-otp" onClick={() => { }} style={{ background: 'none', border: 'none', color: '#0d9488', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>Resend</button></p>
                        <p style={{ marginTop: '1rem' }}><Link to="/signin" className="auth-link">Back to Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPasswordPage;
