import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LucideLayoutDashboard, LucideUser, LucideBriefcase, LucideAward, 
  LucideCamera, LucideFileText, LucideMail, LucideSettings, 
  LucideLogOut, LucidePlus, LucideEdit, LucideTrash2, LucideDatabase
} from 'lucide-react';
import { logoutAdmin } from '../utils/auth';
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

  const handleLogout = () => {
    logoutAdmin();
    navigate('/', { replace: true });
    // Force reload to clean up memory/states
    window.location.reload();
  };

  // Render content area based on selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="cms-card">
            <h3 className="cms-card-title">Edit Profile</h3>
            <p className="cms-card-subtitle">Manage bio information and landing text shown on the portfolio.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group">
                <label>Profile Image URL</label>
                <input type="text" defaultValue="/arup.jpg" className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>Full Name</label>
                <input type="text" defaultValue="Arup Das" className="cms-input" />
              </div>
              <div className="cms-input-group full-width">
                <label>Primary Bio (Line 1)</label>
                <textarea rows={3} className="cms-textarea" defaultValue="I am a detail-oriented Computer Science & Engineering student at Brainware University, specialising in Artificial Intelligence and Machine Learning..." />
              </div>
              <div className="cms-input-group full-width">
                <label>Secondary Bio (Line 2)</label>
                <textarea rows={3} className="cms-textarea" defaultValue="With a strong foundation in Python, Java, C/C++, and scalable backend databases, I focus on building stable applications..." />
              </div>
            </div>
            <button className="cms-btn-save">Save Profile</button>
          </div>
        );
      case 'projects':
        return (
          <div className="cms-card">
            <div className="cms-card-header-actions">
              <div>
                <h3 className="cms-card-title">Manage Projects</h3>
                <p className="cms-card-subtitle">Add or edit projects pulled from GitHub and custom metadata.</p>
              </div>
              <button className="cms-btn-add"><LucidePlus size={16} /> Add Project</button>
            </div>
            <div className="cms-table-wrapper">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Language</th>
                    <th>Role</th>
                    <th>Sync Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>LocalCare Finder</strong></td>
                    <td><span className="cms-badge lang">Kotlin</span></td>
                    <td>Lead Android Dev</td>
                    <td><span className="cms-badge status-active">Synced</span></td>
                    <td className="cms-action-cells">
                      <button className="cms-action-btn edit"><LucideEdit size={14} /></button>
                      <button className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>NEURAL-RIFT</strong></td>
                    <td><span className="cms-badge lang">TypeScript</span></td>
                    <td>Founder / Architect</td>
                    <td><span className="cms-badge status-active">Synced</span></td>
                    <td className="cms-action-cells">
                      <button className="cms-action-btn edit"><LucideEdit size={14} /></button>
                      <button className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
              <button className="cms-btn-add"><LucidePlus size={16} /> Add Internship</button>
            </div>
            <div className="cms-empty-state">
              <p>No internships registered yet. Click "Add Internship" to create one.</p>
            </div>
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
              <button className="cms-btn-add"><LucidePlus size={16} /> Add Certificate</button>
            </div>
            <div className="cms-table-wrapper">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Issuer</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>AI Fluency Framework & Foundations</strong></td>
                    <td>Anthropic</td>
                    <td>2026</td>
                    <td className="cms-action-cells">
                      <button className="cms-action-btn edit"><LucideEdit size={14} /></button>
                      <button className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Responsive Web Design</strong></td>
                    <td>freeCodeCamp</td>
                    <td>2025</td>
                    <td className="cms-action-cells">
                      <button className="cms-action-btn edit"><LucideEdit size={14} /></button>
                      <button className="cms-action-btn delete"><LucideTrash2 size={14} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'photography':
        return (
          <div className="cms-card">
            <div className="cms-card-header-actions">
              <div>
                <h3 className="cms-card-title">Photography Gallery</h3>
                <p className="cms-card-subtitle">Upload and catalog photography work and EXIF metadata.</p>
              </div>
              <button className="cms-btn-add"><LucidePlus size={16} /> Upload Photo</button>
            </div>
            <div className="cms-grid-gallery">
              <div className="cms-gallery-item">
                <img src="/photos/1.jpg" alt="Amber Awakening" />
                <div className="cms-gallery-info">
                  <span className="title">Amber Awakening</span>
                  <span className="metadata">Sony A7IV • f/1.8</span>
                </div>
              </div>
              <div className="cms-gallery-item">
                <img src="/photos/2.jpg" alt="Offerings of Devotion" />
                <div className="cms-gallery-info">
                  <span className="title">Offerings of Devotion</span>
                  <span className="metadata">Fujifilm X-T4 • f/2.8</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'cv':
        return (
          <div className="cms-card">
            <h3 className="cms-card-title">CV & Resume Settings</h3>
            <p className="cms-card-subtitle">Upload PDF resume or edit resume timeline listings.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group full-width">
                <label>Resume Download URL (PDF)</label>
                <input type="text" defaultValue="/Arup_Das_Resume.pdf" className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>Total Experience Listed (Years)</label>
                <input type="number" defaultValue={2} className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>Last Updated</label>
                <input type="date" defaultValue="2026-06-15" className="cms-input" />
              </div>
            </div>
            <button className="cms-btn-save">Update CV settings</button>
          </div>
        );
      case 'contact':
        return (
          <div className="cms-card">
            <h3 className="cms-card-title">Contact & Social Networks</h3>
            <p className="cms-card-subtitle">Update links for socials and contact details shown in the footer and reach-out section.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group">
                <label>Primary Email</label>
                <input type="email" defaultValue="dasarup0804@gmail.com" className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>Location</label>
                <input type="text" defaultValue="Kolkata, West Bengal, India" className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>GitHub Profile</label>
                <input type="url" defaultValue="https://github.com/arupdas0825" className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>LinkedIn Profile</label>
                <input type="url" defaultValue="https://www.linkedin.com/in/arup-das-381bb02a1/" className="cms-input" />
              </div>
            </div>
            <button className="cms-btn-save">Save Contacts</button>
          </div>
        );
      case 'settings':
        return (
          <div className="cms-card">
            <h3 className="cms-card-title">Global Settings</h3>
            <p className="cms-card-subtitle">Manage global integrations, SEO configurations, and database sync details.</p>
            <div className="cms-form-grid">
              <div className="cms-input-group">
                <label>Maintenance Mode</label>
                <select className="cms-input">
                  <option value="false">Disabled (Site is Live)</option>
                  <option value="true">Enabled (Lock site)</option>
                </select>
              </div>
              <div className="cms-input-group">
                <label>Google Analytics Tag</label>
                <input type="text" defaultValue="G-YRHP147LKR" className="cms-input" />
              </div>
              <div className="cms-input-group">
                <label>Supabase Sync Status</label>
                <input type="text" defaultValue="Ready (CRUD hooks pending)" disabled className="cms-input" />
              </div>
            </div>
            <button className="cms-btn-save">Save Settings</button>
          </div>
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
              <span>Supabase Ready</span>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering */}
        <div className="cms-content-wrap">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
