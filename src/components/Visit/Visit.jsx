import React, { useEffect, useState } from "react";
import { useContent } from "../../content.jsx";
import { api } from "../../api.js";
import styles from "./Visit.module.css";

/*
  ====== EDIT HERE ======
  Saari details placeholder hain. Apne school ka sahi address, phone, email aur timings daalo.
  MAP_QUERY me wahi address ya school ka naam daalo jo Google Maps me search karne par mile.
*/
/* index = Date.getDay(): 0 Sunday ... 6 Saturday. open/close 24h, null = closed */
const FALLBACK_HOURS = [
  { day: "Sunday", note: "Closed", open: null, close: null },
  { day: "Monday", note: "9:00 AM to 1:00 PM", open: 9, close: 13 },
  { day: "Tuesday", note: "9:00 AM to 1:00 PM", open: 9, close: 13 },
  { day: "Wednesday", note: "9:00 AM to 1:00 PM", open: 9, close: 13 },
  { day: "Thursday", note: "9:00 AM to 1:00 PM", open: 9, close: 13 },
  { day: "Friday", note: "9:00 AM to 1:00 PM", open: 9, close: 13 },
  { day: "Saturday", note: "9:00 AM to 12:00 PM", open: 9, close: 12 },
];
const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

const FALLBACK_REACH = [
  { title: "By road", text: "Located on the main road, with parking space for visitors at the school gate.", meta: "Free visitor parking" },
  { title: "By bus or auto", text: "City buses and autos stop right outside the school. Ask for the school stop.", meta: "Stop: 2 minutes' walk" },
  { title: "By train", text: "The nearest railway station is a short ride away. Autos and cabs are always available.", meta: "Your Station, about 6 km" },
  { title: "By air", text: "The nearest airport is about 25 km from the school, around 45 minutes by car.", meta: "Your Airport, about 25 km" },
];

const FALLBACK_STEPS = [
  { title: "Book your visit", text: "Call us, message on WhatsApp or fill the form below and pick a day that suits you." },
  { title: "Tour the campus", text: "Walk through classrooms, labs, library and the playground with a member of our team." },
  { title: "Meet the teachers", text: "Talk to the principal and class teachers about how your child will learn." },
  { title: "Get admission help", text: "We explain the process, fees and dates, and answer every question on the spot." },
];

const FALLBACK_BRING = [
  "Child's birth certificate",
  "Parent ID proof and address proof",
  "Recent passport-size photos of the child",
  "Previous school report card (if applicable)",
  "Transfer certificate (for Class 2 and above)",
  "A list of your questions",
];

const FALLBACK_FAQS = [
  { q: "Do I need an appointment to visit?", a: "Walk-ins are welcome during visiting hours, but booking a slot means a teacher is free to show you around without waiting." },
  { q: "Can my child come along?", a: "Yes, please bring your child. Younger children often enjoy the tour, and it helps us understand them better." },
  { q: "How long does a campus visit take?", a: "A full tour with a short chat usually takes 45 minutes to one hour." },
  { q: "Can I meet the principal?", a: "Yes. The principal meets parents by appointment during visiting hours. Mention this when you book." },
  { q: "Is there parking for visitors?", a: "Yes, there is parking space near the main gate for cars and two-wheelers." },
  { q: "Can I visit on a Sunday or a holiday?", a: "The school is closed on Sundays and public holidays. For special cases, call the office and we will try to help." },
];

/* ---------- icons ---------- */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const I = {
  pin: <svg viewBox="0 0 24 24" {...stroke}><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  phone: <svg viewBox="0 0 24 24" {...stroke}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>,
  mail: <svg viewBox="0 0 24 24" {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>,
  clock: <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  road: <svg viewBox="0 0 24 24" {...stroke}><path d="M7 3L4 21M17 3l3 18M12 4v3M12 10v4M12 17v3" /></svg>,
  bus: <svg viewBox="0 0 24 24" {...stroke}><rect x="4" y="3" width="16" height="15" rx="2" /><path d="M4 11h16M8 18v3M16 18v3" /><circle cx="8" cy="14.5" r=".6" /><circle cx="16" cy="14.5" r=".6" /></svg>,
  train: <svg viewBox="0 0 24 24" {...stroke}><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M9 21l2-4M15 21l-2-4" /><circle cx="9" cy="14" r=".6" /><circle cx="15" cy="14" r=".6" /></svg>,
  plane: <svg viewBox="0 0 24 24" {...stroke}><path d="M10.5 13.5L3 11l1-2 8 .5L16 5a2 2 0 013 3l-4.5 4 .5 8-2 1-2.5-7.5z" /></svg>,
  check: <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.6"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  wa: <svg viewBox="0 0 24 24" {...stroke}><path d="M4 20l1.3-4.2A8 8 0 1112 20a8 8 0 01-3.9-1L4 20z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-.8.8c-.8-.4-1.600-1.200-2-2l.8-.8-1-2L9 9.500z" /></svg>,
};

const REACH_ICONS = [I.road, I.bus, I.train, I.plane];

const fmtHour = (n) => { const h = Math.floor(n), m = Math.round((n - h) * 60); return `${((h + 11) % 12) + 1}${m ? ':' + String(m).padStart(2, '0') : ':00'} ${h < 12 ? 'AM' : 'PM'}`; };

function fmtStatus(now, HOURS) {
  const h = HOURS[now.getDay()] || {};
  const t = now.getHours() + now.getMinutes() / 60;
  if (h.open === null || h.open === undefined) return { open: false, text: "Closed today" };
  if (t >= h.open && t < h.close) return { open: true, text: "Open now" };
  if (t < h.open) return { open: false, text: `Opens today at ${fmtHour(h.open)}` };
  return { open: false, text: "Closed for today" };
}

export default function Visit() {
  const { data } = useContent();
  const g = data.general || {};
  const SCHOOL = g.schoolName || "Sunshine School";
  const ADDRESS = g.address || "";
  const PHONE = g.phone || "";
  const PHONE_LINK = PHONE.replace(/[^\d+]/g, "");
  const WHATSAPP_LINK = PHONE.replace(/\D/g, "");
  const EMAIL = g.email || "";
  const MAP_QUERY = ADDRESS || SCHOOL;
  const MAPS_OPEN = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
  const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;
  // admin "Google Map Embed URL" wins, otherwise search by address
  const MAPS_EMBED = g.mapEmbed || `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
  const H = data.home || {};
  // hours from admin: empty open/close = closed day
  const HOURS = data.visitHours?.length === 7
    ? data.visitHours.map((h) => {
        const o = h.open === '' || h.open == null ? null : Number(h.open);
        const c = h.close === '' || h.close == null ? null : Number(h.close);
        return { day: h.day, note: h.note || 'Closed', open: Number.isNaN(o) ? null : o, close: Number.isNaN(c) ? null : c };
      })
    : FALLBACK_HOURS;
  const REACH = data.visitReach?.length ? data.visitReach : FALLBACK_REACH;
  const STEPS = data.visitSteps?.length ? data.visitSteps : FALLBACK_STEPS;
  const BRING = data.visitBring?.length ? data.visitBring.map((b) => b.item).filter(Boolean) : FALLBACK_BRING;
  const FAQS = data.visitFaqs?.length ? data.visitFaqs : FALLBACK_FAQS;
  const [sent, setSent] = useState("");
  const [today, setToday] = useState(-1);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", note: "" });

  /* client-only, taaki server/browser ka time mismatch na ho */
  useEffect(() => {
    const now = new Date();
    setToday(now.getDay());
    setStatus(fmtStatus(now, HOURS));
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent("Sending...");
    const message = `Campus visit request. Preferred date: ${form.date || "Any"}. ${form.note || ""}`.trim();
    try {
      await api("/api/enquiries", { method: "POST", body: { name: form.name, phone: form.phone, email: "", message } });
      setSent("Thank you! We will confirm your visit by phone.");
      setForm({ name: "", phone: "", date: "", note: "" });
    } catch (err) {
      setSent("Error: " + err.message);
    }
  };

  return (
    <section id="visit" className={styles.section}>
      <div className={styles.container}>
        {/* ---------- Header ---------- */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            Visit <span className={styles.accent}>Our School</span>
          </h2>
          <p className={styles.subtitle}>{H.visitSubtitle || "The best way to know a school is to walk through it. Come see the classrooms, meet the teachers and ask us anything."}</p>
        </header>

        {/* ---------- Contact + map ---------- */}
        <div className={styles.top}>
          <div className={styles.cards}>
            <article className={styles.info}>
              <span className={styles.icon}>{I.pin}</span>
              <div>
                <h3>Address</h3>
                <p>{ADDRESS}</p>
                <a href={MAPS_DIRECTIONS} target="_blank" rel="noreferrer" className={styles.link}>Get directions</a>
              </div>
            </article>

            <article className={styles.info}>
              <span className={styles.icon}>{I.phone}</span>
              <div>
                <h3>Phone</h3>
                <p>{PHONE}</p>
                <div className={styles.links}>
                  <a href={`tel:${PHONE_LINK}`} className={styles.link}>Call now</a>
                  <a href={`https://wa.me/${WHATSAPP_LINK}`} target="_blank" rel="noreferrer" className={styles.link}>WhatsApp</a>
                </div>
              </div>
            </article>

            <article className={styles.info}>
              <span className={styles.icon}>{I.mail}</span>
              <div>
                <h3>Email</h3>
                <p>{EMAIL}</p>
                <a href={`mailto:${EMAIL}`} className={styles.link}>Send an email</a>
              </div>
            </article>

            <article className={styles.info}>
              <span className={styles.icon}>{I.clock}</span>
              <div>
                <h3>Visiting hours</h3>
                <p>{H.visitHoursText || "Monday to Saturday, 9:00 AM to 1:00 PM"}</p>
                {status && (
                  <span className={`${styles.status} ${status.open ? styles.on : ""}`}>
                    <i /> {status.text}
                  </span>
                )}
              </div>
            </article>
          </div>

          <div className={styles.mapCard}>
            <iframe
              className={styles.map}
              title={`${SCHOOL} on Google Maps`}
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a href={MAPS_OPEN} target="_blank" rel="noreferrer" className={styles.mapBtn}>
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* ---------- Hours table + checklist ---------- */}
        <div className={styles.duo}>
          <div className={styles.panel}>
            <h3 className={styles.h3}>Weekly timings</h3>
            <p className={styles.lead}>Campus visits and office hours.</p>
            <ul className={styles.hours}>
              {ORDER.map((d) => {
                const h = HOURS[d];
                return (
                  <li key={h.day} className={`${d === today ? styles.today : ""} ${h.open === null ? styles.closed : ""}`}>
                    <span>{h.day}</span>
                    <b>{h.note}</b>
                  </li>
                );
              })}
            </ul>
            <p className={styles.small}>Principal meetings are by appointment. School is closed on public holidays.</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.h3}>What to bring</h3>
            <p className={styles.lead}>Carry these if you want to start admission on the same day.</p>
            <ul className={styles.checks}>
              {BRING.map((b, i) => (
                <li key={b + i}>
                  <i>{I.check}</i>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- How to reach ---------- */}
        <div className={styles.block}>
          <h3 className={styles.h3}>How to reach us</h3>
          <p className={styles.lead}>Easy to find, whichever way you travel.</p>
          <div className={styles.reach}>
            {REACH.map((r, i) => (
              <article key={r.title + i} className={styles.reachCard}>
                <span className={styles.icon}>{REACH_ICONS[i % REACH_ICONS.length]}</span>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
                <span className={styles.meta}>{r.meta}</span>
              </article>
            ))}
          </div>
        </div>

        {/* ---------- What happens on a visit ---------- */}
        <div className={styles.block}>
          <h3 className={styles.h3}>What happens when you visit</h3>
          <p className={styles.lead}>Four simple steps, no pressure.</p>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s.title + i}>
                <span className={styles.num}>{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------- FAQ + form ---------- */}
        <div className={`${styles.duo} ${styles.duoTop}`}>
          <div>
            <h3 className={styles.h3}>Visitor questions</h3>
            <p className={styles.lead}>Quick answers before you come.</p>
            <div className={styles.faq}>
              {FAQS.map((f, i) => (
                <details key={f.q + i}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <h3 className={styles.h3}>Request a visit</h3>
            <p className={styles.lead}>Tell us when you would like to come. We will confirm by phone.</p>

            <label>
              Parent name
              <input name="name" value={form.name} onChange={onChange} required autoComplete="name" placeholder="Your full name" />
            </label>
            <label>
              Phone number
              <input name="phone" value={form.phone} onChange={onChange} required type="tel" autoComplete="tel" placeholder="10-digit mobile number" />
            </label>
            <label>
              Preferred date
              <input name="date" value={form.date} onChange={onChange} type="date" />
            </label>
            <label>
              Message (optional)
              <textarea name="note" value={form.note} onChange={onChange} rows="3" placeholder="Class you are looking for, questions, etc." />
            </label>
            <button type="submit" className={styles.submit}>Send visit request</button>
            {sent && <small className={styles.small}>{sent}</small>}
          </form>
        </div>
      </div>
    </section>
  );
}