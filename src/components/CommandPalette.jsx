import React, { useState, useEffect, useRef } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { GLOSSARY } from '../utils/glossary';
import { Search, Command, Palette, Calendar, Sparkles, BookOpen, Trash2, X, CornerDownLeft } from 'lucide-react';

export default function CommandPalette({ currentTheme, onChangeTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setActiveTab, setActiveYearIndex } = useBudgetStore();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Global toggle listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const navCommands = [
    { id: 'go-overview', label: 'Go to Home Overview', category: 'Navigation', icon: Command, action: () => setActiveTab('overview') },
    { id: 'go-ministry', label: 'Go to Ministry Outlays', category: 'Navigation', icon: Command, action: () => setActiveTab('ministry') },
    { id: 'go-states', label: 'Go to State Budgets Map', category: 'Navigation', icon: Command, action: () => setActiveTab('states') },
    { id: 'go-schemes', label: 'Go to Scheme DBT Tracker', category: 'Navigation', icon: Command, action: () => setActiveTab('schemes') },
    { id: 'go-monthly', label: 'Go to Monthly Burn Matrix', category: 'Navigation', icon: Command, action: () => setActiveTab('monthly') },
    { id: 'go-audit', label: 'Go to CAG Audit Objections', category: 'Navigation', icon: Command, action: () => setActiveTab('audit') },
    { id: 'go-tax', label: 'Go to Tax Inflow Receipts', category: 'Navigation', icon: Command, action: () => setActiveTab('tax') },
    { id: 'go-simulator', label: 'Go to AI Fiscal Simulator', category: 'Navigation', icon: Command, action: () => setActiveTab('simulator') },
    { id: 'go-admin', label: 'Go to Admin Portal', category: 'Navigation', icon: Command, action: () => setActiveTab('admin') }
  ];

  const yearCommands = [
    { id: 'year-0', label: 'Switch to 2024-25 Actuals', category: 'Timeline', icon: Calendar, action: () => setActiveYearIndex(0) },
    { id: 'year-1', label: 'Switch to 2025-26 BE', category: 'Timeline', icon: Calendar, action: () => setActiveYearIndex(1) },
    { id: 'year-2', label: 'Switch to 2025-26 RE', category: 'Timeline', icon: Calendar, action: () => setActiveYearIndex(2) },
    { id: 'year-3', label: 'Switch to 2026-27 BE', category: 'Timeline', icon: Calendar, action: () => setActiveYearIndex(3) }
  ];

  const themeCommands = [
    { id: 'theme-sovereign', label: 'Theme: Midnight Sovereign', category: 'Workspace Theme', icon: Palette, action: () => onChangeTheme('sovereign') },
    { id: 'theme-ashoka', label: 'Theme: Imperial Ashoka', category: 'Workspace Theme', icon: Palette, action: () => onChangeTheme('ashoka') },
    { id: 'theme-vedic', label: 'Theme: Vedic Forest', category: 'Workspace Theme', icon: Palette, action: () => onChangeTheme('vedic') },
    { id: 'theme-digital', label: 'Theme: Digital India', category: 'Workspace Theme', icon: Palette, action: () => onChangeTheme('digital') },
    { id: 'theme-clay', label: 'Theme: Clay & Slate', category: 'Workspace Theme', icon: Palette, action: () => onChangeTheme('clay') }
  ];

  // Dynamic Glossary Commands
  const glossaryCommands = Object.values(GLOSSARY).map(g => ({
    id: `glossary-${g.term}`,
    label: `Explain: ${g.term}`,
    category: 'Glossary Term',
    icon: BookOpen,
    description: g.definition,
    action: () => {
      alert(`[${g.term}]: ${g.definition}`);
    }
  }));

  const allCommands = [...navCommands, ...yearCommands, ...themeCommands, ...glossaryCommands];

  // Search filter
  const filtered = allCommands.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-glass-active)',
          borderRadius: '30px',
          padding: '8px 16px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 999,
          fontFamily: 'Inter, sans-serif'
        }}
        className="command-palette-trigger"
      >
        <Command size={12} color="var(--saffron)" />
        <span>Command Menu</span>
        <span style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          color: 'var(--text-secondary)'
        }}>Ctrl+K</span>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 8, 17, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Inter, sans-serif',
      padding: '16px'
    }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '420px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glass-active)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'palette-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          borderBottom: '1px solid var(--border-glass)',
          gap: '12px',
          background: 'rgba(255,255,255,0.01)'
        }}>
          <Search size={18} color="var(--saffron)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, theme, or financial term..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Deck */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px'
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No matches found for <strong style={{ color: 'var(--saffron)' }}>"{search}"</strong>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 14px',
                    background: isSelected ? 'var(--border-glass-active)' : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--border-glass)' : 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: isSelected ? 'var(--saffron)' : 'var(--text-secondary)' }}>
                      <Icon size={14} />
                    </div>
                    <span style={{ fontSize: '12.5px', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isSelected ? 600 : 500, flex: 1 }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      color: isSelected ? 'var(--saffron)' : 'var(--text-muted)',
                      letterSpacing: '0.5px',
                      fontWeight: 'bold',
                      background: isSelected ? 'rgba(251,146,60,0.1)' : 'rgba(255,255,255,0.02)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.category}
                    </span>
                  </div>
                  {item.description && (
                    <div style={{
                      fontSize: '10.5px',
                      color: isSelected ? 'var(--text-secondary)' : 'var(--text-muted)',
                      paddingLeft: '24px',
                      marginTop: '4px',
                      lineHeight: '1.45'
                    }}>
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Deck */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(5, 8, 17, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CornerDownLeft size={8} />
            <span>EXECUTIVE COMMAND MENU</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes palette-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 480px) {
          .command-palette-trigger {
            display: none !important; /* Hide floating launcher button on tiny viewports */
          }
        }
      `}</style>
    </div>
  );
}
