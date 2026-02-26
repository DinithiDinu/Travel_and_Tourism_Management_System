import React from 'react';
import { DESTINATIONS } from '../../data/destinations';

const TravelerDestinationsPanel = ({ onExplore, savedDestinations = [], onToggleSave }) => {
    return (
        <div>
            <div className="panel-header">
                <h2 className="panel-title">Explore Destinations</h2>
                <p style={{ color: '#64748b', marginTop: '5px' }}>
                    Discover new places to visit, right from your dashboard.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '25px',
                marginTop: '30px'
            }}>
                {DESTINATIONS.map((dest) => (
                    <div key={dest.id} style={{
                        backgroundColor: 'var(--white)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        border: '1px solid #e2e8f0'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                        }}>
                        <div style={{ position: 'relative', height: '200px' }}>
                            <img
                                src={dest.image}
                                alt={dest.alt}
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
                                {dest.badge}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onToggleSave) onToggleSave(dest.slug);
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
                                    zIndex: 2 // Ensure it's above the image
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                aria-label={savedDestinations.includes(dest.slug) ? "Unsave destination" : "Save destination"}
                            >
                                {savedDestinations.includes(dest.slug) ? (
                                    <span style={{ color: '#ef4444', fontSize: '1.2rem', lineHeight: 1 }}>❤️</span>
                                ) : (
                                    <span style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: 1 }}>🤍</span>
                                )}
                            </button>
                        </div>

                        <div style={{ padding: '25px' }}>
                            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '10px' }}>
                                {dest.title}
                            </h3>
                            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', minHeight: '60px' }}>
                                {dest.description}
                            </p>

                            <button
                                onClick={() => onExplore(dest.slug)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontWeight: '600',
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    fontSize: '1rem'
                                }}
                            >
                                Explorer details <span style={{ marginLeft: '5px' }}>&rarr;</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TravelerDestinationsPanel;
