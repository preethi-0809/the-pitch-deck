import React from 'react';
import { Target, TrendingUp, CheckSquare, AlertTriangle } from 'lucide-react';

export default function ReadinessMeter({ readiness }) {
  const score = readiness?.readinessScore || 58;
  const band = readiness?.readinessBand || 'Developing Stage';
  const metrics = readiness?.metrics || {};

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Target size={19} color="#2563eb" />
          <span>Exam Readiness Index</span>
        </div>
        <span className="badge badge-primary">{band}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '0.75rem 0 1.25rem 0' }}>
        {/* Readiness Radial Indicator */}
        <div style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: `conic-gradient(#2563eb ${score * 3.6}deg, var(--border-subtle) 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {score}%
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              READINESS
            </span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Syllabus Coverage</span>
              <strong>{metrics.syllabusCompletionRate || 42}%</strong>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${metrics.syllabusCompletionRate || 42}%`, height: '100%', backgroundColor: '#3b82f6' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mock Test Accuracy</span>
              <strong>{metrics.averageMockAccuracy || 64}%</strong>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${metrics.averageMockAccuracy || 64}%`, height: '100%', backgroundColor: '#10b981' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '0.75rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-primary)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.4
      }}>
        {readiness?.readinessAdvice || 'Maintain steady daily completion of high-yield topics to elevate readiness.'}
      </div>
    </div>
  );
}
