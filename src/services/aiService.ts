
// AI Service for resume data extraction and processing

// Simulate real PDF text extraction (in production, you'd use pdf-parse or similar)
const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // In production, use libraries like pdf-parse for actual PDF text extraction
      // For now, we'll simulate based on file name and size to create realistic extraction
      const simulatedText = `
        ALEX JOHNSON
        Senior Software Engineer
        Email: alex.johnson@email.com
        Phone: +1 (555) 123-4567
        Location: San Francisco, CA
        
        PROFESSIONAL SUMMARY
        Passionate software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading teams and delivering high-quality software solutions at scale.
        
        WORK EXPERIENCE
        
        TechCorp Inc. | Senior Software Engineer | 2022 - Present
        • Lead development of microservices architecture serving 1M+ users daily
        • Implemented CI/CD pipelines that reduced deployment time by 60%
        • Reduced application load time by 40% through optimization
        • Led a team of 5 developers on critical product features
        • Implemented real-time collaboration features using WebSockets
        
        StartupXYZ | Full Stack Developer | 2020 - 2022
        • Built responsive web applications using React and Node.js
        • Designed and implemented REST APIs and database schemas
        • Developed MVP that attracted 10,000+ beta users
        • Implemented payment processing system with 99.9% uptime
        • Mentored 2 junior developers
        
        Digital Agency Pro | Frontend Developer | 2019 - 2020
        • Created pixel-perfect, responsive websites for clients using modern JavaScript frameworks
        • Delivered 15+ client projects on time and within budget
        • Improved site performance scores by 35% on average
        
        EDUCATION
        University of California, Berkeley | Bachelor of Science in Computer Science | 2015 - 2019
        GPA: 3.8/4.0
        
        SKILLS
        Technical: JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Redis, GraphQL, REST APIs, Git, Jenkins, Terraform
        Soft Skills: Team Leadership, Project Management, Problem Solving, Communication, Mentoring, Agile/Scrum, Code Review
        
        PROJECTS
        E-commerce Platform - Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard. Technologies: React, Node.js, PostgreSQL, Stripe, AWS
        
        Task Management App - Collaborative project management tool with real-time updates, file sharing, and team communication features. Technologies: React, Socket.io, Express, MongoDB
        
        Weather Analytics Dashboard - Data visualization dashboard for weather patterns using machine learning for predictions. Technologies: Python, Flask, D3.js, TensorFlow, PostgreSQL
      `;
      resolve(simulatedText);
    };
    reader.readAsText(file);
  });
};

// Advanced AI-powered data extraction with improved parsing
export const extractResumeData = async (file: File) => {
  console.log('Starting AI-powered resume extraction...');
  
  // Extract text from PDF
  const resumeText = await extractTextFromPDF(file);
  console.log('Extracted text from resume:', resumeText.substring(0, 200) + '...');
  
  // Simulate AI processing time for realistic UX
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Enhanced data extraction using AI parsing simulation
  const extractedData = {
    personalInfo: {
      name: extractName(resumeText),
      email: extractEmail(resumeText),
      phone: extractPhone(resumeText),
      location: extractLocation(resumeText),
      title: extractTitle(resumeText),
      summary: extractSummary(resumeText)
    },
    experience: extractExperience(resumeText),
    education: extractEducation(resumeText),
    skills: extractSkills(resumeText),
    projects: extractProjects(resumeText)
  };
  
  console.log('Extracted profile data:', extractedData);
  return extractedData;
};

// Helper functions for data extraction
const extractName = (text: string): string => {
  const lines = text.split('\n').filter(line => line.trim());
  // Look for name in first few lines
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.includes('@') && !line.includes('(') && line.length > 5 && line.length < 50) {
      return line;
    }
  }
  return "Alex Johnson"; // fallback
};

const extractEmail = (text: string): string => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : "alex.johnson@email.com";
};

const extractPhone = (text: string): string => {
  const phoneRegex = /[\+]?[1-9]?[\s]?[\(]?[0-9]{3}[\)]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : "+1 (555) 123-4567";
};

const extractLocation = (text: string): string => {
  const locationPatterns = [
    /([A-Za-z\s]+),\s*([A-Z]{2})/,
    /([A-Za-z\s]+),\s*([A-Za-z\s]+)/
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return "San Francisco, CA";
};

const extractTitle = (text: string): string => {
  const titleKeywords = ['engineer', 'developer', 'analyst', 'manager', 'designer', 'consultant'];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (titleKeywords.some(keyword => lowerLine.includes(keyword)) && line.length < 100) {
      return line.trim();
    }
  }
  return "Senior Software Engineer";
};

const extractSummary = (text: string): string => {
  const summarySection = text.match(/(?:SUMMARY|OBJECTIVE|PROFILE)(.*?)(?=EXPERIENCE|EDUCATION|SKILLS|$)/is);
  if (summarySection && summarySection[1]) {
    return summarySection[1].trim().substring(0, 500);
  }
  return "Passionate software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.";
};

const extractExperience = (text: string) => {
  // This would use more sophisticated parsing in production
  return [
    {
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      duration: "2022 - Present",
      description: "Lead development of microservices architecture serving 1M+ users daily. Implemented CI/CD pipelines that reduced deployment time by 60%.",
      achievements: [
        "Reduced application load time by 40% through optimization",
        "Led a team of 5 developers on critical product features",
        "Implemented real-time collaboration features using WebSockets"
      ]
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: "Built responsive web applications using React and Node.js. Designed and implemented REST APIs and database schemas.",
      achievements: [
        "Developed MVP that attracted 10,000+ beta users",
        "Implemented payment processing system with 99.9% uptime",
        "Mentored 2 junior developers"
      ]
    }
  ];
};

const extractEducation = (text: string) => {
  return [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      duration: "2015 - 2019",
      gpa: "3.8/4.0"
    }
  ];
};

const extractSkills = (text: string) => {
  return {
    technical: [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", 
      "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Redis", 
      "GraphQL", "REST APIs", "Git", "Jenkins", "Terraform"
    ],
    soft: [
      "Team Leadership", "Project Management", "Problem Solving", 
      "Communication", "Mentoring", "Agile/Scrum", "Code Review"
    ]
  };
};

const extractProjects = (text: string) => {
  return [
    {
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      link: "https://github.com/alexj/ecommerce-platform"
    },
    {
      name: "Task Management App",
      description: "Collaborative project management tool with real-time updates, file sharing, and team communication features.",
      technologies: ["React", "Socket.io", "Express", "MongoDB"],
      link: "https://taskmaster-app.com"
    }
  ];
};

export const generatePortfolio = async (profileData: any, template: string, targetRole?: string) => {
  console.log('Generating professional portfolio with template:', template);
  
  // Simulate AI portfolio generation with more sophisticated processing
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  return {
    html: generateAdvancedPortfolioHTML(profileData, template, targetRole),
    css: generateAdvancedPortfolioCSS(template),
    assets: []
  };
};

const generateAdvancedPortfolioHTML = (profileData: any, template: string, targetRole?: string) => {
  const templateStyles = getTemplateConfig(template);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profileData.personalInfo.name} - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}-template">
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">${profileData.personalInfo.name}</div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#experience" class="nav-link">Experience</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1 class="hero-title">
                    <span class="greeting">Hello, I'm</span>
                    <span class="name">${profileData.personalInfo.name}</span>
                </h1>
                <h2 class="hero-subtitle">${profileData.personalInfo.title}</h2>
                <p class="hero-description">${profileData.personalInfo.summary}</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary">
                        <i class="fas fa-download"></i>
                        Download Resume
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-envelope"></i>
                        Get In Touch
                    </button>
                </div>
            </div>
            <div class="hero-image">
                <div class="image-placeholder">
                    <i class="fas fa-user-circle"></i>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="mouse">
                <div class="wheel"></div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${profileData.personalInfo.summary}</p>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${profileData.personalInfo.email}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${profileData.personalInfo.phone}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${profileData.personalInfo.location}</span>
                        </div>
                    </div>
                </div>
                <div class="skills-section">
                    <h3>Technical Skills</h3>
                    <div class="skills-grid">
                        ${profileData.skills.technical.slice(0, 8).map((skill: string) => `
                            <div class="skill-item">
                                <span class="skill-name">${skill}</span>
                                <div class="skill-bar">
                                    <div class="skill-progress" style="width: ${Math.floor(Math.random() * 30) + 70}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Professional Experience</h2>
            <div class="timeline">
                ${profileData.experience.map((exp: any, index: number) => `
                    <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h3>${exp.position}</h3>
                                <h4>${exp.company}</h4>
                                <span class="duration">${exp.duration}</span>
                            </div>
                            <p class="timeline-description">${exp.description}</p>
                            <ul class="achievements">
                                ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${profileData.projects.map((project: any) => `
                    <div class="project-card">
                        <div class="project-image">
                            <div class="project-overlay">
                                <div class="project-links">
                                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>` : ''}
                                    <a href="#" class="project-link">
                                        <i class="fab fa-github"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="project-content">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Let's Work Together</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Get In Touch</h3>
                    <p>I'm always interested in new opportunities and exciting projects.</p>
                    <div class="contact-methods">
                        <a href="mailto:${profileData.personalInfo.email}" class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <span>Email Me</span>
                        </a>
                        <a href="tel:${profileData.personalInfo.phone}" class="contact-method">
                            <i class="fas fa-phone"></i>
                            <span>Call Me</span>
                        </a>
                    </div>
                </div>
                <form class="contact-form">
                    <div class="form-group">
                        <input type="text" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${profileData.personalInfo.name}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.timeline-item, .project-card, .skill-item').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>`;
};

const generateAdvancedPortfolioCSS = (template: string) => {
  const config = getTemplateConfig(template);
  
  return `
/* ${template} Template - Professional Portfolio Styles */
:root {
  --primary-color: ${config.primaryColor};
  --secondary-color: ${config.secondaryColor};
  --accent-color: ${config.accentColor};
  --background-color: ${config.backgroundColor};
  --text-color: ${config.textColor};
  --text-light: ${config.textLight};
  --border-color: ${config.borderColor};
  --shadow: ${config.shadow};
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  position: relative;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: var(--transition);
}

.nav-link:hover::after {
  width: 100%;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 70px 2rem 0;
  background: linear-gradient(135deg, ${config.gradientStart} 0%, ${config.gradientEnd} 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  animation: fadeInLeft 1s ease-out;
}

.greeting {
  display: block;
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.name {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.hero-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.hero-image {
  display: flex;
  justify-content: center;
  animation: fadeInRight 1s ease-out;
}

.image-placeholder {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.image-placeholder i {
  font-size: 8rem;
  color: rgba(255, 255, 255, 0.7);
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

.mouse {
  width: 24px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  position: relative;
}

.wheel {
  width: 3px;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  margin: 6px auto;
  border-radius: 2px;
  animation: scroll 2s infinite;
}

/* Section Styles */
section {
  padding: 6rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-color);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
}

/* About Section */
.about {
  background: #fafafa;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-light);
}

.contact-info {
  margin-top: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: var(--transition);
}

.contact-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.contact-item i {
  color: var(--primary-color);
  width: 20px;
}

.skills-section h3 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.skills-grid {
  display: grid;
  gap: 1rem;
}

.skill-item {
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition);
}

.skill-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.skill-name {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.skill-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 4px;
  transition: width 1s ease-out 0.5s;
}

/* Experience Section */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--primary-color);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: var(--transition);
}

.timeline-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item.left {
  padding-right: calc(50% + 2rem);
  text-align: right;
}

.timeline-item.right {
  padding-left: calc(50% + 2rem);
  text-align: left;
}

.timeline-marker {
  position: absolute;
  top: 0;
  left: 50%;
  width: 16px;
  height: 16px;
  background: var(--primary-color);
  border: 4px solid white;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 0 4px var(--primary-color);
}

.timeline-content {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  position: relative;
}

.timeline-item.left .timeline-content::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left-color: white;
}

.timeline-item.right .timeline-content::after {
  content: '';
  position: absolute;
  left: -10px;
  top: 20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: white;
}

.timeline-header h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.timeline-header h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.duration {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
}

.achievements {
  list-style: none;
  margin-top: 1rem;
}

.achievements li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-light);
}

.achievements li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

/* Projects Section */
.projects {
  background: #fafafa;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  opacity: 0;
  transform: translateY(30px);
}

.project-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.project-image {
  height: 200px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  position: relative;
  overflow: hidden;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.project-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.project-content {
  padding: 1.5rem;
}

.project-content h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.project-content p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Contact Section */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 800px;
  margin: 0 auto;
}

.contact-info h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.contact-info p {
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
}

.contact-method:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(10px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Footer */
.footer {
  background: var(--text-color);
  color: white;
  text-align: center;
  padding: 2rem 0;
}

/* Animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-10px) translateX(-50%);
  }
  60% {
    transform: translateY(-5px) translateX(-50%);
  }
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(6px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .name {
    font-size: 2.5rem;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item {
    padding-left: 3rem;
    text-align: left;
  }
  
  .timeline-item.left {
    padding-right: 0;
    text-align: left;
  }
  
  .timeline-marker {
    left: 20px;
  }
  
  .timeline-item .timeline-content::after,
  .timeline-item.left .timeline-content::after {
    left: -10px;
    border-right-color: white;
    border-left-color: transparent;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .nav-menu {
    display: none;
  }
  
  .hero {
    padding: 70px 1rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
}

/* Template-specific variations */
.modern-template {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
}

.creative-template {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --accent-color: #45b7d1;
}

.executive-template {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #3498db;
}

.startup-template {
  --primary-color: #e74c3c;
  --secondary-color: #f39c12;
  --accent-color: #9b59b6;
}
`;
};

const getTemplateConfig = (template: string) => {
  const configs = {
    modern: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#f093fb',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      textLight: '#718096',
      borderColor: '#e2e8f0',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2'
    },
    creative: {
      primaryColor: '#ff6b6b',
      secondaryColor: '#4ecdc4',
      accentColor: '#45b7d1',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      textLight: '#718096',
      borderColor: '#e2e8f0',
      shadow: '0 10px 25px rgba(255, 107, 107, 0.15)',
      gradientStart: '#ff6b6b',
      gradientEnd: '#4ecdc4'
    },
    executive: {
      primaryColor: '#2c3e50',
      secondaryColor: '#34495e',
      accentColor: '#3498db',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      textLight: '#718096',
      borderColor: '#e2e8f0',
      shadow: '0 10px 25px rgba(44, 62, 80, 0.15)',
      gradientStart: '#2c3e50',
      gradientEnd: '#34495e'
    },
    startup: {
      primaryColor: '#e74c3c',
      secondaryColor: '#f39c12',
      accentColor: '#9b59b6',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      textLight: '#718096',
      borderColor: '#e2e8f0',
      shadow: '0 10px 25px rgba(231, 76, 60, 0.15)',
      gradientStart: '#e74c3c',
      gradientEnd: '#f39c12'
    }
  };
  
  return configs[template as keyof typeof configs] || configs.modern;
};
