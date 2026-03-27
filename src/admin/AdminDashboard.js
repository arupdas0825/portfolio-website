// src/admin/AdminDashboard.js
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import PhotoManager   from './PhotoManager';
import AboutEditor    from './AboutEditor';
import WorkManager    from './WorkManager';
import ContactEditor  from './ContactEditor';

const TABS = [
  { id:'photos',  label:'📷', full:'Photography' },
  { id:'about',   label:'👤', full:'About' },
  { id:'work',    label:'💼', full:'Work / Projects' },
  { id:'contact', label:'📬', full:'Contact' },
];

export default function AdminDashboard({ user, onClose }) {
  const [tab, setTab] = useState('photos');

  return (
    <div style={{ display:'flex', height:'100%', fontFamily:"'DM Sans',sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width:200, flexShrink:0,
        borderRight:'1px solid rgba(255,255,255,0.06)',
        background:'rgba(255,255,255,0.02)',
        display:'flex', flexDirection:'column',
        padding:'20px 12px',
      }}>
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:'rgba(255,255,255,0.4)',letterSpacing:'1.5px',marginBottom:4}}>SIGNED IN AS</div>
          <div style={{fontSize:12,color:'#a78bfa',wordBreak:'break-all'}}>{user.email}</div>
        </div>

        <nav style={{display:'flex',flexDirection:'column',gap:3,flex:1}}>
          {TABS.map(t=>(
            <button
              key={t.id}
              onClick={()=>setTab(t.id)}
              style={{
                background: tab===t.id ? 'rgba(138,92,246,0.2)' : 'transparent',
                border: 'none',
                borderLeft: tab===t.id ? '2px solid #8a5cf6' : '2px solid transparent',
                borderRadius: '0 10px 10px 0',
                padding:'11px 14px',
                color: tab===t.id ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                fontSize:13, fontWeight:600,
                fontFamily:"'Syne',sans-serif",
                cursor:'pointer', textAlign:'left',
                transition:'all 0.2s',
                display:'flex',alignItems:'center',gap:8,
              }}
              onMouseEnter={e=>{ if(tab!==t.id) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
              onMouseLeave={e=>{ if(tab!==t.id) e.currentTarget.style.background='transparent'; }}
            >
              <span>{t.label}</span> {t.full}
            </button>
          ))}
        </nav>

        <button
          onClick={()=>signOut(auth)}
          style={{
            background:'rgba(248,113,113,0.08)',
            border:'1px solid rgba(248,113,113,0.2)',
            borderRadius:10,padding:'9px 14px',
            color:'#f87171',fontSize:12,
            fontFamily:"'Syne',sans-serif",fontWeight:600,
            cursor:'pointer',
          }}
        >
          🚪 Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main style={{flex:1,overflow:'auto',padding:'28px 32px'}}>
        {tab==='photos'  && <PhotoManager />}
        {tab==='about'   && <AboutEditor />}
        {tab==='work'    && <WorkManager />}
        {tab==='contact' && <ContactEditor />}
      </main>
    </div>
  );
}