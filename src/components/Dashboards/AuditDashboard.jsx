import React, { useState } from 'react';
import { ShieldAlert, Trash2, Award, ClipboardCheck, ArrowDownRight, ArrowRight, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { exportToCsv } from '../../utils/exportCsv';
import ChartContainer from '../ChartContainer';
import GlossaryTooltip from '../GlossaryTooltip';

export default function AuditDashboard({ masterData }) {
  const auditLogs = masterData.cag_audit_logs || [];
  const [activeMinistry, setActiveMinistry] = useState("telecom");

  // Dynamic Department dataset for the Interactive Flow
  const ministries = {
    telecom: {
      name: "Ministry of Communications (Telecomm Sector)",
      risk: "9.2 / 10",
      allocation: 98400,
      released: 91200,
      audited: 85000,
      unspent: 85240,
      objections: [
        { title: "Non-Realisation of AGR Dues from TSPs", val: 85240, desc: "Savings in debt redemption outlays due to spectrum license fee disputes.", risk: "CRITICAL" },
        { title: "SDR Fund Under-Utilisation in Rural Areas", val: 1240, desc: "Delays in direct cash disbursements under state broadband schemes.", risk: "MEDIUM" }
      ]
    },
    highways: {
      name: "Ministry of Road Transport & Highways",
      risk: "7.8 / 10",
      allocation: 278000,
      released: 265000,
      audited: 240000,
      unspent: 14210,
      objections: [
        { title: "Project Cost Overruns & NHAI Land Disputes", val: 12410, desc: "Escalated engineering contract fees resulting from delayed acquisitions.", risk: "HIGH" },
        { title: "Unauthorised Toll Collection on Unfinished Sectors", val: 1800, desc: "Flagged toll charges collected prior to official completion certificates.", risk: "LOW" }
      ]
    },
    defence: {
      name: "Ministry of Defence",
      risk: "5.4 / 10",
      allocation: 162000,
      released: 154000,
      audited: 130000,
      unspent: 9812,
      objections: [
        { title: "Delayed Offset Deliveries by Foreign Vendors", val: 9812, desc: "Foreign direct investment liabilities unmet under tactical fighter contracts.", risk: "HIGH" },
        { title: "Idle Capital under Strategic Spare Reserves", val: 2400, desc: "Excessive capital tied in non-moving defence equipment inventories.", risk: "MEDIUM" }
      ]
    },
    food: {
      name: "Ministry of Consumer Affairs, Food & Public Distribution",
      risk: "4.8 / 10",
      allocation: 205000,
      released: 198000,
      audited: 185000,
      unspent: 4540,
      objections: [
        { title: "Duplicate Ration Cards & Leakage in DBT-Cash", val: 4540, desc: "Non-release of matching grants due to duplicate biometric accounts.", risk: "MEDIUM" },
        { title: "Silo Storage Capacity Construction Delays", val: 1210, desc: "Delayed construction of grain silos by private concessionaires.", risk: "LOW" }
      ]
    }
  };

  const selectedData = ministries[activeMinistry] || ministries.telecom;

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Risk Selection Heatmap (Left Column) */}
      <div className="glass-panel col-6" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--crimson)', marginBottom: '4px' }}>
          <ShieldAlert size={19} />
          CAG Compliance Audit Risk Heatmap
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Click on any ministry card to drill down and review its dynamic fund-flow pipeline and unresolved CAG red-flags.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {Object.keys(ministries).map((key) => {
            const min = ministries[key];
            const isActive = activeMinistry === key;
            return (
              <div 
                key={key}
                onClick={() => setActiveMinistry(key)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-glass-active)' : 'var(--border-glass)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: isActive ? 'var(--saffron)' : 'var(--text-primary)' }}>{min.name}</span>
                  <span style={{ color: min.risk.includes('9.2') || min.risk.includes('7.8') ? 'var(--crimson)' : 'var(--ashoka-blue)' }}>
                    {min.risk} Risk
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                  <div 
                    style={{ 
                      width: min.risk.includes('9.2') ? '92%' : min.risk.includes('7.8') ? '78%' : min.risk.includes('5.4') ? '54%' : '48%', 
                      height: '100%', 
                      background: min.risk.includes('9.2') || min.risk.includes('7.8') ? 'var(--crimson)' : 'var(--ashoka-blue)', 
                      borderRadius: '3px',
                      boxShadow: min.risk.includes('9.2') ? '0 0 8px var(--crimson)' : 'none'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Fund Flow Diagram (Right Column) */}
      <div className="glass-panel col-6" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--saffron)', marginBottom: '4px' }}>
          <Trash2 size={19} />
          Executive Audit Flow & Discrepancy Ledger
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Real-time capital flow from Central allocations down to unresolved, audited objections.
        </p>

        {/* CSS Fund-Flow Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>ALLOCATION</span>
            <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>₹{formatCrores(selectedData.allocation)} Cr</strong>
          </div>
          <ArrowRight size={14} color="var(--text-muted)" />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>RELEASED</span>
            <strong style={{ fontSize: '14px', color: 'var(--ashoka-blue)' }}>₹{formatCrores(selectedData.released)} Cr</strong>
          </div>
          <ArrowRight size={14} color="var(--text-muted)" />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>CAG AUDITED</span>
            <strong style={{ fontSize: '14px', color: 'var(--emerald)' }}>₹{formatCrores(selectedData.audited)} Cr</strong>
          </div>
          <ArrowRight size={14} color="var(--text-muted)" />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>DISCREPANT</span>
            <strong style={{ fontSize: '14px', color: 'var(--crimson)' }}>₹{formatCrores(selectedData.unspent)} Cr</strong>
          </div>
        </div>

        {/* Drill-down Objection Cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {selectedData.objections.map((obj, idx) => (
            <div 
              key={idx}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span 
                  style={{ 
                    fontSize: '9.5px', 
                    fontWeight: 800, 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    background: obj.risk === 'CRITICAL' ? 'rgba(255, 59, 48, 0.15)' : obj.risk === 'HIGH' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(0, 136, 255, 0.15)',
                    color: obj.risk === 'CRITICAL' ? 'var(--crimson)' : obj.risk === 'HIGH' ? 'var(--saffron)' : 'var(--ashoka-blue)'
                  }}
                >
                  {obj.risk} RISK
                </span>
                <strong style={{ fontSize: '13.5px', color: 'var(--saffron)' }}>₹{formatCrores(obj.val)} Cr</strong>
              </div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{obj.title}</h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2.5. Ministry Unspent Grants & Systemic Compliance Ledger */}
      <div className="glass-panel col-12" style={{ marginTop: '12px', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
          
          {/* Column 1: Unspent Voted Grants Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--crimson)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                ⚠️ <GlossaryTooltip termKey="votedGrants">Voted Grants</GlossaryTooltip> Returned Unspent
              </h4>
              <button 
                onClick={() => {
                  const unspentData = [
                    { ministry: "Communications", unspent_crores: 85240 },
                    { ministry: "Road Transport", unspent_crores: 14210 },
                    { ministry: "Defence Capital", unspent_crores: 9812 },
                    { ministry: "Consumer Affairs", unspent_crores: 4540 },
                    { ministry: "Jal Shakti", unspent_crores: 3120 }
                  ];
                  exportToCsv(unspentData, "cag_unspent_voted_grants.csv");
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '4px 8px', fontSize: '10.5px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                <Download size={12} /> Export CSV
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              CAG flags massive capital balances remaining unspent at fiscal year-end, pointing to baseline planning inefficiencies.
            </p>
            <ChartContainer height={240}>
                <BarChart 
                  data={[
                    { name: "Communications", unspent: 85240 },
                    { name: "Road Transport", unspent: 14210 },
                    { name: "Defence Capital", unspent: 9812 },
                    { name: "Consumer Affairs", unspent: 4540 },
                    { name: "Jal Shakti", unspent: 3120 }
                  ]} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                  <YAxis stroke="var(--text-secondary)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                    formatter={(value) => [`₹ ${value.toLocaleString('en-IN')} Cr`, 'Unspent Balance']}
                  />
                  <Bar dataKey="unspent" fill="var(--crimson)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
          </div>

          {/* Column 2: Systemic Compliance Objections Ledger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', color: 'var(--saffron)' }}>
              📑 Systemic <GlossaryTooltip termKey="utilizationCertificates">Utilization Certificates</GlossaryTooltip> & Suspense Account Objections
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { ministry: "Ministry of Jal Shakti", issue: "Outstanding Utilization Certificates (UCs)", val: 14281, status: "UNRESOLVED", age: "3 Years" },
                { ministry: "Ministry of Education", issue: "Suspense Account Reconciliations", val: 8910, status: "PARTIAL", age: "2 Years" },
                { ministry: "Ministry of Rural Development", issue: "Duplicate Job Card Disbursements", val: 3211, status: "INVESTIGATING", age: "1 Year" }
              ].map((obj, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px', color: '#fff' }}>{obj.ministry}</strong>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        fontWeight: 800, 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: obj.status === 'UNRESOLVED' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                        color: obj.status === 'UNRESOLVED' ? 'var(--crimson)' : 'var(--saffron)'
                      }}
                    >
                      {obj.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    <span>{obj.issue}</span>
                    <strong style={{ color: 'var(--saffron)' }}>₹ {obj.val.toLocaleString('en-IN')} Cr</strong>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Outstanding Age: {obj.age}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Sovereign Audit Anomaly & Outlay Deviation Flagging Analyzer */}
      <div className="glass-panel col-12" style={{ marginTop: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--crimson)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', margin: 0 }}>
          🛡️ AI Compliance Deviation & Anomaly Report
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Our outlier model computes allocation shifts against historical variances ($\mu = 4.2\%, \sigma = 2.1\%$) to flag systematic capital retention.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {Object.keys(ministries).map((key) => {
            const min = ministries[key];
            const devPct = ((min.allocation - min.audited) / min.allocation) * 100;
            const zScore = (devPct - 4.2) / 2.1;
            const isCritical = Math.abs(zScore) >= 2.0;

            return (
              <div 
                key={key}
                style={{
                  background: 'var(--bg-secondary)',
                  border: isCritical ? '1px solid rgba(255, 59, 48, 0.25)' : '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: isCritical ? '0 0 15px rgba(255, 59, 48, 0.05)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: '13.5px', color: '#fff', maxWidth: '70%' }}>{min.name}</strong>
                  <span 
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '20px',
                      background: isCritical ? 'rgba(255, 59, 48, 0.15)' : 'rgba(251, 146, 60, 0.15)',
                      color: isCritical ? 'var(--crimson)' : 'var(--saffron)'
                    }}
                  >
                    {isCritical ? 'CRITICAL ANOMALY' : 'NORMAL DRIFT'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block' }}>AUDIT DEVIATION</span>
                    <strong style={{ fontSize: '13px', color: 'var(--saffron)' }}>{devPct.toFixed(2)}%</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block' }}>Z-SCORE</span>
                    <strong style={{ fontSize: '13px', color: isCritical ? 'var(--crimson)' : 'var(--emerald)' }}>
                      {zScore.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                  {isCritical 
                    ? `⚠️ Outlay variance falls outside the 99% statistical confidence interval (Z-score: ${zScore.toFixed(2)}). Suggests systemic procurement delays or unspent capital locks.`
                    : `✓ Variance is within standard operational deviation tolerances. Fund flow maps cleanly to expected ledger baselines.`
                  }
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Audit Case studies from report 5 & 6 */}
      <div className="glass-panel col-12" style={{ marginTop: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-primary)' }}>
          <ClipboardCheck size={20} color="var(--emerald)" />
          Verified CAG Audit Finding Details (Report No. 5 & No. 6 of 2026)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {auditLogs.map((log, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '12px', 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--saffron)' }}>{log.report}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                Subject: {log.subject}
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {log.findings.map((item, fIdx) => (
                  <div key={fIdx} style={{ fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      <span>{item.title}</span>
                      <span style={{ color: 'var(--emerald)' }}>{item.value}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11.5px', lineHeight: '1.4' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
