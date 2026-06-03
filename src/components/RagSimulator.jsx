import React, { useState, useEffect } from 'react';
import { Search, Bot, Sparkles, Send, HelpCircle, Loader2 } from 'lucide-react';

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
    response: "You can reach Falkiya directly via email at falkiyafreen23@gmail.com, call or text her mobile at +91 8123366160, or connect on LinkedIn (linkedin.com/in/falkiya-afreen-0a96612b0). You can also launch a direct chat thread on WhatsApp from the contact section!"
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
    return "Hi there! I am Falkiya's AI Copilot. Ask me anything about her skills, projects, certifications, or education. How can I help you today?";
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

  return "I searched Falkiya's portfolio database but couldn't find a direct match. Falkiya is an AI Engineer specializing in RAG, LLMs (OpenRouter), Python/FastAPI, and React. You can reach out directly via email at falkiyafreen23@gmail.com or chat live via WhatsApp in the Contact section below!";
}

export default function RagSimulator() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [typingAnswer, setTypingAnswer] = useState('');

  const presets = [
    "Tell me about the Study Buddy SaaS.",
    "What are Falkiya's core skills?",
    "Where does she study and what is her CGPA?",
    "Tell me about her Microsoft internship."
  ];

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer('');
    setTypingAnswer('');

    // Simulate search latency (700ms)
    setTimeout(() => {
      const response = getAgentResponse(query);
      setAnswer(response);
      setLoading(false);
    }, 800);
  };

  const handlePresetClick = (preset) => {
    setQuery(preset);
    // Auto submit search
    setLoading(true);
    setAnswer('');
    setTypingAnswer('');
    setTimeout(() => {
      const response = getAgentResponse(preset);
      setAnswer(response);
      setLoading(false);
    }, 800);
  };

  // Typewriter response generator
  useEffect(() => {
    if (!answer) return;

    let index = 0;
    const interval = setInterval(() => {
      setTypingAnswer((prev) => prev + answer.charAt(index));
      index++;
      if (index >= answer.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [answer]);

  return (
    <section id="rag" style={{ padding: '6rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="text-gradient">
            Ask Falkiya's Portfolio Agent
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Type any question to query my portfolio details. The search agent will scan my skills, projects, and educational credentials to answer you directly.
          </p>
        </div>

        <div style={{ maxWidth: '750px', margin: '0 auto' }} className="glass-card glow-cyan">
          {/* Search Box Form */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ask me anything (e.g., What are her AI skills? Tell me about Squrix AI)" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                style={{ paddingLeft: '2.5rem', height: '48px' }}
              />
              <Search 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !query.trim()}
              style={{ padding: '0 1.5rem', height: '48px', flexShrink: 0 }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} style={{ animation: 'pulse-slow 1s infinite' }} /> : 'Search'}
            </button>
          </form>

          {/* Quick Preset Queries */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <HelpCircle size={14} /> Quick questions:
            </span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset)}
                disabled={loading}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent-cyan)'; e.target.style.color = 'var(--accent-cyan)'; }}
                onMouseLeave={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.color = 'var(--text-secondary)'; }}
              >
                {preset.replace('Tell me about the ', '').replace('What are ', '').replace('Where does ', '')}
              </button>
            ))}
          </div>

          {/* Agent Answer Sheet */}
          {(loading || typingAnswer) && (
            <div style={{
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid var(--glass-border)',
              borderRadius: '10px',
              padding: '1.5rem',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {/* Output Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <Bot size={16} />
                <span>PORTFOLIO AGENT RESPONSE</span>
              </div>
              
              {/* Typewriter message */}
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', position: 'relative' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'pulse-slow 1.5s infinite' }} />
                    <span>Querying vector chunks in database index...</span>
                  </div>
                ) : (
                  <>
                    {typingAnswer}
                    {typingAnswer.length < answer.length && <span className="cursor-blink" />}
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
