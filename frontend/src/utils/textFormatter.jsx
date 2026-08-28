import React from 'react';

export function FormattedText({ text, fontSize = '0.94rem', lineHeight = 1.6 }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  const parseInline = (str) => {
    if (!str) return '';
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`sp_${idx}`} style={{ height: '0.5rem' }} />);
      return;
    }

    // Strip ### or ## or # hashtags and format as clean subtitle
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const heading = trimmed.replace(/^#+\s+/, '');
      elements.push(
        <div key={`h_${idx}`} style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--brand-primary)', marginTop: '0.85rem', marginBottom: '0.4rem' }}>
          {heading}
        </div>
      );
      return;
    }

    // List bullets (- or • or 1.)
    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      const clean = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      elements.push(
        <div key={`l_${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: '0.35rem 0', fontSize, lineHeight }}>
          <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>•</span>
          <div style={{ flex: 1 }}>{parseInline(clean)}</div>
        </div>
      );
      return;
    }

    // Quote block (> text)
    if (trimmed.startsWith('>')) {
      const quote = trimmed.replace(/^>\s*/, '');
      elements.push(
        <div key={`q_${idx}`} style={{ margin: '0.6rem 0', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)', borderLeft: '3px solid var(--brand-primary)', fontStyle: 'italic', fontSize, lineHeight }}>
          {parseInline(quote)}
        </div>
      );
      return;
    }

    // Normal paragraph
    elements.push(
      <p key={`p_${idx}`} style={{ margin: '0.35rem 0', fontSize, lineHeight, color: 'var(--text-primary)' }}>
        {parseInline(trimmed)}
      </p>
    );
  });

  return <div>{elements}</div>;
}
