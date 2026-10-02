// Cloudinary / Unsplash links -> smaller, faster, auto-format (webp/avif) images.
export function opt(url, w = 800) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/') && !/\/upload\/[^/]*(f_auto|q_auto|w_)/.test(url)) {
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${w}/`);
  }
  if (url.includes('images.unsplash.com')) return url.replace(/([?&])w=\d+/, `$1w=${w}`);
  return url;
}
export const srcSet = (url, widths = [400, 800, 1200]) =>
  url && (url.includes('res.cloudinary.com') || url.includes('images.unsplash.com')) ? widths.map((w) => `${opt(url, w)} ${w}w`).join(', ') : undefined;
