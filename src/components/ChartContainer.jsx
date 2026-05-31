import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * Measures its own width and passes numeric width/height to ResponsiveContainer.
 * Avoids height="100%" / width="-1" issues in flex/grid layouts on mobile.
 */
export default function ChartContainer({ height = 240, className = '', style = {}, children }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    };

    updateWidth();
    // Flex/grid layouts may not have final width on the first paint (common on mobile).
    requestAnimationFrame(() => {
      requestAnimationFrame(updateWidth);
    });

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`chart-container${className ? ` ${className}` : ''}`}
      style={{
        width: '100%',
        minWidth: 0,
        height: `${height}px`,
        ...style,
      }}
    >
      {width > 0 && (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}
