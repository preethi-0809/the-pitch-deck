import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, BookOpen, CheckCircle2, Search, Filter } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PYQ() {
  const { user } = useAuth();
  const [pyqData, setPyqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    async function loadPYQs() {
      try {
        setLoading(true);
        const examId = user?.profile?.target_exam_id || 'exam_upsc_cse';
        const res = await api.get(`/questions/pyqs/${examId}`);
        if (res.success) {
          setPyqData(res);
        }
      } catch (e) {
        console.error('Failed to load PYQs:', e);
      } finally {
        setLoading(false);
      }
    }
    loadPYQs();
  }, [user]);

  const pyqs = pyqData?.pyqs || [];
  const topTopics = pyqData?.topRecurringTopics || [];

  const filteredPYQs = pyqs.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'all' || String(q.pyq_year) === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Previous Year Questions (PYQ) Bank</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Official previous year examination questions categorized by subject and year.
        </p>
      </div>

      {/* AI Trend Insight Banner */}
      <div className="card" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '4px solid var(--brand-primary)', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
          <TrendingUp size={18} />
          <span>AI PYQ Trend Analysis</span>
        </div>
        <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          {pyqData?.trendInsight || 'Analyzing weightage distributions across 2020-2024 papers.'}
        </div>
      </div>

      {/* High Recurring Topic Chips */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.85rem' }}>
          Top Recurring Themes in Recent Papers
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {topTopics.map((t, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ fontWeight: 600 }}>{t.topicName}</span>
              <span className="badge badge-primary">{t.pyqCount} Questions</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search PYQs by keyword or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Year:</span>
            {['all', '2023', '2022', '2021', '2020'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`btn btn-sm ${selectedYear === yr ? 'btn-primary' : 'btn-secondary'}`}
              >
                {yr === 'all' ? 'All Years' : yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PYQ List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredPYQs.map((q, idx) => (
          <div key={q.id || idx} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-warning">{q.pyq_source || 'Official Exam'} • {q.pyq_year}</span>
                <span className="badge badge-neutral">{q.subject_name}</span>
                <span className="badge badge-primary">{q.topic_name}</span>
              </div>
            </div>

            <div style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {q.question_text}
            </div>

            {/* Official Solution Box */}
            <div style={{
              padding: '0.9rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                Official Solution & Analysis:
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {q.explanation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
