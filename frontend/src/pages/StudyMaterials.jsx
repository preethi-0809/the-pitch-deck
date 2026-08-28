import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, ShieldCheck, Sparkles, ChevronRight, Bookmark,
  ArrowRight, CheckCircle2, Award, Clock, ArrowLeft, Filter,
  Layers, HelpCircle, AlertTriangle, Zap, Check, RotateCcw,
  ExternalLink, Eye, ChevronDown, BookMarked
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudyMaterials({ setActiveTab }) {
  const { user } = useAuth();

  // Mode: 'home' (Select Exam) | 'hierarchy' (Exam Syllabus & Progress) | 'topic' (Deep Learning Studio) | 'library' (Notes Library)
  const [viewMode, setViewMode] = useState('home');

  // Exam Selection State
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('exam_ssc_cgl');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [examSearch, setExamSearch] = useState('');
  const [loadingExams, setLoadingExams] = useState(true);

  // Syllabus Hierarchy State
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);
  const [expandedStages, setExpandedStages] = useState({ 'Tier 1': true, 'Prelims & Mains GS-2': true });
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Topic Studio State
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicNotesData, setTopicNotesData] = useState(null);
  const [loadingTopicNotes, setLoadingTopicNotes] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState('concept'); // 'concept' | 'formulas' | 'examples' | 'shortcuts' | 'mistakes' | 'revision' | 'practice'
  const [userSelectedAnswer, setUserSelectedAnswer] = useState({});
  const [showAnswerExplanation, setShowAnswerExplanation] = useState({});

  // Notes Library State
  const [libraryNotes, setLibraryNotes] = useState([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [librarySubjectFilter, setLibrarySubjectFilter] = useState('All');
  const [libraryBookmarkedOnly, setLibraryBookmarkedOnly] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  const categories = [
    'All', 'UPSC', 'SSC', 'Banking', 'Railways', 'State PSC', 'Technical', 'Teaching', 'Defence'
  ];

  // 1. Initial Load: Fetch Exams for Syllabus Home
  useEffect(() => {
    fetchExamsList();
  }, [selectedCategory, examSearch]);

  const fetchExamsList = async () => {
    try {
      setLoadingExams(true);
      const params = { category: selectedCategory, search: examSearch };
      const res = await api.get(`/syllabus/exams?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))}`);
      if (res.success) {
        setExams(res.data || []);
      }
    } catch (e) {
      console.error('Failed to load syllabus exams:', e);
    } finally {
      setLoadingExams(false);
    }
  };

  // 2. Load Exam Syllabus Hierarchy
  const loadExamHierarchy = async (examId) => {
    try {
      setLoadingHierarchy(true);
      setSelectedExamId(examId);
      const res = await api.get(`/syllabus/hierarchy/${examId}`);
      if (res.success) {
        setHierarchyData(res.data);
        // Expand first stage and first subject by default
        if (res.data.stages && res.data.stages.length > 0) {
          const firstStage = res.data.stages[0];
          setExpandedStages({ [firstStage.stage_name]: true });
          if (firstStage.subjects && firstStage.subjects.length > 0) {
            setExpandedSubjects({ [firstStage.subjects[0].subject_name]: true });
          }
        }
        setViewMode('hierarchy');
      }
    } catch (e) {
      console.error('Failed to load exam hierarchy:', e);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  // 3. Load Topic Detailed Notes
  const loadTopicNotes = async (topicId) => {
    try {
      setLoadingTopicNotes(true);
      setSelectedTopicId(topicId);
      const res = await api.get(`/syllabus/topic/${topicId}?examId=${selectedExamId}`);
      if (res.success) {
        setTopicNotesData(res.data);
        setActiveStudioTab('concept');
        setUserSelectedAnswer({});
        setShowAnswerExplanation({});
        setViewMode('topic');
      }
    } catch (e) {
      console.error('Failed to load topic notes:', e);
    } finally {
      setLoadingTopicNotes(false);
    }
  };

  // 4. Update Topic Status / Bookmark
  const handleUpdateTopicStatus = async (status) => {
    if (!topicNotesData || !selectedTopicId) return;
    try {
      const res = await api.post('/syllabus/progress', {
        examId: selectedExamId,
        topicId: selectedTopicId,
        status,
        completion_percentage: status === 'completed' ? 100 : (status === 'learning' ? 50 : 0)
      });
      if (res.success) {
        setTopicNotesData(prev => ({
          ...prev,
          user_progress: {
            ...prev.user_progress,
            status,
            completion_percentage: status === 'completed' ? 100 : (status === 'learning' ? 50 : 0)
          }
        }));
      }
    } catch (e) {
      console.error('Failed to update topic status:', e);
    }
  };

  const handleToggleBookmark = async () => {
    if (!topicNotesData || !selectedTopicId) return;
    const nextBookmarked = !topicNotesData.user_progress?.notes_bookmarked;
    try {
      await api.post('/syllabus/progress', {
        examId: selectedExamId,
        topicId: selectedTopicId,
        notes_bookmarked: nextBookmarked
      });
      setTopicNotesData(prev => ({
        ...prev,
        user_progress: {
          ...prev.user_progress,
          notes_bookmarked: nextBookmarked
        }
      }));
    } catch (e) {
      console.error('Failed to toggle bookmark:', e);
    }
  };

  // 5. Load Notes Library
  const loadNotesLibrary = async () => {
    try {
      setLoadingLibrary(true);
      const params = {
        examId: selectedExamId || 'All',
        subject: librarySubjectFilter,
        search: librarySearch,
        bookmarkedOnly: libraryBookmarkedOnly
      };
      const res = await api.get(`/syllabus/library?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))}`);
      if (res.success) {
        setLibraryNotes(res.data || []);
        setViewMode('library');
      }
    } catch (e) {
      console.error('Failed to load notes library:', e);
    } finally {
      setLoadingLibrary(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem', color: 'var(--text-primary)' }}>
      {/* Top Breadcrumb & View Mode Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700 }}>
          <button
            onClick={() => setViewMode('home')}
            style={{ background: 'none', border: 'none', color: viewMode === 'home' ? 'var(--brand-primary)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <BookOpen size={16} />
            <span>Syllabus Hub</span>
          </button>

          {viewMode !== 'home' && hierarchyData?.exam && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <button
                onClick={() => setViewMode('hierarchy')}
                style={{ background: 'none', border: 'none', color: viewMode === 'hierarchy' ? 'var(--brand-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {hierarchyData.exam.name}
              </button>
            </>
          )}

          {viewMode === 'topic' && topicNotesData?.note && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <span style={{ color: 'var(--brand-primary)' }}>{topicNotesData.note.title.split('—')[0]}</span>
            </>
          )}

          {viewMode === 'library' && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <span style={{ color: 'var(--brand-primary)' }}>Notes Library</span>
            </>
          )}
        </div>

        {/* Global Action Switchers */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('home')}
            className={`btn btn-sm ${viewMode === 'home' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <span>Select Exam</span>
          </button>
          <button
            onClick={loadNotesLibrary}
            className={`btn btn-sm ${viewMode === 'library' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookMarked size={14} />
            <span>Notes Library</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          VIEW 1: SYLLABUS HOME / SELECT YOUR EXAM
      ======================================================== */}
      {viewMode === 'home' && (
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-light)',
              color: 'var(--brand-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={14} />
              <span>Complete Exam-Wise Syllabi & Notes Engine</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Official Syllabus & Master Notes Platform
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.4rem auto 0 auto' }}>
              Select any government exam to explore its complete official syllabus, stage-wise topics, concept notes, formulas, solved examples, and progress tracking.
            </p>

            {/* Search Input */}
            <div style={{ maxWidth: '560px', margin: '1.75rem auto 0 auto', position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search exam syllabus (e.g. SSC CGL, UPSC CSE, TNPSC, IBPS PO)..."
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.75rem', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          {/* Category Tabs Bar */}
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: selectedCategory === cat ? 800 : 500,
                  backgroundColor: selectedCategory === cat ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Exams Grid */}
          {loadingExams ? (
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
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading syllabus catalog...</div>
            </div>
          ) : exams.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>No matching examinations found</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Try clearing your search query or choosing another category.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {exams.map(exam => (
                <div
                  key={exam.id}
                  onClick={() => loadExamHierarchy(exam.id)}
                  className="card"
                  style={{
                    padding: '1.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span className="badge badge-primary">{exam.code}</span>
                      <span className="badge badge-secondary">{exam.category}</span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                      {exam.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {exam.organization}
                    </div>

                    {/* Progress Bar Strip */}
                    <div style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-primary)',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Syllabus Completion</span>
                        <span style={{ color: exam.overall_progress_percentage > 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {exam.overall_progress_percentage}% Complete
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.max(exam.overall_progress_percentage, 4)}%`,
                          height: '100%',
                          backgroundColor: exam.overall_progress_percentage > 0 ? 'var(--success)' : 'var(--brand-primary)',
                          borderRadius: '3px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                      {exam.total_topics_count > 0 ? `${exam.total_topics_count} Syllabus Topics` : 'Comprehensive Syllabus'}
                    </span>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>Explore Notes</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          VIEW 2: EXAM-WISE SYLLABUS HIERARCHY & PROGRESS
      ======================================================== */}
      {viewMode === 'hierarchy' && hierarchyData && (
        <div>
          {/* Header Banner with Overall Progress */}
          <div className="card" style={{
            padding: '1.75rem 2rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(13, 148, 136, 0.08) 100%)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">{hierarchyData.exam.code}</span>
                  <span className="badge badge-secondary">{hierarchyData.exam.category}</span>
                </div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
                  {hierarchyData.exam.name} — Official Syllabus
                </h1>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', marginBottom: 0 }}>
                  {hierarchyData.exam.organization} • Qualification: <strong>{hierarchyData.exam.qualification}</strong>
                </p>
              </div>

              {/* Overall Progress Meter Box */}
              <div style={{
                padding: '1rem 1.35rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                minWidth: '220px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Syllabus Progress
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-primary)', margin: '0.2rem 0' }}>
                  {hierarchyData.overall_percentage}%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>{hierarchyData.completed_topics}</strong> of <strong>{hierarchyData.total_topics}</strong> Topics Mastered
                </div>
              </div>
            </div>

            {/* Subject-Wise Progress Meter Grid */}
            {hierarchyData.subject_progress && hierarchyData.subject_progress.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Subject-Wise Mastery Breakdown:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                  {hierarchyData.subject_progress.map(sub => (
                    <div
                      key={sub.subject_name}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.subject_name}</span>
                        <span style={{ color: sub.percentage > 0 ? 'var(--success)' : 'var(--text-muted)' }}>{sub.percentage}%</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${sub.percentage}%`, height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stages & Subjects Accordion Tree */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {hierarchyData.stages.map(stage => {
              const isStageOpen = expandedStages[stage.stage_name] !== false;

              return (
                <div key={stage.stage_name} className="card" style={{ padding: '1.5rem' }}>
                  {/* Stage Header */}
                  <div
                    onClick={() => setExpandedStages(prev => ({ ...prev, [stage.stage_name]: !isStageOpen }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      paddingBottom: isStageOpen ? '1rem' : 0,
                      borderBottom: isStageOpen ? '1px solid var(--border-subtle)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Layers size={20} color="var(--brand-primary)" />
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {stage.stage_name}
                      </h2>
                    </div>
                    <ChevronDown size={18} style={{ transform: isStageOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </div>

                  {/* Stage Content (Subjects & Topics) */}
                  {isStageOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                      {stage.subjects.map(subject => {
                        const isSubOpen = expandedSubjects[subject.subject_name] !== false;

                        return (
                          <div
                            key={subject.subject_name}
                            style={{
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-primary)',
                              border: '1px solid var(--border-subtle)',
                              padding: '1.25rem'
                            }}
                          >
                            {/* Subject Header */}
                            <div
                              onClick={() => setExpandedSubjects(prev => ({ ...prev, [subject.subject_name]: !isSubOpen }))}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                paddingBottom: isSubOpen ? '0.75rem' : 0,
                                borderBottom: isSubOpen ? '1px solid var(--border-subtle)' : 'none'
                              }}
                            >
                              <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                  {subject.subject_name}
                                </h3>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                  {subject.completed_count} of {subject.total_count} Topics Completed ({subject.progress_percentage}%)
                                </div>
                              </div>
                              <ChevronDown size={16} style={{ transform: isSubOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                            </div>

                            {/* Topics List */}
                            {isSubOpen && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginTop: '1rem' }}>
                                {subject.topics.map(t => (
                                  <div
                                    key={t.id}
                                    onClick={() => loadTopicNotes(t.id)}
                                    style={{
                                      padding: '0.9rem 1.1rem',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: 'var(--bg-surface)',
                                      border: '1px solid var(--border-subtle)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      transition: 'border-color 0.15s, transform 0.15s'
                                    }}
                                  >
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                        <span className={`badge ${
                                          t.status === 'completed' ? 'badge-success' :
                                          t.status === 'learning' ? 'badge-warning' : 'badge-secondary'
                                        }`} style={{ fontSize: '0.7rem' }}>
                                          {t.status === 'completed' ? '✓ Completed' :
                                           t.status === 'learning' ? '⚡ Learning' : 'Not Started'}
                                        </span>
                                        {t.pyq_weightage && (
                                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                                            PYQ Weight: {t.pyq_weightage}/10
                                          </span>
                                        )}
                                      </div>

                                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                                        {t.topic}
                                      </h4>
                                      {t.subtopic && (
                                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                          {t.subtopic}
                                        </div>
                                      )}
                                    </div>

                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      marginTop: '0.75rem',
                                      paddingTop: '0.5rem',
                                      borderTop: '1px solid var(--border-subtle)',
                                      fontSize: '0.76rem',
                                      color: 'var(--brand-primary)',
                                      fontWeight: 700
                                    }}>
                                      <span>Read Notes & Practice →</span>
                                      {t.notes_bookmarked && <Bookmark size={12} fill="currentColor" />}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: TOPIC-LEVEL LEARNING STUDIO
      ======================================================== */}
      {viewMode === 'topic' && topicNotesData && (
        <div>
          {/* Topic Studio Header */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">{hierarchyData?.exam?.code || 'Exam Topic'}</span>
                  <span className="badge badge-secondary">{topicNotesData.note.source_authority}</span>
                </div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {topicNotesData.note.title}
                </h1>
              </div>

              {/* Status & Bookmark Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Status Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
                  <select
                    value={topicNotesData.user_progress?.status || 'not_started'}
                    onChange={(e) => handleUpdateTopicStatus(e.target.value)}
                    style={{ padding: '0.4rem 0.65rem', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="learning">Learning</option>
                    <option value="completed">Completed (100%)</option>
                    <option value="needs_revision">Needs Revision</option>
                  </select>
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={handleToggleBookmark}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Bookmark size={15} fill={topicNotesData.user_progress?.notes_bookmarked ? 'currentColor' : 'none'} />
                  <span>{topicNotesData.user_progress?.notes_bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                {/* Official Syllabus Direct Link */}
                {topicNotesData.official_syllabus_url && (
                  <a
                    href={topicNotesData.official_syllabus_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{
                      gap: '0.35rem',
                      textDecoration: 'none',
                      color: 'var(--brand-primary)',
                      fontWeight: 700
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>Official Syllabus</span>
                  </a>
                )}
              </div>
            </div>

            {/* Studio Navigation Tabs (Concept, Formulas, Examples, Short Tricks, Mistakes, Revision, Practice, References) */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              alignItems: 'center'
            }}>
              {[
                { id: 'concept', label: '📖 Concept Explanation' },
                { id: 'formulas', label: '📐 Important Formulas' },
                { id: 'examples', label: '💡 Solved Examples' },
                { id: 'shortcuts', label: '⚡ Short Tricks' },
                { id: 'mistakes', label: '⚠️ Common Mistakes' },
                { id: 'revision', label: '🎯 Quick Revision' },
                { id: 'practice', label: '✍️ Practice MCQs & PYQs' },
                { id: 'references', label: '📚 Syllabus & Reference Books' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudioTab(tab.id)}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    fontWeight: activeStudioTab === tab.id ? 800 : 600,
                    backgroundColor: activeStudioTab === tab.id ? 'var(--brand-primary)' : 'var(--bg-primary)',
                    color: activeStudioTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${activeStudioTab === tab.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                    boxShadow: activeStudioTab === tab.id ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Rendering */}
          <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
            {/* 1. CONCEPT EXPLANATION */}
            {activeStudioTab === 'concept' && (
              <div style={{ lineHeight: 1.7, fontSize: '0.95rem' }}>
                <div dangerouslySetInnerHTML={{ __html: topicNotesData.note.concept
                  .replace(/### (.*?)\n/g, '<h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:1.5rem 0 0.5rem 0;">$1</h3>')
                  .replace(/#### (.*?)\n/g, '<h4 style="font-size:1.05rem; font-weight:800; color:var(--brand-primary); margin:1.25rem 0 0.4rem 0;">$1</h4>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n\n/g, '<br/><br/>')
                  .replace(/\* (.*?)\n/g, '• $1<br/>')
                }} />
              </div>
            )}

            {/* 2. IMPORTANT FORMULAS */}
            {activeStudioTab === 'formulas' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Important Mathematical & Analytical Formulas
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {topicNotesData.note.formulas && topicNotesData.note.formulas.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.15rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {f.name}
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: 'var(--brand-primary)',
                        fontFamily: 'monospace',
                        margin: '0.4rem 0',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)'
                      }}>
                        {f.formula}
                      </div>
                      {f.notes && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          💡 <em>{f.notes}</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SOLVED EXAMPLES */}
            {activeStudioTab === 'examples' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Step-by-Step Solved Problem Examples
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {topicNotesData.note.examples && topicNotesData.note.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.35rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
                        Example {idx + 1}: {ex.question}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                        {ex.step1 && <div>• {ex.step1}</div>}
                        {ex.step2 && <div>• {ex.step2}</div>}
                        {ex.step3 && <div>• {ex.step3}</div>}
                        {ex.step4 && <div>• {ex.step4}</div>}
                      </div>

                      <div style={{
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--success-light)',
                        border: '1px solid var(--success-border)',
                        color: 'var(--success)',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}>
                        ✓ Final Answer: {ex.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SHORT TRICKS */}
            {activeStudioTab === 'shortcuts' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Speed Techniques & Exam Shortcuts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {topicNotesData.note.shortcuts && topicNotesData.note.shortcuts.map((trick, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.92rem',
                        lineHeight: 1.5,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {trick}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COMMON MISTAKES */}
            {activeStudioTab === 'mistakes' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Frequently Made Mistakes & Question Traps
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {topicNotesData.note.common_mistakes && topicNotesData.note.common_mistakes.map((mistake, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--danger-light)',
                        border: '1px solid var(--danger-border)',
                        color: 'var(--danger)',
                        fontSize: '0.92rem',
                        lineHeight: 1.5
                      }}
                    >
                      {mistake}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. QUICK REVISION */}
            {activeStudioTab === 'revision' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  High-Yield Quick Revision Takeaways
                </h3>
                <div style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  lineHeight: 1.8,
                  fontSize: '0.95rem'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: topicNotesData.note.quick_revision
                    .replace(/\* (.*?)\n/g, '• $1<br/>')
                    .replace(/\n/g, '<br/>')
                  }} />
                </div>
              </div>
            )}

            {/* 7. PRACTICE MCQS & PYQS */}
            {activeStudioTab === 'practice' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                    Topic Practice MCQs & Previous Year Questions
                  </h3>
                  <span className="badge badge-primary">
                    {topicNotesData.note.practice_questions?.length || 0} Questions
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {topicNotesData.note.practice_questions && topicNotesData.note.practice_questions.map((q, qIdx) => {
                    const selectedOpt = userSelectedAnswer[q.id];
                    const isRevealed = showAnswerExplanation[q.id];

                    return (
                      <div
                        key={q.id}
                        style={{
                          padding: '1.5rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                          Q{qIdx + 1}. {q.question}
                        </div>

                        {/* Options List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correct_index;
                            const isSelected = selectedOpt === oIdx;

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
                                  setUserSelectedAnswer(prev => ({ ...prev, [q.id]: oIdx }));
                                  setShowAnswerExplanation(prev => ({ ...prev, [q.id]: true }));
                                }}
                                style={{
                                  padding: '0.75rem 1rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: bg,
                                  border: `1px solid ${border}`,
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '0.88rem',
                                  fontWeight: isSelected || (isRevealed && isCorrect) ? 700 : 500,
                                  color: 'var(--text-primary)',
                                  transition: 'all 0.15s'
                                }}
                              >
                                <span style={{ fontWeight: 800, marginRight: '0.5rem' }}>
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box when answered */}
                        {isRevealed && (
                          <div style={{
                            padding: '0.9rem 1.15rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.85rem',
                            lineHeight: 1.5
                          }}>
                            <div style={{ fontWeight: 800, color: 'var(--success)', marginBottom: '0.35rem' }}>
                              ✓ Correct Option: {String.fromCharCode(65 + q.correct_index)}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>
                              {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. SYLLABUS LINKS & REFERENCE BOOKS WITH AUTHORS */}
            {activeStudioTab === 'references' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Official Commission Syllabus & Blueprint Links */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <BookOpen size={20} color="var(--brand-primary)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      Official Commission Syllabus & Blueprint Links
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Direct verified links to the official examination conducting body, syllabus gazettes, and national curriculum standards.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {topicNotesData.syllabus_links && topicNotesData.syllabus_links.map((linkItem, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          padding: '1.1rem 1.35rem',
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
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-primary">{linkItem.type}</span>
                            <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {linkItem.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Portal / Source: <strong>{linkItem.url}</strong>
                          </div>
                        </div>

                        <a
                          href={linkItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.45rem 0.95rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}
                        >
                          <span>Open Official Portal</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authoritative Reference Books & Authors */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Layers size={20} color="var(--accent-teal)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      Authoritative Reference Books & Recommended Authors
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Standard textbooks, recognized subject matter authorities, and recommended chapters prescribed for this specific syllabus topic.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                    {topicNotesData.reference_books && topicNotesData.reference_books.map((book, bIdx) => (
                      <div
                        key={bIdx}
                        style={{
                          padding: '1.35rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                            <span className="badge badge-secondary">{book.type || 'Standard Reference'}</span>
                            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>{book.edition}</span>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0', lineHeight: 1.35 }}>
                            {book.title}
                          </h4>

                          <div style={{ fontSize: '0.86rem', color: 'var(--brand-primary)', fontWeight: 800, marginBottom: '0.35rem' }}>
                            ✍️ Author(s): {book.authors}
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                            🏛️ Publisher: <strong>{book.publisher}</strong>
                          </div>

                          <div style={{
                            padding: '0.75rem 0.95rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-surface)',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            lineHeight: 1.45
                          }}>
                            🎯 <strong>Focus Chapters / Topics:</strong> {book.focus_chapters}
                          </div>
                        </div>

                        <a
                          href={book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            padding: '0.5rem'
                          }}
                        >
                          <span>Open Publisher / Digital Library</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sibling Topic Navigator */}
                {topicNotesData.adjacent_topics && (
                  <div style={{
                    padding: '1.35rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Subject Syllabus Track
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                        {topicNotesData.topic_info?.subject} ({topicNotesData.adjacent_topics.total_in_subject} Topics in Module)
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {topicNotesData.adjacent_topics.previous && (
                        <button
                          onClick={() => loadTopicNotes(topicNotesData.adjacent_topics.previous.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <ArrowLeft size={13} />
                          <span>Prev: {topicNotesData.adjacent_topics.previous.topic}</span>
                        </button>
                      )}
                      {topicNotesData.adjacent_topics.next && (
                        <button
                          onClick={() => loadTopicNotes(topicNotesData.adjacent_topics.next.id)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <span>Next: {topicNotesData.adjacent_topics.next.topic}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Linked RAG Current Affairs Interconnection */}
          {topicNotesData.linked_current_affairs && topicNotesData.linked_current_affairs.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={18} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  Recent Official Current Affairs Related to this Topic
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {topicNotesData.linked_current_affairs.map(ca => (
                  <div
                    key={ca.id}
                    onClick={() => setActiveTab('current-affairs')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{ca.category}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ca.published_date}</span>
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                      {ca.title}
                    </h4>
                    <div style={{ fontSize: '0.76rem', color: 'var(--brand-primary)', fontWeight: 700, marginTop: '0.5rem' }}>
                      Read Analysis in Current Affairs →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          VIEW 4: COMPLETE NOTES LIBRARY
      ======================================================== */}
      {viewMode === 'library' && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                Notes & Revision Library
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
                Browse, search, and bookmark master chapter notes across all your examinations.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setLibraryBookmarkedOnly(!libraryBookmarkedOnly);
                  loadNotesLibrary();
                }}
                className={`btn btn-sm ${libraryBookmarkedOnly ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Bookmark size={14} />
                <span>Bookmarked Only</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search notes by concept, title, or topic..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadNotesLibrary(); }}
                style={{ width: '100%', paddingLeft: '2.4rem', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Notes Grid */}
          {loadingLibrary ? (
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
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading notes library...</div>
            </div>
          ) : libraryNotes.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3>No notes found for this filter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Try clearing your search query or removing the bookmark filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {libraryNotes.map(n => (
                <div
                  key={n.id}
                  onClick={() => loadTopicNotes(n.topic_id)}
                  className="card"
                  style={{
                    padding: '1.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{n.exam_code}</span>
                      <span className="badge badge-secondary">{n.subject}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                      {n.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {n.exam_name} • {n.stage}
                    </div>

                    <div style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: '0.75rem',
                      maxHeight: '75px',
                      overflow: 'hidden'
                    }}>
                      {n.quick_revision?.substring(0, 120)}...
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--brand-primary)'
                  }}>
                    <span>Open Learning Studio →</span>
                    {n.notes_bookmarked && <Bookmark size={13} fill="currentColor" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
