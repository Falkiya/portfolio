import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import ProjectsSection from './components/ProjectsSection';
import AdminUploadPortal from './components/AdminUploadPortal';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import CommentsSection from './components/CommentsSection';
import ContactSection from './components/ContactSection';
import InboxDashboard from './components/InboxDashboard';
import AiAssistant from './components/AiAssistant';
import EditProfileModal from './components/EditProfileModal';
import EditSkillsModal from './components/EditSkillsModal';
import EditExperienceModal from './components/EditExperienceModal';
import { databaseService } from './services/databaseService';
import { Mail, Terminal, Heart, Lock } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './components/BrandIcons';
import Reveal from './components/Reveal';
import GalaxyBackground from './components/GalaxyBackground';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [projects, setProjects] = useState([]);
  const [isUploadPortalOpen, setIsUploadPortalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  
  // Details Modal States
  const [activeDetailProject, setActiveDetailProject] = useState(null);

  // Admin Inbox Dashboard States
  const [isInboxDashboardOpen, setIsInboxDashboardOpen] = useState(false);

  // About Details States
  const [aboutDetails, setAboutDetails] = useState({});
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Skills States
  const [skillsData, setSkillsData] = useState([]);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);

  // Experience States
  const [experienceData, setExperienceData] = useState([]);
  const [educationCredentials, setEducationCredentials] = useState({});
  const [isEditExperienceOpen, setIsEditExperienceOpen] = useState(false);
  const [experienceEditSubTab, setExperienceEditSubTab] = useState('work');
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize data and theme
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('falkiya_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Load projects
    setProjects(databaseService.getProjects());

    // Load about details
    const loadAboutDetails = async () => {
      const details = await databaseService.getAboutDetails();
      setAboutDetails(details);
    };
    loadAboutDetails();

    // Load skills
    setSkillsData(databaseService.getSkills());

    // Load experience
    setExperienceData(databaseService.getExperience());
    setEducationCredentials(databaseService.getEducationCredentials());

    // Load Admin Logged state
    const adminLogged = localStorage.getItem('falkiya_admin_logged') === 'true';
    setIsAdmin(adminLogged);

    // Parse URL parameters for admin login/logout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setIsAdmin(true);
      localStorage.setItem('falkiya_admin_logged', 'true');
      alert('Admin Mode Enabled');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('logout') === 'true' || urlParams.get('admin') === 'false') {
      setIsAdmin(false);
      localStorage.setItem('falkiya_admin_logged', 'false');
      alert('Admin Mode Disabled');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Geo-lookup visitor tracking
    const trackVisitor = async () => {
      if (sessionStorage.getItem('falkiya_visit_logged')) return;
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const maskedIp = data.ip ? data.ip.split('.').slice(0, 2).join('.') + '.xx.xx' : 'Unknown';
          const ua = navigator.userAgent;
          let device = 'Windows Desktop';
          if (/iPhone|iPad|iPod/i.test(ua)) device = 'Safari on iOS Mobile';
          else if (/Android/i.test(ua)) device = 'Chrome on Android Mobile';
          else if (/Macintosh/i.test(ua)) device = 'Safari on macOS Desktop';
          else if (/Linux/i.test(ua)) device = 'Firefox on Linux Desktop';
          
          const newVisit = {
            id: `visit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ip: maskedIp,
            location: `${data.city || 'Unknown City'}, ${data.region || 'Unknown Region'}, ${data.country_name || 'Unknown Country'}`,
            device: device,
            isp: data.org || 'Unknown Provider',
            type: 'real',
            company: ''
          };
          
          databaseService.logVisit(newVisit);
          sessionStorage.setItem('falkiya_visit_logged', 'true');
        }
      } catch (err) {
        console.error('Visitor tracking lookup failed:', err);
      }
    };

    trackVisitor();
  }, []);

  const handleSkillsSaved = (updatedSkills) => {
    setSkillsData(updatedSkills);
  };

  const handleExperienceSaved = (updatedWork, updatedEduData) => {
    setExperienceData(updatedWork);
    setEducationCredentials(updatedEduData);
  };

  const handleOpenExperienceEdit = (subTab = 'work') => {
    setExperienceEditSubTab(subTab);
    setIsEditExperienceOpen(true);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // Keyboard shortcut listener to toggle admin mode: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdmin((prev) => {
          const nextState = !prev;
          localStorage.setItem('falkiya_admin_logged', String(nextState));
          alert(`Admin Mode ${nextState ? 'Enabled' : 'Disabled'}`);
          return nextState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAboutDetailsSaved = async (updatedDetails) => {
    const saved = await databaseService.updateAboutDetails(updatedDetails);
    setAboutDetails(saved);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('falkiya_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleProjectAdded = (newProject) => {
    databaseService.addProject(newProject);
    setProjects(databaseService.getProjects()); // Reload state
  };

  const handleProjectUpdated = (projectId, updatedData) => {
    databaseService.updateProject(projectId, updatedData);
    setProjects(databaseService.getProjects()); // Reload state
    setProjectToEdit(null);
  };

  const handleProjectDeleted = (projectId) => {
    databaseService.deleteProject(projectId);
    setProjects(databaseService.getProjects()); // Reload state
  };

  const handleEditProjectClick = (project) => {
    setProjectToEdit(project);
    setIsUploadPortalOpen(true);
  };

  const handleCloseUploadPortal = () => {
    setIsUploadPortalOpen(false);
    setProjectToEdit(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dynamic Starry Galaxy Background */}
      <GalaxyBackground />
      
      {/* Dynamic Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Sections */}
      <main style={{ flexGrow: 1 }}>
        <Reveal effect="fade-in" duration={1.2}>
          <Hero 
            aboutDetails={aboutDetails} 
            onOpenEditModal={() => setIsEditProfileOpen(true)} 
            onSaveProfile={handleAboutDetailsSaved} 
            isAdmin={isAdmin}
          />
        </Reveal>
        <Reveal effect="slide-up">
          <Skills skillsData={skillsData} onOpenEditModal={() => setIsEditSkillsOpen(true)} isAdmin={isAdmin} />
        </Reveal>
        <Reveal effect="slide-up">
          <Experience 
            workExperience={experienceData} 
            educationCredentials={educationCredentials} 
            onOpenEditModal={handleOpenExperienceEdit} 
            isAdmin={isAdmin}
          />
        </Reveal>
        
        {/* Shipped Projects Grid */}
        <Reveal effect="slide-up">
          <ProjectsSection 
            projects={projects} 
            onOpenUploadPortal={() => setIsUploadPortalOpen(true)} 
            onEditProject={handleEditProjectClick}
            onDeleteProject={handleProjectDeleted}
            onOpenDetailsModal={(project) => setActiveDetailProject(project)}
            isAdmin={isAdmin}
          />
        </Reveal>
        
        <Reveal effect="slide-up">
          <CommentsSection isAdmin={isAdmin} />
        </Reveal>
        <Reveal effect="slide-up">
          <ContactSection />
        </Reveal>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)',
        padding: '3rem 0 2rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              <Terminal size={18} className="text-gradient" />
              <span>FALKIYA.<span className="text-gradient">AI</span></span>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#about" style={{ transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>About</a>
              <a href="#skills" style={{ transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Skills</a>
              <a href="#experience" style={{ transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Timeline</a>
              <a href="#projects" style={{ transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>SaaS Work</a>
              <a href="#reviews" style={{ transition: 'var(--transition-smooth)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>Testimonials</a>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              
              {/* Special Owner Inbox Button */}
              <button 
                onClick={() => setIsInboxDashboardOpen(true)}
                className="btn-secondary" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.75rem', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  borderColor: 'var(--accent-purple)'
                }}
              >
                <Lock size={12} className="text-gradient" />
                <span>Owner Inbox</span>
              </button>

              <a 
                href="https://github.com/Falkiya/skills-copilot-codespaces-vscode" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'inherit'; }}
              >
                <GithubIcon size={16} />
              </a>
              <a 
                href="https://linkedin.com/in/falkiya-afreen-0a96612b0" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'inherit'; }}
              >
                <LinkedinIcon size={16} />
              </a>
              <a 
                href="mailto:falkiyafreen23@gmail.com"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'inherit'; }}
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Copyright details */}
          <div style={{
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>&copy; {new Date().getFullYear()} Falkiya Afreen. All Rights Reserved.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Built with <Heart size={12} fill="#ef4444" color="#ef4444" /> and React &amp; Vite
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Chat Copilot */}
      <AiAssistant />

      {/* Project Upload & Edit Portal Admin Modal */}
      <AdminUploadPortal 
        isOpen={isUploadPortalOpen} 
        onClose={handleCloseUploadPortal} 
        onProjectAdded={handleProjectAdded}
        onProjectUpdated={handleProjectUpdated}
        projectToEdit={projectToEdit}
      />

      {/* Project Specific Comments Details Modal */}
      <ProjectDetailsModal 
        project={activeDetailProject}
        isOpen={activeDetailProject !== null}
        onClose={() => setActiveDetailProject(null)}
      />

      {/* Owner Inbox Admin Dashboard Modal */}
      <InboxDashboard 
        isOpen={isInboxDashboardOpen}
        onClose={() => setIsInboxDashboardOpen(false)}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />

      {/* Profile Details Edit Modal */}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        aboutDetails={aboutDetails}
        onSave={handleAboutDetailsSaved}
      />

      {/* Skills Edit Modal */}
      <EditSkillsModal 
        isOpen={isEditSkillsOpen}
        onClose={() => setIsEditSkillsOpen(false)}
        onSave={handleSkillsSaved}
      />

      {/* Experience Edit Modal */}
      <EditExperienceModal 
        isOpen={isEditExperienceOpen}
        onClose={() => setIsEditExperienceOpen(false)}
        onSave={handleExperienceSaved}
        initialTab={experienceEditSubTab}
      />

    </div>
  );
}
