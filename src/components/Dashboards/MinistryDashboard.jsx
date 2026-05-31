import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Landmark, TrendingUp, AlertTriangle, CalendarRange } from 'lucide-react';

const ministryData = {
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
    ]
  }
};

export default function MinistryDashboard() {
  const [selectedKey, setSelectedKey] = useState("defence");
  const data = ministryData[selectedKey];

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

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
    </div>
  );
}
