import React, { useState } from 'react';
import { Filter, ExternalLink, Calendar, User, Code, Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';
import TiltCard from './TiltCard';

export default function ProjectsSection({ projects, onOpenUploadPortal, onEditProject, onDeleteProject, onOpenDetailsModal }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'AI SaaS', 'NLP', 'Web Development'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="projects" style={{ padding: '6rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }} className="text-gradient">
              Shipped Projects &amp; SaaS
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '550px' }}>
              A curated collection of client products, NLP research tools, and AI prototypes I have built and delivered.
            </p>
          </div>
          
          {/* Admin Upload Trigger Button */}
          <button 
            onClick={onOpenUploadPortal}
            className="btn btn-secondary"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.85rem',
              borderColor: 'var(--accent-purple)'
            }}
          >
            <Plus size={14} className="text-gradient" />
            <span>Upload Project</span>
          </button>
        </div>

        {/* Filter Navigation */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem', 
          marginBottom: '2.5rem',
          alignItems: 'center'
        }}>
          <Filter size={16} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }} />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                background: activeFilter === cat ? 'var(--accent-cyan-glow)' : 'transparent',
                color: activeFilter === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: activeFilter === cat ? 'var(--accent-cyan)' : 'var(--glass-border)',
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== cat) {
                  e.target.style.borderColor = 'var(--text-secondary)';
                  e.target.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== cat) {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 2rem' }}>
            No projects uploaded under the "{activeFilter}" category yet. Click "Upload Project" to add your work manually!
          </div>
        ) : (
          <div className="grid-cols-3" style={{ gap: '2rem' }}>
            {filteredProjects.map((project) => (
              <TiltCard 
                key={project.id} 
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  padding: 0,
                  borderRadius: '16px',
                  border: '1px solid var(--glass-border)'
                }}
              >
                {/* Image Banner */}
                <div style={{
                  height: '200px',
                  width: '100%',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  position: 'relative',
                  borderBottom: '1px solid var(--glass-border)'
                }}>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  {/* Category overlay */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--bg-primary)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(6,182,212,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {project.category}
                  </span>
                </div>

                {/* Info details */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}>
                  
                  {/* Title & Metadata */}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{project.title}</h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={12} />
                        <span>{project.client}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        <span>{project.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', flexGrow: 1 }}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {project.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        style={{
                          fontSize: '0.65rem',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-secondary)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions Row */}
                  <div style={{ 
                    borderTop: '1px solid var(--glass-border)', 
                    paddingTop: '1rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {/* Comments Button (Left) */}
                    <button
                      onClick={() => onOpenDetailsModal(project)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      <MessageSquare size={14} />
                      <span>Comments</span>
                    </button>

                    {/* Admin Actions + Link (Right) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      {/* Edit button */}
                      <button
                        onClick={() => onEditProject(project)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Edit Project"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                            onDeleteProject(project.id);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Explore link */}
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.8rem',
                          color: 'var(--accent-cyan)',
                          fontWeight: 600,
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-purple)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      >
                        <span>Explore</span> <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                </div>
              </TiltCard>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
