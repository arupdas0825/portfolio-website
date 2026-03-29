// src/admin/ServicesEditor.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { S, Msg, Field } from './AdminStyles';

const DEFAULT_SERVICES = [
  { name:'Web Development', desc:'Building responsive, modern web applications using React, JavaScript, and Tailwind CSS.', tags:'Responsive Design,React,Performance', color:'#60a5fa' },
  { name:'AI / ML Solutions', desc:'Designing and implementing intelligent systems — from Gemini AI integrations to ML models.', tags:'Gemini AI,ML Models,Data Analysis', color:'#c084fc' },
  { name:'Mobile App Dev', desc:'Creating Android applications with Kotlin, Firebase backend, and modern UI patterns.', tags:'Kotlin,Firebase,Android', color:'#f472b6' },
  { name:'Creative Direction', desc:"UI/UX design, video editing with Premiere Pro & After Effects, and visual storytelling.", tags:'Photography,Premiere Pro,After Effects', color:'#2dd4bf' },
  { name:'Data Analysis', desc:'Turning raw data into actionable insights using Python, SQL, and ML techniques.', tags:'Python,SQL,Visualization', color:'#4ade80' },
  { name:'Backend Systems', desc:'Building robust server-side logic with Java, Firebase, and REST APIs.', tags:'Java,Firebase,REST APIs', color:'#f87171' },
];

export default function ServicesEditor() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoc(doc(db,'siteData','services')).then(s => s.exists() && setServices(s.data().list || DEFAULT_SERVICES));
  }, []);

  const update = (i, key, val) => {
    const updated = [...services];
    updated[i] = {...updated[i], [key]: val};
    setServices(updated);
  };

  const save = async () => {
    setSaving(true); setMsg('');
    try { await setDoc(doc(db,'siteData','services'), { list: services }); setMsg('✅ Services saved!'); }
    catch(e) { setMsg('❌ '+e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={S.heading}>⚙️ Services Editor</h2>
      <p style={S.sub}>Edit your 6 service cards</p>

      {services.map((svc, i) => (
        <div key={i} style={S.card}>
          <div style={{...S.cardTitle, display:'flex', alignItems:'center', gap:8}}>
            <span style={{width:10,height:10,borderRadius:'50%',background:svc.color,display:'inline-block'}}/>
            Service {i+1}
          </div>
          <div style={S.grid2}>
            <Field label="Service Name" value={svc.name} onChange={e=>update(i,'name',e.target.value)} placeholder="Web Development"/>
            <Field label="Accent Color (hex)" value={svc.color} onChange={e=>update(i,'color',e.target.value)} placeholder="#60a5fa"/>
          </div>
          <Field label="Description" value={svc.desc} onChange={e=>update(i,'desc',e.target.value)} placeholder="Description..." multiline/>
          <Field label="Tags (comma separated)" value={svc.tags} onChange={e=>update(i,'tags',e.target.value)} placeholder="React,Firebase,..."/>
        </div>
      ))}

      <Msg text={msg}/>
      <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving?'Saving...':'💾 Save Services'}</button>
    </div>
  );
}