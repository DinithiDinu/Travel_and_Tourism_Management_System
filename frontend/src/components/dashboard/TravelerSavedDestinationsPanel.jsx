import React, { useState, useEffect } from 'react';
import api from '../../api';

const TravelerSavedDestinationsPanel = ({ savedDestinations = [], onExplore, onToggleSave }) => {
    const [savedTrips, setSavedTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedTrips = async () => {
            if (savedDestinations.length === 0) {
                setSavedTrips([]);
                setLoading(false);
                return;
            }
            try {
                const data = await api.get('/bookings/trips');
                const filtered = (data || []).filter(t => savedDestinations.includes(t.id));
                setSavedTrips(filtered);
            } catch (err) {
                console.error("Error fetching trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedTrips();
    }, [savedDestinations]);

    return (
        <div>
            <div className="panel-header">
                <h2 className="panel-title">Saved Trips</h2>
                <p style={{ color: '#64748b', marginTop: '5px' }}>
                    Trips you've liked and want to book later.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading saved trips...</div>
            ) : savedTrips.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>You haven't saved any trips yet.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '25px',
                    marginTop: '30px'
                }}>
                    {savedTrips.map((trip) => (
                        <div key={trip.id} style={{
                            backgroundColor: 'var(--white)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                            }}>
                            <div style={{ position: 'relative', height: '220px' }}>
                                <img
                                    src={trip.coverImage || trip.imageUrl || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3'}
                                    alt={trip.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    color: 'var(--primary-color)',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    {trip.category}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onToggleSave) onToggleSave(trip.id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        background: 'rgba(255,255,255,0.9)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s',
                                        zIndex: 2
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    aria-label="Remove from saved trips"
                                >
                                    <span style={{ color: '#ef4444', fontSize: '1.2rem', lineHeight: 1 }}>❤️</span>
                                </button>
                            </div>

                            <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 10px 0' }}>
                                    {trip.title}
                                </h3>
                                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px', flex: 1 }}>
                                    {trip.description}
                                </p>
                                
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748b' }}>
                                    <span>📍 {trip.destination || trip.location}</span>
                                    <span>⏱ {trip.durationDays} days</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Price per person</span>
                                        <span style={{ fontWeight: 800, color: '#0d9488', fontSize: '1.1rem' }}>
                                            {trip.currency || 'LKR'} {Number(trip.price || 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => onExplore(trip.id)}
                                        style={{
                                            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                            border: 'none',
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            color: 'white',
                                            transition: 'transform 0.2s',
                                            fontSize: '0.9rem'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        Explorer details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TravelerSavedDestinationsPanel;
