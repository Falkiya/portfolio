import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Terminal } from 'lucide-react';
import { LinkedinIcon } from './BrandIcons';

export default function Header({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem',
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          <Terminal size={22} className="text-gradient" style={{ animation: 'pulse-slow 2s infinite' }} />
          <span>FALKIYA.<span className="text-gradient">AI</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav-container">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'var(--transition-smooth)'
            }}
            className="btn-secondary"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Social Links & CTA */}
          <a 
            href="https://linkedin.com/in/falkiya-afreen-0a96612b0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="linkedin-desktop btn-secondary"
          >
            <LinkedinIcon size={18} />
          </a>

          <a 
            href="#contact" 
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            Hire Me
          </a>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '4.5rem',
          left: 0,
          right: 0,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)'
              }}
            >
              {item.name}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <a 
              href="https://linkedin.com/in/falkiya-afreen-0a96612b0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              LinkedIn
            </a>
            <a 
              href="mailto:falkiyafreen23@gmail.com"
              className="btn btn-outline-cyan"
              style={{ flex: 1 }}
            >
              Email
            </a>
          </div>
        </div>
      )}

      {/* Style overrides for desktop vs mobile layout via styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-container {
            display: flex !important;
          }
          .linkedin-desktop {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
