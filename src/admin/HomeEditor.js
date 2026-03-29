// src/admin/HomeEditor.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { S, Msg, Field } from './AdminStyles';

export default function HomeEditor() {
  const [form, setForm] = useState({
    name:'Arup Das', role:'AI / ML Developer',
    description:"I'm a B.Tech CSE (AIML) student at Brainware University, Kolkata — building immersive AI-powered digital systems with design precision and engineering excellence.",
    location:'Based in Kolkata', status:'Available Now',
    cvUrl:'/CV.pdf',
    github:'https://github.com/arupdas0825',
    linkedin:'https://linkedin.com/in/arupdas0825',
    instagram:'https://instagram.com/arupdas0825',
    typewriterRoles:'AI / ML Developer,React Developer,Android App Developer,Full Stack Developer,Open Source Contributor,Photographer & Videographer,Problem Solver,B.Tech CSE (AIML) Student',
    orbitStat1Val:'4+', orbitStat1Label:'Projects',
    orbitStat2Val:'AI/ML', orbitStat2Label:'Focus',
    orbitStat3Val:'∞', orbitStat3Label:'Curiosity',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoc(doc(db,'siteData','home')).then(s => s.exists() && setForm(f=>({...f,...s.data()})));
  }, []);

  const f = k => ({ value:form[k], onChange:e=>setForm({...form,[k]:e.target.value}) });

  const save = async () => {
    setSaving(true); setMsg('');
    try { await setDoc(doc(db,'siteData','home'), form); setMsg('✅ Home section saved!'); }
    catch(e) { setMsg('❌ '+e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={S.heading}>🏠 Home / Hero Editor</h2>
      <p style={S.sub}>Edit your hero section content</p>

      <div style={S.card}>
        <div style={S.cardTitle}>Personal Info</div>
        <div style={S.grid2}>
          <Field label="Full Name" placeholder="Arup Das" {...f('name')}/>
          <Field label="Primary Role" placeholder="AI / ML Developer" {...f('role')}/>
        </div>
        <Field label="Description" placeholder="Short bio..." {...f('description')} multiline/>
        <div style={S.grid2}>
          <Field label="Location badge" placeholder="Based in Kolkata" {...f('location')}/>
          <Field label="Status badge" placeholder="Available Now" {...f('status')}/>
        </div>
        <Field label="CV/Resume URL" placeholder="/CV.pdf" {...f('cvUrl')}/>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Social Links</div>
        <div style={S.grid3}>
          <Field label="GitHub" placeholder="https://github.com/..." {...f('github')}/>
          <Field label="LinkedIn" placeholder="https://linkedin.com/..." {...f('linkedin')}/>
          <Field label="Instagram" placeholder="https://instagram.com/..." {...f('instagram')}/>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Typewriter Roles (comma separated)</div>
        <Field label="Roles — each becomes a cycling role" placeholder="AI/ML Developer,React Developer,..." {...f('typewriterRoles')} multiline/>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:4}}>Separate each role with a comma</p>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Orbital Widget Stats</div>
        <div style={S.grid3}>
          <Field label="Stat 1 Value" placeholder="4+" {...f('orbitStat1Val')}/>
          <Field label="Stat 2 Value" placeholder="AI/ML" {...f('orbitStat2Val')}/>
          <Field label="Stat 3 Value" placeholder="∞" {...f('orbitStat3Val')}/>
          <Field label="Stat 1 Label" placeholder="Projects" {...f('orbitStat1Label')}/>
          <Field label="Stat 2 Label" placeholder="Focus" {...f('orbitStat2Label')}/>
          <Field label="Stat 3 Label" placeholder="Curiosity" {...f('orbitStat3Label')}/>
        </div>
      </div>

      <Msg text={msg}/>
      <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving?'Saving...':'💾 Save Home'}</button>
    </div>
  );
}