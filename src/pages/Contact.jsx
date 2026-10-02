import { useState } from 'react';
import { useContent } from '../content.jsx';
import { api } from '../api.js';
import PageBanner from '../components/PageBanner.jsx';

export default function Contact() {
  const { data } = useContent();
  const g = data.general;
  const empty = { name: '', phone: '', email: '', message: '' };
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg('Sending...');
    try { await api('/api/enquiries', { method: 'POST', body: f }); setMsg('Thank you! We will contact you soon.'); setF(empty); }
    catch (err) { setMsg('Error: ' + err.message); }
  }
  return (
    <>
      <PageBanner page="contact" />
      <section>
        <div className="about">
          <div>
            <h3>Get in touch</h3>
            <p><b>Address:</b> {g.address}</p>
            <p><b>Phone:</b> {g.phone}</p>
            <p><b>Email:</b> {g.email}</p>
            {g.mapEmbed && <iframe className="map" title="map" src={g.mapEmbed} loading="lazy" />}
          </div>
          <form className="cform" onSubmit={submit}>
            <h3>Send us a message</h3>
            <input placeholder="Your name *" value={f.name} onChange={set('name')} required />
            <input placeholder="Phone" value={f.phone} onChange={set('phone')} />
            <input type="email" placeholder="Email" value={f.email} onChange={set('email')} />
            <textarea placeholder="Message *" value={f.message} onChange={set('message')} required />
            <button className="btn">Send Message</button>
            {msg && <p>{msg}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
