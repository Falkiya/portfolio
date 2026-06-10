import React, { useState } from 'react';
import { Cpu, Server, Layout, Sparkles, Network, Pencil, RotateCw, BookOpen } from 'lucide-react';

function getCategoryIcon(index) {
  if (index === 0) return <Cpu size={20} className="text-gradient" />;
  if (index === 1) return <Server size={20} style={{ color: 'var(--accent-purple)' }} />;
  if (index === 2) return <Layout size={20} style={{ color: 'var(--accent-emerald)' }} />;
  return <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />;
}

function getBorderColor(index) {
  if (index === 0) return '2px solid var(--accent-cyan)';
  if (index === 1) return '2px solid var(--accent-purple)';
  if (index === 2) return '2px solid var(--accent-emerald)';
  return '2px solid var(--accent-cyan)';
}

function getCategoryBackground(index) {
  if (index === 0) return 'var(--accent-cyan-glow)';
  if (index === 1) return 'var(--accent-purple-glow)';
  if (index === 2) return 'var(--accent-emerald-glow)';
  return 'var(--accent-cyan-glow)';
}

function getCategoryBullets(index) {
  if (index === 0) {
    return [
      "Shipped client-facing Study Buddy SaaS featuring an end-to-end RAG architecture.",
      "Implemented document ingestion, semantic chunking, and Vector Database retrieval.",
      "Integrated OpenRouter API for optimized real-time LLM query routing.",
      "Designed prompt architectures preventing context leakage and hallucination."
    ];
  }
  if (index === 1) {
    return [
      "Tech Saksham Intern: Built and trained ML models using Scikit-learn.",
      "Applied data cleaning, feature preprocessing, and evaluation metrics.",
      "Developed server backend microservice routes using Python and FastAPI.",
      "Integrated local storage databases and state caches."
    ];
  }
  if (index === 2) {
    return [
      "Conducted technical AI workshops, instructing 100+ students on prompt tooling.",
      "Designed clean, responsive SaaS interfaces using React and Vite.",
      "Managed collaboration workflows using Git and GitHub version control.",
      "Received college appreciation letters for high-impact educational delivery."
    ];
  }
  return [
    "Custom category added via profile edit dialog.",
    "Allows updating tools and operational workflows as needed.",
    "Updates are saved persistently inside local storage."
  ];
}

export default function Skills({ skillsData = [], onOpenEditModal, isAdmin = false }) {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="skills" style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.1)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span className="text-gradient">Technical Competencies</span>
            {isAdmin && (
              <button 
                onClick={onOpenEditModal}
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
                title="Edit Skills List"
              >
                <Pencil size={18} />
              </button>
            )}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive suite of tools, frameworks, and methodologies I leverage to design, build, and deploy production-ready AI systems. Click on any card to flip it and view practical applications.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid-cols-3">
          {skillsData.map((category, index) => {
            const isFlipped = !!flippedCards[index];
            const bullets = getCategoryBullets(index);
            
            return (
              <div 
                key={index} 
                className="flip-card-container"
                onClick={() => toggleFlip(index)}
              >
                <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                  
                  {/* FRONT SIDE */}
                  <div 
                    className="flip-card-front glass-card"
                    style={{
                      gap: '1.5rem',
                      height: '100%',
                      borderTop: getBorderColor(index),
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Front Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{
                          background: 'var(--bg-tertiary)',
                          padding: '0.6rem',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {getCategoryIcon(index)}
                        </div>
                        <h3 style={{ fontSize: '1.25rem' }}>{category.title}</h3>
                      </div>

                      {/* Skills Tags List */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {(category.skills || []).map((skill, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="badge"
                            style={{
                              borderLeft: getBorderColor(index)
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Front Footer prompt */}
                    <div style={{ 
                      borderTop: '1px solid var(--glass-border)', 
                      paddingTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Network size={12} />
                        <span>Interactive Card</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-cyan)' }}>
                        <RotateCw size={12} style={{ animation: 'spin-slow 4s infinite linear' }} />
                        <span>Click to Flip</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="flip-card-back glass-card"
                    style={{
                      gap: '1.25rem',
                      height: '100%',
                      borderTop: getBorderColor(index),
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Back Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{
                          background: getCategoryBackground(index),
                          padding: '0.5rem',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <BookOpen size={16} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Applications &amp; Context</h4>
                      </div>

                      {/* Bullets List */}
                      <ul style={{ 
                        paddingLeft: '0', 
                        listStyle: 'none', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.6rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4'
                      }}>
                        {bullets.map((bullet, bIdx) => (
                          <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ 
                              width: '5px', 
                              height: '5px', 
                              borderRadius: '50%', 
                              background: index === 0 ? 'var(--accent-cyan)' : index === 1 ? 'var(--accent-purple)' : 'var(--accent-emerald)', 
                              marginTop: '6px',
                              flexShrink: 0
                            }} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Back Footer prompt */}
                    <div style={{ 
                      borderTop: '1px solid var(--glass-border)', 
                      paddingTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>{category.title} Details</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                        <RotateCw size={12} />
                        <span>Click to Flip Back</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
