import React from 'react';
import ConceptFlowchart from './ConceptFlowchart';
import { BookOpen, CheckCircle2, Bookmark, Lightbulb, AlertCircle } from 'lucide-react';

export default function BookContentRenderer({ content, topicCode, topicName, fontSize = 16 }) {
  if (!content) return null;

  // Helper to parse bold and italic inline markup cleanly
  const renderFormattedText = (text) => {
    if (!text) return '';
    // Split by bold (**text**)
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  // Split lines
  const rawLines = content.split('\n');
  const elements = [];
  let tableBuffer = [];
  let inTable = false;
  let hasRenderedFlowchart = false;

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim();

    // Table detection: starts with '|'
    if (line.startsWith('|')) {
      tableBuffer.push(line);
      inTable = true;
      continue;
    } else if (inTable) {
      // Flush table buffer
      if (tableBuffer.length > 0) {
        elements.push(renderTable(tableBuffer, `tbl_${i}`));
        tableBuffer = [];
      }
      inTable = false;
    }

    if (!line) {
      continue;
    }

    // Level 1 Heading (# Title) - Strip hashtag and format as Chapter Title
    if (line.startsWith('# ')) {
      const headingText = line.replace(/^#\s+/, '').trim();
      elements.push(
        <div key={`h1_${i}`} style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            CHAPTER STUDY MODULE
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            {headingText}
          </h2>
        </div>
      );
      continue;
    }

    // Level 2 Heading (## Section) - Strip hashtag and format as Section Title
    if (line.startsWith('## ')) {
      const headingText = line.replace(/^##\s+/, '').trim();
      
      // Inject Concept Flowchart after section 1 or section 2
      if (!hasRenderedFlowchart && i > 5) {
        elements.push(<ConceptFlowchart key={`flow_${i}`} topicCode={topicCode} topicName={topicName} />);
        hasRenderedFlowchart = true;
      }

      elements.push(
        <div key={`h2_${i}`} style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span style={{ width: '4px', height: '18px', backgroundColor: 'var(--brand-primary)', borderRadius: '2px', display: 'inline-block' }} />
            <span>{headingText}</span>
          </h3>
        </div>
      );
      continue;
    }

    // Level 3 Heading (### Sub-Section) - Strip hashtag
    if (line.startsWith('### ')) {
      const headingText = line.replace(/^###\s+/, '').trim();
      elements.push(
        <h4 key={`h3_${i}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '1.25rem', marginBottom: '0.6rem' }}>
          {headingText}
        </h4>
      );
      continue;
    }

    // Blockquote (> Quote) - Format as elegant callout card
    if (line.startsWith('>')) {
      const quoteText = line.replace(/^>\s*/, '').trim();
      elements.push(
        <div key={`quote_${i}`} style={{
          margin: '1.25rem 0',
          padding: '1rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-primary)',
          borderLeft: '4px solid var(--brand-primary)',
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          fontSize: `${fontSize}px`,
          lineHeight: 1.6
        }}>
          {renderFormattedText(quoteText)}
        </div>
      );
      continue;
    }

    // Numbered or Bullet list items (- or 1. or 2.)
    if (line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)) {
      const isNumbered = Boolean(line.match(/^\d+\.\s+/));
      const cleanItem = line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      elements.push(
        <div key={`li_${i}`} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          margin: '0.5rem 0',
          fontSize: `${fontSize}px`,
          lineHeight: 1.65,
          color: 'var(--text-primary)'
        }}>
          <span style={{
            color: 'var(--brand-primary)',
            fontWeight: 800,
            marginTop: '0.1rem',
            fontSize: '0.85rem'
          }}>
            {isNumbered ? '•' : '▪'}
          </span>
          <div style={{ flex: 1 }}>
            {renderFormattedText(cleanItem)}
          </div>
        </div>
      );
      continue;
    }

    // Standard Textbook Paragraph
    elements.push(
      <p key={`p_${i}`} style={{
        margin: '0.85rem 0',
        fontSize: `${fontSize}px`,
        lineHeight: 1.75,
        color: 'var(--text-primary)',
        textAlign: 'justify'
      }}>
        {renderFormattedText(line)}
      </p>
    );
  }

  // Flush any trailing table
  if (tableBuffer.length > 0) {
    elements.push(renderTable(tableBuffer, 'tbl_end'));
  }

  // Ensure flowchart is rendered even if no second section heading was reached
  if (!hasRenderedFlowchart) {
    elements.push(<ConceptFlowchart key="flow_final" topicCode={topicCode} topicName={topicName} />);
  }

  return (
    <div className="book-reader-body" style={{ maxWidth: '850px', margin: '0 auto' }}>
      {elements}
    </div>
  );
}

// Helper to render markdown table buffer into clean HTML table
function renderTable(lines, key) {
  if (lines.length < 2) return null;

  // Filter out separator rows like |---|---|
  const rows = lines.map(line => {
    return line.split('|').map(c => c.trim()).filter(c => c.length > 0);
  }).filter(r => r.length > 0 && !r[0].includes('---'));

  if (rows.length === 0) return null;

  const headerRow = rows[0];
  const dataRows = rows.slice(1);

  return (
    <div key={key} style={{ margin: '1.5rem 0', overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '2px solid var(--border-medium)' }}>
            {headerRow.map((cell, idx) => (
              <th key={idx} style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx} style={{
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: rIdx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-primary)'
            }}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
