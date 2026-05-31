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
import { Home, Landmark, Map, Calendar, AlertOctagon, IndianRupee, FileText, ChevronRight, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Auto-close sidebar on mobile after clicking
  };

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay Backdrop */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* 1. Left Sidebar Navigation Panel */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Banner */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo_alt.png" 
              alt="BharatBudget Logo" 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-glass)',
                boxShadow: '0 0 10px rgba(255,255,255,0.05)'
              }} 
            />
            <div>
              <h1 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '0.5px' }}>BHARAT BUDGET</h1>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>COMMAND CENTER</span>
            </div>
          </div>
          
          {/* Close button inside sidebar on mobile */}
          <button 
            className="hamburger-btn" 
            onClick={() => setSidebarOpen(false)}
            style={{ marginRight: 0, padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
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
      <div className="app-main-content">
        
        {/* Top Header Ticker Bar */}
        <header className="app-header">
          {/* Active section title with Mobile Hamburger Button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 style={{ fontSize: '17px', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
              {navItems.find(n => n.id === activeTab)?.name} View
            </h2>
          </div>

          {/* Glowing ticker */}
          <div 
            className="pulse-slow header-ticker"
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
              <span>Total Outlay: ₹53.5L Cr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
              <span>Welfare DBT pool: ₹7.30L Cr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ashoka-blue)' }}></span>
              <span>Deficit Pace: 4.3% of GDP</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Viewport */}
        <main className="app-main">
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
