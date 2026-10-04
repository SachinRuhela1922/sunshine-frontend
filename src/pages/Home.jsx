import { lazy, Suspense } from 'react';
import Hero from '../components/Hero/Hero.jsx';
import WhySunshine from '../components/Whysunshine/Whysunshine.jsx';
import { AboutSection, NewsSection, EventsSection, SocialSection, TestimonialsSection } from '../components/HomeSections/HomeSections.jsx';

// heavy sections far down the page load in the background after the top of the page is ready
const Different = lazy(() => import('../components/Different/Different.jsx'));
const Leadership = lazy(() => import('../components/Leadership/Leadership.jsx'));
const Journey = lazy(() => import('../components/Journey/Journey.jsx'));
const Campus = lazy(() => import('../components/Campus/Campus.jsx'));
const Achievers = lazy(() => import('../components/Achievers/Achievers.jsx'));
const Visit = lazy(() => import('../components/Visit/Visit.jsx'));

const Hold = ({ h = 500, children }) => <Suspense fallback={<div style={{ minHeight: h }} />}>{children}</Suspense>;

export default function Home() {
  return (
    <>
      <Hero />
      <WhySunshine />
      <AboutSection />
      <Hold h={700}><Leadership /></Hold>
      <Hold><Different /></Hold>
      <Hold><Journey /></Hold>
      <NewsSection />
      <EventsSection />
      <Hold h={900}><Campus /></Hold>
      <SocialSection />
      <TestimonialsSection />
      <Hold h={900}><Achievers /></Hold>
      <Hold h={900}><Visit /></Hold>
    </>
  );
}
