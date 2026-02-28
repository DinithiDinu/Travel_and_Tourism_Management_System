import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        await new Promise(res => setTimeout(res, 1000));
        setStatus('idle');

        let role = 'traveler';
        let dashRoute = '/dashboard/traveler';

        if (form.email.includes('admin')) {
            role = 'admin'; dashRoute = '/dashboard/admin';
        } else if (form.email.includes('provider')) {
            role = 'provider'; dashRoute = '/dashboard/provider';
        } else if (form.email.includes('rider')) {
            role = 'rider'; dashRoute = '/dashboard/rider';
        }

        localStorage.setItem('userRole', role);

        if ((role === 'provider' || role === 'rider') && form.password === 'changeme') {
            navigate('/update-password');
        } else {
            navigate(dashRoute);
        }
    };

    return (
        <div className="auth-page">
            {/* Left Photo Panel */}
            <div className="auth-photo-panel">
                <img src="/assets/Sigiriya.jpg" alt="Sigiriya, Sri Lanka" />
                <div className="auth-photo-overlay" />
                <div className="auth-photo-content">
                    <Link to="/" className="auth-photo-logo">SriLanka<span>Travel</span></Link>
                    <div className="auth-photo-quote">
                        <p>"Sri Lanka is a land of breathtaking beauty — ancient temples wreathed in mist, beaches that stretch to the horizon, and a warmth of spirit that lingers long after you've left."</p>
                        <cite>— SriLanka Travel</cite>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-form-inner">
                    <div className="auth-form-header">
                        <h1>Welcome Back 👋</h1>
                        <p>Sign in to manage your bookings and explore more.</p>
                    </div>

                    <div className="demo-creds">
                        <p>Demo Credentials</p>
                        <ul>
                            <li><strong>Admin:</strong> admin@test.com</li>
                            <li><strong>Traveler:</strong> user@test.com</li>
                            <li><strong>Provider / Rider:</strong> provider@test.com (pw: changeme)</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" placeholder="you@example.com"
                                value={form.email} onChange={handleChange} required disabled={status === 'sending'} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="••••••••"
                                value={form.password} onChange={handleChange} required disabled={status === 'sending'} />
                        </div>
                        <div className="form-actions">
                            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                        </div>
                        <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Signing In…' : 'Sign In →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don&rsquo;t have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
