import { firebaseService } from './firebaseService';

// Pluggable Database Service
// Currently runs on LocalStorage for instant serverless hosting compatibility.
// Easily extendable to Firebase Firestore, Supabase, or a custom FastAPI backend.

const INITIAL_PROJECTS = [];

const INITIAL_COMMENTS = [];

const DEFAULT_ABOUT = {
  name: "FALKIYA AFREEN",
  summary: "AI Engineer & Freelancer. I build smart, real-world AI solutions — from LLMs to automation. Let's turn your ideas into intelligent products.",
  location: "Mysuru, Karnataka",
  email: "falkiyafreen23@gmail.com",
  phone: "",
  linkedin: "https://www.linkedin.com/in/falkiya-afreen-604771239/",
  profilePhoto: "",
  profilePhotoZoom: 100,
  profilePhotoX: 50,
  profilePhotoY: 50,
  roles: [
    "AI Engineer",
    "RAG Applications Developer",
    "Freelance AI SaaS Builder",
    "Prompt Architect"
  ]
};

const DEFAULT_SKILLS = [
  {
    title: 'AI, RAG & Agents',
    skills: [
      'RAG Architecture',
      'LLM APIs (OpenRouter)',
      'Prompt Engineering',
      'Agentic AI Workflows',
      'Vector Embeddings',
      'Semantic Search',
      'Natural Language Processing',
      'AI Workflow Automation'
    ]
  },
  {
    title: 'Backend & Data Science',
    skills: [
      'Python',
      'FastAPI',
      'REST APIs',
      'JSON',
      'Scikit-learn',
      'ML Data Preprocessing',
      'Feature Engineering',
      'Model Testing'
    ]
  },
  {
    title: 'Frontend & Operations',
    skills: [
      'React / Vite',
      'HTML5 & CSS3',
      'JavaScript (ES6+)',
      'Git & GitHub',
      'Client Management',
      'Technical Communication',
      'Workshop Training',
      'IT Cloud Systems'
    ]
  }
];

const DEFAULT_EXPERIENCE = [
  {
    id: 'work-1',
    role: 'Freelance AI Developer',
    company: 'Self-employed · Remote',
    period: '2025 – Present',
    bullets: [
      'Delivered a client-facing Study Buddy SaaS platform using RAG architecture, vector retrieval, and OpenRouter API for real-time LLM responses.',
      'Designed full AI pipeline: document ingestion → semantic chunking → vector embeddings → semantic retrieval → context-injected generation.',
      'Managed client requirements, delivery timelines, and technical communication end-to-end.',
      'Built Squrix AI — a custom AI workflow app targeting real-world student and user challenges.'
    ],
    skills: ['RAG Architecture', 'OpenRouter API', 'FastAPI', 'React', 'Vector Databases', 'Client Management']
  },
  {
    id: 'work-2',
    role: 'AI Workshop Trainer',
    company: "St. Joseph's College for Women, Mysuru",
    period: '2024 – 2025',
    bullets: [
      'Conducted 2 hands-on workshops training 100+ students on ChatGPT, Claude, Gemini, and prompt engineering methods.',
      'Instructed students on how to build websites, create games, and solve practical tasks using agentic AI tools.',
      'Received 2 official appreciation letters from the college institution for highly impactful workshop delivery.'
    ],
    skills: ['Prompt Engineering', 'AI Training', 'Public Speaking', 'Curriculum Design', 'AI Coding Tools']
  },
  {
    id: 'work-3',
    role: 'Tech Saksham Intern',
    company: 'Microsoft & SAP · Remote Program',
    period: '2024',
    bullets: [
      'Built and tested machine learning models using Python and Scikit-learn libraries.',
      'Applied data preprocessing, cleaning, feature selection, and model evaluation metrics.',
      'Gained exposure to enterprise AI workflows, cloud computing fundamentals, and IT support infrastructures.'
    ],
    skills: ['Python', 'Scikit-learn', 'Machine Learning', 'Data Preprocessing', 'Cloud Workflows']
  },
  {
    id: 'work-4',
    role: 'Marketing & Operations Intern',
    company: 'The Career Valley',
    period: '2023',
    bullets: [
      'Supported student outreach campaigns and event coordination programs.',
      'Managed operational schedules and digital marketing updates.'
    ],
    skills: ['Outreach Campaigns', 'Event Coordination', 'Operations Support']
  }
];

const DEFAULT_EDUCATION_CREDENTIALS = {
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: "St. Joseph's College for Women, Mysuru",
      period: '2023 – Present (5th Semester)',
      details: 'Consistently maintained academic excellence with a CGPA of 8.5 up to the 5th Semester. Elected as Class Representative during the 2nd Year.'
    }
  ],
  certifications: [
    'Microsoft & SAP Tech Saksham Certified',
    'IBM SkillsBuild – IT Experience Orientation Program',
    'Certified in AI Tools – Be10x',
    'AIThon Digital Maven – Seshadripuram Degree College'
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Prize Winner – College AI Resume Builder',
      desc: 'Designed and presented a high-quality AI-powered resume builder, securing first place in the college-level competition.'
    },
    {
      id: 'ach-2',
      title: 'Miss Josephite (3rd Year)',
      desc: 'Awarded the prestigious title representing leadership, academic excellence, and extra-curricular participation at St. Joseph\'s College.'
    },
    {
      id: 'ach-3',
      title: 'Tech Excellence Award',
      desc: 'Recognized for technical contributions, teaching initiatives, and successful student workshop conduction.'
    }
  ]
};

const DEFAULT_VISITORS = [];

export const databaseService = {
  // Get all projects
  getProjects: () => {
    let localProjects = localStorage.getItem('falkiya_projects');
    // Migration: If the user has the old mock projects stored, clear them out
    if (localProjects && localProjects.includes('study-buddy')) {
      localStorage.removeItem('falkiya_projects');
      localProjects = null;
    }
    if (!localProjects) {
      localStorage.setItem('falkiya_projects', JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(localProjects);
  },

  // Add new client project
  addProject: (project) => {
    const projects = databaseService.getProjects();
    const newProject = {
      ...project,
      id: `project-${Date.now()}`
    };
    const updatedProjects = [newProject, ...projects];
    localStorage.setItem('falkiya_projects', JSON.stringify(updatedProjects));
    return newProject;
  },

  // Get all comments
  getComments: async () => {
    if (firebaseService.isActive()) {
      return await firebaseService.getComments();
    }
    let localComments = localStorage.getItem('falkiya_comments');
    // Migration: If the user has the old mock comments stored, clear them out
    if (localComments && localComments.includes('comment-1')) {
      localStorage.removeItem('falkiya_comments');
      localComments = null;
    }
    if (!localComments) {
      localStorage.setItem('falkiya_comments', JSON.stringify(INITIAL_COMMENTS));
      return INITIAL_COMMENTS;
    }
    return JSON.parse(localComments);
  },

  // Add a review comment
  addComment: async (comment) => {
    if (firebaseService.isActive()) {
      return await firebaseService.addComment(comment);
    }
    const comments = await databaseService.getComments();
    const secretToken = Math.random().toString(36).substring(2, 15);
    const newComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      secretToken
    };
    const updatedComments = [newComment, ...comments];
    localStorage.setItem('falkiya_comments', JSON.stringify(updatedComments));
    return newComment;
  },

  // Like a comment
  likeComment: async (commentId, currentLikes = 0) => {
    if (firebaseService.isActive()) {
      return await firebaseService.likeComment(commentId, currentLikes);
    }
    const comments = await databaseService.getComments();
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: (c.likes || 0) + 1 };
      }
      return c;
    });
    localStorage.setItem('falkiya_comments', JSON.stringify(updatedComments));
    return updatedComments.find(c => c.id === commentId);
  },

  // Update a comment
  updateComment: async (commentId, updatedData, token) => {
    if (firebaseService.isActive()) {
      return await firebaseService.updateComment(commentId, updatedData, token);
    }
    const comments = await databaseService.getComments();
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, ...updatedData };
      }
      return c;
    });
    localStorage.setItem('falkiya_comments', JSON.stringify(updatedComments));
    return updatedComments.find(c => c.id === commentId);
  },

  // Delete a comment
  deleteComment: async (commentId, token) => {
    if (firebaseService.isActive()) {
      return await firebaseService.deleteComment(commentId, token);
    }
    const comments = await databaseService.getComments();
    const updatedComments = comments.filter(c => c.id !== commentId);
    localStorage.setItem('falkiya_comments', JSON.stringify(updatedComments));
    return true;
  },

  // Update an existing project
  updateProject: (projectId, updatedData) => {
    const projects = databaseService.getProjects();
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        // Keep ID same
        return { ...p, ...updatedData, id: projectId };
      }
      return p;
    });
    localStorage.setItem('falkiya_projects', JSON.stringify(updatedProjects));
    return updatedProjects;
  },

  // Delete a project
  deleteProject: (projectId) => {
    const projects = databaseService.getProjects();
    const updatedProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('falkiya_projects', JSON.stringify(updatedProjects));
    return updatedProjects;
  },

  // Get comments specific to a project
  getProjectComments: (projectId) => {
    const allComments = localStorage.getItem('falkiya_project_comments');
    if (!allComments) return [];
    const parsed = JSON.parse(allComments);
    return parsed[projectId] || [];
  },

  // Add comment to a specific project
  addProjectComment: (projectId, comment) => {
    const allComments = localStorage.getItem('falkiya_project_comments') 
      ? JSON.parse(localStorage.getItem('falkiya_project_comments')) 
      : {};
    
    const newComment = {
      ...comment,
      id: `pcomment-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    if (!allComments[projectId]) {
      allComments[projectId] = [];
    }
    
    allComments[projectId].push(newComment);
    localStorage.setItem('falkiya_project_comments', JSON.stringify(allComments));
    return newComment;
  },

  // Get all direct message threads
  getChatThreads: () => {
    const threads = localStorage.getItem('falkiya_chat_threads');
    return threads ? JSON.parse(threads) : [];
  },

  // Send a message inside a direct chat thread (creates thread if threadId doesn't exist)
  sendChatMessage: (threadId, sender, senderName, senderEmail, text) => {
    const threads = databaseService.getChatThreads();
    const timestamp = new Date().toISOString();
    
    let thread = threads.find(t => t.id === threadId);
    if (!thread) {
      thread = {
        id: threadId || `thread-${Date.now()}`,
        clientName: senderName || 'Client Visitor',
        clientEmail: senderEmail || '',
        lastUpdated: timestamp,
        messages: []
      };
      threads.push(thread);
    }
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender, // 'client' or 'admin'
      text,
      timestamp
    };
    
    thread.messages.push(newMessage);
    thread.lastUpdated = timestamp;
    
    // Update thread identity details if message is from client
    if (sender === 'client') {
      if (senderName) thread.clientName = senderName;
      if (senderEmail) thread.clientEmail = senderEmail;
    }
    
    localStorage.setItem('falkiya_chat_threads', JSON.stringify(threads));
    return thread;
  },

  // Get profile about details
  getAboutDetails: async () => {
    if (firebaseService.isActive()) {
      const dbDetails = await firebaseService.getProfileDetails();
      if (dbDetails) return dbDetails;
    }
    const details = localStorage.getItem('falkiya_about_details');
    if (!details) {
      localStorage.setItem('falkiya_about_details', JSON.stringify(DEFAULT_ABOUT));
      return DEFAULT_ABOUT;
    }
    const parsed = JSON.parse(details);
    if (parsed.summary && parsed.summary.includes("BCA student (CGPA 8.5")) {
      parsed.summary = DEFAULT_ABOUT.summary;
      localStorage.setItem('falkiya_about_details', JSON.stringify(parsed));
    }
    if (parsed.phone) {
      parsed.phone = '';
      localStorage.setItem('falkiya_about_details', JSON.stringify(parsed));
    }
    return parsed;
  },

  // Update profile about details
  updateAboutDetails: async (updatedDetails) => {
    if (firebaseService.isActive()) {
      return await firebaseService.updateProfileDetails(updatedDetails);
    }
    localStorage.setItem('falkiya_about_details', JSON.stringify(updatedDetails));
    return updatedDetails;
  },

  // Get skills list
  getSkills: () => {
    const list = localStorage.getItem('falkiya_skills');
    if (!list) {
      localStorage.setItem('falkiya_skills', JSON.stringify(DEFAULT_SKILLS));
      return DEFAULT_SKILLS;
    }
    return JSON.parse(list);
  },

  // Update skills list
  updateSkills: (updatedSkills) => {
    localStorage.setItem('falkiya_skills', JSON.stringify(updatedSkills));
    return updatedSkills;
  },

  // Get experience list
  getExperience: () => {
    const list = localStorage.getItem('falkiya_experience');
    if (!list) {
      localStorage.setItem('falkiya_experience', JSON.stringify(DEFAULT_EXPERIENCE));
      return DEFAULT_EXPERIENCE;
    }
    return JSON.parse(list);
  },

  // Update experience list
  updateExperience: (updatedExperience) => {
    localStorage.setItem('falkiya_experience', JSON.stringify(updatedExperience));
    return updatedExperience;
  },

  // Get education & credentials
  getEducationCredentials: () => {
    const data = localStorage.getItem('falkiya_education_credentials');
    if (!data) {
      localStorage.setItem('falkiya_education_credentials', JSON.stringify(DEFAULT_EDUCATION_CREDENTIALS));
      return DEFAULT_EDUCATION_CREDENTIALS;
    }
    return JSON.parse(data);
  },

  // Update education & credentials
  updateEducationCredentials: (updatedCredentials) => {
    localStorage.setItem('falkiya_education_credentials', JSON.stringify(updatedCredentials));
    return updatedCredentials;
  },

  // Get visitor stats
  getVisitorStats: () => {
    let list = localStorage.getItem('falkiya_visitors');
    // Clear out old mock visitor data from local storage if present
    if (list && (list.includes('Redmond, Washington') || list.includes('visit-1') || list.includes('Microsoft Corporation'))) {
      localStorage.removeItem('falkiya_visitors');
      list = null;
    }
    if (!list) {
      localStorage.setItem('falkiya_visitors', JSON.stringify(DEFAULT_VISITORS));
      return DEFAULT_VISITORS;
    }
    return JSON.parse(list);
  },

  // Log a visitor visit
  logVisit: (visit) => {
    const list = databaseService.getVisitorStats();
    const updated = [visit, ...list].slice(0, 100); // cap at 100 logs
    localStorage.setItem('falkiya_visitors', JSON.stringify(updated));
    return updated;
  }
};
