import React, { useState } from 'react';
import { User, Landmark, ShieldCheck, ChevronRight, Award, HelpCircle, HelpCircle as HelpIcon, ArrowRight, DollarSign } from 'lucide-react';
import ChartContainer from '../ChartContainer';

export default function CitizenDashboard() {
  const [age, setAge] = useState('professional'); // student, youth, professional, senior
  const [occupation, setOccupation] = useState('salaried'); // farmer, salaried, self_employed, rural_worker
  const [income, setIncome] = useState('mid'); // low (under 3L), low_mid (3-7L), mid (7-15L), high (15L+)
  const [sector, setSector] = useState('urban'); // rural, urban

  // Dynamic eligibility compiler logic
  const checkEligibility = () => {
    const matched = [];
    let taxSavings = 0;

    // 1. PM-KISAN matching
    if (occupation === 'farmer' && income !== 'high') {
      matched.push({
        id: 'pm-kisan',
        name: 'PM-KISAN (Kisan Samman Nidhi)',
        ministry: 'Ministry of Agriculture',
        benefit: '₹6,000 / year direct cash transfer',
        desc: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
        link: 'https://pmkisan.gov.in/'
      });
    }

    // 2. MGNREGA matching
    if (sector === 'rural' && (occupation === 'rural_worker' || income === 'low')) {
      matched.push({
        id: 'mgnrega',
        name: 'MGNREGA Rural Employment Guarantee',
        ministry: 'Ministry of Rural Development',
        benefit: 'Guaranteed 100 days of manual wage employment',
        desc: 'Legal guarantee for one hundred days of skilled/unskilled manual employment in a financial year to rural households.',
        link: 'https://nrega.nic.in/'
      });
    }

    // 3. PM Awas Yojana (PMAY) matching
    if (income === 'low' || income === 'low_mid') {
      const isRural = sector === 'rural';
      matched.push({
        id: 'pmay',
        name: `PM Awas Yojana (${isRural ? 'Gramin' : 'Urban'})`,
        ministry: 'Ministry of Housing & Urban Affairs',
        benefit: 'Up to ₹2.67 Lakh interest subsidy on home loans',
        desc: 'Providing affordable housing for urban/rural poor with interest subventions on home purchase or construction.',
        link: isRural ? 'https://pmayg.nic.in/' : 'https://pmaymis.gov.in/'
      });
    }

    // 4. Ayushman Bharat (PM-JAY) matching
    if (income === 'low' || (occupation === 'rural_worker' && income !== 'high')) {
      matched.push({
        id: 'pmjay',
        name: 'Ayushman Bharat (PM-JAY)',
        ministry: 'Ministry of Health & Family Welfare',
        benefit: '₹5 Lakh free health cover per family per year',
        desc: 'Cashless and paperless access to healthcare services for low-income families at empaneled hospitals.',
        link: 'https://pmjay.gov.in/'
      });
    }

    // 5. Samagra Shiksha / Scholarships matching
    if (age === 'student' || age === 'youth') {
      matched.push({
        id: 'education-aid',
        name: 'National Scholarship & Education Aid',
        ministry: 'Ministry of Education',
        benefit: 'Direct scholarships, textbook allowances, and subsidized student credit card access',
        desc: 'Integrated scheme for school and college education providing academic credits, digital tools, and stipend resources.',
        link: 'https://scholarships.gov.in/'
      });
    }

    // 6. Atal Pension Yojana matching
    if (age !== 'senior' && income !== 'high') {
      matched.push({
        id: 'apy',
        name: 'Atal Pension Yojana (APY)',
        ministry: 'Ministry of Finance',
        benefit: 'Co-contributed monthly pension of ₹1,000 - ₹5,000',
        desc: 'Pension scheme focused on the unorganized sector workers, guaranteeing pension benefits based on small monthly savings.',
        link: 'https://www.npscra.nsdl.co.in/'
      });
    }

    // Tax Slabs Pocket Savings estimate (New Tax Slabs vs Old Tax Regime)
    // Old vs New Tax brackets savings simulation
    if (income === 'low_mid') {
      taxSavings = 15000;
    } else if (income === 'mid') {
      taxSavings = 37500;
    } else if (income === 'high') {
      taxSavings = 62500;
    }

    return { matched, taxSavings };
  };

  const { matched, taxSavings } = checkEligibility();

  return (
    <div className="animate-fade-in dashboard-grid col-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Profile Form Selector (Left Panel) */}
      <div className="glass-panel col-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <User size={20} />
          Demographic Profiler
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Select your household parameters to cross-reference direct benefit transfers, welfare grants, and tax credit thresholds.
        </p>

        {/* Age Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Age Bracket</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'student', label: '🎓 Student (<18)' },
              { id: 'youth', label: '💼 Youth (18-25)' },
              { id: 'professional', label: '👔 Professional (26-60)' },
              { id: 'senior', label: '👴 Senior Citizen (60+)' }
            ].map(o => (
              <button
                key={o.id}
                onClick={() => setAge(o.id)}
                style={{
                  background: age === o.id ? 'var(--border-glass-active)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid',
                  borderColor: age === o.id ? 'var(--emerald)' : 'var(--border-glass)',
                  color: age === o.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Occupation Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Primary Household Income Source</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'salaried', label: '💼 Salaried Employee' },
              { id: 'farmer', label: '🌾 Agriculturalist/Farmer' },
              { id: 'self_employed', label: '🏪 Small Trader/Self-Employed' },
              { id: 'rural_worker', label: '⛏️ Daily Wage/Rural Worker' }
            ].map(o => (
              <button
                key={o.id}
                onClick={() => setOccupation(o.id)}
                style={{
                  background: occupation === o.id ? 'var(--border-glass-active)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid',
                  borderColor: occupation === o.id ? 'var(--emerald)' : 'var(--border-glass)',
                  color: occupation === o.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Income Range Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Annual Income Range</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'low', label: 'Exempt (< ₹3L)' },
              { id: 'low_mid', label: 'Lower Middle (₹3L - ₹7L)' },
              { id: 'mid', label: 'Middle Class (₹7L - ₹15L)' },
              { id: 'high', label: 'Upper Tier (₹15L+)' }
            ].map(o => (
              <button
                key={o.id}
                onClick={() => setIncome(o.id)}
                style={{
                  background: income === o.id ? 'var(--border-glass-active)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid',
                  borderColor: income === o.id ? 'var(--emerald)' : 'var(--border-glass)',
                  color: income === o.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Residential Region</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'rural', label: '🌾 Rural / Village Limits' },
              { id: 'urban', label: '🏙️ Urban / Municipal Slabs' }
            ].map(o => (
              <button
                key={o.id}
                onClick={() => setSector(o.id)}
                style={{
                  background: sector === o.id ? 'var(--border-glass-active)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid',
                  borderColor: sector === o.id ? 'var(--emerald)' : 'var(--border-glass)',
                  color: sector === o.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Welfare Matching Results Deck (Right Panel) */}
      <div className="glass-panel col-7" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Top Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 210, 133, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)' }}>
              <Landmark size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}>SCHEMES MATCHED</span>
              <strong style={{ fontSize: '20px', color: 'var(--text-primary)' }}>{matched.length} Schemes</strong>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 107, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}>ESTIMATED ANNUAL TAX SAVINGS</span>
              <strong style={{ fontSize: '20px', color: 'var(--saffron)' }}>₹ {taxSavings.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Results Cards List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', margin: 0 }}>
            ELIGIBLE CENTRAL GOVERNMENT WELFARE SCHEMES
          </h4>
          
          {matched.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
              <Award size={36} color="var(--text-muted)" />
              <span style={{ fontSize: '13px' }}>No direct subsidy transfers matched for this profile.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '380px', paddingRight: '4px' }}>
              {matched.map(item => (
                <div 
                  key={item.id}
                  style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative',
                    transition: 'border-color 0.2s'
                  }}
                  className="scheme-elig-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>{item.name}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.ministry}</span>
                    </div>
                    <span style={{ fontSize: '10.5px', background: 'rgba(0, 210, 133, 0.1)', color: 'var(--emerald)', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      Eligible
                    </span>
                  </div>

                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    {item.desc}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-glass)',
                    marginTop: '4px'
                  }}>
                    <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 700 }}>Benefit: {item.benefit}</span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--saffron)',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      Apply Now <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
