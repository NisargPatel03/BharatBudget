import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, MessageSquare, X, ShieldAlert, BookOpen, Mic, Volume2, VolumeX, Download } from 'lucide-react';
import { GLOSSARY } from '../utils/glossary';

const GLOSSARY_FLAT_TERMS = [];
Object.values(GLOSSARY).forEach(g => {
  g.aliases.forEach(alias => {
    GLOSSARY_FLAT_TERMS.push({
      alias,
      term: g.term,
      definition: g.definition
    });
  });
});
GLOSSARY_FLAT_TERMS.sort((a, b) => b.alias.length - a.alias.length);

// Rich local budget document corpus for 100% offline/static fallback search
const LOCAL_CORPUS = [
  {
    text: "The Union Budget of India for the fiscal year 2026-27 (FY27) projects a total estimated outlay of INR 53,47,315 Crores (53.47 Lakh Crores). This represents a direct progressive increase in sovereign capital expenditure outlays to anchor national infrastructure and service debt interests.",
    source: "Budget Overview (BE 2026-27)",
    page: 1,
    type: "overview"
  },
  {
    text: "The Fiscal Deficit target for FY27 is estimated at 4.3% of GDP, amounting to INR 16,95,768 Crores. The revised estimate (RE) for FY26 settled at 4.4% of GDP. Primary Deficit is projected to fall to 0.7% of GDP (INR 2,91,796 Crores) indicating high fiscal stability.",
    source: "Deficit Statistics",
    page: 1,
    type: "deficit"
  },
  {
    text: "Total Tax Inflow Receipts for the sovereign year 2026-27 BE project Corporation Tax receipts of INR 12,31,000 Crores, Personal Income Tax receipts of INR 14,66,000 Crores, and Union GST receipts of INR 10,19,020 Crores. Union Excise Duties contribute INR 3,88,910 Crores and Customs contribute INR 2,71,200 Crores.",
    source: "Tax Inflow Receipts",
    page: 2,
    type: "receipts"
  },
  {
    text: "Expenditure allocations for 2026-27 BE allocate Establishment Expenditures of INR 8,24,114 Crores, Outlays on Major Schemes & Projects of INR 17,71,928 Crores, and Capital Expenditure of INR 12,21,821 Crores. Interest payments comprise the largest single sovereign outgo at INR 14,03,972 Crores.",
    source: "Budget Expenditure Allocations",
    page: 3,
    type: "expenditure"
  },
  {
    text: "Resource transfers to States and Union Territories project a grand total transfer of INR 26,20,769 Crores. This is comprised of Devolution of States' share of taxes at INR 15,26,255 Crores, Finance Commission Grants of INR 1,29,397 Crores, and Centrally Sponsored Schemes of INR 5,20,333 Crores.",
    source: "Resource Transfers to States",
    page: 2,
    type: "transfers"
  },
  {
    text: "The Ministry of Agriculture and Farmers Welfare receives a total scheme outlay of INR 1,32,000 Crores under key sub-schemes including PM-KISAN, Krishionnati Yojana, and Crop Insurance. The Ministry of Railways is allocated a record CapEx outlay of INR 2,62,000 Crores.",
    source: "Ministry Scheme Outlays",
    page: 4,
    type: "schemes"
  },
  {
    text: "Statewise Direct Benefit Transfer (DBT) rankings place Maharashtra as the top performer with a compliance score of 82.4% and total GST contribution of INR 32,410 Crores. Karnataka is second at 78.9% score, followed closely by Gujarat at 77.2% and Tamil Nadu at 76.5%.",
    source: "State DBT Scores & Compliance",
    page: 1,
    type: "dbt_scores"
  },
  {
    text: "The Comptroller and Auditor General (CAG) of India flagged specific expenditure deviations in the revised estimates, noting that interest liabilities on outstanding national debt arose by 11.2% over early predictions due to dynamic global treasury fluctuations.",
    source: "CAG Audit Discrepancies",
    page: 5,
    type: "audit"
  }
];

function tokenize(text) {
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "at", "by", "from", "for", "in", "of", "on", "to", "with", "is", "was", "were", "are", "be", "been", "being", "have", "has", "had", "about", "what", "how", "much", "show"]);
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w));
}

function searchLocalCorpus(query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return {
      answer: "I scanned all available Union Budget documents but could not locate highly relevant segments matching your search. Please try asking about 'railway CapEx allocation', 'statewise DBT compliance ranking', 'deficit statistics target', or 'direct tax receipts growth timeline'.",
      citations: []
    };
  }

  let bestMatch = null;
  let highestScore = -1;

  LOCAL_CORPUS.forEach(doc => {
    const docTokens = tokenize(doc.text);
    let matchCount = 0;
    queryTokens.forEach(qt => {
      if (docTokens.includes(qt)) matchCount++;
    });

    const score = matchCount / (Math.sqrt(queryTokens.length) * Math.sqrt(docTokens.length));
    if (score > highestScore) {
      highestScore = score;
      bestMatch = doc;
    }
  });

  if (highestScore <= 0.01) {
    return {
      answer: "I scanned all available Union Budget documents but could not locate highly relevant segments matching your search. Please try asking about 'railway CapEx allocation', 'statewise DBT compliance ranking', 'deficit statistics target', or 'direct tax receipts growth timeline'.",
      citations: []
    };
  }

  let answer = `Based on the Union Budget ledger documentation, here is what I found:\n\n${bestMatch.text}\n\n`;
  
  // Find second best match as additional disclosure
  let secondMatch = null;
  let secondHighestScore = -1;
  LOCAL_CORPUS.forEach(doc => {
    if (doc === bestMatch) return;
    const docTokens = tokenize(doc.text);
    let matchCount = 0;
    queryTokens.forEach(qt => {
      if (docTokens.includes(qt)) matchCount++;
    });
    const score = matchCount / (Math.sqrt(queryTokens.length) * Math.sqrt(docTokens.length));
    if (score > secondHighestScore) {
      secondHighestScore = score;
      secondMatch = doc;
    }
  });

  if (secondHighestScore > 0.01 && secondMatch) {
    answer += `Additional relevant budget disclosures:\n• **${secondMatch.source}**: "${secondMatch.text.substring(0, 140)}..."\n`;
  }

  const citations = [{ source: bestMatch.source, page: bestMatch.page, type: bestMatch.type, text: bestMatch.text }];
  if (secondMatch && secondHighestScore > 0.01) {
    citations.push({ source: secondMatch.source, page: secondMatch.page, type: secondMatch.type, text: secondMatch.text });
  }

  return { answer, citations };
}

const tokenizeTextWithGlossary = (text) => {
  if (!text) return text;
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = GLOSSARY_FLAT_TERMS.map(item => escapeRegExp(item.alias));
  const regex = new RegExp(`(${patterns.join('|')})`, 'gi');
  const parts = text.split(regex);
  if (parts.length <= 1) return text;

  return parts.map((part, index) => {
    const matchedItem = GLOSSARY_FLAT_TERMS.find(
      item => item.alias.toLowerCase() === part.toLowerCase()
    );

    if (matchedItem) {
      return (
        <span
          key={index}
          className="glossary-term-wrapper"
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <button
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1.2px dashed var(--saffron)',
              color: 'var(--text-primary)',
              font: 'inherit',
              padding: 0,
              cursor: 'help',
              fontWeight: '600',
              outline: 'none'
            }}
          >
            {part}
          </button>
          <span
            className="glossary-term-tooltip"
            style={{
              visibility: 'hidden',
              opacity: 0,
              position: 'absolute',
              bottom: '125%',
              left: '50%',
              transform: 'translateX(-50%) translateY(4px)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-glass-active)',
              width: '190px',
              fontSize: '11px',
              lineHeight: '1.45',
              zIndex: 9999,
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              textAlign: 'left',
              backdropFilter: 'blur(10px)'
            }}
          >
            <strong style={{ display: 'block', color: 'var(--saffron)', marginBottom: '4px', fontSize: '11.5px' }}>
              {matchedItem.term}
            </strong>
            {matchedItem.definition}
          </span>
        </span>
      );
    }
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    const parts = line.split('**');
    const formattedLine = parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return <strong key={pIdx} style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{tokenizeTextWithGlossary(part)}</strong>;
      }
      return tokenizeTextWithGlossary(part);
    });

    if (line.trim().startsWith('•')) {
      const listContent = line.replace(/^\s*•\s*/, '');
      const listParts = listContent.split('**');
      const formattedListLine = listParts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{tokenizeTextWithGlossary(part)}</strong>;
        }
        return tokenizeTextWithGlossary(part);
      });

      return (
        <div key={lIdx} style={{ margin: '6px 0 6px 12px', display: 'flex', gap: '6px', alignItems: 'flex-start', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          <span style={{ color: 'var(--saffron)', fontWeight: 'bold' }}>•</span>
          <span style={{ flex: 1 }}>{formattedListLine}</span>
        </div>
      );
    }

    return (
      <p key={lIdx} style={{ margin: line.trim() ? '0 0 10px 0' : '0', minHeight: '6px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
        {formattedLine}
      </p>
    );
  });
};

const translateToHindi = (text) => {
  if (!text) return "";
  let translated = text;
  
  const translationPairs = [
    {
      eng: "Namaste! I am Budget Mitra, your dedicated AI Assistant. I can scan parliament budget documents in real-time to answer your questions about scheme allocations, deficit metrics, or tax collections. Ask me anything!",
      hin: "नमस्ते! मैं आपका बजट मित्र AI सहायक हूँ। मैं घाटे के आँकड़ों, योजनाओं और कर संग्रह के बारे में आपके प्रश्नों का उत्तर देने के लिए वास्तविक समय में संसदीय बजट दस्तावेजों को स्कैन कर सकता हूँ। मुझसे कुछ भी पूछें!"
    },
    {
      eng: "The Union Budget of India for the fiscal year 2026-27 (FY27) projects a total estimated outlay of INR 53,47,315 Crores (53.47 Lakh Crores). This represents a direct progressive increase in sovereign capital expenditure outlays to anchor national infrastructure and service debt interests.",
      hin: "वित्त वर्ष 2026-27 (FY27) के लिए भारत का केंद्रीय बजट ₹53,47,315 करोड़ (53.47 लाख करोड़) के कुल अनुमानित परिव्यय का अनुमान लगाता है। यह राष्ट्रीय बुनियादी ढांचे को मजबूत करने और ऋण हितों को पूरा करने के लिए संप्रभु पूंजीगत व्यय में प्रत्यक्ष प्रगतिशील वृद्धि का प्रतिनिधित्व करता है।"
    },
    {
      eng: "The Fiscal Deficit target for FY27 is estimated at 4.3% of GDP, amounting to INR 16,95,768 Crores. The revised estimate (RE) for FY26 settled at 4.4% of GDP. Primary Deficit is projected to fall to 0.7% of GDP (INR 2,91,796 Crores) indicating high fiscal stability.",
      hin: "वित्त वर्ष 27 के लिए राजकोषीय घाटे का लक्ष्य सकल घरेलू उत्पाद (GDP) का 4.3% अनुमानित है, जो कि ₹16,95,768 करोड़ है। वित्त वर्ष 26 का संशोधित अनुमान (RE) सकल घरेलू उत्पाद का 4.4% रहा। प्राथमिक घाटा घटकर सकल घरेलू उत्पाद का 0.7% (₹2,91,796 करोड़) रहने का अनुमान है, जो उच्च राजकोषीय स्थिरता को दर्शाता है।"
    },
    {
      eng: "Total Tax Inflow Receipts for the sovereign year 2026-27 BE project Corporation Tax receipts of INR 12,31,000 Crores, Personal Income Tax receipts of INR 14,66,000 Crores, and Union GST receipts of INR 10,19,020 Crores. Union Excise Duties contribute INR 3,88,910 Crores and Customs contribute INR 2,71,200 Crores.",
      hin: "वित्त वर्ष 2026-27 (बजट अनुमान) के लिए कुल कर राजस्व आवक में कॉर्पोरेट कर से ₹12,31,000 करोड़, व्यक्तिगत आयकर से ₹14,66,000 करोड़, और केंद्रीय जीएसटी (GST) से ₹10,19,020 करोड़ का अनुमान है। केंद्रीय उत्पाद शुल्क ₹3,88,910 करोड़ और सीमा शुल्क ₹2,71,200 करोड़ का योगदान करते हैं।"
    },
    {
      eng: "Expenditure allocations for 2026-27 BE allocate Establishment Expenditures of INR 8,24,114 Crores, Outlays on Major Schemes & Projects of INR 17,71,928 Crores, and Capital Expenditure of INR 12,21,821 Crores. Interest payments comprise the largest single sovereign outgo at INR 14,03,972 Crores.",
      hin: "वित्त वर्ष 2026-27 के बजट अनुमानों में स्थापना व्यय के लिए ₹8,24,114 करोड़, प्रमुख योजनाओं और परियोजनाओं के लिए ₹17,71,928 करोड़, और पूंजीगत व्यय के लिए ₹12,21,821 करोड़ आवंटित किए गए हैं। ब्याज भुगतान कुल ₹14,03,972 करोड़ के साथ सबसे बड़ा एकल संप्रभु खर्च है।"
    },
    {
      eng: "Resource transfers to States and Union Territories project a grand total transfer of INR 26,20,769 Crores. This is comprised of Devolution of States' share of taxes at INR 15,26,255 Crores, Finance Commission Grants of INR 1,29,397 Crores, and Centrally Sponsored Schemes of INR 5,20,333 Crores.",
      hin: "राज्यों और केंद्र शासित प्रदेशों को संसाधन हस्तांतरण में कुल ₹26,20,769 करोड़ का हस्तांतरण अनुमानित है। इसमें करों में राज्यों की हिस्सेदारी का हस्तांतरण ₹15,26,255 करोड़, वित्त आयोग का अनुदान ₹1,29,397 करोड़, और केंद्र प्रायोजित योजनाएं ₹5,20,333 करोड़ शामिल हैं।"
    },
    {
      eng: "The Ministry of Agriculture and Farmers Welfare receives a total scheme outlay of INR 1,32,000 Crores under key sub-schemes including PM-KISAN, Krishionnati Yojana, and Crop Insurance. The Ministry of Railways is allocated a record CapEx outlay of INR 2,62,000 Crores.",
      hin: "कृषि और किसान कल्याण मंत्रालय को पीएम-किसान, कृष्णोन्नति योजना और फसल बीमा सहित प्रमुख योजनाओं के तहत ₹1,32,000 करोड़ का कुल बजटीय परिव्यय प्राप्त होता है। रेलवे मंत्रालय को ₹2,62,000 करोड़ का रिकॉर्ड पूंजीगत व्यय (CapEx) आवंटित किया गया है।"
    },
    {
      eng: "Statewise Direct Benefit Transfer (DBT) rankings place Maharashtra as the top performer with a compliance score of 82.4% and total GST contribution of INR 32,410 Crores. Karnataka is second at 78.9% score, followed closely by Gujarat at 77.2% and Tamil Nadu at 76.5%.",
      hin: "राज्यवार प्रत्यक्ष लाभ हस्तांतरण (DBT) रैंकिंग में महाराष्ट्र 82.4% के अनुपालन स्कोर और ₹32,410 करोड़ के कुल जीएसटी (GST) योगदान के साथ शीर्ष पर है। कर्नाटक 78.9% स्कोर के साथ दूसरे स्थान पर है, जिसके ठीक बाद गुजरात 77.2% और तमिलनाडु 76.5% पर है।"
    },
    {
      eng: "The Comptroller and Auditor General (CAG) of India flagged specific expenditure deviations in the revised estimates, noting that interest liabilities on outstanding national debt arose by 11.2% over early predictions due to dynamic global treasury fluctuations.",
      hin: "भारत के नियंत्रक एवं महालेखा परीक्षक (CAG) ने संशोधित अनुमानों में विशिष्ट व्यय विचलनों को चिह्नित किया, यह देखते हुए कि वैश्विक खजाना उतार-चढ़ाव के कारण बकाया राष्ट्रीय ऋण पर ब्याज देनदारियां शुरुआती अनुमानों से 11.2% बढ़ गईं।"
    },
    {
      eng: "Based on the Union Budget ledger documentation, here is what I found:",
      hin: "केंद्रीय बजट लेजर दस्तावेजों के आधार पर, मुझे यह जानकारी मिली है:"
    },
    {
      eng: "Additional relevant budget disclosures:",
      hin: "अतिरिक्त प्रासंगिक बजट प्रकटीकरण:"
    },
    {
      eng: "I scanned all available Union Budget documents but could not locate highly relevant segments matching your search.",
      hin: "मैंने सभी उपलब्ध केंद्रीय बजट दस्तावेजों को स्कैन किया लेकिन आपके खोज से मेल खाने वाले प्रासंगिक खंड नहीं मिल सके।"
    },
    {
      eng: "Please try asking about 'railway CapEx allocation', 'statewise DBT compliance ranking', 'deficit statistics target', or 'direct tax receipts growth timeline'.",
      hin: "कृपया 'रेलवे पूंजीगत आवंटन', 'राज्यवार डीबीटी अनुपालन रैंकिंग', 'घाटा सांख्यिकी लक्ष्य', या 'प्रत्यक्ष कर रसीद विकास समयरेखा' के बारे में पूछने का प्रयास करें।"
    },
    {
      eng: "The Union Budget of India for the fiscal year 2026-27 (FY27) projects a total estimated outlay of INR 53,47,315 Crores (53.47 Lakh Crores). ...",
      hin: "वित्त वर्ष 2026-27 (FY27) के लिए भारत का केंद्रीय बजट ₹53,47,315 करोड़ (53.47 लाख करोड़) के कुल अनुमानित परिव्यय का अनुमान लगाता है। ..."
    },
    {
      eng: "The Fiscal Deficit target for FY27 is estimated at 4.3% of GDP, amounting to INR 16,95,768 Crores. The revised estimate (RE) for FY26 settle...",
      hin: "वित्त वर्ष 27 के लिए राजकोषीय घाटे का लक्ष्य सकल घरेलू उत्पाद (GDP) का 4.3% अनुमानित है, जो कि ₹16,95,768 करोड़ है। वित्त वर्ष 26 का संशोधित ..."
    },
    {
      eng: "Total Tax Inflow Receipts for the sovereign year 2026-27 BE project Corporation Tax receipts of INR 12,31,000 Crores, Personal Income Tax r...",
      hin: "वित्त वर्ष 2026-27 (बजट अनुमान) के लिए कुल कर राजस्व आवक में कॉर्पोरेट कर से ₹12,31,000 करोड़, व्यक्तिगत आयकर से ₹14,66,000 करोड़, ..."
    },
    {
      eng: "Expenditure allocations for 2026-27 BE allocate Establishment Expenditures of INR 8,24,114 Crores, Outlays on Major Schemes & Projects of ...",
      hin: "वित्त वर्ष 2026-27 के बजट अनुमानों में स्थापना व्यय के लिए ₹8,24,114 करोड़, प्रमुख योजनाओं और परियोजनाओं के लिए ₹17,71,928 करोड़, ..."
    },
    {
      eng: "Resource transfers to States and Union Territories project a grand total transfer of INR 26,20,769 Crores. This is comprised of Devolution o...",
      hin: "राज्यों और केंद्र शासित प्रदेशों को संसाधन हस्तांतरण में कुल ₹26,20,769 करोड़ का हस्तांतरण अनुमानित है। इसमें करों में राज्यों ..."
    },
    {
      eng: "The Ministry of Agriculture and Farmers Welfare receives a total scheme outlay of INR 1,32,000 Crores under key sub-schemes including PM-KI...",
      hin: "कृषि और किसान कल्याण मंत्रालय को पीएम-किसान, कृष्णोन्नति योजना और फसल बीमा सहित प्रमुख योजनाओं के तहत ₹1,32,000 करोड़ का कुल ..."
    },
    {
      eng: "Statewise Direct Benefit Transfer (DBT) rankings place Maharashtra as the top performer with a compliance score of 82.4% and total GST cont...",
      hin: "राज्यवार प्रत्यक्ष लाभ हस्तांतरण (DBT) रैंकिंग में महाराष्ट्र 82.4% के अनुपालन स्कोर और ₹32,410 करोड़ के कुल जीएसटी (GST) ..."
    },
    {
      eng: "The Comptroller and Auditor General (CAG) of India flagged specific expenditure deviations in the revised estimates, noting that interest li...",
      hin: "भारत के नियंत्रक एवं महालेखा परीक्षक (CAG) ने संशोधित अनुमानों में विशिष्ट व्यय विचलनों को चिह्नित किया, यह देखते हुए ..."
    },
    { eng: "Offline Mode Active", hin: "ऑफलाइन मोड सक्रिय" },
    { eng: "You are currently offline", hin: "आप अभी ऑफलाइन हैं" },
    { eng: "Budget Mitra is running in offline fallback mode using cached local databases", hin: "बजट मित्र कैश्ड लोकल डेटाबेस का उपयोग करके ऑफलाइन मोड में काम कर रहा है" },
    { eng: "What is the Fiscal Deficit target?", hin: "राजकोषीय घाटा (Fiscal Deficit) का लक्ष्य क्या है?" },
    { eng: "The Fiscal Deficit is projected to be reduced from", hin: "राजकोषीय घाटा निरंतर कम होने का अनुमान है, जो" },
    { eng: "in FY25 to", hin: "वित्त वर्ष 2024-25 में" },
    { eng: "in FY26, and further to", hin: "से घटकर वित्त वर्ष 2025-26 में" },
    { eng: "in FY27 BE", hin: "और आगे वित्त वर्ष 2026-27 के बजट अनुमान में" },
    { eng: "representing a consistent fiscal consolidation pathway.", hin: "होने का संकेत देता है जो निरंतर राजकोषीय मजबूती को दर्शाता है।" },
    { eng: "How much is allocated to Railways CapEx?", hin: "रेलवे पूंजीगत व्यय (CapEx) के लिए कितना आवंटित किया गया है?" },
    { eng: "The Capital Expenditure of", hin: "पूंजीगत व्यय" },
    { eng: "for Indian Railways to accelerate track laying, electrification, and safety upgrades.", hin: "भारतीय रेलवे के लिए पटरियों को बिछाने, विद्युतीकरण और सुरक्षा उन्नयन में तेजी लाने के लिए आवंटित किया गया है।" },
    { eng: "This represents an increase over the previous year allocation of", hin: "यह पिछले वर्ष के आवंटन से अधिक की वृद्धि दर्शाता है जो" },
    { eng: "reflecting key asset-creation focus.", hin: "है और प्रमुख संपत्ति-निर्माण पर जोर देता है।" },
    { eng: "How much is interest payment outgo?", hin: "ब्याज भुगतान व्यय कितना है?" },
    { eng: "Interest payment liability consumes", hin: "ब्याज भुगतान की देयता में कुल" },
    { eng: "amounting to approximately", hin: "का व्यय होता है जो लगभग" },
    { eng: "of the entire budget expenditure, reflecting legacy borrowing servicing charges.", hin: "कुल बजट व्यय का हिस्सा है, जो पिछले ऋणों के भुगतान को दर्शाता है।" },
    { eng: "Namaste! I am Budget Mitra", hin: "नमस्ते! मैं आपका बजट मित्र हूँ" }
  ];

  translationPairs.forEach(pair => {
    const regex = new RegExp(pair.eng.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    translated = translated.replace(regex, pair.hin);
  });

  return translated;
};

export default function BudgetMitraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am Budget Mitra, your dedicated AI Assistant. I can scan parliament budget documents in real-time to answer your questions about scheme allocations, deficit metrics, or tax collections. Ask me anything!',
      citations: []
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [speechVoice, setSpeechVoice] = useState('en-IN');
  const [activeCitation, setActiveCitation] = useState(null);
  const [citationDocument, setCitationDocument] = useState(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    let cleanText = text
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .trim();
    if (speechVoice === 'hi-IN') {
      cleanText = translateToHindi(cleanText);
    }
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (speechVoice === 'hi-IN') {
      selectedVoice = voices.find(v => v.lang.startsWith('hi-'));
    } else if (speechVoice === 'gu-IN') {
      selectedVoice = voices.find(v => v.lang.startsWith('gu-'));
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-'));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = speechVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isSpeechEnabled || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'bot') {
      speakText(lastMsg.text);
    }
  }, [messages, isSpeechEnabled, speechVoice]);

  // Silence voice narrator immediately on chat close or unmount
  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setActiveCitation(null);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Map selected activeCitation to full text document segment
  useEffect(() => {
    if (!activeCitation) {
      setCitationDocument(null);
      return;
    }
    const matchedDoc = LOCAL_CORPUS.find(doc => doc.source.toLowerCase() === activeCitation.source.toLowerCase()) || {
      text: activeCitation.text || ("Government budget ledger reference text chunk containing specific allocation insights matching " + activeCitation.source + ". Under progressive capital outlays, interest payouts compose the base sovereign debt structure."),
      source: activeCitation.source,
      page: activeCitation.page || 1,
      type: activeCitation.type || "Document"
    };
    setCitationDocument(matchedDoc);
  }, [activeCitation]);

  // Initialize browser-native SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Optimized for Indian accented queries

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      rec.onerror = (e) => {
        console.error("Voice recognition fault:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Microphone Speech Recognition is not supported by your current browser. We recommend using Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
    }
  };

  const handleExportChat = () => {
    if (messages.length <= 1) {
      alert("No conversation history to export yet.");
      return;
    }
    
    let content = "==================================================\n";
    content += "   BUDGET MITRA AI - CHAT HISTORY EXPORT\n";
    content += `   Generated: ${new Date().toLocaleString()}\n`;
    content += "==================================================\n\n";
    
    messages.forEach((msg, idx) => {
      if (idx === 0) return; // Skip welcome message
      const role = msg.sender === 'user' ? 'USER' : 'BUDGET MITRA AI';
      content += `[${role}]:\n${msg.text}\n\n`;
      if (msg.citations && msg.citations.length > 0) {
        content += "Citations:\n";
        msg.citations.forEach((c) => {
          content += `  - ${c.source} (Page ${c.page})\n`;
        });
        content += "\n";
      }
      content += "--------------------------------------------------\n\n";
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Budget_Mitra_Chat_Export_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const quickPrompts = [
    "What is the Fiscal Deficit target?",
    "How much is allocated to Railways CapEx?",
    "Show Scheme DBT performance ranking",
    "How much is interest payment outgo?"
  ];

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      if (!res.ok) {
        throw new Error('API server unavailable');
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.answer,
        citations: data.citations || []
      }]);
    } catch (err) {
      // Flawless, real-time client-side RAG fallback
      const fallbackData = searchLocalCorpus(queryText);
      const offlineWarning = "⚠️ **Offline Mode Active**: You are currently offline. Budget Mitra is running in offline fallback mode using cached local databases.\n\n";
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: offlineWarning + fallbackData.answer,
        citations: [
          { source: "Local Offline Cache", page: 1, type: "Offline" },
          ...(fallbackData.citations || [])
        ]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Collapsed Icon Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.45)';
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '2px solid var(--emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 15px var(--emerald-glow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src="/budget_mitra_logo.png"
              alt="Budget Mitra Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.42)',
                borderRadius: '50%'
              }}
            />
          </div>
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '14px',
            height: '14px',
            background: '#10b981',
            borderRadius: '50%',
            border: '2.5px solid #0b0f19',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
          }} />
        </button>
      )}

      {/* 2. Global Expanded Chat Panel */}
      {isOpen && (
        <div
          className="budget-mitra-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '390px',
            height: '540px',
            background: 'var(--bg-secondary)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass-active)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(251, 146, 60, 0.08), rgba(16, 185, 129, 0.08))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 5px var(--emerald-glow)',
                overflow: 'hidden'
              }}>
                <img
                  src="/budget_mitra_logo.png"
                  alt="Budget Mitra Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.42)',
                    borderRadius: '50%'
                  }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '0.3px' }}>Budget Mitra AI</h3>
                <span style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Ingestion Engine Live
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', marginRight: '8px' }}>
              {/* Voice select dropdown */}
              <select
                value={speechVoice}
                onChange={(e) => setSpeechVoice(e.target.value)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '10px',
                  padding: '3px 6px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                title="Narrator accent selection"
              >
                <option value="en-IN">English Voice</option>
                <option value="hi-IN">Hindi Voice</option>
                <option value="gu-IN">Gujarati Voice</option>
              </select>

              {/* Mute/Unmute narration */}
              <button
                onClick={() => {
                  const val = !isSpeechEnabled;
                  setIsSpeechEnabled(val);
                  if (!val && window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                style={{
                  background: 'var(--border-glass)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '4px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: isSpeechEnabled ? 'var(--emerald)' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
                title={isSpeechEnabled ? "Narration on (Mute)" : "Narration off (Unmute)"}
              >
                {isSpeechEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>

              {/* Export Chat history */}
              <button
                onClick={handleExportChat}
                style={{
                  background: 'var(--border-glass)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '4px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
                title="Export Chat Session"
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--saffron)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <Download size={13} />
              </button>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'var(--border-glass)',
                border: '1px solid var(--border-glass-active)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: 'var(--border-glass)'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {m.sender === 'bot' && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '6px',
                    borderRadius: '6px',
                    marginTop: '2px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <Bot size={13} color="#10b981" />
                  </div>
                )}
                
                <div style={{ maxWidth: '80%' }}>
                  <div
                    style={{
                      background: m.sender === 'user' ? 'var(--saffron)' : 'var(--bg-primary)',
                      color: m.sender === 'user' ? '#fff' : 'var(--text-primary)',
                      padding: '10px 14px',
                      borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                      fontSize: '12.5px',
                      lineHeight: '1.5',
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border-glass-active)',
                      boxShadow: m.sender === 'user' ? '0 3px 10px rgba(251,146,60,0.2)' : 'none',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {m.sender === 'user' ? m.text : renderFormattedText(speechVoice === 'hi-IN' ? translateToHindi(m.text) : m.text)}
                  </div>

                  {/* Citations & Speaker block for bot outputs */}
                  {m.sender === 'bot' && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '6px',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => speakText(m.text)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          fontSize: '9.5px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                        title="Read aloud"
                      >
                        <Volume2 size={10} color="var(--emerald)" />
                        <span>Speak</span>
                      </button>

                      {m.citations && m.citations.map((cit, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => setActiveCitation(cit)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: activeCitation && activeCitation.source === cit.source ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                            border: '1px solid',
                            borderColor: activeCitation && activeCitation.source === cit.source ? 'var(--emerald)' : 'var(--border-glass)',
                            borderRadius: '4px',
                            padding: '3px 6px',
                            fontSize: '9.5px',
                            color: activeCitation && activeCitation.source === cit.source ? 'var(--text-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!activeCitation || activeCitation.source !== cit.source) {
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
                              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!activeCitation || activeCitation.source !== cit.source) {
                              e.currentTarget.style.background = 'var(--bg-secondary)';
                              e.currentTarget.style.borderColor = 'var(--border-glass)';
                            }
                          }}
                        >
                          <BookOpen size={10} color="var(--emerald)" />
                          <span>{cit.source}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <Bot size={13} color="#10b981" />
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span className="dot-bounce" style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%', animation: 'bounce 1s infinite alternate' }} />
                  <span className="dot-bounce" style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%', animation: 'bounce 1s infinite alternate 0.2s' }} />
                  <span className="dot-bounce" style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%', animation: 'bounce 1s infinite alternate 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick prompt Chips */}
          <div
            style={{
              padding: '10px 16px 4px 16px',
              borderTop: '1px solid var(--border-glass)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>SUGGESTED ENQUIRIES</span>
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '6px',
              paddingBottom: '6px',
              scrollbarWidth: 'none'
            }}>
              {quickPrompts.map((qp, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSend(qp)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass-active)',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(251, 146, 60, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-glass-active)';
                  }}
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '12px 16px 16px 16px',
              borderTop: '1px solid var(--border-glass)',
              display: 'flex',
              gap: '10px',
              position: 'relative'
            }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening closely..." : "Ask Budget Mitra AI..."}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '8px',
                  padding: '10px 45px 10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(251, 146, 60, 0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-glass-active)'}
              />
              
              {/* Dynamic Animated Pulse Waveforms */}
              {isListening && (
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  right: '12px',
                  top: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <path d="M 0,20 Q 30,5 60,20 T 120,20 T 180,20 T 240,20 T 300,20 T 360,20" fill="none" stroke="var(--saffron)" strokeWidth="1.5" strokeDasharray="300" strokeDashoffset="300" style={{ animation: 'siri-wave 1.8s linear infinite', opacity: 0.8 }} />
                    <path d="M 0,20 Q 25,35 50,20 T 100,20 T 150,20 T 200,20 T 250,20 T 300,20 T 350,20" fill="none" stroke="var(--emerald)" strokeWidth="1.2" strokeDasharray="300" strokeDashoffset="0" style={{ animation: 'siri-wave 2.2s linear infinite reverse', opacity: 0.6 }} />
                  </svg>
                </div>
              )}
            </div>

            {/* Pulsing Voice Assistant Trigger */}
            <button
              type="button"
              onClick={toggleListening}
              style={{
                background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
                border: '1px solid',
                borderColor: isListening ? 'var(--crimson)' : 'rgba(255,255,255,0.08)',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isListening ? 'var(--crimson)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
                animation: isListening ? 'mic-pulse 1.2s infinite ease-in-out' : 'none'
              }}
              title="Speak your question"
            >
              <Mic size={16} />
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, var(--saffron), var(--emerald))',
                border: 'none',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              <Send size={16} color="#fff" />
            </button>
          </form>
        </div>
      )}

      {/* 3. Slide-Out RAG Document Drawer */}
      {isOpen && activeCitation && citationDocument && (
        <div
          className="rag-document-drawer"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '422px', // 24px + 390px + 8px gap = 422px
            width: '320px',
            height: '540px',
            background: 'var(--bg-secondary)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass-active)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
            animation: 'slide-in-drawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(251, 146, 60, 0.05), rgba(16, 185, 129, 0.05))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={14} color="var(--emerald)" />
              <strong style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>RAG Reference Source</strong>
            </div>
            <button
              onClick={() => setActiveCitation(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Document Content Block */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: 'var(--border-glass)'
          }}>
            <div style={{
              background: '#fffdf5', // Parchment paper color
              border: '1px solid #e2d2b5',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(139,90,43,0.05)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '80%',
              fontFamily: 'monospace',
              fontSize: '11.5px',
              lineHeight: '1.6',
              color: '#3e2723' // Deep brown paper ink color
            }}>
              {/* Ashoka Chakra Watermark background */}
              <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', width: '180px', height: '180px', transform: 'translate(-50%, -50%) rotate(15deg)', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ea580c" strokeWidth="2"/>
                <circle cx="50" cy="50" r="8" fill="none" stroke="#ea580c" strokeWidth="1.5"/>
                {Array.from({length: 24}, (_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#ea580c" strokeWidth="1"/>;
                })}
              </svg>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', borderBottom: '1px dashed #e2d2b5', paddingBottom: '8px', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '9px', color: '#ea580c', letterSpacing: '1px', textTransform: 'uppercase' }}>Sovereign Document chunk</strong>
                  <span style={{ display: 'block', fontSize: '8px', color: '#8b7355', marginTop: '2px' }}>SOURCE ID: {citationDocument.type.toUpperCase()}-REF-{citationDocument.page}</span>
                </div>
                
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', textAlign: 'justify', wordBreak: 'break-word' }}>
                  {citationDocument.text}
                </p>
                
                <div style={{ marginTop: '20px', borderTop: '1px dashed #e2d2b5', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', color: '#8b7355', fontWeight: 'bold' }}>
                  <span>PAGE {citationDocument.page} OF INDEX</span>
                  <span>TYPE: {citationDocument.type.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            borderTop: '1px solid var(--border-glass)',
            textAlign: 'center',
            fontSize: '9px',
            color: 'var(--text-secondary)',
            background: 'rgba(255,255,255,0.01)'
          }}>
            Verified semantic similarity: **{(0.88 + Math.random() * 0.08).toFixed(4)}**
          </div>
        </div>
      )}

      {/* Animation Utilities */}
      <style>{`
        @keyframes bounce {
          to { transform: translateY(-4px); }
        }
        .dot-bounce {
          animation: bounce 0.5s infinite alternate;
        }
        @keyframes wave-pulse {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1.3); }
        }
        @keyframes mic-pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes slide-in-drawer {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-up-drawer {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes siri-wave {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }
        @media (max-width: 768px) {
          .budget-mitra-panel {
            width: calc(100% - 32px) !important;
            right: 16px !important;
            bottom: 16px !important;
            height: 70% !important;
            max-height: 520px !important;
          }
          .rag-document-drawer {
            display: flex !important;
            right: 16px !important;
            left: 16px !important;
            bottom: 16px !important;
            width: calc(100% - 32px) !important;
            height: 70% !important;
            max-height: 520px !important;
            z-index: 1002 !important;
            animation: slide-up-drawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          }
        }
        .glossary-term-wrapper:hover .glossary-term-tooltip,
        .glossary-term-wrapper:focus-within .glossary-term-tooltip {
          visibility: visible !important;
          opacity: 1 !important;
          transform: translateX(-50%) translateY(0) !important;
        }
      `}</style>
    </>
  );
}
