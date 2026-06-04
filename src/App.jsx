import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useBudgetStore } from './store/useBudgetStore';

// Dynamic lazy imports for dashboard components
const OverviewDashboard = lazy(() => import('./components/Dashboards/OverviewDashboard'));
const MinistryDashboard = lazy(() => import('./components/Dashboards/MinistryDashboard'));
const StateDashboard = lazy(() => import('./components/Dashboards/StateDashboard'));
const SchemeDashboard = lazy(() => import('./components/Dashboards/SchemeDashboard'));
const MonthlyDashboard = lazy(() => import('./components/Dashboards/MonthlyDashboard'));
const AuditDashboard = lazy(() => import('./components/Dashboards/AuditDashboard'));
const TaxDashboard = lazy(() => import('./components/Dashboards/TaxDashboard'));
const AdminDashboard = lazy(() => import('./components/Dashboards/AdminDashboard'));
const SimulatorDashboard = lazy(() => import('./components/Dashboards/SimulatorDashboard'));
const TrendsDashboard = lazy(() => import('./components/Dashboards/TrendsDashboard'));
const CitizenDashboard = lazy(() => import('./components/Dashboards/CitizenDashboard'));
const SpeechDashboard = lazy(() => import('./components/Dashboards/SpeechDashboard'));
import BudgetMitraChat from './components/BudgetMitraChat';
import CommandPalette from './components/CommandPalette';

// Import compiled data
import budgetMaster from './data/budget_master.json';

// Core icons from lucide
import { Home, Landmark, Map, Calendar, AlertOctagon, IndianRupee, FileText, ChevronRight, Menu, X, Shield, Cpu, Palette, TrendingUp, UserCheck, BookOpen, Printer } from 'lucide-react';

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
    masterData,
    setActiveTab,
    setSidebarOpen,
    setActiveYearIndex
  } = useBudgetStore();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bb-theme') || 'sovereign';
  });
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [wipeTheme, setWipeTheme] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const themesList = [
    { id: 'sovereign', name: '🌌 Midnight Sovereign', dotColor: '#ff6b00', secondaryColor: '#00d285' },
    { id: 'ashoka', name: '🏛️ Imperial Ashoka', dotColor: '#f59e0b', secondaryColor: '#2563eb' },
    { id: 'vedic', name: '🌿 Vedic Forest', dotColor: '#f97316', secondaryColor: '#10b981' },
    { id: 'digital', name: '📱 Digital India', dotColor: '#ec4899', secondaryColor: '#a855f7' },
    { id: 'clay', name: '🎨 Clay & Slate', dotColor: '#c2410c', secondaryColor: '#475569' }
  ];

  // Dynamic CSS custom variables injector
  useEffect(() => {
    localStorage.setItem('bb-theme', theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    if (theme === 'sovereign') {
      root.style.setProperty('--bg-primary', '#050811');
      root.style.setProperty('--bg-secondary', '#0b1120');
      root.style.setProperty('--bg-card', 'rgba(11, 17, 32, 0.65)');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-muted', '#475569');
      root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.04)');
      root.style.setProperty('--border-glass-active', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--saffron', '#ff6b00');
      root.style.setProperty('--saffron-glow', 'rgba(255, 107, 0, 0.15)');
      root.style.setProperty('--saffron-border', 'rgba(255, 107, 0, 0.3)');
      root.style.setProperty('--emerald', '#00d285');
      root.style.setProperty('--emerald-glow', 'rgba(0, 210, 133, 0.15)');
      root.style.setProperty('--emerald-border', 'rgba(0, 210, 133, 0.3)');
      root.style.setProperty('--ashoka-blue', '#0088ff');
      root.style.setProperty('--ashoka-glow', 'rgba(0, 136, 255, 0.15)');
      root.style.setProperty('--ashoka-border', 'rgba(0, 136, 255, 0.3)');
      root.style.setProperty('--tooltip-bg', 'rgba(13, 17, 23, 0.95)');
    } else if (theme === 'ashoka') {
      root.style.setProperty('--bg-primary', '#040a1e');
      root.style.setProperty('--bg-secondary', '#0a122c');
      root.style.setProperty('--bg-card', 'rgba(10, 18, 44, 0.7)');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-muted', '#475569');
      root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.04)');
      root.style.setProperty('--border-glass-active', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--saffron', '#f59e0b');
      root.style.setProperty('--saffron-glow', 'rgba(245, 158, 11, 0.15)');
      root.style.setProperty('--saffron-border', 'rgba(245, 158, 11, 0.3)');
      root.style.setProperty('--emerald', '#34d399');
      root.style.setProperty('--emerald-glow', 'rgba(52, 211, 153, 0.15)');
      root.style.setProperty('--emerald-border', 'rgba(52, 211, 153, 0.3)');
      root.style.setProperty('--ashoka-blue', '#2563eb');
      root.style.setProperty('--ashoka-glow', 'rgba(37, 99, 235, 0.15)');
      root.style.setProperty('--ashoka-border', 'rgba(37, 99, 235, 0.3)');
      root.style.setProperty('--tooltip-bg', 'rgba(13, 17, 23, 0.95)');
    } else if (theme === 'vedic') {
      root.style.setProperty('--bg-primary', '#020e0b');
      root.style.setProperty('--bg-secondary', '#031713');
      root.style.setProperty('--bg-card', 'rgba(3, 23, 19, 0.7)');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-muted', '#475569');
      root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.04)');
      root.style.setProperty('--border-glass-active', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--saffron', '#f97316');
      root.style.setProperty('--saffron-glow', 'rgba(249, 115, 22, 0.15)');
      root.style.setProperty('--saffron-border', 'rgba(249, 115, 22, 0.3)');
      root.style.setProperty('--emerald', '#10b981');
      root.style.setProperty('--emerald-glow', 'rgba(16, 185, 129, 0.15)');
      root.style.setProperty('--emerald-border', 'rgba(16, 185, 129, 0.3)');
      root.style.setProperty('--ashoka-blue', '#059669');
      root.style.setProperty('--ashoka-glow', 'rgba(5, 150, 105, 0.15)');
      root.style.setProperty('--ashoka-border', 'rgba(5, 150, 105, 0.3)');
      root.style.setProperty('--tooltip-bg', 'rgba(13, 17, 23, 0.95)');
    } else if (theme === 'digital') {
      root.style.setProperty('--bg-primary', '#0f0720');
      root.style.setProperty('--bg-secondary', '#1a0c36');
      root.style.setProperty('--bg-card', 'rgba(26, 12, 54, 0.7)');
      root.style.setProperty('--text-primary', '#fdf2f8');
      root.style.setProperty('--text-secondary', '#d8b4fe');
      root.style.setProperty('--text-muted', '#7c3aed');
      root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--border-glass-active', 'rgba(255, 255, 255, 0.18)');
      root.style.setProperty('--saffron', '#ec4899');
      root.style.setProperty('--saffron-glow', 'rgba(236, 72, 153, 0.15)');
      root.style.setProperty('--saffron-border', 'rgba(236, 72, 153, 0.3)');
      root.style.setProperty('--emerald', '#a855f7');
      root.style.setProperty('--emerald-glow', 'rgba(168, 85, 247, 0.15)');
      root.style.setProperty('--emerald-border', 'rgba(168, 85, 247, 0.3)');
      root.style.setProperty('--ashoka-blue', '#6366f1');
      root.style.setProperty('--ashoka-glow', 'rgba(99, 102, 241, 0.15)');
      root.style.setProperty('--ashoka-border', 'rgba(99, 102, 241, 0.3)');
      root.style.setProperty('--tooltip-bg', 'rgba(13, 17, 23, 0.95)');
    } else if (theme === 'clay') {
      root.style.setProperty('--bg-primary', '#fcfaf7');
      root.style.setProperty('--bg-secondary', '#f5ede4');
      root.style.setProperty('--bg-card', 'rgba(245, 237, 228, 0.7)');
      root.style.setProperty('--text-primary', '#2d2d2a');
      root.style.setProperty('--text-secondary', '#5c5c56');
      root.style.setProperty('--text-muted', '#8a8a80');
      root.style.setProperty('--border-glass', 'rgba(45, 45, 42, 0.08)');
      root.style.setProperty('--border-glass-active', 'rgba(45, 45, 42, 0.16)');
      root.style.setProperty('--saffron', '#c2410c');
      root.style.setProperty('--saffron-glow', 'rgba(194, 65, 12, 0.1)');
      root.style.setProperty('--saffron-border', 'rgba(194, 65, 12, 0.2)');
      root.style.setProperty('--emerald', '#475569');
      root.style.setProperty('--emerald-glow', 'rgba(71, 85, 105, 0.1)');
      root.style.setProperty('--emerald-border', 'rgba(71, 85, 105, 0.2)');
      root.style.setProperty('--ashoka-blue', '#7c2d12');
      root.style.setProperty('--ashoka-glow', 'rgba(124, 45, 18, 0.1)');
      root.style.setProperty('--ashoka-border', 'rgba(124, 45, 18, 0.2)');
      root.style.setProperty('--tooltip-bg', '#f5ede4');
    }
  }, [theme]);

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
    { id: 'trends', name: 'Historical Trends', icon: TrendingUp, color: 'var(--ashoka-blue)' },
    { id: 'citizen', name: 'Welfare Calculator', icon: UserCheck, color: 'var(--emerald)' },
    { id: 'speech', name: 'Budget Speech Analyzer', icon: BookOpen, color: 'var(--saffron)' },
    { id: 'monthly', name: 'Monthly Burn Matrix', icon: Calendar, color: 'var(--ashoka-blue)' },
    { id: 'audit', name: 'CAG Audit Objections', icon: AlertOctagon, color: 'var(--crimson)' },
    { id: 'tax', name: 'Tax Inflow Receipts', icon: IndianRupee, color: 'var(--emerald)' },
    { id: 'simulator', name: 'AI Fiscal Simulator', icon: Cpu, color: 'var(--emerald)' },
    { id: 'admin', name: 'Admin Portal', icon: Shield, color: 'var(--saffron)' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Auto-close sidebar on mobile after clicking
  };

  return (
    <div className={`app-container ${animating ? 'scale-snap-active' : ''}`}>
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
                  background: isActive ? 'var(--border-glass-active)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-glass)' : 'transparent',
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
          <div className="app-header-start">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <h2 className="app-header-title">
              {navItems.find(n => n.id === activeTab)?.name} View
            </h2>
          </div>

          {/* Interactive Fiscal Timeline Pills */}
          <div className="header-timeline-pills">
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

          {/* Theme Selector Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setReportModalOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
                marginRight: '12px'
              }}
              title="Generate Executive PDF Report"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Printer size={18} />
            </button>

            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
                marginRight: '12px'
              }}
              title="Change Workspace Theme"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Palette size={18} />
            </button>

            {themeMenuOpen && (
              <div 
                className="theme-dropdown-ani"
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: '12px',
                  background: 'var(--bg-secondary)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  padding: '8px',
                  width: '210px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {themesList.map((t) => {
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={(e) => {
                        setWipeTheme(t.id);
                        setAnimating(true);
                        setThemeMenuOpen(false);
                        setTimeout(() => {
                          setTheme(t.id);
                        }, 300);
                        setTimeout(() => {
                          setWipeTheme(null);
                          setAnimating(false);
                        }, 750);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '8px 10px',
                        background: isActive ? 'var(--border-glass-active)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '12.5px',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--border-glass-active)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        } else {
                          e.currentTarget.style.background = 'var(--border-glass-active)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.dotColor }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.secondaryColor }}></span>
                      </div>
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}
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
            {activeTab === 'overview' && <OverviewDashboard masterData={masterData} />}
            {activeTab === 'ministry' && <MinistryDashboard />}
            {activeTab === 'states' && <StateDashboard masterData={masterData} />}
            {activeTab === 'schemes' && <SchemeDashboard masterData={masterData} />}
            {activeTab === 'trends' && <TrendsDashboard />}
            {activeTab === 'citizen' && <CitizenDashboard />}
            {activeTab === 'speech' && <SpeechDashboard />}
            {activeTab === 'monthly' && <MonthlyDashboard masterData={masterData} />}
            {activeTab === 'audit' && <AuditDashboard masterData={masterData} />}
            {activeTab === 'tax' && <TaxDashboard masterData={masterData} />}
            {activeTab === 'simulator' && <SimulatorDashboard />}
            {activeTab === 'admin' && <AdminDashboard />}
          </Suspense>
        </main>
      </div>

      {reportModalOpen && (
        <div className="report-modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="report-modal-card" style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass-active)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '650px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div className="report-modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-primary)' }}>
                <Printer size={18} color="var(--saffron)" />
                Executive Report Preview
              </h3>
              <button 
                onClick={() => setReportModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}
              >
                &times;
              </button>
            </div>

            {/* Printable Area */}
            <div id="printable-area" style={{ padding: '24px', overflowY: 'auto', maxHeight: '420px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '2px solid var(--saffron)', paddingBottom: '12px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.5px' }}>
                  BHARAT UNION BUDGET REPORT
                </h2>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Sovereign Budget Allocation & Audit Review
                </span>
              </div>

              {/* General Metadata Grid */}
              <div className="metadata-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '11px', borderBottom: '1px dashed var(--border-glass)', paddingBottom: '14px' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>REPORT TYPE</span>
                  <strong style={{ color: 'var(--text-primary)' }}>Sovereign Executive Summary</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>TARGET FISCAL YEAR</span>
                  <strong style={{ color: 'var(--text-primary)' }}>FY 2026-27 BE (Unified Timeline)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>COMPILED ON</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleDateString('en-IN')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>VERIFICATION LEVEL</span>
                  <strong style={{ color: 'var(--emerald)' }}>PRS & CAG Verified Ledger</strong>
                </div>
              </div>

              {/* Key Indicators Stats */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--saffron)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Fiscal Baseline Indicators
                </h4>
                <div className="indicators-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Outlay Target', val: '₹53.5L Cr' },
                    { label: 'Revenue Base', val: '₹30.1L Cr' },
                    { label: 'Fiscal Deficit', val: '4.3% GDP' },
                    { label: 'Debt Ratio', val: '56.2% GDP' }
                  ].map((ind, i) => (
                    <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block' }}>{ind.label}</span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ind.val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allocations Table */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ashoka-blue)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Major Department Allocations
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass-active)' }}>
                      <th style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Department</th>
                      <th style={{ padding: '6px 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Outlay (₹ Cr)</th>
                      <th style={{ padding: '6px 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Share (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Ministry of Defence', outlay: '6,21,540', share: '11.6%' },
                      { name: 'Ministry of Road Transport & Highways', outlay: '2,95,000', share: '5.5%' },
                      { name: 'Ministry of Railways', outlay: '2,62,000', share: '4.9%' },
                      { name: 'Ministry of Agriculture & Farmers Welfare', outlay: '1,32,000', share: '2.5%' }
                    ].map((dept, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '8px 0', color: 'var(--text-primary)', fontWeight: 600 }}>{dept.name}</td>
                        <td style={{ padding: '8px 0', color: 'var(--text-primary)', textAlign: 'right' }}>{dept.outlay}</td>
                        <td style={{ padding: '8px 0', color: 'var(--text-primary)', textAlign: 'right' }}>{dept.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Disclaimer & Verification Stamp */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ maxWidth: '70%' }}>
                  <p style={{ margin: 0, fontSize: '9px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                    This document is a certified digital compilation of union budget allocation figures. Generated from the interactive sandbox portal, matching CAG ledgers and parliamentary publications.
                  </p>
                </div>
                <div style={{ textAlign: 'center', border: '1.5px solid var(--emerald)', padding: '4px 10px', borderRadius: '4px', transform: 'rotate(-3deg)' }}>
                  <strong style={{ fontSize: '9px', color: 'var(--emerald)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    VERIFIED PORTAL
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="report-modal-actions" style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setReportModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close Preview
              </button>
              <button 
                onClick={() => window.print()}
                style={{
                  background: 'var(--saffron)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <BudgetMitraChat />
      <CommandPalette currentTheme={theme} onChangeTheme={(newTheme) => {
        setWipeTheme(newTheme);
        setAnimating(true);
        setThemeMenuOpen(false);
        setTimeout(() => {
          setTheme(newTheme);
        }, 300);
        setTimeout(() => {
          setWipeTheme(null);
          setAnimating(false);
        }, 750);
      }} />
      {wipeTheme && (
        <div 
          className="theme-wipe-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${themesList.find(t => t.id === wipeTheme)?.dotColor} 0%, ${themesList.find(t => t.id === wipeTheme)?.secondaryColor} 100%)`,
            zIndex: 99999,
            pointerEvents: 'none',
            opacity: 0.85,
            boxShadow: '0 0 50px rgba(0,0,0,0.5)',
            animation: 'wipe-slide 0.75s cubic-bezier(0.76, 0, 0.24, 1) forwards'
          }}
        />
      )}
      <style>{`
        @keyframes wipe-slide {
          0% {
            left: -100%;
          }
          40% {
            left: 0;
          }
          60% {
            left: 0;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
