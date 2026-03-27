// src/admin/ContactEditor.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ContactEditor() {
  const [form, setForm] = useState({
    email:'', location:'', university:'',
    github:'', linkedin:'', facebook:'', instagram:'',
    whatsapp:'', availableForWork: true,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    getDoc(doc(db, 'siteData', 'contact')).then(snap => {
      if (snap.exists()) setForm(f => ({ ...f, ...snap.data() }));
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await setDoc(doc(db, 'siteData', 'contact'), form);
      setMsg('✅ Contact details saved!');
    } catch(e) { setMsg('❌ ' + e.message); }
    finally { setSaving(false); }
  };

  const F = (key, label, placeholder, type='text') => (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={placeholder}/>
    </div>
  );

  return (
    <div>
      <h2 style={S.heading}>📬 Contact Details Editor</h2>
      <p style={S.sub}>Update your contact info and social links</p>

      <div style={S.card}>
        <h3 style={S.cardTitle}>Contact Info</h3>
        {F('email','Email','arupdas0825@gmail.com','email')}
        {F('location','Location','Kolkata, West Bengal, India')}
        {F('university','University / Institution','Brainware University, Kolkata')}

        <div style={S.field}>
          <label style={S.label}>Available for Work</label>
          <select style={S.input} value={form.availableForWork.toString()} onChange={e=>setForm({...form,availableForWork:e.target.value==='true'})}>
            <option value="true">✅ Yes — Available for opportunities</option>
            <option value="false">🔴 No — Not available right now</option>
          </select>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>Social Links</h3>
        <div style={S.grid2}>
          {F('github','GitHub Profile URL','https://github.com/arupdas0825')}
          {F('linkedin','LinkedIn Profile URL','https://linkedin.com/in/arupdas0825')}
          {F('facebook','Facebook Profile URL','https://facebook.com/arupdas0825')}
          {F('instagram','Instagram Profile URL','https://instagram.com/arupdas0825')}
          {F('whatsapp','WhatsApp Number (with country code)','919XXXXXXXXX')}
        </div>
      </div>

      {/* Live Preview */}
      <div style={{...S.card, background:'rgba(138,92,246,0.06)', border:'1px solid rgba(138,92,246,0.2)'}}>
        <h3 style={S.cardTitle}>📋 Preview</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[
            {icon:'📧',label:'Email',val:form.email},
            {icon:'📍',label:'Location',val:form.location},
            {icon:'🎓',label:'University',val:form.university},
            {icon:'🐙',label:'GitHub',val:form.github},
            {icon:'💼',label:'LinkedIn',val:form.linkedin},
            {icon:'📘',label:'Facebook',val:form.facebook},
            {icon:'📸',label:'Instagram',val:form.instagram},
          ].map(({icon,label,val})=>(
            <div key={label} style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'10px 12px'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:2}}>{icon} {label}</div>
              <div style={{fontSize:12,color:'#e2d9f3',wordBreak:'break-all'}}>{val||'—'}</div>
            </div>
          ))}
        </div>
      </div>

      {msg && <div style={{color:msg.startsWith('✅')?'#4ade80':'#f87171',fontSize:13,marginBottom:14}}>{msg}</div>}
      <button style={S.btnPrimary} onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save Contact Details'}
      </button>
    </div>
  );
}

const S = {
  heading:{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.5rem',color:'#fff',marginBottom:4 },
  sub:    { color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:24 },
  card:   { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24,marginBottom:20 },
  cardTitle:{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#a78bfa',marginBottom:16 },
  grid2:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 },
  field:  { marginBottom:14 },
  label:  { display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:6,fontFamily:"'Syne',sans-serif" },
  input:  { width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box' },
  btnPrimary:{ background:'linear-gradient(135deg,#8a5cf6,#c084fc)',border:'none',borderRadius:10,padding:'12px 28px',color:'#fff',fontSize:14,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:'pointer' },
};