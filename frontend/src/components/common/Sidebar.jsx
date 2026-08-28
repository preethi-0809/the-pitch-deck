import React from 'react';
import {
  LayoutDashboard,
  Compass,
  CalendarDays,
  Calendar,
  Scale,
  Sparkles,
  BookOpen,
  FileText,
  RotateCcw,
  Award,
  HelpCircle,
  Newspaper,
  BarChart3,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  Target,
  ChevronRight,
  Brain,
  Home,
  Briefcase,
  Building,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const navSections = [
    {
      title: 'DISCOVERY SUITE',
      items: [
        { id: 'home', label: 'Discovery Home', icon: Home },
        { id: 'explore', label: 'Browse Exams', icon: Compass },
        { id: 'upcoming', label: 'Upcoming Exams', icon: Calendar },
        { id: 'calendar', label: 'Exam Calendar', icon: CalendarDays },
        { id: 'finder', label: 'AI Exam Finder', icon: Sparkles },
        { id: 'compare', label: 'Compare Exams', icon: Scale },
        { id: 'eligibility', label: 'Eligibility Checker', icon: CheckCircle2 },
        { id: 'careers', label: 'Career Paths', icon: Briefcase },
        { id: 'organizations', label: 'Organizations', icon: Building }
      ]
    },
    {
      title: 'ASPIRANT OPERATING SYSTEM',
      items: [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { id: 'preparation', label: 'Study Roadmaps', icon: Layers },
        { id: 'study-plan', label: 'Daily Study Plan', icon: CalendarDays },
        { id: 'materials', label: 'Syllabus & Notes', icon: BookOpen },
        { id: 'revision', label: 'Smart Revision', icon: RotateCcw }
      ]
    },
    {
      title: 'PRACTICE & TESTS',
      items: [
        { id: 'tests', label: 'Adaptive Mock Tests', icon: Award },
        { id: 'pyqs', label: 'PYQ Question Bank', icon: FileText },
        { id: 'questions', label: 'Question Generator', icon: Sparkles }
      ]
    },
    {
      title: 'AI COACH & ANALYTICS',
      items: [
        { id: 'coach', label: 'AI Exam Coach', icon: Brain },
        { id: 'tutor', label: 'AI Doubt Solver', icon: HelpCircle },
        { id: 'performance', label: 'Weakness Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'UPDATES & SETTINGS',
      items: [
        { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper },
        { id: 'notifications', label: 'Alerts & Reminders', icon: Bell },
        { id: 'profile', label: 'Aspirant Profile', icon: User }
      ]
    }
  ];

  if (user && user.role === 'admin') {
    navSections.push({
      title: 'ADMINISTRATION',
      items: [
        { id: 'admin', label: 'Admin Management', icon: ShieldCheck }
      ]
    });
  }

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div
        onClick={() => setActiveTab('home')}
        style={{
          padding: '1.25rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)'
        }}>
          <Target size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Pitch Deck
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-sidebar-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            GOVT EXAM OS
          </div>
        </div>
      </div>

      {/* Navigation Sections with Dedicated Separate Scrollbar */}
      <div className="sidebar-nav-scroll">
        {navSections.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '1.15rem' }}>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              color: 'var(--text-sidebar-muted)',
              padding: '0 0.75rem 0.35rem 0.75rem',
              letterSpacing: '0.08em'
            }}>
              {sec.title}
            </div>
            {sec.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.52rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-sidebar)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.84rem',
                    marginBottom: '0.12rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={16} color={isActive ? '#ffffff' : '#94a3b8'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={13} color="#ffffff" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Footer Profile */}
      {user ? (
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              flexShrink: 0
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {user?.name || 'Candidate'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-sidebar-muted)', textTransform: 'capitalize' }}>
                {user?.profile?.user_type?.replace('_', ' ') || 'Aspirant'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            style={{
              color: 'var(--text-sidebar-muted)',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-sidebar-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={() => setActiveTab('login')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Sign In to Aspirant OS</span>
          </button>
        </div>
      )}
    </aside>
  );
}
