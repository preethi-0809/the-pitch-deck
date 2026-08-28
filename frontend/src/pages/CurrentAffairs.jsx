import React, { useState, useEffect } from 'react';
import {
  Newspaper, ShieldCheck, Sparkles, ExternalLink, BookOpen, Layers,
  Search, Calendar, Bookmark, CheckCircle2, Award, Clock, ArrowRight,
  Filter, HelpCircle, RefreshCw, Check, AlertCircle, Wrench, Zap
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CurrentAffairs({ setActiveTab }) {
  const { user } = useAuth();

  // Active Sub-Tab: 'feed' (Daily Feed) | 'search' (AI Search) | 'revision' (Monthly & One-Liners) | 'quiz' (Daily Quiz) | 'admin' (RAG Admin)
  const [activeSubTab, setActiveSubTab] = useState('feed');

  // Feed State
  const [feed, setFeed] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExamId, setSelectedExamId] = useState('All');
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Interactive Question & Read State per article
  const [expandedMcqs, setExpandedMcqs] = useState({});
  const [userSelectedCaAnswer, setUserSelectedCaAnswer] = useState({});
  const [revealedCaAnswers, setRevealedCaAnswers] = useState({});

  // AI Semantic Search State
  const [nlQuery, setNlQuery] = useState('Show important banking and monetary policy current affairs from the last 30 days');
  const [searchingNl, setSearchingNl] = useState(false);
  const [nlSearchResult, setNlSearchResult] = useState(null);

  // Daily Quiz State
  const [quizData, setQuizData] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // One-Liner Revision State
  const [oneLiners, setOneLiners] = useState([]);
  const [loadingOneLiners, setLoadingOneLiners] = useState(false);
  const [oneLinerCategory, setOneLinerCategory] = useState('All');

  // Admin RAG Pipeline State
  const [adminSources, setAdminSources] = useState(null);
  const [ingesting, setIngesting] = useState(false);
  const [ingestMessage, setIngestMessage] = useState(null);

  const categories = [
    'All', 'National', 'International', 'Economy', 'Banking', 'Government Schemes',
    'Defence', 'Science & Technology', 'Environment', 'Awards', 'Appointments',
    'Sports', 'Reports & Indexes', 'Important Days', 'State Current Affairs'
  ];

  const examsFilter = [
    { id: 'All', name: 'All Exams' },
    { id: 'exam_ssc_cgl', name: 'SSC CGL' },
    { id: 'exam_upsc_cse', name: 'UPSC CSE' },
    { id: 'exam_rbi_grade_b', name: 'RBI Grade B' },
    { id: 'exam_sbi_po', name: 'SBI PO' },
    { id: 'exam_tnpsc_grp2', name: 'TNPSC Group 2' },
    { id: 'exam_rrb_ntpc', name: 'RRB NTPC' },
    { id: 'exam_gate', name: 'GATE' }
  ];

  useEffect(() => {
    if (activeSubTab === 'feed') {
      loadFeed();
    } else if (activeSubTab === 'quiz') {
      loadDailyQuiz();
    } else if (activeSubTab === 'revision') {
      loadOneLiners();
    } else if (activeSubTab === 'admin') {
      loadAdminStats();
    }
  }, [activeSubTab, selectedCategory, selectedExamId, selectedMonth]);

  // 1. Load Feed
  const loadFeed = async () => {
    try {
      setLoadingFeed(true);
      const params = {
        category: selectedCategory,
        examId: selectedExamId,
        month: selectedMonth,
        search: feedSearchQuery,
        limit: 25
      };
      const res = await api.get(`/current-affairs?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))}`);
      if (res.success) {
        setFeed(res.data || res.feed || []);
      }
    } catch (e) {
      console.error('Failed to load current affairs feed:', e);
    } finally {
      setLoadingFeed(false);
    }
  };

  // 2. AI Semantic Search
  const handleNlSearch = async (e) => {
    if (e) e.preventDefault();
    if (!nlQuery.trim()) return;
    try {
      setSearchingNl(true);
      const res = await api.post('/current-affairs/search', {
        query: nlQuery,
        examId: selectedExamId
      });
      if (res.success) {
        setNlSearchResult(res.data);
      }
    } catch (err) {
      console.error('Error running NL search:', err);
    } finally {
      setSearchingNl(false);
    }
  };

  // 3. Load Daily Quiz
  const loadDailyQuiz = async () => {
    try {
      setLoadingQuiz(true);
      setQuizSubmitted(false);
      setQuizAnswers({});
      const res = await api.get('/current-affairs/quiz/daily');
      if (res.success) {
        setQuizData(res.data);
      }
    } catch (err) {
      console.error('Failed to load daily quiz:', err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    let score = 0;
    quizData.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct_key) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  // 4. Load One-Liners
  const loadOneLiners = async () => {
    try {
      setLoadingOneLiners(true);
      const params = { month: selectedMonth, category: oneLinerCategory };
      const res = await api.get(`/current-affairs/one-liners?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))}`);
      if (res.success) {
        setOneLiners(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load one-liners:', err);
    } finally {
      setLoadingOneLiners(false);
    }
  };

  // 5. Admin Stats & Ingestion Trigger
  const loadAdminStats = async () => {
    try {
      const res = await api.get('/current-affairs/admin/sources');
      if (res.success) {
        setAdminSources(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin sources:', err);
    }
  };

  const handleTriggerIngestion = async () => {
    try {
      setIngesting(true);
      setIngestMessage(null);
      const res = await api.post('/current-affairs/admin/ingest', {});
      if (res.success) {
        setIngestMessage(res.message);
        loadAdminStats();
      }
    } catch (err) {
      setIngestMessage('Ingestion failed to complete.');
    } finally {
      setIngesting(false);
    }
  };

  // 6. User Interactions
  const handleToggleBookmark = async (caId) => {
    try {
      const res = await api.post('/current-affairs/bookmark', { caId });
      if (res.success) {
        setFeed(prev => prev.map(item => item.id === caId ? { ...item, is_bookmarked: res.is_bookmarked } : item));
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '1.5rem', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">Official Exam Current Affairs</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified against PIB, RBI, ISRO & Official Gazettes</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
            Exam-Oriented Current Affairs
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Fresh official news converted into structured exam learning points, key facts, grounded MCQs, and syllabus topic connectors.
          </p>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          gap: '0.25rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'feed', label: '📰 Today\'s Feed', icon: Newspaper },
            { id: 'search', label: '🤖 AI Natural Search', icon: Sparkles },
            { id: 'revision', label: '⚡ Flashcard Revision', icon: Zap },
            { id: 'quiz', label: '✍️ Daily 10-Q Quiz', icon: Award },
            { id: 'admin', label: '⚙️ Sources & Sync', icon: Wrench }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === tab.id ? 'var(--brand-primary)' : 'transparent',
                color: activeSubTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: TODAY'S FEED & EXAM FILTERS
      ======================================================== */}
      {activeSubTab === 'feed' && (
        <div>
          {/* Controls Bar (Categories & Exam Filter) */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>Target Exam:</span>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.84rem', fontWeight: 700 }}
                >
                  {examsFilter.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>

                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Month:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.84rem' }}
                >
                  <option value="All">All Months</option>
                  <option value="08">August 2026</option>
                  <option value="07">July 2026</option>
                  <option value="06">June 2026</option>
                </select>
              </div>

              {/* Quick Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter news by keyword..."
                  value={feedSearchQuery}
                  onChange={(e) => setFeedSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadFeed(); }}
                  style={{ width: '100%', paddingLeft: '2.2rem', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            {/* 14 Category Badges Bar */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.76rem',
                    fontWeight: selectedCategory === cat ? 800 : 500,
                    backgroundColor: selectedCategory === cat ? 'var(--brand-primary)' : 'var(--bg-primary)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${selectedCategory === cat ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Feed List */}
          {loadingFeed ? (
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
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Retrieving grounded official news documents...</div>
            </div>
          ) : feed.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Newspaper size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3>No articles found for this filter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Try switching categories or exam filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {feed.map(article => (
                <div
                  key={article.id}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Top Meta Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{article.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        📅 Published: <strong>{article.published_date}</strong>
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        🏛️ Source: <strong>{article.source_name}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleToggleBookmark(article.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.65rem' }}
                      >
                        <Bookmark size={13} fill={article.is_bookmarked ? 'currentColor' : 'none'} />
                        <span style={{ fontSize: '0.74rem' }}>{article.is_bookmarked ? 'Bookmarked' : 'Save'}</span>
                      </button>

                      {article.source_url && (
                        <a
                          href={article.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                        >
                          <span style={{ fontSize: '0.74rem' }}>Official Source</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Article Title */}
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                    {article.title}
                  </h2>

                  {/* 1. What Happened? */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      📌 What Happened?
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {article.what_happened || article.summary}
                    </div>
                  </div>

                  {/* 2. Why Is It Important? */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      🎯 Why Is It Important for Exams?
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {article.why_important || article.summary}
                    </div>
                  </div>

                  {/* 3. Key Facts */}
                  {article.key_facts && (
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        📋 High-Yield Key Facts:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {Array.isArray(article.key_facts) ? article.key_facts.map((f, i) => (
                          <li key={i}>{f}</li>
                        )) : <li>{String(article.key_facts)}</li>}
                      </ul>
                    </div>
                  )}

                  {/* Exam Relevance Badges & Linked Syllabus Topics */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Exams:</span>
                      {article.exam_relevance_tags && article.exam_relevance_tags.map(tag => (
                        <span key={tag} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{tag}</span>
                      ))}
                    </div>

                    {/* Linked Syllabus Topic Link */}
                    {article.linked_topics && article.linked_topics.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Syllabus:</span>
                        {article.linked_topics.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setActiveTab('materials')}
                            className="badge badge-primary"
                            style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            <BookOpen size={11} />
                            <span>{t.topic}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Grounded Practice MCQs (Toggleable) */}
                  {article.mcqs && article.mcqs.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={() => setExpandedMcqs(prev => ({ ...prev, [article.id]: !prev[article.id] }))}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <Sparkles size={14} color="var(--brand-primary)" />
                        <span>{expandedMcqs[article.id] ? 'Hide Practice MCQs' : `Test Knowledge: Practice ${article.mcqs.length} Grounded MCQs`}</span>
                      </button>

                      {expandedMcqs[article.id] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                          {article.mcqs.map((mcq, mIdx) => {
                            const qKey = `${article.id}_${mIdx}`;
                            const selectedChoice = userSelectedCaAnswer[qKey];
                            const isRevealed = revealedCaAnswers[qKey];

                            return (
                              <div
                                key={mIdx}
                                style={{
                                  padding: '1.25rem',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: 'var(--bg-primary)',
                                  border: '1px solid var(--border-subtle)'
                                }}
                              >
                                <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                  Q{mIdx + 1}. {mcq.question}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                  {mcq.options.map((opt, oIdx) => {
                                    const optKey = String.fromCharCode(65 + oIdx);
                                    const isCorrect = optKey === mcq.correct_answer;
                                    const isSelected = selectedChoice === optKey;

                                    let bg = 'var(--bg-surface)';
                                    let border = 'var(--border-subtle)';
                                    if (isRevealed) {
                                      if (isCorrect) {
                                        bg = 'var(--success-light)';
                                        border = 'var(--success)';
                                      } else if (isSelected) {
                                        bg = 'var(--danger-light)';
                                        border = 'var(--danger)';
                                      }
                                    } else if (isSelected) {
                                      bg = 'var(--brand-light)';
                                      border = 'var(--brand-primary)';
                                    }

                                    return (
                                      <button
                                        key={oIdx}
                                        onClick={() => {
                                          setUserSelectedCaAnswer(prev => ({ ...prev, [qKey]: optKey }));
                                          setRevealedCaAnswers(prev => ({ ...prev, [qKey]: true }));
                                        }}
                                        style={{
                                          padding: '0.6rem 0.85rem',
                                          borderRadius: 'var(--radius-sm)',
                                          backgroundColor: bg,
                                          border: `1px solid ${border}`,
                                          textAlign: 'left',
                                          cursor: 'pointer',
                                          fontSize: '0.84rem',
                                          fontWeight: isSelected || (isRevealed && isCorrect) ? 700 : 500
                                        }}
                                      >
                                        <strong>{optKey}.</strong> {opt}
                                      </button>
                                    );
                                  })}
                                </div>

                                {isRevealed && (
                                  <div style={{
                                    padding: '0.75rem 0.95rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--bg-surface)',
                                    fontSize: '0.82rem',
                                    border: '1px solid var(--border-subtle)'
                                  }}>
                                    <strong style={{ color: 'var(--success)' }}>✓ Correct Answer: Option {mcq.correct_answer}</strong>
                                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                      {mcq.explanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: AI NATURAL LANGUAGE SEARCH
      ======================================================== */}
      {activeSubTab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Natural-Language AI Current Affairs Search
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Ask any current affairs question in plain English. The RAG pipeline retrieves relevant government documents and provides a verified summary.
            </p>

            <form onSubmit={handleNlSearch}>
              <textarea
                rows={3}
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="e.g. Show important banking current affairs from last 30 days or Give me important space missions for SSC CGL..."
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try example:</span>
                  {[
                    'Show important banking current affairs from last 30 days',
                    'Give me latest space science and ISRO missions',
                    'Summarize major defense exercises for NDA/CDS'
                  ].map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNlQuery(ex)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        color: 'var(--brand-primary)'
                      }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                <button type="submit" disabled={searchingNl} className="btn btn-primary">
                  <Sparkles size={15} />
                  <span>{searchingNl ? 'Retrieving Grounded Sources...' : 'Search Current Affairs'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Search Result View */}
          {nlSearchResult && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  🤖 AI Synthesis Grounded in {nlSearchResult.grounded_sources_count} Official Documents
                </div>
              </div>

              <div style={{
                lineHeight: 1.8,
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
                whiteSpace: 'pre-line'
              }}>
                {nlSearchResult.answer}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
                Retrieved Source Documents ({nlSearchResult.results.length}):
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {nlSearchResult.results.map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span className="badge badge-primary">{doc.category}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.published_date}</span>
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
                      {doc.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        🏛️ {doc.source_name}
                      </div>
                      {doc.source_url && (
                        <a
                          href={doc.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--brand-primary)',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            textDecoration: 'none'
                          }}
                        >
                          <span>Official Portal</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: FLASHCARD ONE-LINER REVISION
      ======================================================== */}
      {activeSubTab === 'revision' && (
        <div>
          {/* Controls */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                  High-Speed One-Liner Flashcards
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Quick revision of important numbers, appointments, schemes, and awards.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={oneLinerCategory}
                  onChange={(e) => setOneLinerCategory(e.target.value)}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.84rem' }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Flashcards List */}
          {loadingOneLiners ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading one-liners...</div>
          ) : oneLiners.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>No one-liners found for this category.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {oneLiners.map((ol, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{ol.category}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ol.date}</span>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      ⚡ {ol.fact}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    Source: {ol.source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: DAILY 10-QUESTION CURRENT AFFAIRS QUIZ
      ======================================================== */}
      {activeSubTab === 'quiz' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-primary">Daily Assessment</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.35rem 0 0 0' }}>
                  Daily Current Affairs Quiz — 10 Questions
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Grounded exclusively in verified PIB, RBI, and Ministry releases.
                </p>
              </div>

              {quizSubmitted && (
                <div style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: quizScore >= 7 ? 'var(--success-light)' : 'var(--brand-light)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Your Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: quizScore >= 7 ? 'var(--success)' : 'var(--brand-primary)' }}>
                    {quizScore} / {quizData?.questions.length || 10}
                  </div>
                </div>
              )}
            </div>

            {loadingQuiz ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading daily quiz...</div>
            ) : !quizData || quizData.questions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>No quiz questions available for today.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                {quizData.questions.map((q, idx) => {
                  const userChoice = quizAnswers[q.id];

                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                        {idx + 1}. {q.question_text}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                        {q.options.map(opt => {
                          const isSelected = userChoice === opt.key;
                          const isCorrect = opt.key === q.correct_key;

                          let bg = 'var(--bg-surface)';
                          let border = 'var(--border-subtle)';
                          if (quizSubmitted) {
                            if (isCorrect) {
                              bg = 'var(--success-light)';
                              border = 'var(--success)';
                            } else if (isSelected) {
                              bg = 'var(--danger-light)';
                              border = 'var(--danger)';
                            }
                          } else if (isSelected) {
                            bg = 'var(--brand-light)';
                            border = 'var(--brand-primary)';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                              style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: bg,
                                border: `1px solid ${border}`,
                                textAlign: 'left',
                                cursor: quizSubmitted ? 'default' : 'pointer',
                                fontSize: '0.86rem',
                                fontWeight: isSelected || (quizSubmitted && isCorrect) ? 700 : 500
                              }}
                            >
                              <strong>{opt.key}.</strong> {opt.text}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div style={{
                          padding: '0.75rem 0.95rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface)',
                          fontSize: '0.82rem',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <strong style={{ color: 'var(--success)' }}>✓ Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}

                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    <span>Submit Daily Quiz</span>
                  </button>
                ) : (
                  <button
                    onClick={loadDailyQuiz}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    <RefreshCw size={14} />
                    <span>Retake Quiz</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: ADMIN RAG PIPELINE MANAGER
      ======================================================== */}
      {activeSubTab === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  RAG Pipeline & Source Registry
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Manage authoritative news feeds, document cleaning, chunking, and semantic embeddings sync.
                </p>
              </div>

              <button
                onClick={handleTriggerIngestion}
                disabled={ingesting}
                className="btn btn-primary"
              >
                <RefreshCw size={15} className={ingesting ? 'spin' : ''} />
                <span>{ingesting ? 'Syncing Feeds...' : 'Trigger Live Ingestion'}</span>
              </button>
            </div>

            {ingestMessage && (
              <div style={{
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                ✓ {ingestMessage}
              </div>
            )}

            {/* Stats Overview */}
            {adminSources?.stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Documents Indexed</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', marginTop: '0.2rem' }}>
                    {adminSources.stats.total_documents_indexed}
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Active Sources</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)', marginTop: '0.2rem' }}>
                    {adminSources.stats.active_sources_count}
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Last Successful Update</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                    {adminSources.stats.last_successful_update ? new Date(adminSources.stats.last_successful_update).toLocaleDateString() : 'Active'}
                  </div>
                </div>
              </div>
            )}

            {/* Sources List */}
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
              Configured Authoritative Ingestion Sources:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {adminSources?.sources && adminSources.sources.map(src => (
                <div
                  key={src.id}
                  style={{
                    padding: '1.15rem 1.35rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-primary">{src.type.toUpperCase()}</span>
                      <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>{src.name}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700 }}>Portal:</span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--brand-primary)',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          wordBreak: 'break-all'
                        }}
                      >
                        <span>{src.url}</span>
                        <ExternalLink size={12} />
                      </a>
                      <span>• Category: <strong>{src.category}</strong> • Indexed: <strong>{src.documents_count}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{
                        padding: '0.4rem 0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        textDecoration: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      <span>Visit Portal</span>
                      <ExternalLink size={12} />
                    </a>

                    <span className={`badge ${src.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                      {src.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
