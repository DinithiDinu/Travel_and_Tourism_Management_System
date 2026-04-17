import { useEffect, useState } from 'react';
import api from '../../api';
import './FeaturePanel.css';

const GuideServicesPanel = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.get('/rides/requests');
            setRequests(data || []);
        } catch (e) {
            setError(e.message || 'Failed to load service requests');
        } finally {
            setLoading(false);
        }
    };

    const loadGuides = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await api.get('/rides/providers');
            setGuides(data || []);
        } catch (e) {
            setError(e.message || 'Failed to load guide services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'requests') {
            loadRequests();
        } else if (activeTab === 'guides') {
            loadGuides();
        }
    }, [activeTab]);

    return (
        <div className="fp-root">
            <div className="fp-header">
                <div>
                    <h2 className="fp-title">🗺️ Guide Services</h2>
                    <p className="fp-subtitle">Manage guide requests and service details</p>
                </div>
            </div>

            <div className="fp-tabs">
                <button
                    className={`fp-tab ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    📥 Service Requests
                </button>
                <button
                    className={`fp-tab ${activeTab === 'guides' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guides')}
                >
                    👤 Guide Services
                </button>
            </div>

            {loading ? (
                <div className="fp-loading">
                    <div className="fp-spinner" />
                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div className="fp-error">
                    <span>⚠️ {error}</span>
                </div>
            ) : (
                <div className="fp-table-wrap">
                    {activeTab === 'requests' && (
                        <table className="fp-table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>User ID</th>
                                    <th>Service Type</th>
                                    <th>Pickup Location</th>
                                    <th>Dropoff Location</th>
                                    <th>Status</th>
                                    <th>Request Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="fp-empty">No service requests found</td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.requestId}>
                                            <td>#{req.requestId}</td>
                                            <td>{req.userId ?? '—'}</td>
                                            <td>{req.serviceType || '—'}</td>
                                            <td>{req.pickupLocation || '—'}</td>
                                            <td>{req.dropoffLocation || '—'}</td>
                                            <td>
                                                <span className={`fp-badge fp-badge-${req.status?.toLowerCase()}`}>
                                                    {req.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td>
                                                {req.requestTime
                                                    ? new Date(req.requestTime).toLocaleString()
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'guides' && (
                        <table className="fp-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Guide Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Service Type</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guides.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="fp-empty">No guide services found</td>
                                    </tr>
                                ) : (
                                    guides.map((guide) => (
                                        <tr key={guide.providerId || guide.id}>
                                            <td>#{guide.providerId || guide.id || '—'}</td>
                                            <td>{guide.providerName || guide.name || '—'}</td>
                                            <td>{guide.contactEmail || guide.email || '—'}</td>
                                            <td>{guide.contactPhone || guide.phone || '—'}</td>
                                            <td>{guide.serviceType || guide.serviceCategory || '—'}</td>
                                            <td>{guide.address || '—'}</td>
                                            <td>
                                                <span className={`fp-badge fp-badge-${guide.status?.toLowerCase()}`}>
                                                    {guide.status || 'ACTIVE'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default GuideServicesPanel;