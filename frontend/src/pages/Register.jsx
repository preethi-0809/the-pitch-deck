import React, { useState } from 'react';
import { Target, ArrowRight, ArrowLeft, CheckCircle2, User, Clock, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register({ onNavigateToLogin }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferred_language: 'en',
    user_type: 'working_professional',
    target_exam_id: 'exam_upsc_cse',
    exam_date: '2026-11-20',
    preparation_level: 'beginner',
    previous_attempts: 0,
    daily_hours_weekday: 2.0,
    daily_hours_weekend: 5.0,
    preferred_study_timings: 'morning,evening',
    learning_style: 'practical_mcq',
    strong_subjects: ['Indian Polity'],
    weak_subjects: ['Indian Economy']
  });

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.name.trim()) {
        setError('Please enter your Full Name.');
        return;
      }
      if (!formData.email || !formData.email.trim()) {
        setError('Please enter your Email Address.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid Email Address (e.g. user@example.com).');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    } else if (step === 2) {
      if (!formData.target_exam_id) {
        setError('Please select your Target Examination.');
        return;
      }
    }
    setStep(s => s + 1);
  };
  const handlePrev = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        setStep(1);
        return;
      }
      const { name, email, password, ...profileData } = formData;
      await register(name, email, password, profileData);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const examsList = [
    { id: 'exam_upsc_cse', code: 'UPSC CSE', name: 'UPSC Civil Services (IAS/IPS/IFS)', cat: 'National Civil Services' },
    { id: 'exam_tnpsc_grp2', code: 'TNPSC GRP2', name: 'TNPSC Group 2 / 2A Combined Services', cat: 'Tamil Nadu State PSC' },
    { id: 'exam_ssc_cgl', code: 'SSC CGL', name: 'SSC Combined Graduate Level Tier-I', cat: 'Central Govt Staff' },
    { id: 'exam_bank_po', code: 'BANK PO', name: 'Banking Probationary Officer (IBPS/SBI)', cat: 'Banking Sector' },
    { id: 'exam_rrb_ntpc', code: 'RRB NTPC', name: 'Railway Non-Technical Categories', cat: 'Indian Railways' },
    { id: 'exam_state_psc', code: 'STATE PSC', name: 'General State Civil Services Prelims', cat: 'State PSC' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '2rem 1rem'
    }}>
      <div className="card" style={{ maxWidth: '620px', width: '100%', padding: '2.25rem' }}>
        {/* Step Progress Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              {step}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Step {step} of 2
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {step === 1 && 'Account & Language'}
                {step === 2 && 'Target Exam & Schedule Constraints'}
              </div>
            </div>
          </div>
          <span className="badge badge-primary">Smart Onboarding</span>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid var(--danger-border)' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Basic Account */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter your full name (e.g. Karthik Raja)"
                  value={formData.name}
                  onChange={(e) => {
                    setError('');
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  style={{ width: '100%', borderColor: error && !formData.name ? 'var(--danger)' : undefined }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="email"
                  placeholder="Enter your email (e.g. candidate@example.com)"
                  value={formData.email}
                  onChange={(e) => {
                    setError('');
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  style={{ width: '100%', borderColor: error && !formData.email ? 'var(--danger)' : undefined }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Password <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="password"
                  placeholder="Enter password (minimum 6 characters)"
                  value={formData.password}
                  onChange={(e) => {
                    setError('');
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  style={{ width: '100%', borderColor: error && !formData.password ? 'var(--danger)' : undefined }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Preferred Language</label>
                <select
                  value={formData.preferred_language}
                  onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <span>Continue to Exam Selection</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: Exam & Schedule Constraints */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem' }}>Select Target Examination</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {examsList.map(exam => {
                    const isSelected = formData.target_exam_id === exam.id;
                    return (
                      <div
                        key={exam.id}
                        onClick={() => setFormData({ ...formData, target_exam_id: exam.id })}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isSelected ? 'var(--brand-light)' : 'var(--bg-primary)',
                          border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                          {exam.code}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                          {exam.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Persona Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>Your Current Occupation / Category</label>
                <select
                  value={formData.user_type}
                  onChange={(e) => {
                    const val = e.target.value;
                    let wk = 2.0;
                    let we = 5.0;
                    if (val === 'student') { wk = 6.0; we = 8.0; }
                    if (val === 'homemaker') { wk = 3.0; we = 4.0; }
                    if (val === 'graduate_job_seeker') { wk = 7.0; we = 7.0; }
                    setFormData({ ...formData, user_type: val, daily_hours_weekday: wk, daily_hours_weekend: we });
                  }}
                  style={{ width: '100%' }}
                >
                  <option value="working_professional">Working Professional (1-3h weekdays / 5-6h weekends)</option>
                  <option value="student">Full-Time College Student (5-8h daily)</option>
                  <option value="graduate_job_seeker">Graduate / Full-Time Job Seeker (6-8h daily)</option>
                  <option value="homemaker">Homemaker (Flexible Segmented Hours)</option>
                  <option value="general">General Candidate</option>
                </select>
              </div>

              {/* Weekday & Weekend Hours */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Weekday Hours/Day</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={formData.daily_hours_weekday}
                    onChange={(e) => setFormData({ ...formData, daily_hours_weekday: parseFloat(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Weekend Hours/Day</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="14"
                    value={formData.daily_hours_weekend}
                    onChange={(e) => setFormData({ ...formData, daily_hours_weekend: parseFloat(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={handlePrev} className="btn btn-secondary">
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} />
                  <span>{loading ? 'Creating Account...' : 'Complete & Launch Platform'}</span>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Switch to Login */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
