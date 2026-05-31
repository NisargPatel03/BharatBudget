import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

export default function SchemeDashboard({ masterData }) {
  const [selectedSchemeIndex, setSelectedSchemeIndex] = useState(0);
  const schemes = masterData.dbt_schemes || [];
  const activeScheme = schemes[selectedSchemeIndex] || schemes[0];

  const formatLakhCrores = (val) => {
    return (val / 100000000000).toFixed(2);
  };

  const formatCrores = (val) => {
    return Math.round(val / 10000000).toLocaleString('en-IN');
  };

  // Static gauges for Allocated vs Released vs Spent (representing execution speeds)
  const executionGauges = [
    { name: "PAHAL", allocated: 18000, released: 17429, spent: 17429, utilization: 96.8 },
    { name: "MGNREGS", allocated: 86000, released: 65217, spent: 65217, utilization: 75.8 },
    { name: "NSAP", allocated: 9600, released: 3535, spent: 3535, utilization: 36.8 }, // Lagging alarm!
    { name: "SCHOLARSHIP", allocated: 22000, released: 14988, spent: 14988, utilization: 68.1 },
    { name: "PMAYG", allocated: 54500, released: 49188, spent: 49188, utilization: 90.2 },
    { name: "PDS", allocated: 205000, released: 165080, spent: 165080, utilization: 80.5 },
    { name: "FERTILIZER", allocated: 220000, released: 197729, spent: 197729, utilization: 89.8 }
  ];

  const activeGauge = executionGauges.find(g => g.name === activeScheme.name) || { allocated: 100, released: 80, spent: 80, utilization: 80 };

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Dynamic Welfare Indicators */}
      <div className="glass-panel col-4 glow-saffron" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--saffron-glow)', padding: '16px', borderRadius: '12px', color: 'var(--saffron)' }}>
          <Award size={32} />
        </div>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>TOTAL DBT TRANSFERRED</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>₹ 7.30 Lakh Cr</h2>
        </div>
      </div>

      <div className="glass-panel col-4 glow-emerald" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--emerald-glow)', padding: '16px', borderRadius: '12px', color: 'var(--emerald)' }}>
          <ShieldCheck size={32} />
        </div>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>CUMULATIVE LEAKAGES PREVENTED</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>₹ 4.31 Lakh Cr</h2>
        </div>
      </div>

      <div className="glass-panel col-4 glow-ashoka" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--ashoka-glow)', padding: '16px', borderRadius: '12px', color: 'var(--ashoka-blue)' }}>
          <FileSpreadsheet size={32} />
        </div>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>DBT TRANSACTIONS RECORDED</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>713 Crore</h2>
        </div>
      </div>

      {/* 2. Left Side: Active Welfare Leaderboard */}
      <div className="glass-panel col-6" style={{ minHeight: '380px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
          🏆 Central Welfare DBT Scheme Leaderboard
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {schemes.slice(0, 7).map((scheme, idx) => {
            const isSelected = selectedSchemeIndex === idx;
            return (
              <div 
                key={idx}
                className="animate-fade-in"
                onClick={() => setSelectedSchemeIndex(idx)}
                style={{ 
                  background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--border-glass-active)' : 'transparent',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{scheme.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{scheme.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--saffron)' }}>₹ {formatLakhCrores(scheme.dbt_amt)} Lakh Cr</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{Math.round(scheme.tx_count / 1000000)}M transactions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Right Side: Underutilization Alarms & Execution Speed */}
      <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', justifyGap: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          📊 Scheme Execution & Allocation Ratios
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Detailed audit tracking comparing actual funds allocated vs. released to state accounts.
        </p>

        {/* 3-bar execution gauge */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--emerald)', marginBottom: '16px' }}>{activeScheme.name} Progress Indicators</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyGap: 'between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Initial Allocation (BE):</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹ {formatCrores(activeGauge.allocated * 10000000)} Cr</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--ashoka-blue)', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyGap: 'between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Actual Funds Released:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹ {formatCrores(activeGauge.released * 10000000)} Cr</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                <div style={{ width: `${(activeGauge.released / activeGauge.allocated) * 100}%`, height: '100%', background: 'var(--saffron)', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyGap: 'between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Utilization Factor:</span>
                <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>{activeGauge.utilization}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                <div style={{ width: `${activeGauge.utilization}%`, height: '100%', background: 'var(--emerald)', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Warning callout for underutilized schemes */}
        <div 
          className="glow-crimson"
          style={{ 
            background: 'var(--crimson-glow)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255,59,48,0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <ShieldAlert size={24} color="var(--crimson)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>⚠️ UNDERUTILIZATION ALARM ACTIVE</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <strong>National Social Assistance Program (NSAP)</strong> is lagging critically behind schedules, holding an execution burn of only <strong>36.8%</strong>. Delayed state-level pension mappings have blocked funds devolving to elderly accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
