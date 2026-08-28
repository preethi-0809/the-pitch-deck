import React, { useState, useEffect } from 'react';
import {
  Bell, Mail, Send, CheckCircle2, ShieldCheck, Clock, AlertTriangle,
  Calendar, Award, Newspaper, ExternalLink, Check, RefreshCw, Filter,
  Settings, Layers, ChevronRight, Bookmark, Globe, Sparkles, AlertCircle,
  ToggleLeft, ToggleRight, CheckSquare, Square, BarChart3, Activity
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Notifications({ setActiveTab, onSelectExam }) {
  const { user } = useAuth();

  // Active Main View: 'center' | 'settings' | 'logs' | 'admin'
  const [activeView, setActiveView] = useState('center');

  // In-App Notification Center State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All' | 'Applications Opened' | 'Deadlines' | 'Admit Cards' | 'Exam Reminders' | 'Results' | 'Current Affairs'
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  // Email Preferences State
  const [preferences, setPreferences] = useState({
    application_open_notifications: 1,
    deadline_notifications: 1,
    exam_date_notifications: 1,
    exam_day_notifications: 1,
    admit_card_notifications: 1,
    result_notifications: 1,
    recommended_notifications: 1,
    current_affairs_notifications: 1,
    preferred_state: 'Tamil Nadu',
    preferred_language: 'en'
  });
  const [examAlerts, setExamAlerts] = useState([]);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState('');

  // Test Email Trigger State
  const [selectedTestType, setSelectedTestType] = useState('deadline'); // 'application_open' | 'deadline' | 'deadline_1_day' | 'admit_card' | 'exam_date' | 'exam_day' | 'result' | 'current_affairs'
  const [selectedTestLang, setSelectedTestLang] = useState('en'); // 'en' | 'ta' | 'hi'
  const [sendingTest, setSendingTest] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // Email Delivery Logs & Admin Stats State
  const [emailLogs, setEmailLogs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    loadInAppNotifications();
    loadPreferencesAndLogs();
  }, [selectedFilter]);

  // 1. Load In-App Notifications
  const loadInAppNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const res = await api.get(`/notifications?type=${encodeURIComponent(selectedFilter)}`);
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unread_count || 0);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // 2. Load Email Preferences, Exam Subscriptions, and Audit Logs
  const loadPreferencesAndLogs = async () => {
    try {
      setLoadingLogs(true);
      const [prefRes, adminRes] = await Promise.all([
        api.get('/notifications/preferences').catch(() => ({ success: false })),
        api.get('/notifications/admin-stats').catch(() => ({ success: false }))
      ]);

      if (prefRes?.success) {
        if (prefRes.preferences) setPreferences(prefRes.preferences);
        if (prefRes.logs) setEmailLogs(prefRes.logs);
        if (prefRes.examAlerts) setExamAlerts(prefRes.examAlerts);
      }
      if (adminRes?.success) {
        setAdminStats(adminRes);
      }
    } catch (e) {
      console.error('Failed to load preferences:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  // 3. Mark Notification Read
  const handleMarkRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (e) {}
  };

  // 4. Mark All Read
  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  // 5. Save Email Preferences
  const handleSavePreferences = async (e) => {
    e?.preventDefault();
    try {
      setSavingPrefs(true);
      setPrefsMessage('');
      const res = await api.put('/notifications/preferences', preferences);
      if (res.success) {
        setPrefsMessage('Notification settings and language preferences saved successfully!');
        if (res.preferences) setPreferences(res.preferences);
      }
    } catch (e) {
      console.error('Failed to save preferences:', e);
      setPrefsMessage('Failed to save preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  // 6. Bulk Toggle All Preferences
  const handleBulkTogglePreferences = (enableAll) => {
    const val = enableAll ? 1 : 0;
    setPreferences(prev => ({
      ...prev,
      application_open_notifications: val,
      deadline_notifications: val,
      exam_date_notifications: val,
      exam_day_notifications: val,
      admit_card_notifications: val,
      result_notifications: val,
      recommended_notifications: val,
      current_affairs_notifications: val
    }));
  };

  // 7. Toggle Per-Exam Alert Subscription
  const handleToggleExamAlert = async (examId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await api.post('/notifications/exam-alerts/toggle', { examId, isEnabled: newStatus });
      if (res.success) {
        setExamAlerts(prev => {
          const exists = prev.find(a => a.exam_id === examId);
          if (exists) {
            return prev.map(a => a.exam_id === examId ? { ...a, is_enabled: newStatus } : a);
          } else {
            return [...prev, { exam_id: examId, is_enabled: newStatus }];
          }
        });
      }
    } catch (e) {
      console.error('Failed to toggle exam alert:', e);
    }
  };

  // 8. Trigger Real Test Email
  const handleSendTestEmail = async () => {
    try {
      setSendingTest(true);
      setTestMessage('');
      const res = await api.post('/notifications/send-test', {
        alertType: selectedTestType,
        language: selectedTestLang
      });
      if (res.success) {
        setTestMessage(res.message);
        if (res.logs) setEmailLogs(res.logs);
      } else {
        setTestMessage('Failed to dispatch test notification.');
      }
    } catch (e) {
      console.error('Failed to send test email:', e);
      setTestMessage('Error dispatching test email.');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="page-body">
      {/* Header with View Tabs */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Recruitment Alerts & Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="badge badge-primary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                {unreadCount} New
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem', marginBottom: 0 }}>
            Automated event-driven alerts for applications, deadlines, hall tickets, exam days, and results.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-primary)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveView('center')}
            className={`btn btn-sm ${activeView === 'center' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Bell size={15} />
            <span>Notification Center</span>
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`btn btn-sm ${activeView === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Settings size={15} />
            <span>Email Preferences</span>
          </button>
          <button
            onClick={() => setActiveView('logs')}
            className={`btn btn-sm ${activeView === 'logs' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Mail size={15} />
            <span>Delivery Logs ({emailLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`btn btn-sm ${activeView === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Activity size={15} />
            <span>Engine Overview</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: IN-APP NOTIFICATION CENTER */}
      {activeView === 'center' && (
        <div>
          {/* Filters Bar & Mark All as Read */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['All', 'Applications Opened', 'Deadlines', 'Admit Cards', 'Exam Reminders', 'Results', 'Current Affairs'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`btn btn-sm ${selectedFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                <Check size={14} />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          {loadingNotifs ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ width: '30px', height: '30px', border: '3px solid var(--brand-light)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Bell size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
                No Notifications Found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
                You are all caught up! New recruitment announcements, deadline alerts, and admit card releases will appear here automatically.
              </p>
              <button onClick={() => setActiveTab('explore')} className="btn btn-primary btn-sm">
                Explore Available Exams
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {notifications.map(n => {
                const isUrgent = n.urgency === 'urgent' || n.urgency === 'critical' || n.notification_type?.includes('1_day') || n.notification_type === 'exam_day';
                return (
                  <div
                    key={n.id}
                    className="card"
                    style={{
                      padding: '1.15rem 1.35rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      borderLeft: `4px solid ${isUrgent ? 'var(--danger)' : n.is_read ? 'var(--border-subtle)' : 'var(--brand-primary)'}`,
                      backgroundColor: n.is_read ? 'var(--bg-surface)' : 'rgba(37, 99, 235, 0.03)'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        {isUrgent ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>🚨 URGENT</span>
                        ) : (
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            {n.notification_type?.replace(/_/g, ' ').toUpperCase() || 'ALERT'}
                          </span>
                        )}
                        {n.exam_code && (
                          <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{n.exam_code}</span>
                        )}
                        {!n.is_read && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
                        )}
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.3rem 0' }}>
                        {n.title}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 0.65rem 0', lineHeight: 1.5 }}>
                        {n.message}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>{n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}</span>
                        {n.organization && <span>• {n.organization}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                      {n.action_url && (
                        <a
                          href={n.action_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                        >
                          <span>Official Portal</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {n.exam_id && (
                        <button
                          onClick={() => onSelectExam ? onSelectExam(n.exam_id) : setActiveTab('explore')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        >
                          Exam Details
                        </button>
                      )}
                      {!n.is_read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: EMAIL NOTIFICATION PREFERENCES (SETTINGS -> NOTIFICATIONS) */}
      {activeView === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Preference Form */}
          <div className="card" style={{ padding: '1.75rem' }}>
            {/* Account Email Header */}
            <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Registered Delivery Email
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={12} />
                Verified
              </span>
            </div>

            {prefsMessage && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: prefsMessage.includes('Failed') ? 'var(--danger-light)' : 'var(--success-light)',
                color: prefsMessage.includes('Failed') ? 'var(--danger)' : 'var(--success)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{prefsMessage}</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences}>
              {/* Quick Bulk Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Email Alert Channels
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleBulkTogglePreferences(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    <CheckSquare size={13} />
                    <span>Enable All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkTogglePreferences(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    <Square size={13} />
                    <span>Disable All</span>
                  </button>
                </div>
              </div>

              {/* Notification Channel Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  {
                    key: 'application_open_notifications',
                    title: '📢 Application Opened',
                    desc: 'Instant email alert when online application submission opens for shortlisted exams.'
                  },
                  {
                    key: 'deadline_notifications',
                    title: '⏰ Application Deadline Reminders',
                    desc: 'Countdown emails 7 days, 3 days, and 1 day before registration closes.'
                  },
                  {
                    key: 'exam_date_notifications',
                    title: '📅 Exam Date Reminders',
                    desc: 'Exam preparation alerts 7 days and 1 day before the scheduled CBT / written test.'
                  },
                  {
                    key: 'exam_day_notifications',
                    title: '🎯 Exam Day Alert',
                    desc: 'Day-of-exam motivation, test shift timings, and reporting rules.'
                  },
                  {
                    key: 'admit_card_notifications',
                    title: '🎫 Admit Card & Hall Ticket Release',
                    desc: 'Direct official link as soon as hall tickets are available for download.'
                  },
                  {
                    key: 'result_notifications',
                    title: '🏆 Exam Result & Merit List Announcement',
                    desc: 'Immediate scorecard and cutoff notification when results are published.'
                  },
                  {
                    key: 'recommended_notifications',
                    title: '🎯 Recommended Exams',
                    desc: 'New opportunities matched with your qualification, degree, and state.'
                  },
                  {
                    key: 'current_affairs_notifications',
                    title: '📰 Daily RAG Current Affairs Digest',
                    desc: 'Curated 5-item summary verified from PIB, RBI, and ministries.'
                  }
                ].map(item => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        {item.desc}
                      </div>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        checked={preferences[item.key] === 1}
                        onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked ? 1 : 0 })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: preferences[item.key] === 1 ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        borderRadius: '24px', transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '18px', width: '18px', left: preferences[item.key] === 1 ? '20px' : '3px', bottom: '3px',
                          backgroundColor: 'white', borderRadius: '50%', transition: '0.3s'
                        }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              {/* State & Language Preferences */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Email Language
                  </label>
                  <select
                    value={preferences.preferred_language || 'en'}
                    onChange={(e) => setPreferences({ ...preferences, preferred_language: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="en">English (Official Standard)</option>
                    <option value="ta">தமிழ் (Tamil Localized)</option>
                    <option value="hi">हिंदी (Hindi Localized)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Priority State Recruitment
                  </label>
                  <select
                    value={preferences.preferred_state || 'Tamil Nadu'}
                    onChange={(e) => setPreferences({ ...preferences, preferred_state: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Tamil Nadu">Tamil Nadu (TNPSC, TRB, TNUSRB)</option>
                    <option value="All India">All India / Central Only</option>
                    <option value="Karnataka">Karnataka (KPSC, KEA)</option>
                    <option value="Maharashtra">Maharashtra (MPSC)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (UPPSC)</option>
                    <option value="Andhra Pradesh">Andhra Pradesh (APPSC)</option>
                    <option value="Kerala">Kerala (Kerala PSC)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPrefs}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
              >
                <span>{savingPrefs ? 'Saving Preferences...' : 'Save Notification Preferences'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Per-Exam Alerts & Live Test Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Live Test Notification Tool */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--brand-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Send Real Test Alert to My Email
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '0 0 1rem 0' }}>
                Test the transactional email dispatcher instantly with any lifecycle stage.
              </p>

              {testMessage && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: testMessage.includes('Failed') ? 'var(--danger-light)' : 'var(--success-light)',
                  color: testMessage.includes('Failed') ? 'var(--danger)' : 'var(--success)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{testMessage}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Alert Lifecycle Event
                  </label>
                  <select
                    value={selectedTestType}
                    onChange={(e) => setSelectedTestType(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    <option value="application_open">📢 Applications Opened (New Exam)</option>
                    <option value="deadline">⏰ Application Deadline in 3 Days</option>
                    <option value="deadline_1_day">🚨 Application Closes Tomorrow</option>
                    <option value="admit_card">🎫 Admit Card / Hall Ticket Available</option>
                    <option value="exam_date">📅 Exam Is in 7 Days</option>
                    <option value="exam_day">🎯 Exam Is Today (Day of Exam)</option>
                    <option value="result">📢 Exam Result & Cutoff Released</option>
                    <option value="current_affairs">⚡ Daily Verified RAG Digest</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Template Language
                  </label>
                  <select
                    value={selectedTestLang}
                    onChange={(e) => setSelectedTestLang(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    <option value="en">English (Default)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTest}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', padding: '0.65rem', justifyContent: 'center', marginTop: '0.25rem' }}
                >
                  <Send size={14} />
                  <span>{sendingTest ? 'Dispatching to Inbox...' : `Send Test Alert to ${user?.email}`}</span>
                </button>
              </div>
            </div>

            {/* Individual Exam Alerts Manager */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={16} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Per-Exam Email Alert Subscriptions
                  </h3>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 1rem 0' }}>
                You can explicitly mute or activate email alerts for specific examinations.
              </p>

              {examAlerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Shortlist exams from the <button onClick={() => setActiveTab('explore')} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}>Exam Explorer</button> to manage custom per-exam alert subscriptions.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {examAlerts.map(alert => (
                    <div
                      key={alert.exam_id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {alert.name || alert.exam_id}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          {alert.organization || 'Commission'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleExamAlert(alert.exam_id, alert.is_enabled)}
                        className={`btn btn-sm ${alert.is_enabled ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                      >
                        🔔 {alert.is_enabled ? 'Alerts ON' : 'Muted'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: REAL-TIME DELIVERY AUDIT LOGS */}
      {activeView === 'logs' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.2rem 0' }}>
                Email Delivery History & Audit Trail
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>
                Verifiable logs of transactional emails dispatched to your registered address.
              </p>
            </div>
            <button
              onClick={loadPreferencesAndLogs}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <RefreshCw size={13} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {loadingLogs ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
              Loading delivery logs...
            </div>
          ) : emailLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Mail size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>No Email Alerts Dispatched Yet</div>
              <p style={{ fontSize: '0.82rem', margin: '0.35rem 0 1rem 0' }}>Trigger a test alert or wait for the scheduled engine to dispatch upcoming deadline notices.</p>
              <button onClick={() => setActiveView('settings')} className="btn btn-primary btn-sm">
                Send Test Alert
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Sent At (IST)</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Recipient</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Event Type</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Subject</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Language</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                        {log.sent_at ? new Date(log.sent_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Recent'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {log.recipient_email}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                          {log.event_type}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {log.subject}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {log.language || 'EN'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${log.status === 'sent' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                          {log.status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: ADMIN ENGINE STATS & LIFECYCLE TIMELINE */}
      {activeView === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--brand-primary)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Today's Dispatches</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {adminStats?.today_sent || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.2rem', fontWeight: 600 }}>
                Active Scheduler Running
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Subscribers</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {adminStats?.total_subscribers || 1}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Real Registered Accounts
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Scheduler Frequency</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                Every 30 Mins
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Automated IST Cycle
              </div>
            </div>
          </div>

          {/* Lifecycle Event Timeline Breakdown */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.85rem 0' }}>
              Automated Notification Timeline Matrix
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '0 0 1.25rem 0' }}>
              How the event-driven scheduler maps verified commission dates to automated email dispatch windows:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {[
                { stage: '1. Application Opened', event: 'APPLICATION_OPEN', desc: 'When application_start = today' },
                { stage: '2. 7-Day Deadline', event: 'DEADLINE_7_DAYS', desc: 'application_end - 7 days' },
                { stage: '3. 3-Day Deadline', event: 'DEADLINE_3_DAYS', desc: 'application_end - 3 days' },
                { stage: '4. Final 24h Deadline', event: 'DEADLINE_1_DAY', desc: 'application_end - 1 day' },
                { stage: '5. Application Closed', event: 'APPLICATION_CLOSED', desc: 'Marks status as Closed' },
                { stage: '6. Admit Card Live', event: 'ADMIT_CARD_RELEASED', desc: 'When admit_card_date = today' },
                { stage: '7. 7-Day Exam Alert', event: 'EXAM_7_DAYS', desc: 'exam_date - 7 days' },
                { stage: '8. 1-Day Exam Alert', event: 'EXAM_1_DAY', desc: 'exam_date - 1 day' },
                { stage: '9. Exam Day Today', event: 'EXAM_DAY', desc: 'exam_date = today' },
                { stage: '10. Result Declared', event: 'RESULT_RELEASED', desc: 'result_date = today' }
              ].map(s => (
                <div key={s.event} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.stage}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 700, margin: '0.2rem 0' }}><code>{s.event}</code></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
