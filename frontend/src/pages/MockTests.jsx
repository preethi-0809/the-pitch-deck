import React, { useState, useEffect } from 'react';
import { Award, Clock, CheckCircle2, Bookmark, ArrowRight, RotateCcw, AlertTriangle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MockTests() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // seconds
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const res = await api.get('/tests');
        if (res.success) {
          setTests(res.tests);
        }
      } catch (e) {
        console.error('Failed to load tests:', e);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  // Timer countdown while taking test
  useEffect(() => {
    if (!activeTest || testResult) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTest, testResult]);

  const handleStartTest = async (testId) => {
    try {
      setLoading(true);
      const res = await api.get(`/tests/${testId}`);
      if (res.success && res.test) {
        setActiveTest(res.test);
        setCurrentQIndex(0);
        setUserAnswers({});
        setMarkedForReview({});
        setTimeLeft((res.test.duration_minutes || 30) * 60);
        setTestResult(null);
      }
    } catch (e) {
      console.error('Failed to start test:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionKey) => {
    if (!activeTest?.questions?.[currentQIndex]) return;
    const qId = activeTest.questions[currentQIndex].question_id;
    setUserAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const toggleMarkForReview = () => {
    if (!activeTest?.questions?.[currentQIndex]) return;
    const qId = activeTest.questions[currentQIndex].question_id;
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest || submitting) return;
    try {
      setSubmitting(true);
      const answersPayload = activeTest.questions.map(q => ({
        question_id: q.question_id,
        selected_option_key: userAnswers[q.question_id] || null,
        time_spent_seconds: 45
      }));

      const durationSeconds = (activeTest.duration_minutes * 60) - timeLeft;
      const res = await api.post(`/tests/${activeTest.id}/submit`, {
        answers: answersPayload,
        timeTakenSeconds: Math.max(30, durationSeconds)
      });

      if (res.success) {
        setTestResult(res);
      }
    } catch (e) {
      console.error('Failed to submit test:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. Post-Test Result Diagnostic View
  if (testResult) {
    const { result, postTestWorkflow } = testResult;
    return (
      <div className="page-body">
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>TEST EVALUATED</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Performance & Mistake Diagnosis</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activeTest?.title}</p>
            </div>
            <button onClick={() => { setActiveTest(null); setTestResult(null); }} className="btn btn-secondary btn-sm">
              <RotateCcw size={15} />
              <span>Back to Tests</span>
            </button>
          </div>

          {/* Key Stat Cards */}
          <div className="grid-4" style={{ margin: '1.5rem 0' }}>
            <div className="card" style={{ backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>FINAL SCORE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.3rem 0' }}>
                {result.score} / {result.total_marks}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{result.percentage}% Marks</div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACCURACY</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: result.accuracy >= 60 ? '#10b981' : '#f59e0b', margin: '0.3rem 0' }}>
                {result.accuracy}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{result.correct_count} Correct / {result.attempted_count} Attempted</div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>INCORRECT ANSWERS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', margin: '0.3rem 0' }}>
                {result.incorrect_count}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Negative marks deducted</div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>UNATTEMPTED</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-secondary)', margin: '0.3rem 0' }}>
                {result.unanswered_count}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Skipped questions</div>
            </div>
          </div>

          {/* AI Coach Actionable Diagnostic */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--brand-light)',
            border: '1px solid var(--border-focus)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.4rem' }}>
              <Sparkles size={18} />
              <span>AI Post-Test Diagnostic & Weakness Report</span>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {postTestWorkflow?.performanceAnalysis?.primaryRecommendation || 'Great attempt! Review incorrect questions below.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full-Screen Interactive Test Simulator
  if (activeTest) {
    const questions = activeTest.questions || [];
    const currentQ = questions[currentQIndex];
    const selectedOpt = userAnswers[currentQ?.question_id];
    const isMarked = Boolean(markedForReview[currentQ?.question_id]);

    return (
      <div className="page-body">
        {/* Test Simulator Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', backgroundColor: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {activeTest.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Question {currentQIndex + 1} of {questions.length} • +2.0 / -0.66 marks
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '1.15rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: timeLeft < 300 ? '#ef4444' : 'var(--text-primary)',
              backgroundColor: 'var(--bg-primary)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Clock size={18} color={timeLeft < 300 ? '#ef4444' : '#2563eb'} />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button onClick={handleSubmitTest} disabled={submitting} className="btn btn-primary btn-sm">
              {submitting ? 'Evaluating...' : 'Submit Test'}
            </button>
          </div>
        </div>

        {/* 2 Column Test Runner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Question Panel */}
          <div className="card" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-primary">Q{currentQIndex + 1} • {currentQ?.topic_name}</span>
                <button
                  onClick={toggleMarkForReview}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isMarked ? '#7c3aed' : 'var(--text-muted)'
                  }}
                >
                  <Bookmark size={15} fill={isMarked ? '#7c3aed' : 'none'} />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div style={{ fontSize: '1.08rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.55 }}>
                {currentQ?.question_text}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQ?.options?.map(opt => {
                  const isSelected = selectedOpt === opt.option_key;
                  return (
                    <button
                      key={opt.option_key}
                      onClick={() => handleSelectOption(opt.option_key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.9rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'var(--brand-light)' : 'var(--bg-surface-elevated)',
                        border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.95rem'
                      }}
                    >
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {opt.option_key}
                      </span>
                      <span>{opt.option_text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <button
                onClick={() => handleSelectOption(null)}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Clear Response
              </button>

              <button
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQIndex === questions.length - 1}
                className="btn btn-primary btn-sm"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Question Palette Grid */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '1rem' }}>
              Question Palette ({questions.length})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {questions.map((q, idx) => {
                const isAttempted = Boolean(userAnswers[q.question_id]);
                const isReview = Boolean(markedForReview[q.question_id]);
                const isCurrent = idx === currentQIndex;

                let bg = 'var(--bg-primary)';
                let color = 'var(--text-secondary)';
                if (isAttempted) {
                  bg = '#10b981';
                  color = '#ffffff';
                }
                if (isReview) {
                  bg = '#7c3aed';
                  color = '#ffffff';
                }
                if (isCurrent) {
                  bg = 'var(--brand-primary)';
                  color = '#ffffff';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    style={{
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: bg,
                      color: color,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isCurrent ? '2px solid #ffffff' : 'none'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }} />
                <span>Attempted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#7c3aed' }} />
                <span>Marked for Review</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }} />
                <span>Unattempted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Test Selection List View
  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Adaptive Mock Tests & Exam Simulator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Simulates real exam time pressure with immediate post-test AI diagnostic breakdowns.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tests.map(test => (
          <div
            key={test.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              padding: '1.5rem 1.75rem'
            }}
          >
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span className="badge badge-primary">{test.test_type?.replace('_', ' ').toUpperCase()}</span>
                {test.is_adaptive ? <span className="badge badge-warning">Adaptive Engine</span> : null}
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {test.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                {test.description}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{test.duration_minutes} Mins</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{test.total_marks} Marks</div>
              </div>

              <button
                onClick={() => handleStartTest(test.id)}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem', gap: '0.45rem', whiteSpace: 'nowrap', minWidth: '130px', justifyContent: 'center' }}
              >
                <Award size={16} />
                <span>Start Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
