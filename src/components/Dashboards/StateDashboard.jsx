import React, { useState } from 'react';
import IndiaMap from '../IndiaMap';
import { ShieldCheck, TrendingUp, HelpCircle, Map } from 'lucide-react';

export default function StateDashboard({ masterData }) {
  const [activeStateId, setActiveStateId] = useState("gujarat");
  const [compStateA, setCompStateA] = useState("gujarat");
  const [compStateB, setCompStateB] = useState("haryana");

  const stateScores = masterData.state_dbt_scores || [];

  // Fetch meta for active state ID
  const getActiveStateMeta = () => {
    // Map id to name matching
    const idMap = {
      gujarat: "Gujarat",
      haryana: "Haryana",
      "uttar-pradesh": "Uttar Pradesh",
      tripura: "Tripura",
      uttarakhand: "Uttarakhand",
      jharkhand: "Jharkhand",
      goa: "Goa",
      punjab: "Punjab",
      maharashtra: "Maharashtra",
      rajasthan: "Rajasthan",
      "madhya-pradesh": "Madhya Pradesh",
      "tamil-nadu": "Tamil Nadu",
      karnataka: "Karnataka",
      "west-bengal": "West Bengal",
      bihar: "Bihar"
    };
    const name = idMap[activeStateId] || "Gujarat";
    return stateScores.find(s => s.state.toLowerCase() === name.toLowerCase()) || stateScores[3]; // Fallback to Gujarat
  };

  const activeMeta = getActiveStateMeta();
  const stateAMeta = stateScores.find(s => s.state.toLowerCase() === compStateA.toLowerCase()) || stateScores[3];
  const stateBMeta = stateScores.find(s => s.state.toLowerCase() === compStateB.toLowerCase()) || stateScores[0];

  const handleSelectStateFromMap = (id) => {
    setActiveStateId(id);
    // Auto-update comparison state A to match selected state
    const idMap = {
      gujarat: "Gujarat",
      haryana: "Haryana",
      "uttar-pradesh": "Uttar Pradesh",
      tripura: "Tripura",
      uttarakhand: "Uttarakhand",
      jharkhand: "Jharkhand",
      goa: "Goa",
      punjab: "Punjab",
      maharashtra: "Maharashtra",
      rajasthan: "Rajasthan",
      "madhya-pradesh": "Madhya Pradesh",
      "tamil-nadu": "Tamil Nadu",
      karnataka: "Karnataka",
      "west-bengal": "West Bengal",
      bihar: "Bihar"
    };
    if (idMap[id]) {
      setCompStateA(idMap[id]);
    }
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Map Panel (Visual Centerpiece) */}
      <div className="glass-panel col-6" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Map size={20} color="var(--ashoka-blue)" />
          Interactive Welfare Performance Map (DBT Scores)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Click on any highlighted state in the vector map to view its detailed budget execution indicators.
        </p>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
          <IndiaMap 
            data={stateScores} 
            activeState={activeStateId} 
            onSelectState={handleSelectStateFromMap} 
          />
        </div>
      </div>

      {/* 2. Detailed State Card Info */}
      <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', justifyGap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE STATE OUTLAY</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--saffron)' }}>{activeMeta.state}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>NATIONAL RANK</span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--emerald)' }}>#{activeMeta.rank}</h3>
          </div>
        </div>

        {/* 4 circular/card metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Aadhaar Link Saturation</span>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{activeMeta.aadhaar_saturation}%</h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>DBT Score (Out of 100)</span>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px', color: 'var(--ashoka-blue)' }}>{activeMeta.overall_score}</h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Monthly DBT Per Capita</span>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px', color: 'var(--emerald)' }}>₹ {activeMeta.dbt_per_capita}</h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Savings Expenditure Ratio</span>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{activeMeta.savings_ratio}%</h4>
          </div>
        </div>

        {/* State Devotion Info */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <ShieldCheck size={16} color="var(--emerald)" />
            Verified Compliance Insights
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {activeMeta.state} shows a portal compliance factor of <strong>{activeMeta.portal_compliance}%</strong> and central CSS registration saturation of <strong>{activeMeta.css_id}%</strong>. 
            {activeMeta.overall_score >= 75 
              ? " This high compliance rating places the state in the High-Performance tier for welfare disbursements."
              : " Mild documentation delays in savings reporting have been flagged under the DBT savings-ratio rules."}
          </p>
        </div>
      </div>

      {/* 3. State-vs-State Side-by-Side Comparison Engine */}
      <div className="glass-panel col-12" style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <TrendingUp size={20} color="var(--emerald)" />
          Executive State-vs-State Comparative Matrix
        </h3>

        {/* State A and B selectors */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Compare State A:</span>
            <select 
              value={compStateA} 
              onChange={(e) => setCompStateA(e.target.value)}
              style={{ padding: '8px 12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
            >
              {stateScores.map((s) => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>With State B:</span>
            <select 
              value={compStateB} 
              onChange={(e) => setCompStateB(e.target.value)}
              style={{ padding: '8px 12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
            >
              {stateScores.map((s) => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Row Matrices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: Rank */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>National DBT Rank</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--saffron)' }}>#{stateAMeta.rank}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ashoka-blue)' }}>#{stateBMeta.rank}</span>
          </div>

          {/* Row 2: Score */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Overall Score (Out of 100)</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--saffron)' }}>{stateAMeta.overall_score}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ashoka-blue)' }}>{stateBMeta.overall_score}</span>
          </div>

          {/* Row 3: Per capita */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Monthly DBT Per Capita Transfer</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--saffron)' }}>₹ {stateAMeta.dbt_per_capita}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ashoka-blue)' }}>₹ {stateBMeta.dbt_per_capita}</span>
          </div>

          {/* Row 4: Aadhaar Saturation */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Aadhaar Link Saturation Rate</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--saffron)' }}>{stateAMeta.aadhaar_saturation}%</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ashoka-blue)' }}>{stateBMeta.aadhaar_saturation}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
