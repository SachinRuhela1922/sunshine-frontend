import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken } from '../api.js';
import { SCHEMA } from './schema.js';
import { Fields, ListEditor } from './Fields.jsx';
import Enquiries from './Enquiries.jsx';
import SocialStatus from './SocialStatus.jsx';
import './admin.css';

const EXTRA = { enquiries: 'Contact Messages', socialstatus: 'Social Feed Status' };

/* ---------- Display only: how the sidebar is grouped (no effect on data / saving) ----------
   Any schema item that is not listed here is added automatically under "More",
   so a newly added section never disappears from the admin. */
const NAV = [
  { title: 'Website', color: '#94a3b8', groups: [{ keys: ['general'] }] },
  { title: 'Home page', color: '#f59e0b', groups: [
    { name: 'Banner & texts', keys: ['hero', 'home', 'whyFeatures', 'stats', 'testimonials'] },
    { name: 'Leadership', keys: ['leadershipInfo', 'leadership'] },
    { name: 'Campus', keys: ['campusFacts', 'campusDay'] },
    { name: 'Little Achievers', keys: ['tally', 'spotlight', 'achievers', 'recognitions'] },
    { name: 'Visit School', keys: ['visitHours', 'visitReach', 'visitSteps', 'visitBring', 'visitFaqs'] },
  ] },
  { title: 'Other pages', color: '#38bdf8', groups: [{ keys: ['pages', 'about', 'programs', 'facilities', 'teachers', 'gallery', 'news', 'events'] }] },
  { title: 'Inbox & Social', color: '#34d399', groups: [{ keys: ['enquiries', 'socialstatus'] }] },
];

/* one line under each heading: what this part changes on the website */
const DESC = {
  general: 'School name, logo, contact details and social links. Used in the header, footer and contact page.',
  hero: 'The first banner of the Home page: headline, button text and background video.',
  home: 'Small texts and subtitles shown above the Home page sections.',
  whyFeatures: 'The four cards of the "Why Sunshine" section on the Home page.',
  stats: 'Number counters such as students, teachers and years of excellence.',
  testimonials: 'Parent and student reviews shown on the website.',
  leadershipInfo: 'Heading and short intro of the Leadership section on the Home page.',
  leadership: 'Director, Principal and Vice Principal. Each one opens a detail popup on the website.',
  campusFacts: 'Quick numbers about the campus (area, labs, classrooms) in the Campus section.',
  campusDay: 'Hour-by-hour timeline of a normal day at school.',
  tally: 'Medal counters at the top of the Little Achievers section.',
  spotlight: 'The big featured card: Achiever of the Year.',
  achievers: 'Student achievement cards with medal, level and category.',
  recognitions: 'Special awards given by the school.',
  visitHours: 'Weekly timings. The website also shows whether the school is open right now.',
  visitReach: 'Ways to reach the school: by road, rail, bus and so on.',
  visitSteps: 'Steps a visitor follows when coming to the school.',
  visitBring: 'Checklist of things visitors should bring.',
  visitFaqs: 'Frequently asked questions about visiting the school.',
  pages: 'Title, subtitle and banner image shown at the top of every page.',
  about: 'Content of the About page: story, image, mission and vision.',
  programs: 'Programs shown on the Programs page.',
  facilities: 'Facilities shown on the Facilities page.',
  teachers: 'Teacher photos and names shown on the Teachers page.',
  gallery: 'Photos of the Gallery page. You can upload many at once.',
  news: 'News posts shown on the News page.',
  events: 'Events shown on the Events page.',
  enquiries: 'Messages sent through the website contact form.',
  socialstatus: 'Check whether the Instagram and Facebook feeds are connected.',
};

const ALL = [...SCHEMA, ...Object.entries(EXTRA).map(([key, title]) => ({ key, title }))];
const BY_KEY = Object.fromEntries(ALL.map((x) => [x.key, x]));
const clean = (t) => String(t || '').replace(/^[^-]+ - /, ''); // "Home - Hero Section" -> "Hero Section"

const SECTIONS = (() => {
  const nav = NAV.map((s) => ({ ...s, groups: s.groups.map((g) => ({ ...g, keys: g.keys.filter((k) => BY_KEY[k]) })).filter((g) => g.keys.length) })).filter((s) => s.groups.length);
  const used = new Set(nav.flatMap((s) => s.groups.flatMap((g) => g.keys)));
  const rest = ALL.map((x) => x.key).filter((k) => !used.has(k));
  return rest.length ? [...nav, { title: 'More', color: '#a78bfa', groups: [{ keys: rest }] }] : nav;
})();

function where(key) {
  for (const sec of SECTIONS) for (const grp of sec.groups) if (grp.keys.includes(key)) return { sec, grp };
  return { sec: SECTIONS[0], grp: SECTIONS[0].groups[0] };
}

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
        <p className="a-sub">Sign in to manage your school website.</p>
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
  if (!data) return <div className="a-loading"><span className="spin" /> Loading...</div>;

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
    body = <div className="item"><Fields obj={data[s.key]} fields={s.fields} refresh={refresh} /></div>;
  }

  const { sec, grp } = where(cur);

  return (
    <div className="a-panel">
      <aside>
        <div className="side-brand">
          <span className="brand-mark" aria-hidden="true" />
          <div><h3>Admin Panel</h3><small>Manage your website</small></div>
        </div>
        <nav className="side-nav">
          {SECTIONS.map((section) => (
            <div className="side-section" key={section.title} style={{ '--dot': section.color }}>
              <p className="side-label">{section.title}</p>
              {section.groups.map((g, gi) => (
                <div className="side-group" key={gi}>
                  {g.name && <p className="side-sub">{g.name}</p>}
                  {g.keys.map((k) => (
                    <button key={k} className={k === cur ? 'on' : ''} onClick={() => setCur(k)}>{clean(BY_KEY[k].title)}</button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-foot">
          <Link to="/" target="_blank" className="side-link">View Website</Link>
          <button className="side-link" onClick={onLogout}>Logout</button>
        </div>
      </aside>
      <main>
        <div className="page-head">
          <p className="crumb">{sec.title}{grp.name && <><i>&rsaquo;</i>{grp.name}</>}</p>
          <h2>{clean(EXTRA[cur] || s.title)}</h2>
          {DESC[cur] && <p className="desc">{DESC[cur]}</p>}
        </div>
        {!isExtra && (
          <div className="top">
            <span className="top-hint">Edit the fields below, then click Save to update the website.</span>
            <button className="save" onClick={save}>Save All Changes</button>
          </div>
        )}
        <div className="panel-body" key={cur}>{body}</div>
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
