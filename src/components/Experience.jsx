import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, Calendar, BookOpen, ExternalLink, ShieldCheck, Pencil } from 'lucide-react';

export default function Experience({ workExperience = [], educationCredentials = {}, onOpenEditModal, isAdmin = false }) {
  const [activeTab, setActiveTab] = useState('work');

  const educationAndCertifications = {
    education: educationCredentials.education || [],
    certifications: educationCredentials.certifications || [],
    achievements: educationCredentials.achievements || []
  };

  return (
    <section id="experience" style={{ padding: '6rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span className="text-gradient">Journey &amp; Credentials</span>
            {isAdmin && (
              <button 
                onClick={() => onOpenEditModal(activeTab === 'work' ? 'work' : 'edu')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                title="Edit Journey & Credentials"
              >
                <Pencil size={18} />
              </button>
            )}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A timeline of my professional engagements, academic record, certifications, and leadership roles.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '3rem'
        }}>
          <button 
            onClick={() => setActiveTab('work')}
            className={`btn ${activeTab === 'work' ? 'btn-primary glow-cyan' : 'btn-secondary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Briefcase size={16} />
            Professional Experience
          </button>
          <button 
            onClick={() => setActiveTab('edu')}
            className={`btn ${activeTab === 'edu' ? 'btn-primary glow-cyan' : 'btn-secondary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <GraduationCap size={16} />
            Education &amp; Awards
          </button>
        </div>

        {/* Content Panel */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {activeTab === 'work' ? (
            /* Work Experience Timeline */
            <div className="timeline">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="glass-card" style={{ padding: '1.75rem' }}>
                    {/* Role Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{exp.role}</h3>
                        <p style={{ color: 'var(--accent-cyan)', fontWeight: 500, fontSize: '0.95rem' }}>{exp.company}</p>
                      </div>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        background: 'var(--bg-primary)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)'
                      }}>
                        <Calendar size={14} />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul style={{ 
                      paddingLeft: '1.2rem', 
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      marginBottom: '1.25rem'
                    }}>
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>

                    {/* Skill Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {exp.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="badge">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Education & Credentials Panel */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Education section */}
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', marginBottom: '1.25rem' }} className="text-gradient">
                  <BookOpen size={20} /> 
                  <span>Academic History</span>
                  {isAdmin && (
                    <button 
                      onClick={() => onOpenEditModal('edu')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Edit Academics"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </h3>
                {educationAndCertifications.education.map((edu, idx) => (
                  <div key={idx} className="glass-card" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>{edu.degree}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{edu.period}</span>
                    </div>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{edu.institution}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{edu.details}</p>
                  </div>
                ))}
              </div>

              {/* Achievements & Competitions */}
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', marginBottom: '1.25rem' }} className="text-gradient">
                  <Award size={20} /> 
                  <span>Awards &amp; Accomplishments</span>
                  {isAdmin && (
                    <button 
                      onClick={() => onOpenEditModal('ach')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Edit Achievements"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </h3>
                <div className="grid-cols-2">
                  {educationAndCertifications.achievements.map((ach, idx) => (
                    <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <Award size={18} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{ach.title}</h4>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', marginBottom: '1.25rem' }} className="text-gradient">
                  <ShieldCheck size={20} /> 
                  <span>Verified Certifications</span>
                  {isAdmin && (
                    <button 
                      onClick={() => onOpenEditModal('certs')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Edit Certifications"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </h3>
                <div style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {educationAndCertifications.certifications.map((cert, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
