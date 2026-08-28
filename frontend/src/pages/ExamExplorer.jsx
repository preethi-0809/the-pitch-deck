import React, { useState, useEffect } from 'react';
import {
  Search, Filter, SlidersHorizontal, ArrowUpDown, Calendar, DollarSign,
  GraduationCap, MapPin, CheckCircle2, Bookmark, Target, ExternalLink,
  ChevronRight, Sparkles, Scale, RefreshCw, X, ShieldAlert
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function ExamExplorer({ setActiveTab, onOpenCompareWithExam }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedQualification, setSelectedQualification] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [userAge, setUserAge] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'salary' | 'date' | 'name'

  // Comparison State
  const [compareIds, setCompareIds] = useState([]);
  const [savedExamIds, setSavedExamIds] = useState(new Set());
  const [targetExamIds, setTargetExamIds] = useState(new Set());
  const [toastMsg, setToastMsg] = useState('');

  const categories = [
    'All', 'UPSC', 'SSC', 'Railways', 'Banking', 'Defence',
    'State PSC', 'Teaching', 'Technical', 'Insurance', 'Judiciary', 'Healthcare'
  ];

  const qualifications = [
    'All', '10th', '12th', 'Diploma', 'Any Degree', 'B.E/B.Tech', 'Postgraduate', 'Law', 'Healthcare'
  ];

  const states = [
    'All India', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Uttar Pradesh',
    'Bihar', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Odisha'
  ];

  useEffect(() => {
    fetchExams();
    fetchUserSavedAndTargets();
  }, [selectedCategory, selectedQualification, selectedState, selectedStatus, selectedDifficulty, selectedJobType, sortBy]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = {
        q: searchQuery,
        category: selectedCategory,
        qualification: selectedQualification,
        state: selectedState,
        status: selectedStatus,
        difficulty: selectedDifficulty,
        job_type: selectedJobType,
        age: userAge || null,
        salary_min: minSalary || null,
        sortBy
      };
      const res = await api.get(`/discovery/exams?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== null && v !== ''))}`);
      if (res.success) {
        setExams(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSavedAndTargets = async () => {
    try {
      const [savedRes, targetRes] = await Promise.all([
        api.get('/discovery/saved').catch(() => ({ data: [] })),
        api.get('/discovery/targets').catch(() => ({ data: [] }))
      ]);
      if (savedRes.data) setSavedExamIds(new Set(savedRes.data.map(e => e.id)));
      if (targetRes.data) setTargetExamIds(new Set(targetRes.data.map(e => e.id)));
    } catch (e) {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExams();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedQualification('All');
    setSelectedState('All India');
    setSelectedStatus('All');
    setSelectedDifficulty('All');
    setSelectedJobType('All');
    setUserAge('');
    setMinSalary('');
    setSortBy('popularity');
  };

  const handleToggleSaved = async (examId) => {
    try {
      const res = await api.post('/discovery/saved/toggle', { examId });
      const next = new Set(savedExamIds);
      if (res.saved) {
        next.add(examId);
        showToast('Saved to bookmarks');
      } else {
        next.delete(examId);
        showToast('Removed from bookmarks');
      }
      setSavedExamIds(next);
    } catch (err) {
      showToast('Bookmark updated');
    }
  };

  const handleToggleTarget = async (examId) => {
    try {
      const res = await api.post('/discovery/targets/toggle', { examId, priority: 'primary' });
      const next = new Set(targetExamIds);
      if (res.targeted) {
        next.add(examId);
        showToast('Added to your target preparation exams');
      } else {
        next.delete(examId);
        showToast('Removed from target exams');
      }
      setTargetExamIds(next);
    } catch (err) {
      showToast('Target updated');
    }
  };

  const handleToggleCompare = (examId) => {
    if (compareIds.includes(examId)) {
      setCompareIds(compareIds.filter(id => id !== examId));
    } else {
      if (compareIds.length >= 4) {
        showToast('You can compare up to 4 exams at a time');
        return;
      }
      setCompareIds([...compareIds, examId]);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 10000,
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--text-primary)',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} color="var(--success)" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">Centralized Directory</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>49+ Verified Examinations</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Explore All Government Exams
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
            Filter by qualification, age limit, salary level, and state to discover eligible recruitment opportunities.
          </p>
        </div>

        {compareIds.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-light)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Scale size={16} color="var(--brand-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
              {compareIds.length} Exam{compareIds.length === 1 ? '' : 's'} Selected
            </span>
            <button
              onClick={() => {
                if (onOpenCompareWithExam) {
                  onOpenCompareWithExam(compareIds);
                } else if (setActiveTab) {
                  setActiveTab('compare');
                }
              }}
              className="btn btn-primary btn-sm"
            >
              Compare Now →
            </button>
            <button
              onClick={() => setCompareIds([])}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Filter Bar & Global Search */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by exam name (e.g. UPSC CSE, SSC CGL), organization, or job role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.75rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1rem' }}
            title="Reset Filters"
          >
            <RefreshCw size={15} />
            <span>Reset</span>
          </button>
        </form>

        {/* Quick Category Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.4rem', whiteSpace: 'nowrap' }}>
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: selectedCategory === cat ? 700 : 500,
                backgroundColor: selectedCategory === cat ? 'var(--brand-primary)' : 'var(--bg-primary)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedCategory === cat ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deep Facet Filters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Qualification
            </label>
            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.82rem' }}
            >
              {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              State / Domicile
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.82rem' }}
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.82rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Application Open / Ongoing</option>
              <option value="Upcoming">Upcoming Cycles</option>
              <option value="Completed">Completed / Results Declared</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Job Type
            </label>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.82rem' }}
            >
              <option value="All">All Job Types</option>
              <option value="Administrative">Administrative</option>
              <option value="Non-Technical">Non-Technical / Desk</option>
              <option value="Technical">Technical / Engineering</option>
              <option value="Uniformed / Defence">Uniformed / Defence</option>
              <option value="Police">Police / Uniformed SI</option>
              <option value="Teaching">Teaching / Academic</option>
              <option value="Judicial">Judiciary / Legal</option>
              <option value="Medical">Healthcare / Nursing</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.82rem' }}
            >
              <option value="popularity">Most Popular / Featured</option>
              <option value="salary">Highest Salary First</option>
              <option value="date">Upcoming Deadline</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div>
          Showing <strong>{exams.length}</strong> government examination{exams.length === 1 ? '' : 's'} matching your filters
        </div>
      </div>

      {/* Modern Exam Cards Grid */}
      {loading ? (
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
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading examinations...</div>
        </div>
      ) : exams.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <ShieldAlert size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No examinations found
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Try broadening your qualification, state, or category filters to see more results.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {exams.map(exam => {
            const isSaved = savedExamIds.has(exam.id);
            const isTarget = targetExamIds.has(exam.id);
            const isCompared = compareIds.includes(exam.id);

            return (
              <div
                key={exam.id}
                className="card"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  border: isTarget ? '1px solid var(--brand-primary)' : isCompared ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  boxShadow: isTarget ? '0 4px 14px rgba(37, 99, 235, 0.12)' : undefined,
                  position: 'relative'
                }}
              >
                {/* Top Badges & Actions */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{exam.code}</span>
                      <span className="badge badge-secondary">{exam.category}</span>
                      {exam.state && exam.state !== 'All India' && (
                        <span className="badge badge-success">📍 {exam.state}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleToggleCompare(exam.id)}
                        style={{
                          padding: '0.3rem 0.5rem',
                          borderRadius: '6px',
                          border: `1px solid ${isCompared ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                          backgroundColor: isCompared ? 'var(--brand-light)' : 'var(--bg-primary)',
                          color: isCompared ? 'var(--brand-primary)' : 'var(--text-muted)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        title="Add to side-by-side comparison"
                      >
                        <Scale size={12} />
                        <span>{isCompared ? 'Selected' : 'Compare'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleSaved(exam.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-primary)',
                          color: isSaved ? 'var(--brand-primary)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title={isSaved ? 'Bookmarked' : 'Bookmark Exam'}
                      >
                        <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <h3
                    onClick={() => setSelectedExamId(exam.id)}
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      lineHeight: 1.35,
                      marginBottom: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    {exam.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    {exam.organization}
                  </div>

                  {/* Key Metadata Matrix */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    marginBottom: '1rem',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Qualification</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{exam.qualification}</div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Age Limit</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{exam.age_min}–{exam.age_max} Yrs</div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Salary (In-Hand)</div>
                      <div style={{ fontWeight: 800, color: 'var(--success)', marginTop: '0.1rem' }}>
                        {exam.in_hand_salary ? exam.in_hand_salary.split('/')[0] : `₹${exam.salary_min.toLocaleString()}+`}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Exam Date</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                        {exam.exam_date ? exam.exam_date : 'Announced Soon'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div>
                  {exam.countdown_label && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: exam.is_urgent ? 'var(--danger)' : 'var(--brand-primary)',
                      marginBottom: '0.75rem'
                    }}>
                      <Calendar size={13} />
                      <span>{exam.countdown_label}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => setSelectedExamId(exam.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>

                    <button
                      onClick={() => handleToggleTarget(exam.id)}
                      className={`btn btn-sm ${isTarget ? 'btn-success' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      title="Set as Target Exam"
                    >
                      <Target size={14} />
                      <span>{isTarget ? 'Target Set' : 'Set Target'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Details Modal Popup */}
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
