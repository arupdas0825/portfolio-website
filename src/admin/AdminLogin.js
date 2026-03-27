// src/admin/AdminLogin.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>AD</div>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.sub}>Portfolio CMS — Arup Das</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              onFocus={e => e.target.style.borderColor='#8a5cf6'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              onFocus={e => e.target.style.borderColor='#8a5cf6'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'DM Sans',sans-serif" },
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(138,92,246,0.2)', borderRadius:24, padding:'44px 40px', width:'100%', maxWidth:400, boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07)' },
  logo: { width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#8a5cf6,#c084fc)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'#fff', margin:'0 auto 20px', boxShadow:'0 0 30px rgba(138,92,246,0.4)' },
  title: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.8rem', color:'#fff', textAlign:'center', margin:'0 0 6px' },
  sub: { color:'rgba(255,255,255,0.35)', textAlign:'center', fontSize:13, margin:'0 0 32px' },
  form: { display:'flex', flexDirection:'column', gap:16 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', fontFamily:"'Syne',sans-serif", letterSpacing:'0.5px' },
  input: { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'#fff', fontSize:14, outline:'none', transition:'border-color 0.2s', fontFamily:"'DM Sans',sans-serif" },
  error: { background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:10, padding:'10px 14px', color:'#f87171', fontSize:13 },
  btn: { background:'linear-gradient(135deg,#8a5cf6,#c084fc)', border:'none', borderRadius:12, padding:'14px', color:'#fff', fontSize:15, fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:'pointer', marginTop:8, boxShadow:'0 0 20px rgba(138,92,246,0.4)', transition:'opacity 0.2s' },
};