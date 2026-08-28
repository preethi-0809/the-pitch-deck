import React, { useState, useEffect } from 'react';
import {
  Scale, Plus, X, Sparkles, CheckCircle2, AlertCircle, ArrowRight,
  ExternalLink, Layers, DollarSign, Calendar, BookOpen
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function ExamCompare({ initialExamIds = [], setActiveTab }) {
  const [allExams, setAllExams] = useState([]);
  const [selectedIds, setSelectedIds] = useState(initialExamIds.length > 0 ? initialExamIds : ['exam_ssc_cgl', 'exam_rbi_grade_b', 'exam_tnpsc_grp2']);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModalId, setSelectedModalId] = useState(null);

  useEffect(() => {
    fetchAllExamsList();
  }, []);

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchComparison();
    }
  }, [selectedIds]);

  const fetchAllExamsList = async () => {
    try {
      const res = await api.get('/discovery/exams?limit=100');
      if (res.success) setAllExams(res.data || []);
    } catch (e) {
      // ignore
    }
  };

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const res = await api.post('/discovery/compare', { exam_ids: selectedIds });
      if (res.success) {
        setComparisonData(res.data);
      }
    } catch (err) {
      console.error('Error comparing exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = (examId) => {
    if (selectedIds.includes(examId)) return;
    if (selectedIds.length >= 4) {
      alert('You can compare up to 4 exams simultaneously.');
      return;
    }
    setSelectedIds([...selectedIds, examId]);
  };

  const handleRemoveExam = (examId) => {
    setSelectedIds(selectedIds.filter(id => id !== examId));
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">Comparison Matrix</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compare 2 to 4 Examinations Side-by-Side</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Side-by-Side Exam Comparison
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Evaluate educational eligibility, pay matrix, selection difficulty, syllabus weight, and career ROI.
          </p>
        </div>

        {/* Quick Add Dropdown */}
        {selectedIds.length < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddExam(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', minWidth: '220px' }}
            >
              <option value="" disabled>+ Add Exam to Compare...</option>
              {allExams
                .filter(e => !selectedIds.includes(e.id))
                .map(e => (
                  <option key={e.id} value={e.id}>{e.code} – {e.name}</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Exams Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {selectedIds.map(id => {
          const ex = allExams.find(e => e.id === id);
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-light)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--brand-primary)'
              }}
            >
              <span>{ex ? ex.code : id}</span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemoveExam(id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Best For You Verdict Card */}
      {comparisonData?.best_pick && (
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                AI Best Choice Verdict
              </span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Top Recommendation: {comparisonData.best_pick.name} ({comparisonData.best_pick.code})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {comparisonData.best_pick.verdict_reason}
            </div>
          </div>

          <button
            onClick={() => setSelectedModalId(comparisonData.best_pick.exam_id)}
            className="btn btn-primary btn-sm"
          >
            <span>Explore {comparisonData.best_pick.code}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Comparison Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '3px solid var(--border-subtle)',
            borderTopColor: 'var(--brand-primary)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Comparing examinations...</div>
        </div>
      ) : !comparisonData || comparisonData.exams.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Scale size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Select at least 2 exams to compare</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1.25rem 1rem', width: '220px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Feature / Metric
                  </th>
                  {comparisonData.exams.map(exam => (
                    <th key={exam.id} style={{ padding: '1.25rem 1rem', minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="badge badge-primary">{exam.code}</span>
                        <button
                          onClick={() => handleRemoveExam(exam.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem', lineHeight: 1.3 }}>
                        {exam.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.comparison_matrix.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-primary)'
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)', verticalAlign: 'top' }}>
                      {row.feature}
                    </td>
                    {row.values.map((val, colIdx) => (
                      <td key={colIdx} style={{ padding: '1rem', color: 'var(--text-secondary)', verticalAlign: 'top', lineHeight: 1.5 }}>
                        {row.key === 'official_url' ? (
                          <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span>Portal</span>
                            <ExternalLink size={13} />
                          </a>
                        ) : row.key === 'in_hand_salary' ? (
                          <span style={{ fontWeight: 800, color: 'var(--success)' }}>{val}</span>
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedModalId && (
        <ExamDetailsModal
          examId={selectedModalId}
          onClose={() => setSelectedModalId(null)}
          onSelectRoadmap={() => {
            setSelectedModalId(null);
            if (setActiveTab) setActiveTab('preparation');
          }}
        />
      )}
    </div>
  );
}
