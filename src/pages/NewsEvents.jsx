import { useContent } from '../content.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { CardGrid, dateCard, eventCard } from '../components/Cards.jsx';

export function News() {
  const { data } = useContent();
  return (<><PageBanner page="news" /><section><CardGrid items={data.news} render={dateCard} /></section></>);
}
export function Events() {
  const { data } = useContent();
  return (<><PageBanner page="events" /><section><CardGrid items={data.events} render={eventCard} /></section></>);
}
