import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const UpdatePasswordPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [status, setStatus] = useState('idle');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('updating');
        // TODO: integrate API
        await new Promise(res => setTimeout(res, 1000));
        setStatus('updated');
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
                        <p>"Your journey continues safely. A new password is the key to new adventures."</p>
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
                    
                    {status === 'updated' ? (
                        <div className="success-message" style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div className="success-icon" style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '1.5rem' }}>✓</div>
                            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.75rem 0' }}>Password Updated!</h2>
                            <p style={{ color: '#64748b', marginBottom: '2.5rem', lineHeight: '1.7' }}>
                                Your password has been successfully reset.
                            </p>
                            <button className="btn-submit" onClick={() => navigate('/signin')} style={{ display: 'block', textDecoration: 'none', width: '100%', marginBottom: '1rem' }}>
                                Go to Sign In →
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="auth-form-header">
                                <h1>Set New Password 🔐</h1>
                                <p>Please securely store your new password.</p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            disabled={status === 'updating'}
                                            style={{ paddingRight: '3.5rem' }}
                                        />
                                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Hide password" : "Show password"}>
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            disabled={status === 'updating'}
                                            style={{ paddingRight: '3.5rem' }}
                                        />
                                        <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} title={showConfirmPassword ? "Hide password" : "Show password"}>
                                            {showConfirmPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={status === 'updating'}
                                >
                                    {status === 'updating' ? 'Updating...' : 'Update Password →'}
                                </button>
                            </form>
                            <div className="auth-footer">
                                <p>Remembered your password? <Link to="/signin" className="auth-link">Sign In</Link></p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;
