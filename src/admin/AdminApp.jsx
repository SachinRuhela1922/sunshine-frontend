import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken } from '../api.js';
import { SCHEMA } from './schema.js';
import { Fields, ListEditor } from './Fields.jsx';
import Enquiries from './Enquiries.jsx';
import SocialStatus from './SocialStatus.jsx';
import './admin.css';

const EXTRA = { enquiries: 'Contact Messages', socialstatus: 'Social Feed Status' };

function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault();
    try { const r = await api('/api/login', { method: 'POST', body: { username: u, password: p } }); localStorage.setItem('admin_token', r.token); onLogin(); }
    catch (x) { setErr(x.message); }
  }
  return (
    <div className="a-login">
      <form className="a-box" onSubmit={submit}>
        <h2>Admin Login</h2>
        <input placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} />
        <input type="password" placeholder="Password" value={p} onChange={(e) => setP(e.target.value)} />
        <button className="save">Login</button>
        {err && <p className="err">{err}</p>}
      </form>
    </div>
  );
}

function Panel({ onLogout }) {
  const [data, setData] = useState(null);
  const [cur, setCur] = useState(SCHEMA[0].key);
  const [msg, setMsg] = useState('');
  const toast = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500); };
  const refresh = () => setData((d) => ({ ...d }));

  useEffect(() => { api('/api/content').then(setData).catch((e) => toast(e.message)); }, []);
  if (!data) return <p style={{ padding: 20 }}>Loading...</p>;

  const s = SCHEMA.find((x) => x.key === cur);
  const isExtra = !!EXTRA[cur];
  async function save() {
    try { await api('/api/content', { method: 'PUT', body: data, auth: true }); toast('Saved! Website updated.'); }
    catch (e) { toast(e.message); }
  }

  let body;
  if (cur === 'enquiries') body = <Enquiries toast={toast} />;
  else if (cur === 'socialstatus') body = <SocialStatus />;
  else if (s.multi) {
    data.pages = data.pages || {};
    body = s.multi.map(([k, t]) => {
      data.pages[k] = data.pages[k] || {};
      return <div className="item" key={k}><div className="item-head">{t} Page</div><Fields obj={data.pages[k]} fields={s.fields} refresh={refresh} /></div>;
    });
  } else if (s.list) {
    data[s.key] = data[s.key] || [];
    body = <ListEditor arr={data[s.key]} s={s} refresh={refresh} toast={toast} />;
  } else {
    data[s.key] = data[s.key] || {};
    body = <Fields obj={data[s.key]} fields={s.fields} refresh={refresh} />;
  }

  return (
    <div className="a-panel">
      <aside>
        <h3>Admin Panel</h3>
        {[...SCHEMA, ...Object.entries(EXTRA).map(([key, title]) => ({ key, title }))].map((x) => (
          <button key={x.key} className={x.key === cur ? 'on' : ''} onClick={() => setCur(x.key)}>{x.title}</button>
        ))}
        <Link to="/" target="_blank" className="side-link">View Website</Link>
        <button className="side-link" onClick={onLogout}>Logout</button>
      </aside>
      <main>
        <div className="top">
          <h2>{EXTRA[cur] || s.title}</h2>
          {!isExtra && <button className="save" onClick={save}>Save All Changes</button>}
        </div>
        {body}
      </main>
      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(!!getToken());
  useEffect(() => {
    const f = () => setAuthed(false);
    window.addEventListener('admin-logout', f);
    return () => window.removeEventListener('admin-logout', f);
  }, []);
  const logout = () => { localStorage.removeItem('admin_token'); setAuthed(false); };
  return authed ? <Panel onLogout={logout} /> : <Login onLogin={() => setAuthed(true)} />;
}
