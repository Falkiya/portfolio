import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle, User } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function CommentsSection() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setComments(databaseService.getComments());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !text) {
      setErrorMsg('Name and comment review text are required.');
      return;
    }

    const newCommentData = {
      name,
      role: role || 'Visitor',
      rating,
      text
    };

    const added = databaseService.addComment(newCommentData);
    setComments(databaseService.getComments()); // Reload
    setSuccessMsg('Thank you! Your testimonial comment has been published.');
    setName('');
    setRole('');
    setRating(5);
    setText('');
    setErrorMsg('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  const handleLike = (id) => {
    databaseService.likeComment(id);
    setComments(databaseService.getComments()); // Reload updated likes
  };

  // Compute averages
  const totalComments = comments.length;
  const averageRating = totalComments > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / totalComments).toFixed(1)
    : '0.0';

  return (
    <section id="reviews" style={{ padding: '6rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="text-gradient">
            Testimonials &amp; Reviews
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            What clients, supervisors, and academic peers say about working with me. You can leave your own review below!
          </p>
        </div>

        <div className="grid-cols-3" style={{ gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Summary & Form Left (Spans 1 column on desktop) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Average Score Box */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>AVERAGE CLIENT RATING</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem' }} className="text-gradient">
                {averageRating}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    fill={star <= Math.round(Number(averageRating)) ? '#facc15' : 'transparent'} 
                    color={star <= Math.round(Number(averageRating)) ? '#facc15' : 'var(--text-muted)'} 
                  />
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Based on {totalComments} reviewer submissions</p>
            </div>

            {/* Input Form Box */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} className="text-gradient" /> Write a Review
              </h3>

              {successMsg ? (
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <CheckCircle size={36} style={{ color: 'var(--accent-emerald)' }} />
                  <p style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 500 }}>{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role / Company</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Tech Lead @ Innovate AI" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  {/* Dynamic Stars Rating Input */}
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <Star 
                            size={24} 
                            fill={(hoverRating || rating) >= star ? '#facc15' : 'transparent'} 
                            color={(hoverRating || rating) >= star ? '#facc15' : 'var(--text-muted)'} 
                            style={{ transition: 'transform 0.1s' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Comment Review *</label>
                    <textarea 
                      className="form-input" 
                      placeholder="How was your experience working together? Feel free to leave academic feedback as well."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                      required
                    />
                  </div>

                  {errorMsg && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{errorMsg}</p>}

                  <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Send size={16} /> Submit Testimonial
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Comments Feed Right (Spans 2 columns on desktop) */}
          <div className="reviews-feed" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Review Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)'
                      }}>
                        <User size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{comment.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{comment.role}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.1rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            fill={star <= comment.rating ? '#facc15' : 'transparent'} 
                            color={star <= comment.rating ? '#facc15' : 'var(--text-muted)'} 
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.date}</span>
                    </div>

                  </div>

                  {/* Comment Text */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                    "{comment.text}"
                  </p>

                  {/* Likes reaction bar */}
                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleLike(comment.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <ThumbsUp size={14} />
                      <span>Helpful ({comment.likes || 0})</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>
      <style>{`
        @media (min-width: 768px) {
          .reviews-feed {
            grid-column: span 2;
          }
        }
      `}</style>
    </section>
  );
}
