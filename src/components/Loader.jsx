import { useEffect, useState } from 'react';

export default function Loader({ done }) {
  const [gone, setGone] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!done) { const t = setTimeout(() => setSlow(true), 4000); return () => clearTimeout(t); }
    const t = setTimeout(() => setGone(true), 500);
    return () => clearTimeout(t);
  }, [done]);
  if (gone) return null;
  return (
    <div id="loader" className={done ? 'hide' : ''} role="status" aria-live="polite">
      <div className="loader-ring">
        <div className="spinner" />
        <img src="/favicon.svg" alt="" width="34" height="34" />
      </div>
      <p>Loading Sunshine School...</p>
      {slow && !done && <small>Server is waking up, please wait a moment...</small>}
    </div>
  );
}
