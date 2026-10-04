import { useContent } from '../content.jsx';
import { opt } from '../img.js';
import PageBanner from '../components/PageBanner.jsx';
import Leadership from '../components/Leadership/Leadership.jsx';

export default function About() {
  const { data } = useContent();
  const a = data.about;
  return (
    <>
      <PageBanner page="about" />
      <section>
        <h2>{a.title}</h2>
        <div className="about">{a.image && <img src={opt(a.image, 900)} alt="" decoding="async" />}<p>{a.text}</p></div>
      </section>
      <section className="alt">
        <div className="grid two">
          <div className="card pad"><h3>Our Mission</h3><p>{a.mission}</p></div>
          <div className="card pad"><h3>Our Vision</h3><p>{a.vision}</p></div>
        </div>
      </section>
      <Leadership />
      <section className="stats"><div className="grid">
        {data.stats.map((s, i) => <div key={i}><b>{s.value}</b>{s.label}</div>)}
      </div></section>
    </>
  );
}
