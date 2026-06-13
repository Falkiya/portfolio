import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Edit3 } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, aboutDetails, onSave }) {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
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
      setLinkedin(aboutDetails.linkedin || '');
      setRolesInput(aboutDetails.roles ? aboutDetails.roles.join(', ') : '');
    }
  }, [aboutDetails, isOpen]);

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
      phone,
      linkedin,
      profilePhoto: '',
      profilePhotoZoom: 100,
      profilePhotoX: 50,
      profilePhotoY: 50,
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
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
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
