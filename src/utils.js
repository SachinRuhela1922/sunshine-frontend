// Founding date helpers. The date comes from Admin -> General Info -> Established date (YYYY-MM-DD).
export const DEFAULT_ESTABLISHED = '2003-07-04';

export function parseDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || DEFAULT_ESTABLISHED) || /^(\d{4})-(\d{2})-(\d{2})/.exec(DEFAULT_ESTABLISHED);
  return new Date(+m[1], +m[2] - 1, +m[3]);
}

// full completed years since the date (04 Jul 2003 -> 23 in Oct 2026)
export function yearsSince(iso, now = new Date()) {
  const d = parseDate(iso);
  let y = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) y--;
  return Math.max(0, y);
}

// 2003-07-04 -> "4 July 2003"
export const fmtDate = (iso) => parseDate(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
