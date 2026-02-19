import React, { useCallback, useEffect, useState } from 'react';
import './Captcha.css';

const IMAGE_CATEGORIES = {
  cars: [1, 2, 3, 4], // indices of car images
  trees: [5, 6, 7, 8], // indices of tree images
  buildings: [9, 10, 11, 12], // indices of building images
};

export const Captcha = ({ onSuccess }) => {
  const [images, setImages] = useState([]);
  const [targetCategory, setTargetCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  const generateCaptcha = useCallback(() => {
    const categories = Object.keys(IMAGE_CATEGORIES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Create a grid of 9 images with some correct and some incorrect
    const correctIndices = IMAGE_CATEGORIES[randomCategory].slice(0, 3);
    const otherCategories = categories.filter(c => c !== randomCategory);
    const incorrectIndices = [
      ...IMAGE_CATEGORIES[otherCategories[0]].slice(0, 3),
      ...IMAGE_CATEGORIES[otherCategories[1]].slice(0, 3)
    ];
    
    const allImages = [...correctIndices, ...incorrectIndices]
      .sort(() => Math.random() - 0.5)
      .map((id, index) => ({
        id: index,
        correctCategory: correctIndices.includes(id),
        // Replace with actual image URLs
        src: `https://via.placeholder.com/150?text=Image${id}`
      }));

    setImages(allImages);
    setTargetCategory(randomCategory);
    setSelectedImages([]);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleVerify = () => {
    const correctSelections = images
      .filter(img => img.correctCategory)
      .map(img => img.id);
    
    const isAllCorrect = 
      selectedImages.length === correctSelections.length &&
      selectedImages.every(id => correctSelections.includes(id));

    if (isAllCorrect) {
      setIsCorrect(true);
      if (onSuccess) onSuccess();
    } else {
      setIsCorrect(false);
      setTimeout(() => generateCaptcha(), 2000);
    }
  };

  return (
    <div className="captcha-container">
      <div className="captcha-instructions">
        <h4>Select all images with <strong>{targetCategory}</strong></h4>
      </div>

      <div className="image-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className={`image-cell ${selectedImages.includes(image.id) ? 'selected' : ''}`}
            onClick={() => toggleImageSelection(image.id)}
          >
            <img src={image.src} alt={`Captcha ${image.id}`} />
            {selectedImages.includes(image.id) && (
              <div className="check-mark">✓</div>
            )}
          </div>
        ))}
      </div>

      <div className="captcha-buttons">
        <button onClick={handleVerify} className="verify-btn">
          Verify
        </button>
        <button onClick={generateCaptcha} className="refresh-btn">
          Refresh
        </button>
      </div>

      {isCorrect === true && <p className="success-msg">✓ Verified!</p>}
      {isCorrect === false && <p className="error-msg">✗ Incorrect, try again</p>}
    </div>
  );
};