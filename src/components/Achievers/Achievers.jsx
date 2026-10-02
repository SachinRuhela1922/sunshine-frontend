import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../../content.jsx";
import { opt } from "../../img.js";
import styles from "./Achievers.module.css";

/*
  All names, photos, medals and numbers now come from the Admin panel:
  Admin -> Achievers - Medal Tally / Achiever of the Year / Student Achievements / Special Recognitions.
  The block below is only a safety copy that shows if the server has not sent data yet.
*/
const CATS = ["Academics", "Sports", "Arts", "Science"];

const FALLBACK = {
  tally: [
    { medal: "gold", value: "42", label: "Gold medals" },
    { medal: "silver", value: "38", label: "Silver medals" },
    { medal: "bronze", value: "40", label: "Bronze medals" },
    { medal: "star", value: "120+", label: "Prizes and awards" },
  ],
};

const MEDAL_COLOR = { gold: "#f5b301", silver: "#aab4c0", bronze: "#cd7f32", star: "#ff7a18" };

function Medal({ type, size = 36 }) {
  const c = MEDAL_COLOR[type] || MEDAL_COLOR.star;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9 2h5l2 7-4 2zM23 2h-5l-2 7 4 2z" fill="#14213d" opacity=".85" />
      <circle cx="16" cy="20" r="9" fill={c} />
      <circle cx="16" cy="20" r="6.2" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.4" />
      <path d="M16 15.8l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#fff" />
    </svg>
  );
}

function Avatar({ name, image, cat, className }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2);
  if (image && !failed) {
    return <img className={`${styles.photo} ${className || ""}`} src={opt(image, 500)} alt={name} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
  }
  return (
    <div className={`${styles.avatar} ${styles[`a_${cat || "Academics"}`]} ${className || ""}`} role="img" aria-label={name}>
      {initials}
    </div>
  );
}

export default function Achievers() {
  const { data } = useContent();
  const [tab, setTab] = useState("All");

  const tally = (data.tally && data.tally.length ? data.tally : FALLBACK.tally);
  const sp = data.spotlight || {};
  const facts = [[sp.f1v, sp.f1l], [sp.f2v, sp.f2l], [sp.f3v, sp.f3l]].filter(([v, l]) => v || l);
  const students = (data.achievers || []).filter((x) => x && x.name);
  const recs = (data.recognitions || []).filter((x) => x && x.title);
  const cats = CATS.filter((c) => students.some((x) => x.cat === c));
  const list = tab === "All" || !cats.includes(tab) ? students : students.filter((x) => x.cat === tab);
  const subtitle = data.home?.achieversSubtitle || "Big wins from small hands. Meet the students who made us proud this year.";

  return (
    <section id="achievers" className={styles.section}>
      <div className={styles.container}>
        {/* ---------- Header ---------- */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            Little <span className={styles.accent}>Achievers</span>
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        {/* ---------- Medal tally ---------- */}
        <ul className={styles.tally}>
          {tally.map((t, i) => (
            <li key={t.label + i}>
              <Medal type={t.medal} size={46} />
              <div>
                <strong>{t.value}</strong>
                <span>{t.label}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* ---------- Spotlight ---------- */}
        {sp.name && (
          <article className={styles.spot}>
            <div className={styles.spotMedia}>
              <Avatar name={sp.name} image={sp.image} cat="Science" className={styles.spotAvatar} />
              <span className={styles.spotMedal}>
                <Medal type="gold" size={56} />
              </span>
            </div>
            <div className={styles.spotText}>
              <span className={styles.pill}>Achiever of the year</span>
              <h3 className={styles.spotName}>{sp.name}</h3>
              {sp.cls && <p className={styles.spotCls}>{sp.cls}</p>}
              {sp.headline && <h4 className={styles.spotHead}>{sp.headline}</h4>}
              {sp.text && <p className={styles.spotBody}>{sp.text}</p>}
              {facts.length > 0 && (
                <ul className={styles.spotFacts}>
                  {facts.map(([v, l], i) => (
                    <li key={i}>
                      <strong>{v}</strong>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        )}

        {/* ---------- Student achievements ---------- */}
        {students.length > 0 && (
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <div>
              <h3 className={styles.h3}>Student achievements</h3>
              <p className={styles.lead}>Medals, ranks and prizes won by our students.</p>
            </div>
            <div className={styles.tabs} role="tablist" aria-label="Achievement categories">
              {["All", ...cats].map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={tab === c}
                  className={`${styles.tab} ${tab === c ? styles.tabOn : ""}`}
                  onClick={() => setTab(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.cards}>
            {list.map((s, i) => (
              <article key={s.name + i} className={styles.card}>
                <div className={styles.cardTop}>
                  <Avatar name={s.name} image={s.image} cat={s.cat} />
                  <span className={styles.cardMedal}>
                    <Medal type={s.medal} size={34} />
                  </span>
                </div>
                <h4 className={styles.cardName}>{s.name}</h4>
                <p className={styles.cardCls}>{s.cls}</p>
                <p className={styles.cardTitle}>{s.title}</p>
                <div className={styles.cardMeta}>
                  {s.level && <span className={styles.level}>{s.level} level</span>}
                  {s.cat && <span>{s.cat}</span>}
                  {s.year && <span>{s.year}</span>}
                </div>
              </article>
            ))}
          </div>
        </div>

        )}

        {/* ---------- Special recognitions ---------- */}
        {recs.length > 0 && (
        <div className={styles.block}>
          <h3 className={styles.h3}>Special recognitions</h3>
          <p className={styles.lead}>Not every win comes with a medal. These awards celebrate character.</p>

          <div className={styles.recs}>
            {recs.map((r, i) => (
              <article key={r.title + i} className={styles.rec}>
                <span className={styles.recIcon}>
                  <Medal type="star" size={30} />
                </span>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
                {r.recent && <span className={styles.recent}>Recent: {r.recent}</span>}
              </article>
            ))}
          </div>
        </div>
        )}

        {/* ---------- CTA ---------- */}
        <div className={styles.cta}>
          <div>
            <h3>Your child could be next</h3>
            <p>With the right guidance and plenty of chances to try, every child can shine. Come and see how we make it happen.</p>
          </div>
          <Link to="/contact" className={styles.btn}>Apply for admission</Link>
        </div>
      </div>
    </section>
  );
}