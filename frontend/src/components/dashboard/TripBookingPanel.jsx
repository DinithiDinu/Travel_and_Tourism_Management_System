import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const CATEGORIES = ['BEACH', 'CULTURAL', 'PARTY', 'HIKING', 'MEDITATION', 'WILDLIFE', 'ADVENTURE', 'HONEYMOON', 'FAMILY', 'LUXURY'];
const STATUS_OPTS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const TRIP_STATUS_OPTS = ['Draft', 'Published', 'Archived'];
const COMMON_INCLUSIONS = ['Accommodation', 'Meals', 'Flights', 'Guide', 'Visa', 'Insurance', 'Entry Tickets'];

/* ─────────────────────────────────────────
   Validation helpers
───────────────────────────────────────── */
const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
};

const validateTripForm = (form) => {
    const errors = {};

    // ── Basic Info ──────────────────────────────────────
    const title = (form.title || '').trim();
    if (!title) errors.title = 'Trip title is required.';
    else if (title.length < 5) errors.title = 'Title must be at least 5 characters.';
    else if (title.length > 100) errors.title = 'Title must be 100 characters or less.';

    const dest = (form.destination || form.location || '').trim();
    if (!dest) errors.destination = 'Destination is required.';
    else if (!/^[a-zA-Z\s,.-]+$/.test(dest)) errors.destination = 'Destination must contain only letters, spaces, commas, dots, or hyphens.';

    if (!form.category || !CATEGORIES.includes(form.category))
        errors.category = 'Please select a valid category.';

    const shortDesc = (form.description || '').trim();
    if (!shortDesc) errors.description = 'Short description is required.';
    else if (shortDesc.length < 20) errors.description = `Short description must be at least 20 characters. (${shortDesc.length}/20)`;
    else if (shortDesc.length > 200) errors.description = `Short description must be 200 characters or less. (${shortDesc.length}/200)`;

    const longDesc = (form.longDescription || '').trim();
    if (longDesc && longDesc.length < 50)
        errors.longDescription = `Full description must be at least 50 characters if provided. (${longDesc.length}/50)`;

    // ── Dates & Availability ────────────────────────────
    const today = new Date(); today.setHours(0, 0, 0, 0);

    if (!form.startDate) {
        errors.startDate = 'Start date is required.';
    } else if (new Date(form.startDate) < today) {
        errors.startDate = 'Start date cannot be in the past.';
    }

    if (!form.endDate) {
        errors.endDate = 'End date is required.';
    } else if (form.startDate && new Date(form.endDate) < new Date(form.startDate)) {
        errors.endDate = 'End date must be after the start date.';
    }

    if (form.bookingDeadline) {
        if (form.startDate && new Date(form.bookingDeadline) >= new Date(form.startDate))
            errors.bookingDeadline = 'Booking deadline must be before the start date.';
        if (new Date(form.bookingDeadline) < today)
            errors.bookingDeadline = 'Booking deadline cannot be in the past.';
    }

    const seats = Number(form.totalSeats);
    if (!form.totalSeats) errors.totalSeats = 'Total seats is required.';
    else if (!Number.isInteger(seats) || seats < 1) errors.totalSeats = 'Total seats must be a whole number of at least 1.';
    else if (seats > 500) errors.totalSeats = 'Total seats cannot exceed 500.';

    // ── Pricing ─────────────────────────────────────────
    const price = Number(form.price);
    if (!form.price) errors.price = 'Price per person is required.';
    else if (isNaN(price) || price <= 0) errors.price = 'Price must be a number greater than 0.';

    if (form.childPrice) {
        const cp = Number(form.childPrice);
        if (isNaN(cp) || cp < 0) errors.childPrice = 'Child price must be a valid positive number.';
        else if (cp > price) errors.childPrice = 'Child price should not exceed the adult price.';
    }

    if (form.discountPercentage) {
        const disc = Number(form.discountPercentage);
        if (isNaN(disc) || disc < 1 || disc > 99)
            errors.discountPercentage = 'Discount must be between 1 and 99%.';
        else if (price > 0 && price * (1 - disc / 100) <= 0)
            errors.discountPercentage = 'Discount cannot make the final price zero or negative.';
    }

    if (form.depositAmount) {
        const dep = Number(form.depositAmount);
        if (isNaN(dep) || dep < 0) errors.depositAmount = 'Deposit amount must be a valid positive number.';
        else if (price > 0 && dep > price) errors.depositAmount = 'Deposit cannot exceed the price per person.';
    }

    // ── Inclusions ──────────────────────────────────────
    if (!form.includedItems || form.includedItems.length === 0)
        errors.includedItems = 'Select at least one included item.';

    // ── Itinerary ───────────────────────────────────────
    if (!form.itinerary || form.itinerary.length === 0) {
        errors.itinerary = 'Add at least one itinerary day.';
    } else {
        const dayErrors = [];
        form.itinerary.forEach((day, i) => {
            const de = {};
            if (!(day.title || '').trim()) de.title = 'Title is required.';
            else if (day.title.length > 80) de.title = 'Title must be 80 characters or less.';
            if (!(day.location || '').trim()) de.location = 'Location is required.';
            const desc = (day.description || '').trim();
            if (!desc) de.description = 'Description is required.';
            else if (desc.length < 20) de.description = `At least 20 characters required. (${desc.length}/20)`;
            dayErrors[i] = de;
        });
        if (dayErrors.some(de => Object.keys(de).length > 0)) errors.itineraryDays = dayErrors;
    }

    // ── Media ────────────────────────────────────────────
    const coverImg = (form.coverImage || '').trim();
    if (!coverImg) errors.coverImage = 'Cover image URL is required.';
    else if (!isValidUrl(coverImg)) errors.coverImage = 'Cover image must be a valid URL (starting with https://).';

    if (form.gallery) {
        const urls = form.gallery.split(',').map(s => s.trim()).filter(Boolean);
        if (urls.length > 10) errors.gallery = 'Maximum 10 gallery images allowed.';
        else {
            const invalid = urls.filter(u => !isValidUrl(u));
            if (invalid.length > 0) errors.gallery = `${invalid.length} invalid URL(s) found in gallery.`;
        }
    }

    // ── Tags ─────────────────────────────────────────────
    if (form.tags) {
        const tagList = (typeof form.tags === 'string'
            ? form.tags.split(',').map(s => s.trim()).filter(Boolean)
            : form.tags);
        if (tagList.length > 10) errors.tags = 'Maximum 10 tags allowed.';
        else {
            const longTag = tagList.find(t => t.length > 20);
            if (longTag) errors.tags = `Tag "${longTag}" exceeds 20 characters.`;
        }
    }

    // ── Status & Policies ────────────────────────────────
    if (!form.tripStatus) errors.tripStatus = 'Please select a status.';

    return errors;
};

/* ─────────────────────────────────────────
   Inline error component
───────────────────────────────────────── */
const FieldError = ({ msg }) =>
    msg ? <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '3px', display: 'block' }}>⚠ {msg}</span> : null;

const inputStyle = (err) => ({
    borderColor: err ? '#ef4444' : undefined,
    boxShadow: err ? '0 0 0 2px rgba(239,68,68,0.15)' : undefined,
});

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
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

    // Field-level errors object
    const [errors, setErrors] = useState({});
    // Whether user has attempted submit (to show all errors at once)
    const [submitted, setSubmitted] = useState(false);

    // Booking form errors
    const [bookingErrors, setBookingErrors] = useState({});

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

    // Auto-calculate duration
    useEffect(() => {
        if (form.startDate && form.endDate && modal?.type === 'trip') {
            const start = new Date(form.startDate);
            const end = new Date(form.endDate);
            if (end >= start) {
                const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
                if (form.durationDays !== diffDays && diffDays > 0)
                    setForm(p => ({ ...p, durationDays: diffDays }));
            }
        }
    }, [form.startDate, form.endDate, modal]);

    // Live validation: re-validate changed fields after first submit attempt
    useEffect(() => {
        if (submitted && modal?.type === 'trip') {
            setErrors(validateTripForm(form));
        }
    }, [form, submitted, modal]);

    /* ── Helpers ── */
    const setField = (key, value) => setForm(p => ({ ...p, [key]: value }));

    const hasErrors = (errs) => {
        const { itineraryDays, ...rest } = errs;
        if (Object.keys(rest).length > 0) return true;
        if (itineraryDays && itineraryDays.some(d => d && Object.keys(d).length > 0)) return true;
        return false;
    };

    /* ── Trips CRUD ── */
    const openCreateTrip = () => {
        setErrors({});
        setSubmitted(false);
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
        setErrors({});
        setSubmitted(false);
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
        e.preventDefault();
        setSubmitted(true);
        const validationErrors = validateTripForm(form);
        setErrors(validationErrors);

        if (hasErrors(validationErrors)) {
            // Scroll to first error
            setTimeout(() => {
                const el = document.querySelector('.fp-field-error');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            return;
        }

        setSaving(true);
        try {
            const payload = { ...form };
            if (typeof payload.tags === 'string')
                payload.tags = payload.tags.split(',').map(s => s.trim()).filter(Boolean);
            if (typeof payload.gallery === 'string')
                payload.gallery = payload.gallery.split(',').map(s => s.trim()).filter(Boolean);

            ['durationDays', 'totalSeats', 'childPrice', 'discountPercentage', 'depositAmount', 'startDate', 'endDate', 'bookingDeadline'].forEach(key => {
                if (payload[key] === '') payload[key] = null;
            });
            payload.capacity = payload.totalSeats;
            payload.location = payload.destination || payload.location;

            if (modal.mode === 'create') await api.post('/bookings/trips', payload);
            else await api.put(`/bookings/trips/${modal.item.id}`, payload);
            await loadAll();
            setModal(null);
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
        setField(field, list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
    };
    const addItineraryDay = () => setField('itinerary', [...(form.itinerary || []), { title: '', location: '', description: '' }]);
    const removeItineraryDay = (index) => setField('itinerary', (form.itinerary || []).filter((_, i) => i !== index));
    const handleItineraryChange = (index, field, value) => {
        const updated = [...(form.itinerary || [])];
        updated[index] = { ...updated[index], [field]: value };
        setField('itinerary', updated);
    };

    /* ── Bookings CRUD ── */
    const validateBookingForm = (f) => {
        const errs = {};
        if (!f.userId) errs.userId = 'User ID is required.';
        else if (isNaN(Number(f.userId)) || Number(f.userId) <= 0) errs.userId = 'User ID must be a positive number.';
        if (!f.tripId) errs.tripId = 'Please select a trip.';
        if (!f.numberOfPeople || Number(f.numberOfPeople) < 1) errs.numberOfPeople = 'Number of people must be at least 1.';
        else if (Number(f.numberOfPeople) > 50) errs.numberOfPeople = 'Cannot book more than 50 people at once.';
        return errs;
    };

    const openCreateBooking = () => {
        setBookingErrors({});
        setForm({ userId: '', tripId: '', numberOfPeople: 1, specialRequests: '' });
        setModal({ mode: 'create', type: 'booking' });
    };

    const saveBookingForm = async (e) => {
        e.preventDefault();
        const errs = validateBookingForm(form);
        setBookingErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSaving(true);
        try {
            await api.post('/bookings', form);
            await loadAll();
            setModal(null);
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

    /* ── Error summary count ── */
    const errorCount = hasErrors(errors) ? (() => {
        const { itineraryDays, ...rest } = errors;
        let count = Object.keys(rest).length;
        if (itineraryDays) count += itineraryDays.reduce((acc, d) => acc + (d ? Object.keys(d).length : 0), 0);
        return count;
    })() : 0;

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
                                    <span style={{ float: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: t.tripStatus === 'Published' ? '#059669' : '#64748b', textTransform: 'uppercase' }}>{t.tripStatus || 'DRAFT'}</span>
                                    <h3 className="fp-trip-title">{t.title}</h3>
                                    {t.coverImage && <img src={t.coverImage} alt="cover" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }} />}
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

            {/* ══════════════════════════════════════
                TRIP MODAL
            ══════════════════════════════════════ */}
            {modal?.type === 'trip' && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal fp-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>{modal.mode === 'create' ? '+ New Trip' : 'Edit Trip'}</h3>
                            <button className="fp-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>

                        <form onSubmit={saveTripForm} noValidate>

                            {/* ── Error summary banner ── */}
                            {submitted && errorCount > 0 && (
                                <div style={{ padding: '0.75rem 1rem', margin: '0 1.25rem 1rem', backgroundColor: '#fff1f2', color: '#be123c', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                                    <span><strong>{errorCount} error{errorCount > 1 ? 's' : ''}</strong> found. Please fix the highlighted fields below before saving.</span>
                                </div>
                            )}

                            <div className="fp-form-grid">

                                {/* ── Basic Information ── */}
                                <h4 className="fp-section-title">Basic Information</h4>

                                <div className="fp-form-group fp-span-2">
                                    <label>Trip Title <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        value={form.title || ''}
                                        onChange={e => setField('title', e.target.value)}
                                        style={inputStyle(errors.title)}
                                        placeholder="e.g. Romantic Bali Getaway – 7 Days"
                                        maxLength={100}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {errors.title ? <span className="fp-field-error" style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '3px', display: 'block' }}>⚠ {errors.title}</span> : <span />}
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{(form.title || '').length}/100</span>
                                    </div>
                                </div>

                                <div className="fp-form-group">
                                    <label>Destination <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        value={form.destination || form.location || ''}
                                        onChange={e => setField('destination', e.target.value)}
                                        style={inputStyle(errors.destination)}
                                        placeholder="City, Country"
                                    />
                                    <FieldError msg={errors.destination} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Category <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select
                                        value={form.category || ''}
                                        onChange={e => setField('category', e.target.value)}
                                        style={inputStyle(errors.category)}
                                    >
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    <FieldError msg={errors.category} />
                                </div>

                                <div className="fp-form-group fp-span-2">
                                    <label>Short Description <span style={{ color: '#ef4444' }}>*</span> <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(20–200 chars, shown on card)</span></label>
                                    <textarea
                                        value={form.description || ''}
                                        onChange={e => setField('description', e.target.value)}
                                        rows="2"
                                        style={inputStyle(errors.description)}
                                        maxLength={200}
                                        placeholder="A catchy summary shown on the trip listing card…"
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {errors.description ? <span className="fp-field-error" style={{ fontSize: '0.78rem', color: '#dc2626', display: 'block' }}>⚠ {errors.description}</span> : <span />}
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{(form.description || '').length}/200</span>
                                    </div>
                                </div>

                                <div className="fp-form-group fp-span-2">
                                    <label>Full Description <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(optional, min 50 chars)</span></label>
                                    <textarea
                                        value={form.longDescription || ''}
                                        onChange={e => setField('longDescription', e.target.value)}
                                        rows="4"
                                        style={inputStyle(errors.longDescription)}
                                        placeholder="Detailed overview for the trip detail page…"
                                    />
                                    <FieldError msg={errors.longDescription} />
                                </div>

                                {/* ── Dates & Availability ── */}
                                <h4 className="fp-section-title">Dates & Availability</h4>

                                <div className="fp-form-group">
                                    <label>Start Date <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="date"
                                        value={form.startDate || ''}
                                        onChange={e => setField('startDate', e.target.value)}
                                        style={inputStyle(errors.startDate)}
                                    />
                                    <FieldError msg={errors.startDate} />
                                </div>

                                <div className="fp-form-group">
                                    <label>End Date <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="date"
                                        value={form.endDate || ''}
                                        onChange={e => setField('endDate', e.target.value)}
                                        style={inputStyle(errors.endDate)}
                                    />
                                    <FieldError msg={errors.endDate} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Duration (Days)</label>
                                    <input
                                        type="number"
                                        readOnly
                                        value={form.durationDays || ''}
                                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                                        title="Auto-calculated from Start/End dates"
                                        placeholder="Auto-calculated"
                                    />
                                    {form.startDate && form.endDate && !form.durationDays && (
                                        <span style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '3px', display: 'block' }}>⚠ End date must be after start date.</span>
                                    )}
                                </div>

                                <div className="fp-form-group">
                                    <label>Total Available Seats <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="number"
                                        value={form.totalSeats || ''}
                                        onChange={e => setField('totalSeats', e.target.value)}
                                        style={inputStyle(errors.totalSeats)}
                                        min={1} max={500}
                                        placeholder="e.g. 20"
                                    />
                                    <FieldError msg={errors.totalSeats} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Booking Deadline <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(must be before start date)</span></label>
                                    <input
                                        type="date"
                                        value={form.bookingDeadline || ''}
                                        onChange={e => setField('bookingDeadline', e.target.value)}
                                        style={inputStyle(errors.bookingDeadline)}
                                    />
                                    <FieldError msg={errors.bookingDeadline} />
                                </div>

                                {/* ── Pricing ── */}
                                <h4 className="fp-section-title">Pricing</h4>

                                <div className="fp-form-group">
                                    <label>Price Per Person <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="number"
                                        value={form.price || ''}
                                        onChange={e => setField('price', e.target.value)}
                                        style={inputStyle(errors.price)}
                                        min={0} placeholder="0.00"
                                    />
                                    <FieldError msg={errors.price} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Child Price <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(optional, ≤ adult price)</span></label>
                                    <input
                                        type="number"
                                        value={form.childPrice || ''}
                                        onChange={e => setField('childPrice', e.target.value)}
                                        style={inputStyle(errors.childPrice)}
                                        min={0} placeholder="0.00"
                                    />
                                    <FieldError msg={errors.childPrice} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Currency</label>
                                    <select value={form.currency || 'LKR'} onChange={e => setField('currency', e.target.value)}>
                                        <option>LKR</option><option>USD</option><option>EUR</option><option>GBP</option>
                                    </select>
                                </div>

                                <div className="fp-form-group">
                                    <label>Discount % <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(1–99)</span></label>
                                    <input
                                        type="number"
                                        min={0} max={99}
                                        value={form.discountPercentage || ''}
                                        onChange={e => setField('discountPercentage', e.target.value)}
                                        style={inputStyle(errors.discountPercentage)}
                                        placeholder="e.g. 10"
                                    />
                                    <FieldError msg={errors.discountPercentage} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Deposit Amount <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(optional, &lt; price)</span></label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.depositAmount || ''}
                                        onChange={e => setField('depositAmount', e.target.value)}
                                        style={inputStyle(errors.depositAmount)}
                                        placeholder="0.00"
                                    />
                                    <FieldError msg={errors.depositAmount} />
                                </div>

                                {/* ── Inclusions ── */}
                                <h4 className="fp-section-title">
                                    What's Included <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(select at least one)</span>
                                </h4>
                                <div className="fp-checkbox-group" style={{ border: errors.includedItems ? '1px solid #ef4444' : undefined, borderRadius: errors.includedItems ? '6px' : undefined, padding: errors.includedItems ? '8px' : undefined }}>
                                    {COMMON_INCLUSIONS.map(item => (
                                        <label key={`inc-${item}`} className="fp-checkbox-label">
                                            <input type="checkbox" checked={(form.includedItems || []).includes(item)} onChange={() => toggleCheckItem('includedItems', item)} /> {item}
                                        </label>
                                    ))}
                                </div>
                                <FieldError msg={errors.includedItems} />

                                <h4 className="fp-section-title">What's Excluded</h4>
                                <div className="fp-checkbox-group">
                                    {COMMON_INCLUSIONS.map(item => (
                                        <label key={`exc-${item}`} className="fp-checkbox-label">
                                            <input type="checkbox" checked={(form.excludedItems || []).includes(item)} onChange={() => toggleCheckItem('excludedItems', item)} /> {item}
                                        </label>
                                    ))}
                                </div>

                                {/* ── Itinerary ── */}
                                <h4 className="fp-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>
                                        Day-by-Day Itinerary <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(at least 1 day required)</span>
                                    </span>
                                    <button type="button" className="fp-btn fp-btn-view" onClick={addItineraryDay} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>+ Add Day</button>
                                </h4>

                                {errors.itinerary && (
                                    <div className="fp-span-2">
                                        <span className="fp-field-error" style={{ fontSize: '0.78rem', color: '#dc2626', display: 'block', marginBottom: '8px' }}>⚠ {errors.itinerary}</span>
                                    </div>
                                )}

                                <div className="fp-span-2">
                                    {(form.itinerary || []).map((day, idx) => {
                                        const dayErr = (errors.itineraryDays || [])[idx] || {};
                                        const dayHasError = Object.keys(dayErr).length > 0;
                                        return (
                                            <div key={idx} style={{
                                                padding: '1.25rem',
                                                background: '#f8fafc',
                                                border: `1px solid ${dayHasError ? '#ef4444' : '#e2e8f0'}`,
                                                borderRadius: '8px',
                                                marginBottom: '1rem',
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                                                    <h5 style={{ margin: 0, color: '#0d9488', fontSize: '0.95rem' }}>
                                                        Day {idx + 1}
                                                        {dayHasError && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 400 }}>— fix errors below</span>}
                                                    </h5>
                                                    <button type="button" onClick={() => removeItineraryDay(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>✖ Remove</button>
                                                </div>
                                                <div className="fp-form-grid" style={{ gap: '0.75rem' }}>
                                                    <div className="fp-form-group">
                                                        <label>Title / Activity <span style={{ color: '#ef4444' }}>*</span></label>
                                                        <input
                                                            value={day.title || ''}
                                                            onChange={e => handleItineraryChange(idx, 'title', e.target.value)}
                                                            style={inputStyle(dayErr.title)}
                                                            maxLength={80}
                                                            placeholder="e.g. Arrival & check-in"
                                                        />
                                                        <FieldError msg={dayErr.title} />
                                                    </div>
                                                    <div className="fp-form-group">
                                                        <label>Location <span style={{ color: '#ef4444' }}>*</span></label>
                                                        <input
                                                            value={day.location || ''}
                                                            onChange={e => handleItineraryChange(idx, 'location', e.target.value)}
                                                            style={inputStyle(dayErr.location)}
                                                            placeholder="e.g. Ngurah Rai Airport"
                                                        />
                                                        <FieldError msg={dayErr.location} />
                                                    </div>
                                                    <div className="fp-form-group fp-span-2">
                                                        <label>Description <span style={{ color: '#ef4444' }}>*</span> <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(min 20 chars)</span></label>
                                                        <textarea
                                                            value={day.description || ''}
                                                            onChange={e => handleItineraryChange(idx, 'description', e.target.value)}
                                                            rows="2"
                                                            style={inputStyle(dayErr.description)}
                                                            placeholder="What happens on this day…"
                                                        />
                                                        <FieldError msg={dayErr.description} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {!(form.itinerary?.length) && (
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                                            No itinerary days added yet. Click "+ Add Day" to start.
                                        </p>
                                    )}
                                </div>

                                {/* ── Media ── */}
                                <h4 className="fp-section-title">Media & Tags</h4>

                                <div className="fp-form-group fp-span-2">
                                    <label>Cover Image URL <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="url"
                                        value={form.coverImage || ''}
                                        onChange={e => setField('coverImage', e.target.value)}
                                        style={inputStyle(errors.coverImage)}
                                        placeholder="https://example.com/cover.jpg"
                                    />
                                    <FieldError msg={errors.coverImage} />
                                    {form.coverImage && isValidUrl(form.coverImage) && (
                                        <img src={form.coverImage} alt="cover preview" onError={e => e.target.style.display = 'none'} style={{ marginTop: '6px', width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                    )}
                                </div>

                                <div className="fp-form-group fp-span-2">
                                    <label>Gallery Image URLs <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(comma-separated, max 10)</span></label>
                                    <textarea
                                        value={form.gallery || ''}
                                        onChange={e => setField('gallery', e.target.value)}
                                        rows="2"
                                        style={inputStyle(errors.gallery)}
                                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg…"
                                    />
                                    <FieldError msg={errors.gallery} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Tags <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(comma-separated, max 10, each ≤ 20 chars)</span></label>
                                    <input
                                        value={form.tags || ''}
                                        onChange={e => setField('tags', e.target.value)}
                                        style={inputStyle(errors.tags)}
                                        placeholder="Beach, Family, Luxury"
                                    />
                                    <FieldError msg={errors.tags} />
                                </div>

                                <div className="fp-form-group">
                                    <label>Status <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select
                                        value={form.tripStatus || 'Draft'}
                                        onChange={e => setField('tripStatus', e.target.value)}
                                        style={inputStyle(errors.tripStatus)}
                                    >
                                        {TRIP_STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <FieldError msg={errors.tripStatus} />
                                </div>

                                {/* ── Policies ── */}
                                <h4 className="fp-section-title">Policies</h4>

                                <div className="fp-form-group fp-span-2">
                                    <label>
                                        Cancellation Policy
                                        {!form.cancellationPolicy && (
                                            <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 400 }}>⚠ Recommended — helps build user trust</span>
                                        )}
                                    </label>
                                    <textarea
                                        value={form.cancellationPolicy || ''}
                                        onChange={e => setField('cancellationPolicy', e.target.value)}
                                        rows="3"
                                        placeholder="e.g. Free cancellation up to 7 days before departure. 50% refund within 3–7 days…"
                                    />
                                </div>

                            </div>

                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>
                                    {saving ? 'Saving…' : modal.mode === 'create' ? 'Create Trip' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════
                BOOKING CREATE MODAL
            ══════════════════════════════════════ */}
            {modal?.type === 'booking' && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>+ New Booking</h3>
                            <button className="fp-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <form onSubmit={saveBookingForm} noValidate>
                            <div className="fp-form-group">
                                <label>User ID <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    type="number"
                                    value={form.userId || ''}
                                    onChange={e => setField('userId', e.target.value)}
                                    style={inputStyle(bookingErrors.userId)}
                                    placeholder="Enter user ID"
                                />
                                <FieldError msg={bookingErrors.userId} />
                            </div>

                            <div className="fp-form-group">
                                <label>Trip <span style={{ color: '#ef4444' }}>*</span></label>
                                <select
                                    value={form.tripId || ''}
                                    onChange={e => setField('tripId', e.target.value)}
                                    style={inputStyle(bookingErrors.tripId)}
                                >
                                    <option value="">Select trip…</option>
                                    {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                                <FieldError msg={bookingErrors.tripId} />
                            </div>

                            <div className="fp-form-group">
                                <label>Number of People <span style={{ color: '#ef4444' }}>*</span> <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(max 50)</span></label>
                                <input
                                    type="number"
                                    min="1" max="50"
                                    value={form.numberOfPeople}
                                    onChange={e => setField('numberOfPeople', e.target.value)}
                                    style={inputStyle(bookingErrors.numberOfPeople)}
                                />
                                <FieldError msg={bookingErrors.numberOfPeople} />
                            </div>

                            <div className="fp-form-group">
                                <label>Special Requests <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(optional)</span></label>
                                <textarea
                                    value={form.specialRequests || ''}
                                    onChange={e => setField('specialRequests', e.target.value)}
                                    rows="2"
                                    placeholder="Any dietary requirements, accessibility needs, etc."
                                />
                            </div>

                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>
                                    {saving ? 'Saving…' : 'Create Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Status update modal ── */}
            {statusTarget && (
                <div className="fp-modal-overlay" onClick={() => setStatusTarget(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>Update Booking #{statusTarget.bookingId}</h3>
                            <button className="fp-modal-close" onClick={() => setStatusTarget(null)}>✕</button>
                        </div>
                        <div className="fp-form-group" style={{ padding: '1rem 0' }}>
                            <label>New Status</label>
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="fp-modal-footer">
                            <button className="fp-btn fp-btn-ghost" onClick={() => setStatusTarget(null)}>Cancel</button>
                            <button className="fp-btn fp-btn-primary" onClick={updateBookingStatus}>Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete confirm ── */}
            {deleteTarget && (
                <div className="fp-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>⚠️ Confirm</h3>
                            <button className="fp-modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
                        </div>
                        <p className="fp-modal-text">Delete this {deleteTarget.type}? This action cannot be undone.</p>
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
