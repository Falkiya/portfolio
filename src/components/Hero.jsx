import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Mail, Phone, MapPin, Download, CheckCircle, Pencil } from 'lucide-react';

export default function Hero({ aboutDetails = {}, onOpenEditModal, onSaveProfile, isAdmin = false }) {
  const titles = aboutDetails.roles || [
    'AI Engineer',
    'RAG Applications Developer',
    'Freelance AI SaaS Builder',
    'Prompt Architect'
  ];
  
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Reset animations if roles list updates
  useEffect(() => {
    setCurrentTitleIndex(0);
    setDisplayedText('');
    setIsDeleting(false);
  }, [aboutDetails.roles]);

  useEffect(() => {
    if (titles.length === 0) return;
    
    let timer;
    const currentTitle = titles[currentTitleIndex];

    if (!isDeleting && displayedText === currentTitle) {
      // Wait before starting deletion
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      setTypingSpeed(100);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(prev => 
          isDeleting 
            ? prev.substring(0, prev.length - 1) 
            : currentTitle.substring(0, prev.length + 1)
        );
        setTypingSpeed(isDeleting ? 50 : 100);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTitleIndex, titles]);

  return (
    <section id="about" style={{
      position: 'relative',
      padding: '6rem 0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      minHeight: '85vh'
    }}>
      {/* Decorative Glow Orbs */}
      <div className="bg-glow-orb" style={{
        top: '5%',
        left: '-5%',
        width: '450px',
        height: '450px',
        backgroundColor: 'var(--accent-cyan)',
        opacity: 0.12
      }} />
      <div className="bg-glow-orb" style={{
        bottom: '5%',
        right: '-5%',
        width: '550px',
        height: '550px',
        backgroundColor: 'var(--accent-purple)',
        opacity: 0.12
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="glass-card glow-cyan hero-card" style={{ 
          maxWidth: '850px', 
          margin: '0 auto',
          padding: '3.5rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Top Decorative Gradient Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            zIndex: 5
          }} />

          {/* Floating Admin Edit Button */}
          {isAdmin && (
            <button 
              onClick={onOpenEditModal}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.6rem',
                transition: 'var(--transition-smooth)',
                boxShadow: 'var(--card-shadow)',
                zIndex: 20
              }}
              className="admin-edit-btn"
              title="Edit Profile Details"
            >
              <Pencil size={16} />
            </button>
          )}

          {/* Sparkle Badge */}
          <div className="hero-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-cyan-glow)',
            color: 'var(--accent-cyan)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            <Sparkles size={14} />
            Open to Remote Roles
          </div>

          {/* Name */}
          <h1 className="hero-name" style={{ 
            fontSize: '3.5rem', 
            lineHeight: '1.15', 
            marginBottom: '1rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--text-primary), rgba(243, 244, 246, 0.7))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-smooth)'
          }}>
            {aboutDetails.name || 'FALKIYA AFREEN'}
          </h1>
          
          {/* Dynamic typing role text */}
          <div className="hero-role" style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            height: '3rem',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: 'var(--accent-cyan)' }}>&gt;_</span>
            <span className="text-gradient cursor-blink">{displayedText}</span>
          </div>

          {/* Bio Summary */}
          <p className="hero-summary" style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            marginBottom: '2.25rem',
            maxWidth: '620px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {aboutDetails.summary || 'AI Engineer and Freelance SaaS builder.'}
          </p>

          {/* Quick Contact Badges */}
          <div className="hero-contacts" style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: '0.75rem', 
            marginBottom: '2.5rem',
            width: '100%'
          }}>
            {aboutDetails.location && (
              <div className="contact-badge">
                <MapPin size={14} className="text-gradient" />
                <span>{aboutDetails.location}</span>
              </div>
            )}
            {aboutDetails.email && (
              <div className="contact-badge">
                <Mail size={14} className="text-gradient" />
                <a href={`mailto:${aboutDetails.email}`}>{aboutDetails.email}</a>
              </div>
            )}
            {aboutDetails.phone && (
              <div className="contact-badge">
                <Phone size={14} className="text-gradient" />
                <a href={`tel:${aboutDetails.phone.replace(/\s+/g, '')}`}>{aboutDetails.phone}</a>
              </div>
            )}
          </div>

          {/* Action Buttons Group */}
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary glow-cyan hero-btn-main">
              <Terminal size={18} />
              View Shipped Work
            </a>
            <div className="hero-btn-sub-group">
              <a href="#contact" className="btn btn-secondary hero-btn-sub">
                Let's Chat
              </a>
              <a 
                href="#experience" 
                className="btn btn-secondary hero-btn-sub" 
                style={{ display: 'inline-flex', gap: '0.5rem' }}
              >
                <Download size={18} />
                Credentials
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }
        .contact-badge a {
          color: inherit;
          transition: var(--transition-smooth);
        }
        .contact-badge:hover {
          border-color: var(--accent-cyan);
          color: var(--text-primary);
          background: rgba(6, 182, 212, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--accent-cyan-glow);
        }
        .contact-badge:hover a {
          color: var(--accent-cyan);
        }
        .admin-edit-btn:hover {
          color: var(--accent-cyan) !important;
          border-color: var(--accent-cyan) !important;
          transform: scale(1.1);
        }
        .hero-name:hover {
          text-shadow: 0 0 30px rgba(6, 182, 212, 0.25);
        }

        .hero-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          width: auto;
        }
        .hero-btn-main {
          width: auto;
        }
        .hero-btn-sub-group {
          display: flex;
          gap: 1rem;
          width: auto;
        }
        .hero-btn-sub {
          flex: none;
          width: auto;
        }

        @media (max-width: 768px) {
          .hero-card {
            padding: 2.5rem 1.25rem !important;
            border-radius: 20px !important;
            margin: 0 0.5rem;
          }
          .hero-name {
            font-size: 2.2rem !important;
          }
          .hero-role {
            font-size: 1.3rem !important;
            height: 2.5rem !important;
          }
          .hero-summary {
            font-size: 0.95rem !important;
            margin-bottom: 1.75rem !important;
          }
          .contact-badge {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.8rem !important;
          }
          .hero-contacts {
            gap: 0.6rem !important;
            margin-bottom: 2rem !important;
          }
          .hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.8rem !important;
            width: 100%;
          }
          .hero-btn-main {
            width: 100% !important;
          }
          .hero-btn-sub-group {
            width: 100% !important;
            gap: 0.8rem !important;
          }
          .hero-btn-sub {
            flex: 1 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
