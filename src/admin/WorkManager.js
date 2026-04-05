// src/admin/WorkManager.js — No primary limit
import React, { useState, useEffect, useCallback } from 'react';
import { safeOnSnapshot, safeSetDoc } from './Firestorehelper';
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

  useEffect(() => {
    // Try cache first
    const cached = localStorage.getItem('gh_repos_admin');
    if (cached) { try { const {data,ts} = JSON.parse(cached); if(Date.now()-ts < 3600000) { setRepos(data.filter(r=>!r.fork)); setLoadingRepos(false); } } catch(_){} }

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const own = data.filter(r => !r.fork);
          setRepos(own);
          localStorage.setItem('gh_repos_admin', JSON.stringify({data:own,ts:Date.now()}));
        }
      })
      .catch(()=>{})
      .finally(() => setLoadingRepos(false));
  }, []);

  useEffect(() => {
    const unsub = safeOnSnapshot('projects',
      snap => { const d={}; snap.docs.forEach(doc=>{ d[doc.id]=doc.data(); }); setSavedData(d); },
      err => setMsg(err)
    );
    return unsub;
  }, []);

  const startEdit = useCallback((repo) => {
    const saved = savedData[repo.name] || {};
    setEditing(repo);
    setEditForm({ desc: saved.desc||repo.description||'', type: saved.type||'secondary', thumbnail: saved.thumbnail||'', tags: saved.tags||repo.language||'' });
    setThumbPreview(saved.thumbnail||'');
    setThumbFile(null); setMsg('');
  }, [savedData]);

  const handleSave = async () => {
    if (!editing) return;
    setUploading(true); setMsg('');
    try {
      const data = { name:editing.name, desc:editForm.desc, type:editForm.type, tags:editForm.tags, github:editing.html_url, demo:editing.homepage||'', stars:editing.stargazers_count, language:editing.language||'' };
      if (thumbFile) {
        const {url} = await uploadToCloudinary(thumbFile, 'portfolio/projects', setProgress);
        data.thumbnail = url;
      } else { data.thumbnail = editForm.thumbnail; }
      const {error} = await safeSetDoc('projects', editing.name, data);
      if (error) { setMsg(error); return; }
      setMsg('✅ Saved!'); setEditing(null);
    } catch(e) { setMsg('❌ '+e.message); }
    finally { setUploading(false); setProgress(0); }
  };

  const primary   = repos.filter(r => savedData[r.name]?.type === 'primary');
  const secondary = repos.filter(r => savedData[r.name]?.type !== 'primary');

  if (loadingRepos && repos.length === 0) return <div style={{color:'rgba(255,255,255,0.4)',padding:20}}>Fetching repos...</div>;

  return (
    <div>
      <h2 style={S.heading}>💼 Work / Projects</h2>
      <p style={S.sub}>{repos.length} repos · <span style={{color:'#facc15'}}>⭐ {primary.length} primary</span> · no limit on primary selection</p>

      {msg && <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:10,padding:'12px 14px',marginBottom:14,whiteSpace:'pre-wrap',fontSize:11,color:'#f87171',fontFamily:'monospace',lineHeight:1.7}}>{msg}</div>}

      {editing && (
        <div style={{...S.card, border:'1px solid rgba(138,92,246,0.4)', marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{...S.cardTitle,marginBottom:0}}>✏️ <span style={{color:'#fff'}}>{editing.name}</span></div>
            <button style={S.btnSecondary} onClick={()=>setEditing(null)}>Cancel</button>
          </div>

          <div style={{marginBottom:12}}>
            <label style={S.label}>Project Type (no limit on primary)</label>
            <div style={{display:'flex',gap:10}}>
              {['primary','secondary'].map(t=>(
                <button key={t} onClick={()=>setEditForm(f=>({...f,type:t}))} style={{
                  flex:1,padding:'9px',borderRadius:9,cursor:'pointer',
                  fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,
                  background:editForm.type===t?(t==='primary'?'rgba(250,204,21,0.2)':'rgba(138,92,246,0.2)'):'rgba(255,255,255,0.04)',
                  border:`1px solid ${editForm.type===t?(t==='primary'?'rgba(250,204,21,0.5)':'rgba(138,92,246,0.5)'):'rgba(255,255,255,0.08)'}`,
                  color:editForm.type===t?(t==='primary'?'#facc15':'#a78bfa'):'rgba(255,255,255,0.4)',
                }}>{t==='primary'?'⭐ Primary':'📌 Secondary'}</button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={editForm.desc} onChange={e=>setEditForm(f=>({...f,desc:e.target.value}))} placeholder="What this project does..."/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={S.label}>Tags (comma separated)</label>
            <input style={S.input} value={editForm.tags} onChange={e=>setEditForm(f=>({...f,tags:e.target.value}))} placeholder="React, Firebase, AI"/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={S.label}>Thumbnail (optional)</label>
            <input style={{...S.input,padding:'7px 12px'}} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setThumbFile(f);setThumbPreview(URL.createObjectURL(f));}}}/>
            {thumbPreview && <img src={thumbPreview} alt="t" style={{width:'100%',maxHeight:110,objectFit:'cover',borderRadius:8,marginTop:8}}/>}
          </div>
          {uploading && <div style={S.progress}><div style={{...S.progressBar,width:`${progress}%`}}/></div>}
          <button style={S.btnPrimary} onClick={handleSave} disabled={uploading}>{uploading?`${progress}%...`:'💾 Save'}</button>
        </div>
      )}

      {primary.length > 0 && (
        <>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:'#facc15',marginBottom:8,letterSpacing:'1px'}}>⭐ PRIMARY ({primary.length})</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:8,marginBottom:20}}>
            {primary.map(r=><RepoCard key={r.id} repo={r} saved={savedData[r.name]} onEdit={startEdit}/>)}
          </div>
        </>
      )}

      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:'rgba(255,255,255,0.3)',marginBottom:8,letterSpacing:'1px'}}>ALL REPOS ({repos.length}) — click to customize</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:8}}>
        {repos.map(r=><RepoCard key={r.id} repo={r} saved={savedData[r.name]} onEdit={startEdit}/>)}
      </div>
    </div>
  );
}

function RepoCard({repo,saved,onEdit}) {
  const type = saved?.type||'secondary';
  return (
    <div onClick={()=>onEdit(repo)} style={{
      background:'rgba(255,255,255,0.04)',
      border:`1px solid ${type==='primary'?'rgba(250,204,21,0.3)':'rgba(255,255,255,0.07)'}`,
      borderRadius:10,overflow:'hidden',cursor:'pointer',transition:'border-color 0.2s',
    }}
    onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(138,92,246,0.5)'}
    onMouseLeave={e=>e.currentTarget.style.borderColor=type==='primary'?'rgba(250,204,21,0.3)':'rgba(255,255,255,0.07)'}>
      {saved?.thumbnail
        ? <img src={saved.thumbnail} alt={repo.name} style={{width:'100%',height:65,objectFit:'cover'}}/>
        : <div style={{height:45,background:'rgba(138,92,246,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
            {repo.language==='Python'?'🐍':repo.language==='Java'?'☕':repo.language==='Kotlin'?'📱':repo.language==='TypeScript'?'🔷':'💻'}
          </div>}
      <div style={{padding:'7px 9px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:4}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{repo.name}</div>
          {type==='primary'&&<span style={{fontSize:10,color:'#facc15',flexShrink:0}}>⭐</span>}
        </div>
        <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',marginTop:2}}>{repo.language||'—'} · ★{repo.stargazers_count}</div>
      </div>
    </div>
  );
}