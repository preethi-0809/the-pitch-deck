import React from 'react';
import { AlertCircle, ArrowUpRight, BookOpen } from 'lucide-react';

export default function WeaknessAlertCard({ weaknessData, onReviseTopic }) {
  const repeated = weaknessData?.repeatedMistakes || [];
  const taxonomy = weaknessData?.taxonomyBreakdown || {};

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <AlertCircle size={19} color="#dc2626" />
          <span>Mistake & Weakness Tracker</span>
        </div>
        <span className="badge badge-danger">
          {repeated.length} Repeated Issue{repeated.length === 1 ? '' : 's'}
        </span>
      </div>

      {repeated.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          No high-frequency mistakes detected. Keep up your active test practice!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {repeated.slice(0, 2).map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-light)',
                border: '1px solid var(--danger-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--danger)' }}>
                  {item.topic_name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {item.subject_name} • Errors in <strong>{item.frequency_count} tests</strong> ({item.mistake_type?.replace('_', ' ')})
                </div>
              </div>
              <button
                onClick={() => onReviseTopic && onReviseTopic(item.topic_id)}
                className="btn btn-outline btn-sm"
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)', gap: '0.3rem' }}
              >
                <BookOpen size={13} />
                <span>Revise</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mistake Taxonomy Summary Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
        {Object.keys(taxonomy).map(key => {
          const t = taxonomy[key];
          if (t.count === 0) return null;
          return (
            <span key={key} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
              {t.label}: <strong>{t.count}</strong>
            </span>
          );
        })}
      </div>
    </div>
  );
}
