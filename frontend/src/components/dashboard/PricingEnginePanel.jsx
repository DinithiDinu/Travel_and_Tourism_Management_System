import { useState } from 'react';

const PricingEnginePanel = () => {
    const [rules, setRules] = useState([
        { id: 1, name: 'Summer Season Peak', discount: -15, active: true }, // Negative discount = percentage increase
        { id: 2, name: 'Early Bird (30+ Days Advance)', discount: 10, active: true },
        { id: 3, name: 'Last Minute Deal (24 hrs)', discount: 20, active: false }
    ]);

    const toggleRule = (id) => {
        setRules(rules.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule));
    };

    return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="panel-title">Dynamic Pricing Engine</h2>
                <button className="btn btn-primary btn-sm">+ Add Rule</button>
            </div>

            <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
                Configure platform-wide pricing rules to dynamically adjust rates for travel packages and rides based on conditions.
            </p>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-light)', fontWeight: '600' }}>Rule Name</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-light)', fontWeight: '600' }}>Rate Adjustment</th>
                            <th style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-light)', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px 20px', textAlign: 'right', color: 'var(--text-light)', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map(rule => (
                            <tr key={rule.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '20px', fontWeight: '500' }}>{rule.name}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        color: rule.discount > 0 ? '#10b981' : '#ef4444',
                                        background: rule.discount > 0 ? '#d1fae5' : '#fee2e2',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {rule.discount > 0 ? `-${rule.discount}% Off` : `+${Math.abs(rule.discount)}% Surge`}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'center' }}>
                                    {/* Custom Toggle Switch */}
                                    <div
                                        onClick={() => toggleRule(rule.id)}
                                        style={{
                                            display: 'inline-block',
                                            width: '50px',
                                            height: '26px',
                                            background: rule.active ? 'var(--primary-color)' : '#cbd5e1',
                                            borderRadius: '13px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '3px',
                                            left: rule.active ? '27px' : '3px',
                                            width: '20px',
                                            height: '20px',
                                            background: '#fff',
                                            borderRadius: '50%',
                                            transition: 'left 0.3s',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                        }}></div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginRight: '10px' }}>✏️ Edit</button>
                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default PricingEnginePanel;
