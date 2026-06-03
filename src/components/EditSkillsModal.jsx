import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Edit3, Plus, Trash2 } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function EditSkillsModal({ isOpen, onClose, onSave }) {
  const [categories, setCategories] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [catTitle, setCatTitle] = useState('');
  const [catSkillsInput, setCatSkillsInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const currentSkills = databaseService.getSkills();
      setCategories(currentSkills);
      if (currentSkills.length > 0) {
        selectCategory(0, currentSkills);
      } else {
        setActiveCategoryIndex(null);
        setCatTitle('');
        setCatSkillsInput('');
      }
    }
  }, [isOpen]);

  const selectCategory = (index, currentCats = categories) => {
    setActiveCategoryIndex(index);
    const cat = currentCats[index];
    if (cat) {
      setCatTitle(cat.title || '');
      setCatSkillsInput(cat.skills ? cat.skills.join(', ') : '');
    }
  };

  const handleAddCategory = () => {
    const newCat = {
      title: 'New Skill Group',
      skills: ['Sample Skill']
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    selectCategory(updated.length - 1, updated);
  };

  const handleDeleteCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    if (updated.length > 0) {
      selectCategory(Math.max(0, index - 1), updated);
    } else {
      setActiveCategoryIndex(null);
      setCatTitle('');
      setCatSkillsInput('');
    }
  };

  const handleUpdateActive = () => {
    if (activeCategoryIndex === null) return;
    
    const updatedSkills = catSkillsInput
      ? catSkillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const updatedCats = categories.map((cat, i) => {
      if (i === activeCategoryIndex) {
        return {
          ...cat,
          title: catTitle.trim() || 'Untitled Category',
          skills: updatedSkills
        };
      }
      return cat;
    });

    setCategories(updatedCats);
    return updatedCats;
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    
    // Save current active changes first
    let finalCats = categories;
    if (activeCategoryIndex !== null) {
      finalCats = handleUpdateActive();
    }

    databaseService.updateSkills(finalCats);
    if (onSave) onSave(finalCats);

    setSuccessMsg('Skills updated successfully!');
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
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-card glow-cyan" style={{
        width: '100%',
        maxWidth: '700px',
        height: '75vh',
        overflow: 'hidden',
        position: 'relative',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} className="text-gradient" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Manage Skills Categories</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <CheckCircle size={48} style={{ color: 'var(--accent-emerald)', animation: 'pulse-slow 2s infinite' }} />
            <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', fontWeight: 600 }}>{successMsg}</h4>
          </div>
        ) : (
          <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            {/* Sidebar Skill categories */}
            <div style={{
              width: '240px',
              borderRight: '1px solid var(--glass-border)',
              background: 'rgba(0,0,0,0.1)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>CATEGORIES ({categories.length})</span>
                <button 
                  onClick={handleAddCategory}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem'
                  }}
                  title="Add Category"
                >
                  <Plus size={16} />
                </button>
              </div>
              {categories.map((cat, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: idx === activeCategoryIndex ? 'var(--accent-cyan-glow)' : 'transparent',
                    borderBottom: '1px solid var(--glass-border)'
                  }}
                >
                  <button
                    onClick={() => {
                      handleUpdateActive();
                      selectCategory(idx);
                    }}
                    style={{
                      padding: '0.9rem 1rem',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: 'inherit',
                      fontSize: '0.85rem',
                      fontWeight: idx === activeCategoryIndex ? 600 : 400,
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.title || 'Untitled'}
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(idx)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.9rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Active Editor Pane */}
            <div style={{ flexGrow: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              {activeCategoryIndex !== null ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
                  <div className="form-group">
                    <label className="form-label">Category Title *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={catTitle}
                      onChange={(e) => setCatTitle(e.target.value)}
                      placeholder="e.g. Core AI Skills"
                    />
                  </div>

                  <div className="form-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <label className="form-label">Skills List (comma-separated) *</label>
                    <textarea 
                      className="form-input" 
                      value={catSkillsInput}
                      onChange={(e) => setCatSkillsInput(e.target.value)}
                      placeholder="e.g. RAG, OpenRouter API, FastAPI, Python"
                      style={{ flexGrow: 1, minHeight: '180px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <button 
                      onClick={() => handleUpdateActive()} 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ flex: 1 }}
                    >
                      Update Category
                    </button>
                    <button 
                      onClick={handleSaveAll} 
                      type="button" 
                      className="btn btn-primary" 
                      style={{ flex: 1 }}
                    >
                      Save All Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '0.9rem' }}>Create or select a category in the sidebar to start adding skills.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
