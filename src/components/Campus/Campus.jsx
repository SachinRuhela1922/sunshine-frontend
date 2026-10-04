import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../../content.jsx";
import { opt } from "../../img.js";
import styles from "./Campus.module.css";

/*
  ====== EDIT HERE ======
  Video, photos, text, numbers sab placeholder hain. Apne school ke hisaab se badal lo.
  Photo ke liye image: "https://..." (Cloudinary link) paste karo. Khali chhodoge to
  illustrated panel dikhega.
*/
const CATS = ["Classrooms", "Play area", "Activities", "Events"];

const FALLBACK_FACTS = [
  { value: "5 acres", label: "Green campus" },
  { value: "40+", label: "Bright classrooms" },
  { value: "2 acres", label: "Open play area" },
  { value: "12", label: "Labs and special rooms" },
];

/* Gallery images come from the admin panel. Each caption is matched to a tab by keyword,
   anything else goes under "Campus". Tabs only show for categories that really have photos. */
const KEYWORDS = {
  Classrooms: /class|lab|library|reading|computer|smart/i,
  "Play area": /play|sport|ground|swing|slide|field|football|cricket/i,
  Activities: /activit|art|craft|music|dance|science|yoga|club|drama/i,
  Events: /event|annual|day|fair|festival|celebrat|function|prize/i,
};

function buildPhotos(gallery = []) {
  return gallery.filter((g) => g.image).map((g, i) => {
    const caption = (g.caption || "").trim();
    const cat = Object.keys(KEYWORDS).find((k) => KEYWORDS[k].test(caption)) || "Campus";
    return { cat, title: caption || `Campus photo ${i + 1}`, note: caption ? "From our gallery" : "", image: g.image };
  });
}

const BLOCK_TEXT = [
  {
    cat: "Classrooms",
    title: "Classrooms that feel like a second home",
    text: "Every classroom is bright, airy and set up for the age of the children in it. Younger rooms are colourful and play-ready, senior rooms are digital and focused.",
    points: [
      "Well-lit, ventilated rooms with child-sized furniture",
      "Smart boards and projectors for visual lessons",
      "Reading corners and display walls for student work",
      "Small class sizes so every child is noticed",
    ],
    stat: { value: "1:25", label: "Teacher to student ratio" },
  },
  {
    cat: "Play area",
    title: "Space to run, climb and just be a child",
    text: "Learning needs breaks. Our play areas are safe, open and supervised, with separate zones for little ones and older students.",
    points: [
      "Large open playground with soft, safe flooring",
      "Swings, slides and a sand pit for nursery children",
      "Courts for cricket, football and volleyball",
      "Shaded seating and drinking water on every side",
    ],
    stat: { value: "2 acres", label: "Open play area" },
  },
  {
    cat: "Activities",
    title: "Learning that goes beyond the textbook",
    text: "Every week has time for things children love. Activities are part of the timetable, not an extra, so each child can try, enjoy and find what they are good at.",
    points: [
      "Art, craft, music and dance with trained teachers",
      "Science, maths and computer labs for hands-on work",
      "Yoga, fitness and indoor games",
      "Clubs for reading, eco, robotics and public speaking",
    ],
    stat: { value: "20+", label: "Clubs and activities" },
  },
  {
    cat: "Events",
    title: "Celebrations the whole family remembers",
    text: "From the first day of school to annual day, events give children confidence and give parents a reason to visit. Families are always welcome.",
    points: [
      "Annual day, sports day and science fair",
      "Festival celebrations for every community",
      "Field trips, camps and guest talks",
      "Parent-teacher meetings and open days",
    ],
    stat: { value: "30+", label: "Events every year" },
  },
];

const FALLBACK_DAY = [
  { time: "8:15 AM", title: "Arrival and assembly", text: "Prayer, news and a thought for the day." },
  { time: "9:00 AM", title: "Morning lessons", text: "Core subjects when minds are freshest." },
  { time: "11:00 AM", title: "Snack break", text: "Healthy food and free play outside." },
  { time: "11:30 AM", title: "Activity period", text: "Labs, art, music, sports or clubs." },
  { time: "1:00 PM", title: "Lunch and rest", text: "Lunch together, then a quiet half hour." },
  { time: "1:45 PM", title: "Reading and projects", text: "Library time and group work." },
  { time: "2:30 PM", title: "Dismissal", text: "Supervised pick-up and bus departure." },
];

const FALLBACK_FACILITIES = [
  "Science lab", "Computer lab", "Library", "Art and craft room",
  "Music and dance room", "Indoor games room", "Medical room", "Cafeteria",
  "Auditorium", "Purified drinking water", "CCTV on campus", "GPS-tracked buses",
];

const FALLBACK_EVENTS = [
  { m: "Jun", title: "International Yoga Day", text: "Whole-school yoga on the ground." },
  { m: "Aug", title: "Independence Day", text: "Flag hoisting, march past and patriotic songs." },
  { m: "Sep", title: "Science Fair", text: "Student models, experiments and demos." },
  { m: "Oct", title: "Festival Week", text: "Dussehra and Diwali crafts, rangoli and food." },
  { m: "Nov", title: "Children's Day", text: "A day of games, treats and surprises." },
  { m: "Dec", title: "Annual Day", text: "Dance, drama and music on the big stage." },
  { m: "Jan", title: "Sports Day", text: "Races, relays and prizes for every house." },
  { m: "Feb", title: "Art and Book Fair", text: "Student exhibitions and a visiting book stall." },
];

/* ---------- small icons ---------- */
const I = {
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>,
  mute: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4zM17 9l4 6M21 9l-4 6" /></svg>,
  sound: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4zM16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  prev: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>,
  next: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>,
  cam: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.6" /></svg>,
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
};

const TONE = { Classrooms: "tone0", "Play area": "tone1", Activities: "tone2", Events: "tone3", Campus: "tone0" };

/* photo with illustrated fallback */
function Pic({ src, alt, cat, large }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img className={styles.pic} src={opt(src, large ? 1000 : 600)} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
  }
  return (
    <div className={`${styles.art} ${styles[TONE[cat]]} ${large ? styles.artLarge : ""}`} role="img" aria-label={alt}>
      <span className={styles.artIcon}>{I.cam}</span>
      <i className={styles.d1} />
      <i className={styles.d2} />
    </div>
  );
}

export default function Campus() {
  const vref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [tab, setTab] = useState("All");
  const [lb, setLb] = useState(-1);
  const { data } = useContent();
  const h = data.hero || {};
  const g = data.general || {};

  const photos = useMemo(() => buildPhotos(data.gallery), [data.gallery]);
  const cats = CATS.filter((c) => photos.some((p) => p.cat === c));
  const tabs = photos.some((p) => p.cat === "Campus") && cats.length ? [...cats, "Campus"] : cats;

  const blocks = BLOCK_TEXT.map((b) => ({ ...b, image: photos.find((p) => p.cat === b.cat)?.image || "" }));

  const facilities = (data.facilities || []).length ? data.facilities.map((f) => f.title) : FALLBACK_FACILITIES;
  const monthOf = (d = "") => {
    const t = Date.parse(d);
    return Number.isNaN(t) ? d.trim().slice(0, 3) : new Date(t).toLocaleString("en-US", { month: "short" });
  };
  const events = (data.events || []).length
    ? data.events.slice(0, 8).map((e) => ({ m: monthOf(e.date), title: e.title, text: e.desc }))
    : FALLBACK_EVENTS;
  const FACTS = data.campusFacts?.length ? data.campusFacts : FALLBACK_FACTS;
  const DAY = data.campusDay?.length ? data.campusDay : FALLBACK_DAY;
  const hoursText = data.home?.visitHoursText || "Monday to Saturday, 9:00 AM to 1:00 PM";
  const subtitle = data.home?.campusSubtitle || "Take a look around before you visit.";
  const phoneLink = (g.phone || "").replace(/[^\d+]/g, "");

  const items = tab === "All" || !tabs.includes(tab) ? photos : photos.filter((p) => p.cat === tab);

  const togglePlay = () => {
    const v = vref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleMute = () => {
    const v = vref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  /* lightbox keyboard + scroll lock */
  useEffect(() => {
    if (lb < 0) return;
    const n = items.length;
    const onKey = (e) => {
      if (e.key === "Escape") setLb(-1);
      if (e.key === "ArrowRight") setLb((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setLb((i) => (i - 1 + n) % n);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lb, items.length]);

  const current = lb >= 0 ? items[lb] : null;

  return (
    <section id="campus" className={styles.section}>
      <div className={styles.container}>
        {/* ---------- Header ---------- */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            Campus <span className={styles.accent}>Experience</span>
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        {/* ---------- Drone video ---------- */}
        {h.video && (
        <div className={styles.videoWrap}>
          <video
            ref={vref}
            className={styles.video}
            src="https://res.cloudinary.com/dmliuh8nm/video/upload/v1791115187/gemini_generated_video_b379d636_online-video-cutter.com_eepg8f.mp4"
            poster={h.poster || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <div className={styles.videoShade} />

          <div className={styles.videoTag}>
            <span className={styles.live} /> Aerial campus tour
          </div>

          {!playing && (
            <button type="button" className={styles.bigPlay} onClick={togglePlay} aria-label="Play campus video">
              <span>{I.play}</span>
              Watch the campus from above
            </button>
          )}

          <div className={styles.controls}>
            <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"}>
              {playing ? I.pause : I.play}
            </button>
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute video" : "Mute video"}>
              {muted ? I.mute : I.sound}
            </button>
          </div>
        </div>
        )}

        <ul className={styles.facts}>
          {FACTS.map((f) => (
            <li key={f.label}>
              <strong>{f.value}</strong>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>

        {/* ---------- Photo gallery ---------- */}
        {photos.length > 0 && (
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <div>
              <h3 className={styles.h3}>Photos from our campus</h3>
              <p className={styles.lead}>Tap any photo to view it larger.</p>
            </div>
            {tabs.length > 0 && (
            <div className={styles.tabs} role="tablist" aria-label="Photo categories">
              {["All", ...tabs].map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={tab === c}
                  className={`${styles.tab} ${tab === c ? styles.tabOn : ""}`}
                  onClick={() => {
                    setTab(c);
                    setLb(-1);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            )}
          </div>

          <div className={styles.gallery}>
            {items.map((p, i) => (
              <button key={p.image + i} type="button" className={styles.tile} onClick={() => setLb(i)} aria-label={`Open ${p.title}`}>
                <Pic src={p.image} alt={p.title} cat={p.cat} />
                <span className={styles.tileShade} />
                <span className={styles.tileCat}>{p.cat}</span>
                <span className={styles.tileText}>
                  <b>{p.title}</b>
                  <small>{p.note}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
        )}

        {/* ---------- Detail blocks ---------- */}
        <div className={styles.details}>
          {blocks.map((b, i) => (
            <article key={b.cat} className={`${styles.row} ${i % 2 ? styles.flip : ""}`}>
              <div className={styles.rowMedia}>
                <Pic src={b.image} alt={b.title} cat={b.cat} large />
                <div className={styles.statBadge}>
                  <strong>{b.stat.value}</strong>
                  <span>{b.stat.label}</span>
                </div>
              </div>
              <div className={styles.rowText}>
                <span className={styles.pill}>{b.cat}</span>
                <h3 className={styles.h3big}>{b.title}</h3>
                <p>{b.text}</p>
                <ul className={styles.checks}>
                  {b.points.map((pt) => (
                    <li key={pt}>
                      <i>{I.check}</i>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* ---------- A day on campus ---------- */}
        <div className={styles.block}>
          <h3 className={styles.h3}>A day on campus</h3>
          <p className={styles.lead}>A balanced day with learning, movement, food and rest.</p>
          <ol className={styles.day}>
            {DAY.map((d) => (
              <li key={d.time + d.title}>
                <time>{d.time}</time>
                <b>{d.title}</b>
                <span>{d.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------- Facilities ---------- */}
        <div className={styles.block}>
          <h3 className={styles.h3}>Facilities at a glance</h3>
          <p className={styles.lead}>Everything a child needs on campus, in one place.</p>
          <ul className={styles.facilities}>
            {facilities.map((f) => (
              <li key={f}>
                <i>{I.check}</i>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Yearly events ---------- */}
        <div className={styles.block}>
          <h3 className={styles.h3}>Our yearly calendar</h3>
          <p className={styles.lead}>Something to look forward to almost every month.</p>
          <ul className={styles.events}>
            {events.map((e) => (
              <li key={e.title + e.m}>
                <span className={styles.month}>{e.m}</span>
                <div>
                  <b>{e.title}</b>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Visit CTA ---------- */}
        <div className={styles.visit}>
          <div className={styles.visitText}>
            <h3>Plan your campus visit</h3>
            <p>See the classrooms, walk the playground and meet the teachers. We would love to show you around.</p>
            <ul>
              <li>{I.clock} {hoursText}</li>
              {g.address && <li>{I.pin} {g.address}</li>}
            </ul>
          </div>
          <div className={styles.visitBtns}>
            <Link to="/contact" className={styles.primary}>Book a campus visit</Link>
            {g.phone && <a href={`tel:${phoneLink}`} className={styles.ghost}>Call the school</a>}
          </div>
        </div>
      </div>

      {/* ---------- Lightbox ---------- */}
      {current && (
        <div className={styles.lb} role="dialog" aria-modal="true" aria-label={current.title} onClick={() => setLb(-1)}>
          <figure className={styles.lbFig} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lbMedia}>
              <Pic src={current.image} alt={current.title} cat={current.cat} large />
            </div>
            <figcaption>
              <b>{current.title}</b>
              <span>{current.note}</span>
              <small>{lb + 1} / {items.length}</small>
            </figcaption>
          </figure>
          <button type="button" className={`${styles.lbBtn} ${styles.lbClose}`} onClick={() => setLb(-1)} aria-label="Close">{I.close}</button>
          <button type="button" className={`${styles.lbBtn} ${styles.lbPrev}`} onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + items.length) % items.length); }} aria-label="Previous photo">{I.prev}</button>
          <button type="button" className={`${styles.lbBtn} ${styles.lbNext}`} onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % items.length); }} aria-label="Next photo">{I.next}</button>
        </div>
      )}
    </section>
  );
}