import { useEffect, useState } from 'react';
import { api } from '../api.js';

export function usePosts() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    api('/api/social').then((r) => setPosts(r.posts || [])).catch(() => setPosts([]));
  }, []);
  return posts;
}

const NAMES = { instagram: 'Instagram', facebook: 'Facebook' };

function PostCard({ p }) {
  const text = p.text.length > 150 ? p.text.slice(0, 150) + '...' : p.text;
  return (
    <a className={'card post ' + p.platform} href={p.link} target="_blank" rel="noreferrer">
      {p.image ? <img src={p.image} alt="" loading="lazy" /> : <div className="noimg">{NAMES[p.platform]}</div>}
      <div>
        <small className="badge">{NAMES[p.platform]}{p.video ? ' \u25B6 Video' : ''} &middot; {new Date(p.date).toLocaleDateString()}</small>
        <p>{text}</p>
        <small className="view">View on {NAMES[p.platform]} &rarr;</small>
      </div>
    </a>
  );
}

export default function SocialGrid({ posts, limit }) {
  const list = limit ? posts.slice(0, limit) : posts;
  return <div className="grid">{list.map((p) => <PostCard key={p.id} p={p} />)}</div>;
}
