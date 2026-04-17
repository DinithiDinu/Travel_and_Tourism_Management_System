import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import { useEffect, useState } from 'react';

// Mock Hotel Database
const HOTELS_DATA = {
    '101': { name: 'Hotel Sigiriya', price: 120, location: 'Sigiriya', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', description: 'Experience luxury next to the ancient rock fortress with an infinity pool overlooking the monument.', amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'] },
    '102': { name: 'Aliya Resort & Spa', price: 180, location: 'Sigiriya', image: 'https://images.unsplash.com/photo-1542314831-c6a420828f41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', description: 'Elephants, nature, and pure relaxation in the heart of the cultural triangle.', amenities: ['Free WiFi', 'Pool', 'Fitness Center', 'Bar'] },
    '201': { name: '98 Acres Resort', price: 250, location: 'Ella', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', description: 'An elegant, chic hotel that stands on a scenic 98 acre tea estate, surrounded by stunning landscapes.', amenities: ['Scenic Views', 'Free WiFi', 'Spa', 'Helipad'] },
    '202': { name: 'Mountain Heavens', price: 90, location: 'Ella', image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', description: 'Cozy retreat with breathtaking views of the Ella Gap.', amenities: ['Mountain View', 'Free WiFi', 'Restaurant'] },
    '301': { name: 'Paradise Beach Club', price: 140, location: 'Mirissa', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', description: 'Step straight from your room onto the golden sands of Mirissa beach.', amenities: ['Beachfront', 'Pool', 'Surf Lessons'] },
    '302': { name: 'Mandara Resort', price: 210, location: 'Mirissa', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', description: 'A luxurious coastal hideaway offering unparalleled tropical relaxation.', amenities: ['Private Beach', 'Spa', 'Fine Dining'] },
};

const HotelDetailsPage = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Fallback for dynamic/generated IDs from DestinationDetailsPage
        setHotel(HOTELS_DATA[hotelId] || {
            name: `Premium Hotel ${hotelId}`,
            price: 150,
            location: 'Sri Lanka',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            description: 'A beautiful luxury stay designed to offer the ultimate comfort and convenience during your vacation.',
            amenities: ['Free WiFi', 'Swimming Pool', 'Air Conditioning', 'Room Service', 'Airport Shuttle']
        });
    }, [hotelId]);

    if (!hotel) return null;

    return (
        <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar badge="Guest" />

            {/* Header Content pushed below navbar */}
            <div style={{ paddingTop: '100px', flex: 1 }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

                    {/* Breadcrumb Navigation */}
                    <div style={{ marginBottom: '20px', color: '#64748b', fontSize: '0.95rem' }}>
                        <Link to="/destinations" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Destinations</Link>
                        <span style={{ margin: '0 10px' }}>/</span>
                        <Link to={`/destinations/${hotel.location.toLowerCase()}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>{hotel.location}</Link>
                        <span style={{ margin: '0 10px' }}>/</span>
                        <span style={{ color: '#0f172a' }}>{hotel.name}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start', paddingBottom: '60px' }}>

                        {/* Left Column: Hotel Details */}
                        <div>
                            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: '#0f172a', marginBottom: '5px' }}>
                                {hotel.name}
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px' }}>📍</span> {hotel.location}, Sri Lanka
                            </p>

                            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
                                <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }} />
                            </div>

                            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '20px' }}>About this Property</h2>
                                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                                    {hotel.description}
                                </p>

                                <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '15px' }}>Popular Amenities</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    {hotel.amenities.map((amenity, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', color: '#475569', fontSize: '1.05rem' }}>
                                            <span style={{ color: 'var(--primary-color)', marginRight: '10px' }}>✓</span> {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', position: 'sticky', top: '120px' }}>
                            <div style={{ marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>${hotel.price}</span>
                                    <span style={{ color: '#64748b', marginLeft: '5px', fontSize: '1.1rem' }}>/ night</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <span style={{ color: '#fbbf24', fontSize: '1.2rem', marginRight: '5px' }}>★★★★☆</span>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>(128 reviews)</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Check-in</label>
                                        <input type="date" style={{ width: '100%', border: 'none', outline: 'none', color: '#0f172a', marginTop: '5px', fontFamily: 'inherit' }} defaultValue="2024-05-15" />
                                    </div>
                                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Check-out</label>
                                        <input type="date" style={{ width: '100%', border: 'none', outline: 'none', color: '#0f172a', marginTop: '5px', fontFamily: 'inherit' }} defaultValue="2024-05-20" />
                                    </div>
                                </div>
                                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Guests</label>
                                    <select style={{ width: '100%', border: 'none', outline: 'none', color: '#0f172a', marginTop: '5px', fontFamily: 'inherit', backgroundColor: 'transparent' }}>
                                        <option>2 Adults, 0 Children</option>
                                        <option>1 Adult, 0 Children</option>
                                        <option>2 Adults, 1 Child</option>
                                        <option>2 Adults, 2 Children</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                                    <span>${hotel.price} x 5 nights</span>
                                    <span>${hotel.price * 5}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#475569' }}>
                                    <span>Taxes and fees</span>
                                    <span>$85</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid #e2e8f0', fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>
                                    <span>Total</span>
                                    <span>${(hotel.price * 5) + 85}</span>
                                </div>
                            </div>

                            {/* Book Now Button routing to Checkout! */}
                            <Link to={`/checkout?hotelId=${hotel.id}`} style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'none', transition: 'background-color 0.2s, transform 0.2s', boxShadow: '0 4px 12px rgba(0, 137, 123, 0.3)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}>
                                Book Now
                            </Link>

                            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '15px' }}>
                                You won't be charged yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HotelDetailsPage;
