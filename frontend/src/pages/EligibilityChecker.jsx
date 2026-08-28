import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck,
  AlertCircle, ChevronRight, Bookmark, Target, RefreshCw
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function EligibilityChecker({ setActiveTab }) {
  const [formData, setFormData] = useState({
    age: 22,
    qualification: 'Any Degree',
    degree: 'Bachelor of Science (B.Sc)',
    branch: 'General',
    state: 'All India',
    experience: 'fresher'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/discovery/finder', {
        qualification: formData.qualification,
        degree: `${formData.degree} ${formData.branch}`,
        age: formData.age,
        state: formData.state,
        desired_salary: 35000
      });

      if (res.success) {
        const all = res.data || [];
        setResults({
          eligible: all.filter(e => e.is_eligible),
          notEligible: all.filter(e => !e.is_eligible).slice(0, 10)
        });
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <CheckCircle2 size={15} />
          <span>Rule-Based Eligibility Checker</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Instant Government Exam Eligibility Checker
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.4rem auto 0 auto' }}>
          Enter your academic details, degree, and age. Instantly see which government exams you qualify for and which ones have criteria gaps.
        </p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Your Age: <strong>{formData.age} Years</strong>
              </label>
              <input
                type="number"
                min="16"
                max="50"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.65rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Highest Qualification
              </label>
              <select
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <option value="10th">10th Pass (Matriculation)</option>
                <option value="12th">12th Pass (Higher Secondary 10+2)</option>
                <option value="Diploma">Diploma in Engineering / Technical</option>
                <option value="Any Degree">Any Graduate Degree (B.A, B.Sc, B.Com, etc.)</option>
                <option value="B.E/B.Tech">B.E / B.Tech (Engineering)</option>
                <option value="Postgraduate">Postgraduate (Master's Degree)</option>
                <option value="Law">Law Degree (LL.B 3/5 Years)</option>
                <option value="Healthcare">Healthcare / B.Sc Nursing / GNM</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Degree Name
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.E, B.Com, B.Sc, B.A, LL.B"
                style={{ width: '100%', padding: '0.65rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Major Branch / Specialization
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g. Computer Science, Mechanical, Accounts"
                style={{ width: '100%', padding: '0.65rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                State / Home Domicile
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                style={{ width: '100%', padding: '0.65rem' }}
              >
                {['All India', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Odisha'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <option value="fresher">Fresher (0 Years)</option>
                <option value="1_2_years">1–2 Years Experience</option>
                <option value="3_plus_years">3+ Years Experience</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <CheckCircle2 size={16} />
              <span>{loading ? 'Checking Eligibility Rules...' : 'Check My Eligibility Now'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* SECTION A: YOU ARE ELIGIBLE FOR */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                You Are Eligible For ({results.eligible.length} Examinations)
              </h2>
            </div>

            {results.eligible.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No direct examinations matched. Try broadening your qualification standard.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {results.eligible.map(exam => (
                  <div
                    key={exam.id}
                    className="card"
                    style={{
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid var(--success-border)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary">{exam.code}</span>
                        <span className="badge badge-success">✓ Eligible</span>
                      </div>
                      <h3
                        onClick={() => setSelectedExamId(exam.id)}
                        style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', cursor: 'pointer' }}
                      >
                        {exam.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {exam.organization}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        • <strong>Required:</strong> {exam.qualification}<br />
                        • <strong>Age Range:</strong> {exam.age_min}–{exam.age_max} Years<br />
                        • <strong>In-Hand Salary:</strong> {exam.in_hand_salary || `₹${exam.salary_min}+`}
                      </div>
                    </div>

                    <div style={{ paddingTop: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => setSelectedExamId(exam.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%' }}
                      >
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: NOT ELIGIBLE (WITH REASONS) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <XCircle size={20} color="var(--danger)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Not Eligible ({results.notEligible.length} Examinations)
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {results.notEligible.map(exam => (
                <div
                  key={exam.id}
                  className="card"
                  style={{
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: 0.85
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-secondary">{exam.code}</span>
                      <span className="badge badge-danger">✕ Criteria Gap</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                      {exam.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {exam.organization}
                    </div>

                    <div style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--danger-light)',
                      border: '1px solid var(--danger-border)',
                      fontSize: '0.78rem',
                      color: 'var(--danger)',
                      lineHeight: 1.4
                    }}>
                      <strong>Reason for ineligibility:</strong><br />
                      {exam.eligibility_gaps && exam.eligibility_gaps.length > 0
                        ? exam.eligibility_gaps.join('; ')
                        : `Requires ${exam.qualification} or age bracket ${exam.age_min}–${exam.age_max} years.`}
                    </div>
                  </div>

                  <div style={{ paddingTop: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setSelectedExamId(exam.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                    >
                      <span>Check Rules</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedExamId && (
        <ExamDetailsModal
          examId={selectedExamId}
          onClose={() => setSelectedExamId(null)}
          onSelectRoadmap={() => {
            setSelectedExamId(null);
            if (setActiveTab) setActiveTab('preparation');
          }}
        />
      )}
    </div>
  );
}
