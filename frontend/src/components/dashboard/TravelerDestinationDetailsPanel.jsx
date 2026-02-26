import React from 'react';

// Mirroring the public mock data
const DESTINATIONS_DATA = {
    'sigiriya': {
        title: 'Sigiriya Rock Fortress',
        description: 'The ancient rock fortress and palace ruin surrounded by the remains of an extensive network of gardens, reservoirs, and other structures. A UNESCO World Heritage site and a must-visit for its historical significance and stunning frescoes.',
        image: '/assets/Sigiriya.jpg',
        hotels: [
            { id: '101', name: 'Hotel Sigiriya', price: 120, rating: 4.5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: '102', name: 'Aliya Resort & Spa', price: 180, rating: 4.8, image: 'https://images.unsplash.com/photo-1542314831-c6a420828f41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    },
    'ella': {
        title: 'Ella',
        description: 'A small town in the Badulla District of Uva Province, Sri Lanka. Famous for its tea plantations, the Nine Arch Bridge, and breathtaking views of the Ella Gap. It\'s a haven for nature lovers and hikers.',
        image: '/assets/Ella.jpg',
        hotels: [
            { id: '201', name: '98 Acres Resort', price: 250, rating: 4.9, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: '202', name: 'Mountain Heavens', price: 90, rating: 4.2, image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    },
    'mirissa': {
        title: 'Mirissa',
        description: 'A small town on the south coast of Sri Lanka. Renowned for its beautiful crescent beach, vibrant nightlife, and as one of the best places in the world for whale and dolphin watching.',
        image: '/assets/Mirissa.jpg',
        hotels: [
            { id: '301', name: 'Paradise Beach Club', price: 140, rating: 4.3, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: '302', name: 'Mandara Resort', price: 210, rating: 4.6, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    }
};

const TravelerDestinationDetailsPanel = ({ destinationSlug, onBack, onHotelSelect }) => {

    // Fallback for slugs not in our rich mock data
    const destination = DESTINATIONS_DATA[destinationSlug] || {
        title: destinationSlug.charAt(0).toUpperCase() + destinationSlug.slice(1).replace('-', ' '),
        description: 'Explore the wonders of this beautiful Sri Lankan destination. Uncover hidden gems, local culture, and breathtaking scenery directly from your dashboard.',
        image: 'https://images.unsplash.com/photo-1588258524675-a48a3f89839c?q=80&w=1000&auto=format&fit=crop',
        hotels: [
            { id: `h1-${destinationSlug}`, name: `Luxury Resort ${destinationSlug}`, price: 150, rating: 4.5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: `h2-${destinationSlug}`, name: `Cozy Stay ${destinationSlug}`, price: 85, rating: 4.0, image: 'https://images.unsplash.com/photo-1542314831-c6a420828f41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    };

    return (
        <div>
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
                    &larr; Back to Destinations
                </button>
            </div>

            {/* Destination Hero */}
            <div style={{
                position: 'relative',
                height: '350px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '40px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
                <img
                    src={destination.image}
                    alt={destination.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    padding: '40px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                }}>
                    <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '10px' }}>
                        {destination.title}
                    </h1>
                    <p style={{ color: '#e2e8f0', maxWidth: '800px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {destination.description}
                    </p>
                </div>
            </div>

            {/* Hotels Grid */}
            <div>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '25px', fontFamily: 'var(--font-heading)' }}>
                    Recommended Hotels
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                    {destination.hotels.map(hotel => (
                        <div key={hotel.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onClick={() => onHotelSelect(hotel.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '1.25rem', color: '#1f2937', margin: 0 }}>{hotel.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: '6px' }}>
                                            <span style={{ color: '#d97706', marginRight: '4px', fontSize: '0.8rem' }}>★</span>
                                            <span style={{ fontWeight: '600', color: '#92400e', fontSize: '0.85rem' }}>{hotel.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2px' }}>Starting from</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                            ${hotel.price}<span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/night</span>
                                        </div>
                                    </div>
                                    <button style={{
                                        backgroundColor: '#f1f5f9',
                                        color: 'var(--primary-color)',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}>
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TravelerDestinationDetailsPanel;
