import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen, Layers, Filter, Check, ListOrdered } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function QuestionGenerator() {
  const { user } = useAuth();
  const [syllabus, setSyllabus] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(15);
  const [questionType, setQuestionType] = useState('mcq');
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSolutions, setShowSolutions] = useState({});

  useEffect(() => {
    async function loadSyllabus() {
      try {
        const examId = user?.profile?.target_exam_id || 'exam_upsc_cse';
        const res = await api.get(`/exams/${examId}/syllabus`);
        if (res.success && res.syllabus) {
          setSyllabus(res.syllabus);
          if (res.syllabus[0]?.topics?.[0]) {
            setSelectedTopic(res.syllabus[0].topics[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load syllabus:', e);
      }
    }
    loadSyllabus();
  }, [user]);

  const handleGenerate = async (overrideCount) => {
    const finalCount = overrideCount || count;
    try {
      setLoading(true);
      setUserAnswers({});
      setShowSolutions({});
      const res = await api.post('/questions/generate', {
        examId: user?.profile?.target_exam_id,
        topicId: selectedTopic,
        difficulty,
        count: parseInt(finalCount),
        questionType
      });

      if (res.success && res.questions) {
        setQuestions(res.questions);
      }
    } catch (e) {
      console.error('Failed to generate questions:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionKey) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    setShowSolutions(prev => ({ ...prev, [questionId]: true }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach(q => {
    const ans = userAnswers[q.id];
    if (ans) {
      const correctOpt = q.options?.find(o => o.is_correct === 1);
      if (correctOpt && correctOpt.option_key === ans) {
        correctCount++;
      }
    }
  });

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Practice Drill & High-Volume Question Bank</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Generate custom practice sets from 5 up to 50+ questions with immediate step-by-step rationales.
        </p>
      </div>

      {/* Generator Configuration Panel */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          {/* Topic Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Target Syllabus Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{ width: '100%' }}
            >
              {syllabus.map(s => (
                <optgroup key={s.id} label={s.name}>
                  {s.topics?.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="easy">Foundational (Easy)</option>
              <option value="medium">Exam Standard (Medium)</option>
              <option value="hard">Advanced / Analytical (Hard)</option>
            </select>
          </div>

          {/* Question Count Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Select Number of Questions
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              style={{ width: '100%' }}
            >
              <option value={5}>5 Questions (Quick Check)</option>
              <option value={10}>10 Questions (Standard Drill)</option>
              <option value={15}>15 Questions (Intensive Practice)</option>
              <option value={20}>20 Questions (Mini Sectional Mock)</option>
              <option value={25}>25 Questions (Quarter Test)</option>
              <option value={30}>30 Questions (Deep Practice)</option>
              <option value={50}>50 Questions (Full Marathon Drill)</option>
            </select>
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '42px', gap: '0.4rem' }}
            >
              <Sparkles size={16} />
              <span>{loading ? `Generating ${count} Questions...` : `Generate ${count} Questions`}</span>
            </button>
          </div>
        </div>

        {/* Quick Batch Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Count Presets:</span>
          {[5, 10, 15, 20, 25, 30, 50].map(cnt => (
            <button
              key={cnt}
              onClick={() => {
                setCount(cnt);
                handleGenerate(cnt);
              }}
              disabled={loading}
              className={`btn btn-sm ${count === cnt ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              {cnt} Qs
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Quick Jump Palette (If Questions Exist) */}
      {questions.length > 0 && (
        <div className="card" style={{ marginBottom: '1.75rem', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Questions: </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{questions.length}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Answered: </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--brand-primary)' }}>{answeredCount} / {questions.length}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Drill Accuracy: </span>
                <strong style={{ fontSize: '1.05rem', color: accuracy >= 60 ? '#10b981' : '#f59e0b' }}>{accuracy}%</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any question number below to jump directly to it:
            </div>
          </div>

          {/* Palette Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {questions.map((q, idx) => {
              const isAnswered = Boolean(userAnswers[q.id]);
              const correctOpt = q.options?.find(o => o.is_correct === 1);
              const isCorrect = isAnswered && userAnswers[q.id] === correctOpt?.option_key;

              let bg = 'var(--bg-surface)';
              let color = 'var(--text-secondary)';
              let border = '1px solid var(--border-subtle)';

              if (isAnswered) {
                if (isCorrect) {
                  bg = '#10b981';
                  color = '#ffffff';
                  border = '1px solid #10b981';
                } else {
                  bg = '#ef4444';
                  color = '#ffffff';
                  border = '1px solid #ef4444';
                }
              }

              return (
                <a
                  key={idx}
                  href={`#q_${idx + 1}`}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    backgroundColor: bg,
                    color: color,
                    border: border,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {idx + 1}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {questions.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Layers size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              No practice questions generated yet
            </div>
            <p style={{ fontSize: '0.88rem', marginTop: '0.3rem' }}>
              Choose your syllabus topic and select the number of questions (up to 50), then click <strong>Generate Questions</strong>.
            </p>
          </div>
        ) : (
          questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            const isRevealed = showSolutions[q.id];
            return (
              <div id={`q_${idx + 1}`} key={q.id || idx} className="card" style={{ scrollMarginTop: '100px' }}>
                {/* Question Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-primary">Question {idx + 1} of {questions.length}</span>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{q.difficulty_level}</span>
                    {q.is_pyq ? <span className="badge badge-warning">PYQ {q.pyq_year}</span> : null}
                  </div>
                </div>

                {/* Question Text */}
                <div style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                  {q.question_text}
                </div>

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {q.options?.map(opt => {
                    const isSelected = selectedOpt === opt.option_key;
                    const isCorrect = opt.is_correct === 1;

                    let bg = 'var(--bg-surface-elevated)';
                    let border = 'var(--border-subtle)';
                    let color = 'var(--text-primary)';

                    if (isRevealed) {
                      if (isCorrect) {
                        bg = 'var(--success-light)';
                        border = 'var(--success-border)';
                        color = 'var(--success)';
                      } else if (isSelected && !isCorrect) {
                        bg = 'var(--danger-light)';
                        border = 'var(--danger-border)';
                        color = 'var(--danger)';
                      }
                    } else if (isSelected) {
                      bg = 'var(--brand-light)';
                      border = 'var(--border-focus)';
                    }

                    return (
                      <button
                        key={opt.option_key}
                        onClick={() => handleSelectOption(q.id, opt.option_key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: bg,
                          border: `1px solid ${border}`,
                          color: color,
                          textAlign: 'left',
                          fontWeight: 500,
                          fontSize: '0.92rem'
                        }}
                      >
                        <span style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
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

                {/* Explanation Box */}
                {isRevealed && (
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    marginTop: '1rem'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--brand-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={14} />
                      <span>Detailed Conceptual Explanation & Analysis</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
