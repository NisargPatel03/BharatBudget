import React, { useState } from 'react';
import OverviewDashboard from './components/Dashboards/OverviewDashboard';
import MinistryDashboard from './components/Dashboards/MinistryDashboard';
import StateDashboard from './components/Dashboards/StateDashboard';
import SchemeDashboard from './components/Dashboards/SchemeDashboard';
import MonthlyDashboard from './components/Dashboards/MonthlyDashboard';
import AuditDashboard from './components/Dashboards/AuditDashboard';
import TaxDashboard from './components/Dashboards/TaxDashboard';

// Import compiled data
import budgetMaster from './data/budget_master.json';

// Core icons from lucide
import { Home, Landmark, Map, Calendar, AlertOctagon, IndianRupee, FileText, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  // Nav menu mappings
  const navItems = [
    { id: 'overview', name: 'Home Overview', icon: Home, color: 'var(--saffron)' },
    { id: 'ministry', name: 'Ministry Outlays', icon: Landmark, color: 'var(--ashoka-blue)' },
    { id: 'states', name: 'State Budgets Map', icon: Map, color: 'var(--emerald)' },
    { id: 'schemes', name: 'Scheme DBT Tracker', icon: FileText, color: 'var(--saffron)' },
    { id: 'monthly', name: 'Monthly Burn Matrix', icon: Calendar, color: 'var(--ashoka-blue)' },
    { id: 'audit', name: 'CAG Audit Objections', icon: AlertOctagon, color: 'var(--crimson)' },
    { id: 'tax', name: 'Tax Inflow Receipts', icon: IndianRupee, color: 'var(--emerald)' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* 1. Left Sidebar Navigation Panel */}
      <aside 
        style={{ 
          width: '260px', 
          background: 'rgba(11, 17, 32, 0.95)', 
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0
        }}
      >
        {/* Brand Banner */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--saffron), var(--emerald))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '18px' }}>
            B
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '0.5px' }}>BHARAT BUDGET</h1>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>COMMAND CENTER</span>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-glass-active)' : 'transparent',
                  borderRadius: '10px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14.5px',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <div style={{ color: isActive ? item.color : 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                  <Icon size={18} />
                </div>
                <span style={{ flex: 1 }}>{item.name}</span>
                {isActive && <ChevronRight size={14} color="var(--text-secondary)" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Metadata */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-glass)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          <span>© 2026 BharatBudget Portal<br />PRS & RBI Verified Data</span>
        </div>
      </aside>

      {/* 2. Main Action Space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header Ticker Bar */}
        <header 
          style={{ 
            height: '70px', 
            background: 'var(--bg-secondary)', 
            borderBottom: '1px solid var(--border-glass)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 90
          }}
        >
          {/* Active section title */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
              {navItems.find(n => n.id === activeTab)?.name} View
            </h2>
          </div>

          {/* Glowing ticker */}
          <div 
            className="pulse-slow"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.02)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--saffron)' }}></span>
              <span>Total Outlay: ₹48.2L Cr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
              <span>Welfare DBT pool: ₹7.30L Cr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ashoka-blue)' }}></span>
              <span>Deficit Pace: 4.9% of GDP</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Viewport */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {activeTab === 'overview' && <OverviewDashboard masterData={budgetMaster} />}
          {activeTab === 'ministry' && <MinistryDashboard />}
          {activeTab === 'states' && <StateDashboard masterData={budgetMaster} />}
          {activeTab === 'schemes' && <SchemeDashboard masterData={budgetMaster} />}
          {activeTab === 'monthly' && <MonthlyDashboard masterData={budgetMaster} />}
          {activeTab === 'audit' && <AuditDashboard masterData={budgetMaster} />}
          {activeTab === 'tax' && <TaxDashboard masterData={budgetMaster} />}
        </main>
      </div>
    </div>
  );
}
