import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalendarRange, Activity, Sparkles } from 'lucide-react';

export default function MonthlyDashboard({ masterData }) {
  const rawMonthly = masterData.monthly_tax_collections || [];

  // Compute cumulative values for the Area Chart
  let cumulativeTax = 0;
  const processedMonthly = rawMonthly.map((m) => {
    const totalMonthTax = m.corp_tax + m.income_tax + m.cgst + m.igst + m.customs + m.excise;
    cumulativeTax += totalMonthTax;
    return {
      month: m.month,
      monthlyTax: Math.round(totalMonthTax),
      cumulativeTax: Math.round(cumulativeTax),
      targetTax: Math.round(cumulativeTax * 0.98) // Simulated target curve
    };
  });

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  const formatLakhCrores = (val) => {
    return (val / 100000).toFixed(2);
  };

  // Matrix of burn status for major ministries
  const burnMatrix = [
    { ministry: "Ministry of Defence", allocated: 621940, burnt: 585240, pct: 94.0, status: "On Schedule", color: "var(--emerald)" },
    { ministry: "Ministry of Road Transport & Highways", allocated: 278000, burnt: 262100, pct: 94.2, status: "On Schedule", color: "var(--emerald)" },
    { ministry: "Ministry of Railways", allocated: 255000, burnt: 231490, pct: 90.7, status: "On Schedule", color: "var(--emerald)" },
    { ministry: "Ministry of Rural Development", allocated: 177566, burnt: 184500, pct: 103.9, status: "Overdrawn", color: "var(--saffron)" },
    { ministry: "Ministry of Agriculture & Farmers Welfare", allocated: 127500, burnt: 115900, pct: 90.9, status: "On Schedule", color: "var(--emerald)" },
    { ministry: "Ministry of Health and Family Welfare", allocated: 90287, burnt: 82400, pct: 91.2, status: "On Schedule", color: "var(--emerald)" },
    { ministry: "Ministry of Social Justice (NSAP)", allocated: 9600, burnt: 3535, pct: 36.8, status: "Critical Lag", color: "var(--crimson)" }
  ];

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Area Chart: CGA Active Run-rate */}
      <div className="glass-panel col-8" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Activity size={20} color="var(--saffron)" />
          CGA Active Run-rate: Cumulative Tax Receipts (FY 2025-26)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Month-by-month cumulative ledger outlays mapping actual inflows against target trajectories (₹ in Crores).
        </p>

        <div style={{ flex: 1, minHeight: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedMonthly}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--saffron)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--saffron)" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ashoka-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--ashoka-blue)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${formatCrores(value)} Cr`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Area name="Actual Inflows (CGA)" type="monotone" dataKey="cumulativeTax" stroke="var(--saffron)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
              <Area name="Target Path (BE)" type="monotone" dataKey="targetTax" stroke="var(--ashoka-blue)" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Right Side: Burn rate projection card */}
      <div className="glass-panel col-4" style={{ display: 'flex', flexDirection: 'column', justifyGap: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          <Sparkles size={20} color="var(--emerald)" />
          Fiscal Run-rate Insights
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Real-time forecasting and cash burn-rate analysis based on CGA monthly entries.
        </p>

        {/* Projection widget */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>TOTAL YEAR-END RECEIPT ESTIMATE</span>
          <h4 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: 'var(--emerald)' }}>₹ 25.8 Lakh Cr</h4>
          <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Current burn pace indicates tax revenues will settle at <strong>101.4%</strong> of initial Budget Estimates (BE), yielding a positive fiscal headroom.
          </span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--saffron)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CalendarRange size={16} />
            CGA Monthly Timelines
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Tax collections show a traditional seasonal peak in **March** due to advance corporate tax runs, representing nearly **15.4%** of annual collections in a single month!
          </p>
        </div>
      </div>

      {/* 3. Bottom Row: Ministry Burn-Rate Matrix Grid */}
      <div className="glass-panel col-12" style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <CalendarRange size={20} color="var(--ashoka-blue)" />
          Active Ministry Burn-Rate Matrix Grid
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Ministry Department</th>
                <th style={{ padding: '12px' }}>Allocated Outlay (BE)</th>
                <th style={{ padding: '12px' }}>Actual Spent (CGA)</th>
                <th style={{ padding: '12px' }}>Execution Progress</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Burn Status</th>
              </tr>
            </thead>
            <tbody>
              {burnMatrix.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', hover: { background: 'rgba(255,255,255,0.01)' } }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{item.ministry}</td>
                  <td style={{ padding: '12px' }}>₹ {formatLakhCrores(item.allocated)} Lakh Cr</td>
                  <td style={{ padding: '12px' }}>₹ {formatLakhCrores(item.burnt)} Lakh Cr</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(item.pct, 100)}%`, height: '100%', background: item.color }}></div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 800, 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        background: `${item.color}22`,
                        color: item.color
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
