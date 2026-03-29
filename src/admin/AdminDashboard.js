// src/admin/AdminDashboard.js
import React, { useState } from 'react';
import PhotoManager   from './PhotoManager';
import AboutEditor    from './AboutEditor';
import WorkManager    from './WorkManager';
import ContactEditor  from './ContactEditor';
import HomeEditor     from './HomeEditor';
import ServicesEditor from './ServicesEditor';
import CVEditor       from './CVEditor';

const TABS = [
  { id:'home',     emoji:'🏠', label:'Home / Hero' },
  { id:'about',    emoji:'👤', label:'About Me' },
  { id:'work',     emoji:'💼', label:'Work / Projects' },
  { id:'gallery',  emoji:'📷', label:'Photography' },
  { id:'services', emoji:'⚙️', label:'Services' },
  { id:'cv',       emoji:'📄', label:'CV / Resume' },
  { id:'contact',  emoji:'📬', label:'Contact' },
];

export default function AdminDashboard({ onLock }) {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', fontFamily:"'DM Sans',sans-serif" }}>
      <aside style={{
        width:185, flexShrink:0,
        borderRight:'1px solid rgba(255,255,255,0.06)',
        background:'rgba(0,0,0,0.2)',
        display:'flex', flexDirection:'column',
        padding:'16px 10px', overflowY:'auto',
      }}>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', letterSpacing:'2px', fontFamily:"'Syne',sans-serif", fontWeight:700, padding:'0 8px', marginBottom:10 }}>
          SECTIONS
        </div>
        <nav style={{ display:'flex', flexDirection:'column', gap:2, flex:1 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab===t.id ? 'rgba(138,92,246,0.18)' : 'transparent',
              border:'none',
              borderLeft:`2px solid ${tab===t.id?'#8a5cf6':'transparent'}`,
              borderRadius:'0 10px 10px 0',
              padding:'9px 12px',
              color: tab===t.id ? '#a78bfa' : 'rgba(255,255,255,0.4)',
              fontSize:12, fontWeight:600,
              fontFamily:"'Syne',sans-serif",
              cursor:'pointer', textAlign:'left',
              transition:'all 0.15s',
              display:'flex', alignItems:'center', gap:7,
            }}
            onMouseEnter={e=>{ if(tab!==t.id) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
            onMouseLeave={e=>{ if(tab!==t.id) e.currentTarget.style.background='transparent'; }}
            >
              <span style={{ fontSize:14 }}>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onLock} style={{
            width:'100%', background:'rgba(248,113,113,0.08)',
            border:'1px solid rgba(248,113,113,0.2)',
            borderRadius:9, padding:'8px 12px',
            color:'#f87171', fontSize:11,
            fontFamily:"'Syne',sans-serif", fontWeight:700, cursor:'pointer',
          }}>🔒 Lock Panel</button>
        </div>
      </aside>

      <main className="admin-panel-scroll" style={{ flex:1, overflowY:'auto', padding:'22px 26px' }}>
        {tab==='home'     && <HomeEditor />}
        {tab==='about'    && <AboutEditor />}
        {tab==='work'     && <WorkManager />}
        {tab==='gallery'  && <PhotoManager />}
        {tab==='services' && <ServicesEditor />}
        {tab==='cv'       && <CVEditor />}
        {tab==='contact'  && <ContactEditor />}
      </main>
    </div>
  );
}