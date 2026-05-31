import React, { useState } from 'react';
import indiaMapData from '@svg-maps/india';

export default function IndiaMap({ data = [], activeState = null, onSelectState = () => {} }) {
  const [hoveredState, setHoveredState] = useState(null);

  const statePaths = indiaMapData.locations || [];
  const viewBox = indiaMapData.viewBox || "0 0 612 696";

  // Match state data from compile_data output
  const getStateMeta = (name) => {
    const found = data.find(s => s.state.toLowerCase() === name.toLowerCase());
    if (found) return { ...found, hasData: true };
    
    // Normalize some names if they differ slightly
    let normalizedName = name;
    if (name === "Jammu and Kashmir") normalizedName = "Jammu & Kashmir";
    const foundAlt = data.find(s => s.state.toLowerCase() === normalizedName.toLowerCase());
    if (foundAlt) return { ...foundAlt, hasData: true };

    return {
      state: name,
      overall_score: 50.0,
      rank: "--",
      dbt_per_capita: "--",
      aadhaar_saturation: "--",
      hasData: false
    };
  };

  // Determine choropleth fill based on DBT Overall score
  const getChoroplethColor = (score, hasData) => {
    if (!hasData) return "rgba(255, 255, 255, 0.08)";  // Soft glassmorphism for unranked territories
    if (score >= 80) return "rgba(0, 210, 133, 0.75)"; // Emerald Green (High Performers)
    if (score >= 70) return "rgba(0, 136, 255, 0.75)"; // Ashoka Blue (Stable Performers)
    if (score >= 60) return "rgba(255, 107, 0, 0.7)";  // Saffron Orange (Average)
    return "rgba(255, 59, 48, 0.65)";                  // Crimson Red (Low compliance/delays)
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* High-fidelity Vector map container */}
      <svg 
        viewBox={viewBox} 
        style={{ width: '100%', height: '100%', display: 'block', maxHeight: '500px' }}
      >
        <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" fill="none">
          {statePaths.map((state) => {
            const meta = getStateMeta(state.name);
            const isSelected = activeState && activeState.toLowerCase() === state.id;
            const isHovered = hoveredState && hoveredState.id === state.id;
            
            const fillColor = getChoroplethColor(meta.overall_score, meta.hasData);
            
            return (
              <path
                key={state.id}
                id={state.id}
                name={state.name}
                d={state.path}
                fill={isSelected ? "url(#pulseGlow)" : (isHovered ? "rgba(255,255,255,0.3)" : fillColor)}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  filter: isSelected ? 'drop-shadow(0 0 8px rgba(0, 136, 255, 0.6))' : 'none'
                }}
                onClick={() => onSelectState(state.id)}
                onMouseEnter={() => setHoveredState({ id: state.id, ...meta })}
                onMouseLeave={() => setHoveredState(null)}
              />
            );
          })}
        </g>
        
        {/* Glow shader definition */}
        <defs>
          <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d285" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#0088ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0055aa" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating Interactive Hover Tooltip */}
      {hoveredState && (
        <div 
          className="glass-panel" 
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            pointerEvents: 'none',
            zIndex: 10,
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '200px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{hoveredState.state}</span>
            {hoveredState.hasData && (
              <span 
                style={{ 
                  fontSize: '10.5px', 
                  fontWeight: 800, 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  background: hoveredState.overall_score >= 70 ? 'rgba(0,210,133,0.15)' : 'rgba(255,107,0,0.15)',
                  color: hoveredState.overall_score >= 70 ? 'var(--emerald)' : 'var(--saffron)'
                }}
              >
                Rank: #{hoveredState.rank}
              </span>
            )}
          </div>
          
          {hoveredState.hasData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Overall Score:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{hoveredState.overall_score}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>DBT Per Capita:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{hoveredState.dbt_per_capita}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Aadhaar SAT:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{hoveredState.aadhaar_saturation}%</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Union Territory / Unranked Region
            </div>
          )}
        </div>
      )}
    </div>
  );
}
