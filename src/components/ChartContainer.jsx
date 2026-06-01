import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

/**
 * Measures its own width and passes numeric width/height to ResponsiveContainer.
 * Avoids height="100%" / width="-1" issues in flex/grid layouts on mobile.
 */
export default function ChartContainer({ height = 240, className = '', style = {}, children }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleDownload = (format) => {
    if (!containerRef.current) return;
    // Query specifically for the recharts SVG surface or SVG that is not the lucide button icon
    const svgEl = containerRef.current.querySelector('.recharts-surface') || 
                  containerRef.current.querySelector('svg:not([class*="lucide"])');
    if (!svgEl) return;

    // Clone the SVG node so we can clean it up for rendering
    const svgClone = svgEl.cloneNode(true);
    const chartWidth = svgEl.clientWidth || svgEl.getBoundingClientRect().width || 800;
    const chartHeight = svgEl.clientHeight || svgEl.getBoundingClientRect().height || 400;
    svgClone.setAttribute('width', chartWidth);
    svgClone.setAttribute('height', chartHeight);
    svgClone.style.fontFamily = 'Inter, system-ui, sans-serif';

    // Proactively substitute CSS variable values for standalone vector rendering
    const allElements = svgClone.querySelectorAll('*');
    allElements.forEach(el => {
      // Substitute fills
      const fill = el.getAttribute('fill');
      if (fill && fill.includes('var(')) {
        if (fill.includes('--text-secondary')) el.setAttribute('fill', '#94a3b8');
        else if (fill.includes('--text-primary')) el.setAttribute('fill', '#ffffff');
        else if (fill.includes('--saffron')) el.setAttribute('fill', '#f97316');
        else if (fill.includes('--emerald')) el.setAttribute('fill', '#10b981');
        else if (fill.includes('--ashoka-blue')) el.setAttribute('fill', '#3b82f6');
        else if (fill.includes('--crimson')) el.setAttribute('fill', '#ef4444');
      }
      // Substitute strokes
      const stroke = el.getAttribute('stroke');
      if (stroke && stroke.includes('var(')) {
        if (stroke.includes('--text-secondary')) el.setAttribute('stroke', '#475569');
        else if (stroke.includes('--border-glass')) el.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)');
        else if (stroke.includes('--saffron')) el.setAttribute('stroke', '#f97316');
        else if (stroke.includes('--emerald')) el.setAttribute('stroke', '#10b981');
        else if (stroke.includes('--ashoka-blue')) el.setAttribute('stroke', '#3b82f6');
      }
      // Inline styles
      if (el.style.fill && el.style.fill.includes('var(')) {
        if (el.style.fill.includes('--text-secondary')) el.style.fill = '#94a3b8';
        else if (el.style.fill.includes('--text-primary')) el.style.fill = '#ffffff';
      }
      if (el.style.stroke && el.style.stroke.includes('var(')) {
        if (el.style.stroke.includes('--text-secondary')) el.style.stroke = '#475569';
      }
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);

    if (format === 'svg') {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget_chart_${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = chartWidth * 2;
        canvas.height = chartHeight * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);

        // Fill background color for high-quality export
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, chartWidth, chartHeight);
        ctx.drawImage(img, 0, 0, chartWidth, chartHeight);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `budget_chart_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`chart-container${className ? ` ${className}` : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        height: `${height}px`,
        ...style,
      }}
      onMouseLeave={() => setShowDropdown(false)}
    >
      {/* Exporter Dropdown overlay button */}
      <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '5px',
            color: '#a1a1aa',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Download Chart"
        >
          <Download size={13} />
        </button>

        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '28px',
              background: '#0e1322',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              minWidth: '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <button
              onClick={() => { handleDownload('png'); setShowDropdown(false); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '6px 8px',
                textAlign: 'left',
                fontSize: '11px',
                cursor: 'pointer',
                borderRadius: '4px',
                width: '100%',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--border-glass)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              Export as PNG
            </button>
            <button
              onClick={() => { handleDownload('svg'); setShowDropdown(false); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '6px 8px',
                textAlign: 'left',
                fontSize: '11px',
                cursor: 'pointer',
                borderRadius: '4px',
                width: '100%',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--border-glass)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              Export as SVG
            </button>
          </div>
        )}
      </div>

      {width > 0 && (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}

