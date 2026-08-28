import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Filter, Search, ChevronLeft, ChevronRight,
  Clock, MapPin, ExternalLink, Sparkles, CheckCircle2, AlertCircle,
  Bell, List, LayoutGrid, Layers
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function ExamCalendar({ setActiveTab }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('Month'); // 'Month' | 'Timeline' | 'List'
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedExamId, setSelectedExamId] = useState(null);

  const months = [
    { id: 'All', name: 'Full Year' },
    { id: '01', name: 'Jan' },
    { id: '02', name: 'Feb' },
    { id: '03', name: 'Mar' },
    { id: '04', name: 'Apr' },
    { id: '05', name: 'May' },
    { id: '06', name: 'Jun' },
    { id: '07', name: 'Jul' },
    { id: '08', name: 'Aug' },
    { id: '09', name: 'Sep' },
    { id: '10', name: 'Oct' },
    { id: '11', name: 'Nov' },
    { id: '12', name: 'Dec' }
  ];

  const categories = [
    'All', 'UPSC', 'SSC', 'Railways', 'Banking', 'Defence',
    'State PSC', 'Teaching', 'Technical', 'Insurance', 'Judiciary', 'Healthcare'
  ];

  const eventTypes = [
    'All', 'Notification', 'Application', 'Admit Card', 'Exam', 'Result'
  ];

  useEffect(() => {
    fetchCalendar();
  }, [selectedMonth, selectedCategory, selectedState]);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const params = {
        month: selectedMonth,
        category: selectedCategory,
        state: selectedState
      };
      const res = await api.get(`/discovery/calendar?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))}`);
      if (res.success) {
        setEvents(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedEventType === 'All'
    ? events
    : events.filter(e => e.event_type === selectedEventType);

  const getEventTypeBadge = (type) => {
    switch (type) {
      case 'Notification':
        return <span className="badge badge-primary">📢 Notice</span>;
      case 'Application':
        return <span className="badge badge-warning" style={{ color: '#92400e', backgroundColor: '#fef3c7' }}>📝 Application</span>;
      case 'Admit Card':
        return <span className="badge badge-secondary">🎫 Admit Card</span>;
      case 'Exam':
        return <span className="badge badge-danger">⚡ Exam Date</span>;
      case 'Result':
        return <span className="badge badge-success">📊 Result</span>;
      default:
        return <span className="badge badge-primary">{type}</span>;
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header with View Toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">Yearly Recruitment Planner</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>280+ Scheduled Exam Milestones</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Government Exam Calendar (2026–2027)
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Track notification dates, application deadlines, admit card releases, and examination dates across India.
          </p>
        </div>

        {/* View Switcher Tabs (Month | Timeline | List) */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          gap: '0.25rem'
        }}>
          {['Month', 'Timeline', 'List'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === mode ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === mode ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {mode === 'Month' && <LayoutGrid size={13} />}
              {mode === 'Timeline' && <Layers size={13} />}
              {mode === 'List' && <List size={13} />}
              <span>{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Month Tabs Bar */}
      <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {months.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMonth(m.id)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: selectedMonth === m.id ? 800 : 500,
                backgroundColor: selectedMonth === m.id ? 'var(--brand-primary)' : 'var(--bg-primary)',
                color: selectedMonth === m.id ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedMonth === m.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Category & Event Type Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Event Type:</span>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
            >
              {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredEvents.length}</strong> scheduled event{filteredEvents.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Events View Stream based on viewMode */}
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
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading recruitment calendar...</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <CalendarIcon size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No events found for this filter</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Try selecting "Full Year" or resetting category filters.
          </p>
        </div>
      ) : viewMode === 'List' ? (
        /* LIST VIEW */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Exam Code</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Event Title</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev, i) => (
                <tr key={ev.id} style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-primary)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{ev.date}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{getEventTypeBadge(ev.event_type)}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{ev.exam_code}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{ev.event_title}</td>
                  <td style={{ padding: '0.85rem 1rem' }}><span className="badge badge-secondary">{ev.category}</span></td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button onClick={() => setSelectedExamId(ev.exam_id)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* TIMELINE & MONTH GRID VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="card"
              style={{
                padding: '1.15rem 1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'transform 0.15s, border-color 0.15s'
              }}
            >
              {/* Event Info Left */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                <div style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                  minWidth: '95px'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'DATE'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {event.date ? new Date(event.date).getDate() : '—'}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    {getEventTypeBadge(event.event_type)}
                    <span className="badge badge-primary">{event.exam_code}</span>
                    <span className="badge badge-secondary">{event.category}</span>
                    {event.state && event.state !== 'All India' && (
                      <span className="badge badge-success">📍 {event.state}</span>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedExamId(event.exam_id)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      margin: 0,
                      cursor: 'pointer'
                    }}
                  >
                    {event.event_title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {event.exam_name}
                  </div>
                </div>
              </div>

              {/* Action Right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedExamId(event.exam_id)}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Exam Details</span>
                </button>
                {event.official_url && (
                  <a
                    href={event.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                  >
                    <span>Portal</span>
                    <ExternalLink size={13} />
                  </a>
                )}
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
