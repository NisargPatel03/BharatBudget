import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { IndianRupee, ShieldAlert, Award, FileSpreadsheet, Activity, ChevronRight } from 'lucide-react';

export default function OverviewDashboard({ masterData, activeYearIndex = 3 }) {
  const [userTax, setUserTax] = useState(25000);

  const timelineLabels = ['Actuals 24-25', 'BE 25-26', 'RE 25-26', 'BE 26-27'];
  const activeYearLabel = timelineLabels[activeYearIndex] || 'BE 26-27';

  // Dynamic nominal GDP corresponding to active year (in Lakh Crores)
  const gdpEstimates = [290.4, 312.8, 315.0, 326.7];
  const nominalGDP = gdpEstimates[activeYearIndex] || 326.7;

  // Extract year specific liabilities
  const latestLiabilitiesObj = masterData.union_liabilities?.[activeYearIndex] || masterData.union_liabilities?.[masterData.union_liabilities.length - 1] || {
    total_liabilities: 19977189,
    internal_debt: 17552202,
    external_liabilities: 564639
  };

  // Live Capital vs Revenue Spends dynamically bound to year
  const capEx = masterData.expenditure_stats?.capital_exp?.[activeYearIndex] || 1221821;
  const totalEx = masterData.expenditure_stats?.grand_total?.[activeYearIndex] || 5347315;
  const revEx = totalEx - capEx;

  const spendingSplit = [
    { name: 'Revenue Expenditure (Operational Spends)', value: revEx, color: 'var(--saffron)' },
    { name: 'Capital Expenditure (Infrastructure Assets)', value: capEx, color: 'var(--emerald)' }
  ];

  // Dynamic Paisa-per-Rupee Math from actual parsed outlays
  // Map index to transfers array size of 3 (24-25 = 0, 25-26 BE = 1, 25-26 RE = 1, 26-27 BE = 2)
  const transferIdx = activeYearIndex === 0 ? 0 : activeYearIndex === 3 ? 2 : 1;

  const interestOutlay = masterData.expenditure_stats?.interest_payments?.[activeYearIndex] || 1403972;
  const devolutionOutlay = masterData.transfer_stats?.devolution?.[transferIdx] || 1526255;
  const fcGrantsOutlay = masterData.transfer_stats?.fc_grants?.[transferIdx] || 129397;
  const sponsoredSchemes = masterData.transfer_stats?.sponsored_schemes?.[transferIdx] || 520333;
  const sectorSchemes = masterData.transfer_stats?.sector_schemes?.[transferIdx] || 77371;

  const calculatePaisa = (outlay) => {
    return Math.max(1, Math.round((outlay / totalEx) * 100));
  };

  const pInterest = calculatePaisa(interestOutlay);
  const pDevolution = calculatePaisa(devolutionOutlay);
  const pFCGrants = calculatePaisa(fcGrantsOutlay);
  const pSponsored = calculatePaisa(sponsoredSchemes);
  const pSector = calculatePaisa(sectorSchemes);
  const pCapital = calculatePaisa(capEx);
  
  // Remaining to make up 100 paise
  const allocatedPaise = pInterest + pDevolution + pFCGrants + pSponsored + pSector + pCapital;
  const pRemaining = 100 - allocatedPaise;

  const taxDistribution = [
    { head: "States' Share of Taxes (Devolution)", paisa: pDevolution, desc: 'Direct tax pool devolved to State Assemblies.' },
    { head: 'Capital & Infrastructure Projects', paisa: pCapital, desc: 'Highways, high-speed rail, and national grid assets.' },
    { head: 'Interest Servicing (National Debt)', paisa: pInterest, desc: 'Paying interest on historical sovereign bonds.' },
    { head: 'Centrally Sponsored Schemes', paisa: pSponsored, desc: 'Co-shared programs with State governments (e.g. MNREGA).' },
    { head: 'Central Sector Programs', paisa: pSector, desc: '100% centrally-funded programs (e.g. PM-KISAN).' },
    { head: 'Finance Commission Transfers', paisa: pFCGrants, desc: 'Special disaster relief and municipal basic grants.' },
    { head: 'Administrative & Other Spends', paisa: pRemaining > 0 ? pRemaining : 8, desc: 'Defence forces, pensions, and civil services operations.' }
  ];

  // Deficit trend timeline mapped from parsed PDF
  const deficitTimeline = [
    { year: '2024-25 Actuals', fiscal: 15.74, revenue: 5.64, primary: 4.58, fiscalPct: 4.8, revenuePct: 1.7 },
    { year: '2025-26 BE', fiscal: 15.68, revenue: 5.23, primary: 2.92, fiscalPct: 4.4, revenuePct: 1.5 },
    { year: '2025-26 RE', fiscal: 15.58, revenue: 5.26, primary: 2.84, fiscalPct: 4.4, revenuePct: 1.5 },
    { year: '2026-27 BE', fiscal: 16.95, revenue: 5.92, primary: 2.91, fiscalPct: 4.3, revenuePct: 1.5 }
  ];

  const formatLakhCrores = (val) => {
    return (val / 100000).toFixed(2);
  };

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ gap: '16px' }}>
      {/* 1. Quick Stats KIs */}
      <div className="glass-panel col-4 glow-saffron" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--saffron-glow)', padding: '16px', borderRadius: '12px', color: 'var(--saffron)' }}>
          <IndianRupee size={32} />
        </div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL OUTLAY ({activeYearLabel})</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>₹{formatLakhCrores(totalEx)} Lakh Cr</h2>
        </div>
      </div>

      <div className="glass-panel col-4 glow-emerald" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--emerald-glow)', padding: '16px', borderRadius: '12px', color: 'var(--emerald)' }}>
          <Award size={32} />
        </div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>NOMINAL GDP ({activeYearLabel})</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>₹{nominalGDP.toFixed(1)} Lakh Cr</h2>
        </div>
      </div>

      <div className="glass-panel col-4 glow-ashoka" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--ashoka-glow)', padding: '16px', borderRadius: '12px', color: 'var(--ashoka-blue)' }}>
          <ShieldAlert size={32} />
        </div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>SOVEREIGN DEBT ({activeYearLabel})</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>₹{formatLakhCrores(latestLiabilitiesObj.total_liabilities)} Lakh Cr</h2>
        </div>
      </div>

      {/* 2. Concentric Spending Chart */}
      <div className="glass-panel col-6" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={18} color="var(--emerald)" />
          Operational Spending vs. Asset Creation Outlay
        </h3>
        <div style={{ flex: 1, minHeight: '230px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingSplit}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
              >
                {spendingSplit.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₹ ${formatLakhCrores(value)} Lakh Cr`, 'Allocation']}
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
          {spendingSplit.map((entry, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: entry.color }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
              </div>
              <span style={{ fontWeight: 600 }}>₹{formatLakhCrores(entry.value)} Lakh Cr ({((entry.value/totalEx)*100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Personal Tax Calculator */}
      <div className="glass-panel col-6" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
          🔍 Personal Tax Receipt Deconstruction
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Input the income tax you pay annually. We will trace exactly down to the paisa where your contribution is allocated!
        </p>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Annual Income Tax Contribution:</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--saffron)' }}>₹ {formatCrores(userTax)}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="300000" 
            step="1000"
            value={userTax} 
            onChange={(e) => setUserTax(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--saffron)', height: '5px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '180px', paddingRight: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {taxDistribution.map((item, index) => {
              const itemShare = (userTax * (item.paisa / 100)).toFixed(0);
              return (
                <div key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{item.head}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald)' }}>₹ {formatCrores(Number(itemShare))}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{item.desc}</span>
                    <span>{item.paisa} Paise in every ₹1 ({item.paisa}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Deficit Trends Area Chart Centerpiece (NEW FEATURE) */}
      <div className="glass-panel col-12" style={{ marginTop: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="var(--saffron)" />
          Union Deficit Trajectory & Fiscal Sustainability Road
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Visualizing the official deficit indexes (Fiscal, Revenue, and Primary Deficits in Lakh Crores) alongside the target reduction route of Fiscal Deficit as % of GDP.
        </p>

        <div className="deficit-container">
          {/* Main Recharts Spline Area Chart */}
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deficitTimeline} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFiscal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--saffron)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--saffron)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--ashoka-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--ashoka-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} unit="L" />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                  formatter={(value) => [`₹ ${value} Lakh Cr`, '']}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" name="Gross Fiscal Deficit (Lakh Cr)" dataKey="fiscal" stroke="var(--saffron)" fillOpacity={1} fill="url(#colorFiscal)" strokeWidth={2} />
                <Area type="monotone" name="Revenue Deficit (Lakh Cr)" dataKey="revenue" stroke="var(--ashoka-blue)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={1.5} />
                <Area type="monotone" name="Primary Deficit (Lakh Cr)" dataKey="primary" stroke="var(--emerald)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* GDP Percentage Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '4px' }}>
              FISCAL DEFICIT (% OF GDP)
            </h4>
            {deficitTimeline.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{item.year}</span>
                <span style={{ fontWeight: 800, color: item.fiscalPct <= 4.3 ? 'var(--emerald)' : 'var(--saffron)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {item.fiscalPct}%
                  {item.fiscalPct <= 4.3 && <ChevronRight size={14} style={{ transform: 'rotate(-45deg)' }} />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
