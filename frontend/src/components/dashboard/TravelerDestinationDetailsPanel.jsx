import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const TravelerDestinationDetailsPanel = ({ destinationSlug, onBack }) => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [booking, setBooking] = useState(false);
    
    // Booking Widget State
    const [bookingDate, setBookingDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [childrenCount, setChildrenCount] = useState(0);
    
    const navigate = useNavigate();
    const loggedInUserId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const data = await api.get(`/bookings/trips/${destinationSlug}`);
                setTrip(data);
                if (data && data.startDate) {
                    setBookingDate(data.startDate);
                }
            } catch (err) {
                console.error("Error fetching trip details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTripDetails();
    }, [destinationSlug]);

    useEffect(() => {

        if (!trip) return;
        
        fetch(`http://localhost:8081/api/feedback/target?targetType=TRIP&targetId=${trip.id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err) => console.error("Error fetching reviews:", err));
    }, [trip]);

    const handleDeleteReview = async (feedbackId) => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;
        try {
            await fetch(`http://localhost:8081/api/feedback/${feedbackId}`, { method: "DELETE" });
            setReviews((prev) => prev.filter((review) => review.feedbackId !== feedbackId));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleBookTripSubmit = async () => {
        if (!bookingDate) {
            alert('Please select a date for your trip.');
            return;
        }
        
        if (adults + childrenCount === 0) {
            alert('Please select at least 1 guest.');
            return;
        }
        
        setBooking(true);
        try {
            // Using a simple algorithm for children if your backend supports it, otherwise default to base price
            const adultTotal = adults * (trip.price || 0);
            const childTotal = childrenCount * (trip.childPrice ? trip.childPrice : (trip.price * 0.5 || 0));
            const calculatedTotal = adultTotal + childTotal;
            
            await api.post('/bookings', {
                userId: loggedInUserId,
                tripId: trip.id,
                numberOfPeople: adults + childrenCount,
                totalAmount: calculatedTotal,
                specialRequests: `Date Selected: ${bookingDate}\nAdults: ${adults}, Children: ${childrenCount}`
            });
            alert('Trip booked successfully! You can view the status in the My Bookings tab.');
            onBack();
        } catch (e) {
            alert('Failed to book trip: ' + e.message);
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading trip details...</div>;
    }

    if (!trip) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                Trip not found. <button onClick={onBack} style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}>Go Back</button>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : null;

    const adultTotal = adults * (trip.price || 0);
    const childTotal = childrenCount * (trip.childPrice ? trip.childPrice : (trip.price * 0.5 || 0));
    const finalTotal = adultTotal + childTotal;

    return (
        <div>
            {/* Header / Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', fontSize: '1rem', padding: '8px 16px',
                        borderRadius: '8px', transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    &larr; Back to Trips
                </button>
            </div>

            {/* Destination Hero */}
            <div style={{
                position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden',
                marginBottom: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
                <img
                    src={trip.coverImage || trip.imageUrl || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000'}
                    alt={trip.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
                />
                <div style={{
                    position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '40px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)'
                }}>
                    <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px', display: 'inline-block' }}>
                        {trip.category || 'Trip'}
                    </span>
                    <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'white', margin: '0 0 10px 0', lineHeight: 1.1 }}>
                        {trip.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '20px', color: '#e2e8f0', fontSize: '1.1rem', marginTop: '10px' }}>
                        <span>📍 {trip.destination || trip.location}</span>
                        <span>⏱ {trip.durationDays} Days</span>
                        {trip.startDate && <span>📅 Starts {trip.startDate}</span>}
                    </div>
                </div>
            </div>

            {/* Trip Extended Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '40px', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
                        About This Trip
                    </h2>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {trip.longDescription || trip.description || 'No detailed description provided for this trip.'}
                    </p>

                    {trip.itinerary && trip.itinerary.length > 0 && (
                        <div style={{ marginTop: '40px' }}>
                            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Day-by-Day Itinerary</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {trip.itinerary.map((day, idx) => (
                                    <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                                        <h4 style={{ color: 'var(--primary-color)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Day {idx + 1}: {day.title}</h4>
                                        {day.location && <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>📍 {day.location}</p>}
                                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{day.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* Beautiful Booking Card Widget */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
                            <div style={{ backgroundColor: '#edf5ff', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.4rem' }}>Booking Details</h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Contact us for pricing and availability</p>
                            </div>
                            
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', color: '#334155', marginBottom: '10px' }}>
                                        <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📅</span> Select Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        style={{ 
                                            width: '100%', padding: '14px', borderRadius: '8px', 
                                            border: '1px solid #cbd5e1', fontSize: '1rem', 
                                            color: '#0f172a', outline: 'none', boxSizing: 'border-box'
                                        }} 
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
                                        <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>👥</span> Guests
                                    </label>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', color: '#0f172a' }}>Adults</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Age 18+</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <button 
                                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}
                                            >-</button>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{adults}</span>
                                            <button 
                                                onClick={() => setAdults(adults + 1)}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}
                                            >+</button>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', color: '#0f172a' }}>Children</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Age 0-17</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <button 
                                                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}
                                            >-</button>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{childrenCount}</span>
                                            <button 
                                                onClick={() => setChildrenCount(childrenCount + 1)}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}
                                            >+</button>
                                        </div>
                                    </div>
                                    
                                    {trip.price && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '1.1rem', color: '#334155' }}>Total Request Value</span>
                                            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a' }}>
                                                ${finalTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={handleBookTripSubmit}
                                        disabled={booking}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                            color: 'white', border: 'none', padding: '16px', borderRadius: '12px',
                                            fontSize: '1.1rem', fontWeight: '700', cursor: booking ? 'not-allowed' : 'pointer',
                                            opacity: booking ? 0.7 : 1, transition: 'transform 0.2s',
                                            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
                                        }}
                                        onMouseEnter={(e) => { if(!booking) e.currentTarget.style.transform = 'translateY(-2px)' }}
                                        onMouseLeave={(e) => { if(!booking) e.currentTarget.style.transform = 'translateY(0)' }}
                                    >
                                        {booking ? 'Submitting...' : 'Request Booking ➔'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Existing Amenities Sidebar */}
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 20px 0' }}>Trip Amenities</h3>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#059669', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>✓</span> What's Included
                                </h4>
                                {trip.includedItems && trip.includedItems.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                                        {trip.includedItems.map((item, i) => <li key={i} style={{ marginBottom: '6px' }}>• {item}</li>)}
                                    </ul>
                                ) : <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Not specified</span>}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#ef4444', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>✕</span> What's Excluded
                                </h4>
                                {trip.excludedItems && trip.excludedItems.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                                        {trip.excludedItems.map((item, i) => <li key={i} style={{ marginBottom: '6px' }}>• {item}</li>)}
                                    </ul>
                                ) : <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Not specified</span>}
                            </div>

                            {trip.cancellationPolicy && (
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #cbd5e1' }}>
                                    <h4 style={{ color: '#0f172a', margin: '0 0 10px 0', fontSize: '1rem' }}>Cancellation Policy</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                                        {trip.cancellationPolicy}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Traveler Reviews Section */}
            <div style={{ marginTop: '50px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
                    Traveler Reviews
                </h2>

                /* Average Rating Display */
                <div style={{ marginBottom: "16px", color: "#475569", fontWeight: "600" }}>
                {reviews.length > 0
                   ? `Average Rating: ${averageRating} / 5 (${reviews.length} review${reviews.length > 1 ? "s" : ""})`
                  : "No ratings yet"}
                </div>

                {reviews.length === 0 ? (
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                        No reviews yet for this trip. Be the first traveler to share your experience!
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {reviews.map((review) => (
                            // Existing review code... (condensed logic identical)
                            <div key={review.feedbackId} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.1rem' }}>{review.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ color: '#d97706', fontWeight: '700' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                        {loggedInUserId === review.userId && (
                                            <div style={{ position: 'relative' }}>
                                                <button type="button" onClick={() => setOpenMenuId(openMenuId === review.feedbackId ? null : review.feedbackId)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#475569' }}>⋮</button>
                                                {openMenuId === review.feedbackId && (
                                                    <div style={{ position: 'absolute', top: '34px', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', minWidth: '150px', zIndex: 10 }}>
                                                        <button onClick={() => {
                                                                      setOpenMenuId(null);
                                                                       navigate("/dashboard/traveler", {
                                                                        state: {
                                                                         activePanel: "myFeedback",
                                                                          editFeedbackId: review.feedbackId,
                                                                        },
                                                                              });
                                                                   }} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: '#fff', cursor: 'pointer' }}>Edit in My Feedback</button>
                                                        <button onClick={() => handleDeleteReview(review.feedbackId)} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: '#fff', cursor: 'pointer', color: '#b91c1c' }}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p style={{ marginBottom: '10px', color: '#475569', lineHeight: '1.6' }}>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerDestinationDetailsPanel;
