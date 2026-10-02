import { Link } from 'react-router-dom';
import { useContent } from '../../content.jsx';
import { CardGrid, infoCard, dateCard } from '../Cards.jsx';
import SocialGrid, { usePosts } from '../SocialFeed.jsx';
import { opt } from '../../img.js';
import styles from './HomeSections.module.css';

// "Latest News" -> "Latest" + accent "News"
function Title({ text }) {
  const w = text.split(' ');
  const last = w.pop();
  return <h2 className={styles.title}>{w.join(' ')} <span className={styles.accent}>{last}</span></h2>;
}

function Frame({ id, title, subtitle, alt, to, children }) {
  return (
    <section id={id} className={`${styles.sec} ${alt ? styles.alt : ''}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Title text={title} />
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
        {children}
        {to && <p className={styles.more}><Link className={styles.btn} to={to}>View all</Link></p>}
      </div>
    </section>
  );
}

export function AboutSection() {
  const { data } = useContent();
  const a = data.about || {};
  return (
    <section id="about" className={`${styles.sec} ${styles.alt}`}>
      <div className={styles.container}>
        <div className={`${styles.about} ${a.image ? '' : styles.noImg}`}>
          {a.image && <img className={styles.aboutImg} src={opt(a.image, 900)} alt="" loading="lazy" decoding="async" />}
          <div className={styles.aboutText}>
            <h2 className={styles.title}>{a.title}</h2>
            <p>{a.text}</p>
            <Link className={styles.btn} to="/about">Read more</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsSection() {
  const { data } = useContent();
  if (!data.news?.length) return null;
  return (
    <Frame id="news" title="Latest News" subtitle="Fresh updates from around our campus." to="/news">
      <CardGrid items={data.news.slice(0, 3)} render={dateCard} />
    </Frame>
  );
}

export function EventsSection() {
  const { data } = useContent();
  if (!data.events?.length) return null;
  return (
    <Frame id="events" title="Upcoming Events" subtitle="Dates worth marking on your calendar." alt to="/events">
      <CardGrid items={data.events.slice(0, 3)} render={dateCard} />
    </Frame>
  );
}

export function SocialSection() {
  const posts = usePosts();
  if (!posts || !posts.length) return null;
  return (
    <Frame id="social" title="From Our Social Media" subtitle="Moments we share on Instagram and Facebook." to="/social">
      <SocialGrid posts={posts} limit={6} />
    </Frame>
  );
}

export function TestimonialsSection() {
  const { data } = useContent();
  const t = data.testimonials || [];
  if (!t.length) return null;
  return (
    <Frame id="testimonials" title="What Parents Say" subtitle="Words from the families who trust us." alt>
      <div className={styles.quotes}>
        {t.map((x, i) => (
          <figure className={styles.quote} key={i} style={{ margin: 0 }}>
            <p>{x.text}</p>
            <b>{x.name}</b>
            <small>{x.role}</small>
          </figure>
        ))}
      </div>
    </Frame>
  );
}
