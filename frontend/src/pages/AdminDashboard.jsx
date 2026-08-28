import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, BookOpen, FileText, Award, Newspaper, Plus, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    topic_id: 'top_fr_dpsp',
    exam_id: 'exam_upsc_cse',
    question_text: '',
    difficulty_level: 'medium',
    explanation: '',
    options: [
      { option_key: 'A', option_text: '', is_correct: 0 },
      { option_key: 'B', option_text: '', is_correct: 1 },
      { option_key: 'C', option_text: '', is_correct: 0 },
      { option_key: 'D', option_text: '', is_correct: 0 }
    ]
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [statRes, userRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        if (statRes.success) setStats(statRes.stats);
        if (userRes.success) setUsersList(userRes.users);
      } catch (e) {
        console.error('Failed to load admin data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/questions', newQuestion);
      if (res.success) {
        setMsg('Question added successfully to question bank!');
        setShowQuestionModal(false);
      }
    } catch (e) {
      console.error('Failed to add question:', e);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={26} color="#059669" />
            <span>Admin & Content Management</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            System metrics, question bank administration, and candidate analytics.
          </p>
        </div>

        <button onClick={() => setShowQuestionModal(true)} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
          <Plus size={16} />
          <span>Add New Question</span>
        </button>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', color: 'var(--success)', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid var(--success-border)' }}>
          {msg}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>REGISTERED CANDIDATES</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>
            {stats?.users || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Active learners</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>EXAM SYLLABUS CATALOGS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
            {stats?.exams || 6}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>UPSC, SSC, TNPSC, Banking, Railways</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>QUESTION BANK ITEMS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>
            {stats?.questions || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>MCQs, PYQs & Drills</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>TEST ATTEMPTS EVALUATED</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0' }}>
            {stats?.attempts || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Diagnostic evaluations</div>
        </div>
      </div>

      {/* Candidate Management Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} color="#2563eb" />
            <span>Registered Candidates</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>User Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Weekday Hours</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u, i) => (
                <tr key={u.id || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize' }}>{u.user_type?.replace('_', ' ') || 'Student'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{u.daily_hours_weekday || 2}h / day</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Question Modal */}
      {showQuestionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <div className="card-title">Add Official Question to Bank</div>
              <button onClick={() => setShowQuestionModal(false)} style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>

            <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Question Text</label>
                <textarea
                  required
                  rows={3}
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Explanation</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {newQuestion.options.map((opt, idx) => (
                  <div key={opt.option_key}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      Option {opt.option_key} {opt.is_correct ? '✓ (Correct)' : ''}
                    </label>
                    <input
                      type="text"
                      required
                      value={opt.option_text}
                      onChange={(e) => {
                        const newOpts = [...newQuestion.options];
                        newOpts[idx].option_text = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowQuestionModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save to Bank</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
