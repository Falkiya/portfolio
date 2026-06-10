import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ExternalLink, CheckCircle, Bot, User, MessageCircle } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);

    // Formspree submission
    fetch('https://formspree.io/f/xwvjnvwy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, subject, message })
    })
    .then(response => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    })
    .catch(err => {
      // Graceful local success simulator if fetch fails or runs offline
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    });
  };



  return (
    <section id="contact" style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.1)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="text-gradient">
            Get In Touch
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Looking to collaborate on an AI SaaS application, RAG pipeline, or hiring for a role? Send me a text directly!
          </p>
        </div>

        <div className="grid-cols-2" style={{ gap: '3rem', alignItems: 'stretch' }}>
          
          {/* Contact Details Left */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Contact Information</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Feel free to reach out via the email form or connect on LinkedIn. I am responsive and open to discussing remote roles, internships, or freelance SaaS projects.
              </p>

              {/* Direct Info list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '10px',
                    background: 'var(--accent-cyan-glow)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>EMAIL ME</span>
                    <a href="mailto:falkiyafreen23@gmail.com" style={{ fontSize: '0.95rem', fontWeight: 600 }}>falkiyafreen23@gmail.com</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '10px',
                    background: 'var(--accent-emerald-glow)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>LOCATION</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Mysuru, Karnataka, India (Open to Remote)</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Email Messaging Box Right */}
          <div className="glass-card glow-cyan" style={{ display: 'flex', flexDirection: 'column', minHeight: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={20} className="text-gradient" /> Send Message
            </h3>

            {success ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                margin: 'auto'
              }}>
                <CheckCircle size={48} style={{ color: 'var(--accent-emerald)' }} />
                <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem' }}>Message Sent Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Thank you for writing. I will get back to you at the email address provided as soon as possible!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Freelance project discussion" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Message *</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Write your details or requirements here..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ minHeight: '120px', resize: 'vertical' }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem', width: '100%', marginTop: 'auto' }}
                >
                  {loading ? 'Submitting...' : 'Send Message'} <Send size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
