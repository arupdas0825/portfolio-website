import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LucideLayoutDashboard, LucideUser, LucideBriefcase, LucideAward, 
  LucideCamera, LucideFileText, LucideMail, LucideSettings, 
  LucideLogOut, LucidePlus, LucideEdit, LucideTrash2, LucideDatabase,
  LucideX, LucideUpload, LucideCheck, LucideAlertCircle
} from 'lucide-react';
import { logoutAdmin } from '../utils/auth';
import { supabase } from '../supabase';
import './AdminPanel.css';

const TABS = [
  { id: 'profile', label: 'Profile', icon: LucideUser },
  { id: 'projects', label: 'Projects', icon: LucideBriefcase },
  { id: 'internships', label: 'Internships', icon: LucideDatabase },
  { id: 'certificates', label: 'Certificates', icon: LucideAward },
  { id: 'photography', label: 'Photography', icon: LucideCamera },
  { id: 'cv', label: 'CV / Resume', icon: LucideFileText },
  { id: 'contact', label: 'Contact Info', icon: LucideMail },
  { id: 'settings', label: 'Site Settings', icon: LucideSettings },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // CMS Collections Data States
  const [profile, setProfile] = useState({ full_name: '', primary_bio: '', secondary_bio: '', profile_image_url: '' });
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [photography, setPhotography] = useState([]);
  const [cv, setCv] = useState({ cv_url: '', version: '' });
  const [contact, setContact] = useState({ email: '', phone: '', location: '', github_url: '', linkedin_url: '', instagram_url: '' });
  const [settings, setSettings] = useState({ portfolio_title: '', portfolio_description: '', github_username: '' });

  // Modal / Operations States
  const [modalType, setModalType] = useState(null); // 'project' | 'internship' | 'certificate' | 'photography'
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [currentItem, setCurrentItem] = useState(null); // item being edited/deleted
  const [deleteConfirmType, setDeleteConfirmType] = useState(null);

  // Form Fields States
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', github_url: '', live_url: '', image_url: '', technologies: '', category: 'Major', featured: false, display_order: 0
  });
  const [internshipForm, setInternshipForm] = useState({
    company: '', role: '', location: '', duration: '', description: '', certificate_url: '', display_order: 0
  });
  const [certificateForm, setCertificateForm] = useState({
    title: '', issuer: '', year: '', image_url: '', credential_url: '', tags: '', category: 'Academic Certifications', display_order: 0
  });
  const [photographyForm, setPhotographyForm] = useState({
    title: '', image_url: '', camera: '', lens: '', location: '', category: '', display_order: 0
  });

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/', { replace: true });
    window.location.reload();
  };

  // Fetch all CMS data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Profile
      const { data: profileData, error: profileErr } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle();
      if (profileErr) throw profileErr;
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          primary_bio: profileData.primary_bio || '',
          secondary_bio: profileData.secondary_bio || '',
          profile_image_url: profileData.profile_image_url || '',
          title: profileData.title || '',
          location: profileData.location || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          github: profileData.github || '',
          linkedin: profileData.linkedin || '',
          website: profileData.website || '',
          cgpa: profileData.cgpa || ''
        });
      }

      // Projects
      const { data: projectsData, error: projErr } = await supabase.from('projects').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false });
      if (projErr) throw projErr;
      const mappedProjects = (projectsData || []).map(p => ({
        ...p,
        image_url: p.image || '',
        category: p.catagory || p.category || 'Major'
      }));
      setProjects(mappedProjects);

      // Internships
      const { data: internshipsData, error: internErr } = await supabase.from('internships').select('*').order('display_order', { ascending: true });
      if (internErr) throw internErr;
      const mappedInternships = (internshipsData || []).map(i => {
        let meta = {};
        let descriptionText = '';
        if (i.description) {
          try {
            meta = JSON.parse(i.description);
            descriptionText = meta.description || '';
          } catch (e) {
            descriptionText = i.description;
          }
        }
        return {
          ...i,
          descriptionText: descriptionText,
          location: meta.location || '',
          duration: meta.duration || '',
          certificate_url: meta.certificate_url || ''
        };
      });
      setInternships(mappedInternships);

      // Certificates
      const { data: certsData, error: certErr } = await supabase.from('certificates').select('*').order('display_order', { ascending: true });
      if (certErr) throw certErr;
      const mappedCerts = (certsData || []).map(c => ({
        ...c,
        image_url: c.image || '',
        credential_url: c.credential_id || ''
      }));
      setCertificates(mappedCerts);

      // Photography
      const { data: photoData, error: photoErr } = await supabase.from('photography').select('*').order('display_order', { ascending: true });
      if (photoErr) throw photoErr;
      const mappedPhotos = (photoData || []).map(p => {
        let exif = {};
        let descriptionText = '';
        if (p.description) {
          try {
            exif = JSON.parse(p.description);
            descriptionText = exif.desc || '';
          } catch (e) {
            descriptionText = p.description;
          }
        }
        return {
          ...p,
          image_url: p.image || '',
          descriptionText: descriptionText,
          camera: exif.camera || p.camera || '',
          lens: exif.lens || p.lens || '',
          location: exif.location || p.location || '',
          iso: exif.iso || p.iso || '',
          shutter_speed: exif.shutterSpeed || exif.shutter_speed || p.shutter_speed || '',
          aperture: exif.aperture || p.aperture || ''
        };
      });
      setPhotography(mappedPhotos);

      // CV
      const { data: cvData, error: cvErr } = await supabase.from('cv').select('*').eq('id', 1).maybeSingle();
      if (cvErr) throw cvErr;
      if (cvData) {
        setCv({
          cv_url: cvData.cv_file || '',
          version: cvData.cv_name || ''
        });
      }

      // Contact
      const { data: contactData, error: contactErr } = await supabase.from('contact').select('*').eq('id', 1).maybeSingle();
      if (contactErr) throw contactErr;
      if (contactData) {
        setContact({
          email: contactData.email || '',
          phone: contactData.phone || '',
          location: contactData.address || '',
          github_url: contactData.github || '',
          linkedin_url: contactData.linkedin || '',
          instagram_url: contactData.instagram || '',
          facebook_url: contactData.facebook || ''
        });
      }

      // Settings
      const { data: settingsData, error: settingsErr } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (settingsErr) throw settingsErr;
      if (settingsData) setSettings(settingsData);

    } catch (err) {
      console.error("Error loading Supabase CMS data:", err);
      showToast("Failed to fetch database content: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Upload to Public Storage helper
  const uploadFile = async (file, bucket) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Upload handlers
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setActionLoading(true);
    try {
      const url = await uploadFile(file, 'profile');
      setProfile(prev => ({ ...prev, profile_image_url: url }));
      showToast("Profile image uploaded successfully!");
    } catch (err) {
      showToast("Profile upload failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCvPdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setActionLoading(true);
    try {
      const url = await uploadFile(file, 'resume');
      setCv(prev => ({ ...prev, cv_url: url }));
      showToast("CV PDF file uploaded successfully!");
    } catch (err) {
      showToast("CV PDF upload failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalImageUpload = async (e, bucket, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setActionLoading(true);
    try {
      const url = await uploadFile(file, bucket);
      if (type === 'project') setProjectForm(prev => ({ ...prev, image_url: url }));
      else if (type === 'certificate') setCertificateForm(prev => ({ ...prev, image_url: url }));
      else if (type === 'photography') setPhotographyForm(prev => ({ ...prev, image_url: url }));
      showToast("File uploaded successfully!");
    } catch (err) {
      showToast("File upload failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await supabase.from('profile').upsert({
        ...profile,
        id: 1,
        full_name: profile.full_name,
        profile_image_url: profile.profile_image_url,
        primary_bio: profile.primary_bio,
        secondary_bio: profile.secondary_bio,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast("Save profile failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // CV Save
  const handleSaveCv = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await supabase.from('cv').upsert({
        id: 1,
        cv_file: cv.cv_url,
        cv_name: cv.version,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast("CV settings updated successfully!");
    } catch (err) {
      showToast("Save CV failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Contact Save
  const handleSaveContact = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await supabase.from('contact').upsert({
        id: 1,
        email: contact.email,
        phone: contact.phone,
        address: contact.location,
        github: contact.github_url,
        linkedin: contact.linkedin_url,
        instagram: contact.instagram_url,
        facebook: contact.facebook_url || '',
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast("Contact details saved successfully!");
    } catch (err) {
      showToast("Save contacts failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Site Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 1,
        portfolio_title: settings.portfolio_title,
        portfolio_description: settings.portfolio_description,
        github_username: settings.github_username,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast("Global settings saved successfully!");
    } catch (err) {
      showToast("Save global settings failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Add & Edit modal open
  const openAddModal = (type) => {
    setModalType(type);
    setModalMode('add');
    setCurrentItem(null);

    if (type === 'project') {
      setProjectForm({ title: '', description: '', github_url: '', live_url: '', image_url: '', technologies: '', category: 'Major', featured: false, display_order: 0 });
    } else if (type === 'internship') {
      setInternshipForm({ company: '', role: '', location: '', duration: '', description: '', certificate_url: '', display_order: 0 });
    } else if (type === 'certificate') {
      setCertificateForm({ title: '', issuer: '', year: '', image_url: '', credential_url: '', tags: '', category: 'Academic Certifications', display_order: 0 });
    } else if (type === 'photography') {
      setPhotographyForm({ title: '', image_url: '', camera: '', lens: '', location: '', category: '', display_order: 0, description: '', iso: '', shutter_speed: '', aperture: '' });
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setModalMode('edit');
    setCurrentItem(item);

    if (type === 'project') {
      setProjectForm({
        title: item.title || '',
        description: item.description || '',
        github_url: item.github_url || '',
        live_url: item.live_url || '',
        image_url: item.image_url || '',
        technologies: item.technologies || '',
        category: item.category || 'Major',
        featured: !!item.featured,
        display_order: item.display_order || 0
      });
    } else if (type === 'internship') {
      setInternshipForm({
        company: item.company || '',
        role: item.role || '',
        location: item.location || '',
        duration: item.duration || '',
        description: item.description || '',
        certificate_url: item.certificate_url || '',
        display_order: item.display_order || 0
      });
    } else if (type === 'certificate') {
      setCertificateForm({
        title: item.title || '',
        issuer: item.issuer || '',
        year: item.year || '',
        image_url: item.image_url || '',
        credential_url: item.credential_url || '',
        tags: item.tags || '',
        category: item.category || 'Academic Certifications',
        display_order: item.display_order || 0
      });
    } else if (type === 'photography') {
      setPhotographyForm({
        title: item.title || '',
        image_url: item.image_url || '',
        camera: item.camera || '',
        lens: item.lens || '',
        location: item.location || '',
        category: item.category || '',
        display_order: item.display_order || 0,
        description: item.descriptionText || '',
        iso: item.iso || '',
        shutter_speed: item.shutter_speed || '',
        aperture: item.aperture || ''
      });
    }
  };

  // CRUD Save / Submit
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (modalType === 'project') {
        const payload = {
          title: projectForm.title,
          description: projectForm.description,
          github_url: projectForm.github_url,
          live_url: projectForm.live_url,
          image: projectForm.image_url,
          technologies: projectForm.technologies,
          catagory: projectForm.category,
          featured: projectForm.featured,
          display_order: projectForm.display_order
        };
        if (modalMode === 'add') {
          const { error } = await supabase.from('projects').insert([payload]);
          if (error) throw error;
          showToast("Project added successfully!");
        } else {
          const { error } = await supabase.from('projects').update(payload).eq('id', currentItem.id);
          if (error) throw error;
          showToast("Project updated successfully!");
        }
      } else if (modalType === 'internship') {
        const metaObj = {
          location: internshipForm.location,
          duration: internshipForm.duration,
          certificate_url: internshipForm.certificate_url,
          description: internshipForm.description
        };
        const payload = {
          company: internshipForm.company,
          role: internshipForm.role,
          description: JSON.stringify(metaObj),
          display_order: internshipForm.display_order
        };
        if (modalMode === 'add') {
          const { error } = await supabase.from('internships').insert([payload]);
          if (error) throw error;
          showToast("Internship added successfully!");
        } else {
          const { error } = await supabase.from('internships').update(payload).eq('id', currentItem.id);
          if (error) throw error;
          showToast("Internship updated successfully!");
        }
      } else if (modalType === 'certificate') {
        const payload = {
          title: certificateForm.title,
          issuer: certificateForm.issuer,
          year: certificateForm.year,
          image: certificateForm.image_url,
          credential_id: certificateForm.credential_url,
          tags: certificateForm.tags,
          category: certificateForm.category,
          display_order: certificateForm.display_order
        };
        if (modalMode === 'add') {
          const { error } = await supabase.from('certificates').insert([payload]);
          if (error) throw error;
          showToast("Certificate added successfully!");
        } else {
          const { error } = await supabase.from('certificates').update(payload).eq('id', currentItem.id);
          if (error) throw error;
          showToast("Certificate updated successfully!");
        }
      } else if (modalType === 'photography') {
        const exifObj = {
          desc: photographyForm.description,
          camera: photographyForm.camera,
          lens: photographyForm.lens,
          location: photographyForm.location,
          iso: photographyForm.iso,
          shutterSpeed: photographyForm.shutter_speed,
          aperture: photographyForm.aperture
        };
        const payload = {
          title: photographyForm.title,
          image: photographyForm.image_url,
          category: photographyForm.category,
          display_order: photographyForm.display_order,
          description: JSON.stringify(exifObj)
        };
        if (modalMode === 'add') {
          const { error } = await supabase.from('photography').insert([payload]);
          if (error) throw error;
          showToast("Photo entry added successfully!");
        } else {
          const { error } = await supabase.from('photography').update(payload).eq('id', currentItem.id);
          if (error) throw error;
          showToast("Photo entry updated successfully!");
        }
      }

      setModalType(null);
      fetchData();
    } catch (err) {
      showToast("Failed to save entry: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD Delete confirmation
  const confirmDelete = (type, item) => {
    setDeleteConfirmType(type);
    setCurrentItem(item);
  };

  const handleDelete = async () => {
    if (!currentItem || !deleteConfirmType) return;
    setActionLoading(true);
    try {
      let table = '';
      if (deleteConfirmType === 'project') table = 'projects';
      else if (deleteConfirmType === 'internship') table = 'internships';
      else if (deleteConfirmType === 'certificate') table = 'certificates';
      else if (deleteConfirmType === 'photography') table = 'photography';

      const { error } = await supabase.from(table).delete().eq('id', currentItem.id);
      if (error) throw error;

      showToast("Entry deleted successfully!");
      setDeleteConfirmType(null);
      setCurrentItem(null);
      fetchData();
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="cms-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="cms-spinner" style={{ width: '40px', height: '40px', color: '#3b82f6', marginBottom: '16px' }} />
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Synchronizing with Supabase...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSaveProfile} className="cms-card">
            <h3 className="cms-card-title">Edit Profile</h3>
            <p className="cms-card-subtitle">Manage bio information and landing text shown on the portfolio.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group">
                <label>Profile Image</label>
                <div className="cms-file-preview">
                  {profile.profile_image_url ? (
                    <img src={profile.profile_image_url} alt="Profile preview" />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LucideUser size={24} style={{ color: '#64748b' }} /></div>
                  )}
                  <div className="cms-file-input-wrapper">
                    <button type="button" className="cms-btn-file-dummy">
                      <LucideUpload size={14} /> Upload Image
                    </button>
                    <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="cms-file-input" />
                  </div>
                </div>
                <input 
                  type="text" 
                  value={profile.profile_image_url || ''} 
                  onChange={e => setProfile(prev => ({ ...prev, profile_image_url: e.target.value }))}
                  placeholder="Direct Image URL (e.g. /arup.jpg)"
                  className="cms-input" 
                  style={{ marginTop: '8px' }}
                />
              </div>
              <div className="cms-input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profile.full_name || ''} 
                  onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  required 
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group full-width">
                <label>Primary Bio (Line 1)</label>
                <textarea 
                  rows={3} 
                  value={profile.primary_bio || ''} 
                  onChange={e => setProfile(prev => ({ ...prev, primary_bio: e.target.value }))}
                  className="cms-textarea" 
                />
              </div>
              <div className="cms-input-group full-width">
                <label>Secondary Bio (Line 2)</label>
                <textarea 
                  rows={3} 
                  value={profile.secondary_bio || ''} 
                  onChange={e => setProfile(prev => ({ ...prev, secondary_bio: e.target.value }))}
                  className="cms-textarea" 
                />
              </div>
            </div>
            <button type="submit" disabled={actionLoading} className="cms-btn-save">
              {actionLoading ? <span className="cms-spinner" /> : "Save Profile"}
            </button>
          </form>
        );

      case 'projects':
        return (
          <div className="cms-card">
            <div className="cms-card-header-actions">
              <div>
                <h3 className="cms-card-title">Manage Projects</h3>
                <p className="cms-card-subtitle">Add or edit projects pulled from GitHub and custom metadata.</p>
              </div>
              <button onClick={() => openAddModal('project')} className="cms-btn-add"><LucidePlus size={16} /> Add Project</button>
            </div>
            {projects.length === 0 ? (
              <div className="cms-empty-state">
                <p>No projects registered in Supabase. Click "Add Project" to create one.</p>
              </div>
            ) : (
              <div className="cms-table-wrapper">
                <table className="cms-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Featured</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id}>
                        <td>
                          {p.image_url ? (
                            <img src={p.image_url} alt="" style={{ width: '45px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '45px', height: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} />
                          )}
                        </td>
                        <td><strong>{p.title}</strong></td>
                        <td><span className="cms-badge lang">{p.category}</span></td>
                        <td>
                          {p.featured ? (
                            <span className="cms-badge status-active">Featured</span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>No</span>
                          )}
                        </td>
                        <td>{p.display_order}</td>
                        <td className="cms-action-cells">
                          <button onClick={() => openEditModal('project', p)} className="cms-action-btn edit"><LucideEdit size={14} /></button>
                          <button onClick={() => confirmDelete('project', p)} className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'internships':
        return (
          <div className="cms-card">
            <div className="cms-card-header-actions">
              <div>
                <h3 className="cms-card-title">Manage Internships</h3>
                <p className="cms-card-subtitle">Manage professional experiences and internship records.</p>
              </div>
              <button onClick={() => openAddModal('internship')} className="cms-btn-add"><LucidePlus size={16} /> Add Internship</button>
            </div>
            {internships.length === 0 ? (
              <div className="cms-empty-state">
                <p>No internships registered yet. Click "Add Internship" to create one.</p>
              </div>
            ) : (
              <div className="cms-table-wrapper">
                <table className="cms-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Duration</th>
                      <th>Location</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internships.map(i => (
                      <tr key={i.id}>
                        <td><strong>{i.company}</strong></td>
                        <td>{i.role}</td>
                        <td>{i.duration}</td>
                        <td>{i.location}</td>
                        <td>{i.display_order}</td>
                        <td className="cms-action-cells">
                          <button onClick={() => openEditModal('internship', i)} className="cms-action-btn edit"><LucideEdit size={14} /></button>
                          <button onClick={() => confirmDelete('internship', i)} className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'certificates':
        return (
          <div className="cms-card">
            <div className="cms-card-header-actions">
              <div>
                <h3 className="cms-card-title">Manage Certificates</h3>
                <p className="cms-card-subtitle">Manage credentials and verified achievement links.</p>
              </div>
              <button onClick={() => openAddModal('certificate')} className="cms-btn-add"><LucidePlus size={16} /> Add Certificate</button>
            </div>
            {certificates.length === 0 ? (
              <div className="cms-empty-state">
                <p>No certificates registered in Supabase. Click "Add Certificate" to upload one.</p>
              </div>
            ) : (
              <div className="cms-table-wrapper">
                <table className="cms-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Issuer</th>
                      <th>Year</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(c => (
                      <tr key={c.id}>
                        <td>
                          {c.image_url ? (
                            <img src={c.image_url} alt="" style={{ width: '45px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '45px', height: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} />
                          )}
                        </td>
                        <td><strong>{c.title}</strong></td>
                        <td>{c.issuer}</td>
                        <td>{c.year}</td>
                        <td>{c.display_order}</td>
                        <td className="cms-action-cells">
                          <button onClick={() => openEditModal('certificate', c)} className="cms-action-btn edit"><LucideEdit size={14} /></button>
                          <button onClick={() => confirmDelete('certificate', c)} className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'photography':
        return (
          <div className="cms-card">
            <div className="cms-card-header-actions">
              <div>
                <h3 className="cms-card-title">Photography Gallery</h3>
                <p className="cms-card-subtitle">Upload and catalog photography work and metadata.</p>
              </div>
              <button onClick={() => openAddModal('photography')} className="cms-btn-add"><LucidePlus size={16} /> Upload Photo</button>
            </div>
            {photography.length === 0 ? (
              <div className="cms-empty-state">
                <p>No photography works uploaded. Click "Upload Photo" to add some visual assets.</p>
              </div>
            ) : (
              <div className="cms-grid-gallery">
                {photography.map(p => (
                  <div key={p.id} className="cms-gallery-item" style={{ position: 'relative' }}>
                    <img src={p.image_url} alt={p.title} />
                    <div className="cms-gallery-info">
                      <span className="title">{p.title}</span>
                      <span className="metadata">{p.camera || 'Unknown'} • {p.lens || 'Unknown'}</span>
                    </div>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <button onClick={() => openEditModal('photography', p)} className="cms-action-btn edit" style={{ width: '28px', height: '28px' }}><LucideEdit size={12} /></button>
                      <button onClick={() => confirmDelete('photography', p)} className="cms-action-btn delete" style={{ width: '28px', height: '28px' }}><LucideTrash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'cv':
        return (
          <form onSubmit={handleSaveCv} className="cms-card">
            <h3 className="cms-card-title">CV & Resume Settings</h3>
            <p className="cms-card-subtitle">Upload PDF resume and sync download actions dynamically.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group full-width">
                <label>CV PDF File</label>
                <div className="cms-file-preview">
                  <div className="pdf-icon">
                    <LucideFileText size={28} />
                  </div>
                  <div>
                    {cv.cv_url ? (
                      <a href={cv.cv_url} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.85rem', color: '#3b82f6', marginBottom: '8px', wordBreak: 'break-all' }}>
                        Active PDF: {cv.cv_url.substring(cv.cv_url.lastIndexOf('/') + 1)}
                      </a>
                    ) : (
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>No PDF uploaded yet</span>
                    )}
                    <div className="cms-file-input-wrapper">
                      <button type="button" className="cms-btn-file-dummy">
                        <LucideUpload size={14} /> Upload New PDF
                      </button>
                      <input type="file" accept=".pdf" onChange={handleCvPdfUpload} className="cms-file-input" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="cms-input-group">
                <label>Direct CV URL (Fallback Text)</label>
                <input 
                  type="text" 
                  value={cv.cv_url || ''} 
                  onChange={e => setCv(prev => ({ ...prev, cv_url: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>Document Version</label>
                <input 
                  type="text" 
                  value={cv.version || '1.0'} 
                  onChange={e => setCv(prev => ({ ...prev, version: e.target.value }))}
                  className="cms-input" 
                />
              </div>
            </div>
            <button type="submit" disabled={actionLoading} className="cms-btn-save">
              {actionLoading ? <span className="cms-spinner" /> : "Update CV settings"}
            </button>
          </form>
        );

      case 'contact':
        return (
          <form onSubmit={handleSaveContact} className="cms-card">
            <h3 className="cms-card-title">Contact & Social Networks</h3>
            <p className="cms-card-subtitle">Update links for socials and contact details shown in the footer and reach-out section.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group">
                <label>Primary Email</label>
                <input 
                  type="email" 
                  value={contact.email || ''} 
                  onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>Primary Phone</label>
                <input 
                  type="text" 
                  value={contact.phone || ''} 
                  onChange={e => setContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={contact.location || ''} 
                  onChange={e => setContact(prev => ({ ...prev, location: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>GitHub Profile</label>
                <input 
                  type="url" 
                  value={contact.github_url || ''} 
                  onChange={e => setContact(prev => ({ ...prev, github_url: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>LinkedIn Profile</label>
                <input 
                  type="url" 
                  value={contact.linkedin_url || ''} 
                  onChange={e => setContact(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>Instagram Profile</label>
                <input 
                  type="url" 
                  value={contact.instagram_url || ''} 
                  onChange={e => setContact(prev => ({ ...prev, instagram_url: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>Facebook Profile</label>
                <input 
                  type="url" 
                  value={contact.facebook_url || ''} 
                  onChange={e => setContact(prev => ({ ...prev, facebook_url: e.target.value }))}
                  className="cms-input" 
                />
              </div>
            </div>
            <button type="submit" disabled={actionLoading} className="cms-btn-save">
              {actionLoading ? <span className="cms-spinner" /> : "Save Contacts"}
            </button>
          </form>
        );

      case 'settings':
        return (
          <form onSubmit={handleSaveSettings} className="cms-card">
            <h3 className="cms-card-title">Global Settings</h3>
            <p className="cms-card-subtitle">Manage global integrations, SEO configurations, and database details.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group">
                <label>Portfolio Site Title</label>
                <input 
                  type="text" 
                  value={settings.portfolio_title || ''} 
                  onChange={e => setSettings(prev => ({ ...prev, portfolio_title: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group">
                <label>GitHub Username (For API integration)</label>
                <input 
                  type="text" 
                  value={settings.github_username || ''} 
                  onChange={e => setSettings(prev => ({ ...prev, github_username: e.target.value }))}
                  className="cms-input" 
                />
              </div>
              <div className="cms-input-group full-width">
                <label>Global SEO Description</label>
                <textarea 
                  rows={2}
                  value={settings.portfolio_description || ''} 
                  onChange={e => setSettings(prev => ({ ...prev, portfolio_description: e.target.value }))}
                  className="cms-textarea" 
                />
              </div>
              <div className="cms-input-group">
                <label>Supabase Status</label>
                <input type="text" value="Active (Production Connection)" disabled className="cms-input" style={{ opacity: 0.5 }} />
              </div>
            </div>
            <button type="submit" disabled={actionLoading} className="cms-btn-save">
              {actionLoading ? <span className="cms-spinner" /> : "Save Settings"}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cms-root">
      {/* Sidebar Navigation */}
      <div className="cms-sidebar">
        <div className="cms-logo-area">
          <div className="cms-logo-orb">
            <LucideLayoutDashboard size={20} />
          </div>
          <span className="cms-logo-text">Core CMS</span>
          <span className="cms-logo-accent">.</span>
        </div>

        <nav className="cms-nav">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cms-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={18} className="cms-nav-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="cms-footer-action">
          <button onClick={handleLogout} className="cms-logout-btn">
            <LucideLogOut size={18} style={{ marginRight: '8px' }} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main CMS panel */}
      <main className="cms-main">
        {/* Top bar */}
        <header className="cms-topbar">
          <div className="cms-topbar-left">
            <span className="cms-breadcrumb">Portfolio Console</span>
            <span className="cms-breadcrumb-sep">/</span>
            <span className="cms-breadcrumb-current">{TABS.find(t => t.id === activeTab)?.label}</span>
          </div>
          <div className="cms-topbar-right">
            <div className="cms-status-badge">
              <span className="dot animate-pulse" />
              <span>Supabase Connected</span>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering */}
        <div className="cms-content-wrap">
          {renderTabContent()}
        </div>
      </main>

      {/* Add / Edit Modals */}
      {modalType && (
        <div className="cms-modal-backdrop">
          <div className="cms-modal">
            <div className="cms-modal-header">
              <h3>{modalMode === 'add' ? 'Add' : 'Edit'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h3>
              <button onClick={() => setModalType(null)} className="cms-modal-close-btn"><LucideX size={20} /></button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="cms-modal-body">
                {modalType === 'project' && (
                  <>
                    <div className="cms-input-group">
                      <label>Title</label>
                      <input type="text" value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} required className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Category</label>
                      <select value={projectForm.category} onChange={e => setProjectForm(p => ({ ...p, category: e.target.value }))} className="cms-input">
                        <option value="Major">Major</option>
                        <option value="Secondary">Secondary</option>
                        <option value="Academic">Academic</option>
                      </select>
                    </div>
                    <div className="cms-input-group">
                      <label>Project Cover Image</label>
                      <div className="cms-file-preview">
                        {projectForm.image_url ? (
                          <img src={projectForm.image_url} alt="Cover preview" />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                        )}
                        <div className="cms-file-input-wrapper">
                          <button type="button" className="cms-btn-file-dummy"><LucideUpload size={14} /> Upload Cover</button>
                          <input type="file" accept="image/*" onChange={e => handleModalImageUpload(e, 'projects', 'project')} className="cms-file-input" />
                        </div>
                      </div>
                      <input type="text" value={projectForm.image_url} onChange={e => setProjectForm(p => ({ ...p, image_url: e.target.value }))} placeholder="Direct Image URL (Optional)" className="cms-input" style={{ marginTop: '8px' }} />
                    </div>
                    <div className="cms-input-group">
                      <label>GitHub URL</label>
                      <input type="url" value={projectForm.github_url} onChange={e => setProjectForm(p => ({ ...p, github_url: e.target.value }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Live URL</label>
                      <input type="url" value={projectForm.live_url} onChange={e => setProjectForm(p => ({ ...p, live_url: e.target.value }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Technologies (Comma separated)</label>
                      <input type="text" value={projectForm.technologies} onChange={e => setProjectForm(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Three.js, GSAP" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Display Order</label>
                      <input type="number" value={projectForm.display_order} onChange={e => setProjectForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm(p => ({ ...p, featured: e.target.checked }))} id="featured-checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <label htmlFor="featured-checkbox" style={{ cursor: 'pointer', margin: 0 }}>Feature this project</label>
                    </div>
                    <div className="cms-input-group">
                      <label>Description</label>
                      <textarea rows={3} value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} className="cms-textarea" />
                    </div>
                  </>
                )}

                {modalType === 'internship' && (
                  <>
                    <div className="cms-input-group">
                      <label>Company</label>
                      <input type="text" value={internshipForm.company} onChange={e => setInternshipForm(i => ({ ...i, company: e.target.value }))} required className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Role</label>
                      <input type="text" value={internshipForm.role} onChange={e => setInternshipForm(i => ({ ...i, role: e.target.value }))} required className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Duration</label>
                      <input type="text" value={internshipForm.duration} onChange={e => setInternshipForm(i => ({ ...i, duration: e.target.value }))} placeholder="June 2024 - August 2024" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Location</label>
                      <input type="text" value={internshipForm.location} onChange={e => setInternshipForm(i => ({ ...i, location: e.target.value }))} placeholder="Remote / Kolkata" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Certificate URL</label>
                      <input type="text" value={internshipForm.certificate_url} onChange={e => setInternshipForm(i => ({ ...i, certificate_url: e.target.value }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Display Order</label>
                      <input type="number" value={internshipForm.display_order} onChange={e => setInternshipForm(i => ({ ...i, display_order: parseInt(e.target.value) || 0 }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Description (Key activities)</label>
                      <textarea rows={3} value={internshipForm.description} onChange={e => setInternshipForm(i => ({ ...i, description: e.target.value }))} className="cms-textarea" />
                    </div>
                  </>
                )}

                {modalType === 'certificate' && (
                  <>
                    <div className="cms-input-group">
                      <label>Title</label>
                      <input type="text" value={certificateForm.title} onChange={e => setCertificateForm(c => ({ ...c, title: e.target.value }))} required className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Issuer</label>
                      <input type="text" value={certificateForm.issuer} onChange={e => setCertificateForm(c => ({ ...c, issuer: e.target.value }))} required className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Year</label>
                      <input type="text" value={certificateForm.year} onChange={e => setCertificateForm(c => ({ ...c, year: e.target.value }))} placeholder="2025" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Certificate Image</label>
                      <div className="cms-file-preview">
                        {certificateForm.image_url ? (
                          <img src={certificateForm.image_url} alt="Certificate preview" />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                        )}
                        <div className="cms-file-input-wrapper">
                          <button type="button" className="cms-btn-file-dummy"><LucideUpload size={14} /> Upload Image</button>
                          <input type="file" accept="image/*" onChange={e => handleModalImageUpload(e, 'certificates', 'certificate')} className="cms-file-input" />
                        </div>
                      </div>
                      <input type="text" value={certificateForm.image_url} onChange={e => setCertificateForm(c => ({ ...c, image_url: e.target.value }))} placeholder="Direct Image URL (Optional)" className="cms-input" style={{ marginTop: '8px' }} />
                    </div>
                    <div className="cms-input-group">
                      <label>Credential Verification URL</label>
                      <input type="url" value={certificateForm.credential_url} onChange={e => setCertificateForm(c => ({ ...c, credential_url: e.target.value }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Tags (Comma separated)</label>
                      <input type="text" value={certificateForm.tags} onChange={e => setCertificateForm(c => ({ ...c, tags: e.target.value }))} placeholder="AI, Cloud, Python" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Category</label>
                      <input type="text" value={certificateForm.category} onChange={e => setCertificateForm(c => ({ ...c, category: e.target.value }))} placeholder="Academic Certifications" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Display Order</label>
                      <input type="number" value={certificateForm.display_order} onChange={e => setCertificateForm(c => ({ ...c, display_order: parseInt(e.target.value) || 0 }))} className="cms-input" />
                    </div>
                  </>
                )}

                {modalType === 'photography' && (
                  <>
                    <div className="cms-input-group">
                      <label>Photo Title</label>
                      <input type="text" value={photographyForm.title} onChange={e => setPhotographyForm(p => ({ ...p, title: e.target.value }))} required className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Photo Image</label>
                      <div className="cms-file-preview">
                        {photographyForm.image_url ? (
                          <img src={photographyForm.image_url} alt="Preview" />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                        )}
                        <div className="cms-file-input-wrapper">
                          <button type="button" className="cms-btn-file-dummy"><LucideUpload size={14} /> Upload Photo</button>
                          <input type="file" accept="image/*" onChange={e => handleModalImageUpload(e, 'photography', 'photography')} className="cms-file-input" />
                        </div>
                      </div>
                      <input type="text" value={photographyForm.image_url} onChange={e => setPhotographyForm(p => ({ ...p, image_url: e.target.value }))} placeholder="Direct Image URL (Optional)" required className="cms-input" style={{ marginTop: '8px' }} />
                    </div>
                    <div className="cms-input-group">
                      <label>Camera Model</label>
                      <input type="text" value={photographyForm.camera} onChange={e => setPhotographyForm(p => ({ ...p, camera: e.target.value }))} placeholder="Sony A7IV / Fujifilm X-T4" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Lens Specs</label>
                      <input type="text" value={photographyForm.lens} onChange={e => setPhotographyForm(p => ({ ...p, lens: e.target.value }))} placeholder="35mm f/1.4" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>ISO</label>
                      <input type="text" value={photographyForm.iso || ''} onChange={e => setPhotographyForm(p => ({ ...p, iso: e.target.value }))} placeholder="100" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Shutter Speed</label>
                      <input type="text" value={photographyForm.shutter_speed || ''} onChange={e => setPhotographyForm(p => ({ ...p, shutter_speed: e.target.value }))} placeholder="1/250s" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Aperture</label>
                      <input type="text" value={photographyForm.aperture || ''} onChange={e => setPhotographyForm(p => ({ ...p, aperture: e.target.value }))} placeholder="f/2.8" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Capture Location</label>
                      <input type="text" value={photographyForm.location} onChange={e => setPhotographyForm(p => ({ ...p, location: e.target.value }))} placeholder="Kolkata, India" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Category</label>
                      <input type="text" value={photographyForm.category} onChange={e => setPhotographyForm(p => ({ ...p, category: e.target.value }))} placeholder="Streets, Landscapes, Portraits" className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Display Order</label>
                      <input type="number" value={photographyForm.display_order} onChange={e => setPhotographyForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="cms-input" />
                    </div>
                    <div className="cms-input-group">
                      <label>Description</label>
                      <textarea rows={3} value={photographyForm.description || ''} onChange={e => setPhotographyForm(p => ({ ...p, description: e.target.value }))} className="cms-textarea" />
                    </div>
                  </>
                )}
              </div>
              <div className="cms-modal-footer">
                <button type="button" onClick={() => setModalType(null)} className="cms-btn-cancel">Cancel</button>
                <button type="submit" disabled={actionLoading} className="cms-btn-save">
                  {actionLoading ? <span className="cms-spinner" /> : (modalMode === 'add' ? 'Create' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmType && (
        <div className="cms-modal-backdrop">
          <div className="cms-modal" style={{ width: '400px' }}>
            <div className="cms-modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <h3>Confirm Deletion</h3>
              <button onClick={() => setDeleteConfirmType(null)} className="cms-modal-close-btn"><LucideX size={20} /></button>
            </div>
            <div className="cms-modal-body" style={{ padding: '24px 24px 12px 24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
                Are you sure you want to permanently remove this entry? This action is irreversible.
              </p>
            </div>
            <div className="cms-modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="button" onClick={() => setDeleteConfirmType(null)} className="cms-btn-cancel">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={actionLoading} className="cms-btn-save" style={{ background: '#ef4444', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)' }}>
                {actionLoading ? <span className="cms-spinner" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert Popups */}
      <div className="cms-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`cms-toast ${t.type}`}>
            {t.type === 'success' ? <LucideCheck size={18} /> : <LucideX size={18} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
