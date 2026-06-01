import React, { useState } from 'react';
import { useBudgetStore } from '../../store/useBudgetStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, Landmark, TrendingUp, Download, Receipt } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv';
import ChartContainer from '../ChartContainer';

function PieLegendList({ items, renderValue }) {
  return (
    <ul className="pie-legend-list">
      {items.map((item, index) => (
        <li key={index} className="pie-legend-item">
          <span className="pie-legend-label">
            <span className="pie-legend-swatch" style={{ background: item.color }} aria-hidden />
            <span>{item.name}</span>
          </span>
          <strong className="pie-legend-value">{renderValue(item)}</strong>
        </li>
      ))}
    </ul>
  );
}

export default function TaxDashboard({ masterData }) {
  const activeYearIndex = useBudgetStore((state) => state.activeYearIndex);
  const rawMonthly = masterData.monthly_tax_collections || [];

  const [activeInflow, setActiveInflow] = useState('gst');

  const inflowSources = [
    { id: 'income', name: '✏️ Personal Income Tax', share: 26 },
    { id: 'gst', name: '🛍️ GST & Service Tax', share: 25 },
    { id: 'corp', name: '🏢 Corporate Income Tax', share: 19 },
    { id: 'borrowing', name: '📈 Sovereign Borrowings', share: 16 },
    { id: 'excise', name: '⚓ Excise & Customs', share: 14 }
  ];

  const outlayDestinations = [
    { id: 'interest', name: '🏛️ Sovereign Interest Servicing', share: 21 },
    { id: 'devolution', name: '🗺️ States Share of Devolutions', share: 19 },
    { id: 'central', name: '🛸 Central Sector Schemes', share: 16 },
    { id: 'commission', name: '🤝 Finance Commission Grants', share: 9 },
    { id: 'welfare', name: '💎 Welfare & DBT Pools', share: 8 },
    { id: 'defence', name: '🛡️ National Defence', share: 8 },
    { id: 'subsidy', name: '🌾 Subsidies & Pensions', share: 19 }
  ];

  const calculateDynamicSplit = (inflowId, outlayId) => {
    const splits = {
      income: { interest: 25, devolution: 18, central: 15, commission: 8, welfare: 12, defence: 6, subsidy: 16 },
      gst: { interest: 15, devolution: 24, central: 18, commission: 10, welfare: 10, defence: 5, subsidy: 18 },
      corp: { interest: 28, devolution: 14, central: 14, commission: 8, welfare: 8, defence: 12, subsidy: 16 },
      borrowing: { interest: 35, devolution: 10, central: 15, commission: 6, welfare: 6, defence: 10, subsidy: 18 },
      excise: { interest: 10, devolution: 20, central: 20, commission: 10, welfare: 8, defence: 12, subsidy: 20 }
    };
    return splits[inflowId]?.[outlayId] || 10;
  };

  const timelineLabels = ['Actuals 24-25', 'BE 2025-26', 'RE 2025-26', 'BE 2026-27'];
  const activeYearLabel = timelineLabels[activeYearIndex] || 'BE 2026-27';

  // Citizen tax calculator states
  const [citizenIncome, setCitizenIncome] = useState(900000);
  const [citizenDeductions, setCitizenDeductions] = useState(150000); // 80C, 80D, etc.
  const [citizenSpending, setCitizenSpending] = useState(25000);

  const computeNewRegimeTax = (income) => {
    const netIncome = Math.max(0, income - 75000); // Less Standard Deduction
    if (netIncome <= 700000) return 0; // Tax rebate up to 7 Lakhs net income
    
    let tax = 0;
    if (netIncome > 1500000) {
      tax += (netIncome - 1500000) * 0.3;
      tax += 300000 * 0.2;
      tax += 200000 * 0.15;
      tax += 300000 * 0.1;
      tax += 400000 * 0.05;
    } else if (netIncome > 1200000) {
      tax += (netIncome - 1200000) * 0.2;
      tax += 200000 * 0.15;
      tax += 300000 * 0.1;
      tax += 400000 * 0.05;
    } else if (netIncome > 1000000) {
      tax += (netIncome - 1000000) * 0.15;
      tax += 300000 * 0.1;
      tax += 400000 * 0.05;
    } else if (netIncome > 700000) {
      tax += (netIncome - 700000) * 0.1;
      tax += 400000 * 0.05;
    } else if (netIncome > 300000) {
      tax += (netIncome - 300000) * 0.05;
    }
    return Math.round(tax * 1.04); // 4% Cess
  };

  const computeOldRegimeTax = (income, deductions) => {
    const netIncome = Math.max(0, income - 50000 - deductions); // Less Standard Deduction (50k) and deductions
    if (netIncome <= 500000) return 0; // Tax rebate up to 5 Lakhs net income
    
    let tax = 0;
    if (netIncome > 1000000) {
      tax += (netIncome - 1000000) * 0.3;
      tax += 500000 * 0.2; // 5L to 10L
      tax += 250000 * 0.05; // 2.5L to 5L
    } else if (netIncome > 500000) {
      tax += (netIncome - 500000) * 0.2;
      tax += 250000 * 0.05;
    } else if (netIncome > 250000) {
      tax += (netIncome - 250000) * 0.05;
    }
    return Math.round(tax * 1.04); // 4% Cess
  };

  const estimatedNewDirect = computeNewRegimeTax(citizenIncome);
  const estimatedOldDirect = computeOldRegimeTax(citizenIncome, citizenDeductions);
  const estimatedIndirect = Math.round(citizenSpending * 12 * 0.15); // Est 15% GST average
  const totalTaxContribution = estimatedNewDirect + estimatedIndirect;

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>BharatBudget Citizen Tax Receipt</title>
          <style>
            body {
              background: #f4efe2;
              color: #1a1510;
              font-family: 'Courier New', Courier, monospace;
              padding: 40px 20px;
              margin: 0;
              display: flex;
              justify-content: center;
            }
            .receipt-box {
              background: #fffdf5;
              border: 2px dashed #8b5a2b;
              box-shadow: 0 8px 24px rgba(139,90,43,0.15);
              padding: 24px;
              width: 100%;
              max-width: 440px;
              box-sizing: border-box;
              position: relative;
              overflow: hidden;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #8b5a2b;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 20px;
              margin: 0 0 4px 0;
              color: #ea580c;
              letter-spacing: 1.5px;
              font-weight: 900;
            }
            .header p {
              font-size: 11px;
              color: #5c4033;
              margin: 0;
              text-transform: uppercase;
              font-weight: bold;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 13px;
              position: relative;
              z-index: 1;
            }
            .row-total {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: bold;
              color: #065f46;
              border-top: 1.5px dashed #8b5a2b;
              border-bottom: 1.5px dashed #8b5a2b;
              padding: 10px 0;
              margin: 16px 0;
              position: relative;
              z-index: 1;
            }
            .section-title {
              display: block;
              font-size: 11.5px;
              color: #5c4033;
              margin-bottom: 12px;
              text-align: center;
              font-weight: bold;
              text-transform: uppercase;
              position: relative;
              z-index: 1;
            }
            .devolution-list {
              border-top: 1.5px dashed #8b5a2b;
              padding-top: 16px;
              margin-top: 16px;
              position: relative;
              z-index: 1;
            }
            .devolution-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 12px;
              color: #1a1510;
            }
            .footer {
              text-align: center;
              margin-top: 24px;
              border-top: 2px dashed #8b5a2b;
              padding-top: 16px;
              font-size: 10.5px;
              color: #5c4033;
              position: relative;
              z-index: 1;
            }
            .barcode {
              height: 35px;
              margin: 12px auto 8px auto;
              width: 160px;
              opacity: 0.7;
              background: repeating-linear-gradient(
                90deg,
                #1a1510,
                #1a1510 2px,
                transparent 2px,
                transparent 5px,
                #1a1510 5px,
                #1a1510 8px,
                transparent 8px,
                transparent 10px
              );
            }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <!-- Sarnath Ashoka Chakra Watermark -->
            <svg viewBox="0 0 100 100" style="position: absolute; top: 50%; left: 50%; width: 260px; height: 260px; transform: translate(-50%, -50%) rotate(15deg); opacity: 0.05; pointer-events: none; z-index: 0;">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ea580c" stroke-width="2"/>
              <circle cx="50" cy="50" r="8" fill="none" stroke="#ea580c" stroke-width="1.5"/>
              ${Array.from({length: 24}, (_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                return `<line x1="50" y1="50" x2="${50 + 40 * Math.cos(angle)}" y2="${50 + 40 * Math.sin(angle)}" stroke="#ea580c" stroke-width="1"/>`;
              }).join('')}
            </svg>

            <div class="header">
              <h1>GOVERNMENT OF INDIA</h1>
              <p>Sovereign Tax Citizen Record</p>
              <p style="font-size: 9px; margin-top: 4px;">Receipt ID: BB-${Date.now()}</p>
            </div>
            
            <div class="row">
              <span>Direct Income Tax Paid:</span>
              <strong>INR ${estimatedNewDirect.toLocaleString('en-IN')}</strong>
            </div>
            <div class="row">
              <span>Indirect GST Contribution:</span>
              <strong>INR ${estimatedIndirect.toLocaleString('en-IN')}</strong>
            </div>
            
            <div class="row-total">
              <span>TOTAL CONTRIBUTION:</span>
              <span>INR ${totalTaxContribution.toLocaleString('en-IN')}</span>
            </div>

            <div class="devolution-list">
              <span class="section-title">Your Proportional Rupee Spending</span>
              ${taxDistribution.map(item => `
                <div class="devolution-row">
                  <span>&bull; ${item.category}:</span>
                  <strong>INR ${Math.round(totalTaxContribution * item.share).toLocaleString('en-IN')}</strong>
                </div>
              `).join('')}
            </div>

            <!-- Digital Signature Block -->
            <div style="margin-top: 24px; text-align: right; display: flex; flex-direction: column; align-items: flex-end; position: relative; z-index: 1;">
              <span style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 19px; color: #ea580c; transform: rotate(-3deg); margin-bottom: 2px; letter-spacing: 0.5px;">Sanjay Malhotra</span>
              <span style="font-size: 8px; border-top: 1px dashed #8b5a2b; padding-top: 4px; color: #5c4033; text-transform: uppercase; font-weight: bold; width: 140px; text-align: center;">Secretary, Dept of Revenue</span>
            </div>

            <div class="footer">
              <p>Thank you for contributing to India's sovereign growth!</p>
              
              <!-- Verification QR Code -->
              <svg viewBox="0 0 21 21" style="width: 60px; height: 60px; margin: 12px auto; display: block; opacity: 0.75;">
                <path d="M0,0 h7 v7 h-7 z M0,14 h7 v7 h-7 z M14,0 h7 v7 h-7 z M14,14 h7 v7 h-7 z M3,3 h1 v1 h-1 z M3,17 h1 v1 h-1 z M17,3 h1 v1 h-1 z M8,0 h1 v2 h-1 z M10,3 h2 v1 h-2 z M8,8 h3 v1 h-3 z M0,9 h2 v2 h-2 z M12,12 h2 v2 h-2 z" fill="#1a1510"/>
              </svg>

              <div class="barcode"></div>
              <p style="font-size: 8px; margin-top: 8px;">BharatBudget Ingestor Verified Ledger &bull; RBI Shared Accounts</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Rupee goes to breakdown
  const taxDistribution = [
    { category: "Sovereign Interest Servicing", share: 0.21 },
    { category: "National Security & Defence", share: 0.08 },
    { category: "Central Sector Schemes", share: 0.16 },
    { category: "States Share of Devolutions", share: 0.19 },
    { category: "Centrally Sponsored Welfare Schemes", share: 0.08 },
    { category: "Subsidies (Food & Fertilizers)", share: 0.06 },
    { category: "Finance Commission Grants", share: 0.09 },
    { category: "National Sovereign Pensions", share: 0.04 },
    { category: "Other Central Allocations", share: 0.09 }
  ];

  // Group raw direct tax trajectory over years
  const taxTimeline = [
    { year: "2015", corpTax: 453228, incomeTax: 280287 },
    { year: "2017", corpTax: 484442, incomeTax: 341079 },
    { year: "2019", corpTax: 663572, incomeTax: 461587 },
    { year: "2021", corpTax: 457719, incomeTax: 487139 },
    { year: "2023", corpTax: 825834, incomeTax: 833307 },
    { year: "2024", corpTax: 922140, incomeTax: 902890 },
    { year: "2025 BE", corpTax: 1020000, incomeTax: 1150000 },
    { year: "2026 BE", corpTax: 1231000, incomeTax: 1466000 }
  ];

  // Live Rupee Comes From inflow distribution (100 Paise of government income)
  const corpVal = masterData.receipt_stats?.corporation_tax?.[activeYearIndex] || 1231000;
  const incVal = masterData.receipt_stats?.income_tax?.[activeYearIndex] || 1466000;
  const gstVal = masterData.receipt_stats?.gst?.[activeYearIndex] || 1019020;
  const exciseVal = masterData.receipt_stats?.excise?.[activeYearIndex] || 388910;
  const custVal = masterData.receipt_stats?.customs?.[activeYearIndex] || 271200;
  const nonTaxVal = masterData.receipt_stats?.non_tax?.[activeYearIndex] || 666228;
  const totalVal = masterData.receipt_stats?.total_receipts?.[activeYearIndex] || 5347315;

  const calculatePct = (val) => Math.max(1, Math.round((val / totalVal) * 100));

  const pCorp = calculatePct(corpVal);
  const pInc = calculatePct(incVal);
  const pGst = calculatePct(gstVal);
  const pExcise = calculatePct(exciseVal);
  const pCust = calculatePct(custVal);
  const pNonTax = calculatePct(nonTaxVal);
  
  // Calculate remaining portion to constitute the sovereign borrowings
  const pBorrowings = Math.max(1, 100 - (pCorp + pInc + pGst + pExcise + pCust + pNonTax));

  const inflowDistribution = [
    { name: "Sovereign Borrowings & Liabilities", value: pBorrowings, color: "var(--crimson)" },
    { name: "Personal Income Tax", value: pInc, color: "var(--saffron)" },
    { name: "GST & Indirect Service Taxes", value: pGst, color: "var(--emerald)" },
    { name: "Corporate Income Tax", value: pCorp, color: "var(--ashoka-blue)" },
    { name: "Non-Tax Revenues (Dividends & Fees)", value: pNonTax, color: "#a855f7" },
    { name: "Union Excise Duties", value: pExcise, color: "#eab308" },
    { name: "Customs Tariffs & Duties", value: pCust, color: "#ec4899" }
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

  const nonTaxPieData = [
    { name: 'RBI Surplus Transfers', value: 210000, color: '#a855f7' },
    { name: 'Telecom Spectrum Fees', value: 120000, color: '#3b82f6' },
    { name: 'Public Disinvestment', value: 50000, color: '#f43f5e' },
    { name: 'Sovereign Service Fees', value: 286228, color: '#10b981' },
  ];
  const nonTaxPieTotal = nonTaxPieData.reduce((sum, item) => sum + item.value, 0);

  const taxProgressivityTimeline = [
    { year: '2010', direct: 378000, indirect: 312000 },
    { year: '2014', direct: 638000, indirect: 521000 },
    { year: '2018', direct: 1002000, indirect: 912000 },
    { year: '2022', direct: 1412000, indirect: 1284000 },
    { year: '2026 BE', direct: 2697000, indirect: 1679130 },
  ];

  const pieSliceLabel = ({ percent }) => (percent >= 0.06 ? `${Math.round(percent * 100)}%` : '');

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ gap: '16px' }}>
      {/* 1. Spline Area Chart: Direct Tax trajectory */}
      <div className="glass-panel col-7" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--emerald)" />
            Direct Tax Growth Trajectory
          </h3>
          <button 
            onClick={() => exportToCsv(taxTimeline, "direct_tax_growth_timeline.csv")}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--border-glass)', border: '1px solid var(--border-glass-active)', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          10-year comparative spline timeline plotting corporate tax earnings vs personal income tax receipts (₹ in Crores).
        </p>
        <ChartContainer height={250} style={{ flex: 1 }}>
            <AreaChart data={taxTimeline} margin={{ top: 10, right: 10, left: 35, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`₹ ${formatCrores(value)} Cr`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area name="Corporate Income Tax" type="monotone" dataKey="corpTax" stroke="var(--ashoka-blue)" strokeWidth={2.5} fillOpacity={0.05} fill="var(--ashoka-blue)" />
              <Area name="Personal Income Tax" type="monotone" dataKey="incomeTax" stroke="var(--saffron)" strokeWidth={2.5} fillOpacity={0.05} fill="var(--saffron)" />
            </AreaChart>
        </ChartContainer>
      </div>
 
      {/* 2. Concentric Pie of Inflows (Rupee Comes From) */}
      <div className="glass-panel col-5" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Landmark size={20} color="var(--saffron)" />
          "Rupee Comes From" Inflow Receipt Split
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Percentage breakdown of every 100 Paise of national treasury income ({activeYearLabel}).
        </p>
 
        <div className="pie-with-legend" style={{ flex: 1 }}>
          <ChartContainer height={200} className="chart-pie-slot">
            <PieChart>
              <Pie
                data={inflowDistribution}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                label={pieSliceLabel}
                labelLine={false}
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
          </ChartContainer>
          <PieLegendList
            items={inflowDistribution}
            renderValue={(item) => (
              <>
                {item.value}%
                <span className="pie-legend-pct">{item.value} Paise per ₹1</span>
              </>
            )}
          />
        </div>
      </div>

      {/* Interactive Sovereign Tax Devolution Pipeline Ledger */}
      <div className="glass-panel col-12 animate-fade-in" style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'rgba(16, 185, 129, 0.01)',
        border: '1px solid var(--border-glass-active)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="dot-bounce" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block', boxShadow: '0 0 8px var(--emerald)' }} />
              Interactive Sovereign Tax Devolution Pipeline Ledger
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Click any inflow source on the left to trace its visual flow and distribution into national spending outlays on the right.
            </span>
          </div>
          <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>
            INTERACTIVE LEDGER v2.0
          </span>
        </div>

        {/* Dashboard Pipeline Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.6fr 1.2fr',
          gap: '28px',
          alignItems: 'stretch',
          marginTop: '10px'
        }} className="flex-responsive-stack">
          
          {/* Column 1: Tax Inflow Sources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--saffron)', borderBottom: '1px solid var(--border-glass-active)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', margin: 0 }}>
              <span>📥 TAX INFLOW SOURCE</span>
              <span>PORTION SHARE</span>
            </h4>
            {inflowSources.map((inf) => {
              const isActive = activeInflow === inf.id;
              return (
                <div
                  key={inf.id}
                  onClick={() => setActiveInflow(inf.id)}
                  style={{
                    padding: '12px 16px',
                    background: isActive ? 'rgba(251, 146, 60, 0.12)' : 'var(--bg-secondary)',
                    border: '1.5px solid',
                    borderColor: isActive ? 'var(--saffron)' : 'var(--border-glass)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 4px 16px rgba(251, 146, 60, 0.1)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{inf.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--saffron)' }}>{inf.share}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${inf.share}%`, height: '100%', background: 'var(--saffron)', borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Consolidated Treasury Fund */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
            border: '1.5px dashed var(--border-glass-active)',
            borderRadius: '12px',
            padding: '20px',
            minHeight: '220px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              border: '2px solid var(--ashoka-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--ashoka-glow)',
              marginBottom: '12px',
              animation: activeInflow ? 'pulse-central 1s infinite alternate' : 'none'
            }}>
              <Landmark size={24} color="var(--ashoka-blue)" />
            </div>
            <strong style={{ fontSize: '11px', color: 'var(--text-primary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Consolidated Fund</strong>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>of the Sovereign</span>
            
            {activeInflow ? (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <span className="dot-bounce" style={{ fontSize: '10px', color: 'var(--emerald)', fontWeight: 800, display: 'block' }}>⚡ Devolution Active</span>
                <span style={{ fontSize: '9px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>
                  {inflowSources.find(i => i.id === activeInflow)?.name.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '20px' }}>Select Inflow to trace flow</span>
            )}
          </div>

          {/* Column 3: Devolution Outlays */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald)', borderBottom: '1px solid var(--border-glass-active)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', margin: 0 }}>
              <span>📤 EXPENDITURE OUTLAY</span>
              <span>DYNAMIC WEIGHT</span>
            </h4>
            {outlayDestinations.map((out) => {
              const dynamicShare = activeInflow 
                ? calculateDynamicSplit(activeInflow, out.id)
                : out.share;
              return (
                <div
                  key={out.id}
                  style={{
                    padding: '12px 16px',
                    background: activeInflow ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-glass)',
                    borderRadius: '10px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{out.name}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--emerald)' }}>{dynamicShare}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${dynamicShare}%`,
                      height: '100%',
                      background: 'var(--emerald)',
                      borderRadius: '3px',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
        
        <style>{`
          @keyframes pulse-central {
            from { box-shadow: 0 0 10px var(--ashoka-glow); }
            to { box-shadow: 0 0 25px rgba(0, 136, 255, 0.6); transform: scale(1.05); }
          }
        `}</style>
      </div>

      {/* 3. Bottom Row: SGST Ranking & Citizen Tax Receipt Generator */}
      <div className="glass-panel col-12" style={{ marginTop: '12px', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          
          {/* Column 1: State SGST Contributions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ashoka-blue)' }}>
                <IndianRupee size={20} />
                Top State GST Contributions
              </h3>
              <button 
                onClick={() => exportToCsv(stateGstRankings, "state_gst_contributions.csv")}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--border-glass)', border: '1px solid var(--border-glass-active)', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Official state-wise GST revenue records dispatches under sovereign shared tax pools (RBI report 2025).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {stateGstRankings.map((item, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-glass)', 
                    borderRadius: '10px', 
                    padding: '14px',
                    textAlign: 'center'
                  }}
                >
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.state}</h4>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '6px', color: 'var(--emerald)' }}>₹ {formatCrores(item.gst)} Cr</h3>
                </div>
              ))}
            </div>
          </div>
          {/* Column 2: Citizen Tax Receipt & Comparison Calculator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--saffron)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <Receipt size={20} />
              New vs. Old Tax Regime Reform Sandbox
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Input your annual income and eligible deductions to contrast your tax liability under the Old Regime vs the New Regime.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>ANNUAL INCOME (₹)</label>
                <input 
                  type="number" 
                  value={citizenIncome}
                  onChange={(e) => setCitizenIncome(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--border-glass)', border: '1px solid var(--border-glass-active)', color: 'var(--text-primary)', fontSize: '11.5px', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>OLD DEDUCTIONS (₹)</label>
                <input 
                  type="number" 
                  value={citizenDeductions}
                  onChange={(e) => setCitizenDeductions(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--border-glass)', border: '1px solid var(--border-glass-active)', color: 'var(--text-primary)', fontSize: '11.5px', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>MONTHLY SPEND (₹)</label>
                <input 
                  type="number" 
                  value={citizenSpending}
                  onChange={(e) => setCitizenSpending(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--border-glass)', border: '1px solid var(--border-glass-active)', color: 'var(--text-primary)', fontSize: '11.5px', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Side-by-side Regime Graphics & Bar Chart Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
              {/* Old Regime Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>OLD REGIME (WITH DEDUCTIONS)</span>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Standard Deduction:</div>
                  <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>₹ 50,000</strong>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Taxable Income:</div>
                  <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>₹ {Math.max(0, citizenIncome - 50000 - citizenDeductions).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Income Tax Liability:</div>
                  <strong style={{ fontSize: '16px', color: 'var(--crimson)' }}>₹ {estimatedOldDirect.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* New Regime Card */}
              <div style={{ background: 'rgba(255,153,0,0.02)', border: '1px solid rgba(255,153,0,0.2)', borderRadius: '8px', padding: '12px', boxShadow: '0 0 10px rgba(255,153,0,0.05)' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--saffron)' }}>NEW REGIME (REVISED 2026-27)</span>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Standard Deduction:</div>
                  <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>₹ 75,000</strong>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Taxable Income:</div>
                  <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>₹ {Math.max(0, citizenIncome - 75000).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Income Tax Liability:</div>
                  <strong style={{ fontSize: '16px', color: 'var(--emerald)' }}>₹ {estimatedNewDirect.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            {estimatedOldDirect > estimatedNewDirect ? (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: 'var(--emerald)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🎉 Dynamic Savings with New Regime:</span>
                <strong style={{ fontSize: '14px' }}>₹ {(estimatedOldDirect - estimatedNewDirect).toLocaleString('en-IN')} Saved!</strong>
              </div>
            ) : estimatedOldDirect < estimatedNewDirect ? (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: 'var(--crimson)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>💡 Old Regime remains cheaper in your bracket by:</span>
                <strong style={{ fontSize: '14px' }}>₹ {(estimatedNewDirect - estimatedOldDirect).toLocaleString('en-IN')}</strong>
              </div>
            ) : (
              <div style={{ background: 'var(--border-glass)', border: '1px solid var(--border-glass-active)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'center' }}>
                ⚖️ Both tax regimes result in zero liability for your income bracket.
              </div>
            )}

            {/* Print-style Receipt Card Control Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>OFFICIAL CITIZEN STATEMENT</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handlePrintReceipt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(251, 146, 60, 0.1)',
                    border: '1px solid rgba(251, 146, 60, 0.25)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    color: 'var(--saffron)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(251, 146, 60, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(251, 146, 60, 0.1)'}
                >
                  <Receipt size={13} /> Print Invoice
                </button>
                <button
                  onClick={() => exportToCsv(
                    taxDistribution.map(item => ({
                      category: item.category,
                      share_percentage: `${(item.share * 100).toFixed(0)}%`,
                      allocated_amount_inr: Math.round(totalTaxContribution * item.share)
                    })), 
                    "citizen_tax_allocation_breakdown.csv"
                  )}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--border-glass)',
                    border: '1px solid var(--border-glass-active)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  <Download size={13} /> Export allocation
                </button>
              </div>
            </div>

            {/* Print-style Receipt Card */}
            <div 
              id="citizen-tax-receipt"
              style={{ 
                background: '#fffdf5', 
                border: '2px dashed #8b5a2b', 
                borderRadius: '8px', 
                padding: '20px', 
                fontFamily: 'monospace', 
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(139,90,43,0.1)',
                position: 'relative',
                overflow: 'hidden',
                color: '#1a1510'
              }}
            >
              {/* Sarnath Ashoka Chakra Watermark */}
              <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', width: '220px', height: '220px', transform: 'translate(-50%, -50%) rotate(15deg)', opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ea580c" strokeWidth="2"/>
                <circle cx="50" cy="50" r="8" fill="none" stroke="#ea580c" strokeWidth="1.5"/>
                {Array.from({length: 24}, (_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#ea580c" strokeWidth="1"/>;
                })}
              </svg>

              <div style={{ textAlign: 'center', borderBottom: '1px dashed #8b5a2b', paddingBottom: '12px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <strong style={{ color: 'var(--saffron)', fontSize: '14px', letterSpacing: '1px' }}>GOVERNMENT OF INDIA</strong>
                <span style={{ display: 'block', fontSize: '9.5px', color: '#5c4033', marginTop: '3px' }}>SOVEREIGN TAX CITIZEN RECORD</span>
                <span style={{ display: 'block', fontSize: '8px', color: 'rgba(92,64,51,0.5)', marginTop: '2px' }}>SYS-REF: BB-{Date.now().toString().slice(-6)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', position: 'relative', zIndex: 1 }}>
                <span>Direct Income Tax (New):</span>
                <strong>INR {estimatedNewDirect.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px dashed #8b5a2b', paddingBottom: '8px', position: 'relative', zIndex: 1 }}>
                <span>Indirect Taxes (GST):</span>
                <strong>INR {estimatedIndirect.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#065f46', fontWeight: 800, marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <span>TOTAL CONTRIBUTION:</span>
                <span>INR {totalTaxContribution.toLocaleString('en-IN')}</span>
              </div>
 
              <div style={{ borderTop: '1px dashed #8b5a2b', paddingTop: '12px', position: 'relative', zIndex: 1 }}>
                <span style={{ display: 'block', fontSize: '9.5px', color: '#5c4033', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>YOUR PROPORTIONAL RUPEE ALLOCATION</span>
                {taxDistribution.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
                    <span style={{ color: '#5c4033' }}>• {item.category}:</span>
                    <strong>INR {Math.round(totalTaxContribution * item.share).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              {/* Digital Signature Block */}
              <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                <span style={{ fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '15px', color: '#ea580c', transform: 'rotate(-2deg)', marginBottom: '2px', fontWeight: 'bold' }}>Sanjay Malhotra</span>
                <span style={{ fontSize: '8px', borderTop: '1px dashed #8b5a2b', paddingTop: '4px', color: '#5c4033', textTransform: 'uppercase', fontWeight: 'bold', width: '140px', textAlign: 'center' }}>Secretary, Dept of Revenue</span>
              </div>
 
              {/* Verification QR Code (Authentic Version 1 Finder Corners) */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 6px 0', position: 'relative', zIndex: 1 }}>
                <svg viewBox="0 0 21 21" style={{ width: '45px', height: '45px', opacity: 0.85 }}>
                  {/* Top-Left Finder */}
                  <rect x="0" y="0" width="7" height="7" fill="#1a1510" />
                  <rect x="1" y="1" width="5" height="5" fill="#fffdf5" />
                  <rect x="2" y="2" width="3" height="3" fill="#1a1510" />

                  {/* Top-Right Finder */}
                  <rect x="14" y="0" width="7" height="7" fill="#1a1510" />
                  <rect x="15" y="1" width="5" height="5" fill="#fffdf5" />
                  <rect x="16" y="2" width="3" height="3" fill="#1a1510" />

                  {/* Bottom-Left Finder */}
                  <rect x="0" y="14" width="7" height="7" fill="#1a1510" />
                  <rect x="1" y="15" width="5" height="5" fill="#fffdf5" />
                  <rect x="2" y="16" width="3" height="3" fill="#1a1510" />

                  {/* Timing Patterns */}
                  <rect x="8" y="2" width="1" height="1" fill="#1a1510" />
                  <rect x="10" y="2" width="1" height="1" fill="#1a1510" />
                  <rect x="12" y="2" width="1" height="1" fill="#1a1510" />
                  <rect x="2" y="8" width="1" height="1" fill="#1a1510" />
                  <rect x="2" y="10" width="1" height="1" fill="#1a1510" />
                  <rect x="2" y="12" width="1" height="1" fill="#1a1510" />

                  {/* Scattered Data Bits */}
                  <rect x="8" y="5" width="2" height="1" fill="#1a1510" />
                  <rect x="9" y="7" width="1" height="2" fill="#1a1510" />
                  <rect x="11" y="6" width="1" height="1" fill="#1a1510" />
                  <rect x="12" y="8" width="2" height="1" fill="#1a1510" />
                  <rect x="14" y="9" width="1" height="2" fill="#1a1510" />
                  
                  <rect x="8" y="14" width="1" height="2" fill="#1a1510" />
                  <rect x="9" y="17" width="2" height="1" fill="#1a1510" />
                  <rect x="12" y="15" width="1" height="3" fill="#1a1510" />
                  <rect x="14" y="14" width="2" height="1" fill="#1a1510" />
                  <rect x="17" y="14" width="1" height="2" fill="#1a1510" />
                  <rect x="15" y="17" width="3" height="1" fill="#1a1510" />
                  <rect x="19" y="15" width="1" height="3" fill="#1a1510" />
                  <rect x="18" y="19" width="2" height="1" fill="#1a1510" />
                  <rect x="14" y="20" width="3" height="1" fill="#1a1510" />
                  
                  <rect x="14" y="8" width="2" height="1" fill="#1a1510" />
                  <rect x="17" y="7" width="1" height="2" fill="#1a1510" />
                  <rect x="19" y="8" width="2" height="1" fill="#1a1510" />
                  <rect x="15" y="10" width="3" height="1" fill="#1a1510" />
                  <rect x="18" y="11" width="1" height="2" fill="#1a1510" />
                  <rect x="20" y="12" width="1" height="1" fill="#1a1510" />
                </svg>
              </div>

              {/* Barcode graphic with official Indian Country Code prefix (890) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '12px auto 4px auto',
                width: '150px',
                opacity: 0.6,
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  height: '20px',
                  width: '100%',
                  background: 'repeating-linear-gradient(90deg, #1a1510, #1a1510 2px, transparent 2px, transparent 4px, #1a1510 4px, #1a1510 5px, transparent 5px, transparent 8px)',
                }} />
                <span style={{ fontSize: '7.5px', fontFamily: 'monospace', letterSpacing: '2.5px', marginTop: '3px', color: '#1a1510', fontWeight: 'bold' }}>
                  8901072002627
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Non-Tax Receipts Concentric Donut & Direct/Indirect Progressivity Timeline */}
      <div className="glass-panel col-12" style={{ marginTop: '16px', padding: '24px' }}>
        <div className="tax-dual-panel-grid">
          {/* Column 1: Non-Tax Inflows Breakdown */}
          <div className="tax-dual-panel">
            <h4 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', color: '#a855f7' }}>
              📊 Concentric Split of Non-Tax Inflows (₹ in Crores)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Non-Tax revenues are anchored by the central sovereign surplus dividend transfers along with strategic disinvestment targets.
            </p>
            <div className="pie-with-legend">
              <ChartContainer height={200} className="chart-pie-slot">
                <PieChart>
                  <Pie
                    data={nonTaxPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                    label={pieSliceLabel}
                    labelLine={false}
                  >
                    {nonTaxPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `₹ ${Number(value).toLocaleString('en-IN')} Cr (${Math.round((value / nonTaxPieTotal) * 100)}%)`,
                      name,
                    ]}
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ChartContainer>
              <PieLegendList
                items={nonTaxPieData}
                renderValue={(item) => (
                  <>
                    ₹ {formatCrores(item.value)} Cr
                    <span className="pie-legend-pct">{Math.round((item.value / nonTaxPieTotal) * 100)}% of non-tax pool</span>
                  </>
                )}
              />
            </div>
          </div>

          {/* Column 2: Direct vs. Indirect Tax Timeline */}
          <div className="tax-dual-panel">
            <h4 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', color: 'var(--saffron)' }}>
              📈 Progressive Tax Balance Timeline (15-Year Area Chart)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Direct Taxes (Progressive Corporate/Income Tax) vs Indirect Taxes (Regressive Customs/Excise/GST) in ₹ Crores.
            </p>
            <ChartContainer height={240}>
              <AreaChart
                data={taxProgressivityTimeline}
                margin={{ top: 36, right: 12, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={10} />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={10}
                  width={52}
                  tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                  formatter={(value) => [`₹ ${Number(value).toLocaleString('en-IN')} Cr`, '']}
                />
                <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '11px', paddingBottom: '4px' }} />
                <Area name="Progressive Direct Taxes" type="monotone" dataKey="direct" stroke="var(--saffron)" fill="var(--saffron)" fillOpacity={0.12} />
                <Area name="Regressive Indirect Taxes" type="monotone" dataKey="indirect" stroke="var(--ashoka-blue)" fill="var(--ashoka-blue)" fillOpacity={0.08} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
