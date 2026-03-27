// src/admin/WorkManager.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from './cloudinary';

const COLL = 'projects';

export default function WorkManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name:'', desc:'', github:'', demo:'', tags:'', type:'primary' });
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLL), snap => {
      const d = snap.docs.map(x => ({ id:x.id, ...x.data() }));
      d.sort((a,b)=>(a.order||0)-(b.order||0));
      setProjects(d);
    });
    return unsub;
  }, []);

  const handleThumb = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setThumbFile(f);
    setThumbPreview(URL.createObjectURL(f));
  };

  const uploadThumb = (f) => uploadToCloudinary(f, 'portfolio/projects', setProgress);

  const handleSave = async () => {
    if (!form.name) return setMsg('Project name required.');
    setUploading(true); setMsg('');
    try {
      const data = {
        name: form.name, desc: form.desc,
        github: form.github, demo: form.demo,
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
        type: form.type,
      };
      if (thumbFile) {
        const { url, publicId } = await uploadThumb(thumbFile);
        data.thumbnail = url;
        data.thumbPublicId = publicId;
      }
      if (editing) {
        await updateDoc(doc(db, COLL, editing.id), data);
        setMsg('✅ Project updated!');
      } else {
        data.order = projects.length;
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, COLL), data);
        setMsg('✅ Project added!');
      }
      resetForm();
    } catch(e) { setMsg('❌ ' + e.message); }
    finally { setUploading(false); setProgress(0); }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name:p.name||'', desc:p.desc||'', github:p.github||'', demo:p.demo||'', tags:(p.tags||[]).join(', '), type:p.type||'primary' });
    setThumbPreview(p.thumbnail||'');
    setThumbFile(null);
    window.scrollTo(0,0);
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    await deleteDoc(doc(db, COLL, p.id));
    // Image stays on Cloudinary free tier (no server-side delete needed)
    setMsg('🗑️ Deleted.');
  };

  const resetForm = () => { setEditing(null); setForm({ name:'', desc:'', github:'', demo:'', tags:'', type:'primary' }); setThumbFile(null); setThumbPreview(''); };

  const primary   = projects.filter(p => p.type !== 'secondary');
  const secondary = projects.filter(p => p.type === 'secondary');

  return (
    <div>
      <h2 style={S.heading}>💼 Work / Projects Manager</h2>
      <p style={S.sub}>{primary.length} primary · {secondary.length} secondary projects</p>

      {/* Form */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>{editing ? '✏️ Edit Project' : '➕ Add Project'}</h3>

        <div style={S.grid2}>
          <div style={S.field}>
            <label style={S.label}>Project Name *</label>
            <input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="studytra"/>
          </div>
          <div style={S.field}>
            <label style={S.label}>Type</label>
            <select style={S.input} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="primary">⭐ Primary Project</option>
              <option value="secondary">📌 Secondary Project</option>
            </select>
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Description</label>
          <textarea style={{...S.input,height:70,resize:'vertical'}} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="What this project does..."/>
        </div>

        <div style={S.grid2}>
          <div style={S.field}>
            <label style={S.label}>GitHub URL</label>
            <input style={S.input} value={form.github} onChange={e=>setForm({...form,github:e.target.value})} placeholder="https://github.com/..."/>
          </div>
          <div style={S.field}>
            <label style={S.label}>Live Demo URL</label>
            <input style={S.input} value={form.demo} onChange={e=>setForm({...form,demo:e.target.value})} placeholder="https://..."/>
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Tech Tags (comma separated)</label>
          <input style={S.input} value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="React, Firebase, Gemini AI"/>
        </div>

        <div style={S.field}>
          <label style={S.label}>Thumbnail Image {editing ? '(optional — keep current)' : ''}</label>
          <input style={{...S.input,padding:'8px 12px'}} type="file" accept="image/*" onChange={handleThumb}/>
        </div>

        {thumbPreview && <img src={thumbPreview} alt="thumb" style={{width:'100%',maxHeight:160,objectFit:'cover',borderRadius:10,marginBottom:14}}/>}

        {uploading && (
          <div style={{marginBottom:12}}>
            <div style={{height:5,background:'rgba(255,255,255,0.07)',borderRadius:99}}>
              <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#8a5cf6,#c084fc)',borderRadius:99}}/>
            </div>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:3}}>{progress}%</p>
          </div>
        )}

        {msg && <div style={{color:msg.startsWith('✅')?'#4ade80':'#f87171',fontSize:13,marginBottom:12}}>{msg}</div>}

        <div style={{display:'flex',gap:10}}>
          <button style={S.btnPrimary} onClick={handleSave} disabled={uploading}>{uploading?'Saving...':editing?'Update':'Add Project'}</button>
          {editing && <button style={S.btnSecondary} onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      {/* Primary Projects */}
      {primary.length > 0 && (
        <>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#facc15',marginBottom:12}}>⭐ Primary Projects</h3>
          <div style={S.projGrid}>
            {primary.map(p => <ProjectCard key={p.id} p={p} onEdit={handleEdit} onDelete={handleDelete}/>)}
          </div>
        </>
      )}

      {/* Secondary Projects */}
      {secondary.length > 0 && (
        <>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#a78bfa',marginBottom:12,marginTop:24}}>📌 Secondary Projects</h3>
          <div style={S.projGrid}>
            {secondary.map(p => <ProjectCard key={p.id} p={p} onEdit={handleEdit} onDelete={handleDelete}/>)}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ p, onEdit, onDelete }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, overflow:'hidden' }}>
      {p.thumbnail
        ? <img src={p.thumbnail} alt={p.name} style={{width:'100%',height:120,objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>
        : <div style={{height:80,background:'rgba(138,92,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>💻</div>
      }
      <div style={{padding:'12px 14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:'#fff'}}>{p.name}</div>
          <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:p.type==='secondary'?'rgba(167,139,250,0.15)':'rgba(250,204,21,0.15)',color:p.type==='secondary'?'#a78bfa':'#facc15'}}>{p.type==='secondary'?'secondary':'primary'}</span>
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:10,lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{p.desc}</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
          {(p.tags||[]).map(t=><span key={t} style={{fontSize:10,padding:'2px 8px',background:'rgba(138,92,246,0.15)',borderRadius:20,color:'#a78bfa'}}>{t}</span>)}
        </div>
        <div style={{display:'flex',gap:6}}>
          <button style={S.btnEdit} onClick={()=>onEdit(p)}>✏️ Edit</button>
          <button style={S.btnDelete} onClick={()=>onDelete(p)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

const S = {
  heading:{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.5rem',color:'#fff',marginBottom:4 },
  sub:    { color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:24 },
  card:   { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24,marginBottom:24 },
  cardTitle:{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#a78bfa',marginBottom:16 },
  grid2:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 },
  field:  { marginBottom:14 },
  label:  { display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:6,fontFamily:"'Syne',sans-serif" },
  input:  { width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box' },
  btnPrimary:{ background:'linear-gradient(135deg,#8a5cf6,#c084fc)',border:'none',borderRadius:10,padding:'11px 22px',color:'#fff',fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:'pointer' },
  btnSecondary:{ background:'transparent',border:'1px solid rgba(255,255,255,0.15)',borderRadius:10,padding:'11px 22px',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:"'Syne',sans-serif",cursor:'pointer' },
  projGrid:{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14,marginBottom:8 },
  btnEdit:  { flex:1,background:'rgba(138,92,246,0.2)',border:'1px solid rgba(138,92,246,0.3)',borderRadius:8,padding:'5px 10px',color:'#a78bfa',fontSize:11,fontWeight:600,cursor:'pointer' },
  btnDelete:{ background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:8,padding:'5px 10px',color:'#f87171',fontSize:11,cursor:'pointer' },
};