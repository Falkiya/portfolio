import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MessageSquare, Send, UserCheck, Star } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function ProjectDetailsModal({ project, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (project && isOpen) {
      setComments(databaseService.getProjectComments(project.id));
    }
  }, [project, isOpen]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    const newComment = {
      name,
      rating,
      text: commentText
    };

    databaseService.addProjectComment(project.id, newComment);
    setComments(databaseService.getProjectComments(project.id)); // Reload
    
    setName('');
    setCommentText('');
    setRating(5);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!isOpen || !project) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-card glow-cyan" style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={24} />
        </button>

        {/* Project Header details */}
        <div>
          <span style={{
            background: 'var(--accent-cyan-glow)',
            color: 'var(--accent-cyan)',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.75rem'
          }}>
            {project.category}
          </span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>{project.title}</h2>
          
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={14} className="text-gradient" />
              <span>Client: {project.client}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} className="text-gradient" />
              <span>Completed: {project.date}</span>
            </div>
          </div>
        </div>

        {/* Project Image Banner */}
        <div style={{
          height: '250px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)'
        }}>
          <img 
            src={project.image} 
            alt={project.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Project Description */}
        <div>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>Project Summary</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {project.tags && project.tags.map((tag, idx) => (
            <span key={idx} className="badge">{tag}</span>
          ))}
        </div>

        {/* Project specific Comments section */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} className="text-gradient" /> Project Feedback &amp; Comments ({comments.length})
          </h3>

          <div className="grid-cols-2" style={{ gap: '2rem', alignItems: 'stretch' }}>
            
            {/* View comments List */}
            <div style={{ 
              maxHeight: '260px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              paddingRight: '0.5rem'
            }}>
              {comments.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem 0' }}>
                  No feedback left for this project yet. Write one on the right!
                </div>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{comm.name}</span>
                      <div style={{ display: 'flex', gap: '0.1rem', color: '#facc15' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={10} 
                            fill={star <= comm.rating ? '#facc15' : 'transparent'} 
                            color={star <= comm.rating ? '#facc15' : 'var(--text-muted)'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{comm.text}"
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                      {comm.date}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Input Comment Form */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {success ? (
                <div style={{
                  margin: 'auto',
                  textAlign: 'center',
                  color: 'var(--accent-emerald)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <UserCheck size={32} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Feedback published!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Your Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    required
                  />

                  {/* Rating Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rating:</span>
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <Star 
                            size={16} 
                            fill={rating >= star ? '#facc15' : 'transparent'} 
                            color={rating >= star ? '#facc15' : 'var(--text-muted)'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    className="form-input" 
                    placeholder="Leave feedback or a review..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{ minHeight: '60px', fontSize: '0.85rem', padding: '0.5rem 0.75rem', resize: 'vertical' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.8rem', gap: '0.4rem', marginTop: 'auto' }}>
                    <Send size={12} /> Post Comment
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
