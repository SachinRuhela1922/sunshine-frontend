import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function SocialStatus() {
  const [st, setSt] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => {
    setBusy(true);
    api('/api/social/status', { auth: true }).then(setSt).catch((e) => setSt({ error: e.message })).finally(() => setBusy(false));
  };
  useEffect(() => { load(); }, []);

  const row = (name, x) => (
    <div className="item" key={name}>
      <div className="item-head"><span>{name}</span></div>
      {!x.configured && <p>Not connected. Add the token in <b>backend/.env</b> and restart the backend.</p>}
      {x.configured && x.ok && <p style={{ color: '#16a34a' }}>Connected. {x.count} posts found. They appear on the website automatically.</p>}
      {x.configured && !x.ok && <p className="err">Error from Meta: {x.error}</p>}
    </div>
  );
  return (
    <>
      <p style={{ marginBottom: 14 }}>New posts on Instagram / Facebook show on the website automatically (checked every 10 minutes).</p>
      <button className="add" onClick={load} disabled={busy}>{busy ? 'Checking...' : 'Check connection now'}</button>
      <div style={{ marginTop: 14 }}>
        {st?.error && <p className="err">{st.error}</p>}
        {st?.instagram && row('Instagram', st.instagram)}
        {st?.facebook && row('Facebook', st.facebook)}
      </div>
    </>
  );
}
