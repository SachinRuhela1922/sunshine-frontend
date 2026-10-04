import { Link } from 'react-router-dom';
import { useContent } from '../content.jsx';
import { NAV } from './Navbar.jsx';
import { opt } from '../img.js';
import { fmtDate } from '../utils.js';
import styles from './Footer.module.css';

const ICONS = {
  facebook: <path d="M14 8.5V7c0-.8.2-1.3 1.4-1.3H17V3h-2.4C12 3 10.8 4.5 10.8 6.8V8.5H8.5V11.5h2.3V21H14v-9.5h2.6l.4-3H14z" fill="currentColor" stroke="none" />,
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.8" fill="currentColor" /></>),
  youtube: (<><rect x="2.5" y="6" width="19" height="12" rx="4" /><path d="M10.2 9.5v5l4.3-2.5z" fill="currentColor" /></>),
};
const SOCIAL = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube']];

function LinkList({ title, items }) {
  return (
    <nav className={styles.col} aria-label={title}>
      <h3>{title}</h3>
      <ul>{items.map(([to, label]) => <li key={to + label}><Link to={to}>{label}</Link></li>)}</ul>
    </nav>
  );
}

export default function Footer() {
  const { data } = useContent();
  const g = data.general;
  const year = new Date().getFullYear();
  const soc = SOCIAL.filter(([k]) => g[k]);
  const programs = (data.programs || []).slice(0, 6).map((p) => ['/programs', p.title]);
  if (!programs.length) programs.push(['/programs', 'Our programs']);
  const phoneLink = (g.phone || '').replace(/[^\d+]/g, '');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              {g.logo
                ? <img src={opt(g.logo, 120)} alt="" width="36" height="36" loading="lazy" style={{ height: 36, width: "auto", borderRadius: 8, objectFit: "contain" }} />
                : <span className={styles.sun} aria-hidden="true" />}
              {g.schoolName}
            </Link>
            <p>{g.tagline}</p>
            <p style={{ marginTop: 8, fontSize: '0.85rem', opacity: 0.75 }}>Established {fmtDate(g.established)}</p>
            {soc.length > 0 && (
              <ul className={styles.social} aria-label="Social media">
                {soc.map(([k, n]) => (
                  <li key={k}>
                    <a href={g[k]} target="_blank" rel="noreferrer" aria-label={n}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[k]}</svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <LinkList title="Quick links" items={NAV.slice(0, 5)} />
          <LinkList title="Explore" items={NAV.slice(5)} />
          <LinkList title="Programs" items={programs} />

          <div className={styles.col}>
            <h3>Contact</h3>
            <ul className={styles.contact}>
              {g.address && <li>{g.address}</li>}
              {g.phone && <li><a href={`tel:${phoneLink}`}>{g.phone}</a></li>}
              {g.email && <li><a href={`mailto:${g.email}`}>{g.email}</a></li>}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} {g.schoolName}. All rights reserved.</p>
          <ul>
            <li><Link to="/contact">Contact us</Link></li>
            <li><a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
