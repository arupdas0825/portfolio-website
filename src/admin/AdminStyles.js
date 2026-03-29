// src/admin/adminStyles.js — shared styles
export const S = {
  heading:    { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.3rem',color:'#fff',marginBottom:4 },
  sub:        { color:'rgba(255,255,255,0.35)',fontSize:12,marginBottom:20 },
  card:       { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'20px',marginBottom:18 },
  cardTitle:  { fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:'#a78bfa',marginBottom:14 },
  grid2:      { display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 },
  grid3:      { display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12 },
  field:      { marginBottom:12 },
  label:      { display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.45)',marginBottom:5,fontFamily:"'Syne',sans-serif",letterSpacing:'0.3px' },
  input:      { width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:9,padding:'10px 13px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box',transition:'border-color 0.2s' },
  textarea:   { width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:9,padding:'10px 13px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box',resize:'vertical',minHeight:70 },
  btnPrimary: { background:'linear-gradient(135deg,#8a5cf6,#c084fc)',border:'none',borderRadius:9,padding:'10px 20px',color:'#fff',fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:'pointer',transition:'opacity 0.2s' },
  btnSecondary:{ background:'transparent',border:'1px solid rgba(255,255,255,0.12)',borderRadius:9,padding:'10px 20px',color:'rgba(255,255,255,0.55)',fontSize:13,fontFamily:"'Syne',sans-serif",cursor:'pointer' },
  btnDanger:  { background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:9,padding:'7px 12px',color:'#f87171',fontSize:11,fontWeight:600,cursor:'pointer' },
  btnEdit:    { flex:1,background:'rgba(138,92,246,0.15)',border:'1px solid rgba(138,92,246,0.25)',borderRadius:7,padding:'5px 10px',color:'#a78bfa',fontSize:11,fontWeight:600,cursor:'pointer' },
  tag:        { display:'inline-flex',alignItems:'center',gap:4,background:'rgba(138,92,246,0.12)',border:'1px solid rgba(138,92,246,0.2)',borderRadius:20,padding:'3px 10px',color:'#a78bfa',fontSize:11 },
  progress:   { height:5,background:'rgba(255,255,255,0.07)',borderRadius:99,overflow:'hidden',marginBottom:4 },
  progressBar:{ height:'100%',background:'linear-gradient(90deg,#8a5cf6,#c084fc)',borderRadius:99,transition:'width 0.3s' },
};

export const Msg = ({ text }) => {
  if (!text) return null;
  const color = text.startsWith('✅') ? '#4ade80' : text.startsWith('❌') ? '#f87171' : '#a78bfa';
  return <div style={{ padding:'8px 12px', borderRadius:8, fontSize:12, marginBottom:10, color, background:`${color}12`, border:`1px solid ${color}28` }}>{text}</div>;
};

export const Field = ({ label, value, onChange, placeholder, multiline, style }) => (
  <div style={{ marginBottom:12 }}>
    <label style={S.label}>{label}</label>
    {multiline
      ? <textarea style={{ ...S.textarea, ...style }} value={value} onChange={onChange} placeholder={placeholder}/>
      : <input style={{ ...S.input, ...style }} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={e=>e.target.style.borderColor='rgba(138,92,246,0.5)'}
          onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
        />
    }
  </div>
);