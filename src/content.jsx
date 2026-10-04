import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';
import fallback from './fallbackContent.js';
import { opt } from './img.js';
import { yearsSince } from './utils.js';

const Ctx = createContext(null);
export const useContent = () => useContext(Ctx);

// keys the server doesn't have yet (older backend / new sections) are taken from the built-in copy
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
function fill(d, def) {
  const out = { ...d };
  for (const k of Object.keys(def)) {
    if (out[k] === undefined) out[k] = def[k];
    else if (isObj(out[k]) && isObj(def[k])) out[k] = fill(out[k], def[k]);
  }
  return out;
}

// "Years of Excellence" is always calculated from the established date (04 July 2003 by default)
function withYears(d) {
  if (!d || !Array.isArray(d.stats)) return d;
  const y = String(yearsSince(d.general?.established));
  return { ...d, stats: d.stats.map((s) => (s && /years/i.test(s.label || '') ? { ...s, value: y } : s)) };
}

const KEY = 'sunshine_content_v1';
const readCache = () => { try { const d = JSON.parse(localStorage.getItem(KEY)); return d ? withYears(fill(d, fallback)) : null; } catch { return null; } };
const writeCache = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage full / blocked */ } };

// only the images that are visible first are waited for (logo, hero poster, first photos)
const critical = (d) => [d.general?.logo, d.hero?.poster, d.about?.image].filter(Boolean).map((u) => opt(u, 700));
const preload = (urls, ms) => Promise.race([
  Promise.all(urls.map((u) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = u; }))),
  new Promise((r) => setTimeout(r, ms))
]);

export function ContentProvider({ children }) {
  const cached = readCache();
  // returning visitors get the saved copy instantly (no waiting), fresh data replaces it in the background
  const [state, setState] = useState({ data: cached, ready: !!cached, error: false, offline: false });

  useEffect(() => {
    let alive = true, tries = 0, timer;
    const load = () => {
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 9000));
      Promise.race([api('/api/content'), timeout])
        .then(async (data) => {
          writeCache(data);
          if (!cached && tries === 0) await preload(critical(data), 2500);
          if (alive) setState({ data: withYears(fill(data, fallback)), ready: true, error: false, offline: false });
        })
        .catch(() => {
          if (!alive) return;
          // server slow / sleeping / down: open the site with the built-in content, keep retrying quietly
          if (!cached && tries === 0) setState({ data: withYears(fallback), ready: true, error: false, offline: true });
          if (++tries < 8) timer = setTimeout(load, 8000);
        });
    };
    load();
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
