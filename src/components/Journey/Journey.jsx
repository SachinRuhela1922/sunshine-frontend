import React, { useEffect, useRef, useState } from "react";
import { useContent } from "../../content.jsx";
import styles from "./Journey.module.css";

/* Apne school ke hisaab se yahan classes, age aur text badal lo */
const FALLBACK_STAGES = [
  {
    word: "Play",
    classes: "Nursery",
    age: "Ages 3 to 4",
    text: "Songs, sand, colours and stories help little ones settle in, smile and make their first friends.",
    tags: ["Rhymes", "Sensory play", "Storytime"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 9.5c3.6 1.2 12.8 1.2 16.4 0M3.8 14.5c3.6-1.2 12.8-1.2 16.4 0M12 3.5c-2.6 3.4-2.6 13.6 0 17" />
      </svg>
    ),
  },
  {
    word: "Learn",
    classes: "LKG and UKG",
    age: "Ages 4 to 6",
    text: "Letters, numbers and early reading come alive through games, puzzles and hands-on activities.",
    tags: ["Phonics", "Numbers", "Art and craft"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5z" />
        <path d="M12 6.5v13" />
      </svg>
    ),
  },
  {
    word: "Explore",
    classes: "Classes 1 to 5",
    age: "Ages 6 to 10",
    text: "Experiments, projects and field trips build curiosity, teamwork and the habit of asking why.",
    tags: ["Science lab", "Projects", "Sports"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M15.8 8.2l-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1z" />
      </svg>
    ),
  },
  {
    word: "Grow",
    classes: "Classes 6 to 8",
    age: "Ages 11 to 14",
    text: "Strong academics, clubs and leadership roles prepare students to think and act independently.",
    tags: ["Clubs", "Leadership", "Academics"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21v-9" />
        <path d="M12 12c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5z" />
        <path d="M12 15c0-3-2-5-6-5 0 3.2 2 5 6 5z" />
      </svg>
    ),
  },
];


const WORDS = ["Play", "Learn", "Explore", "Grow"];
const ICONS = FALLBACK_STAGES.map((s) => s.icon);

/* Programs from the database become the stages (max 4, the timeline is a 4 column layout).
   If there are none yet, the default stages are shown. */
function buildStages(programs = []) {
  if (!programs.length) return FALLBACK_STAGES;
  return programs.slice(0, 4).map((p, i) => ({
    word: WORDS[i % WORDS.length],
    classes: p.title,
    age: `Program ${i + 1}`,
    text: p.desc,
    tags: [],
    icon: ICONS[i % ICONS.length],
  }));
}

/* floating background shapes: kind, size px, x %, duration s, delay s */
const SHAPES = [
  ["circle", 26, 6, 26, -4],
  ["dot", 10, 14, 19, -12],
  ["square", 22, 23, 30, -20],
  ["tri", 24, 33, 24, -8],
  ["circle", 16, 44, 28, -16],
  ["dot", 12, 54, 21, -2],
  ["square", 16, 63, 27, -23],
  ["tri", 18, 72, 22, -10],
  ["circle", 30, 82, 31, -6],
  ["dot", 9, 91, 18, -14],
];

export default function Journey() {
  const { data } = useContent();
  const STAGES = buildStages(data.programs);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -120px 0px" }
    );
    io.observe(el);
    // safety net: content kabhi hidden na rahe
    const fallback = setTimeout(() => setVisible(true), 3000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="journey"
      className={`${styles.section} ${visible ? styles.inView : ""}`}
    >
      {/* animated background */}
      <div className={styles.bg} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobA}`} />
        <span className={`${styles.blob} ${styles.blobB}`} />
        <span className={`${styles.blob} ${styles.blobC}`} />
        <div className={styles.dots} />
        <div className={styles.rays} />
        <div className={styles.shapes}>
          {SHAPES.map(([kind, size, x, d, delay], i) => (
            <span
              key={i}
              className={`${styles.shape} ${styles[kind]}`}
              style={{ "--s": `${size}px`, "--x": `${x}%`, "--d": `${d}s`, "--delay": `${delay}s` }}
            />
          ))}
        </div>
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Our <span className={styles.shine}>Learning Journey</span>
          </h2>
          <p className={styles.subtitle}>
            From the first day of nursery to confident teenagers, every stage is built around how children actually learn.
          </p>
        </header>

        <ol className={styles.steps}>
          <div className={styles.line} aria-hidden="true">
            <span className={styles.fill} />
          </div>

          {STAGES.map((s, i) => (
            <li key={s.word + i} className={styles.step} style={{ "--i": i }}>
              <div className={styles.head}>
                <div className={styles.node}>{s.icon}</div>
                <span className={styles.word}>{s.word}</span>
              </div>

              <article className={styles.card}>
                <span className={styles.age}>{s.age}</span>
                <h3 className={styles.classes}>{s.classes}</h3>
                <p className={styles.text}>{s.text}</p>
                {s.tags.length > 0 && (
                  <ul className={styles.tags}>
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                <div className={styles.meter} aria-hidden="true">
                  {STAGES.map((_, k) => (
                    <span key={k} className={k <= i ? styles.on : ""} />
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}