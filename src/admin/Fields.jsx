import { useState } from 'react';
import { api } from '../api.js';

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  return (await api('/api/upload', { method: 'POST', body: fd, auth: true })).url;
}

export function Field({ obj, f, refresh }) {
  const [status, setStatus] = useState('');
  const isMedia = f.t === 'image' || f.t === 'video';
  const set = (v) => { obj[f.k] = v; refresh(); };

  async function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setStatus('Uploading to Cloudinary...');
    try { set(await uploadFile(file)); setStatus('Uploaded. Click "Save All Changes".'); }
    catch (err) { setStatus('Error: ' + err.message); }
  }
  return (
    <div className="field">
      <label>{f.l}</label>
      {f.t === 'select'
        ? (
          <select value={obj[f.k] || f.o[0][0]} onChange={(e) => set(e.target.value)}>
            {f.o.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        )
        : f.t === 'textarea'
        ? <textarea value={obj[f.k] || ''} onChange={(e) => set(e.target.value)} />
        : <input type={f.t === 'date' ? 'date' : 'text'} value={obj[f.k] || ''} onChange={(e) => set(e.target.value)} placeholder={isMedia ? 'Paste URL or upload a file below' : ''} />}
      {f.h && <small className="hint">{f.h}</small>}
      {isMedia && (
        <>
          <div className="up"><input type="file" accept={f.t === 'video' ? 'video/*' : 'image/*'} onChange={onFile} /><span>{status}</span></div>
          {obj[f.k] && (f.t === 'video'
            ? <video className="prev" src={obj[f.k]} controls />
            : <img className="prev" src={obj[f.k]} alt="" />)}
        </>
      )}
    </div>
  );
}

export const Fields = ({ obj, fields, refresh }) => fields.map((f) => <Field key={f.k} obj={obj} f={f} refresh={refresh} />);

export function ListEditor({ arr, s, refresh, toast }) {
  const [st, setSt] = useState('');
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; refresh(); };

  async function bulk(e) {
    const files = [...e.target.files];
    let n = 0;
    for (const file of files) {
      setSt(`Uploading ${++n}/${files.length}...`);
      try { arr.push({ [s.bulk]: await uploadFile(file), caption: '' }); refresh(); } catch (err) { toast(err.message); }
    }
    setSt('Done. Click "Save All Changes".');
  }
  return (
    <>
      {arr.map((item, i) => (
        <div className="item" key={i}>
          <div className="item-head">
            <span>{s.name} {i + 1}</span>
            <span>
              <button className="mini" onClick={() => move(i, -1)}>&uarr;</button>{' '}
              <button className="mini" onClick={() => move(i, 1)}>&darr;</button>{' '}
              {!s.fixed && <button className="del" onClick={() => { arr.splice(i, 1); refresh(); }}>Delete</button>}
            </span>
          </div>
          <Fields obj={item} fields={s.fields} refresh={refresh} />
        </div>
      ))}
      {!s.fixed && <button className="add" onClick={() => { arr.push({}); refresh(); }}>+ Add {s.name}</button>}
      {s.bulk && <div className="up">Upload multiple: <input type="file" accept="image/*" multiple onChange={bulk} /><span>{st}</span></div>}
    </>
  );
}
