import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContentProvider } from './content.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// every page is its own small file that loads only when it is opened (faster first load)
const About = lazy(() => import('./pages/About.jsx'));
const Programs = lazy(() => import('./pages/CardPages.jsx').then((m) => ({ default: m.Programs })));
const Facilities = lazy(() => import('./pages/CardPages.jsx').then((m) => ({ default: m.Facilities })));
const Teachers = lazy(() => import('./pages/CardPages.jsx').then((m) => ({ default: m.Teachers })));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const News = lazy(() => import('./pages/NewsEvents.jsx').then((m) => ({ default: m.News })));
const Events = lazy(() => import('./pages/NewsEvents.jsx').then((m) => ({ default: m.Events })));
const Social = lazy(() => import('./pages/Social.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route element={<ContentProvider><Layout /></ContentProvider>}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/social" element={<Social />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<p className="center">Page not found</p>} />
      </Route>
    </Routes>
  );
}
