
// AI Service for resume data extraction and processing
export const extractResumeData = async (file: File) => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted data - in production, this would call your AI API
  return {
    personalInfo: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      title: "Senior Software Engineer",
      summary: "Passionate software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading teams and delivering high-quality software solutions at scale."
    },
    experience: [
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
      },
      {
        company: "Digital Agency Pro",
        position: "Frontend Developer",
        duration: "2019 - 2020",
        description: "Created pixel-perfect, responsive websites for clients using modern JavaScript frameworks.",
        achievements: [
          "Delivered 15+ client projects on time and within budget",
          "Improved site performance scores by 35% on average"
        ]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        duration: "2015 - 2019",
        gpa: "3.8/4.0"
      }
    ],
    skills: {
      technical: [
        "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", 
        "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Redis", 
        "GraphQL", "REST APIs", "Git", "Jenkins", "Terraform"
      ],
      soft: [
        "Team Leadership", "Project Management", "Problem Solving", 
        "Communication", "Mentoring", "Agile/Scrum", "Code Review"
      ]
    },
    projects: [
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
      },
      {
        name: "Weather Analytics Dashboard",
        description: "Data visualization dashboard for weather patterns using machine learning for predictions.",
        technologies: ["Python", "Flask", "D3.js", "TensorFlow", "PostgreSQL"]
      }
    ]
  };
};

export const generatePortfolio = async (profileData: any, template: string, targetRole?: string) => {
  // Simulate AI portfolio generation
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    html: generatePortfolioHTML(profileData, template),
    css: generatePortfolioCSS(template),
    assets: []
  };
};

const generatePortfolioHTML = (profileData: any, template: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profileData.personalInfo.name} - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="hero">
        <div class="container">
            <h1>${profileData.personalInfo.name}</h1>
            <h2>${profileData.personalInfo.title}</h2>
            <p>${profileData.personalInfo.summary}</p>
            <div class="contact">
                <span>${profileData.personalInfo.email}</span>
                <span>${profileData.personalInfo.phone}</span>
                <span>${profileData.personalInfo.location}</span>
            </div>
        </div>
    </header>
    
    <section class="experience">
        <div class="container">
            <h2>Experience</h2>
            ${profileData.experience.map((exp: any) => `
                <div class="experience-item">
                    <h3>${exp.position}</h3>
                    <h4>${exp.company}</h4>
                    <span class="duration">${exp.duration}</span>
                    <p>${exp.description}</p>
                    <ul>
                        ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    </section>
    
    <section class="skills">
        <div class="container">
            <h2>Skills</h2>
            <div class="skill-category">
                <h3>Technical Skills</h3>
                <div class="skill-tags">
                    ${profileData.skills.technical.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
    </section>
    
    <section class="projects">
        <div class="container">
            <h2>Projects</h2>
            ${profileData.projects.map((project: any) => `
                <div class="project-item">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    ${project.link ? `<a href="${project.link}" target="_blank">View Project</a>` : ''}
                </div>
            `).join('')}
        </div>
    </section>
</body>
</html>`;
};

const generatePortfolioCSS = (template: string) => {
  return `
/* ${template} Template Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 100px 0;
    text-align: center;
}

.hero h1 {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.hero h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
    font-weight: 300;
}

.hero p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0.9;
}

.contact {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.contact span {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 25px;
    backdrop-filter: blur(10px);
}

section {
    padding: 80px 0;
}

section:nth-child(even) {
    background: #f8f9fa;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-align: center;
    color: #2c3e50;
}

.experience-item, .project-item {
    background: white;
    padding: 2rem;
    margin-bottom: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.experience-item:hover, .project-item:hover {
    transform: translateY(-5px);
}

.experience-item h3, .project-item h3 {
    color: #667eea;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.experience-item h4 {
    color: #764ba2;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.duration {
    background: #e9ecef;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.9rem;
    color: #6c757d;
}

.skill-tags, .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.skill-tag, .tech-tag {
    background: #667eea;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: transform 0.2s ease;
}

.skill-tag:hover, .tech-tag:hover {
    transform: scale(1.05);
}

.tech-tag {
    background: #764ba2;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2.5rem;
    }
    
    .contact {
        flex-direction: column;
        gap: 1rem;
    }
    
    .contact span {
        display: block;
        text-align: center;
    }
}
`;
};
