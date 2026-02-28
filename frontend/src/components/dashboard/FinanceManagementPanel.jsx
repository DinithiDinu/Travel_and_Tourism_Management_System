import { useState, useEffect } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const TABS = [
    { id: 'expenses', label: '💸 Expenses' },
    { id: 'revenues', label: '📈 Revenues' },
    { id: 'employees', label: '👔 Employees' },
    { id: 'payroll', label: '💳 Payroll' },
    { id: 'reports', label: '📊 Reports' },
];

const FinanceManagementPanel = () => {
    const [tab, setTab] = useState('expenses');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const urls = {
        expenses: { list: '/finance/expenses', id: 'expenseId', create: '/finance/expenses', update: (id) => `/finance/expenses/${id}`, del: (id) => `/finance/expenses/${id}` },
        revenues: { list: '/finance/revenues', id: 'revenueId', create: '/finance/revenues', update: (id) => `/finance/revenues/${id}`, del: (id) => `/finance/revenues/${id}` },
        employees: { list: '/finance/employees', id: 'employeeId', create: '/finance/employees', update: (id) => `/finance/employees/${id}`, del: (id) => `/finance/employees/${id}` },
        payroll: { list: '/finance/payroll', id: 'payrollId', create: '/finance/payroll', update: (id) => `/finance/payroll/${id}`, del: (id) => `/finance/payroll/${id}` },
        reports: { list: '/finance/reports', id: 'reportId', create: '/finance/reports/generate', del: (id) => `/finance/reports/${id}` },
    };

    const load = async (t = tab) => {
        setLoading(true);
        try {
            const result = await api.get(urls[t].list);
            setData(prev => ({ ...prev, [t]: result || [] }));
        } catch (e) { setData(prev => ({ ...prev, [t]: [] })); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (!data[tab]) load(tab); }, [tab]);

    const items = data[tab] || [];
    const cfg = urls[tab];

    const openCreate = () => {
        setForm(getDefaultForm(tab));
        setModal({ mode: 'create' });
    };

    const openEdit = (item) => {
        setForm({ ...item });
        setModal({ mode: 'edit', item });
    };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (modal.mode === 'create') {
                await api.post(cfg.create, form);
            } else {
                await api.put(cfg.update(modal.item[cfg.id]), form);
            }
            await load(tab); setModal(null);
        } catch (e) { alert('Error: ' + e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try {
            await api.del(cfg.del(deleteTarget[cfg.id]));
            setData(prev => ({ ...prev, [tab]: prev[tab]?.filter(i => i[cfg.id] !== deleteTarget[cfg.id]) }));
            setDeleteTarget(null);
        } catch (e) { alert('Error: ' + e.message); }
    };

    const getDefaultForm = (t) => {
        if (t === 'expenses') return { category: '', amount: '', description: '', expenseDate: '', status: 'PENDING' };
        if (t === 'revenues') return { source: '', amount: '', description: '', revenueDate: '', category: '' };
        if (t === 'employees') return { name: '', position: '', department: '', salary: '', hireDate: '', status: 'ACTIVE' };
        if (t === 'payroll') return { employeeId: '', amount: '', paymentDate: '', paymentMethod: 'BANK_TRANSFER', status: 'PENDING' };
        if (t === 'reports') return { reportType: 'MONTHLY', startDate: '', endDate: '', generatedBy: 'Admin' };
        return {};
    };

    const renderRow = (item) => {
        const id = item[cfg.id];
        return (
            <tr key={id}>
                <td><span className="fp-id">#{id}</span></td>
                {tab === 'expenses' && <><td>{item.category}</td><td className="fp-money">LKR {Number(item.amount).toLocaleString()}</td><td>{item.description}</td><td>{item.expenseDate}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                {tab === 'revenues' && <><td>{item.source}</td><td className="fp-money-green">LKR {Number(item.amount).toLocaleString()}</td><td>{item.description}</td><td>{item.revenueDate}</td><td>{item.category}</td></>}
                {tab === 'employees' && <><td><strong>{item.name}</strong></td><td>{item.position}</td><td>{item.department}</td><td>LKR {Number(item.salary).toLocaleString()}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                {tab === 'payroll' && <><td>#{item.employeeId}</td><td className="fp-money">LKR {Number(item.amount).toLocaleString()}</td><td>{item.paymentDate}</td><td>{item.paymentMethod}</td><td><span className={`fp-badge fp-badge-${item.status?.toLowerCase()}`}>{item.status}</span></td></>}
                {tab === 'reports' && <><td>{item.reportType}</td><td>{item.startDate}</td><td>{item.endDate}</td><td>{item.generatedBy}</td><td>{item.totalRevenue != null ? `LKR ${Number(item.totalRevenue).toLocaleString()}` : '—'}</td></>}
                <td>
                    <div className="fp-actions">
                        {tab !== 'reports' && <button className="fp-btn fp-btn-edit" onClick={() => openEdit(item)}>Edit</button>}
                        <button className="fp-btn fp-btn-danger" onClick={() => setDeleteTarget(item)}>Delete</button>
                    </div>
                </td>
            </tr>
        );
    };

    const renderHeaders = () => {
        if (tab === 'expenses') return <tr><th>ID</th><th>Category</th><th>Amount</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr>;
        if (tab === 'revenues') return <tr><th>ID</th><th>Source</th><th>Amount</th><th>Description</th><th>Date</th><th>Category</th><th>Actions</th></tr>;
        if (tab === 'employees') return <tr><th>ID</th><th>Name</th><th>Position</th><th>Department</th><th>Salary</th><th>Status</th><th>Actions</th></tr>;
        if (tab === 'payroll') return <tr><th>ID</th><th>Employee</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th><th>Actions</th></tr>;
        if (tab === 'reports') return <tr><th>ID</th><th>Type</th><th>Start</th><th>End</th><th>Generated By</th><th>Revenue</th><th>Actions</th></tr>;
    };

    const renderFormFields = () => {
        const fc = (field, label, type = 'text', opts = null) => (
            <div className="fp-form-group" key={field}>
                <label>{label}</label>
                {opts ? (
                    <select value={form[field] || ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                ) : (
                    <input type={type} value={form[field] || ''} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
                )}
            </div>
        );
        if (tab === 'expenses') return [fc('category', 'Category'), fc('amount', 'Amount (LKR)', 'number'), fc('description', 'Description'), fc('expenseDate', 'Date', 'date'), fc('status', 'Status', 'text', ['PENDING', 'APPROVED', 'REJECTED'])];
        if (tab === 'revenues') return [fc('source', 'Revenue Source'), fc('amount', 'Amount (LKR)', 'number'), fc('description', 'Description'), fc('revenueDate', 'Date', 'date'), fc('category', 'Category')];
        if (tab === 'employees') return [fc('name', 'Name'), fc('position', 'Position'), fc('department', 'Department'), fc('salary', 'Salary (LKR)', 'number'), fc('hireDate', 'Hire Date', 'date'), fc('status', 'Status', 'text', ['ACTIVE', 'ON_LEAVE', 'TERMINATED'])];
        if (tab === 'payroll') return [fc('employeeId', 'Employee ID'), fc('amount', 'Amount (LKR)', 'number'), fc('paymentDate', 'Payment Date', 'date'), fc('paymentMethod', 'Method', 'text', ['BANK_TRANSFER', 'CHEQUE', 'CASH']), fc('status', 'Status', 'text', ['PENDING', 'COMPLETED', 'FAILED'])];
        if (tab === 'reports') return [fc('reportType', 'Report Type', 'text', ['MONTHLY', 'QUARTERLY', 'ANNUAL']), fc('startDate', 'Start Date', 'date'), fc('endDate', 'End Date', 'date'), fc('generatedBy', 'Generated By')];
    };

    return (
        <div className="fp-root">
            <div className="fp-header">
                <div>
                    <h2 className="fp-title">💰 Finance Management</h2>
                </div>
                <button className="fp-btn fp-btn-primary" onClick={openCreate}>
                    + {tab === 'reports' ? 'Generate Report' : `Add ${tab.charAt(0).toUpperCase() + tab.slice(1, -1)}`}
                </button>
            </div>

            <div className="fp-tabs">
                {TABS.map(t => (
                    <button key={t.id} className={`fp-tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="fp-loading"><div className="fp-spinner" /><span>Loading…</span></div>
            ) : (
                <div className="fp-table-wrap">
                    <table className="fp-table">
                        <thead>{renderHeaders()}</thead>
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
                            <div className="fp-form-grid">{renderFormFields()}</div>
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
                        <div className="fp-modal-header"><h3>⚠️ Confirm Deletion</h3><button className="fp-modal-close" onClick={() => setDeleteTarget(null)}>✕</button></div>
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

export default FinanceManagementPanel;
