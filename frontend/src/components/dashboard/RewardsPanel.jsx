import { useState, useEffect } from 'react';

const BASE = 'http://localhost:8081/api';
const TIERS = [
    { name: 'BRONZE', label: 'Bronze', minPoints: 0, color: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)' },
    { name: 'SILVER', label: 'Silver', minPoints: 5000, color: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)' },
    { name: 'GOLD', label: 'Gold', minPoints: 10000, color: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' },
    { name: 'PLATINUM', label: 'Platinum', minPoints: 20000, color: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }
];

const RewardsPanel = () => {
    const [points, setPoints] = useState(0);
    const [tier, setTier] = useState('BRONZE');
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) return;
        fetch(`${BASE}/auth/users/${userId}/tier`)
            .then(res => res.json())
            .then(data => {
                setPoints(data.starPoints || 0);
                setTier(data.memberTier || 'BRONZE');
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching tier:', err);
                setLoading(false);
            });
    }, [userId]);

    const getTierInfo = (currentPoints) => {
        let currentTier = TIERS[0];
        let nextTier = TIERS[1];

        for (let i = 0; i < TIERS.length; i++) {
            if (currentPoints >= TIERS[i].minPoints) {
                currentTier = TIERS[i];
                nextTier = TIERS[i + 1] || null;
            }
        }

        const pointsToNext = nextTier ? nextTier.minPoints - currentPoints : 0;

        let progressPercentage = 100;
        if (nextTier) {
            const pointsInCurrentTier = currentPoints - currentTier.minPoints;
            const tierRange = nextTier.minPoints - currentTier.minPoints;
            progressPercentage = (pointsInCurrentTier / tierRange) * 100;
        }

        return { currentTier, nextTier, pointsToNext, progressPercentage };
    };

    const { currentTier, nextTier, pointsToNext, progressPercentage } = getTierInfo(points);

    const earnPoints = async (amount, serviceName) => {
        if (!userId) {
            alert('User not logged in');
            return;
        }
        try {
            const res = await fetch(`${BASE}/auth/users/${userId}/points`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points: amount }),
            });
            const data = await res.json();
            if (res.ok) {
                setPoints(data.starPoints);
                setTier(data.memberTier);
                alert(`Success! You earned ${amount} points for your ${serviceName}.`);
            }
        } catch (err) {
            console.error('Error earning points:', err);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading rewards data...</div>;

    return (
        <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="panel-title">Rewards & Loyalty</h2>
            </div>

            {/* Status Card */}
            <div style={{ background: currentTier.color, color: 'white', borderRadius: '12px', padding: '30px', marginBottom: '30px', position: 'relative', overflow: 'hidden', transition: 'background 0.5s ease' }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '5px', color: '#ffffff' }}>{currentTier.name} Member</h3>
                        <p style={{ opacity: 0.9, color: '#ffffff', margin: 0 }}>Enjoy exclusive perks and discounts on travel.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff' }}>{points.toLocaleString()}</span>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, color: '#ffffff' }}>Available Points</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '30px', position: 'relative', zIndex: 1 }}>
                    {nextTier ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#ffffff' }}>
                                <span>Current: {currentTier.name}</span>
                                <span>{pointsToNext.toLocaleString()} points to {nextTier.name}</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'white', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff' }}>
                            🎉 You have reached the highest tier! Check back for new rewards.
                        </div>
                    )}
                </div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
            </div>

            {/* Earn Points Simulation */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#0f172a' }}>Earn Star Points</h3>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>Use platform services to gather points and automatically upgrade your tier.</p>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <button onClick={() => earnPoints(500, 'Hotel Booking')} className="btn btn-outline-dark" style={{ padding: '10px 20px' }}>
                    🏨 Book a Hotel (+500 pts)
                </button>
                <button onClick={() => earnPoints(1200, 'Flight Booking')} className="btn btn-outline-dark" style={{ padding: '10px 20px' }}>
                    ✈️ Book a Flight (+1200 pts)
                </button>
                <button onClick={() => earnPoints(150, 'Ride')} className="btn btn-outline-dark" style={{ padding: '10px 20px' }}>
                    🚕 Take a Ride (+150 pts)
                </button>
            </div>

            {/* Redemption Options */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0f172a' }}>Redeem Points</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="reward-item">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✈️</div>
                    <h4 style={{ marginBottom: '10px' }}>Free Domestic Flight</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>10,000 Points</p>
                    <button className="btn btn-outline-dark" style={{ width: '100%' }}>Redeem</button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="reward-item">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏨</div>
                    <h4 style={{ marginBottom: '10px' }}>1 Night Luxury Hotel</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>8,500 Points</p>
                    <button className="btn btn-outline-dark" style={{ width: '100%' }}>Redeem</button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="reward-item">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚕</div>
                    <h4 style={{ marginBottom: '10px' }}>Airport Transfer</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>2,000 Points</p>
                    <button className="btn btn-outline-dark" style={{ width: '100%' }}>Redeem</button>
                </div>

            </div>
        </div>
    );
};

export default RewardsPanel;
