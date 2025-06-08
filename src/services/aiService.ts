import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Real PDF text extraction using PDF.js
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('Extracting text from PDF:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    console.log('Extracted PDF text length:', fullText.length);
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Real DOCX text extraction using mammoth
const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    console.log('Extracting text from DOCX:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log('Extracted DOCX text length:', result.value.length);
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

export const extractResumeData = async (file: File) => {
  console.log('Starting resume data extraction for:', file.name);
  
  let resumeText: string;
  
  try {
    if (file.type.includes('pdf')) {
      resumeText = await extractTextFromPDF(file);
    } else if (file.name.endsWith('.docx')) {
      resumeText = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }
    
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from the document');
    }
    
    console.log('Extracted text preview:', resumeText.substring(0, 500));
    
    // Parse the extracted text into structured data
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
    console.error('Resume extraction failed:', error);
    throw error;
  }
};

// Enhanced name extraction
const extractName = (text: string): string => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    
    // Skip lines that are clearly not names
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('curriculum') ||
        line.includes('@') || 
        line.includes('(') || 
        line.includes('http') ||
        line.length < 3 || 
        line.length > 60) {
      continue;
    }
    
    // Check if line looks like a name
    const namePattern = /^[A-Za-z\s\-'\.]{3,50}$/;
    if (namePattern.test(line)) {
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        return line;
      }
    }
  }
  
  return "Name Not Found";
};

// Enhanced email extraction
const extractEmail = (text: string): string => {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailPattern);
  return matches && matches.length > 0 ? matches[0] : "email@example.com";
};

// Enhanced phone extraction
const extractPhone = (text: string): string => {
  const phonePatterns = [
    /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    /\+?[1-9]\d{1,14}/
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return "Phone Not Found";
};

// Enhanced location extraction
const extractLocation = (text: string): string => {
  const locationPatterns = [
    /([A-Za-z\s]+),\s*([A-Z]{2})\b/,
    /([A-Za-z\s]+),\s*([A-Za-z\s]+)/
  ];
  
  for (const pattern of locationPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      const location = matches[0];
      if (location.length < 50 && !location.includes('@')) {
        return location;
      }
    }
  }
  
  return "Location Not Found";
};

// Enhanced title extraction
const extractTitle = (text: string): string => {
  const titleKeywords = [
    'developer', 'engineer', 'analyst', 'manager', 'designer', 
    'consultant', 'specialist', 'lead', 'senior', 'junior',
    'architect', 'director', 'coordinator', 'administrator',
    'programmer', 'technician', 'supervisor', 'executive'
  ];
  
  const lines = text.split('\n').map(line => line.trim());
  
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if (titleKeywords.some(keyword => lowerLine.includes(keyword)) && 
        line.length < 100 && 
        !line.includes('@') &&
        !line.includes('(') &&
        !line.includes('http')) {
      return line;
    }
  }
  
  return "Professional Title Not Found";
};

// Enhanced summary extraction
const extractSummary = (text: string): string => {
  const summaryKeywords = ['summary', 'objective', 'profile', 'overview', 'about', 'introduction'];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let summaryStart = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (summaryKeywords.some(keyword => line.includes(keyword) && line.length < 50)) {
      summaryStart = i + 1;
      break;
    }
  }
  
  if (summaryStart !== -1) {
    let summaryEnd = summaryStart;
    for (let i = summaryStart; i < lines.length && i < summaryStart + 10; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('experience') || 
          line.includes('education') ||
          line.includes('skills') ||
          line.includes('employment')) {
        break;
      }
      if (lines[i].length > 20) {
        summaryEnd = i + 1;
      }
    }
    
    const summary = lines.slice(summaryStart, summaryEnd).join(' ').trim();
    if (summary.length > 50) {
      return summary.substring(0, 800);
    }
  }
  
  return "Professional summary not found in resume";
};

// Enhanced experience extraction
const extractExperience = (text: string) => {
  const experiences = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let inExperienceSection = false;
  let currentExp: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('experience') || lowerLine.includes('employment') || lowerLine.includes('work history')) {
      inExperienceSection = true;
      continue;
    }
    
    if (inExperienceSection && (lowerLine.includes('education') || 
        lowerLine.includes('skills') || lowerLine.includes('projects'))) {
      if (currentExp) experiences.push(currentExp);
      break;
    }
    
    if (inExperienceSection && line) {
      // Look for company/position patterns
      if (line.includes('|') || (line.includes('-') && !line.startsWith('-') && !line.startsWith('•'))) {
        if (currentExp) experiences.push(currentExp);
        
        const parts = line.split(/[|\-–]/);
        if (parts.length >= 2) {
          currentExp = {
            company: parts[0].trim(),
            position: parts[1].trim(),
            duration: parts[2]?.trim() || "Duration not specified",
            description: "",
            achievements: []
          };
        }
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        const achievement = line.replace(/^[•\-*]\s*/, '').trim();
        if (achievement.length > 10) {
          currentExp.achievements.push(achievement);
        }
      } else if (currentExp && line.length > 30 && !currentExp.description) {
        currentExp.description = line;
      }
    }
  }
  
  if (currentExp) experiences.push(currentExp);
  
  return experiences.length > 0 ? experiences.slice(0, 5) : [{
    company: "Experience not found",
    position: "Please update manually",
    duration: "N/A",
    description: "No work experience could be extracted from the resume",
    achievements: []
  }];
};

// Enhanced education extraction
const extractEducation = (text: string) => {
  const education = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let inEducationSection = false;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('education') || lowerLine.includes('academic')) {
      inEducationSection = true;
      continue;
    }
    
    if (inEducationSection && (lowerLine.includes('experience') || 
        lowerLine.includes('skills') || lowerLine.includes('projects'))) {
      break;
    }
    
    if (inEducationSection && line.trim()) {
      const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'diploma', 'certificate', 'degree'];
      const institutionKeywords = ['university', 'college', 'institute', 'school'];
      
      if (degreeKeywords.some(keyword => lowerLine.includes(keyword)) || 
          institutionKeywords.some(keyword => lowerLine.includes(keyword))) {
        
        const parts = line.split(/[|\-–]/);
        education.push({
          institution: parts[0]?.trim() || "Institution not specified",
          degree: parts[1]?.trim() || "Degree not specified",
          field: parts[2]?.trim() || "Field not specified",
          duration: parts[3]?.trim() || "Duration not specified",
          gpa: line.toLowerCase().includes('gpa') ? 
            line.match(/gpa:?\s*(\d+\.?\d*)/i)?.[1] : undefined
        });
      }
    }
  }
  
  return education.length > 0 ? education : [{
    institution: "Education not found",
    degree: "Please update manually",
    field: "N/A",
    duration: "N/A"
  }];
};

// Enhanced skills extraction
const extractSkills = (text: string) => {
  const lowerText = text.toLowerCase();
  
  const techSkillsFound = [];
  const softSkillsFound = [];
  
  // Comprehensive technical skills list
  const techSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
    'typescript', 'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'jenkins', 'terraform',
    'express', 'django', 'flask', 'spring', 'laravel', 'ruby', 'php',
    'graphql', 'rest', 'api', 'microservices', 'redis', 'elasticsearch',
    'flutter', 'swift', 'kotlin', 'c++', 'c#', 'golang', 'rust',
    'figma', 'photoshop', 'illustrator', 'sketch', 'tableau', 'powerbi'
  ];
  
  // Comprehensive soft skills list
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'project management', 'agile', 'scrum', 'mentoring', 'collaboration',
    'time management', 'critical thinking', 'adaptability', 'creativity',
    'strategic planning', 'negotiation', 'presentation', 'customer service'
  ];
  
  // Extract technical skills
  techSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      const properCase = skill.charAt(0).toUpperCase() + skill.slice(1);
      if (!techSkillsFound.includes(properCase)) {
        techSkillsFound.push(properCase);
      }
    }
  });
  
  // Extract soft skills
  softSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      const properCase = skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      if (!softSkillsFound.includes(properCase)) {
        softSkillsFound.push(properCase);
      }
    }
  });
  
  return {
    technical: techSkillsFound.length > 0 ? techSkillsFound.slice(0, 15) : ['Skills not found'],
    soft: softSkillsFound.length > 0 ? softSkillsFound.slice(0, 10) : ['Soft skills not found']
  };
};

// Enhanced projects extraction
const extractProjects = (text: string) => {
  const projects = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let inProjectsSection = false;
  let currentProject: any = null;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('project') && lowerLine.length < 50) {
      inProjectsSection = true;
      continue;
    }
    
    if (inProjectsSection && (lowerLine.includes('education') || 
        lowerLine.includes('certification') || lowerLine.includes('achievement'))) {
      if (currentProject) projects.push(currentProject);
      break;
    }
    
    if (inProjectsSection && line.trim()) {
      if (!line.startsWith('-') && !line.startsWith('•') && 
          !line.toLowerCase().includes('technologies') &&
          line.length > 10 && line.length < 100) {
        
        if (currentProject) projects.push(currentProject);
        
        currentProject = {
          name: line.trim(),
          description: "",
          technologies: [],
          link: ""
        };
      } else if (currentProject) {
        if (line.toLowerCase().includes('technologies') || line.toLowerCase().includes('tech stack')) {
          const techMatch = line.match(/technologies?:?\s*(.+)/i);
          if (techMatch) {
            currentProject.technologies = techMatch[1]
              .split(/[,\s]+/)
              .map((tech: string) => tech.trim())
              .filter((tech: string) => tech.length > 1 && tech.length < 20);
          }
        } else if (!currentProject.description && line.length > 20) {
          currentProject.description = line.trim();
        }
      }
    }
  }
  
  if (currentProject) projects.push(currentProject);
  
  return projects.length > 0 ? projects.slice(0, 6) : [{
    name: "Projects not found",
    description: "No projects could be extracted from the resume",
    technologies: [],
    link: ""
  }];
};

// Portfolio generation function
export const generatePortfolio = async (profileData: any, template: string, targetRole: string = '') => {
  console.log('Generating portfolio with template:', template);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const portfolioContent = generatePortfolioContent(profileData, template, targetRole);
  
  return {
    html: portfolioContent.html,
    css: portfolioContent.css
  };
};

const generatePortfolioContent = (profileData: any, template: string, targetRole: string) => {
  const { personalInfo, experience, education, skills, projects } = profileData;
  
  const roleOptimizedSummary = targetRole 
    ? `${personalInfo.summary} Currently seeking opportunities as a ${targetRole} to leverage my expertise and drive innovation.`
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

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${personalInfo.name}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

  const css = generateTemplateCSS(template);
  
  return { html, css };
};

const generateTemplateCSS = (template: string) => {
  // Base CSS styles for the portfolio
  return `
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

.hero-section {
    padding: 80px 0;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 600;
    color: white;
    margin: 0 auto 30px;
}

.name {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 10px;
}

.title {
    font-size: 24px;
    margin-bottom: 30px;
    opacity: 0.9;
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
}

section {
    padding: 80px 0;
}

.section-title {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 50px;
    color: #333;
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 40px;
}

.skill-tag {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 25px;
    text-align: center;
    font-weight: 500;
}

.soft-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.soft-skill {
    padding: 8px 16px;
    background: #f8f9ff;
    color: #667eea;
    border: 1px solid #667eea;
    border-radius: 20px;
    font-size: 14px;
}

.timeline {
    max-width: 800px;
    margin: 0 auto;
}

.timeline-item {
    margin-bottom: 40px;
    padding: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.position {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
}

.company {
    font-size: 18px;
    color: #667eea;
    margin-bottom: 10px;
}

.duration {
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
}

.achievements {
    list-style: none;
    margin-top: 15px;
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
    color: #667eea;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.project-card {
    padding: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-name {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 20px 0;
}

.tech-tag {
    padding: 4px 12px;
    background: #e1e8ff;
    color: #667eea;
    border-radius: 15px;
    font-size: 12px;
}

.education-list {
    max-width: 600px;
    margin: 0 auto;
}

.education-item {
    padding: 25px;
    background: white;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
    border-left: 4px solid #667eea;
}

.degree {
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.institution {
    color: #667eea;
    font-weight: 500;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 40px 0;
}

@media (max-width: 768px) {
    .name { font-size: 32px; }
    .contact-info { flex-direction: column; gap: 15px; }
    .projects-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); }
}
`;
};
