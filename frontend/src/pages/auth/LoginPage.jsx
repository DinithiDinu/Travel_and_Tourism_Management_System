import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const BASE = 'http://localhost:8081/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('sending');
        try {
            const res = await fetch(`${BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', data.role?.toLowerCase());
            localStorage.setItem('userName', data.fullName);

            const roleRoutes = {
                ADMIN: '/dashboard/admin',
                TRAVELER: '/dashboard/traveler',
                GUIDE: '/dashboard/traveler',
                RIDER: '/dashboard/rider',
                SERVICE_PROVIDER: '/dashboard/provider',
            };
            navigate(roleRoutes[data.role] || '/dashboard/traveler');
        } catch (err) {
            setError(err.message);
            setStatus('idle');
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
                        <p>Demo Credentials <span style={{fontWeight:'normal'}}>(password: <code>password123</code>)</span></p>
                        <ul>
                            <li><strong>Admin:</strong> nimal.admin@tourism.lk</li>
                            <li><strong>Traveler:</strong> amal.perera@tourism.lk</li>
                            <li><strong>Rider:</strong> kasun.rider@tourism.lk</li>
                            <li><strong>Provider:</strong> priya.provider@tourism.lk</li>
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
                        {error && <p style={{ color: '#e53e3e', marginBottom: '0.75rem', fontSize: '0.875rem' }}>{error}</p>}
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
