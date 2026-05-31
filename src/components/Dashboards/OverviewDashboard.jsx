import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IndianRupee, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

export default function OverviewDashboard({ masterData }) {
  const [userTax, setUserTax] = useState(25000);

  // Extract latest liabilities
  const latestLiabilitiesObj = masterData.union_liabilities?.[masterData.union_liabilities.length - 1] || {
    total_liabilities: 17552202,
    internal_debt: 12302815,
    external_liabilities: 564639
  };

  // 2026-27 spending allocations
  const spendingSplit = [
    { name: 'Revenue Expenditure (Operational)', value: 3712390, color: 'var(--saffron)' },
    { name: 'Capital Expenditure (Infrastructure)', value: 1111110, color: 'var(--emerald)' }
  ];

  // Rupee Goes To Tax devotions (Paisa per Rupee)
  const taxDistribution = [
    { head: 'Interest Payments (National Debt)', paisa: 20, desc: 'Servicing domestic sovereign bonds and loans.' },
    { head: "States' Share of Taxes & Duties", paisa: 20, desc: 'Central tax pool devolved directly to State assemblies.' },
    { head: 'Central Sector Schemes', paisa: 16, desc: '100% centrally-funded programs (e.g. PM-KISAN, crop insurance).' },
    { head: 'Finance Commission Transfers', paisa: 9, desc: 'Special grants for local bodies and disaster relief.' },
    { head: 'Centrally Sponsored Schemes', paisa: 8, desc: 'Co-shared programs with State governments (e.g. MNREGA).' },
    { head: 'Defence Force Allocations', paisa: 8, desc: 'Army, Navy, Air Force maintenance and capital acquisition.' },
    { head: 'Direct Welfare Subsidies', paisa: 6, desc: 'Subsidized cooking gas, food grain security, and fertilizers.' },
    { head: 'Pensions & Gratuities', paisa: 4, desc: 'Pensions for retired civil, military, and railways personnel.' },
    { head: 'General Civil Spends', paisa: 9, desc: 'Administrative costs, border management, and miscellaneous.' }
  ];

  // Compute receipt shares
  const formatLakhCrores = (val) => {
    return (val / 100000).toFixed(2);
  };

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Quick Stats KIs */}
      <div className="glass-panel col-4 glow-saffron" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--saffron-glow)', padding: '16px', borderRadius: '12px', color: 'var(--saffron)' }}>
          <IndianRupee size={32} />
        </div>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>TOTAL BUDGET OUTLAY (BE)</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>₹48.2 Lakh Cr</h2>
        </div>
      </div>

      <div className="glass-panel col-4 glow-emerald" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--emerald-glow)', padding: '16px', borderRadius: '12px', color: 'var(--emerald)' }}>
          <Award size={32} />
        </div>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>ESTIMATED NOMINAL GDP</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>₹326 Lakh Cr</h2>
        </div>
      </div>

      <div className="glass-panel col-4 glow-ashoka" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--ashoka-glow)', padding: '16px', borderRadius: '12px', color: 'var(--ashoka-blue)' }}>
          <ShieldAlert size={32} />
        </div>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>CENTRAL SOVEREIGN DEBT</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>₹{formatLakhCrores(latestLiabilitiesObj.total_liabilities)} Lakh Cr</h2>
        </div>
      </div>

      {/* 2. Concentric Spending Chart */}
      <div className="glass-panel col-6" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={20} color="var(--emerald)" />
          Operational vs. Infrastructure Outlay (2026-27)
        </h3>
        <div style={{ flex: 1, minHeight: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingSplit}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
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
        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '13px', marginTop: '12px' }}>
          {spendingSplit.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: entry.color }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Personal Tax Calculator */}
      <div className="glass-panel col-6" style={{ minHeight: '380px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
          🔍 Personal Tax Receipt Calculator
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Enter the income tax you pay annually. We will calculate exactly down to the paisa where your contribution is spent!
        </p>

        {/* Input box & Slider */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Your Paid Income Tax:</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--saffron)' }}>₹ {formatCrores(userTax)}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="500000" 
            step="1000"
            value={userTax} 
            onChange={(e) => setUserTax(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--saffron)', height: '6px', borderRadius: '3px', cursor: 'pointer' }}
          />
        </div>

        {/* Calculated Devolution Pool */}
        <div style={{ overflowY: 'auto', maxHeight: '200px', paddingRight: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {taxDistribution.map((item, index) => {
              const itemShare = (userTax * (item.paisa / 100)).toFixed(2);
              return (
                <div key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.head}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald)' }}>₹ {formatCrores(Math.round(itemShare))}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{item.desc}</span>
                    <span>{item.paisa}% share ({item.paisa} Paise)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
