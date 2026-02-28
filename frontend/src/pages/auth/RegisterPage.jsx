import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const BASE = 'http://localhost:8081/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setStatus('sending');
        try {
            const res = await fetch(`${BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: form.name,
                    email: form.email,
                    password: form.password,
                    role: 'TRAVELER',
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

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
                <img src="/assets/Mirissa.jpg" alt="Mirissa Beach, Sri Lanka" />
                <div className="auth-photo-overlay" />
                <div className="auth-photo-content">
                    <Link to="/" className="auth-photo-logo">SriLanka<span>Travel</span></Link>
                    <div className="auth-photo-quote">
                        <p>"Travel is the only thing you buy that makes you richer. Start your Sri Lanka story today."</p>
                        <cite>— SriLanka Travel Community</cite>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-form-inner">
                    <div className="auth-form-header">
                        <h1>Create Account 🌴</h1>
                        <p>Join thousands of travelers exploring Sri Lanka.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" placeholder="Your Name"
                                value={form.name} onChange={handleChange} required disabled={status === 'sending'} />
                        </div>
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
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••"
                                value={form.confirmPassword} onChange={handleChange} required disabled={status === 'sending'} />
                        </div>
                        {error && <p style={{ color: '#e53e3e', marginBottom: '0.75rem', fontSize: '0.875rem' }}>{error}</p>}
                        <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Creating Account…' : 'Create Account →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/signin" className="auth-link">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
