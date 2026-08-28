import React, { useState } from 'react';
import {
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Award, HelpCircle,
  TrendingUp, ShieldCheck, AlertCircle, ChevronRight, Bookmark, Target, RefreshCw
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function ExamFinder({ setActiveTab, onOpenCompareWithExam }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [savedExamIds, setSavedExamIds] = useState(new Set());
  const [targetExamIds, setTargetExamIds] = useState(new Set());

  // 10-Question Form State
  const [formData, setFormData] = useState({
    qualification: 'Any Degree',
    degree: 'B.E Computer Science & Engineering',
    age: 22,
    state: 'All India',
    job_type: 'All',
    technical_preference: 'both', // 'technical' | 'non_technical' | 'both'
    desired_salary: 50000,
    defence_interest: 'yes',
    banking_interest: 'yes',
    preparation_months: 6
  });

  const handleNext = () => setStep(s => Math.min(10, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/discovery/finder', formData);
      if (res.success) {
        setResults(res.data || []);
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
  };

  const handleToggleTarget = async (examId) => {
    try {
      const res = await api.post('/discovery/targets/toggle', { examId, priority: 'primary' });
      const next = new Set(targetExamIds);
      if (res.targeted) next.add(examId);
      else next.delete(examId);
      setTargetExamIds(next);
    } catch (e) {
      // ignore
    }
  };

  const handleToggleSaved = async (examId) => {
    try {
      const res = await api.post('/discovery/saved/toggle', { examId });
      const next = new Set(savedExamIds);
      if (res.saved) next.add(examId);
      else next.delete(examId);
      setSavedExamIds(next);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={15} />
          <span>AI Eligibility & Recommendation Engine</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Personalized Government Exam Finder
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
          Answer 10 quick questions about your qualification, age, degree, and career goals. We'll rank every official government exam with an accurate eligibility match score.
        </p>
      </div>

      {/* RESULTS VIEW */}
      {results ? (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Recommended Government Exams For You
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Ranked by qualification eligibility, age window, salary tier, and career preference.
              </p>
            </div>

            <button onClick={handleReset} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} />
              <span>Modify Profile / Retake</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {results.map((exam, idx) => {
              const isSaved = savedExamIds.has(exam.id);
              const isTarget = targetExamIds.has(exam.id);

              return (
                <div
                  key={exam.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    border: idx === 0 ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                >
                  {/* Top Match Bar */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{exam.code}</span>
                      <span className="badge badge-secondary">{exam.category}</span>
                      {exam.state && exam.state !== 'All India' && (
                        <span className="badge badge-success">📍 {exam.state}</span>
                      )}
                      {idx === 0 && (
                        <span className="badge badge-warning" style={{ fontWeight: 800 }}>⭐ Top Overall Match</span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: exam.match_score >= 85 ? 'var(--success-light)' : 'var(--brand-light)',
                      color: exam.match_score >= 85 ? 'var(--success)' : 'var(--brand-primary)',
                      fontWeight: 800,
                      fontSize: '0.92rem'
                    }}>
                      <TrendingUp size={16} />
                      <span>{exam.match_score}% Match</span>
                    </div>
                  </div>

                  {/* Exam Title */}
                  <div>
                    <h3
                      onClick={() => setSelectedExamId(exam.id)}
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        margin: '0 0 0.25rem 0',
                        cursor: 'pointer'
                      }}
                    >
                      {exam.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {exam.organization}
                    </div>
                  </div>

                  {/* Why this exam was recommended */}
                  <div style={{
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      💡 Why We Recommended This:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {exam.reasons && exam.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '0.75rem',
                    fontSize: '0.82rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Eligibility:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{exam.qualification}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Age Limit:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{exam.age_min}–{exam.age_max} Years</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>In-Hand Salary:</span>
                      <div style={{ fontWeight: 800, color: 'var(--success)' }}>
                        {exam.in_hand_salary ? exam.in_hand_salary.split('/')[0] : `₹${exam.salary_min}+`}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Cadre:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{exam.job_type}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => setSelectedExamId(exam.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>View Full Profile</span>
                      <ChevronRight size={14} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleToggleSaved(exam.id)}
                        className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleTarget(exam.id)}
                        className={`btn btn-sm ${isTarget ? 'btn-success' : 'btn-primary'}`}
                      >
                        <Target size={14} />
                        <span>{isTarget ? 'Target Active' : 'Start Target'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* WIZARD QUESTIONS VIEW */
        <div className="card" style={{ padding: '2.25rem' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Question {step} of 10
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {step === 1 && '1. What is your highest educational qualification?'}
                {step === 2 && '2. What degree or major branch did you study?'}
                {step === 3 && '3. What is your current age?'}
                {step === 4 && '4. Which state or region do you prefer for posting?'}
                {step === 5 && '5. What type of government job role do you prefer?'}
                {step === 6 && '6. Do you prefer technical or general administrative roles?'}
                {step === 7 && '7. What is your target monthly in-hand salary?'}
                {step === 8 && '8. Are you interested in Defence & Uniformed forces?'}
                {step === 9 && '9. Are you interested in Banking & Financial institutions?'}
                {step === 10 && '10. How much preparation time do you have?'}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              {step}/10
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (step === 10) handleSubmit(); else handleNext(); }}>
            {/* QUESTION 1 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['10th', '12th', 'Diploma', 'Any Degree', 'B.E/B.Tech', 'Postgraduate', 'Law', 'Healthcare'].map(opt => (
                  <label
                    key={opt}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: formData.qualification === opt ? 'var(--brand-light)' : 'var(--bg-primary)',
                      border: `1px solid ${formData.qualification === opt ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="qualification"
                      checked={formData.qualification === opt}
                      onChange={() => setFormData({ ...formData, qualification: opt })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* QUESTION 2 */}
            {step === 2 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Specify your Degree or Branch (e.g. B.E Mechanical, B.Sc Physics, B.Com, B.A History, MBBS, LL.B)
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.E Computer Science & Engineering"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                />
              </div>
            )}

            {/* QUESTION 3 */}
            {step === 3 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Your Current Age: <strong>{formData.age} Years</strong>
                </label>
                <input
                  type="range"
                  min="16"
                  max="45"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  style={{ width: '100%', margin: '1rem 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>16 Years</span>
                  <span>25 Years</span>
                  <span>35 Years</span>
                  <span>45 Years</span>
                </div>
              </div>
            )}

            {/* QUESTION 4 */}
            {step === 4 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Preferred State / Posting Location
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                >
                  {['All India', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Odisha'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* QUESTION 5 */}
            {step === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'All', title: 'Open to All Career Options', desc: 'Show all matching opportunities' },
                  { id: 'Administrative', title: 'Civil & Administrative Services', desc: 'IAS, Deputy Collector, Sub-Registrar, ASO' },
                  { id: 'Non-Technical', title: 'Desk & Secretariat Officer Roles', desc: 'Income Tax Inspector, Banking PO, Assistant' },
                  { id: 'Uniformed / Defence', title: 'Uniformed Police & Armed Forces', desc: 'DSP, SI, NDA, CDS, Coast Guard' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: formData.job_type === opt.id ? 'var(--brand-light)' : 'var(--bg-primary)',
                      border: `1px solid ${formData.job_type === opt.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="job_type"
                        checked={formData.job_type === opt.id}
                        onChange={() => setFormData({ ...formData, job_type: opt.id })}
                      />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opt.title}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '1.6rem', marginTop: '0.2rem' }}>
                      {opt.desc}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* QUESTION 6 */}
            {step === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'both', label: 'Open to both Technical & Non-Technical' },
                  { id: 'technical', label: 'Technical / Engineering Only (ISRO, DRDO, GATE, JE)' },
                  { id: 'non_technical', label: 'Non-Technical & Administrative Only' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: formData.technical_preference === opt.id ? 'var(--brand-light)' : 'var(--bg-primary)',
                      border: `1px solid ${formData.technical_preference === opt.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="technical_preference"
                      checked={formData.technical_preference === opt.id}
                      onChange={() => setFormData({ ...formData, technical_preference: opt.id })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* QUESTION 7 */}
            {step === 7 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Target Monthly In-Hand Salary: <strong>₹{formData.desired_salary.toLocaleString()} / month</strong>
                </label>
                <input
                  type="range"
                  min="25000"
                  max="120000"
                  step="5000"
                  value={formData.desired_salary}
                  onChange={(e) => setFormData({ ...formData, desired_salary: Number(e.target.value) })}
                  style={{ width: '100%', margin: '1rem 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                  <span>₹80,000</span>
                  <span>₹1,20,000+</span>
                </div>
              </div>
            )}

            {/* QUESTION 8 */}
            {step === 8 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'yes', label: 'Yes, include Army, Navy, Air Force, CAPF & Police recruitments' },
                  { id: 'no', label: 'No, do not include Defence/Uniformed forces' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: formData.defence_interest === opt.id ? 'var(--brand-light)' : 'var(--bg-primary)',
                      border: `1px solid ${formData.defence_interest === opt.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="defence_interest"
                      checked={formData.defence_interest === opt.id}
                      onChange={() => setFormData({ ...formData, defence_interest: opt.id })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* QUESTION 9 */}
            {step === 9 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'yes', label: 'Yes, include RBI Grade B, SBI PO, IBPS & NABARD exams' },
                  { id: 'no', label: 'No, exclude Banking examinations' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: formData.banking_interest === opt.id ? 'var(--brand-light)' : 'var(--bg-primary)',
                      border: `1px solid ${formData.banking_interest === opt.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="banking_interest"
                      checked={formData.banking_interest === opt.id}
                      onChange={() => setFormData({ ...formData, banking_interest: opt.id })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* QUESTION 10 */}
            {step === 10 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 3, label: '3 Months (Need fast, immediate upcoming exams)' },
                  { id: 6, label: '6 Months (Balanced standard preparation plan)' },
                  { id: 12, label: '1 Year (Comprehensive preparation for top grade exams like UPSC / TNPSC Group 1 / RBI)' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: formData.preparation_months === opt.id ? 'var(--brand-light)' : 'var(--bg-primary)',
                      border: `1px solid ${formData.preparation_months === opt.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="preparation_months"
                      checked={formData.preparation_months === opt.id}
                      onChange={() => setFormData({ ...formData, preparation_months: opt.id })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="btn btn-secondary"
                style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              {step < 10 ? (
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  <Sparkles size={16} />
                  <span>{loading ? 'Analyzing 49+ Examinations...' : 'Generate Recommendations'}</span>
                </button>
              )}
            </div>
          </form>
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
