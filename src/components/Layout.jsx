import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useContent } from '../content.jsx';
import Loader from './Loader.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { opt } from '../img.js';

export default function Layout() {
  const { ready, data } = useContent();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // browser tab title + icon follow the admin settings (school name and logo)
  const name = data?.general?.schoolName, logo = data?.general?.logo;
  useEffect(() => {
    if (name) document.title = data.general.tagline ? `${name} | ${data.general.tagline}` : name;
    if (logo) {
      let l = document.querySelector('link[rel="icon"]');
      if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); }
      l.type = ''; l.href = opt(logo, 96);
    }
  }, [name, logo]);

  return (
    <>
      <Loader done={ready} />
      {ready && (
        <>
          <Navbar />
          <main className={pathname === '/' ? 'home' : 'inner'}>
            <Suspense fallback={<div className="route-loading" />}><Outlet /></Suspense>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
