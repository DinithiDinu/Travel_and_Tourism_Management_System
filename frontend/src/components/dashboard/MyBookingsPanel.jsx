import { useState, useEffect } from 'react';
import api from '../../api';

const statusStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'PAID' || s === 'COMPLETED')
        return { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', label: 'Paid & Confirmed' };
    if (s === 'CONFIRMED')
        return { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', label: 'Confirmed (Payment Pending)' };
    if (s === 'PENDING')
        return { bg: '#fefce8', border: '#fde68a', color: '#b45309', label: 'Pending Admin Approval' };
    if (s === 'CANCELLED')
        return { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', label: 'Cancelled' };
    return { bg: '#f1f5f9', border: '#e2e8f0', color: '#475569', label: status || 'Unknown' };
};

const MyBookingsPanel = ({ onNewTrip, onPayBooking }) => {
    const [bookings, setBookings] = useState([]);
    const [trips, setTrips] = useState({});
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) { setLoading(false); return; }

        const fetchData = async () => {
            try {
                // Fetch user's trip bookings and all trips to map the titles
                const [bData, tData] = await Promise.all([
                    api.get(`/bookings/user/${userId}`),
                    api.get('/bookings/trips')
                ]);

                // Create a trip dictionary for quick lookup O(1)
                const tripMap = {};
                if (Array.isArray(tData)) {
                    tData.forEach(t => tripMap[t.id] = t);
                }
                setTrips(tripMap);

                // Sort by newest first
                const sorted = (bData || []).sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0));
                setBookings(sorted);
            } catch (err) {
                console.error('Failed to fetch bookings data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            Loading your bookings...
        </div>
    );

    if (bookings.length === 0) return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="panel-title">My Bookings</h2>
                <button className="btn btn-primary btn-sm" onClick={onNewTrip}>+ Book a Trip</button>
            </div>
            <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧳</div>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>You have no upcoming trips yet.<br />Start exploring and plan your dream adventure!</p>
                <button className="btn btn-primary" onClick={onNewTrip} style={{ marginTop: '20px' }}>Explore Trips →</button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="panel-title">My Bookings</h2>
                <button className="btn btn-primary btn-sm" onClick={onNewTrip}>+ Book new Trip</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map(b => {
                    const st = statusStyle(b.status);
                    const isOpen = expanded === b.bookingId;
                    const trip = trips[b.tripId] || { title: 'Unknown Trip', location: 'Unknown', durationDays: '?' };
                    
                    return (
                        <div key={b.bookingId} style={{
                            background: '#fff', borderRadius: '16px',
                            border: '1px solid #e2e8f0', overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s'
                        }}>
                            {/* Summary row */}
                            <div
                                style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}
                                onMouseEnter={e => e.currentTarget.parentElement.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                                onMouseLeave={e => e.currentTarget.parentElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
                            >
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.8rem', flexShrink: 0, cursor: 'pointer'
                                }} onClick={() => setExpanded(isOpen ? null : b.bookingId)}>
                                    🗺️
                                </div>

                                <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : b.bookingId)}>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>
                                        {trip.title}
                                    </h3>
                                    <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '0.88rem' }}>
                                        📍 {trip.destination || trip.location}
                                        {trip.durationDays && <span style={{ marginLeft: '12px' }}>⏱ {trip.durationDays} Days</span>}
                                    </p>
                                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>👥 {b.numberOfPeople} Visitors</span>
                                        {b.bookingDate && <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>📅 Requested: {new Date(b.bookingDate).toLocaleDateString()}</span>}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                                        {b.totalAmount ? `LKR ${Number(b.totalAmount).toLocaleString()}` : 'TBC'}
                                    </div>
                                    <span style={{
                                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                                        fontSize: '0.78rem', fontWeight: '600',
                                        background: st.bg, border: `1px solid ${st.border}`, color: st.color
                                    }}>{st.label}</span>
                                    
                                    {b.status === 'CONFIRMED' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onPayBooking && onPayBooking(b.bookingId); }}
                                            style={{
                                                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                                border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.8rem',
                                                padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', marginTop: '4px',
                                                boxShadow: '0 2px 4px rgba(13, 148, 136, 0.3)', transition: 'transform 0.1s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Securely Pay Now →
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Expanded detail grid */}
                            {isOpen && (
                                <div style={{
                                    borderTop: '1px solid #f1f5f9', padding: '20px 24px',
                                    background: '#f8fafc',
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px'
                                }}>
                                    <Detail icon="🗺️" label="Trip Plan" value={trip.title} />
                                    <Detail icon="📍" label="Destination" value={trip.destination || trip.location} />
                                    <Detail icon="👥" label="Travelers" value={`${b.numberOfPeople} Person(s)`} />
                                    <Detail icon="📅" label="Departure Date" value={trip.startDate || 'Flexible Date'} />
                                    <Detail icon="💰" label="Total Quoted" value={b.totalAmount ? `LKR ${Number(b.totalAmount).toLocaleString()}` : 'Pending Quote'} />
                                    <Detail icon="🎟️" label="Booking Ref" value={`TRIP-${b.bookingId}`} />
                                    
                                    {b.specialRequests && <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Special Requests</span>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#334155' }}>{b.specialRequests}</p>
                                    </div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Detail = ({ icon, label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {icon} {label}
        </span>
        <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: '500' }}>{value}</span>
    </div>
);

export default MyBookingsPanel;
