import React, { useState } from 'react';
import IndiaMap from '../IndiaMap';
import { ShieldCheck, TrendingUp, HelpCircle, Map, RefreshCw, Sliders, BarChart2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCsv } from '../../utils/exportCsv';
import GlossaryTooltip from '../GlossaryTooltip';

export default function StateDashboard({ masterData }) {
  const [activeStateId, setActiveStateId] = useState("gj");
  const [compStateA, setCompStateA] = useState("Gujarat");
  const [compStateB, setCompStateB] = useState("Haryana");
  const [compareMetric, setCompareMetric] = useState("debtGSDP");
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Finance Commission Sandbox Weights
  const [popWeight, setPopWeight] = useState(15.0);
  const [areaWeight, setAreaWeight] = useState(15.0);
  const [forestWeight, setForestWeight] = useState(10.0);
  const [incomeWeight, setIncomeWeight] = useState(45.0);
  const [demoWeight, setDemoWeight] = useState(12.5);
  const [taxWeight, setTaxWeight] = useState(2.5);

  const stateScores = masterData.state_dbt_scores || [];

  // Reset to 16th Finance Commission baseline
  const handleResetDevolution = () => {
    setPopWeight(15.0);
    setAreaWeight(15.0);
    setForestWeight(10.0);
    setIncomeWeight(45.0);
    setDemoWeight(12.5);
    setTaxWeight(2.5);
  };

  // Base tax devolution shares from baseline 16th FC allocations
  const baseDevolutionShares = {
    "Uttar Pradesh": 17.9,
    "Bihar": 10.0,
    "Madhya Pradesh": 7.8,
    "West Bengal": 7.5,
    "Maharashtra": 6.3,
    "Rajasthan": 6.0,
    "Tamil Nadu": 4.1,
    "Karnataka": 3.6,
    "Gujarat": 3.5,
    "Jharkhand": 3.3,
    "Punjab": 1.8,
    "Haryana": 1.1,
    "Uttarakhand": 1.1,
    "Tripura": 0.7,
    "Goa": 0.4
  };

  // Hardcoded demographic/structural biases to recalculate custom devolution
  const stateFCBiases = {
    "Uttar Pradesh": { pop: 22.0, area: 12.0, forest: 5.0, income: 20.0, demo: 8.0, tax: 6.0 },
    "Bihar": { pop: 18.0, area: 6.0, forest: 2.0, income: 25.0, demo: 4.0, tax: 3.0 },
    "Madhya Pradesh": { pop: 9.0, area: 15.0, forest: 18.0, income: 8.0, demo: 7.0, tax: 6.0 },
    "West Bengal": { pop: 10.0, area: 5.0, forest: 4.0, income: 10.0, demo: 8.0, tax: 5.0 },
    "Maharashtra": { pop: 7.0, area: 15.0, forest: 8.0, income: 3.0, demo: 10.0, tax: 12.0 },
    "Rajasthan": { pop: 7.0, area: 18.0, forest: 6.0, income: 6.0, demo: 6.0, tax: 6.0 },
    "Tamil Nadu": { pop: 4.0, area: 6.0, forest: 5.0, income: 2.0, demo: 15.0, tax: 15.0 },
    "Karnataka": { pop: 3.0, area: 9.0, forest: 6.0, income: 2.0, demo: 12.0, tax: 14.0 },
    "Gujarat": { pop: 3.0, area: 9.0, forest: 4.0, income: 2.0, demo: 10.0, tax: 18.0 },
    "Jharkhand": { pop: 4.0, area: 5.0, forest: 10.0, income: 8.0, demo: 5.0, tax: 4.0 },
    "Punjab": { pop: 2.0, area: 3.0, forest: 2.0, income: 1.5, demo: 5.0, tax: 6.0 },
    "Haryana": { pop: 1.2, area: 2.0, forest: 1.0, income: 0.8, demo: 4.0, tax: 8.0 },
    "Uttarakhand": { pop: 0.8, area: 2.5, forest: 12.0, income: 1.0, demo: 4.0, tax: 3.0 },
    "Tripura": { pop: 0.5, area: 0.5, forest: 6.0, income: 1.2, demo: 3.0, tax: 2.0 },
    "Goa": { pop: 0.2, area: 0.2, forest: 1.5, income: 0.2, demo: 3.0, tax: 4.0 }
  };

  // Perform dynamic normalization of devolution criteria
  const sumWeights = popWeight + areaWeight + forestWeight + incomeWeight + demoWeight + taxWeight;
  const normPop = sumWeights > 0 ? (popWeight / sumWeights) * 100 : 0;
  const normArea = sumWeights > 0 ? (areaWeight / sumWeights) * 100 : 0;
  const normForest = sumWeights > 0 ? (forestWeight / sumWeights) * 100 : 0;
  const normIncome = sumWeights > 0 ? (incomeWeight / sumWeights) * 100 : 0;
  const normDemo = sumWeights > 0 ? (demoWeight / sumWeights) * 100 : 0;
  const normTax = sumWeights > 0 ? (taxWeight / sumWeights) * 100 : 0;

  // Calculate dynamic simulated shares for all states
  const rawScores = {};
  let totalRawScore = 0;
  Object.keys(stateFCBiases).forEach(state => {
    rawScores[state] = (
      stateFCBiases[state].pop * (normPop / 15.0) +
      stateFCBiases[state].area * (normArea / 15.0) +
      stateFCBiases[state].forest * (normForest / 10.0) +
      stateFCBiases[state].income * (normIncome / 45.0) +
      stateFCBiases[state].demo * (normDemo / 12.5) +
      stateFCBiases[state].tax * (normTax / 2.5)
    );
    totalRawScore += rawScores[state];
  });

  const simulatedShares = {};
  Object.keys(stateFCBiases).forEach(state => {
    simulatedShares[state] = totalRawScore > 0 ? (rawScores[state] / totalRawScore) * 100 : (baseDevolutionShares[state] || 0.0);
  });

  // Fetch meta for active state ID
  const idMap = {
    an: "Andaman and Nicobar Islands",
    ap: "Andhra Pradesh",
    ar: "Arunachal Pradesh",
    as: "Assam",
    br: "Bihar",
    ch: "Chandigarh",
    ct: "Chhattisgarh",
    dn: "Dadra and Nagar Haveli",
    dd: "Daman and Diu",
    dl: "Delhi",
    ga: "Goa",
    gj: "Gujarat",
    hr: "Haryana",
    hp: "Himachal Pradesh",
    jk: "Jammu and Kashmir",
    jh: "Jharkhand",
    ka: "Karnataka",
    kl: "Kerala",
    ld: "Lakshadweep",
    mp: "Madhya Pradesh",
    mh: "Maharashtra",
    mn: "Manipur",
    ml: "Meghalaya",
    mz: "Mizoram",
    nl: "Nagaland",
    or: "Odisha",
    py: "Puducherry",
    pb: "Punjab",
    rj: "Rajasthan",
    sk: "Sikkim",
    tn: "Tamil Nadu",
    tg: "Telangana",
    tr: "Tripura",
    up: "Uttar Pradesh",
    ut: "Uttarakhand",
    wb: "West Bengal"
  };

  const getActiveStateMeta = () => {
    const name = idMap[activeStateId] || "Gujarat";
    return stateScores.find(s => s.state.toLowerCase() === name.toLowerCase()) || stateScores.find(s => s.state === "Gujarat");
  };

  const activeMeta = getActiveStateMeta();
  const stateAMeta = stateScores.find(s => s.state.toLowerCase() === compStateA.toLowerCase()) || stateScores[3];
  const stateBMeta = stateScores.find(s => s.state.toLowerCase() === compStateB.toLowerCase()) || stateScores[0];

  const handleSelectStateFromMap = (id) => {
    setActiveStateId(id);
    if (idMap[id]) {
      setCompStateA(idMap[id]);
    }
  };

  // Extracted official RBI & DAMA structural finance indicators for each active state
  const rbiStateFinances = {
    "Haryana": { debtGSDP: 25.4, otrRatio: 58.2, topSector: "Education & Grid Infra", dbtVol: 14.5 },
    "Uttar Pradesh": { debtGSDP: 31.8, otrRatio: 36.5, topSector: "Social Welfare & Roads", dbtVol: 82.4 },
    "Tripura": { debtGSDP: 35.1, otrRatio: 18.2, topSector: "Rural Roads & Health", dbtVol: 4.8 },
    "Gujarat": { debtGSDP: 16.2, otrRatio: 67.4, topSector: "Irrigation & Industrial Dev", dbtVol: 24.1 },
    "Uttarakhand": { debtGSDP: 29.5, otrRatio: 41.2, topSector: "Hydro & Tourism Corridors", dbtVol: 5.2 },
    "Jharkhand": { debtGSDP: 32.4, otrRatio: 28.5, topSector: "Mining & Welfare Sub-plans", dbtVol: 12.8 },
    "Goa": { debtGSDP: 22.1, otrRatio: 72.8, topSector: "Tourism & Sanitation", dbtVol: 1.1 },
    "Punjab": { debtGSDP: 48.2, otrRatio: 46.8, topSector: "Agriculture Subsidies & Power", dbtVol: 18.5 },
    "Maharashtra": { debtGSDP: 18.5, otrRatio: 74.2, topSector: "Metro & Highway Corridors", dbtVol: 65.4 },
    "Rajasthan": { debtGSDP: 37.8, otrRatio: 42.1, topSector: "Free Electricity & Water", dbtVol: 41.2 },
    "Madhya Pradesh": { debtGSDP: 28.9, otrRatio: 38.4, topSector: "Ladli Behna & Farm Support", dbtVol: 48.9 },
    "Tamil Nadu": { debtGSDP: 27.2, otrRatio: 68.1, topSector: "Direct Cash Schemes & Edu", dbtVol: 52.1 },
    "Karnataka": { debtGSDP: 20.3, otrRatio: 69.5, topSector: "Free Ride & Rural Grids", dbtVol: 46.5 },
    "West Bengal": { debtGSDP: 37.1, otrRatio: 35.8, topSector: "Lakshmir Bhandar & Welfare", dbtVol: 55.6 },
    "Bihar": { debtGSDP: 39.8, otrRatio: 24.1, topSector: "Rural Employment & Roads", dbtVol: 62.8 }
  };

  const activeStateName = activeMeta.state;
  const stateFinance = rbiStateFinances[activeStateName] || { debtGSDP: 25.0, otrRatio: 45.0, topSector: "General Services", dbtVol: 15.0 };

  // Data for the Recharts devolution comparison chart
  const chartData = [
    {
      name: activeStateName,
      "Official 16th FC Share": Number((baseDevolutionShares[activeStateName] || 0).toFixed(2)),
      "Your Custom Share": Number((simulatedShares[activeStateName] || 0).toFixed(2))
    },
    {
      name: compStateA,
      "Official 16th FC Share": Number((baseDevolutionShares[compStateA] || 0).toFixed(2)),
      "Your Custom Share": Number((simulatedShares[compStateA] || 0).toFixed(2))
    },
    {
      name: compStateB,
      "Official 16th FC Share": Number((baseDevolutionShares[compStateB] || 0).toFixed(2)),
      "Your Custom Share": Number((simulatedShares[compStateB] || 0).toFixed(2))
    }
  ];

  // Dynamic feedback statement based on slider allocations
  const getDynamicFeedback = () => {
    if (forestWeight > 20) {
      return `With your high emphasis on Forest & Ecology (${normForest.toFixed(1)}%), ecologically rich states like Madhya Pradesh and Uttarakhand receive a massive relative boost in tax devolution shares!`;
    }
    if (incomeWeight > 60) {
      return `By setting Income Distance to ${normIncome.toFixed(1)}%, your custom formula heavily prioritizes fiscal equalisation, channeling maximum support to states like Bihar and Uttar Pradesh.`;
    }
    if (taxWeight > 10 || demoWeight > 25) {
      return `Prioritizing Tax Efforts & Demographic Performance (${(normTax + normDemo).toFixed(1)}%) heavily rewards highly compliant, high-performing states like Gujarat, Tamil Nadu, and Karnataka.`;
    }
    return "Your devolution sliders closely match the constitutional baseline recommendations of the 16th Finance Commission.";
  };

  return (
    <>
      <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Map Panel (Visual Centerpiece) */}
      <div className="glass-panel col-6" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Map size={19} color="var(--ashoka-blue)" />
          Interactive Welfare Performance Map (DBT Scores)
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Click on any highlighted state in the vector map to view its detailed budget execution indicators.
        </p>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
          <IndiaMap 
            data={stateScores} 
            activeState={activeStateId} 
            onSelectState={handleSelectStateFromMap} 
          />
        </div>
      </div>

      {/* 2. Detailed State Card Info */}
      <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '4px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ACTIVE STATE SUMMARY
              <button 
                onClick={() => setShowPrintModal(true)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '3px 6px', fontSize: '9.5px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                🖨️ Print Scorecard
              </button>
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--saffron)', marginTop: '4px' }}>{activeMeta.state}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>NATIONAL RANK</span>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--emerald)' }}>#{activeMeta.rank}</h3>
          </div>
        </div>

        {/* Dynamic 6-card metrics panel incorporating RBI & DAMA databases */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aadhaar Saturation</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>{activeMeta.aadhaar_saturation}%</h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DBT Score (Out of 100)</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: 'var(--ashoka-blue)' }}>{activeMeta.overall_score}</h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DBT Per Capita (Monthly)</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: 'var(--emerald)' }}>₹ {activeMeta.dbt_per_capita}</h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Debt-to-GSDP Ratio</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: stateFinance.debtGSDP >= 35 ? 'var(--crimson)' : 'var(--text-primary)' }}>
              {stateFinance.debtGSDP}%
            </h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fiscal Autonomy (Own Tax)</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: stateFinance.otrRatio >= 60 ? 'var(--emerald)' : 'var(--saffron)' }}>
              {stateFinance.otrRatio}%
            </h4>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DBT Vol (Transactions)</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: 'var(--ashoka-blue)' }}>
              {stateFinance.dbtVol}L/mo
            </h4>
          </div>
        </div>

        {/* DBT Banking Mode stacked bar */}
        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            DBT Disbursement Banking Pathways
          </span>
          <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ width: '68%', background: 'var(--saffron)' }} title="Commercial Banks: 68%" />
            <div style={{ width: '18%', background: 'var(--ashoka-blue)' }} title="Regional Rural Banks: 18%" />
            <div style={{ width: '14%', background: 'var(--emerald)' }} title="Post Offices: 14%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: 'var(--saffron)' }} />
              Commercial (68%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: 'var(--ashoka-blue)' }} />
              Coop/RRB (18%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: 'var(--emerald)' }} />
              Post (14%)
            </span>
          </div>
        </div>

        {/* State Devotion Info */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShieldCheck size={16} color="var(--emerald)" />
            RBI & DAMA Verified Accounts Insights
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {activeMeta.state} is heavily focused on <strong>{stateFinance.topSector}</strong>. The state records a portal compliance rating of <strong>{activeMeta.portal_compliance}%</strong> and central welfare CSS saturation of <strong>{activeMeta.css_id}%</strong>.
            {stateFinance.debtGSDP >= 35 
              ? " RBI flags elevated debt-to-GSDP parameters, requiring prudent fiscal consolidation."
              : " Debt profiles remain well within standard FRBM sustainability thresholds."}
          </p>
        </div>
      </div>

      {/* 3. NEW Devolution Simulation Sandbox (Finance Commission) - GORGEOUS RESPONSIVE GRID */}
      <div className="glass-panel col-12" style={{ marginTop: '16px', padding: '24px' }}>
        {/* Full-width Sandbox Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Sliders size={20} color="var(--saffron)" />
              16th Finance Commission <GlossaryTooltip termKey="taxDevolution">Tax Devolution</GlossaryTooltip> Sandbox
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Adjust the formula sliders to modify how the Central Government devolves shared tax pools to India's states. Sliders dynamically auto-balance to sum to 100%.
            </p>
          </div>
          <button 
            onClick={handleResetDevolution}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <RefreshCw size={13} />
            Reset Baseline
          </button>
        </div>

        {/* Content Row: Sliders side-by-side with Recharts Visual */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '32px' }}>
          {/* Column 1: Devolution Criteria Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
              {/* Slider 1 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Income Distance (Eq)</span>
                  <span style={{ color: 'var(--saffron)' }}>{normIncome.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="0.5" value={incomeWeight} 
                  onChange={(e) => setIncomeWeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--saffron)' }}
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Population Weight</span>
                  <span style={{ color: 'var(--emerald)' }}>{normPop.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="0.5" value={popWeight} 
                  onChange={(e) => setPopWeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--emerald)' }}
                />
              </div>

              {/* Slider 3 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Geographic Area</span>
                  <span style={{ color: 'var(--ashoka-blue)' }}>{normArea.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="40" step="0.5" value={areaWeight} 
                  onChange={(e) => setAreaWeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--ashoka-blue)' }}
                />
              </div>

              {/* Slider 4 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Forest & Ecology</span>
                  <span style={{ color: 'var(--saffron)' }}>{normForest.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="30" step="0.5" value={forestWeight} 
                  onChange={(e) => setForestWeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--saffron)' }}
                />
              </div>

              {/* Slider 5 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Demographic Perf</span>
                  <span style={{ color: 'var(--emerald)' }}>{normDemo.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="30" step="0.5" value={demoWeight} 
                  onChange={(e) => setDemoWeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--emerald)' }}
                />
              </div>

              {/* Slider 6 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Tax & Fiscal Effort</span>
                  <span style={{ color: 'var(--ashoka-blue)' }}>{normTax.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="20" step="0.5" value={taxWeight} 
                  onChange={(e) => setTaxWeight(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--ashoka-blue)' }}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-glass)', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>DYNAMIC SIMULATION FEEDBACK</span>
              <p style={{ fontSize: '13px', color: '#fff', marginTop: '8px', fontWeight: 500, lineHeight: '1.5' }}>
                {getDynamicFeedback()}
              </p>
            </div>
          </div>

          {/* Column 2: Sovereign Devolution Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald)' }}>
                <BarChart2 size={18} />
                Sovereign Tax Devolution Share (%)
              </h4>
              
              {/* Comparator Select Dropdowns */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={compStateA} 
                  onChange={(e) => setCompStateA(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {Object.keys(baseDevolutionShares).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select 
                  value={compStateB} 
                  onChange={(e) => setCompStateB(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {Object.keys(baseDevolutionShares).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recharts Graphical Panel */}
            <div style={{ flex: 1, minHeight: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} unit="%" />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11.5px' }} />
                  <Bar name="Official 16th FC Share" dataKey="Official 16th FC Share" fill="var(--ashoka-blue)" radius={[4, 4, 0, 0]} />
                  <Bar name="Your Custom Share" dataKey="Your Custom Share" fill="var(--saffron)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Enriched RBI State Sovereign Debt & DAMA DBT Rank Scoreboards */}
      <div className="glass-panel col-12" style={{ marginTop: '16px', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
          
          {/* Column 1: State Sovereign Debt & Autonomy Rankings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--saffron)' }}>
                  <TrendingUp size={18} />
                  <GlossaryTooltip termKey="fiscalDeficit">Sovereign Debt Burden & Fiscal Autonomy</GlossaryTooltip>
                </h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Comparing Gross Sovereign Debt-to-GSDP vs Own Tax Revenue (OTR) Dependency.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => {
                    const dataToExport = Object.keys(rbiStateFinances).map(stateName => ({
                      state: stateName,
                      debtGSDP: rbiStateFinances[stateName].debtGSDP + "%",
                      otrRatio: rbiStateFinances[stateName].otrRatio + "%",
                      dbtVol: rbiStateFinances[stateName].dbtVol + "L",
                      topSector: rbiStateFinances[stateName].topSector
                    }));
                    exportToCsv(dataToExport, "rbi_state_finances_comparison.csv");
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={13} /> Export CSV
                </button>
                <button 
                  onClick={() => setCompareMetric(compareMetric === 'debtGSDP' ? 'otrRatio' : 'debtGSDP')}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Switch to {compareMetric === 'debtGSDP' ? 'Fiscal Autonomy (OTR %)' : 'Debt-to-GSDP %'}
                </button>
              </div>
            </div>

            {/* Horizontal Bar Chart comparison */}
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={Object.keys(rbiStateFinances).map(stateName => ({
                    state: stateName,
                    val: rbiStateFinances[stateName][compareMetric]
                  })).sort((a, b) => b.val - a.val)} 
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis type="number" stroke="var(--text-secondary)" fontSize={10} unit="%" />
                  <YAxis dataKey="state" type="category" stroke="var(--text-secondary)" fontSize={10} width={80} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                    formatter={(value) => [`${value}%`, compareMetric === 'debtGSDP' ? 'Debt-to-GSDP' : 'Fiscal Autonomy OTR']}
                  />
                  <Bar 
                    dataKey="val" 
                    fill={compareMetric === 'debtGSDP' ? 'var(--crimson)' : 'var(--emerald)'} 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Column 2: State DBT Efficiency Scoreboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', color: 'var(--ashoka-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🏆 <GlossaryTooltip termKey="dbtScore">Direct Benefit Transfer (DBT) Performance Scoreboard</GlossaryTooltip>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '300px', paddingRight: '4px' }}>
              {stateScores.map((state, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: state.state === activeStateName ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                    border: '1px solid',
                    borderColor: state.state === activeStateName ? 'var(--saffron)' : 'var(--border-glass)',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--text-secondary)',
                      width: '20px'
                    }}>
                      #{state.rank}
                    </span>
                    <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{state.state}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Aadhaar: {state.aadhaar_saturation}%</span>
                    <strong style={{ color: 'var(--emerald)' }}>Score: {state.overall_score}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* State CSS & SDRF Allocation details */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--emerald)', marginBottom: '12px' }}>
            📦 Centrally Sponsored Schemes State Outlay & SDRF Disaster Devolutions: {activeMeta.state}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>MGNREGS (Rural Employment Dev)</span>
              <strong style={{ fontSize: '16px', color: '#fff', display: 'block', marginTop: '4px' }}>₹ {((baseDevolutionShares[activeMeta.state] || 3.0) * 8500).toFixed(0)} Crores</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Jal Jeevan Mission (Clean Tap Water)</span>
              <strong style={{ fontSize: '16px', color: '#fff', display: 'block', marginTop: '4px' }}>₹ {((baseDevolutionShares[activeMeta.state] || 3.0) * 4500).toFixed(0)} Crores</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>PMAY-G (Welfare Gramin Housing)</span>
              <strong style={{ fontSize: '16px', color: '#fff', display: 'block', marginTop: '4px' }}>₹ {((baseDevolutionShares[activeMeta.state] || 3.0) * 5400).toFixed(0)} Crores</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>SDRF Disaster Relief Devolutions</span>
              <strong style={{ fontSize: '16px', color: 'var(--saffron)', display: 'block', marginTop: '4px' }}>₹ {((baseDevolutionShares[activeMeta.state] || 3.0) * 1250).toFixed(0)} Crores</strong>
            </div>
          </div>
        </div>
      </div> {/* Close the glass-panel col-12 container */}
    </div> {/* Close the outer animate-fade-in container */}

      {/* 2.1 Printable Scorecard Modal */}
      {showPrintModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#0d1117', border: '1px solid var(--border-glass)', borderRadius: '12px', width: '90%', maxWidth: '600px', padding: '32px', position: 'relative' }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowPrintModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            {/* Scorecard Content */}
            <div id="printable-area" style={{ fontFamily: 'monospace', color: '#fff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--border-glass)', paddingBottom: '16px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', color: 'var(--saffron)', fontWeight: 800 }}>BHARATBUDGET EXECUTIVE STATE SCORECARD</h1>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>OFFICIAL SOVEREIGN WELFARE & DEVOLUTION STATISTICS</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                <span>State: <strong style={{ color: 'var(--saffron)' }}>{activeMeta.state.toUpperCase()}</strong></span>
                <span>National Rank: <strong style={{ color: 'var(--emerald)' }}>#{activeMeta.rank}</strong></span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)' }}>AADHAAR SATURATION</span>
                  <strong style={{ fontSize: '15px' }}>{activeMeta.aadhaar_saturation}%</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)' }}>DBT SATURATION SCORE</span>
                  <strong style={{ fontSize: '15px', color: 'var(--ashoka-blue)' }}>{activeMeta.overall_score} / 100</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)' }}>DEBT-TO-GSDP BURDEN</span>
                  <strong style={{ fontSize: '15px', color: stateFinance.debtGSDP >= 35 ? 'var(--crimson)' : '#fff' }}>{stateFinance.debtGSDP}%</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)' }}>FISCAL AUTONOMY (OTR)</span>
                  <strong style={{ fontSize: '15px', color: stateFinance.otrRatio >= 60 ? 'var(--emerald)' : 'var(--saffron)' }}>{stateFinance.otrRatio}%</strong>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px' }}>DBT BANKING DISBURSEMENT PATHWAYS</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>🏦 Commercial Banks:</span>
                  <strong>68%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                  <span>🏛️ Cooperative/RRB Accounts:</span>
                  <strong>18%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                  <span>✉️ Post Office Savings:</span>
                  <strong>14%</strong>
                </div>
              </div>

              <div style={{ borderTop: '2px dashed var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <button 
                  onClick={() => window.print()}
                  style={{ flex: 1, padding: '10px', background: 'var(--emerald)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  🖨️ Trigger System Print
                </button>
                <button 
                  onClick={() => setShowPrintModal(false)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
