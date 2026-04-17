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

const VerifyPasswordPage = () => {
    const pageRef = useScrollReveal();
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
        <div ref={pageRef} className="auth-page">
            <Navbar badge="Guest" />

            <header className="auth-header section">
                <div className="container">
                    <h1 className="section-title">Verify Email</h1>
                    <p className="section-subtitle">Enter the 6-digit code sent to your email.</p>
                </div>
                <div className="wave-container">
                    <TopWave />
                </div>
            </header>

            <section className="auth-section section">
                <div className="container">
                    <div className="auth-card reveal">
                        <form onSubmit={handleVerify} noValidate>
                            <div className="form-group">
                                <label htmlFor="otp">Verification Code</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
                                    required
                                    disabled={status === 'verifying'}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={status === 'verifying' || otp.length < 6}
                            >
                                {status === 'verifying' ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Didn&rsquo;t receive a code? <button className="resend-otp" onClick={() => { }}>Resend</button></p>
                            <p style={{ marginTop: '10px' }}><Link to="/signin" className="auth-link">Back to Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default VerifyPasswordPage;
