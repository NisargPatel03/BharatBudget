import React, { useState } from 'react';

// Simplified high-fidelity SVG paths for Indian States.
// Using a standard responsive coordinate viewport of 600x650
const statePaths = [
  {
    id: "gujarat",
    name: "Gujarat",
    path: "M 40,300 C 60,310 70,300 80,310 C 90,320 85,340 70,345 C 55,350 45,335 40,330 C 35,325 35,305 40,300 Z M 70,345 C 80,345 90,335 100,340 C 110,345 115,360 100,370 C 85,380 75,370 70,360 Z M 80,310 C 90,290 110,285 125,295 C 140,305 130,330 115,340 C 100,350 90,335 80,310 Z",
    center: [80, 335]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    path: "M 125,295 C 110,285 90,290 80,310 C 70,290 85,250 100,220 C 115,190 140,180 160,195 C 180,210 190,240 185,260 C 180,280 140,305 125,295 Z",
    center: [135, 240]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    path: "M 115,340 C 130,330 140,305 160,315 C 180,325 210,320 225,345 C 240,370 210,410 180,415 C 150,420 120,405 110,380 C 100,355 105,345 115,340 Z",
    center: [165, 365]
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    path: "M 125,295 C 140,305 180,280 185,260 C 190,240 220,230 235,250 C 250,270 245,295 225,315 C 205,335 180,325 160,315 C 140,305 130,330 125,295 Z",
    center: [185, 280]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    path: "M 185,260 C 190,240 220,230 235,220 C 250,210 260,180 280,185 C 300,190 320,210 305,240 C 290,270 265,275 245,270 C 225,265 200,270 185,260 Z",
    center: [250, 225]
  },
  {
    id: "haryana",
    name: "Haryana",
    path: "M 160,195 C 140,180 150,160 165,155 C 180,150 190,165 185,180 C 180,195 170,200 160,195 Z",
    center: [170, 175]
  },
  {
    id: "punjab",
    name: "Punjab",
    path: "M 165,155 C 150,160 135,150 140,135 C 145,120 165,115 175,130 C 185,145 180,150 165,155 Z",
    center: [155, 140]
  },
  {
    id: "jammu-kashmir",
    name: "Jammu & Kashmir",
    path: "M 140,135 C 145,120 135,100 150,70 C 165,40 185,50 190,75 C 195,100 185,120 175,130 C 165,140 155,145 140,135 Z",
    center: [165, 80]
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    path: "M 185,180 C 190,165 210,150 225,160 C 240,170 230,190 215,195 C 200,200 190,195 185,180 Z",
    center: [205, 175]
  },
  {
    id: "bihar",
    name: "Bihar",
    path: "M 305,240 C 320,210 340,215 365,225 C 390,235 375,260 360,265 C 345,270 320,265 305,240 Z",
    center: [340, 235]
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    path: "M 320,265 C 345,270 360,265 370,280 C 380,295 365,320 345,315 C 325,310 310,295 320,265 Z",
    center: [345, 290]
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    path: "M 370,280 C 380,295 390,325 385,350 C 380,375 365,360 360,340 C 355,320 365,300 370,280 Z",
    center: [375, 330]
  },
  {
    id: "odisha",
    name: "Odisha",
    path: "M 270,330 C 290,320 325,310 345,315 C 365,320 350,370 330,385 C 310,400 280,380 270,330 Z",
    center: [315, 355]
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    path: "M 225,315 C 245,295 265,300 270,330 C 275,360 260,390 250,410 C 240,430 220,380 225,315 Z",
    center: [245, 355]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    path: "M 110,380 C 120,405 150,420 145,460 C 140,500 115,530 110,500 C 105,470 95,440 100,410 C 105,395 105,385 110,380 Z",
    center: [120, 450]
  },
  {
    id: "telangana",
    name: "Telangana",
    path: "M 180,415 C 210,410 230,380 240,430 C 250,450 215,470 195,465 C 175,460 170,430 180,415 Z",
    center: [205, 435]
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    path: "M 195,465 C 215,470 250,450 260,480 C 270,510 220,560 170,550 C 150,545 175,480 195,465 Z",
    center: [215, 510]
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    path: "M 145,520 C 160,510 170,550 170,580 C 170,610 140,620 135,590 C 130,560 135,540 145,520 Z",
    center: [150, 570]
  },
  {
    id: "kerala",
    name: "Kerala",
    path: "M 110,500 C 115,530 135,540 135,590 C 135,610 120,600 115,560 C 110,520 105,510 110,500 Z",
    center: [120, 550]
  },
  {
    id: "tripura",
    name: "Tripura",
    path: "M 445,280 C 455,280 455,295 445,300 C 435,305 435,285 445,280 Z",
    center: [445, 290]
  },
  {
    id: "assam",
    name: "Assam",
    path: "M 410,240 C 430,230 460,225 480,245 C 500,265 470,285 440,270 C 410,255 400,245 410,240 Z",
    center: [450, 250]
  }
];

export default function IndiaMap({ data = [], activeState = null, onSelectState = () => {} }) {
  const [hoveredState, setHoveredState] = useState(null);

  // Match state data from compile_data output
  const getStateMeta = (name) => {
    return data.find(s => s.state.toLowerCase() === name.toLowerCase()) || {
      state: name,
      overall_score: 50.0,
      rank: "--",
      dbt_per_capita: "--",
      aadhaar_saturation: "--"
    };
  };

  // Determine choropleth fill based on DBT Overall score
  const getChoroplethColor = (score) => {
    if (score >= 80) return "rgba(0, 210, 133, 0.75)"; // Emerald Green for Rank 1-3
    if (score >= 70) return "rgba(0, 136, 255, 0.7)";  // Ashoka Blue for Rank 4-6 (Gujarat)
    if (score >= 60) return "rgba(255, 107, 0, 0.65)";  // Saffron Orange for Rank 7-12
    return "rgba(255, 59, 48, 0.6)";                   // Crimson Red for Rank 13+
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* High-fidelity Vector map container */}
      <svg 
        viewBox="0 0 550 630" 
        style={{ width: '100%', height: '100%', display: 'block', maxHeight: '550px' }}
      >
        <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" fill="none">
          {statePaths.map((state) => {
            const meta = getStateMeta(state.name);
            const isSelected = activeState && activeState.toLowerCase() === state.id;
            const isHovered = hoveredState && hoveredState.id === state.id;
            
            const fillColor = getChoroplethColor(meta.overall_score);
            
            return (
              <path
                key={state.id}
                d={state.path}
                fill={isSelected ? "url(#pulseGlow)" : (isHovered ? "rgba(255,255,255,0.25)" : fillColor)}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.25s ease',
                  filter: isSelected ? 'drop-shadow(0 0 10px rgba(0, 136, 255, 0.5))' : 'none'
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
            <stop offset="0%" stopColor="#0088ff" stopOpacity="0.9" />
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
            top: '12px',
            right: '12px',
            pointerEvents: 'none',
            zIndex: 10,
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '200px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{hoveredState.state}</span>
            <span 
              style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                padding: '2px 6px', 
                borderRadius: '4px',
                background: hoveredState.overall_score >= 70 ? 'rgba(0,210,133,0.2)' : 'rgba(255,107,0,0.2)',
                color: hoveredState.overall_score >= 70 ? 'var(--emerald)' : 'var(--saffron)'
              }}
            >
              Rank: #{hoveredState.rank}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
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
        </div>
      )}
    </div>
  );
}
