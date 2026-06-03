import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, CornerDownLeft } from 'lucide-react';

const GREETING = "Hi there! I am Falkiya's AI Copilot. Ask me anything about her skills, projects, certifications, or education. How can I help you today?";

const INTENTS = [
  {
    id: 'about',
    keywords: ['about', 'who is', 'falkiya', 'afreen', 'summary', 'profile', 'engineer', 'who are you', 'tell me about yourself', 'yourself', 'background', 'intro', 'introduction', 'bio'],
    response: "Falkiya Afreen is an AI Engineer, RAG & LLM Applications Developer, and Freelance AI SaaS Builder. She has hands-on experience building AI-powered SaaS applications, and specializes in designing production-ready AI products using APIs, vector databases, and semantic search rather than just simple demonstrations."
  },
  {
    id: 'skills',
    keywords: ['skill', 'stack', 'language', 'python', 'react', 'fastapi', 'scikit', 'ml', 'nlp', 'libraries', 'framework', 'database', 'vector', 'embeddings', 'mongodb', 'sql', 'tech', 'technology', 'tools', 'prompt engineering', 'agentic', 'git', 'github'],
    response: "Falkiya's core technical skills include:\n• **AI & RAG**: RAG Architectures, LLM APIs (OpenRouter), Prompt Engineering, Agentic AI workflows, Vector Embeddings, Semantic Search.\n• **Languages & Web**: Python, FastAPI, JavaScript, React/Vite, REST APIs, JSON, Git & GitHub.\n• **Data Science & ML**: Machine Learning models, Scikit-learn, NLP, NLTK, Data Preprocessing."
  },
  {
    id: 'study_buddy',
    keywords: ['study buddy', 'studybuddy', 'flagship', 'openrouter', 'document query', 'document Q&A', 'semantic search', 'client-facing'],
    response: "Study Buddy is Falkiya's flagship client-facing AI SaaS platform. It uses a RAG (Retrieval-Augmented Generation) pipeline featuring semantic document chunking, vector indexing, and OpenRouter LLM API integration. It enables interactive, personalized study guides by querying documents in real time."
  },
  {
    id: 'resume_analyzer',
    keywords: ['analyzer', 'nlp', 'hr', 'nltk', 'candidate', 'resume analyzer', 'classification', 'parse', 'parsing'],
    response: "The HR Resume Analyzer is an NLP tool built with Python, Scikit-learn, and NLTK. It scans candidate resumes, extracts keywords, and matches them to job descriptions using classification algorithms to accelerate HR recruitment workflows."
  },
  {
    id: 'resume_builder',
    keywords: ['builder', 'prize', 'winner', 'competition', 'hackathon', 'award', 'trophy', 'first prize', 'resume builder'],
    response: "The AI Resume Builder is an AI-powered resume generation platform that won 1st Prize at a college-level tech competition. It utilizes LLM APIs to generate dynamic resume content and compile structured templates."
  },
  {
    id: 'squrix',
    keywords: ['squrix', 'workflow', 'automation', 'productivity', 'automate', 'agentic'],
    response: "Squrix AI is a custom AI workflow automation application built by Falkiya. It is designed to automate complex, repetitive tasks and link LLM APIs together to solve real-world student and professional productivity challenges."
  },
  {
    id: 'experience',
    keywords: ['experience', 'work', 'job', 'intern', 'microsoft', 'sap', 'saksham', 'role', 'trainer', 'workshop trainer', 'history', 'background', 'career', 'timeline'],
    response: "Falkiya's professional experience includes:\n1. **Tech Saksham Intern at Microsoft & SAP (2024)**: Built and tested machine learning classification models in Python using Scikit-learn, handling preprocessing and data workflows.\n2. **AI Workshop Trainer (2024)**: Served as a trainer at St. Joseph's College for Women, Mysuru, instructing 100+ students on prompt engineering, ChatGPT, Claude, and Gemini to build games and websites."
  },
  {
    id: 'education',
    keywords: ['education', 'college', 'bca', 'gpa', 'cgpa', 'degree', 'study', 'academic', 'marks', 'joseph', 'mysuru', 'graduation', 'sem', 'semester', 'grade'],
    response: "Falkiya is pursuing a Bachelor of Computer Applications (BCA) at St. Joseph's College for Women, Mysuru (2023 - Present). She has maintained an outstanding academic record with a CGPA of 8.5 up to the 5th semester and was elected Class Representative in her 2nd year."
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone', 'reach', 'hire', 'remote', 'avail', 'call', 'whatsapp', 'text', 'address', 'link', 'linkedin', 'github', 'social', 'mobile', 'cell'],
    response: "You can reach Falkiya directly via email at falkiyafreen23@gmail.com or connect on LinkedIn (linkedin.com/in/falkiya-afreen-0a96612b0). You can also send a message using the Contact section of this website!"
  },
  {
    id: 'projects',
    keywords: ['projects', 'work', 'portfolio', 'shipped', 'build', 'built', 'app', 'application', 'saas product', 'products', 'develop', 'development'],
    response: "Falkiya has built several high-impact AI products:\n1. **Study Buddy** (a RAG-based document Q&A SaaS)\n2. **HR Resume Analyzer** (an NLP resume scanner and matcher)\n3. **AI Resume Builder** (LLM-powered resume generator - 1st Prize Winner)\n4. **Squrix AI** (custom AI workflow automation tool).\nYou can view full details in the 'Shipped SaaS Work' section below."
  }
];

function getAgentResponse(query) {
  const q = query.toLowerCase().trim();
  if (!q) return '';

  if (q.includes('hello') || q.includes('hi ') || q.includes('hey') || q === 'hi') {
    return GREETING;
  }

  const words = q.split(/[\s,?.!/()]+/).filter(w => w.length > 0);
  
  let bestIntent = null;
  let maxScore = 0;

  INTENTS.forEach(intent => {
    let score = 0;
    
    // Check key phrases first (multi-word keywords)
    intent.keywords.forEach(keyword => {
      const kw = keyword.toLowerCase();
      if (kw.includes(' ') && q.includes(kw)) {
        score += 8;
      }
    });

    // Check individual word matches
    words.forEach(word => {
      intent.keywords.forEach(keyword => {
        const kw = keyword.toLowerCase();
        if (kw === word) {
          score += 4;
        } else if (word.includes(kw) && kw.length > 2) {
          score += 2;
        }
      });
    });

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  });

  if (bestIntent && maxScore >= 3) {
    return bestIntent.response;
  }

  return "I searched Falkiya's portfolio database but couldn't find a direct match. Falkiya is an AI Engineer specializing in RAG, LLMs (OpenRouter), Python/FastAPI, and React. You can reach out directly via email at falkiyafreen23@gmail.com or write a message in the Contact section below!";
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: GREETING, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: 'Study Buddy SaaS', query: 'Tell me about the Study Buddy project' },
    { label: 'AI Skills', query: 'What are your core AI skills?' },
    { label: 'Workshops', query: 'Tell me about your college training workshops' },
    { label: 'Contact Details', query: 'How can I contact Falkiya?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, time: timestamp }]);
    if (!textToSend) setInputText('');

    // Simulate bot typing
    setIsTyping(true);

    setTimeout(() => {
      const botText = getAgentResponse(text);
      setMessages(prev => [...prev, { sender: 'bot', text: botText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary glow-cyan"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)'
          }}
        >
          <MessageSquare size={24} />
          {/* Animated Glow Dot */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--accent-emerald)',
            border: '2px solid var(--bg-primary)'
          }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card glow-cyan" style={{
          width: '360px',
          height: '500px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          border: '1px solid var(--accent-cyan)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={22} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Falkiya's AI Copilot</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', opacity: 0.8 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                  <span>Online · Trained on Resume</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flexGrow: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(0,0,0,0.1)'
          }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  maxWidth: '85%'
                }}
              >
                {/* Avatar Icon */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: msg.sender === 'bot' ? 'var(--accent-cyan-glow)' : 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  flexShrink: 0
                }}>
                  {msg.sender === 'bot' ? <Bot size={14} className="text-gradient" /> : <User size={14} />}
                </div>

                {/* Message bubble */}
                <div>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: msg.sender === 'user' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                    background: msg.sender === 'user' ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    border: '1px solid var(--glass-border)'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-cyan-glow)', border: '1px solid var(--glass-border)' }}>
                  <Bot size={14} className="text-gradient" />
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', gap: '4px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse-slow 1s infinite 0.1s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse-slow 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse-slow 1s infinite 0.3s' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length === 1 && (
            <div style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              borderTop: '1px solid var(--glass-border)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Suggested Questions:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.query)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--accent-cyan)';
                      e.target.style.color = 'var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--glass-border)';
                      e.target.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input */}
          <div style={{
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
              placeholder="Ask me something..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
              className="btn btn-primary"
              style={{ width: '36px', height: '36px', borderRadius: '8px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
