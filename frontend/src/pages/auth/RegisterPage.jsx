import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        await new Promise(res => setTimeout(res, 1000));
        setStatus('idle');
        navigate('/dashboard/traveler');
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
