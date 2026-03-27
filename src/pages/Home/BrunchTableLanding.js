import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrunchTableLanding.css';

const SOCIAL_DATA = [
  { label: 'GitHub',   href: 'https://github.com/rollingchair63',      kind: 'external', icon: '🛠' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/elodieyyx',  kind: 'external', icon: '💬' },
  { label: 'Email me', href: 'mailto:hello@elodie.design',             kind: 'external', icon: '✉️' },
];

const RESUME_PDF = process.env.PUBLIC_URL + '/assets/resume.pdf';

// Auto-spin speed in degrees per second
const AUTO_SPIN_SPEED = 6;
// Friction: velocity multiplied by this each frame (0-1, closer to 1 = more glide)
const FRICTION = 0.94;

export default function BrunchTableLanding() {
  const navigate = useNavigate();
  const rootRef  = useRef(null);
  const modalRef = useRef(null);

  // ── Spin state ──────────────────────────────────────────────────────
  const angleRef     = useRef(0);
  const velRef       = useRef(0);
  const isDragging   = useRef(false);
  const hasMoved     = useRef(false);
  const lastAngle    = useRef(0);
  const lastTime     = useRef(0);
  const rafRef       = useRef(null);
  const tableRef     = useRef(null);
  const [tableAngle, setTableAngle] = useState(0);

  // ── UI state ────────────────────────────────────────────────────────
  const [activeKey,   setActiveKey]   = useState(null);
  const [cursorPos,   setCursorPos]   = useState({ x: 0, y: 0 });
  const [ringPos,     setRingPos]     = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  const items = useMemo(() => [
    {
      key: 'about', section: 'About Me', title: "Hello, I'm Elodie!",
      body: 'A computer science student from SMU who loves crafting meaningful digital experiences. I blend creativity with code to build things people enjoy using. ps. I REALLY REALLY LOVE DUMPLINGS 🥟.',
      tags: [], imageSrc: '/img/food/dumplings.png', imageAlt: 'Dumplings', scrollTo: null,
    },
    {
      key: 'skills', section: 'Skills', title: 'What I bring to the table!',
      body: 'A mix of technical skills and soft skills, with a dash of creativity and a sprinkle of teamwork. I value clear communication and a growth mindset in all my projects :D',
      tags: [],
      skillGroups: [
        { label: 'Programming Languages',  items: ['C', 'Java', 'JavaScript', 'SQL', 'CSS'] },
        { label: 'Libraries & Frameworks', items: ['React', 'Spring Boot', 'Node.js', 'Tailwind CSS'] },
        { label: 'Tools & Platforms',      items: ['GitHub', 'Figma', 'Expo'] },
      ],
      imageSrc: '/img/food/takoyaki.png', imageAlt: 'Takoyaki', scrollTo: null,
    },
    {
      key: 'links', section: 'Resume', title: "Here's my recipe!",
      body: 'All my experience, served on one page — download or view it fresh.',
      tags: [], imageSrc: '/img/food/tiramisu.png', imageAlt: 'Tiramisu', scrollTo: null,
    },
    {
      key: 'projects', section: 'Projects', title: "Things I've cooked!",
      body: 'Projects built from hackathons or from a random lightbulb moment 💡 — a taste of what I can do!',
      tags: [],
      imageSrc: '/img/food/matcha.png', imageAlt: 'Strawberry Matcha', scrollTo: 'projects',
    },
    {
      key: 'socials', section: 'Socials', title: 'Send your compliments to the chef!',
      body: 'The chef accepts compliments, collabs, and critique. Drop by, say hi, leave a five-star review.',
      tags: [], imageSrc: '/img/food/croissant.png', imageAlt: 'Croissant', scrollTo: null,
    },
  ], []);

  const activeItem = items.find(i => i.key === activeKey) ?? null;

  // ── Animation loop ──────────────────────────────────────────────────
  useEffect(() => {
    let lastTs = performance.now();

    function tick(ts) {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (!isDragging.current) {
        velRef.current *= FRICTION;
        const autoContrib = AUTO_SPIN_SPEED * dt;
        angleRef.current += velRef.current + autoContrib;
      }

      setTableAngle(angleRef.current % 360);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Helper: get pointer angle relative to table center ─────────────
  function getPointerAngle(e) {
    const el = tableRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }

  // ── Drag handlers — attached to the spinner wrapper ─────────────────
  const onPointerDown = useCallback(e => {
    if (activeKey) return;
    // If the pointer went down on or inside a dish button, don't start a drag
    if (e.target.closest('.brunchDish')) return;
    isDragging.current = true;
    hasMoved.current   = false;
    lastAngle.current  = getPointerAngle(e);
    lastTime.current   = performance.now();
    velRef.current     = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [activeKey]);

  const onPointerMove = useCallback(e => {
    if (!isDragging.current) return;
    const now     = performance.now();
    const current = getPointerAngle(e);
    let delta = current - lastAngle.current;
    if (delta >  180) delta -= 360;
    if (delta < -180) delta += 360;
    if (Math.abs(delta) > 1.5) hasMoved.current = true;
    angleRef.current += delta;
    const dtMs = now - lastTime.current;
    if (dtMs > 0) velRef.current = delta / (dtMs / 16.67);
    lastAngle.current = current;
    lastTime.current  = now;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── Cursor tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const onMove = e => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setRingPos(prev => ({
        x: prev.x + (e.clientX - prev.x) * 0.12,
        y: prev.y + (e.clientY - prev.y) * 0.12,
      }));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!activeKey || !modalRef.current) return;
    modalRef.current.querySelector('.brunchModalClose')?.focus();
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
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        {/* ── Spinning table wrapper ─────────────────────────────────── */}
        <div
          ref={tableRef}
          className={`brunchTableSpinner${activeKey ? ' isBlurred' : ''}`}
          style={{ transform: `rotate(${tableAngle}deg)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="application"
          aria-label="Spin the menu table"
        >
          <div className="brunchTable">
            <div className="brunchCenterText" aria-hidden="true"
              style={{ transform: `translate(-50%, -50%) rotate(${-tableAngle}deg)` }}>
              <h1>Today&apos;s Menu</h1>
              <p>A little something about me</p>
            </div>

            <div className="brunchDishes" aria-label="Menu items">
              {items.map(item => (
                <button
                  key={item.key}
                  type="button"
                  className={`brunchDish brunchDish--${item.key}${activeKey === item.key ? ' isActive' : ''}`}
                  // Stop pointerdown here so the spinner's onPointerDown never fires
                  // for dish button presses, keeping setPointerCapture away from them
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() => handleDishClick(item)}
                  onPointerEnter={() => setCursorHover(true)}
                  onPointerLeave={() => setCursorHover(false)}
                  aria-label={`${item.section}: ${item.title}`}
                  aria-pressed={activeKey === item.key}
                >
                  <span className="brunchDishArt" aria-hidden="true">
                    {item.imageSrc
                      ? <img
                          className="brunchDishImg"
                          src={item.imageSrc}
                          alt={item.imageAlt || item.section}
                          style={{ transform: `rotate(${-tableAngle}deg)` }}
                        />
                      : <span className="brunchDishFallback" />}
                  </span>
                  <span
                    className="brunchDishTag"
                    style={{ transform: `rotate(${-tableAngle}deg)` }}
                  >
                    {item.section}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>{/* end brunchTableSpinner */}

        {/* Fixed hint label — sibling of spinner, anchored to brunchScene */}
        <div className="brunchTableLabel" aria-hidden="true">
          drag to spin · click to explore
        </div>

      </div>{/* end brunchScene */}

      {/* ── Modal overlay ──────────────────────────────────────────────── */}
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
              {activeItem.imageSrc && (
                <button
                  className="brunchModalImageBtn"
                  onClick={() => setActiveKey(null)}
                  aria-label="Close"
                  title="Click to close"
                >
                  <img className="brunchModalImage" src={activeItem.imageSrc} alt={activeItem.imageAlt} />
                </button>
              )}

              <div className="brunchModalSection">{activeItem.section}</div>
              <div className="brunchModalTitle">{activeItem.title}</div>
              <div className="brunchModalDivider" />
              <div className="brunchModalBody">{activeItem.body}</div>

              {activeItem.tags?.length > 0 && (
                <div className="brunchModalTags">
                  {activeItem.tags.map(t => <span key={t} className="brunchModalTag">{t}</span>)}
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

              {activeItem.key === 'links' && (
                <div className="brunchResumePreview">
                  <iframe
                    src={`${RESUME_PDF}#toolbar=0&navpanes=0&scrollbar=0`}
                    title="Elodie Yeung — Resume"
                    className="brunchResumeFrame"
                  />
                  <a href={RESUME_PDF} download className="brunchModalCta brunchResumeCta">
                    Download Resume
                  </a>
                </div>
              )}

              {activeItem.key === 'socials' && (
                <div className="brunchModalLinks">
                  {SOCIAL_DATA.map(l => (
                    <button key={l.label} type="button" className="brunchModalLink" onClick={() => onLinkClick(l)}>
                      <span className="brunchModalLinkIcon">{l.icon}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}

              {activeItem.scrollTo && (
                <button className="brunchModalCta" onClick={() => handleScrollCta(activeItem.scrollTo)}>
                  Go to {activeItem.section}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}