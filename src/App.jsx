import React, { Suspense, lazy } from 'react';
import { useBudgetStore } from './store/useBudgetStore';

// Dynamic lazy imports for dashboard components
const OverviewDashboard = lazy(() => import('./components/Dashboards/OverviewDashboard'));
const MinistryDashboard = lazy(() => import('./components/Dashboards/MinistryDashboard'));
const StateDashboard = lazy(() => import('./components/Dashboards/StateDashboard'));
const SchemeDashboard = lazy(() => import('./components/Dashboards/SchemeDashboard'));
const MonthlyDashboard = lazy(() => import('./components/Dashboards/MonthlyDashboard'));
const AuditDashboard = lazy(() => import('./components/Dashboards/AuditDashboard'));
const TaxDashboard = lazy(() => import('./components/Dashboards/TaxDashboard'));

// Import compiled data
import budgetMaster from './data/budget_master.json';

// Core icons from lucide
import { Home, Landmark, Map, Calendar, AlertOctagon, IndianRupee, FileText, ChevronRight, Menu, X } from 'lucide-react';

// Premium Loading Spinner fallback component
function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', gap: '20px' }}>
      <div className="pulse-slow" style={{
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.05)',
        borderTopColor: 'var(--saffron)',
        animation: 'spin 1s linear infinite'
      }} />
      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
        DECRYPTING PARLIAMENT LEDGER CHUNKS...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  // Zustand Store integrations (centralized states)
  const {
    activeTab,
    sidebarOpen,
    activeYearIndex,
    setActiveTab,
    setSidebarOpen,
    setActiveYearIndex
  } = useBudgetStore();

  const timelineOptions = [
    { index: 0, label: '2024-25 Actuals', shortLabel: '24-25 Act', outlay: '₹48.2L Cr' },
    { index: 1, label: '2025-26 BE', shortLabel: '25-26 BE', outlay: '₹48.2L Cr' },
    { index: 2, label: '2025-26 RE', shortLabel: '25-26 RE', outlay: '₹47.7L Cr' },
    { index: 3, label: '2026-27 BE', shortLabel: '26-27 BE', outlay: '₹53.5L Cr' }
  ];

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
                  padding: '12px 16px 12px 12px',
                  background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-glass-active)' : 'transparent',
                  borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 style={{ fontSize: '17px', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
              {navItems.find(n => n.id === activeTab)?.name} View
            </h2>
          </div>

          {/* Interactive Fiscal Timeline Pills */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-glass)', gap: '4px' }}>
            {timelineOptions.map((opt) => {
              const isActive = activeYearIndex === opt.index;
              return (
                <button
                  key={opt.index}
                  onClick={() => setActiveYearIndex(opt.index)}
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-glass-active)' : 'transparent',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: isActive ? 'var(--saffron)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {opt.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Dynamic Year Stats Ticker */}
          <div 
            className="pulse-slow header-ticker"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.02)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)'
            }}
          >
            {activeYearIndex === 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--saffron)' }}></span>
                  <span>Outlay: ₹48.2L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
                  <span>DBT Pool: ₹6.80L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ashoka-blue)' }}></span>
                  <span>Deficit: 4.8% of GDP</span>
                </div>
              </>
            )}
            {activeYearIndex === 1 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--saffron)' }}></span>
                  <span>Outlay: ₹48.2L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
                  <span>DBT Pool: ₹6.95L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ashoka-blue)' }}></span>
                  <span>Deficit: 4.4% of GDP</span>
                </div>
              </>
            )}
            {activeYearIndex === 2 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--saffron)' }}></span>
                  <span>Outlay: ₹47.7L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
                  <span>DBT Pool: ₹6.90L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ashoka-blue)' }}></span>
                  <span>Deficit: 4.4% of GDP</span>
                </div>
              </>
            )}
            {activeYearIndex === 3 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--saffron)' }}></span>
                  <span>Outlay: ₹53.5L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
                  <span>DBT Pool: ₹7.30L Cr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ashoka-blue)' }}></span>
                  <span>Deficit: 4.3% of GDP</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Scrollable Dashboard Viewport */}
        <main className="app-main">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === 'overview' && <OverviewDashboard masterData={budgetMaster} />}
            {activeTab === 'ministry' && <MinistryDashboard />}
            {activeTab === 'states' && <StateDashboard masterData={budgetMaster} />}
            {activeTab === 'schemes' && <SchemeDashboard masterData={budgetMaster} />}
            {activeTab === 'monthly' && <MonthlyDashboard masterData={budgetMaster} />}
            {activeTab === 'audit' && <AuditDashboard masterData={budgetMaster} />}
            {activeTab === 'tax' && <TaxDashboard masterData={budgetMaster} />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
