import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Mail, Phone, MapPin, Download, CheckCircle, Pencil, User } from 'lucide-react';

export default function Hero({ aboutDetails = {}, onOpenEditModal, onSaveProfile }) {
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
        <div className="grid-cols-2" style={{ alignItems: 'center', gap: '3rem' }}>
          
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

          {/* Profile Photo Upload Panel Right */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                position: 'relative',
                width: '360px',
                height: '500px',
                borderRadius: '16px',
                background: 'var(--bg-secondary)',
                border: '3px solid var(--accent-cyan)',
                boxShadow: '0 0 25px var(--accent-cyan-glow)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)'
              }}
              className="profile-photo-container"
              >
                {aboutDetails.profilePhoto ? (
                  <img 
                    src={aboutDetails.profilePhoto} 
                    alt="Falkiya Afreen" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transform: `scale(${aboutDetails.profilePhotoZoom / 100 || 1})`,
                      objectPosition: `${aboutDetails.profilePhotoX !== undefined ? aboutDetails.profilePhotoX : 50}% ${aboutDetails.profilePhotoY !== undefined ? aboutDetails.profilePhotoY : 50}%`,
                      transition: 'transform 0.1s ease'
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <User size={72} style={{ opacity: 0.4 }} className="text-gradient" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>No Profile Photo</span>
                  </div>
                )}
                
                {/* Upload Overlay */}
                <label 
                  htmlFor="hero-profile-photo-upload"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    padding: '0.6rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    opacity: aboutDetails.profilePhoto ? 0 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                  className="photo-upload-overlay"
                >
                  <Pencil size={12} />
                  <span>{aboutDetails.profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </label>
                <input 
                  type="file"
                  id="hero-profile-photo-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Keep file sizes reasonable for LocalStorage limits
                      if (file.size > 2 * 1024 * 1024) {
                        alert('Image is too large. Please select an image under 2MB.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updated = { 
                          ...aboutDetails, 
                          profilePhoto: reader.result,
                          profilePhotoZoom: 100,
                          profilePhotoX: 50,
                          profilePhotoY: 50
                        };
                        onSaveProfile(updated);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </div>
              
              <style>{`
                .profile-photo-container:hover .photo-upload-overlay {
                  opacity: 1 !important;
                }
              `}</style>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
