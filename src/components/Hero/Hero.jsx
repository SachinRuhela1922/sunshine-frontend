import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { opt } from '../../img.js';
import { useContent } from '../../content.jsx';
import styles from './Hero.module.css';

// Right-side floating photos come from the admin data (gallery, about, programs, facilities...).
function pickPhotos(d) {
  const pool = [
    ...(d.gallery || []).map((g) => ({ src: g.image, label: g.caption })),
    ...(d.facilities || []).map((f) => ({ src: f.image, label: f.title })),
    ...(d.programs || []).map((p) => ({ src: p.image, label: p.title })),
    { src: d.about?.image, label: d.about?.title },
    { src: d.hero?.poster, label: d.general?.schoolName },
  ].filter((p) => p.src);
  const seen = new Set();
  return pool.filter((p) => !seen.has(p.src) && seen.add(p.src)).slice(0, 3);
}

export default function Hero() {
  const { data: d } = useContent();
  const h = d.hero || {};
  const photos = pickPhotos(d);
  const stats = (d.stats || []).slice(0, 3);
  const y = new Date().getFullYear();
  const vref = useRef(null);
  // video plays only while the hero is visible (smoother scrolling lower down)
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, [h.video]);

  return (
    <section className={styles.hero}>
      {h.video && (
        <video
          ref={vref}
          className={styles.video}
          src={h.video}
          poster={opt(h.poster || photos[0]?.src, 1400)}
          autoPlay muted loop playsInline preload="metadata" aria-hidden="true"
        />
      )}
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <i className={styles.dot} /> {d.home?.admissionText || `Admissions open for ${y}-${String((y + 1) % 100).padStart(2, '0')}`}
          </span>

          <h1 className={styles.title}>{h.title}</h1>
          {h.subtitle && <p className={styles.text}>{h.subtitle}</p>}

          <div className={styles.actions}>
            <Link to="/contact" className={styles.primary}>{h.ctaText || 'Contact Us'}</Link>
            <Link to="/gallery" className={styles.ghost}>
              <span className={styles.playIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              Take a campus tour
            </Link>
          </div>

          {stats.length > 0 && (
            <ul className={styles.stats}>
              {stats.map((s, i) => (
                <li key={i}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.photos}>
          {photos.map((p, i) => (
            <figure key={p.src} className={`${styles.photo} ${styles[`photo${i + 1}`]}`}>
              <img src={opt(p.src, 700)} alt={p.label || ''} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
              {p.label && <figcaption>{p.label}</figcaption>}
            </figure>
          ))}
        </div>
      </div>

      <a href="#why-sunshine" className={styles.scroll} aria-label="Scroll down"><span /></a>
    </section>
  );
}
