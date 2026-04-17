import React from 'react';
import { Link } from 'react-router-dom';
import TopWave from '../../components/layout/TopWave';
import './LegalPage.css';

const PrivacyPage = () => {
    return (
        <div className="legal-page">
            <header className="legal-page-header">
                <TopWave fill="#ffffff" />
                <div className="container">
                    <Link to="/" className="back-to-home-link" style={{ display: 'inline-block', marginBottom: '2rem', color: '#00897b', textDecoration: 'none', fontWeight: 600 }}>
                        &larr; Back to Home
                    </Link>
                    <h1 className="section-title">Privacy Policy</h1>
                    <p className="section-subtitle">Last updated: February 2026</p>
                </div>
            </header>

            <main className="legal-page-content">
                <div className="container legal-container">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to <strong>SriLankaTravel</strong> ("Company", "we", "our", "us"). We are committed to
                            protecting your personal information and your right to privacy. If you have any questions or
                            concerns about this privacy notice, or our practices with regards to your personal information,
                            please contact us.
                        </p>
                        <p>
                            When you visit our website and use any of our services, we appreciate that you are trusting
                            us with your personal information. We take your privacy very seriously. In this privacy notice, we
                            seek to explain to you in the clearest way possible what information we collect, how we use it,
                            and what rights you have in relation to it.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <p>
                            We collect personal information that you voluntarily provide to us when you register on the
                            website, express an interest in obtaining information about us or our products and Services,
                            when you participate in activities on the website, or otherwise when you contact us.
                        </p>
                        <ul>
                            <li><strong>Personal Information:</strong> Names; phone numbers; email addresses; mailing addresses; contact preferences; billing addresses; and debit/credit card numbers.</li>
                            <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases.</li>
                            <li><strong>Booking Data:</strong> Travel dates, passport details for reservation purposes, and special accommodation requests.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>
                            We use personal information collected via our website for a variety of business purposes
                            described below. We process your personal information for these purposes in reliance on our
                            legitimate business interests, in order to enter into or perform a contract with you, with your
                            consent, and/or for compliance with our legal obligations.
                        </p>
                        <ul>
                            <li>To facilitate account creation and logon process.</li>
                            <li>To fulfill and manage your bookings and reservations.</li>
                            <li>To send administrative information to you.</li>
                            <li>To respond to user inquiries and offer support.</li>
                            <li>To request feedback and contact you about your use of our website.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Sharing Your Information</h2>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services,
                            to protect your rights, or to fulfill business obligations. This includes sharing details with trusted local partners, such as hotels and certified tour guides, strictly to facilitate your booked itinerary.
                        </p>
                    </section>

                    <section>
                        <h2>5. Contact Us</h2>
                        <p>
                            If you have questions or comments about this notice, you may email us at privacy@srilankatravel.com or contact us via our Contact Support page.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPage;
