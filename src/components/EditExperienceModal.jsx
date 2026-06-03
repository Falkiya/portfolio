import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Edit3, Plus, Trash2, Briefcase, GraduationCap, Award, ShieldCheck } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function EditExperienceModal({ isOpen, onClose, onSave, initialTab = 'work' }) {
  const [activeSubTab, setActiveSubTab] = useState(initialTab); // 'work', 'edu', 'ach', 'certs'
  const [successMsg, setSuccessMsg] = useState('');

  // Experience Data
  const [workList, setWorkList] = useState([]);
  const [activeWorkIndex, setActiveWorkIndex] = useState(null);
  
  // Work fields
  const [wRole, setWRole] = useState('');
  const [wCompany, setWCompany] = useState('');
  const [wPeriod, setWPeriod] = useState('');
  const [wBullets, setWBullets] = useState('');
  const [wSkills, setWSkills] = useState('');

  // Education/Certs Data
  const [eduList, setEduList] = useState([]);
  const [activeEduIndex, setActiveEduIndex] = useState(null);
  const [eDegree, setEDegree] = useState('');
  const [eInstitution, setEInstitution] = useState('');
  const [ePeriod, setEPeriod] = useState('');
  const [eDetails, setEDetails] = useState('');

  // Achievements Data
  const [achList, setAchList] = useState([]);
  const [activeAchIndex, setActiveAchIndex] = useState(null);
  const [aTitle, setATitle] = useState('');
  const [aDesc, setADesc] = useState('');

  // Certs Data
  const [certsInput, setCertsInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveSubTab(initialTab);
      // Load Work
      const currentWork = databaseService.getExperience();
      setWorkList(currentWork);
      if (currentWork.length > 0) {
        selectWork(0, currentWork);
      } else {
        clearWorkFields();
      }

      // Load Edu/Certs
      const currentEduData = databaseService.getEducationCredentials();
      setEduList(currentEduData.education || []);
      if ((currentEduData.education || []).length > 0) {
        selectEdu(0, currentEduData.education);
      } else {
        clearEduFields();
      }

      setAchList(currentEduData.achievements || []);
      if ((currentEduData.achievements || []).length > 0) {
        selectAch(0, currentEduData.achievements);
      } else {
        clearAchFields();
      }

      setCertsInput(currentEduData.certifications ? currentEduData.certifications.join('\n') : '');
    }
  }, [isOpen]);

  // WORK HELPERS
  const selectWork = (idx, list = workList) => {
    setActiveWorkIndex(idx);
    const item = list[idx];
    if (item) {
      setWRole(item.role || '');
      setWCompany(item.company || '');
      setWPeriod(item.period || '');
      setWBullets(item.bullets ? item.bullets.join('\n') : '');
      setWSkills(item.skills ? item.skills.join(', ') : '');
    }
  };

  const clearWorkFields = () => {
    setActiveWorkIndex(null);
    setWRole('');
    setWCompany('');
    setWPeriod('');
    setWBullets('');
    setWSkills('');
  };

  const handleAddWork = () => {
    const newItem = {
      id: `work-${Date.now()}`,
      role: 'New Engagement',
      company: 'Company',
      period: 'Period',
      bullets: ['Describe your duties'],
      skills: ['Skill']
    };
    const updated = [...workList, newItem];
    setWorkList(updated);
    selectWork(updated.length - 1, updated);
  };

  const handleDeleteWork = (idx) => {
    const updated = workList.filter((_, i) => i !== idx);
    setWorkList(updated);
    if (updated.length > 0) {
      selectWork(Math.max(0, idx - 1), updated);
    } else {
      clearWorkFields();
    }
  };

  const handleUpdateActiveWork = () => {
    if (activeWorkIndex === null) return workList;

    const bulletsArray = wBullets
      ? wBullets.split('\n').map(b => b.trim()).filter(b => b.length > 0)
      : [];
    const skillsArray = wSkills
      ? wSkills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const updated = workList.map((item, i) => {
      if (i === activeWorkIndex) {
        return {
          ...item,
          role: wRole.trim() || 'Untitled Role',
          company: wCompany.trim() || 'Untitled Company',
          period: wPeriod.trim() || 'Period',
          bullets: bulletsArray,
          skills: skillsArray
        };
      }
      return item;
    });

    setWorkList(updated);
    return updated;
  };

  // EDUCATION HELPERS
  const selectEdu = (idx, list = eduList) => {
    setActiveEduIndex(idx);
    const item = list[idx];
    if (item) {
      setEDegree(item.degree || '');
      setEInstitution(item.institution || '');
      setEPeriod(item.period || '');
      setEDetails(item.details || '');
    }
  };

  const clearEduFields = () => {
    setActiveEduIndex(null);
    setEDegree('');
    setEInstitution('');
    setEPeriod('');
    setEDetails('');
  };

  const handleAddEdu = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      degree: 'Degree Program',
      institution: 'College/School',
      period: 'Years',
      details: 'GPA, details...'
    };
    const updated = [...eduList, newItem];
    setEduList(updated);
    selectEdu(updated.length - 1, updated);
  };

  const handleDeleteEdu = (idx) => {
    const updated = eduList.filter((_, i) => i !== idx);
    setEduList(updated);
    if (updated.length > 0) {
      selectEdu(Math.max(0, idx - 1), updated);
    } else {
      clearEduFields();
    }
  };

  const handleUpdateActiveEdu = () => {
    if (activeEduIndex === null) return eduList;

    const updated = eduList.map((item, i) => {
      if (i === activeEduIndex) {
        return {
          ...item,
          degree: eDegree.trim() || 'Degree',
          institution: eInstitution.trim() || 'Institution',
          period: ePeriod.trim() || 'Period',
          details: eDetails.trim()
        };
      }
      return item;
    });

    setEduList(updated);
    return updated;
  };

  // ACHIEVEMENTS HELPERS
  const selectAch = (idx, list = achList) => {
    setActiveAchIndex(idx);
    const item = list[idx];
    if (item) {
      setATitle(item.title || '');
      setADesc(item.desc || '');
    }
  };

  const clearAchFields = () => {
    setActiveAchIndex(null);
    setATitle('');
    setADesc('');
  };

  const handleAddAch = () => {
    const newItem = {
      id: `ach-${Date.now()}`,
      title: 'New Award',
      desc: 'Short description...'
    };
    const updated = [...achList, newItem];
    setAchList(updated);
    selectAch(updated.length - 1, updated);
  };

  const handleDeleteAch = (idx) => {
    const updated = achList.filter((_, i) => i !== idx);
    setAchList(updated);
    if (updated.length > 0) {
      selectAch(Math.max(0, idx - 1), updated);
    } else {
      clearAchFields();
    }
  };

  const handleUpdateActiveAch = () => {
    if (activeAchIndex === null) return achList;

    const updated = achList.map((item, i) => {
      if (i === activeAchIndex) {
        return {
          ...item,
          title: aTitle.trim() || 'Award',
          desc: aDesc.trim()
        };
      }
      return item;
    });

    setAchList(updated);
    return updated;
  };

  // SAVE ALL
  const handleSaveAll = (e) => {
    if (e) e.preventDefault();

    // Sync any edits currently in active inputs
    let finalWork = workList;
    if (activeSubTab === 'work' && activeWorkIndex !== null) {
      finalWork = handleUpdateActiveWork();
    }
    
    let finalEdu = eduList;
    if (activeSubTab === 'edu' && activeEduIndex !== null) {
      finalEdu = handleUpdateActiveEdu();
    }

    let finalAch = achList;
    if (activeSubTab === 'ach' && activeAchIndex !== null) {
      finalAch = handleUpdateActiveAch();
    }

    const finalCerts = certsInput
      ? certsInput.split('\n').map(c => c.trim()).filter(c => c.length > 0)
      : [];

    // Save Work list
    databaseService.updateExperience(finalWork);

    // Save Education/Certs structure
    const updatedEduData = {
      education: finalEdu,
      certifications: finalCerts,
      achievements: finalAch
    };
    databaseService.updateEducationCredentials(updatedEduData);

    if (onSave) {
      onSave(finalWork, updatedEduData);
    }

    setSuccessMsg('Journey credentials saved successfully!');
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
        maxWidth: '850px',
        height: '80vh',
        overflow: 'hidden',
        position: 'relative',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid var(--accent-purple)'
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
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Manage Journey Credentials</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Headers selector */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(0,0,0,0.15)',
          padding: '0.2rem 1rem'
        }}>
          <button 
            onClick={() => { handleUpdateActiveWork(); setActiveSubTab('work'); }}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'work' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeSubTab === 'work' ? 600 : 400,
              fontSize: '0.85rem',
              borderBottom: activeSubTab === 'work' ? '2px solid var(--accent-cyan)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Briefcase size={14} /> Work Timeline
          </button>
          <button 
            onClick={() => { handleUpdateActiveEdu(); setActiveSubTab('edu'); }}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'edu' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeSubTab === 'edu' ? 600 : 400,
              fontSize: '0.85rem',
              borderBottom: activeSubTab === 'edu' ? '2px solid var(--accent-cyan)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <GraduationCap size={14} /> Academics
          </button>
          <button 
            onClick={() => { handleUpdateActiveAch(); setActiveSubTab('ach'); }}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'ach' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeSubTab === 'ach' ? 600 : 400,
              fontSize: '0.85rem',
              borderBottom: activeSubTab === 'ach' ? '2px solid var(--accent-cyan)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Award size={14} /> Achievements
          </button>
          <button 
            onClick={() => setActiveSubTab('certs')}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'transparent',
              color: activeSubTab === 'certs' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeSubTab === 'certs' ? 600 : 400,
              fontSize: '0.85rem',
              borderBottom: activeSubTab === 'certs' ? '2px solid var(--accent-cyan)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ShieldCheck size={14} /> Certifications
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
            
            {/* SUBTAB 1: WORK TIMELINE */}
            {activeSubTab === 'work' && (
              <>
                {/* Work list Sidebar */}
                <div style={{ width: '250px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>EXPERIENCE ({workList.length})</span>
                    <button onClick={handleAddWork} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Add Role">
                      <Plus size={16} />
                    </button>
                  </div>
                  {workList.map((w, idx) => (
                    <div key={w.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: idx === activeWorkIndex ? 'var(--accent-cyan-glow)' : 'transparent', borderBottom: '1px solid var(--glass-border)' }}>
                      <button 
                        onClick={() => { handleUpdateActiveWork(); selectWork(idx); }}
                        style={{ padding: '0.8rem 1rem', border: 'none', textAlign: 'left', cursor: 'pointer', background: 'transparent', color: 'inherit', fontSize: '0.85rem', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        <span style={{ fontWeight: idx === activeWorkIndex ? 600 : 400, display: 'block' }}>{w.role}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{w.company}</span>
                      </button>
                      <button onClick={() => handleDeleteWork(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', opacity: 0.7 }} title="Delete Role">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {/* Work Edit Pane */}
                <div style={{ flexGrow: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
                  {activeWorkIndex !== null ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div className="grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Role Title *</label>
                          <input type="text" className="form-input" value={wRole} onChange={(e) => setWRole(e.target.value)} placeholder="e.g. RAG Engineer" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Company/Host *</label>
                          <input type="text" className="form-input" value={wCompany} onChange={(e) => setWCompany(e.target.value)} placeholder="e.g. Microsoft & SAP" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Period *</label>
                        <input type="text" className="form-input" value={wPeriod} onChange={(e) => setWPeriod(e.target.value)} placeholder="e.g. 2024 – Present" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Timeline Bullet Points (one per line) *</label>
                        <textarea className="form-input" value={wBullets} onChange={(e) => setWBullets(e.target.value)} placeholder="• Built deep RAG pipelines..." style={{ minHeight: '120px', resize: 'vertical' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Skills (comma-separated)</label>
                        <input type="text" className="form-input" value={wSkills} onChange={(e) => setWSkills(e.target.value)} placeholder="FastAPI, Python, RAG" />
                      </div>
                      <button onClick={handleSaveAll} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Experience Details</button>
                    </div>
                  ) : (
                    <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>Select or create a work history item to start editing.</div>
                  )}
                </div>
              </>
            )}

            {/* SUBTAB 2: ACADEMICS */}
            {activeSubTab === 'edu' && (
              <>
                {/* Edu list Sidebar */}
                <div style={{ width: '250px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>SCHOOLS/COLLEGES ({eduList.length})</span>
                    <button onClick={handleAddEdu} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Add Edu">
                      <Plus size={16} />
                    </button>
                  </div>
                  {eduList.map((e, idx) => (
                    <div key={e.id || idx} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', background: idx === activeEduIndex ? 'var(--accent-cyan-glow)' : 'transparent', borderBottom: '1px solid var(--glass-border)' }}>
                      <button 
                        onClick={() => { handleUpdateActiveEdu(); selectEdu(idx); }}
                        style={{ padding: '0.8rem 1rem', border: 'none', textAlign: 'left', cursor: 'pointer', background: 'transparent', color: 'inherit', fontSize: '0.85rem', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        <span style={{ fontWeight: idx === activeEduIndex ? 600 : 400, display: 'block' }}>{e.degree}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{e.institution}</span>
                      </button>
                      <button onClick={() => handleDeleteEdu(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', opacity: 0.7 }} title="Delete School">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {/* Edu Edit Pane */}
                <div style={{ flexGrow: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
                  {activeEduIndex !== null ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Degree/Education Program *</label>
                        <input type="text" className="form-input" value={eDegree} onChange={(e) => setEDegree(e.target.value)} placeholder="e.g. Bachelor of Computer Applications" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Institution/College *</label>
                        <input type="text" className="form-input" value={eInstitution} onChange={(e) => setEInstitution(e.target.value)} placeholder="e.g. St. Joseph's College" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Period/Years *</label>
                        <input type="text" className="form-input" value={ePeriod} onChange={(e) => setEPeriod(e.target.value)} placeholder="e.g. 2023 – Present" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Academic Details (GPA, milestones, etc.)</label>
                        <textarea className="form-input" value={eDetails} onChange={(e) => setEDetails(e.target.value)} placeholder="CGPA 8.5, elected class representative..." style={{ minHeight: '100px', resize: 'vertical' }} />
                      </div>
                      <button onClick={handleSaveAll} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Academic Details</button>
                    </div>
                  ) : (
                    <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>Select or create an academic record to start editing.</div>
                  )}
                </div>
              </>
            )}

            {/* SUBTAB 3: ACHIEVEMENTS */}
            {activeSubTab === 'ach' && (
              <>
                {/* Achievements list Sidebar */}
                <div style={{ width: '250px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>AWARDS ({achList.length})</span>
                    <button onClick={handleAddAch} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Add Award">
                      <Plus size={16} />
                    </button>
                  </div>
                  {achList.map((a, idx) => (
                    <div key={a.id || idx} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', background: idx === activeAchIndex ? 'var(--accent-cyan-glow)' : 'transparent', borderBottom: '1px solid var(--glass-border)' }}>
                      <button 
                        onClick={() => { handleUpdateActiveAch(); selectAch(idx); }}
                        style={{ padding: '0.8rem 1rem', border: 'none', textAlign: 'left', cursor: 'pointer', background: 'transparent', color: 'inherit', fontSize: '0.85rem', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        <span style={{ fontWeight: idx === activeAchIndex ? 600 : 400, display: 'block' }}>{a.title}</span>
                      </button>
                      <button onClick={() => handleDeleteAch(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', opacity: 0.7 }} title="Delete Award">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {/* Achievements Edit Pane */}
                <div style={{ flexGrow: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
                  {activeAchIndex !== null ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Award Title *</label>
                        <input type="text" className="form-input" value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="e.g. Miss Josephite leadership award" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Award Description</label>
                        <textarea className="form-input" value={aDesc} onChange={(e) => setADesc(e.target.value)} placeholder="Describe the achievement in detail..." style={{ minHeight: '120px', resize: 'vertical' }} />
                      </div>
                      <button onClick={handleSaveAll} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Award Details</button>
                    </div>
                  ) : (
                    <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>Select or create an achievement card to start editing.</div>
                  )}
                </div>
              </>
            )}

            {/* SUBTAB 4: CERTIFICATIONS */}
            {activeSubTab === 'certs' && (
              <div style={{ flexGrow: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label">Verified Certifications (one per line)</label>
                  <textarea 
                    className="form-input" 
                    value={certsInput}
                    onChange={(e) => setCertsInput(e.target.value)}
                    placeholder="e.g. Microsoft Tech Saksham Certified&#10;IBM SkillsBuild IT Orientation&#10;Certified in AI Tools"
                    style={{ flexGrow: 1, minHeight: '220px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.6' }}
                  />
                </div>
                <button onClick={handleSaveAll} className="btn btn-primary" style={{ width: '100%' }}>Save Certifications</button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
