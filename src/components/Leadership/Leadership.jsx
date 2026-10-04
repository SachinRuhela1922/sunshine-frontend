import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "../../content.jsx";
import { opt } from "../../img.js";
import { fmtDate, parseDate, yearsSince } from "../../utils.js";
import styles from "./Leadership.module.css";

/*
  Everything here comes from the Admin panel:
  Admin -> "Leadership - Section Heading" and "Leadership - Director, Principal, Vice Principal"
  and the founding date from Admin -> General Info -> "Established date".
  Photos are optional: without a photo an initials monogram is shown.
  Layout: each leader is one row (photo on one side, details on the other).
  Rows alternate left/right automatically.
*/

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
const roleKey = (r) => (/vice/i.test(r || "") ? "vice" : /principal/i.test(r || "") ? "principal" : "director");
const initials = (name) => (name || "?").split(/\s+/).filter((w) => !/\.$/.test(w)).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

/* number that counts up once when it becomes visible: "98%", "1500+", "25" */
function CountUp({ value, run }) {
  const m = String(value ?? "").match(/^(\d+(?:\.\d+)?)(.*)$/);
  const [n, setN] = useState(0);
  const end = m ? parseFloat(m[1]) : 0;
  useEffect(() => {
    if (!m || !run) return undefined;
    if (reduceMotion()) { setN(end); return undefined; }
    let raf, start;
    const step = (t) => {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / 1400);
      setN(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, value]);
  if (!m) return <>{value}</>;
  const dec = m[1].includes(".") ? m[1].split(".")[1].length : 0;
  const shown = run ? n : 0;
  return <>{dec ? shown.toFixed(dec) : Math.round(shown)}{m[2]}</>;
}

function Portrait({ name, image, role, large }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${styles.portrait} ${large ? styles.portraitLg : ""}`} data-role={roleKey(role)}>
      <i className={styles.backPlate} aria-hidden="true" />
      <i className={styles.orbit} aria-hidden="true"><b /></i>
      <div className={styles.photoFrame}>
        {image && !failed
          ? <img src={opt(image, 800)} alt={name} loading="lazy" decoding="async" onError={() => setFailed(true)} />
          : <span className={styles.mono} role="img" aria-label={name}>{initials(name)}</span>}
      </div>
    </div>
  );
}

function facts(l) {
  return [[l.f1v, l.f1l], [l.f2v, l.f2l], [l.f3v, l.f3l]].filter(([v, t]) => v || t);
}

/* ---------- One leader row: photo on one side, content on the other ---------- */
function LeaderRow({ l, index, run, onOpen }) {
  const key = roleKey(l.role);
  const f = facts(l);
  const flip = index % 2 === 1; // every second member swaps sides

  return (
    <article className={`${styles.row} ${flip ? styles.flip : ""}`} data-role={key} style={{ "--i": index }}>
      <div className={styles.media}>
        <Portrait name={l.name} image={l.image} role={l.role} />
        <span className={styles.badge}>{l.role}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.role}>{l.role}</p>
        <h3 className={styles.name}>{l.name}</h3>
        {l.joined && <p className={styles.since}>{l.joined}</p>}

        {l.quote && <blockquote className={styles.quote}>{l.quote}</blockquote>}

        {(l.qualification || l.experience) && (
          <dl className={styles.meta}>
            {l.qualification && <div><dt>Qualification</dt><dd>{l.qualification}</dd></div>}
            {l.experience && <div><dt>Experience</dt><dd>{l.experience}</dd></div>}
          </dl>
        )}

        {f.length > 0 && (
          <ul className={styles.facts}>
            {f.map(([v, t], i) => (
              <li key={i}><strong><CountUp value={v} run={run} /></strong><span>{t}</span></li>
            ))}
          </ul>
        )}

        <button type="button" className={styles.more} onClick={() => onOpen(index)}>
          View achievements
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </article>
  );
}

/* ---------- Details popup ---------- */
function Details({ list, index, onClose, onGo }) {
  const l = list[index];
  const closeRef = useRef(null);
  const key = roleKey(l.role);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onGo(1);
      if (e.key === "ArrowLeft") onGo(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, onGo]);

  const ach = lines(l.achievements).map((x) => { const [t, ...r] = x.split("|"); return { t: t.trim(), d: r.join("|").trim() }; });
  const f = facts(l);

  // rendered on <body> so it always sits above the site's fixed navbar
  return createPortal(
    <div className={styles.overlay} data-lenis-prevent onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${l.name}, ${l.role}`} data-role={key} key={index}>
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <aside className={styles.mSide}>
          <Portrait name={l.name} image={l.image} role={l.role} large />
          <p className={styles.mRole}>{l.role}</p>
          <h3 className={styles.mName}>{l.name}</h3>
          {l.joined && <p className={styles.mSince}>{l.joined}</p>}
          <div className={styles.chips}>
            {l.qualification && <span><em>Qualification</em>{l.qualification}</span>}
            {l.experience && <span><em>Experience</em>{l.experience}</span>}
          </div>
          {f.length > 0 && (
            <ul className={styles.mFacts}>
              {f.map(([v, t], i) => <li key={i}><strong><CountUp value={v} run /></strong><span>{t}</span></li>)}
            </ul>
          )}
        </aside>

        <div className={styles.mMain}>
          {l.quote && <p className={styles.mQuote}>{l.quote}</p>}
          {lines(l.message).map((p, i) => <p className={styles.mText} key={i}>{p}</p>)}

          {ach.length > 0 && (
            <>
              <h4 className={styles.mHead}>Key achievements</h4>
              <ol className={styles.ach}>
                {ach.map((a, i) => (
                  <li key={i} style={{ "--k": i }}>
                    <b>{i + 1}</b>
                    <div><strong>{a.t}</strong>{a.d && <p>{a.d}</p>}</div>
                  </li>
                ))}
              </ol>
            </>
          )}

          {list.length > 1 && (
            <div className={styles.nav}>
              <button type="button" onClick={() => onGo(-1)}>&larr; {list[(index - 1 + list.length) % list.length].role}</button>
              <button type="button" onClick={() => onGo(1)}>{list[(index + 1) % list.length].role} &rarr;</button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- Section ---------- */
export default function Leadership() {
  const { data } = useContent();
  const list = (data.leadership || []).filter((x) => x && x.name);
  const info = data.leadershipInfo || {};
  const est = data.general?.established;
  const years = yearsSince(est);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.05, rootMargin: "0px 0px -60px 0px" });
    io.observe(el);
    const fb = setTimeout(() => setVisible(true), 2500); // never leave content hidden
    return () => { io.disconnect(); clearTimeout(fb); };
  }, []);

  const go = useCallback((d) => setOpen((i) => (i < 0 ? i : (i + d + list.length) % list.length)), [list.length]);
  const close = useCallback(() => setOpen(-1), []);

  if (!list.length) return null;

  const title = info.title || "Our Leadership";

  return (
    <section id="leadership" ref={ref} className={`${styles.section} ${visible ? styles.inView : ""}`}>
      {/* soft animated background */}
      <div className={styles.bg} aria-hidden="true">
        <span className={`${styles.orb} ${styles.o1}`} />
        <span className={`${styles.orb} ${styles.o2}`} />
        <span className={`${styles.orb} ${styles.o3}`} />
        <span className={styles.gridlines} />
        <span className={styles.bigRing} />
        {Array.from({ length: 10 }).map((_, i) => <i key={i} className={styles.spark} style={{ "--s": i, "--x": `${(i * 9.3 + 3) % 100}%`, "--y": `${(i * 37) % 100}%` }} />)}
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headText}>
            <p className={styles.est}>Established {fmtDate(est)}</p>
            <h2 className={styles.title}>{title}</h2>
            {info.subtitle && <p className={styles.subtitle}>{info.subtitle}</p>}
          </div>
          <div className={styles.legacy}>
            <strong><CountUp value={String(years)} run={visible} /></strong>
            <span>years of shaping young minds, since {parseDate(est).getFullYear()}</span>
          </div>
        </header>

        <div className={styles.list}>
          {list.map((l, i) => <LeaderRow key={l.name + i} l={l} index={i} run={visible} onOpen={setOpen} />)}
        </div>
      </div>

      {open >= 0 && list[open] && <Details list={list} index={open} onClose={close} onGo={go} />}
    </section>
  );
}