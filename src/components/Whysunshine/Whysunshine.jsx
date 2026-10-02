import React, { useEffect, useRef, useState } from "react";
import { useContent } from "../../content.jsx";
import styles from "./Whysunshine.module.css";

const FALLBACK_FEATURES = [
  {
    title: "Safe & Caring Environment",
    text: "CCTV-monitored campus, verified staff and a warm, nurturing atmosphere where every child feels secure and valued.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
        <path d="M12 10.2c-.9-1.3-3-.9-3 .8 0 1.6 3 3.4 3 3.4s3-1.8 3-3.4c0-1.7-2.1-2.1-3-.8z" />
      </svg>
    ),
  },
  {
    title: "Activity-Based Learning",
    text: "Learning by doing: experiments, art, storytelling and play that turn curiosity into real understanding.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
      </svg>
    ),
  },
  {
    title: "Experienced Teachers",
    text: "Trained, passionate educators who know each child by name and guide them with patience and personal attention.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-5 9 5-9 5-9-5z" />
        <path d="M7 11.5V16c0 1.4 2.2 3 5 3s5-1.6 5-3v-4.5" />
        <path d="M21 9v5" />
      </svg>
    ),
  },
  {
    title: "Holistic Development",
    text: "Academics, sports, creativity and values together, so children grow confident in mind, body and character.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </svg>
    ),
  },
];

/* ---------- 3D animated graph (canvas, no libraries) ---------- */
function Graph3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf, t = 0;
    const N = 28;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const height = (x, z, time) => {
      const d = Math.hypot(x, z);
      return (
        Math.sin(d * 7 - time * 1.4) * 0.22 * (1 - d * 0.45) +
        Math.sin(x * 3 + time * 0.8) * Math.cos(z * 3 - time * 0.6) * 0.12
      );
    };

    const project = (x, y, z, ry, rx) => {
      const cy = Math.cos(ry), sy = Math.sin(ry);
      let X = x * cy - z * sy;
      let Z = x * sy + z * cy;
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const Y = y * cx - Z * sx;
      Z = y * sx + Z * cx;
      const f = 3.2;
      const p = f / (f + Z);
      const s = Math.min(w, h * 1.5) * 0.52;
      return { x: w * 0.5 + X * p * s, y: h * 0.55 - Y * p * s, z: Z, p };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ry = t * 0.12 + 0.6;
      const rx = 0.95;
      const grid = [];

      for (let i = 0; i < N; i++) {
        const row = [];
        for (let j = 0; j < N; j++) {
          const x = (i / (N - 1)) * 2 - 1;
          const z = (j / (N - 1)) * 2 - 1;
          const y = height(x, z, t);
          row.push({ ...project(x, y, z, ry, rx), y3: y });
        }
        grid.push(row);
      }

      const line = (a, b) => {
        const depth = Math.max(0, Math.min(1, (a.p - 0.72) / 0.5));
        const peak = Math.max(0, Math.min(1, (a.y3 + 0.2) / 0.4));
        ctx.strokeStyle = `rgba(255, ${Math.round(90 + peak * 60)}, ${Math.round(peak * 30)}, ${0.1 + depth * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      };

      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (i < N - 1) line(grid[i][j], grid[i + 1][j]);
          if (j < N - 1) line(grid[i][j], grid[i][j + 1]);
        }
      }

      // glowing peaks
      for (let i = 0; i < N; i += 2) {
        for (let j = 0; j < N; j += 2) {
          const pt = grid[i][j];
          if (pt.y3 > 0.13) {
            const r = 1.5 + pt.p * 2.2;
            ctx.fillStyle = "rgba(17,17,17,0.9)";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255,122,24,0.22)";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r * 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // floating 3D bar-graph columns
      const bars = [
        [-0.75, -0.1], [-0.45, 0.35], [0.1, -0.5], [0.55, 0.1], [0.8, 0.6],
      ];
      bars.forEach(([bx, bz], k) => {
        const grow = 0.25 + 0.2 * Math.sin(t * 1.2 + k * 1.3) + 0.2;
        const base = project(bx, -0.35, bz, ry, rx);
        const top = project(bx, -0.35 + grow, bz, ry, rx);
        const g = ctx.createLinearGradient(base.x, base.y, top.x, top.y);
        g.addColorStop(0, "rgba(255,122,24,0)");
        g.addColorStop(1, "rgba(255,160,70,0.85)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 3 + base.p * 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(top.x, top.y);
        ctx.stroke();
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(top.x, top.y, 2 + top.p * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.lineWidth = 1;
    };

    // draw only while the section is on screen (saves CPU/battery, keeps scrolling smooth)
    let running = false;
    const loop = () => {
      if (!running) return;
      t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (reduce) { draw(); return; }
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.graph} aria-hidden="true" />;
}

/* ---------- Tilt card ---------- */
function FeatureCard({ item, index }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      className={styles.card}
      style={{ "--i": index }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className={styles.cardGlow} />
      <div className={styles.cardInner}>
        <div className={styles.icon}>{item.icon}</div>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardText}>{item.text}</p>
      </div>
    </article>
  );
}

/* ---------- Section ---------- */
export default function WhySunshine() {
  const { data } = useContent();
  const name = data.general?.schoolName || "Sunshine School";
  const FEATURES = data.whyFeatures?.length
    ? data.whyFeatures.slice(0, 4).map((f, i) => ({ title: f.title, text: f.text, icon: FALLBACK_FEATURES[i % FALLBACK_FEATURES.length].icon }))
    : FALLBACK_FEATURES;
  const subtitle = data.home?.whySubtitle || "A school where children feel safe, stay curious and grow every single day.";
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    // safety net: never leave content hidden if the observer doesn't fire
    const fallback = setTimeout(() => setVisible(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.inView : ""}`}
      id="why-sunshine"
    >
      {/* soft dissolve over the bottom of the hero video */}
      <div className={styles.bridge} aria-hidden="true" />

      <div className={styles.bg} aria-hidden="true">
        <Graph3D />
        <div className={styles.fade} />
        <span className={`${styles.orb} ${styles.orbA}`} />
        <span className={`${styles.orb} ${styles.orbB}`} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Why <span className={styles.sun}>{name}</span>
          </h2>
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        </header>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title + i} item={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}