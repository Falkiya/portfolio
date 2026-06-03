import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, Plus } from 'lucide-react';

export default function AdminUploadPortal({ isOpen, onClose, onProjectAdded, onProjectUpdated, projectToEdit }) {
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI SaaS');
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle pre-populating fields for editing
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '');
      setCategory(projectToEdit.category || 'AI SaaS');
      setClient(projectToEdit.client || '');
      setDate(projectToEdit.date || '');
      setLink(projectToEdit.link || '');
      setTagsInput(projectToEdit.tags ? projectToEdit.tags.join(', ') : '');
      setDescription(projectToEdit.description || '');
      setImagePreview(projectToEdit.image || '');
    } else {
      setTitle('');
      setCategory('AI SaaS');
      setClient('');
      setDate('');
      setLink('');
      setTagsInput('');
      setDescription('');
      setImagePreview('');
    }
  }, [projectToEdit, isOpen]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (2MB) for LocalStorage sanity
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image is too large. Please select an image under 2MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      setErrorMsg('Please fill in required fields (Title & Description).');
      return;
    }

    const tags = tagsInput
      ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [category, 'SaaS Project'];

    // Provide default SVG banner if no image is uploaded
    const finalImage = imagePreview || `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="45%" font-family="sans-serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle">${title.replace(/</g, "&lt;")}</text><text x="50%" y="55%" font-family="sans-serif" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">${category}</text></svg>`;

    const projectData = {
      title,
      category,
      client: client || 'Freelance Project',
      date: date || new Date().toISOString().split('T')[0].substring(0, 7),
      link: link || '#',
      image: finalImage,
      tags,
      description
    };

    if (projectToEdit) {
      onProjectUpdated(projectToEdit.id, projectData);
      setSuccessMsg('Project updated successfully!');
    } else {
      onProjectAdded(projectData);
      setSuccessMsg('Project published to your portfolio successfully!');
    }
    
    setErrorMsg('');
    
    // Reset form states and close modal
    setTimeout(() => {
      setTitle('');
      setCategory('AI SaaS');
      setClient('');
      setDate('');
      setLink('');
      setTagsInput('');
      setDescription('');
      setImagePreview('');
      setSuccessMsg('');
      onClose();
    }, 1500);
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
            <Plus size={20} className="text-gradient" />
            <h3 style={{ fontSize: '1.25rem' }}>{projectToEdit ? 'Edit Client Project' : 'Upload Client Project'}</h3>
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
                <label className="form-label">Project Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Study Buddy SaaS" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ background: 'var(--bg-secondary)', height: '42px' }}
                  >
                    <option value="AI SaaS">AI SaaS</option>
                    <option value="NLP">NLP</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Completion Month</label>
                  <input 
                    type="month" 
                    className="form-input" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ height: '42px' }}
                  />
                </div>
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. EdTech Client" 
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Project URL / Live Demo</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://yourlink.com" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Technology Tags (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. RAG, OpenRouter API, FastAPI, React" 
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea 
                  className="form-input" 
                  placeholder="Describe the project goal, core stack, and your role/contributions."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Upload Banner Section */}
              <div className="form-group">
                <label className="form-label">Project Screenshot / Banner</label>
                <div style={{
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  
                  {imagePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto', borderRadius: '4px' }} 
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Screenshot Loaded</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                      <Upload size={20} />
                      <span style={{ fontSize: '0.8rem' }}>Click or drag a screenshot image here</span>
                      <span style={{ fontSize: '0.65rem' }}>PNG or JPG (under 2MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {errorMsg && <p style={{ color: '#f87171', fontSize: '0.8rem' }}>{errorMsg}</p>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {projectToEdit ? 'Save Changes' : 'Publish Project to Portfolio'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
