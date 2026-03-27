import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import "./Projects.css";

const PROJECTS = [
  {
    id: '01',
    title: 'Tariff Calculator',
    subtitle: 'Cloud-ready full-stack system',
    description: 'Developed a full-stack tariff calculation platform using React and Spring Boot microservices. Built scalable REST APIs and containerised services with Docker.',
    year: '2025',
    images: [],
    stack: [
      { label: 'Frontend', pills: ['React'] },
      { label: 'Backend', pills: ['Java', 'Spring Boot'] },
      { label: 'DevOps', pills: ['Docker', 'AWS'] },
    ],
    link: null,
    wip: false,
    featured: true,
    chefSpecial: true,
  },
  {
    id: '02',
    title: 'Plotwise',
    subtitle: 'Event decoration visualisation mobile app',
    description: 'Built a mobile app using Expo to help users visualise decorations in their own spaces.',
    year: '2026',
    images: [],
    stack: [
      { label: 'Frontend', pills: ['React Native', 'Expo'] },
      { label: 'Backend', pills: ['JavaScript'] },
    ],
    link: null,
    wip: true,
  },
  {
    id: '03',
    title: 'EntrepreNO',
    subtitle: 'Telegram bot for filtering spammy outreach on LinkedIn',
    description: 'Built a Telegram bot to analyse LinkedIn connection requests and messages, flagging spammy or low-signal outreach using rule-based filtering and text heuristics.',
    year: '2026',
    images: [],
    stack: [
      { label: 'Backend', pills: ['Python'] },
      { label: 'Tools', pills: ['Telegram Bot API'] },
    ],
    link: null,
    wip: false,
  },
  {
    id: '04',
    title: 'NASA Space Apps Challenge',
    subtitle: 'AirQ — location-based air quality monitoring',
    description: 'Built a full-stack app integrating NASA TEMPO APIs, ground sensors, and weather datasets into a unified pipeline with a geospatial dashboard.',
    year: '2025',
    images: [
      '/img/project4-1.jpg',
      '/img/project4-2.jpg',
      '/img/project4-3.jpg',
    ],
    stack: [
      { label: 'Frontend', pills: ['React'] },
      { label: 'Backend', pills: ['Node.js', 'SQLite'] },
    ],
    link: null,
    wip: false,
  },
  {
    id: '05',
    title: 'QAI Ventures Hackathon',
    subtitle: 'Quantum + ML fraud detection',
    description: 'Explored fraud detection using quantum computing and machine learning with Qiskit, focusing on feasibility and real-world applications.',
    year: '2025',
    images: [],
    stack: [
      { label: 'Tech', pills: ['Python', 'Qiskit', 'Machine Learning'] },
    ],
    link: null,
    wip: false,
  },
  {
    id: '06',
    title: 'Portfolio Website',
    subtitle: 'This very site',
    description: 'A brunch-themed personal portfolio with interactive menu UI and editorial typography.',
    year: '2026',
    images: [],
    stack: [
      { label: 'Frontend', pills: ['React'] },
    ],
    link: null,
    wip: false,
  },
  {
    id: '07',
    title: 'NUS Health Hack 2025',
    subtitle: 'Surgipedia — surgical media transcription',
    description: 'Designed a speech-to-text and image-to-text mockup for surgical research workflows.',
    year: '2025',
    images: [
      '/img/project1-1.jpg',
      '/img/project1-2.jpg',
      '/img/project1-3.jpg',
      '/img/project1-4.jpg',
      '/img/project1-5.jpg',
    ],
    stack: [
      { label: 'Frontend', pills: ['Figma', 'React', 'Tailwind CSS'] },
      { label: 'Backend', pills: ['Deno'] },
    ],
    link: null,
    wip: false,
  },
];

export default function Projects() {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <section
      id="projects"
      className="projectsSection"
    >
      <div className="projectsInner">
        <div
          className="projectsMenuFrame"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/menu.jpg)`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <header className="projectsHeader">
            <p className="projectsEyebrow">Elodie Yeung · 2026</p>
            <div className="projectsTitleRow">
              <span className="projectsTitleRule" />
              <h2 className="projectsTitle">Chef's Specialties</h2>
              <span className="projectsTitleRule" />
            </div>
            <p className="projectsSubtitle">a curated selection of recent work</p>
          </header>

          <div className="menuList">
            {PROJECTS.map(project => {
              const isOpen = expandedId === project.id;
              return (
                <article key={project.id} className={`menuItem${isOpen ? ' isOpen' : ''}`}>
                  <button
                    className="menuItemHeader"
                    onClick={() => toggle(project.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="menuItemNumber">{project.id}</span>
                    <span className="menuItemTitleGroup">
                      {project.foodIcon && (
                        <img src={project.foodIcon} alt="" className="menuItemIcon" aria-hidden="true" />
                      )}
                      <span className="menuItemTitle">{project.title}</span>
                      {project.wip && <span className="menuItemWip">In progress</span>}
                    </span>
                    <span className="menuItemLeader" aria-hidden="true" />
                    <span className="menuItemYear">{project.year}</span>
                    <span className="menuItemChevron">{isOpen ? '−' : '+'}</span>
                  </button>

                  <p className="menuItemSubtitle">{project.subtitle}</p>

                  <div className={`menuItemBody${isOpen ? ' isVisible' : ''}`}>
                    <p className="menuItemDesc">{project.description}</p>
                    <div className="menuItemMeta">
                      <div className="menuItemStack">
                        {project.stack.map(row => (
                          <div key={row.label} className="menuItemStackRow">
                            <span className="menuItemStackLabel">{row.label}</span>
                            {row.pills.map(p => (
                              <span key={p} className="menuItemPill">{p}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                      {project.link && (
                        project.link.kind === 'route'
                          ? <Link to={project.link.href} className="menuItemLink">{project.link.label} →</Link>
                          : <a href={project.link.href} target="_blank" rel="noopener noreferrer" className="menuItemLink">{project.link.label} →</a>
                      )}
                    </div>
                    {project.images.length > 0 && (
                      <ImageCarousel images={project.images} alt={project.title} />
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="projectsFooter">more dishes coming soon</div>
        </div>
      </div>
    </section>
  );
}