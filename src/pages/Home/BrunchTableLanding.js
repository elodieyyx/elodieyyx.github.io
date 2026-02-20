import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrunchTableLanding.css';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const SOCIAL_DATA = [
  { label: 'GitHub',    href: 'https://github.com/rollingchair63',         kind: 'external', icon: '🛠' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/elodieyyx',    kind: 'external', icon: '💬' },
  { label: 'Email me',  href: 'mailto:hello@elodie.design',               kind: 'external', icon: '✉️' },
];

// Drop your resume PDF into /public and update this path
const RESUME_PDF = '/resume.pdf';

export default function BrunchTableLanding() {
  const navigate  = useNavigate();
  const rootRef   = useRef(null);
  const modalRef  = useRef(null);

  const [activeKey,   setActiveKey]   = useState(null);
  const [cursorPos,   setCursorPos]   = useState({ x: 0, y: 0 });
  const [ringPos,     setRingPos]     = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  const items = useMemo(() => [
    {
      key:      'about',
      section:  'About Me',
      title:    "Hello, I'm Elodie!",
      body:     'A computer science student who loves crafting thoughtful digital experiences. I blend creativity with code to build things people enjoy using.',
      tags:     [],
      imageSrc: '/img/food/dumplings.png',
      imageAlt: 'Dumplings',
      scrollTo: null,
    },
    {
      key:      'skills',
      section:  'Skills',
      title:    'What I bring to the table!',
      body:     'A mix of design intuition and technical fluency — from UI polish to shipping features.',
      tags:     [],
      skillGroups: [
        { label: 'Programming Languages', items: ['C', 'Java', 'JavaScript', 'SQL', 'CSS'] },
        { label: 'Libraries & Frameworks', items: ['React', 'Spring Boot', 'Node.js', 'Tailwind CSS'] },
        { label: 'Tools & Platforms',      items: ['Git', 'GitHub', 'Figma'] },
      ],
      imageSrc: '/img/food/takoyaki.png',
      imageAlt: 'Takoyaki',
      scrollTo: null,
    },
    {
      key:      'links',
      section:  'Resume',
      title:    "Here's my recipe!",
      body:     'All my experience, served on one page — download or view it fresh.',
      tags:     [],
      imageSrc: '/img/food/tiramisu.png',
      imageAlt: 'Tiramisu',
      scrollTo: null,
    },
    {
      key:      'projects',
      section:  'Projects',
      title:    "Things I've cooked!",
      body:     'Interactive experiments and production apps — each project is a chance to learn and push craft.',
      tags:     ['Web apps', 'UI systems', 'Frontend', 'Prototyping'],
      imageSrc: '/img/food/matcha.png',
      imageAlt: 'Matcha dessert',
      scrollTo: 'projects',
    },
    {
      key:      'socials',
      section:  'Socials',
      title:    'Send your compliments to the chef!',
      body:     'The chef accepts compliments, collabs, and critique. Drop by, say hi, leave a five-star review.',
      tags:     [],
      imageSrc: '/img/food/croissant.png',
      imageAlt: 'Croissant',
      scrollTo: null,
    },
  ], []);

  const activeItem = items.find(i => i.key === activeKey) ?? null;

  useEffect(() => {
    const onMove = e => {
      const x = e.clientX;
      const y = e.clientY;
      setCursorPos({ x, y });
      setRingPos(prev => ({
        x: prev.x + (x - prev.x) * 0.12,
        y: prev.y + (y - prev.y) * 0.12,
      }));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!activeKey || !modalRef.current) return;
    const closeBtn = modalRef.current.querySelector('.brunchModalClose');
    closeBtn?.focus();
  }, [activeKey]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setActiveKey(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleOverlayClick = useCallback(e => {
    if (e.target === e.currentTarget) setActiveKey(null);
  }, []);

  const handleDishClick = useCallback(item => {
    setActiveKey(prev => prev === item.key ? null : item.key);
  }, []);

  const handleScrollCta = useCallback(targetId => {
    setActiveKey(null);
    setTimeout(() => {
      document.getElementById(targetId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, []);

  const onLinkClick = useCallback(link => {
    if (link.kind === 'route') navigate(link.href);
    else window.open(link.href, '_blank', 'noopener,noreferrer');
  }, [navigate]);

  return (
    <section className="brunchRoot" ref={rootRef} aria-label="Brunch table landing">
      <div className="brunchCursor"     aria-hidden="true" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="brunchCursorRing" aria-hidden="true"
        style={{ left: ringPos.x, top: ringPos.y, '--ringScale': cursorHover ? 1.6 : 1 }} />

      <header className="brunchHeader">
        <div className="brunchHeaderLeft">
          <strong>Elodie Yeung</strong>
          Portfolio — 2026
        </div>
      </header>

      <div className="brunchScene">
        <div
          className={`brunchTable${activeKey ? ' isBlurred' : ''}`}
          role="application"
          aria-label="Menu table"
        >
          <div className="brunchCenterText" aria-hidden="true">
            <h1>Today&apos;s Menu</h1>
            <p>A little something about me</p>
          </div>

          <div className="brunchDishes" aria-label="Menu items">
            {items.map(item => (
              <button
                key={item.key}
                type="button"
                className={`brunchDish brunchDish--${item.key}${activeKey === item.key ? ' isActive' : ''}`}
                onClick={() => handleDishClick(item)}
                onPointerEnter={() => setCursorHover(true)}
                onPointerLeave={() => setCursorHover(false)}
                aria-label={`${item.section}: ${item.title}`}
                aria-pressed={activeKey === item.key}
              >
                <span className="brunchDishArt" aria-hidden="true">
                  {item.imageSrc
                    ? <img className="brunchDishImg" src={item.imageSrc} alt={item.imageAlt || item.section} />
                    : <span className="brunchDishFallback" />}
                </span>
                <span className="brunchDishTag">{item.section}</span>
              </button>
            ))}
          </div>

          <div className="brunchTableLabel" aria-hidden="true">
            curated with care · click to explore
          </div>
        </div>
      </div>

      {/* ── Full overlay modal ───────────────────────────────────────── */}
      <div
        className={`brunchOverlay${activeItem ? ' isVisible' : ''}`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label={activeItem?.section ?? ''}
        aria-hidden={!activeItem}
      >
        <div
          className={`brunchModal${activeItem?.key === 'links' ? ' brunchModal--resume' : ''}`}
          ref={modalRef}
        >
          {activeItem && (
          <div className="brunchModalInner">
            <>
              {/* Food image doubles as close button */}
              {activeItem.imageSrc && (
                <button
                  className="brunchModalImageBtn"
                  onClick={() => setActiveKey(null)}
                  aria-label="Close"
                  title="Click to close"
                >
                  <img
                    className="brunchModalImage"
                    src={activeItem.imageSrc}
                    alt={activeItem.imageAlt}
                  />
                </button>
              )}

              <div className="brunchModalSection">{activeItem.section}</div>
              <div className="brunchModalTitle">{activeItem.title}</div>
              <div className="brunchModalDivider" />
              <div className="brunchModalBody">{activeItem.body}</div>

              {activeItem.tags?.length > 0 && (
                <div className="brunchModalTags">
                  {activeItem.tags.map(t => (
                    <span key={t} className="brunchModalTag">{t}</span>
                  ))}
                </div>
              )}

              {activeItem.skillGroups && (
                <div className="brunchModalSkills">
                  {activeItem.skillGroups.map(group => (
                    <div key={group.label} className="brunchModalSkillGroup">
                      <div className="brunchModalSkillLabel">{group.label}</div>
                      <div className="brunchModalSkillPills">
                        {group.items.map(skill => (
                          <span key={skill} className="brunchModalSkillPill">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resume: PDF preview + download button */}
              {activeItem.key === 'links' && (
                <div className="brunchResumePreview">
                  <iframe
                    src={`${RESUME_PDF}#toolbar=0&navpanes=0&scrollbar=0`}
                    title="Elodie Yeung — Resume"
                    className="brunchResumeFrame"
                  />
                  <a
                    href={RESUME_PDF}
                    download
                    className="brunchModalCta brunchResumeCta"
                  >
                    Download Resume
                  </a>
                </div>
              )}

              {/* Socials: Instagram, Behance, Dribbble, GitHub, LinkedIn, Email */}
              {activeItem.key === 'socials' && (
                <div className="brunchModalLinks">
                  {SOCIAL_DATA.map(l => (
                    <button
                      key={l.label}
                      type="button"
                      className="brunchModalLink"
                      onClick={() => onLinkClick(l)}
                    >
                      <span className="brunchModalLinkIcon">{l.icon}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}

              {activeItem.scrollTo && (
                <button
                  className="brunchModalCta"
                  onClick={() => handleScrollCta(activeItem.scrollTo)}
                >
                  Go to {activeItem.section}
                </button>
              )}
            </>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}