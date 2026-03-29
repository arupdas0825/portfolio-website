// src/admin/GalleryManager.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from './cloudinary';
import { S, Msg } from './AdminStyles';

export default function GalleryManager() {
  const [photos, setPhotos]       = useState([]);
  const [form, setForm]           = useState({ title:'', desc:'' });
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState('');
  const [editing, setEditing]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [msg, setMsg]             = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db,'photos'), snap => {
      const d = snap.docs.map(x=>({id:x.id,...x.data()})).sort((a,b)=>(a.order||0)-(b.order||0));
      setPhotos(d);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!form.title) return setMsg('Title required.');
    setUploading(true); setMsg('');
    try {
      const upd = { title:form.title, desc:form.desc };
      if (file) {
        const { url, publicId } = await uploadToCloudinary(file, 'portfolio/photos', setProgress);
        upd.src = url; upd.publicId = publicId;
      }
      if (editing) {
        await updateDoc(doc(db,'photos',editing.id), upd);
        setMsg('✅ Updated!');
      } else {
        if (!file) return setMsg('Select an image.');
        await addDoc(collection(db,'photos'), {...upd, order:photos.length, createdAt:serverTimestamp()});
        setMsg('✅ Photo added!');
      }
      reset();
    } catch(e) { setMsg('❌ '+e.message); }
    finally { setUploading(false); setProgress(0); }
  };

  const reset = () => { setEditing(null); setForm({title:'',desc:''}); setFile(null); setPreview(''); };

  return (
    <div>
      <h2 style={S.heading}>📷 Gallery Manager</h2>
      <p style={S.sub}>{photos.length} photos · Cloudinary storage</p>

      <div style={S.card}>
        <div style={S.cardTitle}>{editing?'✏️ Edit Photo':'➕ Add Photo'}</div>
        <div style={S.grid2}>
          <div style={S.field}>
            <label style={S.label}>Title *</label>
            <input style={S.input} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Amber Awakening"
              onFocus={e=>e.target.style.borderColor='rgba(138,92,246,0.5)'}
              onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}/>
          </div>
          <div style={S.field}>
            <label style={S.label}>Image {editing?'(optional)':'*'}</label>
            <input style={{...S.input,padding:'7px 12px'}} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setFile(f);setPreview(URL.createObjectURL(f))}}}/>
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Description</label>
          <textarea style={S.textarea} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Cinematic description..."/>
        </div>
        {preview && <img src={preview} alt="p" style={{width:'100%',maxHeight:160,objectFit:'cover',borderRadius:9,marginBottom:12}}/>}
        {uploading && <div style={S.progress}><div style={{...S.progressBar,width:`${progress}%`}}/></div>}
        <Msg text={msg}/>
        <div style={{display:'flex',gap:8}}>
          <button style={S.btnPrimary} onClick={handleSave} disabled={uploading}>{uploading?`${progress}%...`:editing?'Update':'Add Photo'}</button>
          {editing && <button style={S.btnSecondary} onClick={reset}>Cancel</button>}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
        {photos.map(p=>(
          <div key={p.id} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:11,overflow:'hidden'}}>
            <img src={p.src} alt={p.title} style={{width:'100%',height:110,objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>
            <div style={{padding:'10px 12px'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:'#fff',marginBottom:8}}>{p.title}</div>
              <div style={{display:'flex',gap:6}}>
                <button style={S.btnEdit} onClick={()=>{setEditing(p);setForm({title:p.title||'',desc:p.desc||''});setPreview(p.src||'');}}>✏️</button>
                <button style={S.btnDanger} onClick={async()=>{if(window.confirm('Delete?'))await deleteDoc(doc(db,'photos',p.id));}}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}