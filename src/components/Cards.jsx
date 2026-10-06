import { useRef, useState } from 'react';
import { opt, srcSet, optVideo, videoPoster } from '../img.js';
export function CardGrid({ items, render }) {
  if (!items?.length) return <p className="center">Nothing here yet.</p>;
  return <div className="grid">{items.map((it, i) => <div className="card" key={i}>{render(it)}</div>)}</div>;
}
export const Img = ({ src }) => (src ? <img src={opt(src, 700)} srcSet={srcSet(src, [400, 700, 1000])} sizes="(max-width: 700px) 100vw, 400px" alt="" loading="lazy" decoding="async" /> : null);

// cover media: plays the video if one is set (image = thumbnail), otherwise shows the image
export function VideoCover({ image, video }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      // ek time pe ek hi video chale
      document.querySelectorAll('video.vc-video').forEach((x) => { if (x !== v) x.pause(); });
      v.play();
    } else v.pause();
  };

  const seek = (e) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * v.duration;
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = (e) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    (v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen)?.call(v);
  };

  return (
    <div className={'vc' + (playing ? ' is-playing' : '')} onClick={toggle}>
      <video
        ref={ref}
        className="vc-video"
        src={optVideo(video)}
        poster={image ? opt(image, 700) : videoPoster(video)}
        playsInline
        preload="metadata"
        onPlay={() => { setPlaying(true); setStarted(true); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
        }}
      />

      <span className="vc-badge">&#9654; VIDEO</span>

      {!playing && (
        <button type="button" className="vc-play" aria-label="Play video">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
        </button>
      )}

      {started && (
        <div className="vc-bar" onClick={(e) => e.stopPropagation()}>
          <div className="vc-track" onClick={seek}>
            <div className="vc-fill" style={{ width: progress + '%' }} />
          </div>
          <button type="button" className="vc-btn" onClick={toggleMute} aria-label="Mute">
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button type="button" className="vc-btn" onClick={fullscreen} aria-label="Fullscreen">&#x26F6;</button>
        </div>
      )}
    </div>
  );
}

export const Cover = ({ image, video }) => (video ? <VideoCover image={image} video={video} /> : <Img src={image} />);export const infoCard = (i) => (<><Img src={i.image} /><div><h3>{i.title}</h3><p>{i.desc}</p></div></>);
export const dateCard = (i) => (<><Img src={i.image} /><div><small className="date">{i.date}</small><h3>{i.title}</h3><p>{i.desc}</p></div></>);
export const eventCard = (i) => (<><Cover image={i.image} video={i.video} /><div><small className="date">{i.date}</small><h3>{i.title}</h3><p>{i.desc}</p></div></>);
export const teacherCard = (i) => (<><Img src={i.image} /><div><h3>{i.name}</h3><p>{i.role}</p></div></>);
