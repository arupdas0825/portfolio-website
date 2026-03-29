// src/admin/CVEditor.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from './cloudinary';
import { S, Msg, Field } from './AdminStyles';

export default function CVEditor() {
  const [form, setForm]         = useState({ cvUrl:'/CV.pdf', viewLabel:'View CV', downloadLabel:'Download CV', previewName:'Arup Das', previewRole:'B.Tech CSE (AIML) · AI/ML Developer', previewUniversity:'Brainware University, Kolkata', skills:'Python · Java · React · Firebase · C/C++', creative:'Photography · Premiere Pro · After Effects' });
  const [file, setFile]         = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    getDoc(doc(db,'siteData','cv')).then(s => s.exists() && setForm(f=>({...f,...s.data()})));
  }, []);

  const f = k => ({ value:form[k], onChange:e=>setForm({...form,[k]:e.target.value}) });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setMsg('');
    try {
      const { url } = await uploadToCloudinary(file, 'portfolio/cv', setProgress);
      setForm(prev => ({...prev, cvUrl: url}));
      setMsg('✅ CV uploaded! Click Save to apply.');
    } catch(e) { setMsg('❌ '+e.message); }
    finally { setUploading(false); setProgress(0); }
  };

  const save = async () => {
    setSaving(true); setMsg('');
    try { await setDoc(doc(db,'siteData','cv'), form); setMsg('✅ CV section saved!'); }
    catch(e) { setMsg('❌ '+e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={S.heading}>📄 CV / Resume Editor</h2>
      <p style={S.sub}>Update your CV file and preview card</p>

      <div style={S.card}>
        <div style={S.cardTitle}>Upload New CV (PDF)</div>
        <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
          <input style={{...S.input,flex:1,padding:'7px 12px'}} type="file" accept=".pdf"
            onChange={e=>setFile(e.target.files[0])}/>
          <button style={S.btnPrimary} onClick={handleUpload} disabled={uploading||!file}>
            {uploading?`${progress}%...`:'⬆️ Upload'}
          </button>
        </div>
        {form.cvUrl && <p style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:8}}>Current: {form.cvUrl}</p>}
        {uploading && <div style={{...S.progress,marginTop:8}}><div style={{...S.progressBar,width:`${progress}%`}}/></div>}
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Button Labels</div>
        <div style={S.grid2}>
          <Field label="View Button Text" placeholder="View CV" {...f('viewLabel')}/>
          <Field label="Download Button Text" placeholder="Download CV" {...f('downloadLabel')}/>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Preview Card Info</div>
        <Field label="Your Name" placeholder="Arup Das" {...f('previewName')}/>
        <Field label="Role / Title" placeholder="B.Tech CSE (AIML) · AI/ML Developer" {...f('previewRole')}/>
        <Field label="University" placeholder="Brainware University, Kolkata" {...f('previewUniversity')}/>
        <Field label="Skills line" placeholder="Python · Java · React · Firebase" {...f('skills')}/>
        <Field label="Creative Skills" placeholder="Photography · Premiere Pro" {...f('creative')}/>
      </div>

      <Msg text={msg}/>
      <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving?'Saving...':'💾 Save CV Section'}</button>
    </div>
  );
}