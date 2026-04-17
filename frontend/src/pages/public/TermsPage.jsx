import React from 'react';
import { Link } from 'react-router-dom';
import TopWave from '../../components/layout/TopWave';
import './LegalPage.css';

const TermsPage = () => {
    return (
        <div className="legal-page">
            <header className="legal-page-header">
                <TopWave fill="#ffffff" />
                <div className="container">
                    <Link to="/" className="back-to-home-link" style={{ display: 'inline-block', marginBottom: '2rem', color: '#00897b', textDecoration: 'none', fontWeight: 600 }}>
                        &larr; Back to Home
                    </Link>
                    <h1 className="section-title">Terms of Service</h1>
                    <p className="section-subtitle">Last updated: February 2026</p>
                </div>
            </header>

            <main className="legal-page-content">
                <div className="container legal-container">
                    <section>
                        <h2>1. Agreement to Terms</h2>
                        <p>
                            These Terms of Service constitute a legally binding agreement made between you, whether
                            personally or on behalf of an entity ("you") and <strong>SriLankaTravel</strong> ("Company", "we", "us", or "our"),
                            concerning your access to and use of our website as well as any other media form, media
                            channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                        </p>
                        <p>
                            You agree that by accessing the Site, you have read, understood, and agreed to be bound by
                            all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE,
                            THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND MUST DISCONTINUE USE IMMEDIATELY.
                        </p>
                    </section>

                    <section>
                        <h2>2. Travel Bookings and Payments</h2>
                        <p>
                            All bookings and reservations facilitated through our platform are subject to availability and the specific
                            terms and conditions of the selected vendors, hotels, or transport providers.
                        </p>
                        <ul>
                            <li><strong>Deposits:</strong> A non-refundable deposit of 30% is typically required to secure a booking, unless stated otherwise.</li>
                            <li><strong>Final Payment:</strong> The remaining balance is due 30 days prior to the arrival or start date of the tour.</li>
                            <li><strong>Pricing:</strong> All prices are subject to change without notice due to currency fluctuations, supplier price increases, or tax changes, until the booking is confirmed and full payment is received.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Cancellations and Refunds</h2>
                        <p>
                            We understand that plans can change. Our cancellation policies are designed to be as flexible as possible while being fair to our local service providers.
                        </p>
                        <ul>
                            <li>Cancellations received 30 days or more before the tour start date will receive a full refund, minus any non-refundable deposit components (like pre-booked flights or non-refundable hotel rates).</li>
                            <li>Cancellations received between 15 and 29 days will incur a 50% cancellation fee.</li>
                            <li>Cancellations received within 14 days of the start date are generally non-refundable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Liability and Insurance</h2>
                        <p>
                            We act solely as an agent for the various independent suppliers that provide hotel accommodations, transportation, sightseeing, activities, or other services connected with your itinerary. Such services are subject to the terms and conditions of those suppliers.
                        </p>
                        <p>
                            <strong>SriLankaTravel</strong> is not liable for any injury, damage, loss, accident, delay, or irregularity that may be caused by the defect of any vehicle or negligence or default of any company or person engaged in conveying the passenger or carrying out the arrangements of the tour.
                        </p>
                        <p>
                            <strong>We strongly advise all travelers to purchase comprehensive travel insurance.</strong>
                        </p>
                    </section>

                </div>
            </main >
        </div >
    );
};

export default TermsPage;
