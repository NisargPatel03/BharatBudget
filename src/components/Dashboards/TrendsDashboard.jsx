import React, { useState } from 'react';
import { TrendingUp, Landmark, Calculator, Info, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from '../ChartContainer';

export default function TrendsDashboard() {
  const [selectedEntity, setSelectedEntity] = useState('defense');

  // Trend data database
  const historicalTrends = {
    defense: {
      name: 'Ministry of Defence outlays',
      type: 'Ministry',
      data: [
        { year: '2018', value: 275000 },
        { year: '2019', value: 295000 },
        { year: '2020', value: 318000 },
        { year: '2021', value: 340000 },
        { year: '2022', value: 385000 },
        { year: '2023', value: 420000 },
        { year: '2024', value: 485000 },
        { year: '2025', value: 525000 },
        { year: '2026', value: 585000 },
        { year: '2027', value: 620000 }
      ],
      insight: 'Defense allocations have scaled steadily to support structural modernization and indigenization under self-reliance initiatives.'
    },
    roadways: {
      name: 'Ministry of Road Transport & Highways',
      type: 'Ministry',
      data: [
        { year: '2018', value: 65000 },
        { year: '2019', value: 78000 },
        { year: '2020', value: 83000 },
        { year: '2021', value: 92000 },
        { year: '2022', value: 131000 },
        { year: '2023', value: 188000 },
        { year: '2024', value: 258000 },
        { year: '2025', value: 272000 },
        { year: '2026', value: 280000 },
        { year: '2027', value: 295000 }
      ],
      insight: 'Road infrastructure funding witnessed an exponential post-pandemic expansion to drive domestic asset creation and logisitical connectivity.'
    },
    railways: {
      name: 'Ministry of Railways allocations',
      type: 'Ministry',
      data: [
        { year: '2018', value: 55000 },
        { year: '2019', value: 63000 },
        { year: '2020', value: 70000 },
        { year: '2021', value: 110000 },
        { year: '2022', value: 140000 },
        { year: '2023', value: 160000 },
        { year: '2024', value: 240000 },
        { year: '2025', value: 252000 },
        { year: '2026', value: 255000 },
        { year: '2027', value: 262000 }
      ],
      insight: 'Railways capital outlays were significantly scaled for passenger safety, rolling stock manufacturing, and dedicated freight lines.'
    },
    pmkisan: {
      name: 'PM-KISAN Cash Support Scheme',
      type: 'Scheme',
      data: [
        { year: '2019', value: 20000 },
        { year: '2020', value: 48000 },
        { year: '2021', value: 60000 },
        { year: '2022', value: 66000 },
        { year: '2023', value: 58000 },
        { year: '2024', value: 60000 },
        { year: '2025', value: 60000 },
        { year: '2026', value: 60000 },
        { year: '2027', value: 65000 }
      ],
      insight: 'PM-KISAN has settled as a highly predictable rural direct income support mechanism with stable decadal funding slabs.'
    },
    mgnrega: {
      name: 'MGNREGA Rural Employment Scheme',
      type: 'Scheme',
      data: [
        { year: '2018', value: 55000 },
        { year: '2019', value: 61000 },
        { year: '2020', value: 71000 },
        { year: '2021', value: 111000 },
        { year: '2022', value: 98000 },
        { year: '2023', value: 89000 },
        { year: '2024', value: 86000 },
        { year: '2025', value: 86000 },
        { year: '2026', value: 86000 },
        { year: '2027', value: 90000 }
      ],
      insight: 'MGNREGA allocations peaked in 2021 as a vital social safety net during the pandemic, before stabilizing to structural baselines.'
    }
  };

  const activeEntity = historicalTrends[selectedEntity];

  // Mathematical CAGR Calculation
  const calculateCagr = () => {
    const data = activeEntity.data;
    if (data.length < 2) return 0;
    const startVal = data[0].value;
    const endVal = data[data.length - 1].value;
    const years = data.length - 1;
    if (startVal === 0) return 0;
    const cagr = (Math.pow(endVal / startVal, 1 / years) - 1) * 100;
    return cagr.toFixed(2);
  };

  const cagr = calculateCagr();

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Filters & Calculations (Left Panel) */}
      <div className="glass-panel col-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ashoka-blue)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <TrendingUp size={20} />
          Historical Trend Parameters
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Trace actual expenditure records over a 10-year span to analyze compounding growth trajectories and long-term fiscal directions.
        </p>

        {/* Entity Selector buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>SELECT MINISTRY OR SCHEME</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.keys(historicalTrends).map(key => {
              const entity = historicalTrends[key];
              const isSelected = selectedEntity === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedEntity(key)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: isSelected ? 'var(--border-glass-active)' : 'rgba(255,255,255,0.01)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--ashoka-blue)' : 'var(--border-glass)',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <span>{entity.name.split(' outlays')[0].split(' allocations')[0]}</span>
                  <span style={{
                    fontSize: '9px',
                    background: isSelected ? 'rgba(0,136,255,0.1)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? 'var(--ashoka-blue)' : 'var(--text-muted)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {entity.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CAGR Scorecard Box */}
        <div style={{
          background: 'rgba(0, 136, 255, 0.04)',
          border: '1px solid var(--ashoka-border)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: 'inset 0 0 10px rgba(0, 136, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calculator size={12} color="var(--ashoka-blue)" />
              10-YEAR COMPOUND ANNUAL GROWTH
            </span>
            <span style={{ fontSize: '9px', background: 'rgba(0,136,255,0.1)', color: 'var(--ashoka-blue)', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
              CAGR
            </span>
          </div>
          <strong style={{ fontSize: '24px', color: 'var(--ashoka-blue)' }}>{cagr}%</strong>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Calculated from {activeEntity.data[0].year} outlay (₹ {activeEntity.data[0].value.toLocaleString('en-IN')} Cr) to {activeEntity.data[activeEntity.data.length-1].year} BE (₹ {activeEntity.data[activeEntity.data.length-1].value.toLocaleString('en-IN')} Cr).
          </span>
        </div>
      </div>

      {/* Interactive Trend Chart panel (Right Panel) */}
      <div className="glass-panel col-8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--emerald)', margin: 0 }}>
              {activeEntity.name}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
              Allocation values represented in Crore Rupees (₹ Cr)
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div style={{ flex: 1 }}>
          <ChartContainer height={260}>
            <AreaChart data={activeEntity.data} margin={{ top: 10, right: 35, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCagr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ashoka-blue)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--ashoka-blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={10} />
              <YAxis 
                stroke="var(--text-secondary)" 
                fontSize={10} 
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K Cr`}
              />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${value.toLocaleString('en-IN')} Cr`, 'Allocated Budget']}
              />
              <Area type="monotone" dataKey="value" stroke="var(--ashoka-blue)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCagr)" />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Insight Callout Box */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-glass)',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <Info size={16} color="var(--ashoka-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
              Historical Context & Analysis
            </strong>
            <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {activeEntity.insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
