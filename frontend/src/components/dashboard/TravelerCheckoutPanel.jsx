import React, { useState } from 'react';
import '../../pages/public/CheckoutPage.css'; // Reuse existing CSS, just drop the global layout wrappers

const HOTELS_DATA = {
    '101': { name: 'Hotel Sigiriya', price: 120, location: 'Sigiriya' },
    '102': { name: 'Aliya Resort & Spa', price: 180, location: 'Sigiriya' },
    '201': { name: '98 Acres Resort', price: 250, location: 'Ella' },
    '202': { name: 'Mountain Heavens', price: 90, location: 'Ella' },
    '301': { name: 'Paradise Beach Club', price: 140, location: 'Mirissa' },
    '302': { name: 'Mandara Resort', price: 210, location: 'Mirissa' },
};

const TravelerCheckoutPanel = ({ hotelId, onBack, onCheckoutComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    const hotel = HOTELS_DATA[hotelId] || { name: 'Premium Hotel', price: 150, location: 'Sri Lanka' };
    const NIGHTS = 5;
    const TAXES_AND_FEES = 85;
    const TOTAL = (hotel.price * NIGHTS) + TAXES_AND_FEES;

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API/Gateway processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        alert(`Payment successful! Your trip to ${hotel.name} is booked.`);
        onCheckoutComplete();
    };

    return (
        <div className="checkout-page" style={{ padding: 0, minHeight: 'auto', background: 'transparent' }}>
            {/* Header / Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'background-color 0.2s',
                        marginRight: '15px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    &larr; Back to Hotel Details
                </button>
                <h1 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>Secure Checkout</h1>
            </div>

            <section className="checkout-section">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '40px', alignItems: 'start' }}>

                    {/* Left Col: Form */}
                    <div className="checkout-form-container" style={{ margin: 0, padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)', fontSize: '1.5rem' }}>Payment Details</h2>
                        <form onSubmit={handleCheckout}>

                            {/* Payment Method Selector */}
                            <div className="payment-methods" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                                <label className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`} style={{ margin: 0 }}>
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    <div className="method-info">
                                        <span className="icon">💳</span>
                                        <span>Credit / Debit</span>
                                    </div>
                                </label>
                                <label className={`payment-method-card ${paymentMethod === 'wallet' ? 'active' : ''}`} style={{ margin: 0 }}>
                                    <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                                    <div className="method-info">
                                        <span className="icon">📱</span>
                                        <span>Digital Wallet</span>
                                    </div>
                                </label>
                                <label className={`payment-method-card ${paymentMethod === 'paylater' ? 'active' : ''}`} style={{ margin: 0 }}>
                                    <input type="radio" name="payment" value="paylater" checked={paymentMethod === 'paylater'} onChange={() => setPaymentMethod('paylater')} />
                                    <div className="method-info">
                                        <span className="icon">⏳</span>
                                        <span>Pay Later</span>
                                    </div>
                                </label>
                            </div>

                            {/* Dynamic Fields based on selection */}
                            <div className="payment-details-form" style={{ marginTop: '30px' }}>
                                {paymentMethod === 'card' && (
                                    <div className="card-fields">
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Name on Card</label>
                                            <input type="text" placeholder="John Doe" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px' }} />
                                        </div>
                                        <div className="form-group" style={{ marginTop: '15px' }}>
                                            <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px' }} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" maxLength="5" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px' }} />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.85rem', color: '#64748b' }}>CVC</label>
                                                <input type="text" placeholder="123" maxLength="4" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'wallet' && (
                                    <div className="wallet-fields" style={{ textAlign: 'center', padding: '30px 0' }}>
                                        <p style={{ marginBottom: '15px', color: '#64748b' }}>Scan QR code or click below to authorize via your Digital Wallet.</p>
                                        <div style={{ width: '150px', height: '150px', background: '#f1f5f9', margin: '0 auto 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                                            [ QR Code ]
                                        </div>
                                        <button type="button" className="btn btn-outline">Authorize Wallet</button>
                                    </div>
                                )}
                                {paymentMethod === 'paylater' && (
                                    <div className="paylater-fields" style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ marginBottom: '10px', color: '#0f172a' }}>Pay in 4 interest-free installments</h4>
                                        <p style={{ color: '#64748b', marginBottom: '15px' }}>First payment of ${(TOTAL / 4).toFixed(2)} due today.</p>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Social Security Number (Last 4 digits)</label>
                                            <input type="password" placeholder="••••" maxLength="4" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px' }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'center',
                                    backgroundColor: isProcessing ? '#94a3b8' : 'var(--primary-color)',
                                    color: 'white',
                                    padding: '16px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    marginTop: '30px',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 12px rgba(0, 137, 123, 0.3)'
                                }}
                                onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                                {isProcessing ? 'Processing Payment...' : `Confirm & Pay $${TOTAL.toFixed(2)}`}
                            </button>
                        </form>
                    </div>

                    {/* Right Col: Order Summary */}
                    <div className="checkout-summary" style={{ margin: 0, padding: 0, background: 'transparent', boxShadow: 'none' }}>
                        <div className="summary-card" style={{ borderRadius: '24px', position: 'sticky', top: '20px' }}>
                            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '20px' }}>Order Summary</h3>
                            <div className="trip-preview" style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '2.5rem', marginRight: '15px' }}>🏨</span>
                                <div>
                                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>{hotel.name}</h4>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{NIGHTS} Nights in {hotel.location}</p>
                                </div>
                            </div>

                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '0.95rem' }}>
                                    <span>${hotel.price} x {NIGHTS} nights</span>
                                    <span>${hotel.price * NIGHTS}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.95rem' }}>
                                    <span>Taxes & Fees</span>
                                    <span>${TAXES_AND_FEES}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>Total</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${TOTAL.toFixed(2)}</span>
                            </div>

                            <div style={{ textAlign: 'center', color: '#10b981', fontSize: '0.85rem', fontWeight: '600', padding: '12px', background: '#ecfdf5', borderRadius: '8px' }}>
                                🔒 Secure 256-bit Encrypted Checkout
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default TravelerCheckoutPanel;
