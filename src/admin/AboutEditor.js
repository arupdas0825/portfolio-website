// src/admin/AboutEditor.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { S, Msg, Field } from './AdminStyles';

export default function AboutEditor() {
  const [form, setForm] = useState({
    bio1: 'I am a detail-oriented Computer Science & Engineering student at Brainware University, specialising in Artificial Intelligence and Machine Learning. Based in Kolkata, I am passionate about bridging the gap between robust software architecture and intelligent system design.',
    bio2: 'With a strong foundation in Python, Java, C/C++, and Google Firebase, I focus on building scalable applications. My technical toolkit is complemented by a creative background in Photography and Professional Video Editing.',
    languages: 'Python,Java,C/C++,JavaScript,SQL,Firebase',
    specializations: 'AI / ML,Machine Learning,Mobile App Dev,React',
    creativeTools: 'Premiere Pro,After Effects,Photography',
  });
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');

  useEffect(() => {
    getDoc(doc(db, 'siteData', 'about'))
      .then(snap => { if (snap.exists()) setForm(f => ({ ...f, ...snap.data() })); })
      .catch(err => setMsg('❌ Load error: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const f = k => ({
    value: form[k] || '',
    onChange: e => setForm(prev => ({ ...prev, [k]: e.target.value })),
  });

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await setDoc(doc(db, 'siteData', 'about'), form, { merge: true });
      setMsg('✅ About section saved! Refresh portfolio to see changes.');
    } catch(e) {
      setMsg('❌ Save failed: ' + e.message);
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ color:'rgba(255,255,255,0.4)', padding:20 }}>Loading...</div>;

  return (
    <div>
      <h2 style={S.heading}>👤 About Me Editor</h2>
      <p style={S.sub}>Edit your bio and skill tags</p>

      <div style={S.card}>
        <div style={S.cardTitle}>Bio Paragraphs</div>
        <Field label="Paragraph 1" {...f('bio1')} multiline/>
        <Field label="Paragraph 2" {...f('bio2')} multiline/>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Skill Tags (comma separated)</div>
        <Field label="Languages" placeholder="Python,Java,C/C++,JavaScript" {...f('languages')}/>
        <Field label="Specializations" placeholder="AI / ML,Machine Learning,React" {...f('specializations')}/>
        <Field label="Creative Tools" placeholder="Premiere Pro,After Effects,Photography" {...f('creativeTools')}/>
      </div>

      <Msg text={msg}/>
      <button style={S.btnPrimary} onClick={save} disabled={saving}>
        {saving ? 'Saving...' : '💾 Save About'}
      </button>
    </div>
  );
}