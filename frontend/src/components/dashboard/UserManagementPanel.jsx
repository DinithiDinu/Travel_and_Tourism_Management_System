import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const ROLES = ['TRAVELER', 'ADMIN', 'GUIDE', 'RIDER', 'SERVICE_PROVIDER'];

const UserManagementPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null); // null | { mode: 'edit', user } | { mode: 'create' }
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const load = async () => {
        try {
            setLoading(true);
            const data = await api.get('/auth/users');
            setUsers(data || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openEdit = (user) => {
        setForm({ name: user.name, email: user.email, role: user.role });
        setModal({ mode: 'edit', user });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/auth/users/${modal.user.userId}`, form);
            await load();
            setModal(null);
        } catch (e) {
            alert('Error: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.del(`/auth/users/${id}`);
            setUsers(prev => prev.filter(u => u.userId !== id));
            setDeleteId(null);
        } catch (e) {
            alert('Error: ' + e.message);
        }
    };

    const filtered = users.filter(u => {
        const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
        const matchSearch = !searchTerm || u.name?.toLowerCase().includes(searchTerm.toLowerCase())
            || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchRole && matchSearch;
    });

    return (
        <div className="fp-root">
            {/* Header */}
            <div className="fp-header">
                <div>
                    <h2 className="fp-title">👥 User Management</h2>
                    <p className="fp-subtitle">{users.length} registered users</p>
                </div>
                <div className="fp-header-actions">
                    <input className="fp-search" placeholder="Search name or email…" value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} />
                    <select className="fp-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="ALL">All Roles</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="fp-loading"><div className="fp-spinner" /><span>Loading users…</span></div>
            ) : error ? (
                <div className="fp-error">
                    <span>⚠️ {error}</span>
                    <button className="fp-btn fp-btn-primary" onClick={load}>Retry</button>
                </div>
            ) : (
                <div className="fp-table-wrap">
                    <table className="fp-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th>
                                <th>Role</th><th>Created</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="6" className="fp-empty">No users found</td></tr>
                            ) : filtered.map(u => (
                                <tr key={u.userId}>
                                    <td><span className="fp-id">#{u.userId}</span></td>
                                    <td><strong>{u.name || '—'}</strong></td>
                                    <td>{u.email}</td>
                                    <td><span className={`fp-badge fp-badge-${u.role?.toLowerCase()}`}>{u.role}</span></td>
                                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                    <td>
                                        <div className="fp-actions">
                                            <button className="fp-btn fp-btn-edit" onClick={() => openEdit(u)}>Edit</button>
                                            <button className="fp-btn fp-btn-danger" onClick={() => setDeleteId(u.userId)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {modal && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>Edit User #{modal.user.userId}</h3>
                            <button className="fp-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="fp-form-group">
                                <label>Full Name</label>
                                <input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" />
                            </div>
                            <div className="fp-form-group">
                                <label>Email</label>
                                <input type="email" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" />
                            </div>
                            <div className="fp-form-group">
                                <label>Role</label>
                                <select value={form.role || ''} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fp-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>⚠️ Confirm Deletion</h3>
                            <button className="fp-modal-close" onClick={() => setDeleteId(null)}>✕</button>
                        </div>
                        <p style={{ padding: '1rem 0', color: '#64748b' }}>This action cannot be undone. Delete user <strong>#{deleteId}</strong>?</p>
                        <div className="fp-modal-footer">
                            <button className="fp-btn fp-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="fp-btn fp-btn-danger" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPanel;
