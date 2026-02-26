import { useState } from 'react';

const RewardsPanel = () => {
    // Mock user points and tier data
    const points = 15400;
    const tier = 'Gold';
    const nextTier = 'Platinum';
    const pointsToNext = 4600;

    return (
        <div>
            <div className="panel-header">
                <h2 className="panel-title">Rewards & Loyalty</h2>
            </div>

            {/* Status Card */}
            <div style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: 'white', borderRadius: '12px', padding: '30px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '5px' }}>{tier} Member</h3>
                        <p style={{ opacity: 0.9 }}>Enjoy exclusive perks and discounts on travel.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{points.toLocaleString()}</span>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Available Points</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '30px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                        <span>Current: {tier}</span>
                        <span>{pointsToNext.toLocaleString()} points to {nextTier}</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(points / (points + pointsToNext)) * 100}%`, height: '100%', background: 'white', borderRadius: '4px' }}></div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 0 }}></div>
            </div>

            {/* Redemption Options */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-color)' }}>Redeem Points</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="reward-item">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✈️</div>
                    <h4 style={{ marginBottom: '10px' }}>Free Domestic Flight</h4>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '15px' }}>10,000 Points</p>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Redeem</button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="reward-item">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏨</div>
                    <h4 style={{ marginBottom: '10px' }}>1 Night Luxury Hotel</h4>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '15px' }}>8,500 Points</p>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Redeem</button>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="reward-item">
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚕</div>
                    <h4 style={{ marginBottom: '10px' }}>Airport Transfer</h4>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '15px' }}>2,000 Points</p>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Redeem</button>
                </div>

            </div>
        </div>
    );
};

export default RewardsPanel;
