import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useContent } from '../content.jsx';
import { opt } from '../img.js';
import styles from './Navbar.module.css';

export const NAV = [
  ['/', 'Home'], ['/about', 'About'], ['/programs', 'Programs'], ['/facilities', 'Facilities'],
  ['/teachers', 'Teachers'], ['/gallery', 'Gallery'], ['/news', 'News'], ['/events', 'Events'], ['/social', 'Social'], ['/contact', 'Contact']
];
const MAIN = NAV.slice(0, 6);
const MORE = NAV.slice(6);

const LOGO_URL = 'https://res.cloudinary.com/dvjpc8yfu/image/upload/v1790916603/logo_vesfdq.png';

export default function Navbar() {
  const { data } = useContent();
  const g = data.general;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoBad, setLogoBad] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const cls = (isActive) => `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link to="/" className={styles.logo} aria-label={`${g.schoolName} home`}>
          {!logoBad && (
            <img
              src={opt(LOGO_URL, 160)}
              alt={`${g.schoolName} logo`}
              className={styles.logoImg}
              width="44"
              height="44"
              decoding="async"
              onError={() => setLogoBad(true)}
            />
          )}
          <span className={styles.brand}>{g.schoolName}</span>
        </Link>

        <ul className={styles.links}>
          {MAIN.map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => cls(isActive)}><span>{label}</span></NavLink>
            </li>
          ))}
          <li className={styles.more}>
            <button type="button" className={styles.moreBtn} aria-haspopup="true">
              More
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4.5l4 4 4-4" /></svg>
            </button>
            <ul className={styles.menu}>
              {MORE.map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} className={({ isActive }) => cls(isActive)}><span>{label}</span></NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <Link to="/contact" className={styles.cta}>Apply for Admission</Link>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <ul>
          {NAV.map(([to, label], i) => (
            <li key={to} style={{ '--i': i }}>
              <NavLink to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? styles.dActive : '')}>{label}</NavLink>
            </li>
          ))}
          <li style={{ '--i': NAV.length }}>
            <Link to="/contact" className={styles.drawerCta} onClick={() => setOpen(false)}>Apply for Admission</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}