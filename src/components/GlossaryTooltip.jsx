import React, { useRef, useState } from 'react';
import { GLOSSARY } from '../utils/glossary';

export default function GlossaryTooltip({ termKey, children }) {
  const item = GLOSSARY[termKey];
  const containerRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  if (!item) return <span>{children}</span>;

  const calculatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = 220; // Matches our index.css mobile-friendly width
    const halfWidth = tooltipWidth / 2;
    const viewportWidth = window.innerWidth;

    // Center of the hovered term relative to the viewport
    const termCenter = rect.left + rect.width / 2;

    // Default centered position relative to the container
    let leftOffset = -halfWidth + rect.width / 2;
    
    // Boundary check for left side of the screen (maintain 12px margin)
    if (termCenter - halfWidth < 12) {
      leftOffset = -rect.left + 12;
    } 
    // Boundary check for right side of the screen (maintain 12px margin)
    else if (termCenter + halfWidth > viewportWidth - 12) {
      leftOffset = viewportWidth - rect.left - tooltipWidth - 12;
    }

    setTooltipStyle({
      left: `${leftOffset}px`,
      transform: 'none',
    });
  };

  return (
    <span 
      ref={containerRef} 
      className="glossary-tooltip-container"
      onMouseEnter={calculatePosition}
      onTouchStart={calculatePosition}
    >
      {children}
      <span className="glossary-tooltip-box" style={tooltipStyle}>
        <strong style={{ color: 'var(--saffron)', display: 'block', marginBottom: '4px', fontSize: '11.5px' }}>
          {item.term}
        </strong>
        {item.definition}
      </span>
    </span>
  );
}
