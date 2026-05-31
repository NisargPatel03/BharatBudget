import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Search, Info, TrendingUp, TrendingDown, ArrowUpRight, Award, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function SchemeDashboard({ masterData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState('1'); // Default to Rashtriya Krishi Vikas Yojna

  const allSchemes = masterData.all_schemes || [];
  
  // Filter schemes based on search term
  const filteredSchemes = allSchemes.filter(scheme => 
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get currently selected scheme details
  const activeScheme = allSchemes.find(s => s.id === selectedSchemeId) || filteredSchemes[0] || allSchemes[0] || {
    id: "1", name: "Rashtriya Krishi Vikas Yojna", val_24_25: 7228, val_25_26_be: 8500, val_25_26_re: 7000, val_26_27_be: 8550
  };

  // Recharts YoY data structure
  const chartData = [
    { name: '2024-25 Actuals', 'Outlay (₹ Cr)': activeScheme.val_24_25 },
    { name: '2025-26 BE', 'Outlay (₹ Cr)': activeScheme.val_25_26_be },
    { name: '2025-26 RE', 'Outlay (₹ Cr)': activeScheme.val_25_26_re },
    { name: '2026-27 BE', 'Outlay (₹ Cr)': activeScheme.val_26_27_be }
  ];

  // Outlay growth math
  const diffBE = activeScheme.val_26_27_be - activeScheme.val_25_26_be;
  const growthRate = activeScheme.val_25_26_be > 0 
    ? ((diffBE / activeScheme.val_25_26_be) * 100).toFixed(1) 
    : '0.0';

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ gap: '16px' }}>
      
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

      {/* 2. Left Side: Searchable Scheme Explorer Directory */}
      <div className="glass-panel col-5" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
          🔍 Searchable Scheme Outlays Directory
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Explore multi-year budget targets across all {allSchemes.length} major Central schemes.
        </p>

        {/* Search input field */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Type scheme name (e.g. Samagra, MGNREGA, PMAY)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '10px 12px 10px 38px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border 0.25s ease'
            }}
          />
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px', paddingRight: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme) => {
                const isSelected = selectedSchemeId === scheme.id;
                return (
                  <div
                    key={scheme.id}
                    onClick={() => setSelectedSchemeId(scheme.id)}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '12px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {scheme.name}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Scheme ID: #{scheme.id}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--saffron)' }}>
                        ₹ {formatCrores(scheme.val_26_27_be)} Cr
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        BE 2026-27 Allocation
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0', fontSize: '13px' }}>
                No schemes match your search filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Right Side: YoY Scheme Spline Area Chart */}
      <div className="glass-panel col-7" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              📈 Allocation Trajectory Curve
            </h3>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Active Scheme: <strong style={{ color: 'var(--saffron)' }}>{activeScheme.name}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: parseFloat(growthRate) >= 0 ? 'var(--emerald-glow)' : 'var(--crimson-glow)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {parseFloat(growthRate) >= 0 ? (
              <TrendingUp size={16} color="var(--emerald)" />
            ) : (
              <TrendingDown size={16} color="var(--crimson-red)" />
            )}
            <span style={{ fontSize: '13px', fontWeight: 700, color: parseFloat(growthRate) >= 0 ? 'var(--emerald)' : 'var(--crimson-red)' }}>
              {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}% Growth
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div style={{ flex: 1, minHeight: '200px', marginBottom: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="schemeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--saffron)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--saffron)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} unit=" Cr" />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${formatCrores(value)} Cr`, 'Allocation']}
              />
              <Area type="monotone" dataKey="Outlay (₹ Cr)" stroke="var(--saffron)" fillOpacity={1} fill="url(#schemeGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Outlay quick analysis breakdown */}
        <div className="scheme-outlay-grid" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Target Allocation BE 2026-27:</span>
            <strong style={{ fontSize: '16px', fontWeight: 800, color: 'var(--emerald)' }}>
              ₹ {formatCrores(activeScheme.val_26_27_be)} Crore
            </strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Net YoY Allocation Increase:</span>
            <strong style={{ fontSize: '16px', fontWeight: 800, color: diffBE >= 0 ? 'var(--ashoka-blue)' : 'var(--crimson-red)' }}>
              {diffBE >= 0 ? '+' : ''}₹ {formatCrores(diffBE)} Crore
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
