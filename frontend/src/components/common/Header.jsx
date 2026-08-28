import React, { useState, useEffect, useRef } from 'react';
import {
  Moon, Sun, Bell, Calendar, Sparkles, Clock, Search, Scale,
  BookOpen, ChevronDown, CheckCircle2, AlertCircle, ExternalLink,
  X, Compass, Briefcase, Building, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

export default function Header({ setActiveTab, onSelectExam }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Discovery Dropdown State
  const [showDiscoveryDropdown, setShowDiscoveryDropdown] = useState(false);
  const discoveryRef = useRef(null);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

  const discoveryLinks = [
    { id: 'explore', label: 'Browse Exams', desc: '49+ central & state recruitment catalog', icon: Compass },
    { id: 'upcoming', label: 'Upcoming Exams', desc: 'Deadlines & nearest exam dates', icon: Calendar },
    { id: 'calendar', label: 'Exam Calendar', desc: 'Full 12-month recruitment timeline', icon: Layers },
    { id: 'finder', label: 'AI Exam Finder', desc: '11-point personalized recommendation', icon: Sparkles },
    { id: 'compare', label: 'Compare Exams', desc: 'Side-by-side pay & syllabus matrix', icon: Scale },
    { id: 'eligibility', label: 'Eligibility Checker', desc: 'Instant qualification rule checker', icon: CheckCircle2 },
    { id: 'careers', label: 'Career Paths', desc: 'Explore government careers by role', icon: Briefcase },
    { id: 'organizations', label: 'Organizations', desc: 'UPSC, SSC, RRB, ISRO & State PSCs', icon: Building }
  ];

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (discoveryRef.current && !discoveryRef.current.contains(e.target)) {
        setShowDiscoveryDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get(`/discovery/exams?q=${encodeURIComponent(searchQuery)}&limit=6`);
        if (res.success) {
          setSearchResults(res.data || []);
          setShowSearchDropdown(true);
        }
      } catch (e) {
        // ignore
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/discovery/notifications');
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      gap: '1rem'
    }}>
      {/* Center/Left Global Autocomplete Search */}
      <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-full)',
          padding: '0.4rem 0.9rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search 49+ exams, jobs, syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              width: '100%',
              color: 'var(--text-primary)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
            zIndex: 100,
            overflow: 'hidden',
            maxHeight: '340px',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
              Matching Examinations ({searchResults.length})
            </div>
            {searchResults.map(exam => (
              <div
                key={exam.id}
                onClick={() => {
                  setShowSearchDropdown(false);
                  setSearchQuery('');
                  if (onSelectExam) onSelectExam(exam.id);
                  else if (setActiveTab) setActiveTab('explore');
                }}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>{exam.code}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{exam.name}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {exam.qualification} • {exam.organization}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)' }}>
                  {exam.in_hand_salary ? exam.in_hand_salary.split('/')[0] : `₹${exam.salary_min}+`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discovery Dropdown & Main Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Discovery ▾ Dropdown Menu */}
        <div ref={discoveryRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDiscoveryDropdown(!showDiscoveryDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: showDiscoveryDropdown ? 'var(--brand-light)' : 'transparent',
              color: showDiscoveryDropdown ? 'var(--brand-primary)' : 'var(--text-primary)',
              border: '1px solid transparent',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <span>Discovery</span>
            <ChevronDown size={14} style={{ transform: showDiscoveryDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {/* Clean Discovery Dropdown Menu */}
          {showDiscoveryDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '280px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.18)',
              zIndex: 100,
              padding: '0.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
              {discoveryLinks.map(link => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setShowDiscoveryDropdown(false);
                      setActiveTab(link.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Icon size={16} color="var(--brand-primary)" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {link.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {link.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Tabs */}
        <button
          onClick={() => setActiveTab('materials')}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'none',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          Syllabus & Notes
        </button>

        <button
          onClick={() => setActiveTab('current-affairs')}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'none',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          Current Affairs
        </button>

        <button
          onClick={() => setActiveTab('preparation')}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'none',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          Study Roadmaps
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'none',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          My Dashboard
        </button>
      </nav>

      {/* Right Actions & Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Notification Bell Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Recruitment Alerts"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '320px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Recruitment Deadlines & Alerts</span>
                <span className="badge badge-primary">{notifications.length} New</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: n.urgency === 'urgent' || n.urgency === 'critical' ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {n.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{n.message}</div>
                    {n.action_url && (
                      <a href={n.action_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
                        <span>Official Link</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ padding: '0.65rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
                <button
                  onClick={() => {
                    setShowNotifDropdown(false);
                    setActiveTab('notifications');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  View All Notifications & Preferences →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* User Profile Chip or Sign In */}
        {user ? (
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.name ? user.name.split(' ')[0] : 'Account'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className="btn btn-primary btn-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
