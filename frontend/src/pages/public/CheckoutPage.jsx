import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import './CheckoutPage.css';

function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        const els = ref.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return ref;
}

const CheckoutPage = () => {
    const pageRef = useScrollReveal();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API/Gateway processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        alert('Payment successful! Your trip is booked.');
        navigate('/dashboard/traveler');
    };

    return (
        <div ref={pageRef} className="checkout-page">

            <header className="checkout-header section">
                <div className="container">
                    <h1 className="section-title">Secure Checkout</h1>
                    <p className="section-subtitle">Complete your booking securely using your preferred payment method.</p>
                </div>
                <div className="wave-container">
                    <TopWave />
                </div>
            </header>

            <section className="checkout-section section">
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>

                    {/* Left Col: Form */}
                    <div className="checkout-form-container reveal">
                        <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Payment Details</h2>
                        <form onSubmit={handleCheckout}>

                            {/* Payment Method Selector */}
                            <div className="payment-methods">
                                <label className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    <div className="method-info">
                                        <span className="icon">💳</span>
                                        <span>Credit / Debit Card</span>
                                    </div>
                                </label>
                                <label className={`payment-method-card ${paymentMethod === 'wallet' ? 'active' : ''}`}>
                                    <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                                    <div className="method-info">
                                        <span className="icon">📱</span>
                                        <span>Digital Wallet</span>
                                    </div>
                                </label>
                                <label className={`payment-method-card ${paymentMethod === 'paylater' ? 'active' : ''}`}>
                                    <input type="radio" name="payment" value="paylater" checked={paymentMethod === 'paylater'} onChange={() => setPaymentMethod('paylater')} />
                                    <div className="method-info">
                                        <span className="icon">⏳</span>
                                        <span>Pay Later (Installments)</span>
                                    </div>
                                </label>
                            </div>

                            {/* Dynamic Fields based on selection */}
                            <div className="payment-details-form">
                                {paymentMethod === 'card' && (
                                    <div className="card-fields">
                                        <div className="form-group">
                                            <label>Name on Card</label>
                                            <input type="text" placeholder="John Doe" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" maxLength="5" required />
                                            </div>
                                            <div className="form-group">
                                                <label>CVC</label>
                                                <input type="text" placeholder="123" maxLength="4" required />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'wallet' && (
                                    <div className="wallet-fields" style={{ textAlign: 'center', padding: '30px 0' }}>
                                        <p style={{ marginBottom: '15px' }}>Scan QR code or click below to authorize via your Digital Wallet.</p>
                                        <div style={{ width: '150px', height: '150px', background: '#ccc', margin: '0 auto 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            [ QR Code ]
                                        </div>
                                        <button type="button" className="btn btn-outline">Authorize Wallet</button>
                                    </div>
                                )}
                                {paymentMethod === 'paylater' && (
                                    <div className="paylater-fields" style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                                        <h4 style={{ marginBottom: '10px' }}>Pay in 4 interest-free installments</h4>
                                        <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>First payment of $312.50 due today.</p>
                                        <div className="form-group">
                                            <label>Social Security Number (Last 4 digits)</label>
                                            <input type="password" placeholder="••••" maxLength="4" required />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn-submit" disabled={isProcessing}>
                                {isProcessing ? 'Processing Payment...' : 'Confirm & Pay'}
                            </button>
                        </form>
                    </div>

                    {/* Right Col: Order Summary */}
                    <div className="checkout-summary reveal">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="trip-preview">
                                <span style={{ fontSize: '3rem' }}>🌴</span>
                                <div>
                                    <h4>Tropical Maldives Getaway</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>7 Days, 6 Nights</p>
                                </div>
                            </div>
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>$1,200.00</span>
                            </div>
                            <div className="summary-line">
                                <span>Taxes & Fees</span>
                                <span>$50.00</span>
                            </div>
                            <div className="summary-line total-line">
                                <span>Total</span>
                                <span>$1,250.00</span>
                            </div>

                            <div className="secure-badge">
                                🔒 Secure 256-bit Encrypted Checkout
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
