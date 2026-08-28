import React, { useState, useEffect } from 'react';
import {
  Search, Compass, Calendar, CalendarDays, Sparkles, Scale,
  CheckCircle2, Briefcase, Building, ArrowRight, Clock, ChevronRight,
  ExternalLink, TrendingUp, ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function LandingPage({ onNavigateToTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularExams, setPopularExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 8 Feature Cards Definition matching specification
  const featureCards = [
    {
      id: 'explore',
      title: 'Browse Exams',
      desc: 'Explore government exams across UPSC, SSC, Banking, Railways, Defence, State PSC, Teaching, Technical and more.',
      cta: 'Explore Exams →',
      icon: Compass,
      color: 'var(--brand-primary)',
      bg: 'var(--brand-light)'
    },
    {
      id: 'upcoming',
      title: 'Upcoming Exams',
      desc: 'See upcoming notifications, application deadlines and exam dates sorted by nearest timeline.',
      cta: 'View Upcoming →',
      icon: Calendar,
      color: '#f59e0b',
      bg: '#fef3c7'
    },
    {
      id: 'calendar',
      title: 'Exam Calendar',
      desc: 'Track government exam notifications, applications, exams, admit cards and results in one timeline.',
      cta: 'Open Calendar →',
      icon: CalendarDays,
      color: 'var(--accent-teal)',
      bg: 'rgba(13, 148, 136, 0.1)'
    },
    {
      id: 'finder',
      title: 'AI Exam Finder',
      desc: 'Tell us your qualification, age, interests and career goals. Get personalized government exam recommendations.',
      cta: 'Find My Exams →',
      icon: Sparkles,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)'
    },
    {
      id: 'compare',
      title: 'Compare Exams',
      desc: 'Compare eligibility, salary, syllabus, difficulty, selection process and career growth side-by-side.',
      cta: 'Compare Exams →',
      icon: Scale,
      color: 'var(--accent-indigo)',
      bg: 'rgba(99, 102, 241, 0.1)'
    },
    {
      id: 'eligibility',
      title: 'Eligibility Checker',
      desc: 'Quickly check which government exams you are eligible for based on your academic profile and age.',
      cta: 'Check Eligibility →',
      icon: CheckCircle2,
      color: 'var(--success)',
      bg: 'var(--success-light)'
    },
    {
      id: 'careers',
      title: 'Career Paths',
      desc: 'Explore government career opportunities by role, department, qualification and career growth.',
      cta: 'Explore Careers →',
      icon: Briefcase,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)'
    },
    {
      id: 'organizations',
      title: 'Organizations',
      desc: 'Explore recruiting organizations such as UPSC, SSC, RRB, IBPS, RBI, State PSCs, ISRO, DRDO and more.',
      cta: 'Explore Organizations →',
      icon: Building,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.1)'
    }
  ];

  useEffect(() => {
    fetchPopularExams();
  }, []);

  const fetchPopularExams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/discovery/exams?limit=6&sortBy=popularity');
      if (res.success) {
        setPopularExams((res.data || []).slice(0, 6));
      }
    } catch (e) {
      console.error('Error loading popular exams:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigateToTab) {
      onNavigateToTab('explore');
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem 3.5rem 1.5rem' }}>
      {/* SECTION 1: HERO + SEARCH */}
      <section style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4.5vw, 3rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          margin: '0 0 0.75rem 0'
        }}>
          Discover Your Government Exam
        </h1>
        <p style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.5
        }}>
          Find the right exam, explore opportunities, compare careers, and plan your path.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.5rem 0.45rem 1.25rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
            border: '1px solid var(--border-subtle)',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search exams, jobs, organizations (e.g. UPSC CSE, SSC CGL, TNPSC, ISRO)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '0.95rem',
              color: 'var(--text-primary)'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.4rem' }}>
            <span>Search</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </section>

      {/* SECTION 2: EXPLORE YOUR PATH (4x2 DESKTOP GRID) */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Explore Your Path
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
              Select a dedicated discovery tool to find and compare government exams.
            </p>
          </div>
        </div>

        {/* 4x2 Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.25rem'
        }}>
          {featureCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigateToTab && onNavigateToTab(card.id)}
                className="card"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s'
                }}
              >
                <div>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: card.bg,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: card.color,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginTop: '1.25rem'
                }}>
                  <span>{card.cta}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: POPULAR RIGHT NOW (COMPACT 4-6 CARDS) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Popular Right Now
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
              High-demand recruitments currently trending among candidates.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('explore')}
            className="btn btn-secondary btn-sm"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem'
        }}>
          {popularExams.map(exam => (
            <div
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className="card"
              style={{
                padding: '1.15rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'border-color 0.15s, transform 0.15s'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{exam.code}</span>
                  <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{exam.category}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {exam.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {exam.organization} • <strong style={{ color: 'var(--success)' }}>{exam.in_hand_salary ? exam.in_hand_salary.split('/')[0] : `₹${exam.salary_min}+`}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className={`badge ${exam.status === 'Ongoing' ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.72rem' }}>
                  {exam.status || 'Upcoming'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: COMPACT AI MATCH CTA */}
      <section style={{
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.09) 0%, rgba(139, 92, 246, 0.09) 100%)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--brand-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Not sure which exam is right for you?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Let AI find government exams that match your qualification, age, degree, and salary expectations.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab && onNavigateToTab('finder')}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.35rem' }}
        >
          <span>Find My Exam →</span>
        </button>
      </section>

      {/* Exam Details Modal */}
      {selectedExamId && (
        <ExamDetailsModal
          examId={selectedExamId}
          onClose={() => setSelectedExamId(null)}
          onSelectRoadmap={() => {
            setSelectedExamId(null);
            if (onNavigateToTab) onNavigateToTab('preparation');
          }}
        />
      )}
    </div>
  );
}
