// src/admin/WorkManager.js — GitHub repos only, set primary/secondary
import React, { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from './cloudinary';
import { S, Msg } from './AdminStyles';

const GITHUB_USERNAME = 'arupdas0825';

export default function WorkManager() {
  const [repos, setRepos]         = useState([]);
  const [savedData, setSavedData] = useState({});
  const [editing, setEditing]     = useState(null);
  const [editForm, setEditForm]   = useState({ desc:'', type:'secondary', thumbnail:'', tags:'' });
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [msg, setMsg]             = useState('');

  // Fetch GitHub repos
  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data.filter(r => !r.fork));
      })
      .catch(() => {})
      .finally(() => setLoadingRepos(false));
  }, []);

  // Listen to Firestore for saved customizations
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projectSettings'), snap => {
      const data = {};
      snap.docs.forEach(d => { data[d.id] = d.data(); });
      setSavedData(data);
    });
    return unsub;
  }, []);

  const startEdit = useCallback((repo) => {
    const saved = savedData[repo.name] || {};
    setEditing(repo);
    setEditForm({
      desc:      saved.desc      || repo.description || '',
      type:      saved.type      || 'secondary',
      thumbnail: saved.thumbnail || '',
      tags:      saved.tags      || (repo.language ? repo.language : ''),
    });
    setThumbPreview(saved.thumbnail || '');
    setThumbFile(null);
  }, [savedData]);

  const handleSave = async () => {
    if (!editing) return;
    setUploading(true); setMsg('');
    try {
      const data = {
        name:      editing.name,
        desc:      editForm.desc,
        type:      editForm.type,
        tags:      editForm.tags,
        github:    editing.html_url,
        demo:      editing.homepage || '',
        stars:     editing.stargazers_count,
        language:  editing.language,
      };

      if (thumbFile) {
        const { url } = await uploadToCloudinary(thumbFile, 'portfolio/projects', setProgress);
        data.thumbnail = url;
      } else {
        data.thumbnail = editForm.thumbnail;
      }

      await setDoc(doc(db, 'projectSettings', editing.name), data);
      setMsg('✅ Saved! Portfolio will show updated data.');
      setEditing(null);
    } catch(e) { setMsg('❌ ' + e.message); }
    finally { setUploading(false); setProgress(0); }
  };

  const primary   = repos.filter(r => savedData[r.name]?.type === 'primary');
  const secondary = repos.filter(r => !savedData[r.name] || savedData[r.name]?.type !== 'primary');

  if (loadingRepos) return <div style={{ color:'rgba(255,255,255,0.4)', padding:20 }}>Fetching GitHub repos...</div>;

  return (
    <div>
      <h2 style={S.heading}>💼 Work / Projects</h2>
      <p style={S.sub}>{repos.length} GitHub repos · click any to customize</p>

      <Msg text={msg}/>

      {/* Edit form */}
      {editing && (
        <div style={{ ...S.card, border:'1px solid rgba(138,92,246,0.4)', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ ...S.cardTitle, marginBottom:0 }}>✏️ Editing: <span style={{ color:'#fff' }}>{editing.name}</span></div>
            <button style={S.btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
          </div>

          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Project Type</label>
            <div style={{ display:'flex', gap:10 }}>
              {['primary','secondary'].map(t => (
                <button key={t} onClick={() => setEditForm(f=>({...f,type:t}))} style={{
                  flex:1, padding:'9px', borderRadius:9,
                  background: editForm.type===t ? (t==='primary'?'rgba(250,204,21,0.2)':'rgba(138,92,246,0.2)') : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${editForm.type===t ? (t==='primary'?'rgba(250,204,21,0.5)':'rgba(138,92,246,0.5)') : 'rgba(255,255,255,0.08)'}`,
                  color: editForm.type===t ? (t==='primary'?'#facc15':'#a78bfa') : 'rgba(255,255,255,0.4)',
                  fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer',
                }}>
                  {t==='primary' ? '⭐ Primary' : '📌 Secondary'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={editForm.desc}
              onChange={e=>setEditForm(f=>({...f,desc:e.target.value}))}
              placeholder="What this project does..."/>
          </div>

          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Tags (comma separated)</label>
            <input style={S.input} value={editForm.tags}
              onChange={e=>setEditForm(f=>({...f,tags:e.target.value}))}
              placeholder="React, Firebase, AI"/>
          </div>

          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Thumbnail Image (optional)</label>
            <input style={{...S.input,padding:'7px 12px'}} type="file" accept="image/*"
              onChange={e=>{const f=e.target.files[0];if(f){setThumbFile(f);setThumbPreview(URL.createObjectURL(f));}}}/>
            {thumbPreview && <img src={thumbPreview} alt="thumb" style={{width:'100%',maxHeight:120,objectFit:'cover',borderRadius:8,marginTop:8}}/>}
          </div>

          {uploading && (
            <div style={{ marginBottom:10 }}>
              <div style={S.progress}><div style={{...S.progressBar,width:`${progress}%`}}/></div>
            </div>
          )}

          <button style={S.btnPrimary} onClick={handleSave} disabled={uploading}>
            {uploading ? `${progress}%...` : '💾 Save Changes'}
          </button>
        </div>
      )}

      {/* Primary repos */}
      {primary.length > 0 && (
        <>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'#facc15', marginBottom:10, letterSpacing:'1px' }}>
            ⭐ PRIMARY PROJECTS ({primary.length})
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10, marginBottom:20 }}>
            {primary.map(r => <RepoCard key={r.id} repo={r} saved={savedData[r.name]} onEdit={startEdit}/>)}
          </div>
        </>
      )}

      {/* All repos as secondary */}
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:10, letterSpacing:'1px' }}>
        📌 ALL REPOS — click to customize ({secondary.length})
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
        {secondary.map(r => <RepoCard key={r.id} repo={r} saved={savedData[r.name]} onEdit={startEdit}/>)}
      </div>
    </div>
  );
}

function RepoCard({ repo, saved, onEdit }) {
  const type = saved?.type || 'secondary';
  return (
    <div style={{
      background:'rgba(255,255,255,0.04)',
      border:`1px solid ${type==='primary'?'rgba(250,204,21,0.25)':'rgba(255,255,255,0.07)'}`,
      borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'all 0.2s',
    }}
    onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(138,92,246,0.4)'}
    onMouseLeave={e=>e.currentTarget.style.borderColor=type==='primary'?'rgba(250,204,21,0.25)':'rgba(255,255,255,0.07)'}
    >
      {saved?.thumbnail
        ? <img src={saved.thumbnail} alt={repo.name} style={{width:'100%',height:80,objectFit:'cover'}}/>
        : <div style={{height:60,background:'rgba(138,92,246,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>
            {repo.language==='Python'?'🐍':repo.language==='Java'?'☕':repo.language==='Kotlin'?'📱':'💻'}
          </div>
      }
      <div style={{ padding:'10px 12px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{repo.name}</div>
          <span style={{ fontSize:9, padding:'2px 6px', borderRadius:10, marginLeft:4, flexShrink:0,
            background:type==='primary'?'rgba(250,204,21,0.15)':'rgba(138,92,246,0.1)',
            color:type==='primary'?'#facc15':'rgba(255,255,255,0.3)',
          }}>{type==='primary'?'⭐':'·'}</span>
        </div>
        {repo.language && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginBottom:8 }}>{repo.language}</div>}
        <button style={{
          width:'100%', background:'rgba(138,92,246,0.15)',
          border:'1px solid rgba(138,92,246,0.25)', borderRadius:7,
          padding:'5px', color:'#a78bfa', fontSize:11, fontWeight:600,
          fontFamily:"'Syne',sans-serif", cursor:'pointer',
        }} onClick={() => onEdit(repo)}>✏️ Customize</button>
      </div>
    </div>
  );
}