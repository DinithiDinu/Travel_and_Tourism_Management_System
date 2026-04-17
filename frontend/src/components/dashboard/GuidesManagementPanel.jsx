import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const blank = { name: '', specialization: '', languagesSpoken: '', experienceYears: '', certificationLevel: 'BASIC', contactEmail: '', phone: '' };

const GuidesManagementPanel = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(blank);
    const [saving, setSaving] = useState(false);
    const [selected, setSelected] = useState(null); // guide detail view
    const [perf, setPerf] = useState(null);
    const [trainings, setTrainings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [detailTab, setDetailTab] = useState('reviews');
    const [deleteId, setDeleteId] = useState(null);

    const load = async () => {
        try {
            setLoading(true);
            setGuides(await api.get('/guides') || []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const selectGuide = async (g) => {
        setSelected(g);
        setDetailTab('reviews');
        setPerf(null); setTrainings([]); setReviews([]);
        try {
            const [rv, tr, pf] = await Promise.all([
                api.get(`/guides/${g.guideId}/reviews`),
                api.get(`/guides/${g.guideId}/training`),
                api.get(`/guides/${g.guideId}/performance`),
            ]);
            setReviews(rv || []);
            setTrainings(tr || []);
            setPerf(pf?.[0] || null);
        } catch (_) { }
    };

    const openCreate = () => { setForm({ ...blank }); setModal({ mode: 'create' }); };
    const openEdit = (g) => {
        setForm({ name: g.name, specialization: g.specialization, languagesSpoken: g.languagesSpoken, experienceYears: g.experienceYears, certificationLevel: g.certificationLevel, contactEmail: g.contactEmail, phone: g.phone });
        setModal({ mode: 'edit', guide: g });
    };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (modal.mode === 'create') {
                await api.post('/guides', form);
            } else {
                await api.put(`/guides/${modal.guide.guideId}`, { ...form, guideId: modal.guide.guideId });
            }
            await load(); setModal(null);
        } catch (e) { alert('Error: ' + e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try { await api.del(`/guides/${id}`); setGuides(prev => prev.filter(g => g.guideId !== id)); setDeleteId(null); if (selected?.guideId === id) setSelected(null); }
        catch (e) { alert('Error: ' + e.message); }
    };

    const refreshPerf = async () => {
        try { const p = await api.post(`/guides/${selected.guideId}/performance/refresh`); setPerf(p); }
        catch (e) { alert('Error: ' + e.message); }
    };

    if (selected) {
        return (
            <div className="fp-root">
                <div className="fp-header">
                    <div>
                        <button className="fp-back-btn" onClick={() => setSelected(null)}>← Back to Guides</button>
                        <h2 className="fp-title">🧭 {selected.name}</h2>
                        <p className="fp-subtitle">{selected.specialization} • {selected.certificationLevel}</p>
                    </div>
                    <button className="fp-btn fp-btn-primary" onClick={() => openEdit(selected)}>Edit Guide</button>
                </div>

                {/* Perf card */}
                {perf && (
                    <div className="fp-perf-cards">
                        <div className="fp-stat-card"><span className="fp-stat-val">{perf.avgRating?.toFixed(1) || 'N/A'}</span><span className="fp-stat-label">Avg Rating</span></div>
                        <div className="fp-stat-card"><span className="fp-stat-val">{perf.totalTrips || 0}</span><span className="fp-stat-label">Total Trips</span></div>
                        <div className="fp-stat-card"><span className="fp-stat-val">{perf.performanceStatus}</span><span className="fp-stat-label">Status</span></div>
                        <div className="fp-stat-card fp-stat-card-action">
                            <button className="fp-btn fp-btn-primary" onClick={refreshPerf}>↻ Refresh Score</button>
                        </div>
                    </div>
                )}

                <div className="fp-detail-tabs">
                    {['reviews', 'training'].map(t => (
                        <button key={t} className={`fp-tab-btn${detailTab === t ? ' active' : ''}`} onClick={() => setDetailTab(t)}>
                            {t === 'reviews' ? `Reviews (${reviews.length})` : `Training (${trainings.length})`}
                        </button>
                    ))}
                </div>

                {detailTab === 'reviews' && (
                    <div className="fp-cards-grid">
                        {reviews.length === 0 ? <p className="fp-empty-msg">No reviews yet.</p> : reviews.map(r => (
                            <div key={r.reviewId} className="fp-review-card">
                                <div className="fp-review-top">
                                    <span className="fp-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    <span className="fp-review-date">{r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : ''}</span>
                                </div>
                                <p>{r.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {detailTab === 'training' && (
                    <div className="fp-table-wrap">
                        <table className="fp-table">
                            <thead><tr><th>Program</th><th>Type</th><th>Status</th><th>Start</th><th>End</th></tr></thead>
                            <tbody>
                                {trainings.length === 0 ? (
                                    <tr><td colSpan="5" className="fp-empty">No trainings found</td></tr>
                                ) : trainings.map(t => (
                                    <tr key={t.trainingId}>
                                        <td><strong>{t.programName}</strong></td>
                                        <td>{t.trainingType}</td>
                                        <td><span className={`fp-badge fp-badge-${t.status?.toLowerCase()}`}>{t.status}</span></td>
                                        <td>{t.startDate}</td>
                                        <td>{t.endDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="fp-root">
            <div className="fp-header">
                <div>
                    <h2 className="fp-title">🧭 Guide Management</h2>
                    <p className="fp-subtitle">{guides.length} guides registered</p>
                </div>
                <button className="fp-btn fp-btn-primary" onClick={openCreate}>+ Add Guide</button>
            </div>

            {loading ? (
                <div className="fp-loading"><div className="fp-spinner" /><span>Loading guides…</span></div>
            ) : error ? (
                <div className="fp-error"><span>⚠️ {error}</span><button className="fp-btn fp-btn-primary" onClick={load}>Retry</button></div>
            ) : (
                <div className="fp-table-wrap">
                    <table className="fp-table">
                        <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Languages</th><th>Certification</th><th>Experience</th><th>Actions</th></tr></thead>
                        <tbody>
                            {guides.length === 0 ? (
                                <tr><td colSpan="7" className="fp-empty">No guides registered yet.</td></tr>
                            ) : guides.map(g => (
                                <tr key={g.guideId}>
                                    <td><span className="fp-id">#{g.guideId}</span></td>
                                    <td><strong>{g.name}</strong></td>
                                    <td>{g.specialization}</td>
                                    <td>{g.languagesSpoken}</td>
                                    <td><span className={`fp-badge fp-badge-${g.certificationLevel?.toLowerCase()}`}>{g.certificationLevel}</span></td>
                                    <td>{g.experienceYears} yrs</td>
                                    <td>
                                        <div className="fp-actions">
                                            <button className="fp-btn fp-btn-view" onClick={() => selectGuide(g)}>View</button>
                                            <button className="fp-btn fp-btn-edit" onClick={() => openEdit(g)}>Edit</button>
                                            <button className="fp-btn fp-btn-danger" onClick={() => setDeleteId(g.guideId)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {modal && (
                <div className="fp-modal-overlay" onClick={() => setModal(null)}>
                    <div className="fp-modal fp-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header">
                            <h3>{modal.mode === 'create' ? '+ Add New Guide' : `Edit Guide #${modal.guide.guideId}`}</h3>
                            <button className="fp-modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="fp-form-grid">
                                <div className="fp-form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
                                <div className="fp-form-group"><label>Specialization</label><input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Languages Spoken</label><input value={form.languagesSpoken} onChange={e => setForm(p => ({ ...p, languagesSpoken: e.target.value }))} placeholder="e.g. English, Sinhala" /></div>
                                <div className="fp-form-group"><label>Experience (years)</label><input type="number" value={form.experienceYears} onChange={e => setForm(p => ({ ...p, experienceYears: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Certification Level</label>
                                    <select value={form.certificationLevel} onChange={e => setForm(p => ({ ...p, certificationLevel: e.target.value }))}>
                                        {['BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map(l => <option key={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="fp-form-group"><label>Email</label><input type="email" value={form.contactEmail} onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} /></div>
                                <div className="fp-form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                            </div>
                            <div className="fp-modal-footer">
                                <button type="button" className="fp-btn fp-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="fp-btn fp-btn-primary" disabled={saving}>{saving ? 'Saving…' : modal.mode === 'create' ? 'Create Guide' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fp-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="fp-modal fp-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="fp-modal-header"><h3>⚠️ Delete Guide #{deleteId}?</h3><button className="fp-modal-close" onClick={() => setDeleteId(null)}>✕</button></div>
                        <p className="fp-modal-text">This will permanently remove the guide and all associated data.</p>
                        <div className="fp-modal-footer">
                            <button className="fp-btn fp-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="fp-btn fp-btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuidesManagementPanel;
