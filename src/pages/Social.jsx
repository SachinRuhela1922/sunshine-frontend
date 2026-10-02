import { useState } from 'react';
import PageBanner from '../components/PageBanner.jsx';
import SocialGrid, { usePosts } from '../components/SocialFeed.jsx';

export default function Social() {
  const posts = usePosts();
  const [tab, setTab] = useState('all');
  const shown = posts ? posts.filter((p) => tab === 'all' || p.platform === tab) : [];
  return (
    <>
      <PageBanner page="social" />
      <section>
        <p className="center tabs">
          {['all', 'instagram', 'facebook'].map((t) => (
            <button key={t} className={'tab' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </p>
        {!posts && <p className="center">Loading posts...</p>}
        {posts && !shown.length && <p className="center">No posts to show yet.</p>}
        {posts && shown.length > 0 && <SocialGrid posts={shown} />}
      </section>
    </>
  );
}
