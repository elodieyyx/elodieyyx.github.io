import React, { useState } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="carousel">
        <div className="carouselTrack" onClick={() => setIsFullscreen(true)}>
          <img
            src={images[currentIndex]}
            alt={`${alt} (${currentIndex + 1} of ${images.length})`}
            className="carouselImg"
          />
          {images.length > 1 && (
            <>
              <button className="carouselBtn carouselBtn--prev" onClick={handlePrevious} aria-label="Previous">←</button>
              <button className="carouselBtn carouselBtn--next" onClick={handleNext} aria-label="Next">→</button>
            </>
          )}
          <div className="carouselCounter">{currentIndex + 1} / {images.length}</div>
        </div>

        {images.length > 1 && (
          <div className="carouselDots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carouselDot${i === currentIndex ? ' isActive' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {isFullscreen && (
        <div className="carouselFullscreen" onClick={() => setIsFullscreen(false)}>
          <button className="carouselFullscreenClose" onClick={() => setIsFullscreen(false)}>✕</button>
          <img
            src={images[currentIndex]}
            alt={`${alt} (${currentIndex + 1} of ${images.length})`}
            className="carouselFullscreenImg"
            onClick={e => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button className="carouselFullscreenBtn carouselFullscreenBtn--prev" onClick={handlePrevious}>←</button>
              <button className="carouselFullscreenBtn carouselFullscreenBtn--next" onClick={handleNext}>→</button>
              <div className="carouselFullscreenDots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`carouselFullscreenDot${i === currentIndex ? ' isActive' : ''}`}
                    onClick={e => { e.stopPropagation(); setCurrentIndex(i); }}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="carouselFullscreenCounter">{currentIndex + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}