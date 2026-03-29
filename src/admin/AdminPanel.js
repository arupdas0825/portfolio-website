// src/admin/AdminPanel.js
import React, { useState, useEffect, useRef } from 'react';
import AdminDashboard from './AdminDashboard';

const ADMIN_PASSWORD = 'Arup@0825'; // ✏️ change this
const SESSION_KEY    = 'arup_admin_v2';

export default function AdminPanel({ onClose }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);
  const [mounted, setMounted]   = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setUnlocked(true);
    const onKey = e => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    setTimeout(() => inputRef.current?.focus(), 400);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => { setMounted(false); setTimeout(onClose, 300); };

  const handleUnlock = e => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setUnlocked(true); setError('');
    } else {
      setError('Incorrect password');
      setShake(true); setPassword('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false); setPassword('');
  };

  return (
    <>
      <style>{`
        @keyframes adminBack { from{opacity:0} to{opacity:1} }
        @keyframes adminUp   { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shakeIt   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes borderSpin{ from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        .admin-panel-scroll::-webkit-scrollbar{width:4px}
        .admin-panel-scroll::-webkit-scrollbar-track{background:transparent}
        .admin-panel-scroll::-webkit-scrollbar-thumb{background:rgba(138,92,246,0.4);border-radius:2px}
      `}</style>

      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position:'fixed', inset:0, zIndex:1400,
        background:'rgba(5,3,15,0.8)',
        backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        animation:'adminBack 0.25s ease',
        opacity: mounted ? 1 : 0,
        transition:'opacity 0.3s',
      }}/>

      {/* Wrapper — always centered, no size transition */}
      <div style={{
        position:'fixed', inset:0, zIndex:1500,
        display:'flex', alignItems:'center', justifyContent:'center',
        pointerEvents:'none',
      }}>
        <div style={{
          pointerEvents:'all',
          width: unlocked ? 'min(94vw, 1080px)' : '380px',
          height: unlocked ? 'min(90vh, 780px)' : 'auto',
          background:'rgba(8,6,20,0.95)',
          border:'1px solid rgba(138,92,246,0.35)',
          borderRadius:24,
          boxShadow:'0 0 0 1px rgba(255,255,255,0.05) inset, 0 2px 0 rgba(255,255,255,0.07) inset, 0 40px 100px rgba(0,0,0,0.85), 0 0 60px rgba(138,92,246,0.12)',
          overflow:'hidden',
          display:'flex', flexDirection:'column',
          animation:'adminUp 0.35s cubic-bezier(0.22,1,0.36,1)',
          transition:'width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)',
          opacity: mounted ? 1 : 0,
        }}>

          {/* Top sheen */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(138,92,246,0.9),rgba(192,132,252,0.6),transparent)',pointerEvents:'none',zIndex:10}}/>

          {/* Header */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 20px', flexShrink:0,
            borderBottom:'1px solid rgba(255,255,255,0.06)',
            background:'rgba(138,92,246,0.05)',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#8a5cf6,#c084fc)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:'#fff',boxShadow:'0 0 14px rgba(138,92,246,0.5)'}}>AD</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:'#fff'}}>Portfolio CMS</div>
                <div style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'rgba(255,255,255,0.35)'}}>
                  <span style={{width:5,height:5,borderRadius:'50%',background:unlocked?'#22c55e':'#f87171',display:'inline-block'}}/>
                  {unlocked ? 'Session active' : 'Locked'}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              {unlocked && (
                <button onClick={handleLock} style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:8,padding:'5px 11px',color:'#f87171',fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:'pointer'}}>
                  🔒 Lock
                </button>
              )}
              <button onClick={handleClose} style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(248,113,113,0.2)';e.currentTarget.style.color='#f87171'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.5)'}}
              >✕</button>
            </div>
          </div>

          {/* Body */}
          {!unlocked ? (
            <div style={{padding:'40px 32px',display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{fontSize:32,marginBottom:14}}>🔐</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.3rem',color:'#fff',marginBottom:6,textAlign:'center'}}>Enter Password</h2>
              <p style={{color:'rgba(255,255,255,0.3)',fontSize:12,marginBottom:28,textAlign:'center'}}>Admin access only</p>
              <form onSubmit={handleUnlock} style={{width:'100%'}}>
                <div style={{animation:shake?'shakeIt 0.5s ease':'none',marginBottom:14}}>
                  <input
                    ref={inputRef}
                    type="password" value={password}
                    onChange={e=>{setPassword(e.target.value);setError('');}}
                    placeholder="••••••••••"
                    style={{
                      width:'100%', background:'rgba(255,255,255,0.06)',
                      border:`1px solid ${error?'rgba(248,113,113,0.5)':'rgba(138,92,246,0.35)'}`,
                      borderRadius:12, padding:'13px 16px',
                      color:'#fff', fontSize:20, outline:'none',
                      textAlign:'center', letterSpacing:'6px',
                      fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box',
                      transition:'border-color 0.2s',
                    }}
                  />
                  {error && <p style={{color:'#f87171',fontSize:12,textAlign:'center',marginTop:6}}>{error}</p>}
                </div>
                <button type="submit" style={{
                  width:'100%', background:'linear-gradient(135deg,#8a5cf6,#c084fc)',
                  border:'none', borderRadius:11, padding:'13px',
                  color:'#fff', fontSize:14, fontWeight:700,
                  fontFamily:"'Syne',sans-serif", cursor:'pointer',
                  boxShadow:'0 0 24px rgba(138,92,246,0.35)',
                }}>Unlock →</button>
              </form>
            </div>
          ) : (
            <AdminDashboard onLock={handleLock} />
          )}
        </div>
      </div>
    </>
  );
}