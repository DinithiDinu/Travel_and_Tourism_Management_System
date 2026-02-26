import React, { useState } from 'react';

// Mock Data for Saved Cards
const MOCK_CARDS = [
    { id: 'card_1', type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true, brandColor: '#1A1F71', icon: '💳' },
    { id: 'card_2', type: 'Mastercard', last4: '5578', expiry: '08/25', isDefault: false, brandColor: '#EB001B', icon: '💳' }
];

// Mock Data for Transaction History
const MOCK_TRANSACTIONS = [
    { id: 'txn_001', date: '2026-10-14', description: 'Aliya Resort & Spa - 5 Nights', amount: 845.00, status: 'Completed' },
    { id: 'txn_002', date: '2026-06-22', description: '98 Acres Resort - 3 Nights', amount: 620.00, status: 'Completed' },
    { id: 'txn_003', date: '2025-12-05', description: 'Paradise Beach Club - 4 Nights', amount: 510.50, status: 'Completed' },
    { id: 'txn_004', date: '2025-08-18', description: 'Hotel Sigiriya - 2 Nights', amount: 280.00, status: 'Refunded' }
];

const TravelerPaymentsPanel = () => {
    const [cards, setCards] = useState(MOCK_CARDS);
    const [transactions] = useState(MOCK_TRANSACTIONS);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvc: '' });

    const handleRemoveCard = (id) => {
        if (window.confirm('Are you sure you want to remove this payment method?')) {
            setCards(cards.filter(c => c.id !== id));
        }
    };

    const handleSetDefault = (id) => {
        setCards(cards.map(c => ({
            ...c,
            isDefault: c.id === id
        })));
    };

    const handleAddCardSubmit = (e) => {
        e.preventDefault();

        // Simple mock logic to determine card type and color based on first digit
        let type = 'Visa';
        let color = '#1A1F71';
        if (newCard.number.startsWith('5')) { type = 'Mastercard'; color = '#EB001B'; }
        else if (newCard.number.startsWith('3')) { type = 'Amex'; color = '#002663'; }

        const cardObj = {
            id: `card_${Date.now()}`,
            type: type,
            last4: newCard.number.slice(-4) || '****',
            expiry: newCard.expiry,
            isDefault: cards.length === 0,
            brandColor: color,
            icon: '💳'
        };

        setCards([...cards, cardObj]);
        setIsAddingCard(false);
        setNewCard({ name: '', number: '', expiry: '', cvc: '' });
    };

    return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="panel-title" style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Billing & Payments</h2>
                {!isAddingCard && (
                    <button
                        onClick={() => setIsAddingCard(true)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                    >
                        + Add Payment Method
                    </button>
                )}
            </div>

            {/* Add Payment Method Form */}
            {isAddingCard && (
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', color: '#334155' }}>Add New Card</h3>
                    <form onSubmit={handleAddCardSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '15px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Name on Card</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={newCard.name}
                                    onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Card Number</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    required
                                    value={newCard.number}
                                    onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    required
                                    value={newCard.expiry}
                                    onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>CVC</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    maxLength="4"
                                    required
                                    value={newCard.cvc}
                                    onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Save Card</button>
                            <button type="button" className="btn btn-outline" onClick={() => setIsAddingCard(false)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', color: '#64748b' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Saved Payment Methods Section */}
            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '20px', fontWeight: '600' }}>Saved Payment Methods</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {cards.length === 0 ? (
                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>No saved payment methods. Add one to checkout faster.</p>
                    ) : (
                        cards.map(card => (
                            <div key={card.id} style={{
                                background: 'white',
                                border: `1px solid ${card.isDefault ? 'var(--primary-color)' : '#e2e8f0'}`,
                                borderRadius: '16px',
                                padding: '24px',
                                position: 'relative',
                                boxShadow: card.isDefault ? '0 4px 12px rgba(0, 137, 123, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s'
                            }}>
                                {card.isDefault && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: '#ecfdf5',
                                        color: '#10b981',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        Default
                                    </span>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '32px',
                                        background: card.brandColor,
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        marginRight: '15px'
                                    }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a' }}>{card.type}</h4>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontFamily: 'monospace' }}>•••• {card.last4}</p>
                                    </div>
                                </div>

                                <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.85rem' }}>Expires {card.expiry}</p>

                                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                    {!card.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(card.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '500', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                        >
                                            Make Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemoveCard(card.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '500', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginLeft: card.isDefault ? '0' : 'auto' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Payment History Section */}
            <section>
                <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '20px', fontWeight: '600' }}>Transaction History</h3>

                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Date</th>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Description</th>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Amount</th>
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, idx) => (
                                <tr key={txn.id} style={{ borderBottom: idx === transactions.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.95rem' }}>{txn.date}</td>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}>{txn.description}</td>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '0.95rem', fontFamily: 'monospace' }}>${txn.amount.toFixed(2)}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            backgroundColor: txn.status === 'Completed' ? '#ecfdf5' : '#fef2f2',
                                            color: txn.status === 'Completed' ? '#10b981' : '#ef4444'
                                        }}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default TravelerPaymentsPanel;
