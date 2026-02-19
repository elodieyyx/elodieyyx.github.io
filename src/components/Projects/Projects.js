import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import "./Projects.css";

const PROJECTS = [
  {
    id: '01',
    title: 'NASA Space Apps Challenge',
    subtitle: 'AirQ — location-based air quality monitoring',
    description: 'Integrates NASA\'s TEMPO satellite data with ground measurements and weather information. Users can select their location to view real-time pollution levels and track air quality trends.',
    year: '2025',
    images: [
      '/img/project4-1.jpg',
      '/img/project4-2.jpg',
      '/img/project4-3.jpg',
    ],
    stack: [
      { label: 'Frontend', pills: ['React'] },
      { label: 'Backend',  pills: ['Node.js', 'SQLite'] },
    ],
    link: null,
    wip: false,
    foodIcon: null, // assign your own: e.g. '/img/food/dumplings.png'
  },
  {
    id: '02',
    title: 'Portfolio Website',
    subtitle: 'This very site',
    description: 'A brunch-themed personal portfolio with an interactive menu table, editorial typography, and food-as-navigation. Designed and built from scratch.',
    year: '2025',
    images: [],
    stack: [
      { label: 'Frontend', pills: ['React'] },
    ],
    link: null,
    wip: false,
    foodIcon: null,
  },
  {
    id: '03',
    title: 'NUS Health Hack 2025',
    subtitle: 'Surgipedia — surgical media transcription',
    description: 'A speech-to-text and image-to-text mockup designed for surgical researchers to efficiently transcribe audio and visual data into structured outputs.',
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
      { label: 'Backend',  pills: ['Deno'] },
    ],
    link: null,
    wip: false,
    foodIcon: null,
  },
  {
    id: '04',
    title: 'Captcha Demo',
    subtitle: 'Image-based human verification',
    description: 'A custom captcha built with React — users select images by category to verify they\'re human.',
    year: '2025',
    images: [
      '/img/project3-1.jpg',
      '/img/project3-2.jpg',
      '/img/project3-3.jpg',
    ],
    stack: [
      { label: 'Frontend', pills: ['React'] },
    ],
    link: { href: '/captcha-demo', label: 'Try Demo', kind: 'route' },
    wip: true,
    foodIcon: null,
  },
];

export default function Projects() {
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <section id="projects" className="projectsSection">
      <div className="projectsInner">

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
                    <div className="menuItemCarousel">
                      <ImageCarousel images={project.images} alt={project.title} />
                    </div>
                  )}
                </div>

              </article>
            );
          })}
        </div>

        <div className="projectsFooter">more dishes coming soon</div>

      </div>
    </section>
  );
}