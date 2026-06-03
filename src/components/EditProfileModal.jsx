import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Edit3, User } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, aboutDetails, onSave }) {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profilePhotoZoom, setProfilePhotoZoom] = useState(100);
  const [profilePhotoX, setProfilePhotoX] = useState(50);
  const [profilePhotoY, setProfilePhotoY] = useState(50);
  const [rolesInput, setRolesInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Populate form with current details when modal opens
  useEffect(() => {
    if (aboutDetails && isOpen) {
      setName(aboutDetails.name || '');
      setSummary(aboutDetails.summary || '');
      setLocation(aboutDetails.location || '');
      setEmail(aboutDetails.email || '');
      setPhone(aboutDetails.phone || '');
      setProfilePhoto(aboutDetails.profilePhoto || '');
      setProfilePhotoZoom(aboutDetails.profilePhotoZoom || 100);
      setProfilePhotoX(aboutDetails.profilePhotoX !== undefined ? aboutDetails.profilePhotoX : 50);
      setProfilePhotoY(aboutDetails.profilePhotoY !== undefined ? aboutDetails.profilePhotoY : 50);
      setRolesInput(aboutDetails.roles ? aboutDetails.roles.join(', ') : '');
    }
  }, [aboutDetails, isOpen]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image is too large. Please select an image under 2MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
      setProfilePhotoZoom(100);
      setProfilePhotoX(50);
      setProfilePhotoY(50);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !summary.trim()) {
      setErrorMsg('Name and Bio Summary are required.');
      return;
    }

    const roles = rolesInput
      ? rolesInput.split(',').map(r => r.trim()).filter(r => r.length > 0)
      : ['AI Developer'];

    const updated = {
      name,
      summary,
      location,
      email,
      phone: '',
      profilePhoto,
      profilePhotoZoom,
      profilePhotoX,
      profilePhotoY,
      roles
    };

    onSave(updated);
    setSuccessMsg('Profile updated successfully!');
    setErrorMsg('');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-card glow-cyan" style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '2rem'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={24} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Edit3 size={20} className="text-gradient" />
            <h3 style={{ fontSize: '1.25rem' }}>Edit About Details</h3>
          </div>

          {successMsg ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <CheckCircle size={48} style={{ color: 'var(--accent-emerald)', animation: 'pulse-slow 2s infinite' }} />
              <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', fontWeight: 600 }}>{successMsg}</h4>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              {/* Profile Photo Upload Field */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <div style={{
                  width: '60px',
                  height: '85px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transform: `scale(${profilePhotoZoom / 100})`,
                        objectPosition: `${profilePhotoX}% ${profilePhotoY}%`,
                        transition: 'transform 0.1s ease'
                      }} 
                    />
                  ) : (
                    <User size={20} style={{ opacity: 0.5 }} />
                  )}
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Profile Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                  />
                </div>
              </div>

              {/* Adjust image controls */}
              {profilePhoto && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Adjust Image Fit</span>
                  
                  {/* Zoom Slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>Zoom Level</span>
                      <span>{profilePhotoZoom}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="250" 
                      value={profilePhotoZoom}
                      onChange={(e) => setProfilePhotoZoom(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Y-Position (Vertical Shift) Slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>Vertical Align</span>
                      <span>{profilePhotoY}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={profilePhotoY}
                      onChange={(e) => setProfilePhotoY(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* X-Position (Horizontal Shift) Slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>Horizontal Align</span>
                      <span>{profilePhotoX}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={profilePhotoX}
                      onChange={(e) => setProfilePhotoX(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhoto('');
                      setProfilePhotoZoom(100);
                      setProfilePhotoX(50);
                      setProfilePhotoY(50);
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '0.35rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  >
                    Delete Photo
                  </button>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FALKIYA AFREEN"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Animated Titles (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={rolesInput}
                  onChange={(e) => setRolesInput(e.target.value)}
                  placeholder="e.g. AI Engineer, SaaS Builder, Prompt Engineer"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mysuru, Karnataka"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio Summary *</label>
                <textarea 
                  className="form-input" 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tell visitors about your background, grades, and passions..."
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  required
                />
              </div>

              {errorMsg && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{errorMsg}</p>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Profile Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
