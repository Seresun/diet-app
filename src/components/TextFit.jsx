import React, { useRef, useEffect, useState } from 'react';

const TextFit = ({ children, min = 10, max = 18, className = '', style = {} }) => {
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(max);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!textRef.current) return;

      const container = textRef.current;
      const text = container.textContent;
      
      if (!text) return;

      // Reset to max size first
      container.style.fontSize = `${max}px`;
      
      // Check if text fits
      const isOverflowing = () => {
        return container.scrollHeight > container.clientHeight || 
               container.scrollWidth > container.clientWidth;
      };

      // Binary search for optimal font size
      let low = min;
      let high = max;
      let optimalSize = max;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        container.style.fontSize = `${mid}px`;
        
        if (isOverflowing()) {
          high = mid - 1;
        } else {
          optimalSize = mid;
          low = mid + 1;
        }
      }

      setFontSize(optimalSize);
      container.style.fontSize = `${optimalSize}px`;
    };

    // Initial adjustment
    adjustFontSize();

    // Adjust on window resize
    const handleResize = () => {
      adjustFontSize();
    };

    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver if available for more precise detection
    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(adjustFontSize);
      if (textRef.current) {
        resizeObserver.observe(textRef.current);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [children, min, max]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontSize: `${fontSize}px`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default TextFit; 