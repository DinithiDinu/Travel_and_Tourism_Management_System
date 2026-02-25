import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TopWave from '../../components/layout/TopWave';
import './ContactPage.css';

/* ─── Scroll Reveal ─────────────────────────────────────── */
function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('revealed');
                        observer.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        const els = ref.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ─── Initial Form State ────────────────────────────────── */
const INITIAL = { name: '', email: '', subject: '', message: '' };

/* ─── Page ──────────────────────────────────────────────── */
const ContactPage = () => {
    const pageRef = useScrollReveal();
    const [form, setForm] = useState(INITIAL);
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // TODO: replace with your real API call, e.g.:
        // await api.post('/contact', form);
        await new Promise((res) => setTimeout(res, 1200)); // simulate network
        setStatus('sent');
        setForm(INITIAL);
    };

    return (
        <div ref={pageRef}>
            <Navbar badge="Guest" />

            {/* Page Header */}
            <header className="contact-page-header" style={{ position: 'relative' }}>
                <div className="container">
                    <h1 className="section-title">Contact Us</h1>
                    <p className="section-subtitle">We&rsquo;d love to hear from you. Plan your trip today.</p>
                </div>
                <div style={{ color: '#fff' }}>
                    <TopWave />
                </div>
            </header>

            {/* Contact Form Section */}
            <section className="contact-section section">
                <div className="container">
                    <div className="contact-form-container reveal">

                        {status === 'sent' ? (
                            <div className="success-message">
                                <div className="success-icon">✓</div>
                                <h2>Message Sent!</h2>
                                <p>Thanks for reaching out. We&rsquo;ll get back to you within 24 hours.</p>
                                <button className="btn-submit" onClick={() => setStatus('idle')}>
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Your Name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'sending'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'sending'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="Inquiry about..."
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'sending'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="How can we help you?"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'sending'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;
