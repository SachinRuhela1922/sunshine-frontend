import { opt } from '../img.js';
import { useContent } from '../content.jsx';
export default function PageBanner({ page }) {
  const p = useContent().data.pages?.[page] || {};
  return (
    <div className="banner" style={p.banner ? { backgroundImage: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url(${opt(p.banner, 1400)})` } : {}}>
      <h1>{p.title}</h1><p>{p.subtitle}</p>
    </div>
  );
}
