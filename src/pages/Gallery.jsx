import { useState } from 'react';
import { useContent } from '../content.jsx';
import { opt } from '../img.js';
import PageBanner from '../components/PageBanner.jsx';

export default function Gallery() {
  const { data } = useContent();
  const [big, setBig] = useState(null);
  return (
    <>
      <PageBanner page="gallery" />
      <section className="gallery">
        <div className="grid">
          {data.gallery.map((g, i) => <img key={i} src={opt(g.image, 500)} alt={g.caption} title={g.caption} loading="lazy" decoding="async" onClick={() => setBig(g)} />)}
        </div>
      </section>
      {big && <div id="lightbox" onClick={() => setBig(null)}><img src={opt(big.image, 1600)} alt={big.caption} /></div>}
    </>
  );
}
