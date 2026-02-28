import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const TABS = [
    { id: 'requests', label: '📥 Service Requests' },
    { id: 'rides', label: '🚗 Rides' },
    { id: 'riders', label: '🧑‍✈️ Riders' },
    { id: 'vehicles', label: '🚐 Vehicles' },
    { id: 'providers', label: '🏢 Providers' },
];

const blankForms = {
    requests: { userId: '', serviceType: 'RIDE', pickupLocation: '', dropoffLocation: '', requestedDateTime: '', numberOfPeople: 1, notes: '' },
    rides: { riderId: '', requestId: '', startTime: '', estimatedDuration: '' },
    riders: { name: '', licenseNumber: '', phone: '', vehicleType: '', yearsExperience: '', status: 'AVAILABLE' },
    vehicles: { riderId: '', vehicleNumber: '', vehicleType: 'CAR', model: '', year: '', capacity: 4, status: 'AVAILABLE' },
    providers: { name: '', serviceType: '', contactEmail: '', phone: '', address: '', status: 'ACTIVE' },
};

const idKeys = {
    requests: 'requestId', rides: 'rideId', riders: 'riderId', vehicles: 'vehicleId', providers: 'serviceProviderId',
};

const RidesServicesPanel = () => {
    const [tab, setTab] = useState('requests');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const urls = {
        requests: { list: '/rides/requests', create: '/rides/requests', update: id => `/rides/requests/${id}`, del: id => `/rides/requests/${id}` },
        rides: { list: '/rides', create: '/rides/start', del: id => `/rides/${id}`, complete: id => `/rides/${id}/complete` },
        riders: { list: '/rides/riders', create: '/rides/riders', update: id => `/rides/riders/${id}`, del: id => `/rides/riders/${id}` },
        vehicles: { list: '/rides/vehicles', create: '/rides/vehicles', update: id => `/rides/vehicles/${id}`, del: id => `/rides/vehicles/${id}` },
        providers: { list: '/rides/providers', create: '/rides/providers', update: id => `/rides/providers/${id}`, del: id => `/rides/providers/${id}` },
    };

    const load = async (t = tab) => {
        setLoading(true);
        try {
            const result = await api.get(urls[t].list);
            setData(prev => ({ ...prev, [t]: result || [] }));
        } catch (_) { setData(prev => ({ ...prev, [t]: [] })); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (!data[tab]) load(tab); }, [tab]);

    const items = data[tab] || [];
    const cfg = urls[tab];
    const idKey = idKeys[tab];

    const openCreate = () => { setForm({ ...blankForms[tab] }); setModal({ mode: 'create' }); };
    const openEdit = (item) => { setForm({ ...item }); setModal({ mode: 'edit', item }); };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (modal.mode === 'create') await api.post(cfg.create, form);
            else await api.put(cfg.update(modal.item[idKey]), form);
            await load(tab); setModal(null);
        } catch (e) { alert('Error: ' + e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try { await api.del(cfg.del(deleteTarget[idKey])); setData(prev => ({ ...prev, [tab]: prev[tab]?.filter(i => i[idKey] !== deleteTarget[idKey]) })); setDeleteTarget(null); }
        catch (e) { alert('Error: ' + e.message); }
    };

    const completeRide = async (id) => {
        try { await api.patch(`/rides/${id}/complete`, {}); await load('rides'); }
        catch (e) { alert('Error: ' + e.message); }
    };

    const formField = (field, label, type = 'text', opts = null) => (
        <div className="fp-form-group" key={field}>
            <label>{label}</label>
            {opts ? (
                <select value={form[field] ?? ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                </select>
            ) : type === 'textarea' ? (
                <textarea value={form[field] ?? ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} rows="2" />
            ) : (
                <input type={type} value={form[field] ?? ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
            )}
        </div>
    );

    const formFields = () => {
        if (tab === 'requests') return [formField('userId', 'User ID', 'number'), formField('serviceType', 'Service Type', 'text', ['RIDE', 'TOUR_GUIDE', 'HOTEL']), formField('pickupLocation', 'Pickup Location'), formField('dropoffLocation', 'Dropoff Location'), formField('requestedDateTime', 'Date & Time', 'datetime-local'), formField('numberOfPeople', 'People', 'number'), formField('notes', 'Notes', 'textarea')];
        if (tab === 'rides') return [formField('riderId', 'Rider ID', 'number'), formField('requestId', 'Request ID', 'number')];
        if (tab === 'riders') return [formField('name', 'Name'), formField('licenseNumber', 'License #'), formField('phone', 'Phone'), formField('vehicleType', 'Vehicle Type'), formField('yearsExperience', 'Experience (yrs)', 'number'), formField('status', 'Status', 'text', ['AVAILABLE', 'ON_RIDE', 'OFFLINE'])];
        if (tab === 'vehicles') return [formField('riderId', 'Rider ID', 'number'), formField('vehicleNumber', 'Vehicle No.'), formField('vehicleType', 'Type', 'text', ['CAR', 'VAN', 'BIKE', 'BUS']), formField('model', 'Model'), formField('year', 'Year', 'number'), formField('capacity', 'Capacity', 'number'), formField('status', 'Status', 'text', ['AVAILABLE', 'IN_USE', 'MAINTENANCE'])];
        if (tab === 'providers') return [formField('name', 'Provider Name'), formField('serviceType', 'Service Type'), formField('contactEmail', 'Email', 'email'), formField('phone', 'Phone'), formField('address', 'Address'), formField('status', 'Status', 'text', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])];
    };

    const renderRow = (item) => {
        const id = item[idKey];
        return (
            <tr key={id}>
                <td><span className="fp-id">#{id}</span></td>
                {tab === 'requests' && <><td>{item.serviceType}</td><td>{item.pickupLocation}</td><td>{item.dropoffLocation}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td><td>{item.requestedDateTime ? new Date(item.requestedDateTime).toLocaleString() : '—'}</td></>}
                {tab === 'rides' && <><td>Rider #{item.riderId}</td><td>Req #{item.requestId}</td><td>{item.startTime ? new Date(item.startTime).toLocaleString() : '—'}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                {tab === 'riders' && <><td><strong>{item.name}</strong></td><td>{item.licenseNumber}</td><td>{item.phone}</td><td>{item.vehicleType}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                {tab === 'vehicles' && <><td>{item.vehicleNumber}</td><td>{item.vehicleType}</td><td>{item.model} ({item.year})</td><td>{item.capacity} seats</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                {tab === 'providers' && <><td><strong>{item.name}</strong></td><td>{item.serviceType}</td><td>{item.contactEmail}</td><td>{item.phone}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                <td>
                    <div className="fp-actions">
                        {tab === 'rides' && item.status === 'IN_PROGRESS' && (
                            <button className="fp-btn fp-btn-view" onClick={() => completeRide(id)}>✓ Complete</button>
                        )}
                        {tab !== 'rides' && cfg.update && <button className="fp-btn fp-btn-edit" onClick={() => openEdit(item)}>Edit</button>}
                        {cfg.del && <button className="fp-btn fp-btn-danger" onClick={() => setDeleteTarget(item)}>Delete</button>}
                    </div>
                </td>
            </tr>
        );
    };

    const headers = {
        requests: <tr><th>ID</th><th>Type</th><th>Pickup</th><th>Dropoff</th><th>Status</th><th>Time</th><th>Actions</th></tr>,
        rides: <tr><th>ID</th><th>Rider</th><th>Request</th><th>Start Time</th><th>Status</th><th>Actions</th></tr>,
        riders: <tr><th>ID</th><th>Name</th><th>License</th><th>Phone</th><th>Vehicle</th><th>Status</th><th>Actions</th></tr>,
        vehicles: <tr><th>ID</th><th>Reg No.</th><th>Type</th><th>Model</th><th>Capacity</th><th>Status</th><th>Actions</th></tr>,
        providers: <tr><th>ID</th><th>Name</th><th>Service</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>,
    };

    return (
        <div className="fp-root">
            <div className="fp-header">
                <div>
                    <h2 className="fp-title">🚗 Rides & Services Management</h2>
                    <p className="fp-subtitle">Manage requests, rides, riders, vehicles, and providers</p>
                </div>
                <button className="fp-btn fp-btn-primary" onClick={openCreate}>+ Add {tab.slice(0, -1).charAt(0).toUpperCase() + tab.slice(1, -1)}</button>
            </div>

            <div className="fp-tabs">
                {TABS.map(t => (
                    <button key={t.id} className={`fp-tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
            </div>

            {loading ? (
                <div className="fp-loading"><div className="fp-spinner" /><span>Loading…</span></div>
            ) : (
                <div className="fp-table-wrap">
                    <table className="fp-table">
                        <thead>{headers[tab]}</thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan="8" className="fp-empty">No records found.</td></tr>
                            ) : items.map(renderRow)}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal fp-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>{modal.mode === 'create' ? `+ New ${tab.slice(0, -1)}` : `Edit Record`}</h3>
                            <button className="fp-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="fp-form-grid">{formFields()}</div>
                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fp-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header"><h3>⚠️ Confirm</h3><button className="fp-modal-close" onClick={() => setDeleteTarget(null)}>✕</button></div>
                        <p className="fp-modal-text">Delete this record? This cannot be undone.</p>
                        <div className="fp-modal-footer">
                            <button className="fp-btn fp-btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className="fp-btn fp-btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RidesServicesPanel;
