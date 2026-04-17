import { useState } from 'react';

const MyProfile = () => {
    // Determine user role (this is a placeholder for actual user context)
    const userRole = localStorage.getItem('userRole') || 'Guest';

    const [form, setForm] = useState({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setStatus('saving');
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus('idle');
        setIsEditing(false);
    };

    return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="panel-title">My Profile</h2>
                {!isEditing && (
                    <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: isEditing ? '#fff' : '#f5f5f5', color: isEditing ? 'var(--text-color)' : 'var(--text-light)' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={!isEditing} // usually email can't be changed easily, but allowing it here for demo
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: isEditing ? '#fff' : '#f5f5f5', color: isEditing ? 'var(--text-color)' : 'var(--text-light)' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: isEditing ? '#fff' : '#f5f5f5', color: isEditing ? 'var(--text-color)' : 'var(--text-light)' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>Role</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userRole}
                                disabled
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#f5f5f5', color: 'var(--text-light)', textTransform: 'capitalize' }}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-color)' }}>Change Password</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="currentPassword"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group" style={{ marginBottom: '0' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '0' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-color)' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                            <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
                                {status === 'saving' ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={status === 'saving'}>
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MyProfile;
