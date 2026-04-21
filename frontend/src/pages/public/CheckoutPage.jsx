import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../api';
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
    const location = useLocation();
    const bookingDetails = location.state || {}; // tripId, title, totalAmount, adults, children, date, image

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // Fallback if accessed directly without data
    useEffect(() => {
        if (!bookingDetails.tripId && !bookingDetails.totalAmount) {
            // navigate('/dashboard/traveler'); // Or show error
        }
    }, [bookingDetails, navigate]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            // Simulate API/Gateway processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const loggedInUserId = Number(localStorage.getItem("userId"));

            // Call the same booking API previously in the details panel
            await api.post('/bookings', {
                userId: loggedInUserId,
                tripId: bookingDetails.tripId,
                numberOfPeople: (bookingDetails.adults || 0) + (bookingDetails.children || 0),
                totalAmount: bookingDetails.totalAmount,
                specialRequests: `Date Selected: ${bookingDetails.date}\nAdults: ${bookingDetails.adults}, Children: ${bookingDetails.children}\nPayment Method: ${paymentMethod.toUpperCase()}`
            });

            alert('Payment successful! Your trip is booked.');
            navigate('/dashboard/traveler');
        } catch (err) {
            alert('Payment processed, but failed to save booking: ' + (err.message || 'Server error'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div ref={pageRef} className="checkout-page">
            <Navbar badge="Traveler" solid />
            
            <div className="checkout-app-header">
                <div className="container">
                    <div className="breadcrumb">
                        <span onClick={() => navigate('/dashboard/traveler')} style={{ cursor: 'pointer' }}>Dashboard</span>
                        <span className="separator" style={{ margin: '0 10px', color: '#94a3b8' }}>&rsaquo;</span>
                        <span className="active" style={{ color: '#0f172a', fontWeight: '600' }}>Checkout</span>
                    </div>
                    <h1 className="checkout-app-title">Secure Checkout</h1>
                </div>
            </div>

            <section className="checkout-section section">
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>

                    {/* Left Col: Form */}
                    <div className="checkout-form-container reveal">
                        <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Payment Details</h2>
                        <form onSubmit={handleCheckout}>

                            <div className="payment-methods">
                                <label className="payment-method-card active">
                                    <input type="radio" name="payment" value="card" checked readOnly />
                                    <div className="method-info">
                                        <span className="icon">💳</span>
                                        <span>Credit / Debit Card</span>
                                    </div>
                                </label>
                            </div>

                            <div className="payment-details-form">
                                <div className="card-fields">
                                    <div className="form-group">
                                        <label>Name on Card</label>
                                        <input type="text" placeholder="John Doe" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" maxLength="16" required />
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
                                <div style={{ fontSize: '2.5rem', marginRight: '15px' }}>🌴</div>
                                <div>
                                    <h4>{bookingDetails.title || 'Trip Package'}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        {bookingDetails.date ? `Date: ${bookingDetails.date}` : ''}
                                        {bookingDetails.adults ? ` • ${bookingDetails.adults} Adults` : ''}
                                        {bookingDetails.children ? ` • ${bookingDetails.children} Children` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="summary-line">
                                <span>Package Price</span>
                                <span>LKR {(bookingDetails.totalAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="summary-line">
                                <span>Service Fee</span>
                                <span>LKR 0.00</span>
                            </div>
                            <div className="summary-line total-line">
                                <span>Total (LKR)</span>
                                <span>LKR {(bookingDetails.totalAmount || 0).toLocaleString()}</span>
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
