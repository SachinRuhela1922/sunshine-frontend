import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Enquiries({ toast }) {
  const [list, setList] = useState(null);
  const load = () => api('/api/enquiries', { auth: true }).then(setList).catch((e) => toast(e.message));
  useEffect(() => { load(); }, []);
  async function del(id) {
    if (!confirm('Delete this message?')) return;
    await api('/api/enquiries/' + id, { method: 'DELETE', auth: true });
    load();
  }
  if (!list) return <p>Loading...</p>;
  if (!list.length) return <p>No messages yet.</p>;
  return list.map((q) => (
    <div className="item" key={q._id}>
      <div className="item-head"><span>{q.name} <small>({new Date(q.createdAt).toLocaleString()})</small></span>
        <button className="del" onClick={() => del(q._id)}>Delete</button></div>
      <p>{q.message}</p>
      <small>{q.phone} {q.email && '| ' + q.email}</small>
    </div>
  ));
}
