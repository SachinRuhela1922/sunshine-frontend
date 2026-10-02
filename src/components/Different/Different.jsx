import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../../content.jsx";
import { opt } from "../../img.js";
import styles from "./Different.module.css";

/*
  Apni images Cloudinary se yahan paste karo (image: "https://...").
  Jis card ki image khali hai, usme automatic illustrated gradient panel dikhega.
  Text, points aur stats apne school ke hisaab se badal lo.
*/
const FALLBACK = [
  {
    title: "Smart Classrooms",
    text: "Interactive boards and digital content make every lesson visual and easy to remember.",
    points: ["Interactive smart boards", "Audio-visual lessons", "Digital learning content"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4M7 9l3 2 3-3 3 2" />
      </svg>
    ),
  },
  {
    title: "Practical Learning",
    text: "Labs and projects where children test ideas with their own hands.",
    points: ["Science and maths labs", "Computer lab", "Hands-on projects"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3" />
        <path d="M7.5 15h9" />
      </svg>
    ),
  },
  {
    title: "Activities and Clubs",
    text: "Art, music, dance and drama every week, so every child finds their spark.",
    points: ["Art and craft", "Music and dance", "Drama and debate", "Eco and science clubs"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 100 18c1.4 0 2-.8 2-1.7 0-1.2-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6H17a4 4 0 004-4c0-4.4-4-8-9-8z" />
        <circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" />
      </svg>
    ),
  },
  {
    title: "Library and Reading",
    text: "A bright reading space with age-wise books and weekly story hours.",
    points: ["Age-wise book shelves", "Story hours", "Reading challenges"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5z" />
        <path d="M12 6.5v13" />
      </svg>
    ),
  },
  {
    title: "Sports and Play",
    text: "Open grounds and trained coaches, with a game for every age and energy level.",
    points: ["Cricket, football and athletics", "Yoga and fitness", "Annual sports day"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.5 9.5c3.6 1.2 13.4 1.2 17 0M3.5 14.5c3.6-1.2 13.4-1.2 17 0M12 3c-2.6 3.4-2.6 14.6 0 18" />
      </svg>
    ),
  },
  {
    title: "Parent Connect",
    text: "Regular updates and open doors, so parents are part of the journey.",
    points: ["Parent-teacher meetings", "Progress reports", "Instant updates"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 14.3c3 0 5.5 2.2 5.5 5" />
      </svg>
    ),
  },
  {
    title: "Safe Campus",
    text: "A watched campus, tracked buses and verified staff for complete peace of mind.",
    points: ["CCTV coverage", "GPS-tracked buses", "Verified staff"],
    image: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
    ),
  },
];


/* Card icons, reused in order for facilities that come from the admin panel */
const ICONS = FALLBACK.map((f) => f.icon);

const sentences = (t = "") => t.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);

/* Facilities from the database become the cards. The bento grid is designed for 7 cards,
   so if there are fewer, the remaining slots are filled with the default cards. */
function buildFeatures(facilities = []) {
  const fromData = facilities.slice(0, 7).map((f, i) => {
    const parts = sentences(f.desc);
    return {
      title: f.title,
      text: parts[0] || "",
      points: parts.slice(1, 5),
      image: f.image || "",
      icon: ICONS[i % ICONS.length],
    };
  });
  const used = new Set(fromData.map((f) => f.title.toLowerCase()));
  const filler = FALLBACK.filter((f) => !used.has(f.title.toLowerCase()));
  return [...fromData, ...filler].slice(0, 7);
}

function Media({ item, tone }) {
  const [failed, setFailed] = useState(false);
  const useImage = item.image && !failed;

  return (
    <>
      {useImage ? (
        <img
          className={styles.img}
          src={opt(item.image, 800)}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`${styles.art} ${styles[`tone${tone}`]}`}>
          <span className={styles.artIcon}>{item.icon}</span>
          <i className={styles.artDot1} />
          <i className={styles.artDot2} />
          <i className={styles.artRing} />
        </div>
      )}
      <div className={styles.shade} />
    </>
  );
}

export default function Different() {
  const { data } = useContent();
  const FEATURES = buildFeatures(data.facilities);
  const STATS = (data.stats || []).slice(0, 4);
  const subtitle = data.home?.differentSubtitle || "Smart classrooms, real practical learning and a campus full of things to do. Tap any card to see what is inside.";
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -100px 0px" }
    );
    io.observe(el);
    const fallback = setTimeout(() => setVisible(true), 3000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="different"
      className={`${styles.section} ${visible ? styles.inView : ""}`}
    >
      <div className={styles.bg} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobA}`} />
        <span className={`${styles.blob} ${styles.blobB}`} />
        <div className={styles.dots} />
        <i className={styles.ring} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            What Makes Us <span className={styles.shine}>Different</span>
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => {
            const isOpen = open === i;
            return (
              <article
                key={f.title}
                className={`${styles.card} ${styles[`c${i}`]} ${isOpen ? styles.open : ""}`}
                style={{ "--i": i }}
              >
                <Media item={f} tone={i % 4} />

                <span className={styles.chip}>{f.icon}</span>
                <span className={styles.plus} aria-hidden="true" />

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  <p className={styles.cardText}>{f.text}</p>
                  <div className={styles.more}>
                    <ul>
                      {f.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.hit}
                  aria-expanded={isOpen}
                  aria-label={`More about ${f.title}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                />
              </article>
            );
          })}
        </div>

        <div className={styles.panel}>
          <ul className={styles.stats}>
            {STATS.map((s) => (
              <li key={s.label + s.value}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <div className={styles.cta}>
            <p>See it for yourself. Visit the campus and meet our teachers.</p>
            <Link to="/contact" className={styles.btn}>
              Book a campus visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}