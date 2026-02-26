import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import { useEffect, useState } from 'react';

// Mock Data Source - Ideally this lives in a centralized store/API
const DESTINATIONS_DATA = {
    'sigiriya': {
        title: 'Sigiriya Rock Fortress',
        description: 'The ancient rock fortress and palace ruin surrounded by the remains of an extensive network of gardens, reservoirs, and other structures.',
        image: '/assets/Sigiriya.jpg',
        hotels: [
            { id: '101', name: 'Hotel Sigiriya', price: 120, rating: 4.5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: '102', name: 'Aliya Resort & Spa', price: 180, rating: 4.8, image: 'https://images.unsplash.com/photo-1542314831-c6a420828f41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    },
    'ella': {
        title: 'Ella',
        description: 'A small town in the Badulla District of Uva Province, Sri Lanka governed by an Urban Council.',
        image: '/assets/Ella.jpg',
        hotels: [
            { id: '201', name: '98 Acres Resort', price: 250, rating: 4.9, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: '202', name: 'Mountain Heavens', price: 90, rating: 4.2, image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    },
    'mirissa': {
        title: 'Mirissa',
        description: 'A small town on the south coast of Sri Lanka, located in the Matara District of the Southern Province.',
        image: '/assets/Mirissa.jpg',
        hotels: [
            { id: '301', name: 'Paradise Beach Club', price: 140, rating: 4.3, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { id: '302', name: 'Mandara Resort', price: 210, rating: 4.6, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ]
    }
};

const DestinationDetailsPage = () => {
    const { slug } = useParams();
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Fallback for slugs not in our rich mock data
        setDestination(DESTINATIONS_DATA[slug] || {
            title: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
            description: 'Explore the wonders of this beautiful Sri Lankan destination. Uncover hidden gems, local culture, and breathtaking scenery.',
            image: 'https://images.unsplash.com/photo-1588258524675-a48a3f89839c?q=80&w=1000&auto=format&fit=crop',
            hotels: [
                { id: `h1-${slug}`, name: `Luxury Resort ${slug}`, price: 150, rating: 4.5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                { id: `h2-${slug}`, name: `Cozy Stay ${slug}`, price: 85, rating: 4.0, image: 'https://images.unsplash.com/photo-1542314831-c6a420828f41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ]
        });
    }, [slug]);

    if (!destination) return null;

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar badge="Guest" />

            {/* Hero Section */}
            <div style={{ position: 'relative', height: '60vh', marginTop: '70px', overflow: 'hidden' }}>
                <img
                    src={destination.image}
                    alt={destination.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '0 20px' }}>
                    <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', textShadow: '2px 2px 8px rgba(0,0,0,0.5)', marginBottom: '1rem' }}>
                        {destination.title}
                    </h1>
                    <p style={{ maxWidth: '800px', fontSize: '1.2rem', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                        {destination.description}
                    </p>
                </div>
            </div>

            <TopWave />

            {/* Content Section - Hotels */}
            <div className="container" style={{ padding: '60px 20px', flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#111827', marginBottom: '10px' }}>
                        Where to Stay near {destination.title}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                        Handpicked accommodations to make your trip unforgettable.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                    {destination.hotels.map(hotel => (
                        <div key={hotel.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)';
                            }}
                        >
                            <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            <div style={{ padding: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h3 style={{ fontSize: '1.4rem', color: '#1f2937', margin: 0 }}>{hotel.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '8px' }}>
                                        <span style={{ color: '#fbbf24', marginRight: '4px' }}>★</span>
                                        <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>{hotel.rating}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                    <div>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${hotel.price}</span>
                                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}> / night</span>
                                    </div>
                                    <Link to={`/hotel/${hotel.id}`} style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.2s' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DestinationDetailsPage;
