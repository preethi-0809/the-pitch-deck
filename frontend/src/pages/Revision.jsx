import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  Zap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Award,
  Layers,
  TrendingUp,
  Brain,
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Revision() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Flashcard Interactive State
  const [flashcardCategory, setFlashcardCategory] = useState('All');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratingStatus, setRatingStatus] = useState(null);
  const [masteredCardsCount, setMasteredCardsCount] = useState(0);

  useEffect(() => {
    loadRevisions();
  }, []);

  const loadRevisions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/revision');
      if (res.success) {
        setData(res);
      }
    } catch (e) {
      console.error('Failed to load revision queue:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (revisionId) => {
    try {
      setCompletingId(revisionId);
      const res = await api.post(`/revision/${revisionId}/complete`);
      if (res.success) {
        setData(res);
      }
    } catch (e) {
      console.error('Failed to complete revision:', e);
    } finally {
      setCompletingId(null);
    }
  };

  const handleGenerateDeck = async () => {
    try {
      setGenerating(true);
      const res = await api.post('/revision/generate', { count: 4 });
      if (res.success) {
        setData(res);
      }
    } catch (e) {
      console.error('Failed to generate revision tasks:', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleRateFlashcard = async (rating) => {
    const card = filteredFlashcards[currentCardIndex];
    if (!card) return;

    setRatingStatus(rating);
    try {
      await api.post('/revision/flashcard-rate', {
        flashcardId: card.id,
        rating
      });
      if (rating === 'easy') {
        setMasteredCardsCount(prev => prev + 1);
      }
    } catch (e) {
      console.error('Flashcard rating error:', e);
    }

    setTimeout(() => {
      setRatingStatus(null);
      setIsFlipped(false);
      if (currentCardIndex < filteredFlashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setCurrentCardIndex(0);
      }
    }, 600);
  };

  const allFlashcards = data?.flashcards || [];
  const categories = ['All', ...Array.from(new Set(allFlashcards.map(c => c.category)))];

  const filteredFlashcards = allFlashcards.filter(c =>
    flashcardCategory === 'All' ? true : c.category === flashcardCategory
  );

  const currentCard = filteredFlashcards[currentCardIndex] || filteredFlashcards[0];

  const pending = data?.pendingRevisions || [];
  const completed = data?.completedRevisions || [];
  const metrics = data?.retentionMetrics || {
    estimated_recall_rate: 88,
    current_streak_days: 5,
    cards_mastered: 36,
    active_spaced_intervals: pending.length
  };
  const ebbinghaus = data?.ebbinghausCurve || [
    { day: 'Day 1', without_revision: '50%', with_spaced: '100%', label: 'Immediate Review' },
    { day: 'Day 3', without_revision: '28%', with_spaced: '95%', label: 'Spaced Recall Spike' },
    { day: 'Day 7', without_revision: '15%', with_spaced: '92%', label: 'Consolidation' },
    { day: 'Day 21', without_revision: '8%', with_spaced: '96%', label: 'Long-Term Storage' },
    { day: 'Day 60', without_revision: '4%', with_spaced: '99%', label: 'Permanent Mastery' }
  ];

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '1.5rem', color: 'var(--text-primary)' }}>
      {/* 1. Header & Primary Action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">Ebbinghaus Memory Engine</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Science-Backed 1-3-7-21-60 Day Spaced Scheduling</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
            AI Smart Spaced Revision & Flashcard Studio
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Automated spaced repetition triggers that intercept the forgetting curve and convert weak concepts into permanent memory.
          </p>
        </div>

        <button
          onClick={handleGenerateDeck}
          disabled={generating}
          className="btn btn-primary"
          style={{ gap: '0.45rem', fontWeight: 700, padding: '0.65rem 1.25rem' }}
        >
          <Sparkles size={16} />
          <span>{generating ? 'Synthesizing Deck...' : '⚡ Generate AI Spaced Deck'}</span>
        </button>
      </div>

      {/* 2. Scientific Memory Metrics & Streak Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Metric 1: Recall Rate */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Estimated Recall Rate
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {metrics.estimated_recall_rate}%
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 700 }}>
              ↑ High Long-Term Retention
            </div>
          </div>
        </div>

        {/* Metric 2: Revision Streak */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Revision Streak
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {metrics.current_streak_days} Days 🔥
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Consistent daily practice
            </div>
          </div>
        </div>

        {/* Metric 3: Active Scheduled Intervals */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Queue Topics
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {pending.length} Topics
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {data?.urgentCount || 0} Urgent Prioritized
            </div>
          </div>
        </div>

        {/* Metric 4: Mastered Flashcards */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Cards Mastered
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {metrics.cards_mastered + masteredCardsCount} Cards
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              SM-2 Stage 3+ Promoted
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI Memory Guidance Callout */}
      <div className="card" style={{
        backgroundColor: 'var(--bg-primary)',
        borderLeft: '4px solid var(--brand-primary)',
        marginBottom: '2rem',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
          <Sparkles size={18} />
          <span>AI Memory Optimization Advisory</span>
        </div>
        <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {data?.revisionAdvice || 'Daily revision of high-priority weak topics prevents forgetting curves and increases retention by 70%+.'}
        </div>
      </div>

      {/* 4. MAIN INTERACTIVE FLASHCARD ENGINE */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={22} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Interactive High-Yield Flashcard Studio
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFlashcardCategory(cat);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: flashcardCategory === cat ? 800 : 500,
                  backgroundColor: flashcardCategory === cat ? 'var(--brand-primary)' : 'var(--bg-primary)',
                  color: flashcardCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${flashcardCategory === cat ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Flashcard Container */}
        {currentCard ? (
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                minHeight: '290px',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isFlipped ? 'var(--bg-surface)' : 'var(--bg-primary)',
                border: `2px solid ${isFlipped ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                boxShadow: isFlipped ? '0 10px 30px rgba(37, 99, 235, 0.12)' : '0 4px 15px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-primary">{currentCard.category}</span>
                    <span className="badge badge-secondary">{currentCard.exam_tag}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    Card {currentCardIndex + 1} of {filteredFlashcards.length} • {isFlipped ? '💡 Explanation (Back)' : '❓ Prompt (Front)'}
                  </span>
                </div>

                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
                  {currentCard.topic}
                </div>

                {/* Card Main Body */}
                {!isFlipped ? (
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.5, marginTop: '1.25rem' }}>
                    {currentCard.front}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.7,
                    marginTop: '0.75rem',
                    whiteSpace: 'pre-line'
                  }}>
                    {currentCard.back}
                  </div>
                )}
              </div>

              {/* Flip Hint */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                <span>🔄 Click anywhere on the card to flip</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
                </span>
              </div>
            </div>

            {/* SM-2 Feedback & Rating Controls (When Flipped) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                    setCurrentCardIndex(prev => prev > 0 ? prev - 1 : filteredFlashcards.length - 1);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                    setCurrentCardIndex(prev => prev < filteredFlashcards.length - 1 ? prev + 1 : 0);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                    setCurrentCardIndex(Math.floor(Math.random() * filteredFlashcards.length));
                  }}
                  className="btn btn-secondary btn-sm"
                  title="Random Shuffle"
                >
                  <Shuffle size={14} />
                </button>
              </div>

              {/* SM-2 Spaced Repetition Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>Rate Recall:</span>
                <button
                  onClick={() => handleRateFlashcard('hard')}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: ratingStatus === 'hard' ? '#ef4444' : 'rgba(239, 68, 68, 0.12)',
                    color: ratingStatus === 'hard' ? '#ffffff' : '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.78rem'
                  }}
                >
                  🔴 Hard (1 Day)
                </button>
                <button
                  onClick={() => handleRateFlashcard('good')}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: ratingStatus === 'good' ? '#f59e0b' : 'rgba(245, 158, 11, 0.12)',
                    color: ratingStatus === 'good' ? '#ffffff' : '#d97706',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.78rem'
                  }}
                >
                  🟡 Good (3 Days)
                </button>
                <button
                  onClick={() => handleRateFlashcard('easy')}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: ratingStatus === 'easy' ? '#10b981' : 'rgba(16, 185, 129, 0.12)',
                    color: ratingStatus === 'easy' ? '#ffffff' : '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.78rem'
                  }}
                >
                  🟢 Mastered (7 Days)
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 5. ACTIVE SPACED REPETITION QUEUE */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={20} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Active Spaced Revision Queue ({pending.length})
            </h2>
          </div>
          {data?.urgentCount > 0 && (
            <span className="badge badge-danger">
              {data.urgentCount} High-Yield Priority Tasks
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem auto' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              All Scheduled Revisions are Up to Date!
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
              Click <strong>"Generate AI Spaced Deck"</strong> above to load new high-weightage topics into your queue.
            </p>
            <button onClick={handleGenerateDeck} className="btn btn-primary btn-sm">
              <Sparkles size={14} />
              <span>Load High-Yield Topics</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {pending.map(rev => {
              const isUrgent = rev.priority === 'urgent';
              return (
                <div
                  key={rev.id}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-primary)',
                    border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.25)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${isUrgent ? 'badge-danger' : 'badge-primary'}`}>
                        Stage {rev.revision_interval_stage || 1} ({rev.priority?.toUpperCase()})
                      </span>
                      <span className="badge badge-secondary">{rev.subject_name}</span>
                    </div>
                    <div style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {rev.topic_name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      📅 Scheduled: <strong>{rev.scheduled_date}</strong> • Reason: <em>{rev.reason?.replace(/_/g, ' ')}</em>
                    </div>
                  </div>

                  <button
                    onClick={() => handleComplete(rev.id)}
                    disabled={completingId === rev.id}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.4rem', fontWeight: 700, padding: '0.5rem 1rem' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{completingId === rev.id ? 'Promoting...' : 'Mark Revised & Promote'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. EBBINGHAUS FORGETTING CURVE VISUALIZER */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <TrendingUp size={22} color="var(--brand-primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            Scientific Retention Curve (Ebbinghaus Spaced Intervals)
          </h2>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          How timed spaced repetition halts exponential memory decay and establishes permanent neural pathways.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {ebbinghaus.map((step, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                {step.day}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)', margin: '0.35rem 0' }}>
                {step.with_spaced}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                Without Review: {step.without_revision}
              </div>
              <div style={{
                marginTop: '0.65rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)'
              }}>
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. COMPLETED REVISIONS LOG */}
      {completed.length > 0 && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={20} color="var(--success)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Recently Mastered Concepts ({completed.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {completed.map(rev => (
              <div
                key={rev.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{rev.topic_name}</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({rev.subject_name})</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  ✓ Mastered on {new Date(rev.completed_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
