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
      padding: '5rem 0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      minHeight: '85vh'
    }}>
      {/* Decorative Glow Orbs */}
      <div className="bg-glow-orb" style={{
        top: '10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        backgroundColor: 'var(--accent-cyan)',
        opacity: 0.12
      }} />
      <div className="bg-glow-orb" style={{
        bottom: '10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        backgroundColor: 'var(--accent-purple)',
        opacity: 0.12
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Hero Content Left */}
          <div>
            <div style={{
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

            {/* Name + Edit Pencil Trigger */}
            <h1 style={{ 
              fontSize: '3.5rem', 
              lineHeight: '1.1', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {aboutDetails.name || 'FALKIYA AFREEN'}
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
                    marginLeft: '1rem',
                    padding: '0.25rem',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Edit Profile Details"
                >
                  <Pencil size={18} />
                </button>
              )}
            </h1>
            
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: 600, 
              height: '3rem',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <span className="text-gradient cursor-blink">{displayedText}</span>
            </div>

            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.1rem', 
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              {aboutDetails.summary || 'AI Engineer and Freelance SaaS builder.'}
            </p>

            {/* Quick Contact Badges */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              marginBottom: '2.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              {aboutDetails.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} className="text-gradient" />
                  <span>{aboutDetails.location}</span>
                </div>
              )}
              {aboutDetails.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={16} className="text-gradient" />
                  <a href={`mailto:${aboutDetails.email}`}>{aboutDetails.email}</a>
                </div>
              )}
              {aboutDetails.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={16} className="text-gradient" />
                  <a href={`tel:${aboutDetails.phone.replace(/\s+/g, '')}`}>{aboutDetails.phone}</a>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <a href="#projects" className="btn btn-primary glow-cyan">
                <Terminal size={18} />
                View Shipped Work
              </a>
              <a href="#contact" className="btn btn-secondary">
                Let's Chat
              </a>
              <a 
                href="#experience" 
                className="btn btn-secondary" 
                style={{ display: 'inline-flex', gap: '0.5rem' }}
              >
                <Download size={18} />
                Credentials
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
