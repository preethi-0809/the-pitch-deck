import React, { useState, useEffect } from 'react';
import {
  BookOpen, Sparkles, Calendar, CheckCircle2, Clock, Award,
  ArrowRight, FileText, BarChart2, Layers, HelpCircle, RefreshCw
} from 'lucide-react';
import api from '../services/api';

export default function PreparationHub({ defaultExamId = 'exam_upsc_cse', setActiveTab }) {
  const [allExams, setAllExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(defaultExamId);
  const [durationDays, setDurationDays] = useState(60);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    fetchExamsList();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      generateRoadmap();
    }
  }, [selectedExamId, durationDays]);

  const fetchExamsList = async () => {
    try {
      const res = await api.get('/discovery/exams?limit=100');
      if (res.success) setAllExams(res.data || []);
    } catch (e) {
      // ignore
    }
  };

  const generateRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.post('/discovery/roadmap', {
        examId: selectedExamId,
        durationDays
      });
      if (res.success) {
        setRoadmap(res.data);
        setActiveWeek(1);
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">AI Preparation Suite</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adaptive Study Roadmaps & High-Yield Strategy</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Structured Exam Preparation & Roadmaps
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Enter your custom preparation duration (in days) to generate an adaptive day-by-day study schedule calibrated for your target exam.
          </p>
        </div>
      </div>

      {/* Selector Control Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', flexWrap: 'wrap', flex: '1 1 500px' }}>
            <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Select Target Examination
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.85rem', fontSize: '0.9rem', fontWeight: 600 }}
              >
                {allExams.map(e => (
                  <option key={e.id} value={e.id}>{e.code} – {e.name}</option>
                ))}
              </select>
            </div>

            {/* Custom User-Entered Plan Duration */}
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Plan Duration (Enter Custom Days)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '130px' }}>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={durationDays}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      setDurationDays(val);
                    }}
                    onBlur={() => {
                      if (!durationDays || Number(durationDays) < 7) setDurationDays(30);
                      else if (Number(durationDays) > 365) setDurationDays(365);
                    }}
                    placeholder="Days"
                    style={{
                      width: '100%',
                      padding: '0.55rem 2.4rem 0.55rem 0.85rem',
                      fontSize: '0.9rem',
                      fontWeight: 700
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    pointerEvents: 'none'
                  }}>
                    Days
                  </span>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[15, 30, 45, 60, 90, 120, 180].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      style={{
                        padding: '0.42rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.76rem',
                        fontWeight: Number(durationDays) === d ? 800 : 500,
                        backgroundColor: Number(durationDays) === d ? 'var(--brand-primary)' : 'var(--bg-primary)',
                        color: Number(durationDays) === d ? '#ffffff' : 'var(--text-secondary)',
                        border: `1px solid ${Number(durationDays) === d ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button onClick={generateRoadmap} className="btn btn-secondary btn-sm" style={{ padding: '0.55rem 0.95rem' }}>
              <RefreshCw size={14} />
              <span>Regenerate Roadmap</span>
            </button>
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('tests');
              }}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.55rem 0.95rem' }}
            >
              <span>Take Full Mock Test</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
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
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Generating {durationDays}-Day AI Preparation Plan...</div>
        </div>
      ) : !roadmap ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>Select an exam to load preparation roadmap</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Week Selector Sidebar */}
          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Weekly Milestones ({roadmap.total_weeks} Weeks)
            </div>

            {roadmap.weekly_schedule && roadmap.weekly_schedule.map(week => (
              <button
                key={week.week_number}
                onClick={() => setActiveWeek(week.week_number)}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  backgroundColor: activeWeek === week.week_number ? 'var(--brand-light)' : 'var(--bg-primary)',
                  border: `1px solid ${activeWeek === week.week_number ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  color: activeWeek === week.week_number ? 'var(--brand-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Week {week.week_number}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {week.title.split(':')[1] || week.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Week Day-by-Day Schedule */}
          <div>
            {roadmap.weekly_schedule && roadmap.weekly_schedule.find(w => w.week_number === activeWeek) && (
              <div className="card" style={{ padding: '1.5rem' }}>
                {(() => {
                  const currentWeek = roadmap.weekly_schedule.find(w => w.week_number === activeWeek);
                  return (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                          <span className="badge badge-primary">Week {currentWeek.week_number} Schedule</span>
                          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem', marginBottom: 0 }}>
                            {currentWeek.title}
                          </h2>
                        </div>
                      </div>

                      {/* Focus Topics */}
                      <div style={{
                        padding: '0.9rem 1.15rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '1.25rem',
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                          🎯 Weekly Key Focus Domains:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {currentWeek.focus_areas.map((area, i) => (
                            <span key={i} className="badge badge-secondary">{area}</span>
                          ))}
                        </div>
                      </div>

                      {/* Daily Tasks List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {currentWeek.daily_targets && currentWeek.daily_targets.map(d => (
                          <div
                            key={d.day}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.9rem 1.15rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)'
                              }}>
                                D{d.day}
                              </div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {d.task}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                              <Clock size={13} />
                              <span>{d.hours} hrs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
