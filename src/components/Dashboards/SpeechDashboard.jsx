import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from '../ChartContainer';

export default function SpeechDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  // Focus area statistics data
  const focusAreasData = [
    { name: 'Infrastructure & CapEx', percentage: 28, value: '₹12.21L Cr' },
    { name: 'Social Welfare & DBT', percentage: 23, value: '₹7.30L Cr' },
    { name: 'Agriculture & Irrigation', percentage: 17, value: '₹1.32L Cr' },
    { name: 'Green Energy & Solar', percentage: 16, value: '₹0.85L Cr' },
    { name: 'Defense Outlays', percentage: 16, value: '₹6.20L Cr' }
  ];

  // Speech snippets database
  const speechSnippets = [
    { id: 1, category: 'Infrastructure', text: "Our government proposes a record Capital Expenditure outlay of INR 12,21,821 Crores for FY 2026-27 to support multi-modal national corridors, railways expansion, and state highway grids." },
    { id: 2, category: 'Welfare', text: "Direct Benefit Transfer (DBT) pipelines have successfully plugged leakages and transferred over INR 7.3 Lakh Crores directly into the bank accounts of farmers, women, and marginalized households." },
    { id: 3, category: 'Agriculture', text: "To strengthen rural productivity, we are introducing special crop insurance subsidies and investing in 10,000 smart warehouse clusters under the Krishionnati Yojana." },
    { id: 4, category: 'Green Energy', text: "Under the PM Harit Urja initiative, we aim to solarize 1 crore households, creating localized job opportunities and saving citizens up to ₹18,000 annually on electricity bills." },
    { id: 5, category: 'Deficits', text: "We remain committed to fiscal consolidation, targeting a Fiscal Deficit of 4.3% of GDP for FY 2026-27, down from 4.4% in the revised estimate of the previous fiscal year." },
    { id: 6, category: 'Taxation', text: "The new income tax slabs have been adjusted to provide significant tax exemptions, relieving the middle-class taxpayers and boosting domestic consumer demand." }
  ];

  // Word Cloud dataset with sizes and custom colors
  const wordCloudWords = [
    { text: 'Infrastructure', size: 30, count: 48, color: 'var(--ashoka-blue)' },
    { text: 'Farmers', size: 24, count: 32, color: 'var(--emerald)' },
    { text: 'Subsidies', size: 20, count: 22, color: 'var(--saffron)' },
    { text: 'Green Transition', size: 26, count: 38, color: 'var(--emerald)' },
    { text: 'Tax Slabs', size: 22, count: 29, color: 'var(--saffron)' },
    { text: 'Fiscal Deficit', size: 25, count: 35, color: 'var(--crimson)' },
    { text: 'Digital India', size: 23, count: 30, color: 'var(--ashoka-blue)' },
    { text: 'Railways', size: 21, count: 25, color: 'var(--emerald)' },
    { text: 'Direct Transfer', size: 22, count: 27, color: 'var(--saffron)' }
  ];

  // Filter snippets based on query
  const filteredSnippets = speechSnippets.filter(snippet => {
    const term = searchQuery || selectedWord || '';
    return snippet.text.toLowerCase().includes(term.toLowerCase()) || 
           snippet.category.toLowerCase().includes(term.toLowerCase());
  });

  const handleWordClick = (word) => {
    setSelectedWord(word.text === selectedWord ? null : word.text);
    setSearchQuery('');
  };

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Word Cloud & Focus Area Charts (Left Panel) */}
      <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--saffron)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Sparkles size={20} />
          Speech Thematic Analysis
        </h3>
        
        {/* SVG Word Cloud Container */}
        <div style={{
          background: 'rgba(0,0,0,0.1)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          padding: '20px',
          minHeight: '180px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px 18px',
          textAlign: 'center'
        }}>
          {wordCloudWords.map((word, idx) => {
            const isSelected = selectedWord === word.text;
            return (
              <span
                key={idx}
                onClick={() => handleWordClick(word)}
                style={{
                  fontSize: `${word.size - 2}px`,
                  color: word.color,
                  fontWeight: 800,
                  cursor: 'pointer',
                  opacity: selectedWord && !isSelected ? 0.35 : 1,
                  transform: isSelected ? 'scale(1.15)' : 'none',
                  textShadow: isSelected ? `0 0 12px ${word.color}` : 'none',
                  transition: 'all 0.25s',
                  display: 'inline-block',
                  userSelect: 'none'
                }}
                className="word-cloud-term"
                title={`${word.count} mentions in Speech`}
              >
                {word.text}
              </span>
            );
          })}
        </div>

        {/* Sector focus areas chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            SPEECH THEMATIC FOCUS DISTRIBUTION (%)
          </span>
          <ChartContainer height={180}>
            <BarChart data={focusAreasData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis type="number" stroke="var(--text-secondary)" fontSize={10} hide />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={10} width={120} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                formatter={(value) => [`${value}%`]}
              />
              <Bar dataKey="percentage" fill="var(--saffron)" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Speech Text Search & Explorer (Right Panel) */}
      <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ashoka-blue)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <BookOpen size={20} />
          Speech Snippet Explorer
        </h3>

        {/* Search Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-glass-active)',
          borderRadius: '10px',
          padding: '10px 14px',
          gap: '10px'
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search keywords or select a word cloud tag..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedWord(null);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {(searchQuery || selectedWord) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWord(null);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Snippets list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              MATCHED PARAGRAPHS ({filteredSnippets.length})
            </span>
            {selectedWord && (
              <span style={{ fontSize: '9px', background: 'rgba(255, 107, 0, 0.1)', color: 'var(--saffron)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                Tag: {selectedWord}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '310px' }}>
            {filteredSnippets.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                No snippets found matching your query. Try searching 'Solar' or 'Deficit'.
              </div>
            ) : (
              filteredSnippets.map((snippet) => (
                <div 
                  key={snippet.id}
                  style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '16px',
                    lineHeight: '1.5',
                    position: 'relative'
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    color: 'var(--ashoka-blue)',
                    background: 'rgba(0, 136, 255, 0.08)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {snippet.category}
                  </span>
                  
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-primary)', textAlign: 'left', paddingRight: '60px' }}>
                    "{snippet.text}"
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    <MessageSquare size={12} />
                    <span>Honorable Finance Minister, Union Budget Announcement</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
