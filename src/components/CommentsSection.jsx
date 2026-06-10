import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle, User, Pencil, Trash2, X, Save } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function CommentsSection({ isAdmin = false }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  const loadComments = async () => {
    try {
      const data = await databaseService.getComments();
      setComments(data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSubmit = async (e) => {
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

    setLoading(true);
    try {
      const added = await databaseService.addComment(newCommentData);
      
      // Save secret ownership token for local editing/deleting rights
      if (added && added.secretToken) {
        const owned = JSON.parse(localStorage.getItem('falkiya_owned_comments') || '{}');
        owned[added.id] = added.secretToken;
        localStorage.setItem('falkiya_owned_comments', JSON.stringify(owned));
      }
      
      await loadComments(); // Reload from database
      setSuccessMsg('Thank you! Your testimonial comment has been published.');
      setName('');
      setRole('');
      setRating(5);
      setText('');
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to save review. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (comment) => {
    try {
      await databaseService.likeComment(comment.id, comment.likes || 0);
      await loadComments(); // Refresh list to get updated count
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    const owned = JSON.parse(localStorage.getItem('falkiya_owned_comments') || '{}');
    const token = owned[id] || '';
    
    setLoading(true);
    try {
      await databaseService.deleteComment(id, token);
      
      // Remove local ownership reference
      delete owned[id];
      localStorage.setItem('falkiya_owned_comments', JSON.stringify(owned));
      
      await loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Error: Failed to delete comment. You may not have permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setEditRating(comment.rating);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditRating(5);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;

    const owned = JSON.parse(localStorage.getItem('falkiya_owned_comments') || '{}');
    const token = owned[id] || '';

    setLoading(true);
    try {
      await databaseService.updateComment(id, { text: editText, rating: editRating }, token);
      setEditingId(null);
      await loadComments();
    } catch (err) {
      console.error('Failed to edit comment:', err);
      alert('Error: Failed to save changes. You may not have permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Check if current visitor owns the comment
  const isCommentOwner = (commentId) => {
    const owned = JSON.parse(localStorage.getItem('falkiya_owned_comments') || '{}');
    return !!owned[commentId];
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

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Send size={16} /> {loading ? 'Submitting...' : 'Submit Testimonial'}
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
              comments.map((comment) => {
                const showActions = isAdmin || isCommentOwner(comment.id);
                const isEditing = editingId === comment.id;

                return (
                  <div key={comment.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                    
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

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.1rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={14} 
                                fill={star <= (isEditing ? editRating : comment.rating) ? '#facc15' : 'transparent'} 
                                color={star <= (isEditing ? editRating : comment.rating) ? '#facc15' : 'var(--text-muted)'} 
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.date}</span>
                        </div>

                        {/* Edit and Delete Actions */}
                        {showActions && !isEditing && (
                          <div style={{ display: 'flex', gap: '0.4rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '0.8rem' }}>
                            <button
                              onClick={() => handleStartEdit(comment)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', transition: 'var(--transition-smooth)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                              title="Edit Review"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', transition: 'var(--transition-smooth)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                              title="Delete Review"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Comment Body / Edit Form */}
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Edit Rating</label>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setEditRating(star)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                <Star 
                                  size={20} 
                                  fill={editRating >= star ? '#facc15' : 'transparent'} 
                                  color={editRating >= star ? '#facc15' : 'var(--text-muted)'} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Edit Review Description</label>
                          <textarea 
                            className="form-input"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{ minHeight: '80px', resize: 'vertical' }}
                            required
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                          <button 
                            onClick={handleCancelEdit} 
                            disabled={loading}
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <X size={12} /> Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveEdit(comment.id)} 
                            disabled={loading || !editText.trim()}
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Save size={12} /> {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', wordBreak: 'break-word' }}>
                        "{comment.text}"
                      </p>
                    )}

                    {/* Likes reaction bar */}
                    {!isEditing && (
                      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleLike(comment)}
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
                    )}

                  </div>
                );
              })
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
