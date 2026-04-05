// src/admin/AboutEditor.js
import React, { useState, useEffect } from 'react';
import { safeGetDoc, safeSetDoc } from './Firestorehelper';
import { uploadToCloudinary } from './cloudinary';
import { S, Msg, Field } from './AdminStyles';

export default function AboutEditor() {
  const [form, setForm] = useState({
    bio1: 'I am a detail-oriented Computer Science & Engineering student at Brainware University, specialising in Artificial Intelligence and Machine Learning. Based in Kolkata, I am passionate about bridging the gap between robust software architecture and intelligent system design.',
    bio2: 'With a strong foundation in Python, Java, C/C++, and Google Firebase, I focus on building scalable applications. My technical toolkit is complemented by a creative background in Photography and Professional Video Editing.',
    languages:       'Python,Java,C/C++,JavaScript,SQL,Firebase',
    specializations: 'AI / ML,Machine Learning,Mobile App Dev,React',
    creativeTools:   'Premiere Pro,After Effects,Photography',
    photoUrl: '',
  });
  const [photoFile, setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [saving, setSaving]         = useState(false);
  const [loading, setLoading]       = useState(true);
  const [msg, setMsg]               = useState('');

  useEffect(() => {
    safeGetDoc('siteData', 'about').then(({ data, error }) => {
        if (error) setMsg(error);
        if (data) {
          setForm(f => ({ ...f, ...data }));
          if (data.photoUrl) setPhotoPreview(data.photoUrl);
        }
        setLoading(false);
      });
  }, []);

  const f = k => ({
    value: form[k] || '',
    onChange: e => setForm(p => ({ ...p, [k]: e.target.value })),
  });

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      let finalForm = { ...form };

      // Upload new photo if selected
      if (photoFile) {
        setUploading(true);
        const { url } = await uploadToCloudinary(photoFile, 'portfolio/about', setProgress);
        finalForm.photoUrl = url;
        setForm(p => ({ ...p, photoUrl: url }));
        setUploading(false); setProgress(0);
      }

      const { error } = await safeSetDoc('siteData', 'about', finalForm);
      if (error) { setMsg(error); setSaving(false); return; }
      setMsg('✅ About saved! Refresh portfolio to see changes.');
    } catch(e) {
      setMsg('❌ Save failed: ' + e.message);
      console.error(e);
    } finally { setSaving(false); setUploading(false); }
  };

  if (loading) return <div style={{ color:'rgba(255,255,255,0.4)', padding:20 }}>Loading...</div>;

  return (
    <div>
      <h2 style={S.heading}>👤 About Me Editor</h2>
      <p style={S.sub}>Edit bio, photo, and skill tags</p>

      {/* Photo Upload */}
      <div style={S.card}>
        <div style={S.cardTitle}>Profile Photo</div>
        <div style={{ display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
          {/* Preview */}
          <div style={{
            width:100, height:120, borderRadius:14, overflow:'hidden',
            border:'2px solid rgba(138,92,246,0.4)', flexShrink:0,
            background:'rgba(138,92,246,0.08)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {photoPreview
              ? <img src={photoPreview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : <span style={{ fontSize:28 }}>🧑‍💻</span>
            }
          </div>

          <div style={{ flex:1 }}>
            <label style={S.label}>Upload New Profile Photo</label>
            <input
              style={{ ...S.input, padding:'8px 12px', marginBottom:10 }}
              type="file" accept="image/*"
              onChange={handlePhotoChange}
            />
            {uploading && (
              <div>
                <div style={S.progress}>
                  <div style={{ ...S.progressBar, width:`${progress}%` }}/>
                </div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:3 }}>
                  Uploading {progress}%...
                </p>
              </div>
            )}
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:6 }}>
              JPG/PNG recommended · Will replace /arup.jpg on portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={S.card}>
        <div style={S.cardTitle}>Bio Paragraphs</div>
        <Field label="Paragraph 1" {...f('bio1')} multiline/>
        <Field label="Paragraph 2" {...f('bio2')} multiline/>
      </div>

      {/* Skills */}
      <div style={S.card}>
        <div style={S.cardTitle}>Skill Tags (comma separated)</div>
        <Field label="Languages" placeholder="Python,Java,C/C++,JavaScript" {...f('languages')}/>
        <Field label="Specializations" placeholder="AI / ML,Machine Learning,React" {...f('specializations')}/>
        <Field label="Creative Tools" placeholder="Premiere Pro,After Effects,Photography" {...f('creativeTools')}/>
      </div>

      <Msg text={msg}/>
      <button style={S.btnPrimary} onClick={save} disabled={saving || uploading}>
        {saving ? 'Saving...' : uploading ? 'Uploading...' : '💾 Save About'}
      </button>
    </div>
  );
}