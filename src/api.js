export const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export const getToken = () => localStorage.getItem('admin_token');

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = 'Bearer ' + getToken();
  let payload = body;
  if (body && !(body instanceof FormData)) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const r = await fetch(BASE + path, { method, headers, body: payload });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && auth) { localStorage.removeItem('admin_token'); window.dispatchEvent(new Event('admin-logout')); }
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}
