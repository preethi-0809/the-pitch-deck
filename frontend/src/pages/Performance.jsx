import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle, Target, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Performance({ setActiveTab }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerformance() {
      try {
        setLoading(true);
        const res = await api.get('/performance/dashboard');
        if (res.success) {
          setData(res);
        }
      } catch (e) {
        console.error('Failed to load performance analytics:', e);
      } finally {
        setLoading(false);
      }
    }
    loadPerformance();
  }, []);

  const summary = data?.summary || {};
  const weakness = data?.weaknessAnalysis || {};
  const timeAnalysis = data?.timeAnalysis || {};
  const readiness = data?.readiness || {};
  const taxonomy = weakness?.taxonomyBreakdown || {};

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Performance & Error Taxonomy Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Deep diagnostics explaining WHY mistakes occur and pinpointing pacing bottlenecks.
        </p>
      </div>

      {/* Top 4 Stat Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>OVERALL ACCURACY</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>
            {summary.averageAccuracy || 64}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Across all attempted tests</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>SOLVE SPEED PACING</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
            {summary.avgSpeedPerQuestion || 54}s
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Status: {timeAnalysis.status || 'Optimal'}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>REPEATED ERROR CLUSTERS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', margin: '0.25rem 0' }}>
            {weakness.repeatedMistakes?.length || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Topics with 2+ test errors</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>EXAM READINESS SCORE</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>
            {readiness.readinessScore || 58}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{readiness.readinessBand || 'Developing'}</div>
        </div>
      </div>

      {/* Grid: Mistake Taxonomy & Pacing Guidance */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Mistake Taxonomy Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={18} color="#ef4444" />
              <span>Mistake Root-Cause Taxonomy</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.keys(taxonomy).map(key => {
              const item = taxonomy[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.description}</div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.82rem', padding: '0.25rem 0.65rem' }}>
                    {item.count} Errors
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Management & Pacing Analysis */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="#2563eb" />
              <span>Time Management & Pacing Analysis</span>
            </div>
            <span className="badge badge-success">{timeAnalysis.status?.toUpperCase()}</span>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {timeAnalysis.guidance || 'Your solving speed is well within the required thresholds for your target examination.'}
            </div>
          </div>

          <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem' }}>
            Target Section Allocation Recommendation:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px' }}>
              <span>General Studies / Static Concepts:</span>
              <strong>40 mins max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px' }}>
              <span>Quantitative Aptitude & Calculations:</span>
              <strong>50 mins max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px' }}>
              <span>Comprehension & Language / Review:</span>
              <strong>30 mins max</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Repeated Mistakes Alert List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Target size={18} color="#dc2626" />
            <span>High-Priority Repeated Mistakes Across Tests</span>
          </div>
        </div>

        {weakness.repeatedMistakes?.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No repeated multi-test mistake patterns found. Keep up the high accuracy!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {weakness.repeatedMistakes?.map((m, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger-light)',
                  border: '1px solid var(--danger-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--danger)' }}>
                    {m.topic_name} ({m.subject_name})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Occurred in <strong>{m.frequency_count} tests</strong> • Root Cause: <em>{m.mistake_type?.replace('_', ' ')}</em>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('revision')}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                >
                  Schedule Revision
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
