import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Sparkles, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function TodayPlanCard({ plan, onPlanUpdate, onNavigateToPlan }) {
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [isRedistributing, setIsRedistributing] = useState(false);

  const handleToggle = async (taskId, currentStatus) => {
    try {
      setLoadingTaskId(taskId);
      const res = await api.patch(`/study/tasks/${taskId}`, { isCompleted: !currentStatus });
      if (res.success && res.plan) {
        onPlanUpdate(res.plan);
      }
    } catch (e) {
      console.error('Failed to toggle task:', e);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleRedistribute = async () => {
    try {
      setIsRedistributing(true);
      const res = await api.post('/study/plan/redistribute');
      if (res.success && res.plan) {
        onPlanUpdate(res.plan);
      }
    } catch (e) {
      console.error('Failed to redistribute tasks:', e);
    } finally {
      setIsRedistributing(false);
    }
  };

  const tasks = plan?.tasks || [];
  const completedCount = tasks.filter(t => t.is_completed).length;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            <Clock size={19} color="#3b82f6" />
            <span>Today's Study Schedule</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {completedCount} of {tasks.length} tasks completed ({plan?.total_completed_minutes || 0}/{plan?.total_planned_minutes || 0} mins)
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleRedistribute}
            disabled={isRedistributing}
            className="btn btn-secondary btn-sm"
            title="Auto-rebalance missed tasks"
          >
            <RefreshCw size={13} className={isRedistributing ? 'animate-spin' : ''} />
            <span>Rebalance</span>
          </button>
          <button
            onClick={onNavigateToPlan}
            className="btn btn-outline btn-sm"
          >
            Full Plan
          </button>
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No study tasks generated for today. Click below to generate your tailored plan.
          </div>
        ) : (
          tasks.map(task => {
            const isDone = Boolean(task.is_completed);
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isDone ? 'var(--bg-primary)' : 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  opacity: isDone ? 0.75 : 1,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <button
                  onClick={() => handleToggle(task.id, isDone)}
                  disabled={loadingTaskId === task.id}
                  style={{ marginTop: '0.15rem', color: isDone ? '#059669' : 'var(--text-muted)' }}
                >
                  {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{task.title}</span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {task.planned_duration_minutes}m
                    </span>
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
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
