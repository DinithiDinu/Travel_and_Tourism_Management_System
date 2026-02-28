import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const CATEGORIES = ['BEACH', 'CULTURAL', 'PARTY', 'HIKING', 'MEDITATION', 'WILDLIFE', 'ADVENTURE'];
const STATUS_OPTS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const TripBookingPanel = () => {
    const [tab, setTab] = useState('trips');
    const [trips, setTrips] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [statusTarget, setStatusTarget] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const loadAll = async () => {
        setLoading(true);
        try {
            const [t, b, c] = await Promise.all([
                api.get('/bookings/trips'),
                api.get('/bookings'),
                api.get('/bookings/categories'),
            ]);
            setTrips(t || []);
            setBookings(b || []);
            setCategories(c || []);
        } catch (_) { }
        finally { setLoading(false); }
    };

    useEffect(() => { loadAll(); }, []);

    /* ── Trips CRUD ── */
    const openCreateTrip = () => {
        setForm({ title: '', description: '', durationDays: '', price: '', capacity: '', category: 'BEACH', location: '', difficulty: 'EASY' });
        setModal({ mode: 'create', type: 'trip' });
    };
    const openEditTrip = (t) => {
        setForm({ ...t });
        setModal({ mode: 'edit', type: 'trip', item: t });
    };
    const saveTripForm = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (modal.mode === 'create') await api.post('/bookings/trips', form);
            else await api.put(`/bookings/trips/${modal.item.id}`, form);
            await loadAll(); setModal(null);
        } catch (e) { alert('Error: ' + e.message); }
        finally { setSaving(false); }
    };
    const deleteTrip = async (id) => {
        try { await api.del(`/bookings/trips/${id}`); setTrips(prev => prev.filter(t => t.id !== id)); setDeleteTarget(null); }
        catch (e) { alert('Error: ' + e.message); }
    };

    /* ── Bookings CRUD ── */
    const openCreateBooking = () => {
        setForm({ userId: '', tripId: '', numberOfPeople: 1, specialRequests: '' });
        setModal({ mode: 'create', type: 'booking' });
    };
    const saveBookingForm = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            await api.post('/bookings', form);
            await loadAll(); setModal(null);
        } catch (e) { alert('Error: ' + e.message); }
        finally { setSaving(false); }
    };
    const updateBookingStatus = async () => {
        try { await api.patch(`/bookings/${statusTarget.bookingId}/status`, { status: newStatus }); await loadAll(); setStatusTarget(null); }
        catch (e) { alert('Error: ' + e.message); }
    };
    const deleteBooking = async (id) => {
        try { await api.del(`/bookings/${id}`); setBookings(prev => prev.filter(b => b.bookingId !== id)); setDeleteTarget(null); }
        catch (e) { alert('Error: ' + e.message); }
    };

    return (
        <div className="fp-root">
            <div className="fp-header">
                <div>
                    <h2 className="fp-title">🧳 Trip & Booking Management</h2>
                    <p className="fp-subtitle">{trips.length} trips • {bookings.length} bookings</p>
                </div>
                <button className="fp-btn fp-btn-primary" onClick={tab === 'trips' ? openCreateTrip : openCreateBooking}>
                    + {tab === 'trips' ? 'New Trip' : 'New Booking'}
                </button>
            </div>

            <div className="fp-tabs">
                <button className={`fp-tab-btn${tab === 'trips' ? ' active' : ''}`} onClick={() => setTab('trips')}>🗺️ Trips ({trips.length})</button>
                <button className={`fp-tab-btn${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>📋 Bookings ({bookings.length})</button>
                <button className={`fp-tab-btn${tab === 'categories' ? ' active' : ''}`} onClick={() => setTab('categories')}>🏷️ Categories ({categories.length})</button>
            </div>

            {loading ? (
                <div className="fp-loading"><div className="fp-spinner" /><span>Loading…</span></div>
            ) : (
                <>
                    {tab === 'trips' && (
                        <div className="fp-cards-grid">
                            {trips.length === 0 ? <p className="fp-empty-msg">No trips found. Create one!</p> : trips.map(t => (
                                <div key={t.id} className="fp-trip-card">
                                    <div className="fp-trip-badge">{t.category}</div>
                                    <h3 className="fp-trip-title">{t.title}</h3>
                                    <p className="fp-trip-desc">{t.description}</p>
                                    <div className="fp-trip-meta">
                                        <span>📍 {t.location}</span>
                                        <span>⏱ {t.durationDays} days</span>
                                        <span>👥 {t.capacity} pax</span>
                                    </div>
                                    <div className="fp-trip-footer">
                                        <span className="fp-trip-price">LKR {Number(t.price || 0).toLocaleString()}</span>
                                        <div className="fp-actions">
                                            <button className="fp-btn fp-btn-edit" onClick={() => openEditTrip(t)}>Edit</button>
                                            <button className="fp-btn fp-btn-danger" onClick={() => setDeleteTarget({ type: 'trip', id: t.id })}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'bookings' && (
                        <div className="fp-table-wrap">
                            <table className="fp-table">
                                <thead><tr><th>ID</th><th>User</th><th>Trip</th><th>People</th><th>Status</th><th>Date</th><th>Total</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr><td colSpan="8" className="fp-empty">No bookings yet.</td></tr>
                                    ) : bookings.map(b => (
                                        <tr key={b.bookingId}>
                                            <td><span className="fp-id">#{b.bookingId}</span></td>
                                            <td>User #{b.userId}</td>
                                            <td>Trip #{b.tripId}</td>
                                            <td>{b.numberOfPeople}</td>
                                            <td><span className={`fp-badge fp-badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                                            <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '—'}</td>
                                            <td>LKR {Number(b.totalAmount || 0).toLocaleString()}</td>
                                            <td>
                                                <div className="fp-actions">
                                                    <button className="fp-btn fp-btn-view" onClick={() => { setStatusTarget(b); setNewStatus(b.status); }}>Status</button>
                                                    <button className="fp-btn fp-btn-danger" onClick={() => setDeleteTarget({ type: 'booking', id: b.bookingId })}>Cancel</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {tab === 'categories' && (
                        <div className="fp-table-wrap">
                            <table className="fp-table">
                                <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr><td colSpan="4" className="fp-empty">No categories</td></tr>
                                    ) : categories.map(c => (
                                        <tr key={c.categoryId}>
                                            <td><span className="fp-id">#{c.categoryId}</span></td>
                                            <td><strong>{c.name}</strong></td>
                                            <td>{c.description}</td>
                                            <td><button className="fp-btn fp-btn-danger" onClick={() => setDeleteTarget({ type: 'category', id: c.categoryId })}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Trip modal */}
            {modal?.type === 'trip' && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal fp-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>{modal.mode === 'create' ? '+ New Trip' : 'Edit Trip'}</h3>
                            <button className="fp-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <form onSubmit={saveTripForm}>
                            <div className="fp-form-grid">
                                <div className="fp-form-group fp-span-2"><label>Title</label><input value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
                                <div className="fp-form-group fp-span-2"><label>Description</label><textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="2" /></div>
                                <div className="fp-form-group"><label>Category</label><select value={form.category || ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                                <div className="fp-form-group"><label>Location</label><input value={form.location || ''} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Price (LKR)</label><input type="number" value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Duration (days)</label><input type="number" value={form.durationDays || ''} onChange={e => setForm(p => ({ ...p, durationDays: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Capacity</label><input type="number" value={form.capacity || ''} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Difficulty</label><select value={form.difficulty || ''} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}>{['EASY', 'MODERATE', 'HARD'].map(d => <option key={d}>{d}</option>)}</select></div>
                            </div>
                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>{saving ? 'Saving…' : modal.mode === 'create' ? 'Create Trip' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Booking create modal */}
            {modal?.type === 'booking' && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header"><h3>+ New Booking</h3><button className="fp-modal-close" onClick={() => setModal(null)}>✕</button></div>
                        <form onSubmit={saveBookingForm}>
                            <div className="fp-form-group"><label>User ID</label><input type="number" value={form.userId || ''} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} required /></div>
                            <div className="fp-form-group"><label>Trip</label>
                                <select value={form.tripId || ''} onChange={e => setForm(p => ({ ...p, tripId: e.target.value }))} required>
                                    <option value="">Select trip…</option>
                                    {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                            </div>
                            <div className="fp-form-group"><label>Number of People</label><input type="number" min="1" value={form.numberOfPeople} onChange={e => setForm(p => ({ ...p, numberOfPeople: e.target.value }))} /></div>
                            <div className="fp-form-group"><label>Special Requests</label><textarea value={form.specialRequests || ''} onChange={e => setForm(p => ({ ...p, specialRequests: e.target.value }))} rows="2" /></div>
                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Create Booking'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status update modal */}
            {statusTarget && (
                <div className="fp-modal-overlay" onClick={() => setStatusTarget(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header"><h3>Update Booking #{statusTarget.bookingId}</h3><button className="fp-modal-close" onClick={() => setStatusTarget(null)}>✕</button></div>
                        <div className="fp-form-group" style={{ padding: '1rem 0' }}>
                            <label>New Status</label>
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>{STATUS_OPTS.map(s => <option key={s}>{s}</option>)}</select>
                        </div>
                        <div className="fp-modal-footer">
                            <button className="fp-btn fp-btn-ghost" onClick={() => setStatusTarget(null)}>Cancel</button>
                            <button className="fp-btn fp-btn-primary" onClick={updateBookingStatus}>Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteTarget && (
                <div className="fp-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header"><h3>⚠️ Confirm</h3><button className="fp-modal-close" onClick={() => setDeleteTarget(null)}>✕</button></div>
                        <p className="fp-modal-text">Delete this {deleteTarget.type}?</p>
                        <div className="fp-modal-footer">
                            <button className="fp-btn fp-btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className="fp-btn fp-btn-danger" onClick={() => {
                                if (deleteTarget.type === 'trip') deleteTrip(deleteTarget.id);
                                else if (deleteTarget.type === 'booking') deleteBooking(deleteTarget.id);
                                else { api.del(`/bookings/categories/${deleteTarget.id}`).then(loadAll); setDeleteTarget(null); }
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripBookingPanel;
