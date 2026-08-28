import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CoachRecommendationBanner from '../components/dashboard/CoachRecommendationBanner';
import TodayPlanCard from '../components/dashboard/TodayPlanCard';
import ReadinessMeter from '../components/dashboard/ReadinessMeter';
import WeaknessAlertCard from '../components/dashboard/WeaknessAlertCard';
import {
  Award, BookOpen, Clock, CalendarDays, ArrowRight, Target,
  Bookmark, Sparkles, Scale, AlertCircle, ChevronRight, CheckCircle2,
  Calendar, Layers, TrendingUp
} from 'lucide-react';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function Dashboard({ setActiveTab }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [targetExams, setTargetExams] = useState([]);
  const [savedExams, setSavedExams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [planRes, perfRes, targetRes, savedRes, notifRes] = await Promise.all([
          api.get('/study/plan').catch(() => ({ success: false })),
          api.get('/performance/dashboard').catch(() => ({ success: false })),
          api.get('/discovery/targets').catch(() => ({ data: [] })),
          api.get('/discovery/saved').catch(() => ({ data: [] })),
          api.get('/discovery/notifications').catch(() => ({ data: [] }))
        ]);

        if (planRes?.success) setPlan(planRes.plan);
        if (perfRes?.success) setPerformance(perfRes);
        setTargetExams(targetRes?.data || []);
        setSavedExams(savedRes?.data || []);
        setNotifications((notifRes?.data || []).slice(0, 3));
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="page-body">
      {/* Welcome Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || 'Candidate'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Aspirant Mode: <strong style={{ textTransform: 'capitalize' }}>{user?.profile?.user_type?.replace('_', ' ') || 'Student'}</strong> • Study Target: <strong>{user?.profile?.daily_hours_weekday || 2}h</strong> weekdays / <strong>{user?.profile?.daily_hours_weekend || 4}h</strong> weekends
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('explore')} className="btn btn-secondary btn-sm">
            <BookOpen size={15} />
            <span>Explore 49+ Exams</span>
          </button>
          <button onClick={() => setActiveTab('preparation')} className="btn btn-secondary btn-sm">
            <Sparkles size={15} />
            <span>AI 60-Day Roadmap</span>
          </button>
          <button onClick={() => setActiveTab('tests')} className="btn btn-primary btn-sm">
            <Award size={15} />
            <span>Take Adaptive Test</span>
          </button>
        </div>
      </div>

      {/* Critical Recruitment Countdown Banner */}
      {notifications.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: n.urgency === 'urgent' || n.urgency === 'critical' ? 'var(--danger-light)' : 'var(--brand-light)',
                border: `1px solid ${n.urgency === 'urgent' || n.urgency === 'critical' ? 'var(--danger-border)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={16} color={n.urgency === 'urgent' || n.urgency === 'critical' ? 'var(--danger)' : 'var(--brand-primary)'} />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: n.urgency === 'urgent' || n.urgency === 'critical' ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.message}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (n.exam_id) setSelectedExamId(n.exam_id);
                  else setActiveTab('calendar');
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', whiteSpace: 'nowrap' }}
              >
                Track
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Target Exams & Saved Exams OS Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Active Target Exams */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={16} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                My Target Preparation Exams ({targetExams.length})
              </h3>
            </div>
            <button onClick={() => setActiveTab('explore')} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
              + Add Target
            </button>
          </div>

          {targetExams.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
              No target exams set. Browse directory to set active target.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {targetExams.map(t => (
                <div
                  key={t.target_id}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>{t.code}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span>
                    </div>
                    {t.countdown_label && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                        ⏳ {t.countdown_label}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedExamId(t.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved / Bookmarked Exams */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bookmark size={16} color="var(--accent-teal)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Bookmarked Exams ({savedExams.length})
              </h3>
            </div>
            <button onClick={() => setActiveTab('explore')} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
              Browse More
            </button>
          </div>

          {savedExams.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
              Bookmark examinations from the Explorer to review later.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {savedExams.map(s => (
                <div
                  key={s.saved_id}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="badge badge-secondary" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>{s.code}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '0.4rem' }}>{s.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedExamId(s.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Coach Recommendation Banner */}
      <CoachRecommendationBanner
        recommendation={performance?.weaknessAnalysis?.recommendations[0]?.message}
        onAskCoach={() => setActiveTab('coach')}
      />

      {/* Grid: 2 Columns */}
      <div className="grid-2">
        {/* Left Column: Today's Plan */}
        <TodayPlanCard
          plan={plan}
          onPlanUpdate={setPlan}
          onNavigateToPlan={() => setActiveTab('study-plan')}
        />

        {/* Right Column: Readiness Meter & Weakness Alert */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ReadinessMeter readiness={performance?.readiness} />
          <WeaknessAlertCard
            weaknessData={performance?.weaknessAnalysis}
            onReviseTopic={(topicId) => setActiveTab('revision')}
          />
        </div>
      </div>

      {/* Modal */}
      {selectedExamId && (
        <ExamDetailsModal
          examId={selectedExamId}
          onClose={() => setSelectedExamId(null)}
          onSelectRoadmap={() => {
            setSelectedExamId(null);
            setActiveTab('preparation');
          }}
        />
      )}
    </div>
  );
}
