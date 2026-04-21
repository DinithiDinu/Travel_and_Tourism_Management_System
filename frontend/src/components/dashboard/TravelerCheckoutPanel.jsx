import { useState, useEffect } from 'react';
import '../../pages/public/CheckoutPage.css';
import { generateAndDownloadReceipt } from '../../utils/receiptGenerator';
import api from '../../api';

const HOTELS_DATA = {
    '101': { name: 'Hotel Sigiriya', price: 120, location: 'Sigiriya' },
    '102': { name: 'Aliya Resort & Spa', price: 180, location: 'Sigiriya' },
    '201': { name: '98 Acres Resort', price: 250, location: 'Ella' },
    '202': { name: 'Mountain Heavens', price: 90, location: 'Ella' },
    '301': { name: 'Paradise Beach Club', price: 140, location: 'Mirissa' },
    '302': { name: 'Mandara Resort', price: 210, location: 'Mirissa' },
};

const TravelerCheckoutPanel = ({ hotelId, bookingId, onBack, onCheckoutComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('new');
    const [loadingCards, setLoadingCards] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
    const [enteredCvv, setEnteredCvv] = useState('');
    const [errors, setErrors] = useState({});

    // Pricing dependencies
    const [userTier, setUserTier] = useState('BRONZE');
    const [pointsBalance, setPointsBalance] = useState(0);
    const [offers, setOffers] = useState([]);
    const [usePoints, setUsePoints] = useState(false);

    // Dynamic Trip Data
    const [bookingData, setBookingData] = useState(null);
    const [tripData, setTripData] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            setLoadingCards(true);
            fetch(`http://localhost:8081/api/pricing/saved-cards/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setSavedCards(data);
                    if (data.length > 0) {
                        const defaultCard = data.find(c => c.isDefault);
                        setSelectedCardId(defaultCard ? defaultCard.cardId.toString() : data[0].cardId.toString());
                    }
                    setLoadingCards(false);
                })
                .catch(err => {
                    console.error("Failed to fetch saved cards:", err);
                    setLoadingCards(false);
                });

            // Fetch User Tier
            fetch(`http://localhost:8081/api/auth/users/${userId}/tier`)
                .then(res => res.json())
                .then(data => {
                    setUserTier(data.memberTier || 'BRONZE');
                    setPointsBalance(data.starPoints || 0);
                })
                .catch(err => console.error("Failed to fetch user tier:", err));

            // Fetch Rate Adjustments
            api.get('/pricing/tier-offers')
                .then(data => setOffers(data || []))
                .catch(err => console.error("Failed to fetch pricing offers:", err));
        }

        if (bookingId) {
            api.get(`/bookings/${bookingId}`).then(b => {
                setBookingData(b);
                if (b && b.tripId) {
                    api.get(`/bookings/trips/${b.tripId}`).then(t => setTripData(t));
                }
            }).catch(e => console.error("Failed to fetch booking details", e));
        }

    }, [bookingId]);

    const isTripBooking = !!bookingId;
    const itemName = isTripBooking ? (tripData?.title || 'Trip Booking') : (HOTELS_DATA[hotelId]?.name || 'Premium Hotel');
    const itemLocation = isTripBooking ? (tripData?.destination || tripData?.location || 'Sri Lanka') : (HOTELS_DATA[hotelId]?.location || 'Sri Lanka');
    const durationStr = isTripBooking ? `${tripData?.durationDays || 0} Days` : `5 Nights`;
    const iconStr = isTripBooking ? '🧳' : '🏨';

    const rawSubtotal = isTripBooking ? (bookingData?.totalAmount || 0) : (HOTELS_DATA[hotelId]?.price * 5 || 750);
    const TAXES_AND_FEES = isTripBooking ? 0 : 85; 

    let activeDiscount = null;
    let maxDiscountPercent = 0;

    offers.forEach(offer => {
        if (offer.active) {
            const isLoyaltyTarget = offer.targetTier === 'LOYALTY' && userTier !== 'BRONZE';
            if (offer.targetTier === 'ALL' || offer.targetTier === userTier || isLoyaltyTarget) {
                if (offer.discountPercentage > maxDiscountPercent) {
                    activeDiscount = offer;
                    maxDiscountPercent = offer.discountPercentage;
                }
            }
        }
    });

    const discountAmount = activeDiscount ? Math.round(rawSubtotal * (activeDiscount.discountPercentage / 100) * 100) / 100 : 0;
    const TOTAL = rawSubtotal + TAXES_AND_FEES - discountAmount;

    // Platinum Point Redemption
    const requiredPoints = Math.ceil(TOTAL * 0.5); 
    const minBalanceRequired = 20000 + requiredPoints;
    const FINAL_TOTAL = usePoints ? 0 : TOTAL;

    const validateCheckoutForm = () => {
        if (usePoints) return true;
        const newErrors = {};

        if (paymentMethod === 'card') {
            if (selectedCardId === 'new') {
                if (!cardDetails.name.trim()) newErrors.name = "Name is required";
                const cleanNumber = cardDetails.number.replace(/\D/g, '');
                if (cleanNumber.length !== 16) newErrors.number = "Must be 16 digits";

                const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
                if (!expiryRegex.test(cardDetails.expiry)) {
                    newErrors.expiry = "Use MM/YY format";
                } else {
                    const [, month, year] = cardDetails.expiry.match(expiryRegex);
                    const now = new Date();
                    const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
                    const currentMonth = now.getMonth() + 1;
                    const expYear = parseInt(year, 10);
                    const expMonth = parseInt(month, 10);
                    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                        newErrors.expiry = "Card has expired";
                    }
                }
                if (!/^\d{3,4}$/.test(cardDetails.cvc)) newErrors.cvc = "Must be 3-4 digits";
            } else {
                if (!enteredCvv) {
                    newErrors.enteredCvv = "CVV is required to confirm payment";
                } else {
                    const selected = savedCards.find(c => c.cardId.toString() === selectedCardId);
                    if (selected && enteredCvv !== selected.cvv) newErrors.enteredCvv = "Incorrect CVV";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!validateCheckoutForm()) return;
        setIsProcessing(true);

        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) {
                alert("You must be logged in to complete checkout.");
                setIsProcessing(false);
                return;
            }

            if (usePoints) {
                if (pointsBalance < minBalanceRequired) {
                    alert('Not enough Star Points to safely cover this booking without dropping below Platinum status.');
                    setIsProcessing(false);
                    return;
                }
                const redeemRes = await fetch(`http://localhost:8081/api/auth/users/${userId}/redeem`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ points: requiredPoints })
                });
                if (!redeemRes.ok) {
                    alert('Failed to redeem points');
                    setIsProcessing(false); return;
                }
            }

            const payload = {
                userId: parseInt(userId, 10),
                amount: FINAL_TOTAL,
                paymentMethod: usePoints ? 'STAR_POINTS' : paymentMethod.toUpperCase(),
                bookingId: isTripBooking ? null : null, // keep backward compat or set it
                packageId: null
            };

            const res = await fetch(`http://localhost:8081/api/pricing/payments/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                if (isTripBooking) {
                    await api.patch(`/bookings/${bookingId}/status`, { status: 'PAID' });
                } else {
                    const paymentData = await res.json().catch(() => ({}));
                    const checkInDate = new Date().toISOString().split('T')[0];
                    const checkOutDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    await fetch('http://localhost:8081/api/bookings/hotel-bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            userId: parseInt(userId, 10), paymentId: paymentData.paymentId || null,
                            hotelId: hotelId, hotelName: itemName, location: itemLocation, nights: 5,
                            checkIn: checkInDate, checkOut: checkOutDate, amount: FINAL_TOTAL,
                            paymentMethod: usePoints ? 'Star Points' : 'Credit / Debit', status: 'CONFIRMED'
                        })
                    }).catch(e => console.error('Failed to save hotel booking', e));
                }

                if (!usePoints && paymentMethod === 'card' && selectedCardId === 'new') {
                    let type = 'Visa'; let color = '#1A1F71';
                    if (cardDetails.number.startsWith('5')) { type = 'Mastercard'; color = '#EB001B'; }
                    else if (cardDetails.number.startsWith('3')) { type = 'Amex'; color = '#002663'; }

                    await fetch(`http://localhost:8081/api/pricing/saved-cards`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                            userId: parseInt(userId, 10), cardName: cardDetails.name, cardNumberLast4: cardDetails.number.slice(-4) || '****',
                            expiryDate: cardDetails.expiry, cvv: cardDetails.cvc, cardType: type, brandColor: color, isDefault: savedCards.length === 0
                        })
                    }).catch(e => console.error("Failed to save card", e));
                }

                generateAndDownloadReceipt({
                    description: `Booking: ${itemName} (${durationStr})`,
                    amount: FINAL_TOTAL, method: usePoints ? 'Star Points' : 'Credit / Debit', status: 'Completed',
                    subItems: [
                        { label: `${itemName} Booking`, amount: rawSubtotal },
                        activeDiscount ? { label: `Discount: ${activeDiscount.offerName}`, amount: -discountAmount } : null,
                        TAXES_AND_FEES > 0 ? { label: 'Taxes & Fees', amount: TAXES_AND_FEES } : null,
                        usePoints ? { label: 'Star Points Redeemed', amount: -TOTAL } : null
                    ].filter(Boolean)
                });

                alert(`Payment successful! Your trip to ${itemName} is confirmed. Star Points have been added to your profile!`);
                onCheckoutComplete();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(`Payment failed: ${errData.error || res.statusText}`);
            }
        } catch (error) {
            console.error("Payment error", error);
            alert("An error occurred while processing your payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="checkout-page" style={{ padding: 0, minHeight: 'auto', background: 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem', padding: '8px 16px', borderRadius: '8px', transition: 'background-color 0.2s', marginRight: '15px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    &larr; Back
                </button>
                <h1 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>Secure Checkout</h1>
            </div>

            <section className="checkout-section">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '40px', alignItems: 'start' }}>
                    <div className="checkout-form-container" style={{ margin: 0, padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ marginBottom: '20px', color: 'var(--primary, #0f766e)', fontSize: '1.5rem' }}>Payment Details</h2>
                        <form onSubmit={handleCheckout}>
                            <div className="payment-details-form" style={{ marginTop: '10px' }}>
                                {paymentMethod === 'card' && (
                                    <div className="card-fields">
                                        {loadingCards ? (
                                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading saved cards...</p>
                                        ) : savedCards.length > 0 && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '10px' }}>Select Payment Method</label>
                                                {savedCards.map(c => (
                                                    <div key={c.cardId} style={{ marginBottom: '10px' }}>
                                                        <label style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', border: selectedCardId === c.cardId.toString() ? '1px solid var(--primary)' : '1px solid #e2e8f0', borderRadius: selectedCardId === c.cardId.toString() ? '8px 8px 0 0' : '8px', cursor: 'pointer', background: selectedCardId === c.cardId.toString() ? '#f0fdf4' : 'white', margin: 0 }}>
                                                            <input type="radio" name="savedCard" value={c.cardId.toString()} checked={selectedCardId === c.cardId.toString()} onChange={(e) => { setSelectedCardId(e.target.value); setEnteredCvv(''); setErrors({ ...errors, enteredCvv: '' }); }} style={{ marginRight: '15px' }} />
                                                            <div>
                                                                <div style={{ fontWeight: '500', color: '#0f172a' }}>{c.cardType} ending in {c.cardNumberLast4}</div>
                                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Expires {c.expiryDate} {c.isDefault && <span style={{ color: '#047857', fontWeight: '500', marginLeft: '8px' }}>(Default)</span>}</div>
                                                            </div>
                                                        </label>
                                                        {selectedCardId === c.cardId.toString() && (
                                                            <div style={{ padding: '15px 16px 15px 45px', background: '#f8fafc', border: '1px solid var(--primary)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                                                                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>Confirm CVV</label>
                                                                <input type="password" maxLength="4" placeholder="***" value={enteredCvv} onChange={e => { setEnteredCvv(e.target.value); setErrors({ ...errors, enteredCvv: '' }); }} style={{ width: '80px', padding: '8px', border: errors.enteredCvv ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }} />
                                                                {errors.enteredCvv && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.enteredCvv}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <label style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', border: selectedCardId === 'new' ? '1px solid var(--primary)' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: selectedCardId === 'new' ? '#f0fdf4' : 'white' }}>
                                                    <input type="radio" name="savedCard" value="new" checked={selectedCardId === 'new'} onChange={(e) => { setSelectedCardId(e.target.value); setEnteredCvv(''); setErrors({ ...errors, enteredCvv: '' }); }} style={{ marginRight: '15px' }} />
                                                    <div style={{ fontWeight: '500', color: '#0f172a' }}>Add a new credit / debit card</div>
                                                </label>
                                            </div>
                                        )}

                                        {selectedCardId === 'new' && (
                                            <div style={{ marginTop: savedCards.length > 0 ? '20px' : '0' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Name on Card</label>
                                                    <input type="text" placeholder="John Doe" value={cardDetails.name} onChange={e => { setCardDetails({ ...cardDetails, name: e.target.value }); setErrors({ ...errors, name: '' }) }} style={{ width: '100%', padding: '12px', border: errors.name ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px', outline: 'none' }} />
                                                    {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                                                </div>
                                                <div className="form-group" style={{ marginTop: '15px' }}>
                                                    <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Card Number</label>
                                                    <input type="text" placeholder="0000 0000 0000 0000" maxLength="16" value={cardDetails.number} onChange={e => { setCardDetails({ ...cardDetails, number: e.target.value }); setErrors({ ...errors, number: '' }) }} style={{ width: '100%', padding: '12px', border: errors.number ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px', outline: 'none' }} />
                                                    {errors.number && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.number}</span>}
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Expiry Date</label>
                                                        <input type="text" placeholder="MM/YY" maxLength="5" value={cardDetails.expiry} onChange={e => { setCardDetails({ ...cardDetails, expiry: e.target.value }); setErrors({ ...errors, expiry: '' }) }} style={{ width: '100%', padding: '12px', border: errors.expiry ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px', outline: 'none' }} />
                                                        {errors.expiry && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.expiry}</span>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85rem', color: '#64748b' }}>CVC</label>
                                                        <input type="text" placeholder="123" maxLength="4" value={cardDetails.cvc} onChange={e => { setCardDetails({ ...cardDetails, cvc: e.target.value }); setErrors({ ...errors, cvc: '' }) }} style={{ width: '100%', padding: '12px', border: errors.cvc ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', marginTop: '5px', outline: 'none' }} />
                                                        {errors.cvc && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.cvc}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={isProcessing} style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: isProcessing ? '#94a3b8' : 'var(--primary, #0f766e)', color: 'white', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', marginTop: '30px', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0, 137, 123, 0.3)' }} onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.transform = 'translateY(0)' }}>
                                {isProcessing ? 'Processing Payment...' : (usePoints ? `Pay with Points & Complete` : `Confirm & Pay LKR ${FINAL_TOTAL.toLocaleString()}`)}
                            </button>

                            {!usePoints && (
                                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: '#64748b' }}>
                                    ✨ You will earn <strong>{Math.floor(FINAL_TOTAL / 5)} Star Points</strong> on this booking!
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="checkout-summary" style={{ margin: 0, padding: 0, background: 'transparent', boxShadow: 'none' }}>
                        <div className="summary-card" style={{ borderRadius: '24px', position: 'sticky', top: '20px' }}>
                            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '20px' }}>Order Summary</h3>
                            <div className="trip-preview" style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '2.5rem', marginRight: '15px' }}>{iconStr}</span>
                                <div>
                                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>{itemName}</h4>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{durationStr} in {itemLocation}</p>
                                </div>
                            </div>

                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '0.95rem' }}>
                                    <span>Base Package Price</span>
                                    <span>LKR {rawSubtotal.toLocaleString()}</span>
                                </div>
                                {activeDiscount && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#059669', fontSize: '0.95rem', fontWeight: '500' }}>
                                        <span>Discount: {activeDiscount.offerName}</span>
                                        <span>-LKR {discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                {TAXES_AND_FEES > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.95rem' }}>
                                        <span>Taxes & Fees</span>
                                        <span>LKR {TAXES_AND_FEES.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>Total</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: usePoints ? '#94a3b8' : 'var(--primary-color)', textDecoration: usePoints ? 'line-through' : 'none' }}>LKR {TOTAL.toLocaleString()}</span>
                            </div>

                            {userTier === 'PLATINUM' && (
                                <div style={{ marginBottom: '25px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: '0.95rem' }}>
                                        <span style={{ marginRight: '8px' }}>💎</span> Platinum Benefit
                                    </h4>
                                    <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#64748b' }}>
                                        Cover this booking entirely with Star Points. You need <strong>{requiredPoints.toLocaleString()}</strong> pts.<br />
                                        <span style={{ fontSize: '0.8rem', color: pointsBalance < minBalanceRequired ? '#ef4444' : '#64748b' }}>
                                            Minimum balance required: <strong>{minBalanceRequired.toLocaleString()}</strong> pts<br />
                                            Your balance: {pointsBalance.toLocaleString()} pts
                                        </span>
                                    </p>

                                    <label style={{ display: 'flex', alignItems: 'center', cursor: pointsBalance < minBalanceRequired ? 'not-allowed' : 'pointer', opacity: pointsBalance < minBalanceRequired ? 0.6 : 1 }}>
                                        <input type="checkbox" checked={usePoints}
                                            onChange={(e) => {
                                                if (pointsBalance < minBalanceRequired) {
                                                    alert('You do not have enough Star Points to safely cover this booking without dropping below Platinum status.');
                                                    return;
                                                }
                                                setUsePoints(e.target.checked);
                                            }}
                                            style={{ marginRight: '10px', width: '16px', height: '16px', accentColor: 'var(--primary-color)' }}
                                            disabled={pointsBalance < minBalanceRequired}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0f172a' }}>Pay with Points</span>
                                    </label>
                                </div>
                            )}

                            {usePoints && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '10px 0', borderTop: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>Final Charge</span>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#059669' }}>LKR 0.00</span>
                                </div>
                            )}

                            <div style={{ textAlign: 'center', color: '#047857', fontSize: '0.85rem', fontWeight: '600', padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
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
