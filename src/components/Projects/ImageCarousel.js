import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel({ images, alt }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isOpen = lightboxIndex !== null;

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e) => {
    e.stopPropagation();
    setLightboxIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => {
      if (e.key === 'Escape')     setLightboxIndex(null);
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i === images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Thumbnail strip */}
      <div className="thumbStrip">
        {images.map((src, i) => (
          <button
            key={i}
            className="thumbBtn"
            onClick={() => setLightboxIndex(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
          >
            <img src={src} alt={`${alt} ${i + 1}`} className="thumbImg" />
            <span className="thumbOverlay">⤢</span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="lightbox" onClick={() => setLightboxIndex(null)}>
          <button className="lightboxClose" onClick={() => setLightboxIndex(null)} aria-label="Close">✕</button>

          <img
            src={images[lightboxIndex]}
            alt={`${alt} (${lightboxIndex + 1} of ${images.length})`}
            className="lightboxImg"
            onClick={e => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button className="lightboxBtn lightboxBtn--prev" onClick={prev}>←</button>
              <button className="lightboxBtn lightboxBtn--next" onClick={next}>→</button>

              <div className="lightboxDots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`lightboxDot${i === lightboxIndex ? ' isActive' : ''}`}
                    onClick={e => { e.stopPropagation(); setLightboxIndex(i); }}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="lightboxCounter">{lightboxIndex + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}