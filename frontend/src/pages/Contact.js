// src/pages/Contact.js
import React from 'react';
import '../styles/contact.css';

const Contact = () => {
  const resumeUrl = "/path-to-your-resume.pdf"; // Add your resume file path

  const contactInfo = {
    email: "jsingh.lfc@gmail.com",
    github: "https://github.com/Jsingh-23",
    linkedin: "https://www.linkedin.com/in/jaskaranpal-s-831193183/",
  };

  const projects = [
    {
      title: "StrengthTracker",
      description: "Developed a Node.js web application that quantifies users' weightlifting progress by enabling them to log their workouts and visualize their performance via graphical representations.",
      technologies: ["Node.js", "NextAuth.js", "MongoDB", "TailwindCSS", "Bootstrap", "Chart.js"],
    },
    {
      title: "Supervised Classification Approach to Wildfire Mapping",
      description: "Demonstrated how supervised machine learning classifiers are viable for generating wildfire burn severity maps with 86% test data accuracy.",
      technologies: ["Python", "Pystac-client", "Machine Learning", "NASA SRTM", "gridMET"],
    },
    {
      title: "MovieRecommender",
      description: "Engineered a full-stack recommendation platform using React, Node.js, and Flask, implementing a content-based filtering system with TensorFlow that processes a dataset of 45,000+ movies.",
      technologies: ["React", "Node.js", "Flask", "TensorFlow", "Firebase", "Python"],
    },
    {
      title: "SneakerReview",
      description: "Deployed a Node.js and React web application allowing sneaker enthusiasts to share and review their favorite footwear.",
      technologies: ["Node.js", "React", "Express.js", "MongoDB", "Bootstrap"],
    },
  ];

  const skills = {
    languages: ["Java", "JavaScript", "Python", "TypeScript", "SQL", "HTML", "CSS", "MATLAB", "R/RStudio", "Spark"],
    frameworks: ["Node.js", "React", "Docker", "Tailwind", "Next.js", "Express.js", "D3", "Chart.js"],
    databases: ["PostgreSQL", "MongoDB", "Mongoose", "NoSQL"],
    cloudServices: ["AWS", "Firebase"],
    developerTools: ["Git", "Eclipse", "VS Code", "Visual Studio", "IntelliJ"],
  };

  return (
    <div className="contact-container">
      {/* Header Section */}
      <section className="contact-header">
        <h1 className="name">Jaskaranpal Singh</h1>
        <p className="title">Full Stack Software Developer</p>
        <div className="contact-links">
          <a href={`mailto:${contactInfo.email}`} className="contact-link">
            📧 {contactInfo.email}
          </a>
          <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="contact-link">
            💻 GitHub
          </a>
          <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
            👔 LinkedIn
          </a>
          {/* <a href={resumeUrl} download className="contact-link">
            📄 Download Resume
          </a> */}
        </div>
      </section>

      {/* Skills Section */}
      <section className="resume-section">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Languages</h3>
            <div className="skill-list">
              {skills.languages.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h3>Frameworks & Libraries</h3>
            <div className="skill-list">
              {skills.frameworks.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h3>Databases</h3>
            <div className="skill-list">
              {skills.databases.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h3>Cloud Services</h3>
            <div className="skill-list">
              {skills.cloudServices.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="skill-category">
            <h3>Developer Tools</h3>
            <div className="skill-list">
              {skills.developerTools.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="resume-section">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-technologies">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;