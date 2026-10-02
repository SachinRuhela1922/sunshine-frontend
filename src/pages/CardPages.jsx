import { useContent } from '../content.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { CardGrid, infoCard, teacherCard } from '../components/Cards.jsx';

const make = (page, key, render, cls = '') => function Page() {
  const { data } = useContent();
  return (<><PageBanner page={page} /><section className={cls}><CardGrid items={data[key]} render={render} /></section></>);
};
export const Programs = make('programs', 'programs', infoCard);
export const Facilities = make('facilities', 'facilities', infoCard);
export const Teachers = make('teachers', 'teachers', teacherCard, 'team');
