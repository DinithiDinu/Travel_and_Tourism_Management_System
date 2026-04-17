import { useState, useEffect } from 'react';

const BASE = 'http://localhost:8081/api/pricing/tier-offers';

const PricingEnginePanel = () => {
    const [rules, setRules] = useState([]);
    const [isAddingRule, setIsAddingRule] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [deleting, setDeleting] = useState(false);

    const defaultRule = {
        offerName: '',
        targetTier: 'ALL',
        discountPercentage: 10,
        description: '',
        active: true,
        isHoliday: false
    };

    const [newRule, setNewRule] = useState(defaultRule);

    const getToken = () => localStorage.getItem('token');

    const fetchRules = async () => {
        try {
            const res = await fetch(BASE, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRules(data);
            }
        } catch (err) {
            console.error('Failed to fetch rules', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const toggleRule = async (rule) => {
        try {
            const res = await fetch(`${BASE}/${rule.offerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ ...rule, active: !rule.active })
            });
            if (res.ok) {
                setRules(rules.map(r => r.offerId === rule.offerId ? { ...r, active: !r.active } : r));
            } else {
                alert('Failed to update rule status.');
            }
        } catch (err) {
            console.error('Failed to update rule', err);
            alert('Error updating rule status.');
        }
    };

    const confirmDelete = (rule) => {
        setDeleteTarget({ id: rule.offerId, name: rule.offerName });
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`${BASE}/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
                setRules(prev => prev.filter(r => r.offerId !== deleteTarget.id));
                setDeleteTarget(null);
            } else {
                alert('Failed to delete rule.');
            }
        } catch (err) {
            console.error('Failed to delete rule', err);
            alert('Error deleting rule.');
        } finally {
            setDeleting(false);
        }
    };

    const handleEditClick = (rule) => {
        setNewRule({ ...rule });
        setEditingRuleId(rule.offerId);
        setIsAddingRule(true);
    };

    const handleCancelForm = () => {
        setIsAddingRule(false);
        setEditingRuleId(null);
        setNewRule(defaultRule);
    };

    const handleAddRuleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRuleId) {
                const res = await fetch(`${BASE}/${editingRuleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(newRule)
                });
                if (res.ok) {
                    alert('Rule updated successfully!');
                    handleCancelForm();
                    fetchRules();
                } else {
                    const errData = await res.json().catch(() => ({}));
                    alert(`Failed to update rule: ${errData.error || res.statusText}`);
                }
            } else {
                const res = await fetch(BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(newRule)
                });
                if (res.ok) {
                    alert('New rule added successfully!');
                    handleCancelForm();
                    fetchRules();
                } else {
                    const errData = await res.json().catch(() => ({}));
                    alert(`Failed to save rule: ${errData.error || res.statusText}`);
                }
            }
        } catch (err) {
            console.error('Failed to save rule', err);
            alert('Error saving rule.');
        }
    };

    if (isAddingRule) {
        return (
            <div>
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="panel-title">{editingRuleId ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</h2>
                    <button className="btn btn-outline btn-sm" onClick={handleCancelForm}>
                        &larr; Back to Rules
                    </button>
                </div>

                <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleAddRuleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '500' }}>Rule Name</label>
                            <input type="text" required placeholder="e.g. Winter Holiday Special" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                value={newRule.offerName} onChange={e => setNewRule({ ...newRule, offerName: e.target.value })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '500' }}>Target Audience</label>
                                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
                                    value={newRule.targetTier} onChange={e => setNewRule({ ...newRule, targetTier: e.target.value })}>
                                    <option value="ALL">All Members</option>
                                    <option value="NEW_MEMBER">New Members</option>
                                    <option value="BRONZE">Bronze Tier</option>
                                    <option value="SILVER">Silver Tier</option>
                                    <option value="GOLD">Gold Tier</option>
                                    <option value="PLATINUM">Platinum Tier</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '500' }}>Is Holiday Special?</label>
                                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
                                    value={newRule.isHoliday} onChange={e => setNewRule({ ...newRule, isHoliday: e.target.value === 'true' })}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '500' }}>Percentage (%)</label>
                                <input type="number" required placeholder="10" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    value={newRule.discountPercentage} onChange={e => setNewRule({ ...newRule, discountPercentage: parseFloat(e.target.value) })} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '500' }}>Conditions (Optional)</label>
                            <textarea placeholder="Apply to all properties..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px', resize: 'vertical' }}
                                value={newRule.description} onChange={e => setNewRule({ ...newRule, description: e.target.value })}></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>{editingRuleId ? 'Update Rule' : 'Save Rule'}</button>
                            <button type="button" className="btn btn-outline" onClick={handleCancelForm} style={{ padding: '12px 24px', border: '1px solid #cbd5e1', color: '#64748b' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading pricing rules...</div>;

    return (
        <div>
            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '16px' }}>🗑️</div>
                        <h3 style={{ margin: '0 0 12px', textAlign: 'center', color: '#0f172a', fontSize: '1.25rem' }}>
                            Delete Pricing Rule
                        </h3>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '28px' }}>
                            Are you sure you want to delete <strong>&quot;{deleteTarget.name}&quot;</strong>?
                            This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: '1px solid #e2e8f0', background: '#f8fafc',
                                    cursor: 'pointer', fontWeight: '500', color: '#64748b'
                                }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: 'none', background: '#ef4444',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    fontWeight: '600', color: '#fff',
                                    opacity: deleting ? 0.7 : 1
                                }}>
                                {deleting ? 'Deleting...' : 'Delete Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="panel-title">Pricing Engine</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddingRule(true)}>+ Add Rule</button>
            </div>

            <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
                Configure platform-wide pricing rules to adjust rates for travel packages and rides based on conditions.
            </p>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-light)', fontWeight: '600' }}>Rule Name</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-light)', fontWeight: '600' }}>Target Audience</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-light)', fontWeight: '600' }}>Rate Adjustment</th>
                            <th style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-light)', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px 20px', textAlign: 'right', color: 'var(--text-light)', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map(rule => (
                            <tr key={rule.offerId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '20px', fontWeight: '500' }}>{rule.offerName} {rule.isHoliday && '🎄'}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        fontWeight: '500'
                                    }}>
                                        {rule.targetTier}
                                    </span>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        color: rule.discountPercentage > 0 ? '#047857' : '#b91c1c',
                                        background: rule.discountPercentage > 0 ? '#d1fae5' : '#fee2e2',
                                        border: rule.discountPercentage > 0 ? '1px solid #a7f3d0' : '1px solid #fecaca',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {rule.discountPercentage > 0 ? `-${rule.discountPercentage}% Off` : `+${Math.abs(rule.discountPercentage)}% Surge`}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'center' }}>
                                    <div
                                        onClick={() => toggleRule(rule)}
                                        style={{
                                            display: 'inline-block',
                                            width: '50px',
                                            height: '26px',
                                            background: rule.active ? 'var(--primary)' : 'var(--charcoal-soft)',
                                            border: rule.active ? '1px solid var(--primary)' : '1px solid var(--charcoal)',
                                            borderRadius: '13px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s, border 0.3s'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '2px',
                                            left: rule.active ? '25px' : '2px',
                                            width: '20px',
                                            height: '20px',
                                            background: '#fff',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '50%',
                                            transition: 'left 0.3s',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}></div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button onClick={() => handleEditClick(rule)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '15px' }}>✏️ Edit</button>
                                    <button onClick={() => confirmDelete(rule)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                        {rules.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No pricing rules found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PricingEnginePanel;
