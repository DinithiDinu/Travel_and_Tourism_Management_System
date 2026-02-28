/* ─────────────────────────────────────────────────────────────
   Shared API utility — base URL + helper wrappers
   All components import from this file so the base URL is
   defined in one place.
───────────────────────────────────────────────────────────── */
const BASE = 'http://localhost:8081/api';

async function req(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };
    const res = await fetch(`${BASE}${url}`, { ...options, headers });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const j = await res.json(); msg = j.error || msg; } catch (_) { }
        throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json().catch(() => null);
}

export const api = {
    get: (url) => req(url),
    post: (url, body) => req(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url, body) => req(url, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (url, body) => req(url, { method: 'PATCH', body: JSON.stringify(body) }),
    del: (url) => req(url, { method: 'DELETE' }),
};

export default api;
