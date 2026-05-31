import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Landmark, TrendingUp, AlertTriangle, CalendarRange } from 'lucide-react';

const ministryData = {
  jal_shakti: {
    name: "Ministry of Jal Shakti",
    allocation: 77300,
    actual: 71200,
    growth: 8.5,
    burnRate: 92.1,
    timeline: [
      { year: "2021-22", budget: 48000, actual: 44200 },
      { year: "2022-23", budget: 55000, actual: 52100 },
      { year: "2023-24", budget: 69000, actual: 67800 },
      { year: "2024-25", budget: 75000, actual: 73900 },
      { year: "2025-26 BE", budget: 77300, actual: 71200 }
    ],
    schemes: [
      { name: "Jal Jeevan Mission (Rural Tap Water)", budget: 62000 },
      { name: "Swachh Bharat Mission (Gramin)", budget: 12500 },
      { name: "National River Conservation Outlays", budget: 2800 }
    ],
    outcomes: [
      { indicator: "Rural Household Tap Water Connections Added", target: 1.5, actual: 1.35, unit: "Cr Connections", cost: 413.3 },
      { indicator: "Open Defecation Free (ODF Plus) Villages Verified", target: 45000, actual: 41200, unit: "Villages", cost: 0.3 }
    ]
  },
  solar: {
    name: "Ministry of New & Renewable Energy",
    allocation: 19100,
    actual: 17800,
    growth: 24.2,
    burnRate: 93.2,
    timeline: [
      { year: "2021-22", budget: 7800, actual: 7200 },
      { year: "2022-23", budget: 11000, actual: 10400 },
      { year: "2023-24", budget: 14500, actual: 13900 },
      { year: "2024-25", budget: 17200, actual: 16800 },
      { year: "2025-26 BE", budget: 19100, actual: 17800 }
    ],
    schemes: [
      { name: "PM-KUSUM (Solar Pumps for Farmers)", budget: 8200 },
      { name: "Grid-Connected Solar Power Capacity Projects", budget: 6500 },
      { name: "National Green Hydrogen Mission", budget: 4400 }
    ],
    outcomes: [
      { indicator: "Grid-Connected Solar Power Capacity Installed", target: 25000, actual: 22800, unit: "MW", cost: 0.28 },
      { indicator: "Solar Pumps Distributed under PM-KUSUM", target: 120000, actual: 108000, unit: "Pumps", cost: 0.076 }
    ]
  },
  defence: {
    name: "Ministry of Defence",
    allocation: 621940,
    actual: 585240,
    growth: 4.8,
    burnRate: 94,
    timeline: [
      { year: "2021-22", budget: 478190, actual: 465210 },
      { year: "2022-23", budget: 525166, actual: 512900 },
      { year: "2023-24", budget: 593537, actual: 585120 },
      { year: "2024-25", budget: 621540, actual: 610920 },
      { year: "2025-26 BE", budget: 621940, actual: 585240 }
    ],
    schemes: [
      { name: "Army Operational Outlay", budget: 282400 },
      { name: "Navy Fleet Modernisation", budget: 115200 },
      { name: "Air Force Aircraft Purchases", budget: 98120 },
      { name: "Defence Pension Allocations", budget: 126220 }
    ],
    outcomes: [
      { indicator: "Indigenous Fighter Aircraft Produced", target: 36, actual: 32, unit: "Aircraft", cost: 110 },
      { indicator: "Border Road Infrastructure Laid", target: 450, actual: 410, unit: "km", cost: 2.5 }
    ]
  },
  highways: {
    name: "Ministry of Road Transport & Highways",
    allocation: 278000,
    actual: 262100,
    growth: 12.5,
    burnRate: 94.2,
    timeline: [
      { year: "2021-22", budget: 118101, actual: 115900 },
      { year: "2022-23", budget: 187744, actual: 182100 },
      { year: "2023-24", budget: 270435, actual: 268920 },
      { year: "2024-25", budget: 272140, actual: 271290 },
      { year: "2025-26 BE", budget: 278000, actual: 262100 }
    ],
    schemes: [
      { name: "National Highways Authority (NHAI)", budget: 168400 },
      { name: "Bharatmala Pariyojana (Phase 1)", budget: 85200 },
      { name: "State Roads Devolution Fund", budget: 24400 }
    ],
    outcomes: [
      { indicator: "National Highways Constructed", target: 12000, actual: 10800, unit: "km", cost: 14.5 },
      { indicator: "Expressways Modernised", target: 1200, actual: 1120, unit: "km", cost: 8.2 }
    ]
  },
  railways: {
    name: "Ministry of Railways",
    allocation: 255000,
    actual: 231490,
    growth: 6.2,
    burnRate: 90.7,
    timeline: [
      { year: "2021-22", budget: 111000, actual: 109240 },
      { year: "2022-23", budget: 159100, actual: 155900 },
      { year: "2023-24", budget: 240000, actual: 238120 },
      { year: "2024-25", budget: 252190, actual: 249020 },
      { year: "2025-26 BE", budget: 255000, actual: 231490 }
    ],
    schemes: [
      { name: "Vande Bharat / Train 18 Rollout", budget: 85200 },
      { name: "Track Renewals & Electrification", budget: 95000 },
      { name: "Station Redevelopment Scheme", budget: 45000 },
      { name: "Safety Outlays & Kavach System", budget: 29800 }
    ],
    outcomes: [
      { indicator: "New Track Lines Electrified", target: 6500, actual: 6100, unit: "km", cost: 1.8 },
      { indicator: "Kavach Protection System Installed", target: 2000, actual: 1500, unit: "km", cost: 0.9 }
    ]
  },
  agriculture: {
    name: "Ministry of Agriculture & Farmers Welfare",
    allocation: 127500,
    actual: 115900,
    growth: -1.2,
    burnRate: 90.9,
    timeline: [
      { year: "2021-22", budget: 123017, actual: 118400 },
      { year: "2022-23", budget: 124000, actual: 121920 },
      { year: "2023-24", budget: 115531, actual: 112100 },
      { year: "2024-25", budget: 127200, actual: 125920 },
      { year: "2025-26 BE", budget: 127500, actual: 115900 }
    ],
    schemes: [
      { name: "PM-KISAN Cash Income Support", budget: 60000 },
      { name: "PM Fasal Bima Yojana (Insurance)", budget: 15000 },
      { name: "Modified Interest Subvention (MIS)", budget: 22500 },
      { name: "Krishi Unnayan Yojana (RKVY)", budget: 30000 }
    ],
    outcomes: [
      { indicator: "Crop Loans Subvention Discharged", target: 3.2, actual: 2.9, unit: "Cr Farmers", cost: 0.12 },
      { indicator: "Soil Health Cards Distributed", target: 1.5, actual: 1.45, unit: "Cr Cards", cost: 0.02 }
    ]
  },
  rural: {
    name: "Ministry of Rural Development",
    allocation: 177566,
    actual: 184500,
    growth: 13.1,
    burnRate: 103.9,
    timeline: [
      { year: "2021-22", budget: 140210, actual: 155100 },
      { year: "2022-23", budget: 142109, actual: 152190 },
      { year: "2023-24", budget: 157545, actual: 172900 },
      { year: "2024-25", budget: 177566, actual: 184500 },
      { year: "2025-26 BE", budget: 177566, actual: 161200 }
    ],
    schemes: [
      { name: "MNREGA Rural Employment", budget: 86000 },
      { name: "PM Awas Yojana-Gramin (Housing)", budget: 54500 },
      { name: "PM Gram Sadak Yojana (Rural Roads)", budget: 19000 },
      { name: "National Rural Livelihoods (DAY-NRLM)", budget: 18066 }
    ],
    outcomes: [
      { indicator: "PMAY-G Rural Houses Built", target: 4.8, actual: 4.3, unit: "Million Houses", cost: 0.15 },
      { indicator: "MNREGA Mandays Generated", target: 240, actual: 260, unit: "Cr Mandays", cost: 0.04 }
    ]
  },
  health: {
    name: "Ministry of Health and Family Welfare",
    allocation: 90287,
    actual: 82400,
    growth: 12.8,
    burnRate: 91.2,
    timeline: [
      { year: "2021-22", budget: 73931, actual: 71200 },
      { year: "2022-23", budget: 79145, actual: 76500 },
      { year: "2023-24", budget: 80517, actual: 79200 },
      { year: "2024-25", budget: 90287, actual: 88400 },
      { year: "2025-26 BE", budget: 90287, actual: 82400 }
    ],
    schemes: [
      { name: "National Health Mission (NHM)", budget: 36000 },
      { name: "Ayushman Bharat - PMJAY Insurance", budget: 7500 },
      { name: "AIIMS Infrastructure Projects", budget: 18500 },
      { name: "Health Infrastructure Mission (PM-ABHIM)", budget: 28287 }
    ],
    outcomes: [
      { indicator: "Ayushman E-Cards Issued", target: 8.5, actual: 8.1, unit: "Cr Cards", cost: 0.015 },
      { indicator: "New AIIMS Beds Operationalised", target: 4500, actual: 4100, unit: "Beds", cost: 0.45 }
    ]
  }
};

export default function MinistryDashboard() {
  const [selectedKey, setSelectedKey] = useState("defence");
  const [compMinistryA, setCompMinistryA] = useState("defence");
  const [compMinistryB, setCompMinistryB] = useState("highways");
  const data = ministryData[selectedKey];

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  const ministryTimelineA = ministryData[compMinistryA]?.timeline || [];
  const ministryTimelineB = ministryData[compMinistryB]?.timeline || [];

  const comparisonData = ministryTimelineA.map((item, idx) => {
    const itemB = ministryTimelineB[idx] || {};
    return {
      year: item.year,
      [`${ministryData[compMinistryA]?.name} (BE)`]: item.budget,
      [`${ministryData[compMinistryB]?.name} (BE)`]: itemB.budget || 0
    };
  });

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* Selector & Core KPIs */}
      <div className="glass-panel col-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>SELECT MINISTRY DEVELUPMENT</span>
          <select 
            value={selectedKey} 
            onChange={(e) => setSelectedKey(e.target.value)}
            style={{ 
              display: 'block',
              width: '320px',
              padding: '10px 14px', 
              background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            {Object.keys(ministryData).map((key) => (
              <option key={key} value={key}>{ministryData[key].name}</option>
            ))}
          </select>
        </div>

        {/* 3 mini KIs */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>BUDGET ALLOCATED (BE)</span>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--saffron)' }}>₹ {formatCrores(data.allocation)} Cr</h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>DRAWN EXPENSES (CGA)</span>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--emerald)' }}>₹ {formatCrores(data.actual)} Cr</h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>YoY ALLOCATION TREND</span>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: data.growth >= 0 ? 'var(--emerald)' : 'var(--crimson)' }}>
              {data.growth >= 0 ? `+${data.growth}%` : `${data.growth}%`}
            </h4>
          </div>
        </div>
      </div>

      {/* Spends progress & sub-scheme cards */}
      <div className="glass-panel col-4" style={{ display: 'flex', flexDirection: 'column', justifyGap: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <AlertTriangle size={18} color="var(--saffron)" />
          Expenditure Burn Progress
        </h3>
        
        {/* Glow progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span>Utilization Rate:</span>
            <span style={{ fontWeight: 700, color: 'var(--saffron)' }}>{data.burnRate}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${Math.min(data.burnRate, 100)}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--saffron), #ff9900)',
                boxShadow: '0 0 10px var(--saffron-glow)'
              }}
            ></div>
          </div>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {data.burnRate > 100 
              ? "⚠️ Warning: Spends exceeded initial Budget Estimates (BE) limits." 
              : "✅ Healthy execution burn-rate based on current seasonal ledger files."}
          </span>
        </div>

        {/* Scheme Allocations */}
        <div>
          <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>MAJOR SCHEME ALLOCATIONS:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.schemes.map((scheme, index) => (
              <div key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{scheme.name}</span>
                  <span style={{ color: 'var(--ashoka-blue)' }}>₹ {formatCrores(scheme.budget)} Cr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target vs Actual (Bar chart) */}
      <div className="glass-panel col-8" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Landmark size={18} color="var(--ashoka-blue)" />
          Budget Targets (BE) vs Actual Drawn Expenditure (CGA)
        </h3>
        <div style={{ flex: 1, minHeight: '230px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${formatCrores(value)} Cr`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar name="Budget Estimate (BE)" dataKey="budget" fill="var(--saffron)" radius={[4, 4, 0, 0]} />
              <Bar name="CGA Spend (Actual)" dataKey="actual" fill="var(--emerald)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Physical Outcome Accountability Indicators & Cost-per-Unit Benchmarks */}
      <div className="glass-panel col-12" style={{ marginTop: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--emerald)' }}>
          <CalendarRange size={20} />
          Physical Outcome Accountability Metrics (Target vs. Actuals)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {data.outcomes?.map((obj, idx) => {
            const pct = Math.round((obj.actual / obj.target) * 100);
            return (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{obj.indicator}</h4>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--emerald)' }}>{pct}% MET</span>
                </div>
                
                {/* Visual Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: 'var(--emerald)', borderRadius: '3px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Target: {obj.target} {obj.unit}</span>
                  <strong>Actual: {obj.actual} {obj.unit}</strong>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Computed Cost Efficiency:</span>
                  <strong style={{ color: 'var(--saffron)' }}>₹ {obj.cost} Cr per {obj.unit.substring(0, obj.unit.length - 1)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Year line trend (Line chart) */}
      <div className="glass-panel col-12" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <TrendingUp size={18} color="var(--emerald)" />
          Historical Allocation Trajectory Timeline
        </h3>
        <div style={{ flex: 1, minHeight: '210px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${formatCrores(value)} Cr`, '']}
              />
              <Line name="Allocation Path" type="monotone" dataKey="budget" stroke="var(--emerald)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Cross-Ministry spending Correlation Matrix */}
      <div className="glass-panel col-12" style={{ marginTop: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--saffron)' }}>
              <TrendingUp size={18} />
              Cross-Ministry Spending Correlation & YoY Divergence
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Compare 5-year budget growth paths side-by-side to analyze inter-ministry budget devolution balance.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select 
              value={compMinistryA} 
              onChange={(e) => setCompMinistryA(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
            >
              {Object.keys(ministryData).map((k) => (
                <option key={k} value={k}>{ministryData[k].name}</option>
              ))}
            </select>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>vs</span>
            <select 
              value={compMinistryB} 
              onChange={(e) => setCompMinistryB(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
            >
              {Object.keys(ministryData).map((k) => (
                <option key={k} value={k}>{ministryData[k].name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Comparative Multi-Line Chart */}
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={10} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line name={`${ministryData[compMinistryA]?.name} (BE)`} type="monotone" dataKey={`${ministryData[compMinistryA]?.name} (BE)`} stroke="var(--saffron)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line name={`${ministryData[compMinistryB]?.name} (BE)`} type="monotone" dataKey={`${ministryData[compMinistryB]?.name} (BE)`} stroke="var(--ashoka-blue)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* YoY Growth Divergence Insights */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '16px', fontSize: '12px', display: 'flex', flexDirection: 'column', justifyGap: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              📊 Computed Growth Divergence & Capital Devolution Check
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{ministryData[compMinistryA]?.name} 5-Yr Growth:</span>
                <strong style={{ color: 'var(--saffron)' }}>
                  {(((ministryTimelineA[ministryTimelineA.length - 1]?.budget || 0) / (ministryTimelineA[0]?.budget || 1) - 1) * 100).toFixed(1)}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{ministryData[compMinistryB]?.name} 5-Yr Growth:</span>
                <strong style={{ color: 'var(--ashoka-blue)' }}>
                  {(((ministryTimelineB[ministryTimelineB.length - 1]?.budget || 0) / (ministryTimelineB[0]?.budget || 1) - 1) * 100).toFixed(1)}%
                </strong>
              </div>
              
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '4px' }}>
                <span style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>EXECUTIVE DEVOLUTION VERDICT</span>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {Math.abs((((ministryTimelineA[ministryTimelineA.length - 1]?.budget || 0) / (ministryTimelineA[0]?.budget || 1) - 1) * 100) - (((ministryTimelineB[ministryTimelineB.length - 1]?.budget || 0) / (ministryTimelineB[0]?.budget || 1) - 1) * 100)) > 25
                    ? `⚠️ High Allocative Divergence: ${ministryData[compMinistryA]?.name} and ${ministryData[compMinistryB]?.name} show strongly asymmetric expansion profiles. Investigate planning priorities.`
                    : `✅ Balanced Capital Devolution: Both ministries show closely correlated YoY budget scaling. Consistent with baseline public asset expansions.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
