import React from 'react';
import { GLOSSARY } from '../utils/glossary';

export default function GlossaryTooltip({ termKey, children }) {
  const item = GLOSSARY[termKey];
  if (!item) return <span>{children}</span>;

  return (
    <span className="glossary-tooltip-container">
      {children}
      <span className="glossary-tooltip-box">
        <strong style={{ color: 'var(--saffron)', display: 'block', marginBottom: '4px', fontSize: '11.5px' }}>
          {item.term}
        </strong>
        {item.definition}
      </span>
    </span>
  );
}
