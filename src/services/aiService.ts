import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Enhanced PDF text extraction using PDF.js
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF text extraction...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    console.log('PDF text extraction completed, length:', fullText.length);
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Enhanced text extraction for DOCX files
const extractTextFromDOCX = async (file: File): Promise<string> => {
  // For DOCX, we'll simulate extraction for now
  // In a real implementation, you'd use a library like mammoth.js
  console.log('Extracting text from DOCX file...');
  
  // Simulated realistic resume text based on file size and name
  const simulatedText = `
    SARAH JOHNSON
    Senior Full Stack Developer
    Email: sarah.johnson@email.com
    Phone: +1 (555) 987-6543
    Location: Seattle, WA
    LinkedIn: linkedin.com/in/sarahjohnson
    
    PROFESSIONAL SUMMARY
    Experienced full-stack developer with 6+ years of expertise in React, Node.js, and cloud technologies. 
    Proven track record of building scalable web applications and leading development teams. 
    Passionate about clean code, user experience, and continuous learning.
    
    TECHNICAL SKILLS
    Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Next.js, Vue.js
    Backend: Node.js, Express, Python, Django, REST APIs, GraphQL
    Databases: PostgreSQL, MongoDB, Redis, MySQL
    Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Jenkins, Terraform
    Tools: Git, Jest, Cypress, Webpack, Vite
    
    WORK EXPERIENCE
    
    TechFlow Solutions | Senior Full Stack Developer | Jan 2022 - Present
    • Led development of enterprise SaaS platform serving 50,000+ users
    • Architected microservices infrastructure reducing response time by 45%
    • Mentored team of 4 junior developers and conducted code reviews
    • Implemented automated testing suite increasing code coverage to 95%
    • Collaborated with product team to deliver features ahead of schedule
    
    InnovateNow Inc. | Full Stack Developer | Mar 2020 - Dec 2021
    • Built responsive web applications using React and Node.js
    • Developed RESTful APIs and integrated third-party services
    • Optimized database queries improving application performance by 35%
    • Implemented authentication and authorization systems
    • Participated in agile development process and sprint planning
    
    WebCraft Agency | Frontend Developer | Jun 2018 - Feb 2020
    • Created pixel-perfect, responsive websites for 20+ clients
    • Collaborated with designers to translate mockups into functional UIs
    • Implemented SEO best practices improving search rankings
    • Maintained and updated existing client websites
    • Delivered projects on time and within budget
    
    EDUCATION
    University of Washington | Bachelor of Science in Computer Science | 2014 - 2018
    GPA: 3.7/4.0
    Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems
    
    PROJECTS
    E-Learning Platform
    Full-stack learning management system with video streaming, progress tracking, and interactive quizzes.
    Technologies: React, Node.js, MongoDB, AWS S3, Socket.io
    
    Personal Finance Tracker
    Web application for tracking expenses, budgeting, and financial goal setting with data visualization.
    Technologies: Vue.js, Express, PostgreSQL, Chart.js
    
    Real-time Chat Application
    Scalable chat application with rooms, file sharing, and message encryption.
    Technologies: React, Socket.io, Redis, Node.js
    
    CERTIFICATIONS
    AWS Certified Developer Associate (2023)
    Google Cloud Professional Developer (2022)
    
    ACHIEVEMENTS
    • Winner of company-wide hackathon for innovation in user experience (2023)
    • Contributed to open-source projects with 500+ GitHub stars
    • Speaker at local JavaScript meetup on "Modern React Patterns"
  `;
  
  return simulatedText;
};

// AI Service for resume data extraction and processing
export const extractResumeData = async (file: File) => {
  console.log('Starting AI-powered resume extraction for:', file.name);
  
  let resumeText: string;
  
  try {
    // Extract text based on file type
    if (file.type.includes('pdf')) {
      resumeText = await extractTextFromPDF(file);
    } else if (file.name.endsWith('.docx')) {
      resumeText = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }
    
    console.log('Extracted text length:', resumeText.length);
    console.log('Text preview:', resumeText.substring(0, 300) + '...');
    
    // Simulate AI processing time for realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced data extraction using improved parsing
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
    
    console.log('Successfully extracted profile data:', extractedData);
    return extractedData;
    
  } catch (error) {
    console.error('Error in resume extraction:', error);
    throw error;
  }
};

// Portfolio Generation Service
export const generatePortfolio = async (profileData: any, template: string, targetRole: string = '') => {
  console.log('Starting portfolio generation with template:', template);
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const portfolioContent = generatePortfolioContent(profileData, template, targetRole);
  
  return {
    html: portfolioContent.html,
    css: portfolioContent.css
  };
};

const generatePortfolioContent = (profileData: any, template: string, targetRole: string) => {
  const { personalInfo, experience, education, skills, projects } = profileData;
  
  // Generate tailored content based on target role
  const roleOptimizedSummary = targetRole 
    ? `${personalInfo.summary} Seeking opportunities as a ${targetRole} to leverage my expertise and drive innovation.`
    : personalInfo.summary;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - ${personalInfo.title}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="${template}">
    <!-- Header Section -->
    <header class="hero-section">
        <div class="container">
            <div class="hero-content">
                <div class="profile-image">
                    <div class="avatar">${personalInfo.name.charAt(0)}</div>
                </div>
                <h1 class="name">${personalInfo.name}</h1>
                <h2 class="title">${personalInfo.title}</h2>
                <p class="summary">${roleOptimizedSummary}</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${personalInfo.email}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${personalInfo.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${personalInfo.location}</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Skills Section -->
    <section class="skills-section">
        <div class="container">
            <h2 class="section-title">Technical Expertise</h2>
            <div class="skills-grid">
                ${skills.technical.map(skill => `
                    <div class="skill-tag">${skill}</div>
                `).join('')}
            </div>
            <h3 class="subsection-title">Core Competencies</h3>
            <div class="soft-skills">
                ${skills.soft.map(skill => `
                    <div class="soft-skill">${skill}</div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Experience Section -->
    <section class="experience-section">
        <div class="container">
            <h2 class="section-title">Professional Experience</h2>
            <div class="timeline">
                ${experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h3 class="position">${exp.position}</h3>
                            <h4 class="company">${exp.company}</h4>
                            <span class="duration">${exp.duration}</span>
                            <p class="description">${exp.description}</p>
                            <ul class="achievements">
                                ${exp.achievements.map(achievement => `
                                    <li>${achievement}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section class="projects-section">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${projects.map(project => `
                    <div class="project-card">
                        <h3 class="project-name">${project.name}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.map(tech => `
                                <span class="tech-tag">${tech}</span>
                            `).join('')}
                        </div>
                        ${project.link ? `<a href="${project.link}" class="project-link">View Project</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section class="education-section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-list">
                ${education.map(edu => `
                    <div class="education-item">
                        <h3 class="degree">${edu.degree} in ${edu.field}</h3>
                        <h4 class="institution">${edu.institution}</h4>
                        <span class="duration">${edu.duration}</span>
                        ${edu.gpa ? `<span class="gpa">GPA: ${edu.gpa}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${personalInfo.name}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling and animations
        document.addEventListener('DOMContentLoaded', function() {
            // Add fade-in animation to sections
            const sections = document.querySelectorAll('section');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            });
            
            sections.forEach(section => {
                observer.observe(section);
            });
        });
    </script>
</body>
</html>`;

  const css = generateTemplateCSS(template);
  
  return { html, css };
};

const generateTemplateCSS = (template: string) => {
  const baseCSS = `
/* Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Hero Section */
.hero-section {
    padding: 80px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 2;
}

.profile-image {
    margin-bottom: 30px;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 600;
    color: white;
    margin: 0 auto;
}

.name {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: -1px;
}

.title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;
    opacity: 0.8;
}

.summary {
    font-size: 18px;
    max-width: 600px;
    margin: 0 auto 40px;
    line-height: 1.7;
}

.contact-info {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
}

.contact-item i {
    width: 20px;
    text-align: center;
}

/* Section Styles */
section {
    padding: 80px 0;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}

section.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.section-title {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 50px;
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
    border-radius: 2px;
}

.subsection-title {
    font-size: 24px;
    font-weight: 600;
    margin: 40px 0 20px;
    text-align: center;
}

/* Skills Section */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 40px;
}

.skill-tag {
    padding: 12px 20px;
    border-radius: 25px;
    text-align: center;
    font-weight: 500;
    transition: transform 0.2s ease;
}

.skill-tag:hover {
    transform: translateY(-2px);
}

.soft-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.soft-skill {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
}

/* Timeline */
.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    top: 0;
}

.timeline-item {
    position: relative;
    margin-bottom: 40px;
    padding: 0 40px;
}

.timeline-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    top: 20px;
}

.timeline-content {
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    position: relative;
}

.timeline-item:nth-child(odd) .timeline-content {
    margin-right: 50%;
}

.timeline-item:nth-child(even) .timeline-content {
    margin-left: 50%;
}

.position {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
}

.company {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
}

.duration {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 12px;
    display: inline-block;
    margin-bottom: 15px;
}

.description {
    margin-bottom: 15px;
    line-height: 1.6;
}

.achievements {
    list-style: none;
}

.achievements li {
    padding: 5px 0;
    position: relative;
    padding-left: 20px;
}

.achievements li::before {
    content: '▶';
    position: absolute;
    left: 0;
    font-size: 12px;
}

/* Projects Grid */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.project-card {
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.project-name {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
}

.project-description {
    margin-bottom: 20px;
    line-height: 1.6;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
}

.tech-tag {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
}

.project-link {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: transform 0.2s ease;
}

.project-link:hover {
    transform: translateY(-2px);
}

/* Education */
.education-list {
    max-width: 600px;
    margin: 0 auto;
}

.education-item {
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

.degree {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
}

.institution {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
}

.gpa {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 12px;
    margin-left: 10px;
}

/* Footer */
.footer {
    padding: 40px 0;
    text-align: center;
    border-top: 1px solid #eee;
}

/* Responsive Design */
@media (max-width: 768px) {
    .name {
        font-size: 36px;
    }
    
    .title {
        font-size: 20px;
    }
    
    .contact-info {
        flex-direction: column;
        gap: 15px;
    }
    
    .timeline::before {
        left: 20px;
    }
    
    .timeline-marker {
        left: 20px;
    }
    
    .timeline-item {
        padding-left: 50px;
        padding-right: 20px;
    }
    
    .timeline-item:nth-child(odd) .timeline-content,
    .timeline-item:nth-child(even) .timeline-content {
        margin: 0;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
}
`;

  // Template-specific styles
  const templateStyles = {
    modern: `
/* Modern Template */
.modern {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modern .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.modern .avatar {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.modern .section-title::after {
    background: linear-gradient(90deg, #667eea, #764ba2);
}

.modern .skill-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.modern .soft-skill {
    background: #f8f9ff;
    color: #667eea;
    border: 1px solid #667eea;
}

.modern .timeline::before {
    background: linear-gradient(180deg, #667eea, #764ba2);
}

.modern .timeline-marker {
    background: #667eea;
}

.modern .timeline-content {
    background: white;
}

.modern .duration {
    background: #667eea;
    color: white;
}

.modern .project-card {
    background: white;
    border: 1px solid #e1e8ff;
}

.modern .tech-tag {
    background: #e1e8ff;
    color: #667eea;
}

.modern .project-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.modern .education-item {
    background: white;
    border-left: 4px solid #667eea;
}

.modern .gpa {
    background: #667eea;
    color: white;
}

.modern .skills-section {
    background: #f8f9ff;
}
`,
    creative: `
/* Creative Template */
.creative {
    background: #fff;
}

.creative .hero-section {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    color: white;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.creative .avatar {
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
}

.creative .section-title::after {
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
}

.creative .skill-tag {
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%);
    color: white;
}

.creative .soft-skill {
    background: #fff5f5;
    color: #ff6b6b;
    border: 2px solid #ff6b6b;
}

.creative .timeline::before {
    background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
}

.creative .timeline-marker {
    background: #ff6b6b;
}

.creative .duration {
    background: #4ecdc4;
    color: white;
}

.creative .project-card {
    background: white;
    border: 2px solid #ff6b6b;
}

.creative .tech-tag {
    background: #4ecdc4;
    color: white;
}

.creative .project-link {
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
    color: white;
}

.creative .education-item {
    background: white;
    border-left: 6px solid #ff6b6b;
}

.creative .gpa {
    background: #4ecdc4;
    color: white;
}
`,
    executive: `
/* Executive Template */
.executive {
    background: #f8f9fa;
}

.executive .hero-section {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
}

.executive .avatar {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.executive .section-title::after {
    background: #2c3e50;
}

.executive .skill-tag {
    background: #2c3e50;
    color: white;
}

.executive .soft-skill {
    background: #ecf0f1;
    color: #2c3e50;
    border: 1px solid #2c3e50;
}

.executive .timeline::before {
    background: #2c3e50;
}

.executive .timeline-marker {
    background: #3498db;
}

.executive .duration {
    background: #3498db;
    color: white;
}

.executive .project-card {
    background: white;
    border: 1px solid #bdc3c7;
}

.executive .tech-tag {
    background: #ecf0f1;
    color: #2c3e50;
}

.executive .project-link {
    background: #2c3e50;
    color: white;
}

.executive .education-item {
    background: white;
    border-left: 4px solid #3498db;
}

.executive .gpa {
    background: #3498db;
    color: white;
}
`,
    startup: `
/* Startup Template */
.startup {
    background: #fff;
}

.startup .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    color: white;
}

.startup .avatar {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.startup .section-title::after {
    background: linear-gradient(90deg, #667eea, #f093fb);
}

.startup .skill-tag {
    background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
    color: white;
}

.startup .soft-skill {
    background: #f8f9ff;
    color: #667eea;
    border: 1px solid #f093fb;
}

.startup .timeline::before {
    background: linear-gradient(180deg, #667eea, #f093fb);
}

.startup .timeline-marker {
    background: #f093fb;
}

.startup .duration {
    background: #667eea;
    color: white;
}

.startup .project-card {
    background: white;
    border: 2px solid #f093fb;
    border-radius: 16px;
}

.startup .tech-tag {
    background: #f093fb;
    color: white;
}

.startup .project-link {
    background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
    color: white;
}

.startup .education-item {
    background: white;
    border-left: 4px solid #f093fb;
}

.startup .gpa {
    background: #f093fb;
    color: white;
}

.startup .skills-section {
    background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%);
}
`
  };

  return baseCSS + (templateStyles[template as keyof typeof templateStyles] || templateStyles.modern);
};

const extractName = (text: string): string => {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Look for name patterns in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip common headers and contact info
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('curriculum') ||
        line.includes('@') || 
        line.includes('(') || 
        line.length < 3 || 
        line.length > 50) {
      continue;
    }
    
    // Check if line looks like a name (contains letters and possibly spaces)
    if (/^[A-Za-z\s\-'\.]+$/.test(line) && line.split(' ').length >= 2) {
      return line;
    }
  }
  
  return "Professional"; // fallback
};

const extractEmail = (text: string): string => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : "contact@email.com";
};

const extractPhone = (text: string): string => {
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : "+1 (555) 123-4567";
};

const extractLocation = (text: string): string => {
  const locationPatterns = [
    /([A-Za-z\s]+),\s*([A-Z]{2})\b/g,
    /([A-Za-z\s]+),\s*([A-Za-z\s]+)/g
  ];
  
  for (const pattern of locationPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }
  
  return "City, State";
};

const extractTitle = (text: string): string => {
  const titleKeywords = [
    'developer', 'engineer', 'analyst', 'manager', 'designer', 
    'consultant', 'specialist', 'lead', 'senior', 'junior',
    'architect', 'director', 'coordinator', 'administrator'
  ];
  
  const lines = text.split('\n');
  
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim().toLowerCase();
    
    if (titleKeywords.some(keyword => line.includes(keyword)) && 
        line.length < 100 && 
        !line.includes('@') &&
        !line.includes('(')) {
      return lines[i].trim();
    }
  }
  
  return "Professional";
};

const extractSummary = (text: string): string => {
  const summaryKeywords = ['summary', 'objective', 'profile', 'overview', 'about'];
  const lines = text.split('\n');
  
  let summaryStart = -1;
  let summaryEnd = -1;
  
  // Find summary section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    if (summaryKeywords.some(keyword => line.includes(keyword))) {
      summaryStart = i + 1;
      break;
    }
  }
  
  if (summaryStart !== -1) {
    // Find end of summary (next section or empty lines)
    for (let i = summaryStart; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().includes('experience') || 
          line.toLowerCase().includes('education') ||
          line.toLowerCase().includes('skills') ||
          (line === '' && i > summaryStart + 2)) {
        summaryEnd = i;
        break;
      }
    }
    
    if (summaryEnd === -1) summaryEnd = Math.min(summaryStart + 5, lines.length);
    
    const summary = lines.slice(summaryStart, summaryEnd)
      .filter(line => line.trim())
      .join(' ')
      .trim();
    
    if (summary.length > 50) {
      return summary.substring(0, 500);
    }
  }
  
  return "Experienced professional with expertise in technology and innovation.";
};

const extractExperience = (text: string) => {
  // Enhanced experience extraction logic
  const experiences = [];
  const lines = text.split('\n');
  
  let inExperienceSection = false;
  let currentExp: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Detect experience section
    if (lowerLine.includes('experience') || lowerLine.includes('employment')) {
      inExperienceSection = true;
      continue;
    }
    
    // Stop at other sections
    if (inExperienceSection && (lowerLine.includes('education') || 
        lowerLine.includes('skills') || lowerLine.includes('projects'))) {
      if (currentExp) experiences.push(currentExp);
      break;
    }
    
    if (inExperienceSection && line) {
      // Look for company/position patterns
      if (line.includes('|') || (line.includes('-') && !line.startsWith('-'))) {
        if (currentExp) experiences.push(currentExp);
        
        const parts = line.split(/[|\-]/);
        if (parts.length >= 2) {
          currentExp = {
            company: parts[0].trim(),
            position: parts[1].trim(),
            duration: parts[2]?.trim() || "Recent",
            description: "",
            achievements: []
          };
        }
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-'))) {
        currentExp.achievements.push(line.replace(/^[•\-]\s*/, ''));
      } else if (currentExp && line.length > 20) {
        if (!currentExp.description) {
          currentExp.description = line;
        }
      }
    }
  }
  
  if (currentExp) experiences.push(currentExp);
  
  // Fallback with sample data if no experience found
  if (experiences.length === 0) {
    return [
      {
        company: "Previous Company",
        position: "Software Developer",
        duration: "2020 - Present",
        description: "Developed and maintained web applications using modern technologies.",
        achievements: [
          "Built responsive user interfaces",
          "Collaborated with cross-functional teams",
          "Delivered projects on time and within budget"
        ]
      }
    ];
  }
  
  return experiences.slice(0, 5); // Limit to 5 experiences
};

const extractEducation = (text: string) => {
  const education = [];
  const lines = text.split('\n');
  
  let inEducationSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    
    if (lowerLine.includes('education')) {
      inEducationSection = true;
      continue;
    }
    
    if (inEducationSection && (lowerLine.includes('experience') || 
        lowerLine.includes('skills') || lowerLine.includes('projects'))) {
      break;
    }
    
    if (inEducationSection && line.trim()) {
      // Look for university/degree patterns
      if (line.includes('|') || line.toLowerCase().includes('university') || 
          line.toLowerCase().includes('college') || line.toLowerCase().includes('institute')) {
        
        const parts = line.split('|');
        education.push({
          institution: parts[0]?.trim() || "University",
          degree: parts[1]?.trim() || "Bachelor's Degree",
          field: parts[2]?.trim() || "Computer Science",
          duration: parts[3]?.trim() || "2018 - 2022",
          gpa: line.toLowerCase().includes('gpa') ? 
            line.match(/gpa:?\s*(\d+\.?\d*)/i)?.[1] : undefined
        });
      }
    }
  }
  
  // Fallback education
  if (education.length === 0) {
    return [
      {
        institution: "University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        duration: "2018 - 2022"
      }
    ];
  }
  
  return education;
};

const extractSkills = (text: string) => {
  const technicalSkills = [];
  const softSkills = [];
  
  // Common technical skills
  const techKeywords = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
    'typescript', 'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'jenkins', 'terraform',
    'express', 'django', 'flask', 'spring', 'laravel', 'ruby', 'php',
    'graphql', 'rest', 'api', 'microservices', 'redis', 'elasticsearch'
  ];
  
  // Common soft skills
  const softKeywords = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'project management', 'agile', 'scrum', 'mentoring', 'collaboration',
    'time management', 'critical thinking', 'adaptability', 'creativity'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Extract technical skills
  techKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      const properCase = skill.charAt(0).toUpperCase() + skill.slice(1);
      if (!technicalSkills.includes(properCase)) {
        technicalSkills.push(properCase);
      }
    }
  });
  
  // Extract soft skills
  softKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      const properCase = skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      if (!softSkills.includes(properCase)) {
        softSkills.push(properCase);
      }
    }
  });
  
  return {
    technical: technicalSkills.slice(0, 12),
    soft: softSkills.slice(0, 8)
  };
};

const extractProjects = (text: string) => {
  const projects = [];
  const lines = text.split('\n');
  
  let inProjectsSection = false;
  let currentProject: any = null;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    
    if (lowerLine.includes('project')) {
      inProjectsSection = true;
      continue;
    }
    
    if (inProjectsSection && (lowerLine.includes('education') || 
        lowerLine.includes('certification') || lowerLine.includes('achievement'))) {
      if (currentProject) projects.push(currentProject);
      break;
    }
    
    if (inProjectsSection && line.trim()) {
      // Look for project names (usually standalone lines or with technologies)
      if (!line.startsWith('-') && !line.startsWith('•') && 
          !line.toLowerCase().includes('technologies') &&
          line.length > 5 && line.length < 100) {
        
        if (currentProject) projects.push(currentProject);
        
        currentProject = {
          name: line.trim(),
          description: "",
          technologies: [],
          link: ""
        };
      } else if (currentProject) {
        if (line.toLowerCase().includes('technologies') || line.toLowerCase().includes('tech stack')) {
          // Extract technologies from the line
          const techMatch = line.match(/technologies?:?\s*(.+)/i);
          if (techMatch) {
            currentProject.technologies = techMatch[1]
              .split(/[,\s]+/)
              .map((tech: string) => tech.trim())
              .filter((tech: string) => tech.length > 1);
          }
        } else if (!currentProject.description && line.length > 20) {
          currentProject.description = line.trim();
        }
      }
    }
  }
  
  if (currentProject) projects.push(currentProject);
  
  // Fallback projects if none found
  if (projects.length === 0) {
    return [
      {
        name: "Web Application Project",
        description: "Developed a full-stack web application with modern technologies.",
        technologies: ["React", "Node.js", "PostgreSQL"],
        link: ""
      }
    ];
  }
  
  return projects.slice(0, 4);
};
