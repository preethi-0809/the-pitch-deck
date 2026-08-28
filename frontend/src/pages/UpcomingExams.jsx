import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, ExternalLink, Filter, Search, CheckCircle2,
  ChevronRight, AlertCircle, Bookmark, Target, Sparkles
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function UpcomingExams({ setActiveTab }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All'); // 'All' | 'open' | 'closing_soon' | 'upcoming_exam'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    fetchUpcomingExams();
  }, []);

  const fetchUpcomingExams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/discovery/exams?limit=100&sortBy=date');
      if (res.success) {
        setExams(res.data || []);
      }
    } catch (e) {
      console.error('Error fetching upcoming exams:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (exam.name || '').toLowerCase().includes(q) ||
                    (exam.code || '').toLowerCase().includes(q) ||
                    (exam.organization || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterType === 'open') {
      return exam.status === 'Ongoing' || (exam.days_remaining !== null && exam.days_remaining > 0);
    } else if (filterType === 'closing_soon') {
      return exam.days_remaining !== null && exam.days_remaining <= 14 && exam.days_remaining >= 0;
    } else if (filterType === 'upcoming_exam') {
      return exam.exam_date !== null;
    }
    return true;
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Active & Upcoming Deadlines</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sorted by nearest milestone date</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Upcoming Government Exams & Deadlines
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Never miss an official application window, admit card release, or examination date.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: 'All Upcoming' },
              { id: 'open', label: 'Applications Open' },
              { id: 'closing_soon', label: '🚨 Closing Soon (<= 14 Days)' },
              { id: 'upcoming_exam', label: 'Upcoming Exam Dates' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: filterType === tab.id ? 800 : 500,
                  backgroundColor: filterType === tab.id ? 'var(--brand-primary)' : 'var(--bg-primary)',
                  color: filterType === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${filterType === tab.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search upcoming..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
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
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading upcoming exams...</div>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Calendar size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No matching examinations found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Try switching filter tabs or clearing your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredExams.map(exam => (
            <div
              key={exam.id}
              className="card"
              style={{
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: exam.is_urgent ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span className="badge badge-primary">{exam.code}</span>
                    <span className="badge badge-secondary">{exam.category}</span>
                  </div>
                  {exam.days_remaining !== null && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: exam.is_urgent ? 'var(--danger)' : 'var(--brand-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Clock size={12} /> {exam.countdown_label}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => setSelectedExamId(exam.id)}
                  style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', cursor: 'pointer' }}
                >
                  {exam.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  {exam.organization}
                </div>

                {/* Timeline Matrix */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-primary)',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Application Opens:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{exam.application_start || 'Announced in Gazette'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Application Closes:</span>
                    <strong style={{ color: exam.is_urgent ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {exam.application_end || 'Pending Notification'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Exam Date:</span>
                    <strong style={{ color: 'var(--brand-primary)' }}>{exam.exam_date || 'To be notified'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Eligibility:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{exam.qualification}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setSelectedExamId(exam.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <span>Details</span>
                </button>
                <a
                  href={exam.official_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', textDecoration: 'none' }}
                >
                  <span>Apply Officially</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedExamId && (
        <ExamDetailsModal
          examId={selectedExamId}
          onClose={() => setSelectedExamId(null)}
          onSelectRoadmap={() => {
            setSelectedExamId(null);
            if (setActiveTab) setActiveTab('preparation');
          }}
        />
      )}
    </div>
  );
}
