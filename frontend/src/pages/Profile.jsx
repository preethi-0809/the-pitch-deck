import React, { useState, useEffect } from 'react';
import { User, Save, Clock, Target, BookOpen, CheckCircle2, ShieldCheck, Mail, MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    user_type: user?.profile?.user_type || 'student',
    target_exam_id: user?.profile?.target_exam_id || '',
    exam_date: user?.profile?.exam_date || '',
    preparation_level: user?.profile?.preparation_level || 'beginner',
    daily_hours_weekday: user?.profile?.daily_hours_weekday ?? 2.0,
    daily_hours_weekend: user?.profile?.daily_hours_weekend ?? 4.0,
    preferred_study_timings: user?.profile?.preferred_study_timings || 'morning,evening',
    learning_style: user?.profile?.learning_style || 'visual_practical',
    state: user?.profile?.state || 'Tamil Nadu'
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await api.get('/discovery/exams');
        const examItems = res.data || res.exams || [];
        if (examItems.length > 0) {
          setExams(examItems);
          if (!formData.target_exam_id) {
            setFormData(prev => ({ ...prev, target_exam_id: prev.target_exam_id || examItems[0].id }));
          }
        }
      } catch (e) {
        console.error('Failed to load exams:', e);
      }
    }
    loadExams();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        user_type: user.profile?.user_type || 'student',
        target_exam_id: user.profile?.target_exam_id || (exams[0]?.id || ''),
        exam_date: user.profile?.exam_date || '',
        preparation_level: user.profile?.preparation_level || 'beginner',
        daily_hours_weekday: user.profile?.daily_hours_weekday ?? 2.0,
        daily_hours_weekend: user.profile?.daily_hours_weekend ?? 4.0,
        preferred_study_timings: user.profile?.preferred_study_timings || 'morning,evening',
        learning_style: user.profile?.learning_style || 'visual_practical',
        state: user.profile?.state || 'Tamil Nadu'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      await updateProfile(formData);
      setSuccessMsg('Profile and preparation preferences saved successfully!');
    } catch (e) {
      console.error('Failed to update profile:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Candidate Profile & Preferences
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Real account settings and adaptive AI preparation parameters.
        </p>
      </div>

      {successMsg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          fontWeight: 600,
          marginBottom: '1.5rem',
          border: '1px solid var(--success-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="card" style={{ maxWidth: '800px', marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {user?.name || 'Registered Candidate'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Mail size={14} />
                {user?.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} color="var(--success)" />
                Verified Real Account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Preferences Form */}
      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Candidate Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                style={{ width: '100%' }}
              />
            </div>

            {/* Candidate Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Candidate Category
              </label>
              <select
                value={formData.user_type}
                onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="student">College / Full-Time Student</option>
                <option value="working_professional">Working Professional (Limited Weekday Time)</option>
                <option value="graduate_job_seeker">Graduate / Full-Time Job Seeker</option>
                <option value="homemaker">Homemaker (Flexible Segmented Hours)</option>
                <option value="general">General Candidate</option>
              </select>
            </div>

            {/* Target Exam */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Target Government Exam
              </label>
              <select
                value={formData.target_exam_id}
                onChange={(e) => setFormData({ ...formData, target_exam_id: e.target.value })}
                style={{ width: '100%' }}
              >
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>

            {/* Home / Target State */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Home State / Domicile
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Tamil Nadu">Tamil Nadu (TNPSC, TRB, TNUSRB)</option>
                <option value="All India">All India / Central Focus</option>
                <option value="Karnataka">Karnataka (KPSC, KEA)</option>
                <option value="Maharashtra">Maharashtra (MPSC)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (UPPSC, UPSSSC)</option>
                <option value="Andhra Pradesh">Andhra Pradesh (APPSC)</option>
                <option value="Telangana">Telangana (TGPSC)</option>
                <option value="Kerala">Kerala (Kerala PSC)</option>
                <option value="West Bengal">West Bengal (WBPSC)</option>
                <option value="Rajasthan">Rajasthan (RPSC)</option>
              </select>
            </div>

            {/* Preparation Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Current Preparation Stage
              </label>
              <select
                value={formData.preparation_level}
                onChange={(e) => setFormData({ ...formData, preparation_level: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="beginner">Beginner (Starting Foundation)</option>
                <option value="intermediate">Intermediate (Partially Covered Syllabus)</option>
                <option value="advanced">Advanced (Targeting Top Rank & Test Drills)</option>
              </select>
            </div>

            {/* Weekday Hours */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Weekday Available Hours (Per Day)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="14"
                value={formData.daily_hours_weekday}
                onChange={(e) => setFormData({ ...formData, daily_hours_weekday: parseFloat(e.target.value) || 2 })}
                style={{ width: '100%' }}
              />
            </div>

            {/* Weekend Hours */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Weekend Available Hours (Per Day)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={formData.daily_hours_weekend}
                onChange={(e) => setFormData({ ...formData, daily_hours_weekend: parseFloat(e.target.value) || 4 })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.7rem 1.75rem' }}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile & Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
