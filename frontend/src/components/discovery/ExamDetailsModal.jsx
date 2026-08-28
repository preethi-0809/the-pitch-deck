import React, { useState, useEffect } from 'react';
import {
  X, ExternalLink, Calendar, BookOpen, Award, CheckCircle2,
  Clock, DollarSign, ShieldAlert, Sparkles, Bookmark, Target,
  Layers, FileText, ChevronRight, AlertCircle, Share2
} from 'lucide-react';
import api from '../../services/api';

export default function ExamDetailsModal({ examId, onClose, onSelectRoadmap }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'dates' | 'eligibility' | 'pattern' | 'syllabus' | 'selection' | 'salary'
  const [isSaved, setIsSaved] = useState(false);
  const [isTarget, setIsTarget] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (!examId) return;
    loadExamDetails();
  }, [examId]);

  const loadExamDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/discovery/exams/${examId}`);
      if (res.success && res.data) {
        setExam(res.data);
      }
    } catch (err) {
      console.error('Error loading exam details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSaved = async () => {
    try {
      const res = await api.post('/discovery/saved/toggle', { examId });
      setIsSaved(res.saved);
      showToast(res.message);
    } catch (err) {
      showToast('Action recorded');
      setIsSaved(!isSaved);
    }
  };

  const handleToggleTarget = async () => {
    try {
      const res = await api.post('/discovery/targets/toggle', { examId, priority: 'primary' });
      setIsTarget(res.targeted);
      showToast(res.message);
    } catch (err) {
      showToast('Added to target exams');
      setIsTarget(!isTarget);
    }
  };

  const showToast = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  if (!examId) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{exam?.code || 'EXAM'}</span>
              <span className="badge badge-secondary">{exam?.category}</span>
              {exam?.state && exam.state !== 'All India' && (
                <span className="badge badge-success">📍 {exam.state}</span>
              )}
              {exam?.last_verified && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} color="var(--success)" /> Verified on: {exam.last_verified}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {exam?.name || 'Loading Exam Profile...'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
              {exam?.organization}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleToggleSaved}
              className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
              title={isSaved ? 'Saved' : 'Save / Bookmark Exam'}
            >
              <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={handleToggleTarget}
              className={`btn btn-sm ${isTarget ? 'btn-success' : 'btn-secondary'}`}
              title="Add to Target Exams"
            >
              <Target size={15} />
              <span>{isTarget ? 'Targeted' : 'Set Target'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {actionMsg && (
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            textAlign: 'center',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            ✓ {actionMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 1rem',
          backgroundColor: 'var(--bg-surface)',
          gap: '0.25rem'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'dates', label: 'Important Dates' },
            { id: 'eligibility', label: 'Eligibility & Age' },
            { id: 'pattern', label: 'Exam Pattern' },
            { id: 'syllabus', label: 'Syllabus & Topics' },
            { id: 'selection', label: 'Selection Process' },
            { id: 'salary', label: 'Salary & Perks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.84rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--brand-primary)' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1,
          backgroundColor: 'var(--bg-surface)'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--brand-primary)',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem auto'
              }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading verified exam details...</div>
            </div>
          ) : !exam ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Exam information not available.</div>
          ) : (
            <div>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    lineHeight: 1.6,
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)'
                  }}>
                    {exam.description}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Qualification</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{exam.qualification}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{exam.degree_required}</div>
                    </div>

                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age Bracket</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{exam.age_min} – {exam.age_max} Years</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Relaxation as per norms</div>
                    </div>

                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Salary</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>{exam.in_hand_salary || `₹${exam.salary_min} - ₹${exam.salary_max}`}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{exam.pay_level}</div>
                    </div>

                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frequency & Cadre</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{exam.frequency} Recruitment</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{exam.job_type} Cadre</div>
                    </div>
                  </div>

                  {/* Highlights Banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(13, 148, 136, 0.08) 100%)',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        Ready to prepare for {exam.code}?
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Generate custom 30/60/90-Day study roadmaps and practice with verified PYQs.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onSelectRoadmap) onSelectRoadmap(exam.id);
                        setActiveTab('syllabus');
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Sparkles size={14} />
                      <span>Start AI Study Plan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: IMPORTANT DATES */}
              {activeTab === 'dates' && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Recruitment Cycle & Milestone Timeline ({exam.dates?.cycle_name || '2026-2027'})
                  </h3>

                  {exam.dates ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { label: 'Official Notification Release', date: exam.dates.notification_date, type: 'Notice', color: 'var(--brand-primary)' },
                        { label: 'Online Application Window Opens', date: exam.dates.application_start, type: 'Apply', color: 'var(--accent-teal)' },
                        { label: 'Last Date for Online Application & Fee', date: exam.dates.application_end, type: 'Deadline', color: 'var(--danger)', isKey: true },
                        { label: 'Hall Ticket / Admit Card Release', date: exam.dates.admit_card_date, type: 'Admit Card', color: 'var(--warning)' },
                        { label: 'Preliminary / Tier-I Exam Date', date: exam.dates.exam_date, type: 'Exam', color: 'var(--brand-primary)', isKey: true },
                        { label: 'Result & Scorecard Declaration', date: exam.dates.result_date, type: 'Result', color: 'var(--success)' },
                        { label: 'Mains / Interview / Personality Test', date: exam.dates.interview_date, type: 'Stage 2', color: 'var(--accent-indigo)' },
                        { label: 'Final Merit List & Allotment', date: exam.dates.final_result_date, type: 'Final', color: 'var(--success)' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.9rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: item.isKey ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-primary)',
                            border: `1px solid ${item.isKey ? 'var(--brand-light)' : 'var(--border-subtle)'}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: item.color
                            }} />
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: item.isKey ? 800 : 600, color: 'var(--text-primary)' }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.type} Milestone</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: item.date ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                              {item.date || 'To be announced'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Detailed timeline dates will be published upon official notification release.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ELIGIBILITY & AGE */}
              {activeTab === 'eligibility' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      🎓 Educational Qualification
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      <strong>Required Standard:</strong> {exam.qualification}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.4rem', marginBottom: 0 }}>
                      <strong>Eligible Streams:</strong> {exam.degree_required}
                    </p>
                  </div>

                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      🎂 Age Limit & Category Relaxations
                    </h4>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                      General / Unreserved: {exam.age_min} to {exam.age_max} Years
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <div>• <strong>OBC (Non-Creamy):</strong> +3 Years ({exam.age_max + 3} Years Max)</div>
                      <div>• <strong>SC / ST Candidates:</strong> +5 Years ({exam.age_max + 5} Years Max)</div>
                      <div>• <strong>PwBD Benchmark:</strong> +10 Years</div>
                      <div>• <strong>Ex-Servicemen:</strong> As per Central / State norms</div>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      🇮🇳 Nationality & Language Requirements
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      • Citizen of India, subject of Nepal/Bhutan, or Tibetan refugee.<br />
                      {exam.state === 'Tamil Nadu' ? '• Adequate knowledge of Tamil (SSLC standard) or must pass Second Class Language Test within 2 years.' : '• Proficient in English and Hindi / State Regional Language.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: EXAM PATTERN */}
              {activeTab === 'pattern' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      📝 Examination Pattern & Marking Scheme
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                      {exam.exam_pattern_summary}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Marks</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                        {exam.total_marks || 200} Marks
                      </div>
                    </div>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                        {exam.duration_minutes || 120} Minutes
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SYLLABUS & TOPICS */}
              {activeTab === 'syllabus' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Official Syllabus & Topic Priority Breakdown
                    </h3>
                    <span className="badge badge-primary">{exam.subjects?.length || 0} Subject Domains</span>
                  </div>

                  {exam.subjects && exam.subjects.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {exam.subjects.map(subject => (
                        <div key={subject.id} className="card" style={{ padding: '1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                {subject.name}
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subject.code}</span>
                            </div>
                            <span className="badge badge-secondary">{subject.weightage_percentage || 25}% Weightage</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {subject.topics && subject.topics.map(topic => (
                              <div
                                key={topic.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-primary)',
                                  fontSize: '0.84rem'
                                }}
                              >
                                <div>
                                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{topic.name}</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({topic.estimated_hours || 3} hrs study)</span>
                                </div>
                                <span className={`badge ${topic.priority_label === 'High Priority' ? 'badge-danger' : topic.priority_label === 'Medium Priority' ? 'badge-warning' : 'badge-primary'}`}>
                                  {topic.priority_label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Full syllabus breakdown with high-yield topics will be loaded from syllabus repository.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SELECTION PROCESS */}
              {activeTab === 'selection' && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Step-by-Step Selection Pipeline
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {exam.selection_steps && exam.selection_steps.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SALARY & PERKS */}
              {activeTab === 'salary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      In-Hand Monthly Compensation
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--success)', marginTop: '0.35rem' }}>
                      {exam.in_hand_salary || `₹${exam.salary_min.toLocaleString()} - ₹${exam.salary_max.toLocaleString()} / month`}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Pay Scale Level: <strong>{exam.pay_level}</strong>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      🎁 Allowances & Government Perks Included
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      <div>• <strong>Dearness Allowance (DA):</strong> 50%+ 7th CPC rate</div>
                      <div>• <strong>House Rent Allowance (HRA):</strong> Up to 27% (X/Y/Z cities)</div>
                      <div>• <strong>Transport Allowance (TA):</strong> With DA on TA</div>
                      <div>• <strong>Government Quarters:</strong> Type-IV / Type-V where applicable</div>
                      <div>• <strong>CGHS Medical Benefits:</strong> Full family coverage</div>
                      <div>• <strong>NPS Pension:</strong> 14% Government matching</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Official Source: <a href={exam?.official_url || 'https://upsc.gov.in'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{exam?.official_url || 'Official Website'}</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
            <a
              href={exam?.official_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <span>Apply Officially</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
