import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, Landmark, TrendingUp } from 'lucide-react';

export default function TaxDashboard({ masterData }) {
  const rawMonthly = masterData.monthly_tax_collections || [];

  // Group raw direct tax trajectory over years
  const taxTimeline = [
    { year: "2015", corpTax: 453228, incomeTax: 280287 },
    { year: "2017", corpTax: 484442, incomeTax: 341079 },
    { year: "2019", corpTax: 663572, incomeTax: 461587 },
    { year: "2021", corpTax: 457719, incomeTax: 487139 },
    { year: "2023", corpTax: 825834, incomeTax: 833307 },
    { year: "2024", corpTax: 922140, incomeTax: 902890 },
    { year: "2025 BE", corpTax: 1020000, incomeTax: 1150000 }
  ];

  // Rupee Comes From inflow distribution (100 Paise of government income)
  const inflowDistribution = [
    { name: "Borrowings (Consolidated Debt)", value: 27, color: "var(--crimson)" },
    { name: "Personal Income Tax", value: 19, color: "var(--saffron)" },
    { name: "GST & Indirect Taxes", value: 18, color: "var(--emerald)" },
    { name: "Corporate Income Tax", value: 17, color: "var(--ashoka-blue)" },
    { name: "Non-Tax Revenues (Dividends)", value: 9, color: "#a855f7" },
    { name: "Union Excise Duties", value: 5, color: "#eab308" },
    { name: "Customs Tariffs", value: 4, color: "#ec4899" },
    { name: "Non-Debt Capital Receipts", value: 1, color: "#64748b" }
  ];

  // Top state GST rankings (State of State Finances 2025)
  const stateGstRankings = [
    { state: "Maharashtra", gst: 32410 },
    { state: "Karnataka", gst: 18940 },
    { state: "Gujarat", gst: 17400 },
    { state: "Tamil Nadu", gst: 16500 },
    { state: "Uttar Pradesh", gst: 12400 },
    { state: "Haryana", gst: 10500 }
  ];

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Spline Area Chart: Direct Tax trajectory */}
      <div className="glass-panel col-7" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <TrendingUp size={20} color="var(--emerald)" />
          Direct Tax Growth Trajectory (Corporate vs. Personal Income Tax)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          10-year comparative spline timeline plotting corporate tax earnings vs personal income tax receipts (₹ in Crores).
        </p>

        <div style={{ flex: 1, minHeight: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={taxTimeline} margin={{ top: 10, right: 10, left: 35, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${formatCrores(value)} Cr`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Area name="Corporate Income Tax" type="monotone" dataKey="corpTax" stroke="var(--ashoka-blue)" strokeWidth={2.5} fillOpacity={0.05} fill="var(--ashoka-blue)" />
              <Area name="Personal Income Tax" type="monotone" dataKey="incomeTax" stroke="var(--saffron)" strokeWidth={2.5} fillOpacity={0.05} fill="var(--saffron)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Concentric Pie of Inflows (Rupee Comes From) */}
      <div className="glass-panel col-5" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Landmark size={20} color="var(--saffron)" />
          "Rupee Comes From" Inflow Receipt Split
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Percentage breakdown of every 100 Paise of national treasury income (FY 2026-27).
        </p>

        <div style={{ flex: 1, minHeight: '200px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '150px', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inflowDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {inflowDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}% (${value} Paise)`, 'Inflow Portion']}
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Scrollable Pie legends */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '180px', fontSize: '11.5px', paddingRight: '4px' }}>
            {inflowDistribution.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyGap: 'between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginLeft: '8px' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: SGST Ranking */}
      <div className="glass-panel col-12" style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <IndianRupee size={20} color="var(--ashoka-blue)" />
          Top State-wise GST Contributions (State of State Finances 2025)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {stateGstRankings.map((item, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '10px', 
                padding: '16px',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>STATE CONTRIBUTION</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>{item.state}</h4>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '8px', color: 'var(--emerald)' }}>₹ {formatCrores(item.gst)} Cr</h3>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>SGST RECEIPT POOL</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
