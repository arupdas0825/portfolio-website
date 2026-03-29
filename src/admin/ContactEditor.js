// src/admin/ContactEditor.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { S, Msg, Field } from './AdminStyles';

export default function ContactEditor() {
  const [form, setForm] = useState({
    email:'arupdas0825@gmail.com',
    location:'Kolkata, West Bengal, India',
    university:'Brainware University, Kolkata',
    github:'https://github.com/arupdas0825',
    linkedin:'https://linkedin.com/in/arupdas0825',
    facebook:'https://facebook.com/arupdas0825',
    instagram:'https://instagram.com/arupdas0825',
    availableForWork: true,
  });
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');

  useEffect(() => {
    getDoc(doc(db,'siteData','contact'))
      .then(snap => { if (snap.exists()) setForm(f=>({...f,...snap.data()})); })
      .catch(e => setMsg('❌ Load error: '+e.message))
      .finally(() => setLoading(false));
  }, []);

  const f = k => ({ value: form[k]||'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await setDoc(doc(db,'siteData','contact'), form, { merge:true });
      setMsg('✅ Contact saved! Refresh portfolio to see changes.');
    } catch(e) { setMsg('❌ Save failed: '+e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{color:'rgba(255,255,255,0.4)',padding:20}}>Loading...</div>;

  return (
    <div>
      <h2 style={S.heading}>📬 Contact Editor</h2>
      <p style={S.sub}>Update contact info and social links</p>

      <div style={S.card}>
        <div style={S.cardTitle}>Contact Info</div>
        <Field label="Email" placeholder="your@email.com" {...f('email')}/>
        <Field label="Location" placeholder="Kolkata, India" {...f('location')}/>
        <Field label="University" placeholder="Brainware University" {...f('university')}/>
        <div style={S.field}>
          <label style={S.label}>Available for Work</label>
          <select style={S.input} value={form.availableForWork?.toString()}
            onChange={e=>setForm(p=>({...p,availableForWork:e.target.value==='true'}))}>
            <option value="true">✅ Yes — Available</option>
            <option value="false">🔴 Not available</option>
          </select>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Social Links</div>
        <div style={S.grid2}>
          <Field label="GitHub" placeholder="https://github.com/..." {...f('github')}/>
          <Field label="LinkedIn" placeholder="https://linkedin.com/..." {...f('linkedin')}/>
          <Field label="Facebook" placeholder="https://facebook.com/..." {...f('facebook')}/>
          <Field label="Instagram" placeholder="https://instagram.com/..." {...f('instagram')}/>
        </div>
      </div>

      <Msg text={msg}/>
      <button style={S.btnPrimary} onClick={save} disabled={saving}>
        {saving ? 'Saving...' : '💾 Save Contact'}
      </button>
    </div>
  );
}