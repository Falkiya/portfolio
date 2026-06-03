import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Unlock, Mail, Clock, Send, MessageSquare, Bot, Globe, Activity, Eye, Compass } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function InboxDashboard({ isOpen, onClose }) {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'analytics'
  const [visits, setVisits] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && isUnlocked) {
      setThreads(databaseService.getChatThreads());
      setVisits(databaseService.getVisitorStats());
    }
  }, [isOpen, isUnlocked]);

  // Poll for new messages every 3 seconds while dashboard is open and active
  useEffect(() => {
    if (!isOpen || !isUnlocked) return;
    const interval = setInterval(() => {
      setThreads(databaseService.getChatThreads());
      setVisits(databaseService.getVisitorStats());
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, isUnlocked]);

  // Scroll to bottom of chat transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadId, threads]);

  // Auto-lock dashboard when closed
  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false);
      setPasscode('');
    }
  }, [isOpen]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin') {
      setIsUnlocked(true);
      setErrorMsg('');
      setThreads(databaseService.getChatThreads());
      setVisits(databaseService.getVisitorStats());
    } else {
      setErrorMsg('Incorrect passcode.');
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    databaseService.sendChatMessage(activeThreadId, 'admin', null, null, replyText);
    setThreads(databaseService.getChatThreads()); // Refresh
    setReplyText('');
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-card glow-cyan" style={{
        width: '100%',
        maxWidth: '850px',
        height: '80vh',
        overflow: 'hidden',
        position: 'relative',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid var(--accent-purple)'
      }}>
        
        {/* Header bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            <Unlock size={18} className="text-gradient" />
            <span>Falkiya's Dashboard</span>
          </div>

          {isUnlocked && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('messages')}
                className="btn-secondary"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '6px',
                  borderColor: activeTab === 'messages' ? 'var(--accent-cyan)' : 'var(--glass-border)',
                  color: activeTab === 'messages' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Client Chats
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="btn-secondary"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '6px',
                  borderColor: activeTab === 'analytics' ? 'var(--accent-cyan)' : 'var(--glass-border)',
                  color: activeTab === 'analytics' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Visitor Analytics
              </button>
            </div>
          )}

          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {!isUnlocked ? (
          /* Lock Screen Panel */
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '320px', padding: '2rem 1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--accent-purple-glow)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Owner Administration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Enter your passcode to view client chat messages sent through the website.
            </p>
            <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter passcode" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '0.9rem' }}
                required
              />
              {errorMsg && <p style={{ color: '#f87171', fontSize: '0.75rem' }}>{errorMsg}</p>}
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>Unlock Inbox</button>
            </form>
          </div>
        ) : (
          /* Main Unlocked Dashboard Body */
          activeTab === 'messages' ? (
            /* Tab A: Messages */
            <div style={{ display: 'flex', flexGrow: 1, height: 'calc(100% - 3.5rem)', overflow: 'hidden' }}>
              {/* Sidebar Threads List */}
              <div style={{
                width: '280px',
                borderRight: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.1)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                  CONVERSATIONS ({threads.length})
                </div>
                {threads.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
                    No messages received yet.
                  </div>
                ) : (
                  threads.map(thread => {
                    const lastMsg = thread.messages[thread.messages.length - 1];
                    const isActive = thread.id === activeThreadId;
                    return (
                      <button
                        key={thread.id}
                        onClick={() => setActiveThreadId(thread.id)}
                        style={{
                          padding: '1rem',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          background: isActive ? 'var(--accent-cyan-glow)' : 'transparent',
                          borderBottom: '1px solid var(--glass-border)',
                          color: 'inherit',
                          transition: 'var(--transition-smooth)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500 }}>
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                            {thread.clientName}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {new Date(thread.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {thread.clientEmail}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontStyle: 'italic', marginTop: '0.2rem' }}>
                          {lastMsg ? `${lastMsg.sender === 'admin' ? 'You' : 'Client'}: ${lastMsg.text}` : 'Empty Chat'}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Conversation Window Right */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)' }}>
                {activeThread ? (
                  <>
                    {/* Active Client Info */}
                    <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{activeThread.clientName}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Mail size={12} /> {activeThread.clientEmail}
                        </p>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={12} />
                        <span>ID: {activeThread.id.substring(7, 13)}</span>
                      </div>
                    </div>

                    {/* Transcript Scroll Area */}
                    <div style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {activeThread.messages.map((msg, index) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div
                            key={msg.id}
                            style={{
                              alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                              maxWidth: '75%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isAdmin ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <div style={{
                              padding: '0.6rem 0.9rem',
                              borderRadius: isAdmin ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                              background: isAdmin ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                              color: '#ffffff',
                              fontSize: '0.85rem',
                              border: '1px solid var(--glass-border)'
                            }}>
                              {msg.text}
                            </div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Input Bar */}
                    <form onSubmit={handleSendReply} style={{
                      padding: '0.75rem 1rem',
                      borderTop: '1px solid var(--glass-border)',
                      display: 'flex',
                      gap: '0.5rem',
                      background: 'var(--bg-secondary)',
                      alignItems: 'center'
                    }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder={`Reply to ${activeThread.clientName}...`} 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                        required
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ width: '36px', height: '36px', borderRadius: '8px', padding: 0, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={36} style={{ opacity: 0.4 }} />
                    <p style={{ fontSize: '0.9rem' }}>Select a conversation from the sidebar to read and write messages.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Tab B: Visitor Analytics */
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: 'calc(100% - 3.5rem)', padding: '1.5rem', overflowY: 'auto', gap: '1.25rem' }}>
              
              {/* Stat Indicators Grid */}
              <div className="grid-cols-4" style={{ gap: '1rem' }}>
                
                <div className="glass-card" style={{ padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
                    <Eye size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL VISITS</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{visits.length}</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--accent-purple-glow)', color: 'var(--accent-purple)', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
                    <Globe size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>COUNTRIES</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      {new Set(visits.map(v => v.location ? v.location.split(', ').pop() : 'India')).size}
                    </span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>RECRUITERS</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      {visits.filter(v => v.type === 'recruiter').length}
                    </span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', color: '#ffffff', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
                    <Compass size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>UNIQUE PROVIDERS</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      {new Set(visits.map(v => v.isp)).size}
                    </span>
                  </div>
                </div>

              </div>

              {/* Table Wrapper */}
              <div className="glass-card" style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Activity size={16} className="text-gradient" />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Visitor Telemetry Logs</h4>
                </div>
                <div style={{ overflowX: 'auto', flexGrow: 1, maxHeight: '350px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '0.5rem 0.4rem' }}>Time</th>
                        <th style={{ padding: '0.5rem 0.4rem' }}>Location</th>
                        <th style={{ padding: '0.5rem 0.4rem' }}>Device/Browser</th>
                        <th style={{ padding: '0.5rem 0.4rem' }}>ISP/Provider</th>
                        <th style={{ padding: '0.5rem 0.4rem' }}>Masked IP</th>
                        <th style={{ padding: '0.5rem 0.4rem' }}>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((v, i) => (
                        <tr key={v.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.6rem 0.4rem', color: 'var(--text-muted)' }}>
                            {new Date(v.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td style={{ padding: '0.6rem 0.4rem', fontWeight: 600, color: '#ffffff' }}>
                            {v.location}
                          </td>
                          <td style={{ padding: '0.6rem 0.4rem', color: 'var(--text-secondary)' }}>{v.device}</td>
                          <td style={{ padding: '0.6rem 0.4rem', color: 'var(--text-secondary)' }}>{v.isp}</td>
                          <td style={{ padding: '0.6rem 0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{v.ip}</td>
                          <td style={{ padding: '0.6rem 0.4rem' }}>
                            {v.type === 'recruiter' ? (
                              <span style={{ display: 'inline-block', background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', padding: '0.15rem 0.35rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>
                                {v.company} Recruiter
                              </span>
                            ) : (
                              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', padding: '0.15rem 0.35rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 500 }}>
                                Client Visitor
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )
        )}
      </div>
    </div>
  );
}
