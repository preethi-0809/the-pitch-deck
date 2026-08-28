import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Clock, RefreshCw, CheckCircle2, Circle, Sparkles, Sliders, 
  Plus, Trash2, BookOpen, Target, Brain, Flame, Newspaper, Award, Check
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudyPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customHours, setCustomHours] = useState(5);
  const [activeStrategy, setActiveStrategy] = useState('balanced');
  const [isAdapting, setIsAdapting] = useState(false);
  const [isRedistributing, setIsRedistributing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Custom Task Modal / Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    task_type: 'learn',
    planned_duration_minutes: 35,
    due_time_slot: 'morning',
    priority: 'high',
    description: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const res = await api.get('/study/plan');
      if (res.success) {
        setPlan(res.plan);
      }
    } catch (e) {
      console.error('Failed to load study plan:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const res = await api.patch(`/study/tasks/${taskId}`, { isCompleted: !currentStatus });
      if (res.success && res.plan) {
        setPlan(res.plan);
      }
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
  };

  const handleRegenerate = async (hours = customHours, strategy = activeStrategy) => {
    try {
      setIsAdapting(true);
      setFeedbackMsg('');
      const res = await api.post('/study/plan/regenerate', { customHours: hours, strategy });
      if (res.success && res.plan) {
        setPlan(res.plan);
        setFeedbackMsg(`Generated ${res.plan.tasks?.length || 0} structured study sessions for ${hours} hours (${strategy.replace('_', ' ')} mode).`);
      }
    } catch (e) {
      console.error('Failed to regenerate plan:', e);
    } finally {
      setIsAdapting(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      setIsAdding(true);
      const res = await api.post('/study/tasks', newTask);
      if (res.success && res.plan) {
        setPlan(res.plan);
        setShowAddModal(false);
        setNewTask({
          title: '',
          task_type: 'learn',
          planned_duration_minutes: 35,
          due_time_slot: 'morning',
          priority: 'high',
          description: ''
        });
        setFeedbackMsg('Custom study session successfully added to your day.');
      }
    } catch (e) {
      console.error('Failed to add custom task:', e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await api.delete(`/study/tasks/${taskId}`);
      if (res.success && res.plan) {
        setPlan(res.plan);
        setFeedbackMsg('Session removed from schedule.');
      }
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  const handleRedistribute = async () => {
    try {
      setIsRedistributing(true);
      setFeedbackMsg('');
      const res = await api.post('/study/plan/redistribute');
      if (res.success && res.plan) {
        setPlan(res.plan);
        setFeedbackMsg(res.result?.message || 'Tasks successfully redistributed.');
      }
    } catch (e) {
      console.error('Failed to redistribute:', e);
    } finally {
      setIsRedistributing(false);
    }
  };

  const tasks = plan?.tasks || [];
  const completedMinutes = plan?.total_completed_minutes || 0;
  const plannedMinutes = plan?.total_planned_minutes || (customHours * 60);
  const progressPct = plannedMinutes > 0 ? Math.min(100, Math.round((completedMinutes / plannedMinutes) * 100)) : 0;
  const completedCount = tasks.filter(t => t.is_completed).length;

  const strategies = [
    { id: 'balanced', label: '🎯 Balanced Multi-Slot (5-8 Sessions)', desc: 'Optimal blend of Theory, MCQs, Current Affairs & Mini-Mocks' },
    { id: 'practice_heavy', label: '⚡ MCQ & Speed Sprint (6-8 Sessions)', desc: 'Intensive PYQs, error log review & elimination tactics' },
    { id: 'concept_mastery', label: '📖 Conceptual Deep Dive (5-7 Sessions)', desc: 'Multi-subject foundational standard textbook mastery' },
    { id: 'rapid_revision', label: '🔄 Spaced Active Recall (5-7 Sessions)', desc: 'Flashcard tests, memory consolidation & high-yield revision' }
  ];

  const getTaskTypeStyle = (type) => {
    switch (type) {
      case 'revision':
        return { bg: '#f3e8ff', text: '#7e22ce', border: '#a855f7', label: 'SPACED REVISION', icon: Brain };
      case 'practice_mcq':
        return { bg: '#ecfdf5', text: '#047857', border: '#10b981', label: 'PRACTICE MCQ & PYQ', icon: Target };
      case 'current_affairs':
        return { bg: '#fffbeb', text: '#b45309', border: '#f59e0b', label: 'CURRENT AFFAIRS & PIB', icon: Newspaper };
      case 'mock_test':
        return { bg: '#ffe4e6', text: '#be123c', border: '#f43f5e', label: 'DAILY MINI-MOCK', icon: Award };
      default:
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#3b82f6', label: 'CORE THEORY', icon: BookOpen };
    }
  };

  const getTimeSlotColor = (slot) => {
    switch (slot) {
      case 'morning': return { bg: '#e0f2fe', text: '#0369a1', label: '🌅 Morning Slot' };
      case 'afternoon': return { bg: '#fef3c7', text: '#92400e', label: '☀️ Afternoon Slot' };
      case 'evening': return { bg: '#f3e8ff', text: '#6b21a8', label: '🌇 Evening Slot' };
      case 'night': return { bg: '#e2e8f0', text: '#334155', label: '🌙 Night Consolidation' };
      default: return { bg: '#f1f5f9', text: '#475569', label: slot };
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            AI Adaptive Study Planner
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Multi-slot daily schedule balancing syllabus pacing, active recall, MCQ speed, and current affairs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={15} />
            <span>+ Add Custom Task</span>
          </button>

          <button
            onClick={handleRedistribute}
            disabled={isRedistributing}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} className={isRedistributing ? 'animate-spin' : ''} />
            <span>Rebalance Missed Tasks</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          border: '1px solid var(--brand-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Add Custom Task Form Modal */}
      {showAddModal && (
        <div className="card" style={{ marginBottom: '1.75rem', border: '2px solid var(--brand-primary)', padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Add Custom Study Session
            </h3>
            <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 700 }}>✕</button>
          </div>

          <form onSubmit={handleAddTask}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Session Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Read Indian Polity Chapter 4"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Task Type</label>
                <select
                  value={newTask.task_type}
                  onChange={(e) => setNewTask({ ...newTask, task_type: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="learn">Core Concept & Theory</option>
                  <option value="practice_mcq">MCQ & PYQ Practice</option>
                  <option value="revision">Spaced Memory Revision</option>
                  <option value="current_affairs">Current Affairs & Editorial</option>
                  <option value="mock_test">Daily Mini-Mock Test</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Duration (Minutes)</label>
                <select
                  value={newTask.planned_duration_minutes}
                  onChange={(e) => setNewTask({ ...newTask, planned_duration_minutes: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                >
                  <option value={20}>20 Minutes (Sprint)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Focus)</option>
                  <option value={60}>60 Minutes (Deep Dive)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Time Slot</label>
                <select
                  value={newTask.due_time_slot}
                  onChange={(e) => setNewTask({ ...newTask, due_time_slot: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="morning">🌅 Morning Slot</option>
                  <option value="afternoon">☀️ Afternoon Slot</option>
                  <option value="evening">🌇 Evening Slot</option>
                  <option value="night">🌙 Night Slot</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Notes / Key Focus (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Focus on Article 14, 19, 21 case laws"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={isAdding} className="btn btn-primary btn-sm">
                {isAdding ? 'Adding...' : 'Add Session to Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Strategy Modes Selector */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={16} color="var(--brand-primary)" />
          <span>Study Mode & Strategy</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {strategies.map(s => {
            const isSelected = activeStrategy === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setActiveStrategy(s.id);
                  handleRegenerate(customHours, s.id);
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--brand-light)' : 'var(--bg-primary)',
                  border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Daily Hours Adjuster */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--brand-primary)" />
              <span>Available Study Hours Today</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Auto-calculates into 5 to 8 multi-slot focus sessions across the day.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[2, 3, 4, 5, 6, 8].map(hrs => (
              <button
                key={hrs}
                onClick={() => {
                  setCustomHours(hrs);
                  handleRegenerate(hrs, activeStrategy);
                }}
                disabled={isAdapting}
                className={`btn btn-sm ${customHours === hrs ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minWidth: '70px', fontWeight: 700 }}
              >
                {hrs} Hours
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Progress & Summary Metrics */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>PLANNED SESSIONS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tasks.length} Focus Slots</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>COMPLETED SESSIONS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>{completedCount} of {tasks.length} Completed</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>TOTAL STUDY MINUTES</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{completedMinutes} / {plannedMinutes} mins</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>DAY COMPLETION RATE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: progressPct === 100 ? '#059669' : 'var(--text-primary)' }}>{progressPct}%</div>
          </div>
        </div>

        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: progressPct === 100 ? '#059669' : 'var(--brand-primary)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Multi-Slot Task Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {tasks.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No study sessions planned. Select your available hours above to generate your plan.
          </div>
        ) : (
          tasks.map((task, idx) => {
            const isDone = Boolean(task.is_completed);
            const typeStyle = getTaskTypeStyle(task.task_type);
            const slotStyle = getTimeSlotColor(task.due_time_slot);
            const Icon = typeStyle.icon;

            return (
              <div
                key={task.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.15rem 1.4rem',
                  opacity: isDone ? 0.7 : 1,
                  borderLeft: `4px solid ${typeStyle.border}`,
                  backgroundColor: isDone ? 'var(--bg-primary)' : 'var(--bg-surface)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Complete Checkbox */}
                <button
                  onClick={() => handleToggleTask(task.id, isDone)}
                  style={{
                    marginTop: '0.15rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isDone ? '#059669' : 'var(--text-muted)'
                  }}
                  title={isDone ? 'Mark as Pending' : 'Mark as Complete'}
                >
                  {isDone ? <CheckCircle2 size={24} color="#059669" /> : <Circle size={24} />}
                </button>

                {/* Session Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <Icon size={12} />
                        {typeStyle.label}
                      </span>

                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: slotStyle.bg,
                        color: slotStyle.text
                      }}>
                        {slotStyle.label}
                      </span>

                      {task.priority === 'high' && (
                        <span style={{
                          padding: '0.2rem 0.45rem',
                          borderRadius: '6px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: '#fee2e2',
                          color: '#dc2626'
                        }}>
                          High Priority
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                        ⏱️ {task.planned_duration_minutes} mins
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Remove session"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--text-muted)' : 'var(--text-primary)'
                  }}>
                    {task.title}
                  </div>

                  {task.description && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
