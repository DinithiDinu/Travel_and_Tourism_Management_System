import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopWave from '../../components/layout/TopWave';
import './FAQPage.css';

const FAQ_DATA = [
    {
        id: 1,
        question: "How do I book a tour?",
        answer: "Simply navigate to our Destinations or Packages page, choose your preferred itinerary, and click 'Book Now'. You can also contact our support team directly for customized, flexible itineraries tailored specifically to your group's needs."
    },
    {
        id: 2,
        question: "Are your guides licensed?",
        answer: "Yes, absolutely. All our guides are fully licensed by the Sri Lanka Tourism Development Authority (SLTDA). They are highly experienced locals who possess deep knowledge of the island's history, culture, and hidden gems."
    },
    {
        id: 3,
        question: "Can I cancel my booking?",
        answer: "Yes, we offer flexible cancellation policies. Cancellations made 30 days prior to the start of the tour receive a full refund. Cancellations made within 14-30 days receive a 50% refund. Please refer to our full Terms of Service for highly specific details."
    },
    {
        id: 4,
        question: "Is travel insurance included?",
        answer: "Basic local vehicle insurance is included for all transportation Services. However, comprehensive personal travel and medical insurance is not included. We strongly recommend purchasing your own travel insurance before your trip to cover unforeseen circumstances."
    },
    {
        id: 5,
        question: "What is the best time to visit Sri Lanka?",
        answer: "Sri Lanka is a year-round destination! The best time depends on where you want to go. The West and South coasts are best from December to March, while the East coast is perfect from May to September. The cultural triangle is generally good year-round."
    },
    {
        id: 6,
        question: "Do I need a visa to enter Sri Lanka?",
        answer: "Yes, most nationalities require an Electronic Travel Authorization (ETA) to enter Sri Lanka for tourism purposes. You can easily apply for this online through the official government portal before your arrival. The process is quick and straightforward."
    }
];

const FaqItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-page-item ${open ? 'open' : ''}`}>
            <button className="faq-page-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                <span>{question}</span>
                <span className="faq-page-toggle">{open ? '×' : '+'}</span>
            </button>
            <div className="faq-page-answer" aria-hidden={!open}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

const FAQPage = () => {
    return (
        <div className="faq-page">
            <header className="faq-page-header">
                <TopWave fill="#ffffff" />
                <div className="container">
                    <Link to="/" className="back-to-home-link" style={{ display: 'inline-block', marginBottom: '2rem', color: '#00897b', textDecoration: 'none', fontWeight: 600 }}>
                        &larr; Back to Home
                    </Link>
                    <h1 className="section-title">Frequently Asked Questions</h1>
                    <p className="section-subtitle">Everything you need to know about traveling with us.</p>
                </div>
            </header>

            <main className="faq-page-content">
                <div className="container">
                    <div className="faq-page-container">
                        <div className="faq-page-list">
                            {FAQ_DATA.map((faq) => (
                                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>

                        <div className="faq-contact-cta">
                            <h3>Still have questions?</h3>
                            <p>Can't find the answer you're looking for? Please chat to our friendly team.</p>
                            <a href="/contact" className="btn btn-primary">Contact Support</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FAQPage;
