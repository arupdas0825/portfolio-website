// src/admin/PhotoManager.js — Cloudinary storage version
import React, { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from './cloudinary';

const COLL = 'photos';

export default function PhotoManager() {
  const [photos, setPhotos]       = useState([]);
  const [form, setForm]           = useState({ title:'', desc:'' });
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState('');
  const [editing, setEditing]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [msg, setMsg]             = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLL), snap => {
      const data = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      data.sort((a,b) => (a.order||0) - (b.order||0));
      setPhotos(data);
    });
    return unsub;
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.title) return setMsg('Title is required.');
    setUploading(true); setMsg('');
    try {
      const update = { title: form.title, desc: form.desc };

      if (file) {
        // Upload to Cloudinary
        const { url, publicId } = await uploadToCloudinary(
          file, 'portfolio/photos', setProgress
        );
        update.src = url;
        update.publicId = publicId;
      }

      if (editing) {
        await updateDoc(doc(db, COLL, editing.id), update);
        setMsg('✅ Photo updated!');
      } else {
        if (!file) return setMsg('Please select an image.');
        await addDoc(collection(db, COLL), {
          ...update,
          order: photos.length,
          createdAt: serverTimestamp(),
        });
        setMsg('✅ Photo added!');
      }
      resetForm();
    } catch(e) {
      setMsg('❌ ' + e.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleEdit = (photo) => {
    setEditing(photo);
    setForm({ title: photo.title||'', desc: photo.desc||'' });
    setPreview(photo.src||'');
    setFile(null);
    window.scrollTo(0,0);
  };

  const handleDelete = async (photo) => {
    if (!window.confirm(`Delete "${photo.title}"?`)) return;
    await deleteDoc(doc(db, COLL, photo.id));
    // Note: Cloudinary free tier doesn't support server-side delete without backend
    // The image stays on Cloudinary but is removed from Firestore/portfolio
    setMsg('🗑️ Deleted from portfolio.');
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title:'', desc:'' });
    setFile(null);
    setPreview('');
  };

  return (
    <div>
      <h2 style={S.heading}>📷 Photography Manager</h2>
      <p style={S.sub}>{photos.length} photos · stored on Cloudinary (free)</p>

      {/* Form */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>{editing ? '✏️ Edit Photo' : '➕ Add New Photo'}</h3>

        <div style={S.grid2}>
          <div>
            <label style={S.label}>Title *</label>
            <input style={S.input} value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}
              placeholder="e.g. Amber Awakening"/>
          </div>
          <div>
            <label style={S.label}>Image {editing ? '(optional — keep current)' : '*'}</label>
            <input style={{...S.input,padding:'8px 12px'}} type="file" accept="image/*" onChange={handleFile}/>
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <label style={S.label}>Description</label>
          <textarea style={{...S.input,height:80,resize:'vertical'}}
            value={form.desc}
            onChange={e=>setForm({...form,desc:e.target.value})}
            placeholder="Write a poetic description..."/>
        </div>

        {preview && (
          <img src={preview} alt="preview" style={{
            width:'100%',maxHeight:200,objectFit:'cover',
            borderRadius:10,marginBottom:14,
          }}/>
        )}

        {uploading && (
          <div style={{marginBottom:14}}>
            <div style={{height:6,background:'rgba(255,255,255,0.07)',borderRadius:99}}>
              <div style={{
                height:'100%',width:`${progress}%`,
                background:'linear-gradient(90deg,#8a5cf6,#c084fc)',
                borderRadius:99,transition:'width 0.3s',
              }}/>
            </div>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:4}}>
              {progress}% uploading to Cloudinary...
            </p>
          </div>
        )}

        {msg && (
          <div style={{
            padding:'10px 14px',borderRadius:8,fontSize:13,marginBottom:12,
            color: msg.startsWith('✅') ? '#4ade80' : msg.startsWith('❌') ? '#f87171' : '#a78bfa',
          }}>{msg}</div>
        )}

        <div style={{display:'flex',gap:10}}>
          <button style={S.btnPrimary} onClick={handleSave} disabled={uploading}>
            {uploading ? `Uploading ${progress}%...` : editing ? 'Update Photo' : 'Add Photo'}
          </button>
          {editing && <button style={S.btnSecondary} onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      {/* Photo grid */}
      <div style={S.photoGrid}>
        {photos.map(photo => (
          <div key={photo.id} style={S.photoCard}>
            <img src={photo.src} alt={photo.title}
              style={{width:'100%',height:140,objectFit:'cover',borderRadius:'10px 10px 0 0'}}
              onError={e => e.target.style.display='none'}/>
            <div style={{padding:'12px 14px'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:4}}>
                {photo.title}
              </div>
              <div style={{
                fontSize:11,color:'rgba(255,255,255,0.4)',lineHeight:1.5,
                overflow:'hidden',display:'-webkit-box',
                WebkitLineClamp:2,WebkitBoxOrient:'vertical',
              }}>{photo.desc}</div>
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <button style={S.btnEdit} onClick={()=>handleEdit(photo)}>✏️ Edit</button>
                <button style={S.btnDelete} onClick={()=>handleDelete(photo)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  heading:    { fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.5rem',color:'#fff',marginBottom:4 },
  sub:        { color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:24 },
  card:       { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24,marginBottom:28 },
  cardTitle:  { fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:'#a78bfa',marginBottom:18 },
  grid2:      { display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 },
  label:      { display:'block',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:6,fontFamily:"'Syne',sans-serif" },
  input:      { width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box' },
  btnPrimary: { background:'linear-gradient(135deg,#8a5cf6,#c084fc)',border:'none',borderRadius:10,padding:'11px 22px',color:'#fff',fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:'pointer' },
  btnSecondary:{ background:'transparent',border:'1px solid rgba(255,255,255,0.15)',borderRadius:10,padding:'11px 22px',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:"'Syne',sans-serif",cursor:'pointer' },
  photoGrid:  { display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14 },
  photoCard:  { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,overflow:'hidden' },
  btnEdit:    { flex:1,background:'rgba(138,92,246,0.2)',border:'1px solid rgba(138,92,246,0.3)',borderRadius:8,padding:'6px 10px',color:'#a78bfa',fontSize:11,fontWeight:600,cursor:'pointer' },
  btnDelete:  { flex:1,background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:8,padding:'6px 10px',color:'#f87171',fontSize:11,fontWeight:600,cursor:'pointer' },
};