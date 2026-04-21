import { useState, useEffect } from 'react';
import { generateAndDownloadReceipt } from '../../utils/receiptGenerator';

const TravelerPaymentsPanel = () => {
    const [cards, setCards] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loadingTxns, setLoadingTxns] = useState(true);
    const [loadingCards, setLoadingCards] = useState(true);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            fetch(`http://localhost:8081/api/pricing/payments/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    if (!Array.isArray(data)) { setLoadingTxns(false); return; }
                    const mapped = data.map(p => ({
                        id: p.paymentId,
                        bookingId: p.bookingId,
                        packageId: p.packageId,
                        date: new Date(p.transactionDate).toISOString().split('T')[0],
                        description: p.packageId ? `Package Booking #${p.bookingId || p.packageId}` : 'Hotel/Service Booking',
                        amount: p.amount,
                        method: p.paymentMethod === 'STAR_POINTS' ? 'Star Points' : 'Credit / Debit',
                        status: p.paymentStatus === 'COMPLETED' ? 'Completed' : p.paymentStatus
                    }));
                    mapped.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setTransactions(mapped);
                    setLoadingTxns(false);
                })
                .catch(err => {
                    console.error("Failed to fetch transactions:", err);
                    setLoadingTxns(false);
                });

            // Fetch user's saved cards
            fetch(`http://localhost:8081/api/pricing/saved-cards/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    setCards(Array.isArray(data) ? data : []);
                    setLoadingCards(false);
                })
                .catch(err => {
                    console.error("Failed to fetch cards:", err);
                    setLoadingCards(false);
                });
        } else {
            // No auth data available — stop showing loaders
            setLoadingCards(false);
            setLoadingTxns(false);
        }
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!newCard.name.trim()) newErrors.name = "Name is required";

        const cleanNumber = newCard.number.replace(/\D/g, '');
        if (cleanNumber.length !== 16) {
            newErrors.number = "Must be 16 digits";
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!expiryRegex.test(newCard.expiry)) {
            newErrors.expiry = "Use MM/YY format";
        } else {
            const [, month, year] = newCard.expiry.match(expiryRegex);
            const now = new Date();
            const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
            const currentMonth = now.getMonth() + 1;
            const expYear = parseInt(year, 10);
            const expMonth = parseInt(month, 10);
            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                newErrors.expiry = "Card has expired";
            }
        }

        if (!/^\d{3,4}$/.test(newCard.cvc)) {
            newErrors.cvc = "Must be 3-4 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchCards = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId) {
            try {
                const res = await fetch(`http://localhost:8081/api/pricing/saved-cards/user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCards(data);
            } catch (err) {
                console.error("Failed to fetch cards:", err);
            }
        }
    };

    const handleRemoveCard = async (id) => {
        if (window.confirm('Are you sure you want to remove this payment method?')) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`http://localhost:8081/api/pricing/saved-cards/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchCards();
            } catch (err) {
                console.error("Error removing card", err);
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            await fetch(`http://localhost:8081/api/pricing/saved-cards/${id}/default`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: parseInt(userId, 10) })
            });
            fetchCards();
        } catch (err) {
            console.error("Error setting default card", err);
        }
    };

    const handleAddCardSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let type = 'Visa';
        let color = '#1A1F71';
        if (newCard.number.startsWith('5')) { type = 'Mastercard'; color = '#EB001B'; }
        else if (newCard.number.startsWith('3')) { type = 'Amex'; color = '#002663'; }

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const cardObj = {
            userId: parseInt(userId, 10),
            cardName: newCard.name,
            cardNumberLast4: newCard.number.slice(-4) || '****',
            expiryDate: newCard.expiry,
            cvv: newCard.cvc,
            cardType: type,
            brandColor: color,
            isDefault: cards.length === 0
        };

        try {
            await fetch(`http://localhost:8081/api/pricing/saved-cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cardObj)
            });
            setIsAddingCard(false);
            setNewCard({ name: '', number: '', expiry: '', cvc: '' });
            fetchCards();
        } catch (err) {
            console.error("Error adding card", err);
        }
    };

    const handleDownloadReceipt = async (txn) => {
        const token = localStorage.getItem('token');
        let detailedDescription = txn.description;
        let subItems = [];

        try {
            if (txn.packageId) {
                const res = await fetch(`http://localhost:8081/api/pricing/packages/${txn.packageId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const pkgData = await res.json();
                    detailedDescription = `Package: ${pkgData.packageName || 'Exclusive Tour'}`;
                    subItems.push({ label: detailedDescription, amount: txn.amount });
                }
            } else if (txn.bookingId) {
                const res = await fetch(`http://localhost:8081/api/bookings/${txn.bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const bookingData = await res.json();
                    const pax = bookingData.numberOfPeople ? `${bookingData.numberOfPeople} Guests` : 'Service';
                    detailedDescription = `Hotel/Service Booking #${txn.bookingId}`;
                    const estTaxes = parseFloat((txn.amount * 0.15).toFixed(2));
                    const estBase = parseFloat((txn.amount - estTaxes).toFixed(2));
                    subItems.push({ label: `Booking Fare (${pax})`, amount: estBase });
                    subItems.push({ label: 'Taxes & Fees', amount: estTaxes });
                }
            }
        } catch (e) {
            console.error("Failed to fetch receipt details", e);
        }

        // Use the actual payment method from the backend
        const paymentMode = txn.method || 'Credit / Debit';

        generateAndDownloadReceipt({
            id: txn.id,
            date: txn.date,
            description: detailedDescription,
            amount: txn.amount,
            status: txn.status,
            method: paymentMode,
            subItems: subItems.length > 0 ? subItems : null
        });
    };

    return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="panel-title" style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Billing & Payments</h2>
                {!isAddingCard && (
                    <button
                        onClick={() => setIsAddingCard(true)}
                        className="btn btn-dark"
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
                                    value={newCard.name}
                                    onChange={e => { setNewCard({ ...newCard, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                                    style={{ width: '100%', padding: '10px 12px', border: errors.name ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                                />
                                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Card Number</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="16"
                                    value={newCard.number}
                                    onChange={e => { setNewCard({ ...newCard, number: e.target.value }); setErrors({ ...errors, number: '' }) }}
                                    style={{ width: '100%', padding: '10px 12px', border: errors.number ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                                />
                                {errors.number && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.number}</span>}
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    value={newCard.expiry}
                                    onChange={e => { setNewCard({ ...newCard, expiry: e.target.value }); setErrors({ ...errors, expiry: '' }) }}
                                    style={{ width: '100%', padding: '10px 12px', border: errors.expiry ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                                />
                                {errors.expiry && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.expiry}</span>}
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>CVC</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    maxLength="4"
                                    value={newCard.cvc}
                                    onChange={e => { setNewCard({ ...newCard, cvc: e.target.value }); setErrors({ ...errors, cvc: '' }) }}
                                    style={{ width: '100%', padding: '10px 12px', border: errors.cvc ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                                />
                                {errors.cvc && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.cvc}</span>}
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
                    {loadingCards ? (
                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>Loading saved cards...</p>
                    ) : cards.length === 0 ? (
                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>No saved payment methods. Add one to checkout faster.</p>
                    ) : (
                        cards.map(card => (
                            <div key={card.cardId} style={{
                                background: 'white',
                                border: `1px solid ${card.isDefault ? 'var(--primary-color, #0f766e)' : '#e2e8f0'}`,
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
                                        border: '1px solid #a7f3d0',
                                        color: '#047857',
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
                                        background: card.brandColor || '#1A1F71',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        marginRight: '15px'
                                    }}>
                                        💳
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a' }}>{card.cardType}</h4>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontFamily: 'monospace' }}>•••• {card.cardNumberLast4}</p>
                                    </div>
                                </div>

                                <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.85rem' }}>Expires {card.expiryDate}</p>

                                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                    {!card.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(card.cardId)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary-color, #0f766e)', fontWeight: '500', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                        >
                                            Make Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemoveCard(card.cardId)}
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
                                <th style={{ padding: '16px 24px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingTxns ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading transactions...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No transaction history found.</td></tr>
                            ) : transactions.map((txn, idx) => (
                                <tr key={txn.id} style={{ borderBottom: idx === transactions.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.95rem' }}>{txn.date}</td>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}>{txn.description}</td>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '0.95rem', fontFamily: 'monospace' }}>LKR {txn.amount.toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '3px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            backgroundColor: txn.status === 'Completed' ? '#ecfdf5' : '#fef2f2',
                                            border: txn.status === 'Completed' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                                            color: txn.status === 'Completed' ? '#047857' : '#b91c1c'
                                        }}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button
                                            onClick={() => handleDownloadReceipt(txn)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #cbd5e1',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                color: '#0f766e',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span style={{ fontSize: '1rem' }}>📄</span> Download
                                        </button>
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
