import React from 'react';
import { ShieldAlert, Trash2, Award, ClipboardCheck, ArrowDownRight } from 'lucide-react';

export default function AuditDashboard({ masterData }) {
  const auditLogs = masterData.cag_audit_logs || [];

  // Return to Treasury unspent fund details
  const returnedFunds = [
    { department: "Ministry of Finance (Dept of Economic Affairs)", unspent: 85240, reason: "Saving in debt redemption outlays due to interest fluctuations." },
    { department: "Ministry of Social Justice & Empowerment", unspent: 12410, reason: "Delays in implementing Aadhaar DBT linkages for minor scholarships." },
    { department: "Ministry of Food & Public Distribution", unspent: 9812, reason: "Lower uptake of direct cash-in-lieu-of-rations in select UTs." },
    { department: "Ministry of Power & Renewable Energy", unspent: 8490, reason: "Slower-than-expected project completions under grid schemes." },
    { department: "Ministry of Education (School Education)", unspent: 4540, reason: "Non-release of capital building matching grants by partner states." }
  ];

  const formatCrores = (val) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12">
      {/* 1. Unspent returned Ledger */}
      <div className="glass-panel col-6" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--saffron)', marginBottom: '4px' }}>
          <Trash2 size={20} />
          "Return to Treasury" Ledger (FY 2024-25 Audit)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Visual count of allocated budgets that remained unspent and reverted to the Consolidated Fund of India at year-end.
        </p>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          {returnedFunds.map((item, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: '10px', 
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.department}</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.reason}</p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--saffron)' }}>₹ {formatCrores(item.unspent)} Cr</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>SURRENDERED</span>
                </div>
                <ArrowDownRight size={18} color="var(--saffron)" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Compliance heatmap risk matrix */}
      <div className="glass-panel col-6" style={{ minHeight: '380px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--crimson)', marginBottom: '4px' }}>
          <ShieldAlert size={20} />
          CAG Compliance Audit Risk Heatmap
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Risk score rating of ministries based on outstanding unresolved compliance audit objections.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Row 1 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Telecomm Sector (Adjusted Gross Revenues)</span>
              <span style={{ color: 'var(--crimson)' }}>9.2 / 10 Risk Factor</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <div style={{ width: '92%', height: '100%', background: 'var(--crimson)', borderRadius: '4px', boxShadow: '0 0 10px var(--crimson-glow)' }}></div>
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Highways Infrastructure (Project Cost Overruns)</span>
              <span style={{ color: 'var(--saffron)' }}>7.8 / 10 Risk Factor</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <div style={{ width: '78%', height: '100%', background: 'var(--saffron)', borderRadius: '4px', boxShadow: '0 0 10px var(--saffron-glow)' }}></div>
            </div>
          </div>

          {/* Row 3 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Defence Procurement (Delayed Capital Deliveries)</span>
              <span style={{ color: 'var(--ashoka-blue)' }}>5.4 / 10 Risk Factor</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <div style={{ width: '54%', height: '100%', background: 'var(--ashoka-blue)', borderRadius: '4px', boxShadow: '0 0 10px var(--ashoka-glow)' }}></div>
            </div>
          </div>

          {/* Row 4 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Food Ration Distribution (Beneficiary Dupes)</span>
              <span style={{ color: 'var(--ashoka-blue)' }}>4.8 / 10 Risk Factor</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <div style={{ width: '48%', height: '100%', background: 'var(--ashoka-blue)', borderRadius: '4px', boxShadow: '0 0 10px var(--ashoka-glow)' }}></div>
            </div>
          </div>
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
