import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const CATEGORIES = ['BEACH', 'CULTURAL', 'PARTY', 'HIKING', 'MEDITATION', 'WILDLIFE', 'ADVENTURE', 'HONEYMOON', 'FAMILY', 'LUXURY'];
const STATUS_OPTS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const TRIP_STATUS_OPTS = ['Draft', 'Published', 'Archived'];

const COMMON_INCLUSIONS = ['Accommodation', 'Meals', 'Flights', 'Guide', 'Visa', 'Insurance', 'Entry Tickets'];

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
                api.get('/bookings/trips').catch(() => []),
                api.get('/bookings').catch(() => []),
                api.get('/bookings/categories').catch(() => []),
            ]);
            setTrips(t || []);
            setBookings(b || []);
            setCategories(c || []);
        } catch (_) { }
        finally { setLoading(false); }
    };

    useEffect(() => { loadAll(); }, []);

    // Auto-calculate duration based on dates
    useEffect(() => {
        if (form.startDate && form.endDate && modal?.type === 'trip') {
            const start = new Date(form.startDate);
            const end = new Date(form.endDate);
            if (end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
                if (form.durationDays !== diffDays && diffDays > 0) {
                    setForm(p => ({ ...p, durationDays: diffDays }));
                }
            }
        }
    }, [form.startDate, form.endDate, modal]);

    /* ── Trips CRUD ── */
    const openCreateTrip = () => {
        setForm({
            title: '', description: '', longDescription: '', durationDays: '', price: '', totalSeats: '',
            category: 'BEACH', location: '', destination: '', difficulty: 'EASY',
            startDate: '', endDate: '', bookingDeadline: '',
            childPrice: '', currency: 'LKR', discountPercentage: '', depositAmount: '',
            includedItems: [], excludedItems: [],
            itinerary: [], coverImage: '', gallery: '',
            tags: '', tripStatus: 'Draft', cancellationPolicy: ''
        });
        setModal({ mode: 'create', type: 'trip' });
    };
    const openEditTrip = (t) => {
        setForm({
            ...t,
            includedItems: t.includedItems || [],
            excludedItems: t.excludedItems || [],
            itinerary: t.itinerary || [],
            gallery: Array.isArray(t.gallery) ? t.gallery.join(', ') : (t.gallery || ''),
            tags: Array.isArray(t.tags) ? t.tags.join(', ') : (t.tags || ''),
            totalSeats: t.totalSeats || t.capacity || '',
            tripStatus: t.tripStatus || 'Draft',
            destination: t.destination || t.location || ''
        });
        setModal({ mode: 'edit', type: 'trip', item: t });
    };
    const saveTripForm = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { ...form };
            if (typeof payload.tags === 'string') {
                payload.tags = payload.tags.split(',').map(s => s.trim()).filter(s => s);
            }
            if (typeof payload.gallery === 'string') {
                payload.gallery = payload.gallery.split(',').map(s => s.trim()).filter(s => s);
            }
            
            // Clean up empty strings to avoid Jackson parse errors on backend
            ['durationDays', 'totalSeats', 'childPrice', 'discountPercentage', 'depositAmount', 'startDate', 'endDate', 'bookingDeadline'].forEach(key => {
                if (payload[key] === '') payload[key] = null;
            });

            payload.capacity = payload.totalSeats; // for backward compatibility
            payload.location = payload.destination || payload.location; // sync location and destination

            if (modal.mode === 'create') await api.post('/bookings/trips', payload);
            else await api.put(`/bookings/trips/${modal.item.id}`, payload);
            await loadAll(); setModal(null);
        } catch (e) { alert('Error: ' + e.message); }
        finally { setSaving(false); }
    };
    const deleteTrip = async (id) => {
        try { await api.del(`/bookings/trips/${id}`); setTrips(prev => prev.filter(t => t.id !== id)); setDeleteTarget(null); }
        catch (e) { alert('Error: ' + e.message); }
    };

    /* ── Checkbox & Array Handlers ── */
    const toggleCheckItem = (field, item) => {
        const list = form[field] || [];
        if (list.includes(item)) setForm(p => ({ ...p, [field]: list.filter(i => i !== item) }));
        else setForm(p => ({ ...p, [field]: [...list, item] }));
    };
    const addItineraryDay = () => setForm(p => ({ ...p, itinerary: [...(p.itinerary || []), { title: '', location: '', description: '' }] }));
    const removeItineraryDay = (index) => setForm(p => ({ ...p, itinerary: (p.itinerary || []).filter((_, i) => i !== index) }));
    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...(form.itinerary || [])];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setForm(p => ({ ...p, itinerary: newItinerary }));
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
                                    <span style={{float: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: t.tripStatus === 'Published' ? '#059669' : '#64748b', textTransform: 'uppercase'}}>{t.tripStatus || 'DRAFT'}</span>
                                    <h3 className="fp-trip-title">{t.title}</h3>
                                    {t.coverImage && <img src={t.coverImage} alt="cover" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem'}} />}
                                    <p className="fp-trip-desc">{t.description}</p>
                                    <div className="fp-trip-meta">
                                        <span>📍 {t.destination || t.location}</span>
                                        <span>⏱ {t.durationDays} days</span>
                                        <span>👥 {t.totalSeats || t.capacity} pax</span>
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
                                <h4 className="fp-section-title">Basic Information</h4>
                                <div className="fp-form-group fp-span-2"><label>Trip Title</label><input value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
                                <div className="fp-form-group"><label>Destination</label><input value={form.destination || form.location || ''} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Category</label><select value={form.category || ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                                <div className="fp-form-group fp-span-2"><label>Short Description (Card format)</label><textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="2" /></div>
                                <div className="fp-form-group fp-span-2"><label>Long Description (Detail page)</label><textarea value={form.longDescription || ''} onChange={e => setForm(p => ({ ...p, longDescription: e.target.value }))} rows="4" /></div>

                                <h4 className="fp-section-title">Dates & Availability</h4>
                                <div className="fp-form-group"><label>Start Date</label><input type="date" value={form.startDate || ''} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>End Date</label><input type="date" value={form.endDate || ''} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Duration (Days)</label><input type="number" readOnly value={form.durationDays || ''} style={{backgroundColor: '#e2e8f0'}} title="Auto-calculated from Start/End dates" /></div>
                                <div className="fp-form-group"><label>Total Available Seats</label><input type="number" value={form.totalSeats || ''} onChange={e => setForm(p => ({ ...p, totalSeats: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Booking Deadline</label><input type="date" value={form.bookingDeadline || ''} onChange={e => setForm(p => ({ ...p, bookingDeadline: e.target.value }))} /></div>

                                <h4 className="fp-section-title">Pricing</h4>
                                <div className="fp-form-group"><label>Price Per Person</label><input type="number" value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required /></div>
                                <div className="fp-form-group"><label>Child Price (Optional)</label><input type="number" value={form.childPrice || ''} onChange={e => setForm(p => ({ ...p, childPrice: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Currency</label><select value={form.currency || 'LKR'} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}><option>LKR</option><option>USD</option><option>EUR</option><option>GBP</option></select></div>
                                <div className="fp-form-group"><label>Discount (%)</label><input type="number" max="100" min="0" value={form.discountPercentage || ''} onChange={e => setForm(p => ({ ...p, discountPercentage: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Deposit Amount</label><input type="number" value={form.depositAmount || ''} onChange={e => setForm(p => ({ ...p, depositAmount: e.target.value }))} /></div>

                                <h4 className="fp-section-title">What's Included</h4>
                                <div className="fp-checkbox-group">
                                    {COMMON_INCLUSIONS.map(item => (
                                        <label key={`inc-${item}`} className="fp-checkbox-label">
                                            <input type="checkbox" checked={(form.includedItems || []).includes(item)} onChange={() => toggleCheckItem('includedItems', item)} /> {item}
                                        </label>
                                    ))}
                                </div>
                                
                                <h4 className="fp-section-title">What's Excluded</h4>
                                <div className="fp-checkbox-group">
                                    {COMMON_INCLUSIONS.map(item => (
                                        <label key={`exc-${item}`} className="fp-checkbox-label">
                                            <input type="checkbox" checked={(form.excludedItems || []).includes(item)} onChange={() => toggleCheckItem('excludedItems', item)} /> {item}
                                        </label>
                                    ))}
                                </div>

                                <h4 className="fp-section-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    Day-by-Day Itinerary 
                                    <button type="button" className="fp-btn fp-btn-view" onClick={addItineraryDay} style={{padding: '0.3rem 0.6rem', fontSize: '0.8rem'}}>+ Add Day</button>
                                </h4>
                                <div className="fp-span-2">
                                    {(form.itinerary || []).map((day, idx) => (
                                        <div key={idx} className="fp-itinerary-day" style={{padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem', position: 'relative'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center'}}>
                                                <h5 style={{margin: 0, color: '#0d9488', fontSize: '0.95rem'}}>Day {idx + 1}</h5>
                                                <button type="button" className="fp-btn-remove" onClick={() => removeItineraryDay(idx)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'}}>✖ Remove</button>
                                            </div>
                                            <div className="fp-form-grid" style={{gap: '0.75rem'}}>
                                                <div className="fp-form-group"><label>Title / Activity</label><input value={day.title || ''} onChange={e => handleItineraryChange(idx, 'title', e.target.value)} /></div>
                                                <div className="fp-form-group"><label>Location</label><input value={day.location || ''} onChange={e => handleItineraryChange(idx, 'location', e.target.value)} /></div>
                                                <div className="fp-form-group fp-span-2"><label>Description</label><textarea value={day.description || ''} onChange={e => handleItineraryChange(idx, 'description', e.target.value)} rows="2"></textarea></div>
                                            </div>
                                        </div>
                                    ))}
                                    {!(form.itinerary?.length) && <p style={{color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.5rem'}}>No itinerary days added yet. Click "+ Add Day" to start.</p>}
                                </div>

                                <h4 className="fp-section-title">Media & Tags</h4>
                                <div className="fp-form-group fp-span-2"><label>Cover Image URL *</label><input type="url" value={form.coverImage || ''} onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))} required placeholder="https://" /></div>
                                <div className="fp-form-group fp-span-2"><label>Gallery Image URLs (comma-separated, max 10)</label><textarea value={form.gallery || ''} onChange={e => setForm(p => ({ ...p, gallery: e.target.value }))} rows="2" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg..." /></div>
                                <div className="fp-form-group"><label>Tags (comma-separated)</label><input value={form.tags || ''} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Beach, Family, Luxury" /></div>
                                <div className="fp-form-group"><label>Status</label><select value={form.tripStatus || 'Draft'} onChange={e => setForm(p => ({ ...p, tripStatus: e.target.value }))}>{TRIP_STATUS_OPTS.map(s => <option key={s}>{s}</option>)}</select></div>

                                <h4 className="fp-section-title">Policies</h4>
                                <div className="fp-form-group fp-span-2"><label>Cancellation Policy (Refund rules)</label><textarea value={form.cancellationPolicy || ''} onChange={e => setForm(p => ({ ...p, cancellationPolicy: e.target.value }))} rows="3" /></div>
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
