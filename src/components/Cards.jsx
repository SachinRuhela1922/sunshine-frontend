import { opt, srcSet } from '../img.js';
export function CardGrid({ items, render }) {
  if (!items?.length) return <p className="center">Nothing here yet.</p>;
  return <div className="grid">{items.map((it, i) => <div className="card" key={i}>{render(it)}</div>)}</div>;
}
export const Img = ({ src }) => (src ? <img src={opt(src, 700)} srcSet={srcSet(src, [400, 700, 1000])} sizes="(max-width: 700px) 100vw, 400px" alt="" loading="lazy" decoding="async" /> : null);

export const infoCard = (i) => (<><Img src={i.image} /><div><h3>{i.title}</h3><p>{i.desc}</p></div></>);
export const dateCard = (i) => (<><Img src={i.image} /><div><small className="date">{i.date}</small><h3>{i.title}</h3><p>{i.desc}</p></div></>);
export const teacherCard = (i) => (<><Img src={i.image} /><div><h3>{i.name}</h3><p>{i.role}</p></div></>);
