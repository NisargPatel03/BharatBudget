import React, { useState } from 'react';
import { Sliders, Cpu, Info, RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Landmark } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartContainer from '../ChartContainer';

export default function SimulatorDashboard() {
  // Baseline fiscal values (in INR Crores) for FY 2026-27 BE
  const BASE_NOMINAL_GDP = 32670000; // 326.7 Lakh Crores
  const BASE_TAX_REVENUE = 3010000; // 30.1 Lakh Crores
  const BASE_SPENDING = 5347315; // 53.47 Lakh Crores

  // User slider states
  const [gstRate, setGstRate] = useState(18); // Default 18%
  const [corpTaxRate, setCorpTaxRate] = useState(22); // Default 22%
  const [capexShift, setCapexShift] = useState(0); // Default 0% change
  const [schemeShift, setSchemeShift] = useState(0); // Default 0% change

  // 1. Economic Forecasting Multiplier & Elasticity Mathematics
  // GST Elasticity (base 18%, compliance declines as rates become excessively high - Laffer Effect)
  const gstCompliance = Math.exp(-0.02 * Math.max(0, gstRate - 18));
  const projectedGstRevenue = (BASE_TAX_REVENUE * 0.34) * (gstRate / 18) * gstCompliance;

  // Corporate Tax Elasticity (base 22%, compliance declines at higher rates)
  const corpCompliance = Math.exp(-0.03 * Math.max(0, corpTaxRate - 22));
  const projectedCorpRevenue = (BASE_TAX_REVENUE * 0.41) * (corpTaxRate / 22) * corpCompliance;

  // Other constant tax components (Customs, Excise)
  const constantTaxRevenue = BASE_TAX_REVENUE * 0.25;

  // Total Tax Revenue
  const totalProjectedRevenue = projectedGstRevenue + projectedCorpRevenue + constantTaxRevenue;

  // Spend multipliers: CapEx shift creates a 1.5x GDP multiplier, Scheme outlays create a 0.8x GDP multiplier
  const capexChangeAmount = (BASE_SPENDING * 0.23) * (capexShift / 100);
  const schemeChangeAmount = (BASE_SPENDING * 0.33) * (schemeShift / 100);

  const totalProjectedSpending = BASE_SPENDING + capexChangeAmount + schemeChangeAmount;

  // Nominal GDP adjustments based on strategic expenditure multipliers
  const gdpShift = (capexChangeAmount * 1.5) + (schemeChangeAmount * 0.8);
  const projectedGdp = BASE_NOMINAL_GDP + gdpShift;

  // Fiscal Deficit ratio computation
  const deficitAmount = Math.max(0, totalProjectedSpending - totalProjectedRevenue);
  const deficitPercentage = (deficitAmount / projectedGdp) * 100;

  // Debt-to-GDP projection (base is 56.2% of GDP)
  const projectedDebtRatio = 56.2 + (deficitPercentage - 4.3) * 0.85;

  // Reset to budget baseline values
  const handleReset = () => {
    setGstRate(18);
    setCorpTaxRate(22);
    setCapexShift(0);
    setSchemeShift(0);
  };

  // Generate 5-Year forecast projections based on parameters
  const forecastData = Array.from({ length: 5 }, (_, i) => {
    const year = 2027 + i;
    const growthFactor = 1 + (0.075 + (capexShift / 100) * 0.01) * i;
    const yearRevenue = totalProjectedRevenue * growthFactor;
    const yearSpending = totalProjectedSpending * (1 + 0.06 * i);
    return {
      year: `FY ${year}`,
      "Revenue Outflow": Math.round(yearRevenue),
      "Expenditure Target": Math.round(yearSpending)
    };
  });

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. Control Center Sliders (Left Column) */}
      <div className="glass-panel col-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--saffron)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Sliders size={20} />
            Fiscal Control Sandbox
          </h3>
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '11px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <RefreshCw size={12} /> Reset Baseline
          </button>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Modify sovereign tax rates and spend vectors. The simulator's multi-factor model will calculate the projected Laffer compliance limits and GDP multipliers in real-time.
        </p>

        {/* GST Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>GST Standard Rate Slabs</span>
            <span style={{ color: 'var(--saffron)' }}>{gstRate}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="28"
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--saffron)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Min: 5% (Relief Slabs)</span>
            <span>Compliance Index: {Math.round(gstCompliance * 100)}%</span>
            <span>Max: 28%</span>
          </div>
        </div>

        {/* Corporate Tax Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>Corporate Tax Rate</span>
            <span style={{ color: 'var(--ashoka-blue)' }}>{corpTaxRate}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="35"
            value={corpTaxRate}
            onChange={(e) => setCorpTaxRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--ashoka-blue)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Min: 15% (Special CapEx)</span>
            <span>Laffer Curve Cap: {Math.round(corpCompliance * 100)}%</span>
            <span>Max: 35%</span>
          </div>
        </div>

        {/* Infrastructure CapEx Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>Infrastructure CapEx Split</span>
            <span style={{ color: capexShift >= 0 ? 'var(--emerald)' : 'var(--crimson)' }}>
              {capexShift >= 0 ? `+${capexShift}` : capexShift}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={capexShift}
            onChange={(e) => setCapexShift(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--emerald)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Austerity: -50%</span>
            <span>GDP multiplier: 1.5x</span>
            <span>Expansion: +50%</span>
          </div>
        </div>

        {/* Scheme DBT Outlays Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>Scheme DBT Pool Outlays</span>
            <span style={{ color: schemeShift >= 0 ? 'var(--emerald)' : 'var(--crimson)' }}>
              {schemeShift >= 0 ? `+${schemeShift}` : schemeShift}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={schemeShift}
            onChange={(e) => setSchemeShift(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--emerald)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Reduction: -50%</span>
            <span>Fiscal multiplier: 0.8x</span>
            <span>Expansion: +50%</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Projections & Indicator Panel (Right Column) */}
      <div className="glass-panel col-7" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Cpu size={20} />
          AI Macro-Economic Forecast Outflow
        </h3>

        {/* Top Real-time Indicator Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          
          {/* Fiscal Deficit Arc Dial Gauge */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}>
              FISCAL DEFICIT %
            </span>
            <div style={{ position: 'relative', width: '90px', height: '50px', overflow: 'hidden' }}>
              {/* Semi-circular background path */}
              <svg width="90" height="50">
                <path d="M 10 50 A 35 35 0 0 1 80 50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 35 35 0 0 1 80 50" 
                  fill="none" 
                  stroke={deficitPercentage > 5.5 ? 'var(--crimson)' : deficitPercentage > 4.5 ? 'var(--saffron)' : 'var(--emerald)'} 
                  strokeWidth="8" 
                  strokeDasharray={`${(Math.min(10, deficitPercentage) / 10) * 110} 110`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.3s' }}
                />
              </svg>
              <strong style={{ position: 'absolute', bottom: '0', left: '0', right: '0', fontSize: '15px', color: '#fff', fontWeight: 800 }}>
                {deficitPercentage.toFixed(2)}%
              </strong>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Base Target: 4.30%
            </span>
          </div>

          {/* Nominal GDP Dial */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
              NOMINAL GDP OUTLOOK
            </span>
            <strong style={{ fontSize: '18px', color: 'var(--emerald)', fontWeight: 800 }}>
              ₹{(projectedGdp / 100000).toFixed(2)}L Cr
            </strong>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', justifySelf: 'center', gap: '3px', justifyContent: 'center' }}>
              {gdpShift >= 0 ? <TrendingUp size={11} color="var(--emerald)" /> : <TrendingDown size={11} color="var(--crimson)" />}
              <span style={{ color: gdpShift >= 0 ? 'var(--emerald)' : 'var(--crimson)' }}>
                {gdpShift >= 0 ? '+' : ''}{(gdpShift / 1000).toFixed(0)}K Cr Shift
              </span>
            </span>
          </div>

          {/* Debt-to-GDP Dial */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
              DEBT-TO-GDP %
            </span>
            <strong style={{ fontSize: '18px', color: projectedDebtRatio > 58 ? 'var(--crimson)' : projectedDebtRatio > 56.5 ? 'var(--saffron)' : 'var(--emerald)', fontWeight: 800 }}>
              {projectedDebtRatio.toFixed(2)}%
            </strong>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sovereign target: &lt;56.0%
            </span>
          </div>
        </div>

        {/* Dynamic warning if sovereign bounds are exceeded */}
        {deficitPercentage > 5.2 && (
          <div style={{
            background: 'rgba(255, 59, 48, 0.08)',
            border: '1px solid rgba(255, 59, 48, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <AlertTriangle color="var(--crimson)" size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '11.5px', color: '#ffc5c5', lineHeight: '1.4' }}>
              <strong>AI Economic Threat warning:</strong> High fiscal deficit of <strong>{deficitPercentage.toFixed(2)}%</strong> will trigger sovereign debt rating downgrades and increase treasury yields. We recommend increasing tax compliance yields or checking scheme spends!
            </span>
          </div>
        )}

        {/* Recharts Area Chart Projections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            5-YEAR REVENUE VS SPENDING OUTLOOK (INR CRORES)
          </span>
          <ChartContainer height={220}>
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--saffron)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--saffron)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={10} />
              <YAxis stroke="var(--text-secondary)" fontSize={10} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${value.toLocaleString('en-IN')} Cr`]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="Revenue Outflow" stroke="var(--emerald)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="Expenditure Target" stroke="var(--saffron)" strokeWidth={2} fillOpacity={1} fill="url(#colorSpending)" />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
