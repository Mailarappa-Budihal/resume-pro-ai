import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker with better error handling
const configurePDFWorker = () => {
  try {
    // Use a more reliable CDN for the worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  } catch (error) {
    console.warn('Could not configure PDF worker:', error);
    // Fallback to unpkg
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }
};

// Initialize PDF worker
configurePDFWorker();

// Improved PDF text extraction with better text positioning
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF text extraction for:', file.name);
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('PDF file loaded, size:', arrayBuffer.byteLength, 'bytes');
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      useSystemFonts: true,
      standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/',
    });
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 15);
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        console.log(`Processing page ${pageNum}/${maxPages}`);
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false
        });
        
        // Better text extraction with positioning
        const textItems = textContent.items
          .filter((item: any) => item.str && item.str.trim().length > 0)
          .sort((a: any, b: any) => {
            // Sort by Y position (top to bottom), then X position (left to right)
            const yDiff = Math.abs(b.transform[5] - a.transform[5]);
            if (yDiff > 5) return b.transform[5] - a.transform[5];
            return a.transform[4] - b.transform[4];
          });
        
        let pageText = '';
        let lastY = null;
        
        for (const item of textItems) {
          const currentY = Math.round(item.transform[5]);
          const text = item.str.trim();
          
          if (text.length === 0) continue;
          
          // Add line break if we're on a significantly different Y position
          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            pageText += '\n';
          }
          
          pageText += text + ' ';
          lastY = currentY;
        }
        
        if (pageText.trim()) {
          fullText += pageText.trim() + '\n\n';
        }
        
        console.log(`Page ${pageNum} extracted ${pageText.length} characters`);
        
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${pageNum}:`, pageError);
        continue;
      }
    }
    
    // Clean up the extracted text
    fullText = fullText
      .replace(/\s{3,}/g, ' ') // Replace multiple spaces
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .trim();
    
    console.log('Total extracted text length:', fullText.length);
    console.log('Text preview:', fullText.substring(0, 300) + '...');
    
    if (fullText.length < 100) {
      throw new Error('Insufficient text extracted. The PDF might be image-based, corrupted, or contain very little text content.');
    }
    
    return fullText;
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('worker')) {
        throw new Error('PDF processing failed. Please try refreshing the page or use a different PDF file.');
      } else if (error.message.includes('Invalid PDF')) {
        throw new Error('The file appears to be corrupted or not a valid PDF. Please try a different file.');
      } else if (error.message.includes('Insufficient text')) {
        throw new Error('Could not extract enough text from the PDF. This might be a scanned document or image-based PDF. Please try a text-based PDF or DOCX file instead.');
      }
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
    
    throw new Error('Failed to process PDF file. Please try a different file or format.');
  }
};

// Enhanced DOCX text extraction with better formatting
const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    console.log('Starting DOCX text extraction for:', file.name);
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('DOCX file loaded, size:', arrayBuffer.byteLength, 'bytes');
    
    const result = await mammoth.extractRawText({ 
      arrayBuffer,
      options: {
        includeDefaultStyleMap: true
      }
    });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX extraction warnings:', result.messages);
    }
    
    let text = result.value
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s{3,}/g, ' ')
      .trim();
    
    console.log('DOCX extracted text length:', text.length);
    console.log('Text preview:', text.substring(0, 300) + '...');
    
    if (text.length < 100) {
      throw new Error('Insufficient text extracted from DOCX. The file might be empty, corrupted, or contain mostly images.');
    }
    
    return text;
    
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const extractResumeData = async (file: File) => {
  console.log('=== Starting Resume Data Extraction ===');
  console.log('File details:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
  });
  
  let resumeText: string;
  
  try {
    // Extract text based on file type
    if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
      console.log('Processing as PDF file...');
      resumeText = await extractTextFromPDF(file);
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      console.log('Processing as DOCX file...');
      resumeText = await extractTextFromDOCX(file);
    } else {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF or DOCX file.`);
    }
    
    if (!resumeText || resumeText.trim().length < 100) {
      throw new Error('Could not extract sufficient text from the document. Please ensure the file contains readable text content and try again.');
    }
    
    console.log('=== Text Extraction Successful ===');
    console.log('Extracted text length:', resumeText.length);
    
    // Parse the extracted text into structured data with improved algorithms
    console.log('=== Starting Data Parsing ===');
    
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
    
    console.log('=== Data Extraction Complete ===');
    console.log('Successfully extracted profile data:', {
      name: extractedData.personalInfo.name,
      email: extractedData.personalInfo.email,
      experienceCount: extractedData.experience.length,
      educationCount: extractedData.education.length,
      technicalSkills: extractedData.skills.technical.length,
      projectsCount: extractedData.projects.length
    });
    
    return extractedData;
    
  } catch (error) {
    console.error('=== Resume Extraction Failed ===');
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred while processing your resume. Please try again with a different file.');
  }
};

// Improved name extraction with better patterns
const extractName = (text: string): string => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Try to find name in the first few lines
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    
    // Skip obvious non-names
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('curriculum') ||
        line.toLowerCase().includes('cv') ||
        line.includes('@') || 
        line.includes('(') || 
        line.includes('http') ||
        line.includes('www.') ||
        /^\d/.test(line) ||
        line.length < 3 || 
        line.length > 50) {
      continue;
    }
    
    // Enhanced name pattern
    const namePattern = /^[A-Za-z][A-Za-z\s\-'\.]{2,49}$/;
    if (namePattern.test(line)) {
      const words = line.split(/\s+/).filter(word => word.length > 0);
      if (words.length >= 2 && words.length <= 4) {
        // Check if all words look like name parts
        const validNameWords = words.every(word => 
          /^[A-Za-z][A-Za-z\-'\.]*$/.test(word) && 
          word.length >= 2 && 
          word.length <= 20
        );
        if (validNameWords) {
          return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }
      }
    }
  }
  
  // Try pattern matching in the entire first section
  const firstSection = lines.slice(0, 15).join(' ');
  const nameMatches = firstSection.match(/\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g);
  
  if (nameMatches && nameMatches.length > 0) {
    for (const match of nameMatches) {
      if (match.length <= 50 && !match.toLowerCase().includes('resume')) {
        return match;
      }
    }
  }
  
  return "Name Not Found";
};

const extractEmail = (text: string): string => {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailPattern);
  return matches && matches.length > 0 ? matches[0] : "email@example.com";
};

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

const extractTitle = (text: string): string => {
  const titleKeywords = [
    'developer', 'engineer', 'analyst', 'manager', 'designer', 'consultant', 
    'specialist', 'lead', 'senior', 'junior', 'architect', 'director', 
    'coordinator', 'administrator', 'programmer', 'technician', 'supervisor', 
    'executive', 'scientist', 'researcher', 'associate', 'intern', 'trainee'
  ];
  
  const lines = text.split('\n').map(line => line.trim());
  
  // Look for title near the top of the resume
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip name line and contact info
    if (line.includes('@') || line.includes('(') || line.includes('http') || line.length < 10) {
      continue;
    }
    
    // Check if line contains title keywords
    const hasKeyword = titleKeywords.some(keyword => lowerLine.includes(keyword));
    
    if (hasKeyword && line.length < 80 && line.length > 5) {
      // Clean up the title
      let title = line.replace(/[^\w\s\-]/g, '').trim();
      if (title.length > 5 && title.length < 60) {
        return title;
      }
    }
  }
  
  return "Professional Title Not Found";
};

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
      return summary.substring(0, 500);
    }
  }
  
  return "Professional summary not found in resume";
};

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

const extractSkills = (text: string) => {
  const lowerText = text.toLowerCase();
  
  const techSkillsFound = [];
  const softSkillsFound = [];
  
  const techSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
    'typescript', 'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'jenkins', 'terraform',
    'express', 'django', 'flask', 'spring', 'laravel', 'ruby', 'php',
    'graphql', 'rest', 'api', 'microservices', 'redis', 'elasticsearch',
    'flutter', 'swift', 'kotlin', 'c++', 'c#', 'golang', 'rust',
    'figma', 'photoshop', 'illustrator', 'sketch', 'tableau', 'powerbi'
  ];
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'project management', 'agile', 'scrum', 'mentoring', 'collaboration',
    'time management', 'critical thinking', 'adaptability', 'creativity',
    'strategic planning', 'negotiation', 'presentation', 'customer service'
  ];
  
  techSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      const properCase = skill.charAt(0).toUpperCase() + skill.slice(1);
      if (!techSkillsFound.includes(properCase)) {
        techSkillsFound.push(properCase);
      }
    }
  });
  
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

// Portfolio generation with preview functionality
export const generatePortfolio = async (profileData: any, template: string, targetRole: string = '') => {
  console.log('Generating portfolio with template:', template);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const portfolioContent = generatePortfolioContent(profileData, template, targetRole);
  
  return {
    html: portfolioContent.html,
    css: portfolioContent.css,
    previewUrl: createPreviewUrl(portfolioContent.html, portfolioContent.css)
  };
};

// Create a preview URL for the portfolio
const createPreviewUrl = (html: string, css: string): string => {
  const fullHtml = html.replace('</head>', `<style>${css}</style></head>`);
  const blob = new Blob([fullHtml], { type: 'text/html' });
  return URL.createObjectURL(blob);
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
    <title>${personalInfo.name} - Professional Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="${template}-template">
    <!-- Header Section -->
    <header class="hero-section">
        <div class="container">
            <div class="hero-content">
                <div class="profile-section">
                    <div class="avatar">
                        ${personalInfo.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                    </div>
                    <h1 class="name">${personalInfo.name}</h1>
                    <h2 class="title">${personalInfo.title || 'Professional'}</h2>
                    <p class="summary">${roleOptimizedSummary}</p>
                </div>
                
                <div class="contact-grid">
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
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
                ${skills.technical.slice(0, 12).map(skill => `
                    <div class="skill-badge">${skill}</div>
                `).join('')}
            </div>
            
            ${skills.soft.length > 0 ? `
                <h3 class="subsection-title">Core Competencies</h3>
                <div class="soft-skills-list">
                    ${skills.soft.slice(0, 8).map(skill => `
                        <span class="soft-skill">${skill}</span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    </section>

    <!-- Experience Section -->
    <section class="experience-section">
        <div class="container">
            <h2 class="section-title">Professional Experience</h2>
            <div class="timeline">
                ${experience.map((exp, index) => `
                    <div class="timeline-item ${index === 0 ? 'current' : ''}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="experience-header">
                                <h3 class="position">${exp.position}</h3>
                                <h4 class="company">${exp.company}</h4>
                                <span class="duration">${exp.duration}</span>
                            </div>
                            ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                            ${exp.achievements.length > 0 ? `
                                <ul class="achievements">
                                    ${exp.achievements.slice(0, 5).map(achievement => `
                                        <li>${achievement}</li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    ${projects.length > 0 && projects[0].name !== 'Projects not found' ? `
        <section class="projects-section">
            <div class="container">
                <h2 class="section-title">Featured Projects</h2>
                <div class="projects-grid">
                    ${projects.slice(0, 6).map(project => `
                        <div class="project-card">
                            <div class="project-header">
                                <h3 class="project-name">${project.name}</h3>
                                ${project.link ? `
                                    <a href="${project.link}" class="project-link" target="_blank">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                ` : ''}
                            </div>
                            <p class="project-description">${project.description}</p>
                            ${project.technologies.length > 0 ? `
                                <div class="project-tech">
                                    ${project.technologies.slice(0, 5).map(tech => `
                                        <span class="tech-tag">${tech}</span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    ` : ''}

    <!-- Education Section -->
    <section class="education-section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-grid">
                ${education.map(edu => `
                    <div class="education-card">
                        <h3 class="degree">${edu.degree}</h3>
                        <h4 class="field">${edu.field}</h4>
                        <p class="institution">${edu.institution}</p>
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
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.name}. All rights reserved.</p>
            <p class="tagline">Portfolio generated with AI-powered resume analysis</p>
        </div>
    </footer>

    <script>
        // Add smooth scrolling and animations
        document.addEventListener('DOMContentLoaded', function() {
            // Animate elements on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('.timeline-item, .project-card, .education-card, .skill-badge').forEach(el => {
                observer.observe(el);
            });
        });
    </script>
</body>
</html>`;

  const css = generateTemplateCSS(template);
  
  return { html, css };
};

const generateTemplateCSS = (template: string) => {
  const baseColors = {
    modern: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#EFF6FF' },
    creative: { primary: '#EC4899', secondary: '#BE185D', accent: '#FDF2F8' },
    executive: { primary: '#1F2937', secondary: '#374151', accent: '#F9FAFB' },
    startup: { primary: '#10B981', secondary: '#047857', accent: '#ECFDF5' }
  };
  
  const colors = baseColors[template] || baseColors.modern;
  
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
    color: #374151;
    background: #FFFFFF;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    color: white;
    padding: 80px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin: 0 auto 24px;
    border: 3px solid rgba(255,255,255,0.3);
}

.name {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title {
    font-size: 24px;
    margin-bottom: 24px;
    opacity: 0.9;
    font-weight: 500;
}

.summary {
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto 40px;
    line-height: 1.7;
    opacity: 0.95;
}

.contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.contact-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.2);
}

.contact-item i {
    font-size: 18px;
    opacity: 0.8;
}

/* Section Styles */
section {
    padding: 80px 0;
}

.section-title {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 50px;
    color: #1F2937;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: ${colors.primary};
    border-radius: 2px;
}

/* Skills Section */
.skills-section {
    background: ${colors.accent};
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 40px;
}

.skill-badge {
    padding: 12px 20px;
    background: white;
    color: ${colors.primary};
    border-radius: 25px;
    text-align: center;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border: 2px solid ${colors.primary}20;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
}

.skill-badge.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.skill-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.subsection-title {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 30px;
    color: #374151;
}

.soft-skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
}

.soft-skill {
    padding: 8px 16px;
    background: white;
    color: ${colors.secondary};
    border: 1px solid ${colors.primary}30;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
}

/* Experience Section */
.timeline {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${colors.primary}30;
}

.timeline-item {
    margin-bottom: 50px;
    position: relative;
    padding-left: 80px;
    opacity: 0;
    transform: translateX(-30px);
}

.timeline-item.animate-in {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.6s ease;
}

.timeline-marker {
    position: absolute;
    left: 20px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.primary};
    border: 4px solid white;
    box-shadow: 0 0 0 4px ${colors.primary}20;
}

.timeline-item.current .timeline-marker {
    background: ${colors.secondary};
    box-shadow: 0 0 0 4px ${colors.secondary}30;
}

.timeline-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border-left: 4px solid ${colors.primary};
}

.experience-header {
    margin-bottom: 20px;
}

.position {
    font-size: 22px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 5px;
}

.company {
    font-size: 18px;
    color: ${colors.primary};
    font-weight: 500;
    margin-bottom: 10px;
}

.duration {
    display: inline-block;
    background: ${colors.primary};
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
}

.description {
    margin-bottom: 15px;
    color: #6B7280;
    line-height: 1.6;
}

.achievements {
    list-style: none;
}

.achievements li {
    padding: 6px 0;
    position: relative;
    padding-left: 25px;
    color: #374151;
}

.achievements li::before {
    content: '▶';
    position: absolute;
    left: 0;
    color: ${colors.primary};
    font-size: 12px;
}

/* Projects Section */
.projects-section {
    background: #F9FAFB;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
}

.project-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(30px);
}

.project-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.project-name {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
}

.project-link {
    color: ${colors.primary};
    text-decoration: none;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.2s ease;
}

.project-link:hover {
    background: ${colors.accent};
}

.project-description {
    color: #6B7280;
    margin-bottom: 20px;
    line-height: 1.6;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tech-tag {
    padding: 4px 12px;
    background: ${colors.accent};
    color: ${colors.primary};
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
}

/* Education Section */
.education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 800px;
    margin: 0 auto;
}

.education-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
    border-left: 4px solid ${colors.primary};
    opacity: 0;
    transform: translateY(20px);
}

.education-card.animate-in {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.5s ease;
}

.degree {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 5px;
}

.field {
    font-size: 16px;
    color: ${colors.primary};
    font-weight: 500;
    margin-bottom: 10px;
}

.institution {
    color: #6B7280;
    margin-bottom: 10px;
}

.duration, .gpa {
    font-size: 14px;
    color: ${colors.secondary};
    font-weight: 500;
}

/* Footer */
.footer {
    background: #1F2937;
    color: white;
    text-align: center;
    padding: 40px 0;
}

.tagline {
    opacity: 0.7;
    font-size: 14px;
    margin-top: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .name { font-size: 36px; }
    .title { font-size: 20px; }
    .summary { font-size: 16px; }
    
    .contact-grid {
        grid-template-columns: 1fr;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
    
    .timeline {
        padding-left: 0;
    }
    
    .timeline::before {
        left: 15px;
    }
    
    .timeline-item {
        padding-left: 50px;
    }
    
    .timeline-marker {
        left: 5px;
    }
}

/* Animation delays for staggered effect */
.skill-badge:nth-child(1) { transition-delay: 0.1s; }
.skill-badge:nth-child(2) { transition-delay: 0.2s; }
.skill-badge:nth-child(3) { transition-delay: 0.3s; }
.skill-badge:nth-child(4) { transition-delay: 0.4s; }
.skill-badge:nth-child(5) { transition-delay: 0.5s; }
.skill-badge:nth-child(6) { transition-delay: 0.6s; }

.project-card:nth-child(1) { transition-delay: 0.1s; }
.project-card:nth-child(2) { transition-delay: 0.2s; }
.project-card:nth-child(3) { transition-delay: 0.3s; }

.timeline-item:nth-child(1) { transition-delay: 0.1s; }
.timeline-item:nth-child(2) { transition-delay: 0.3s; }
.timeline-item:nth-child(3) { transition-delay: 0.5s; }
`;
};
