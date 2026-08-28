import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';

// Discovery Hub & Dedicated Feature Pages
import LandingPage from './pages/LandingPage';
import ExamExplorer from './pages/ExamExplorer';
import UpcomingExams from './pages/UpcomingExams';
import ExamCalendar from './pages/ExamCalendar';
import ExamFinder from './pages/ExamFinder';
import ExamCompare from './pages/ExamCompare';
import EligibilityChecker from './pages/EligibilityChecker';
import CareerPaths from './pages/CareerPaths';
import OrganizationsExplorer from './pages/OrganizationsExplorer';
import PreparationHub from './pages/PreparationHub';
import AIToolsHub from './pages/AIToolsHub';
import ExamDetailsModal from './components/discovery/ExamDetailsModal';

// Aspirant OS Suite
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyPlan from './pages/StudyPlan';
import StudyMaterials from './pages/StudyMaterials';
import QuestionGenerator from './pages/QuestionGenerator';
import MockTests from './pages/MockTests';
import PYQ from './pages/PYQ';
import Performance from './pages/Performance';
import Revision from './pages/Revision';
import CurrentAffairs from './pages/CurrentAffairs';
import AIExamCoach from './pages/AIExamCoach';
import AIDoubtSolver from './pages/AIDoubtSolver';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';

// Protected Tabs requiring authenticated session
const PROTECTED_TABS = [
  'dashboard', 'profile', 'notifications', 'preparation', 'performance',
  'study-plan', 'questions', 'tests', 'pyqs', 'revision', 'coach', 'tutor', 'admin'
];

// Helper: Map URL Path to Tab Identifier
function getTabFromPath(pathname, isAuthenticated = false) {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (clean === '/register') return 'register';
  if (clean === '/login') return 'login';
  if (clean === '/dashboard') return isAuthenticated ? 'dashboard' : 'login';
  if (clean === '/profile') return isAuthenticated ? 'profile' : 'login';
  if (clean === '/notifications') return isAuthenticated ? 'notifications' : 'login';
  if (clean === '/preparation') return isAuthenticated ? 'preparation' : 'login';
  if (clean === '/my-exams' || clean === '/saved-exams') return isAuthenticated ? 'dashboard' : 'login';
  if (clean === '/progress' || clean === '/performance') return isAuthenticated ? 'performance' : 'login';
  if (clean === '/study-plan') return isAuthenticated ? 'study-plan' : 'login';
  if (clean === '/questions') return isAuthenticated ? 'questions' : 'login';
  if (clean === '/tests') return isAuthenticated ? 'tests' : 'login';
  if (clean === '/pyqs') return isAuthenticated ? 'pyqs' : 'login';
  if (clean === '/revision') return isAuthenticated ? 'revision' : 'login';
  if (clean === '/coach') return isAuthenticated ? 'coach' : 'login';
  if (clean === '/tutor') return isAuthenticated ? 'tutor' : 'login';
  if (clean === '/admin') return isAuthenticated ? 'admin' : 'login';
  if (clean === '/discovery/exams' || clean === '/exams') return isAuthenticated ? 'explore' : 'login';
  if (clean === '/discovery/upcoming') return isAuthenticated ? 'upcoming' : 'login';
  if (clean === '/discovery/calendar') return isAuthenticated ? 'calendar' : 'login';
  if (clean === '/discovery/finder') return isAuthenticated ? 'finder' : 'login';
  if (clean === '/discovery/compare') return isAuthenticated ? 'compare' : 'login';
  if (clean === '/discovery/eligibility') return isAuthenticated ? 'eligibility' : 'login';
  if (clean === '/discovery/careers') return isAuthenticated ? 'careers' : 'login';
  if (clean === '/discovery/organizations') return isAuthenticated ? 'organizations' : 'login';
  if (clean === '/syllabus') return isAuthenticated ? 'materials' : 'login';
  if (clean === '/current-affairs') return isAuthenticated ? 'current-affairs' : 'login';
  if (clean === '/discovery' || clean === '/home') return isAuthenticated ? 'home' : 'login';
  if (clean === '/') {
    return isAuthenticated ? 'dashboard' : 'login';
  }
  return isAuthenticated ? 'dashboard' : 'login';
}

// Helper: Map Tab Identifier to URL Path
function getPathForTab(tab) {
  switch (tab) {
    case 'home': return '/discovery';
    case 'login': return '/login';
    case 'register': return '/register';
    case 'dashboard': return '/dashboard';
    case 'profile': return '/profile';
    case 'notifications': return '/notifications';
    case 'preparation': return '/preparation';
    case 'performance': return '/progress';
    case 'study-plan': return '/study-plan';
    case 'questions': return '/questions';
    case 'tests': return '/tests';
    case 'pyqs': return '/pyqs';
    case 'revision': return '/revision';
    case 'coach': return '/coach';
    case 'tutor': return '/tutor';
    case 'admin': return '/admin';
    case 'explore': return '/discovery/exams';
    case 'upcoming': return '/discovery/upcoming';
    case 'calendar': return '/discovery/calendar';
    case 'finder': return '/discovery/finder';
    case 'compare': return '/discovery/compare';
    case 'eligibility': return '/discovery/eligibility';
    case 'careers': return '/discovery/careers';
    case 'organizations': return '/discovery/organizations';
    case 'materials': return '/syllabus';
    case 'current-affairs': return '/current-affairs';
    default:
      return '/login';
  }
}

export default function App() {
  const { user, loading } = useAuth();
  
  // Initial Tab Resolution from current Browser URL
  const [activeTab, setActiveTab] = useState(() => {
    const initial = getTabFromPath(window.location.pathname, false);
    return initial;
  });

  const [selectedExamModalId, setSelectedExamModalId] = useState(null);
  const [compareExamIds, setCompareExamIds] = useState([]);

  // Central Navigation & URL Synchronization Handler
  const navigateToTab = (targetTab, pushState = true) => {
    let resolvedTab = targetTab;

    // 1. Initial / Unauthenticated Landing: Default directly to login or register
    if (!user) {
      if (resolvedTab !== 'register' && resolvedTab !== 'login') {
        resolvedTab = 'login';
      }
    }

    // 2. Already Logged In: Visiting /login or /register redirects to /dashboard
    if (user && (resolvedTab === 'login' || resolvedTab === 'register')) {
      resolvedTab = 'dashboard';
    }

    setActiveTab(resolvedTab);

    if (pushState) {
      const targetPath = getPathForTab(resolvedTab);
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  // Synchronize on Initial Load and when Auth status changes
  useEffect(() => {
    if (!loading) {
      const currentPathTab = getTabFromPath(window.location.pathname, !!user);
      navigateToTab(currentPathTab, false);
    }
  }, [user, loading]);

  // Handle Browser Back / Forward Button Navigation
  useEffect(() => {
    const handlePopState = () => {
      const targetTab = getTabFromPath(window.location.pathname);
      navigateToTab(targetTab, false);
    };

    const handleAuthLogout = () => {
      navigateToTab('login', true);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--brand-light)',
            borderTopColor: 'var(--brand-primary)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
            Initializing Pitch Deck Platform...
          </div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If user is unauthenticated and on login/register view
  if (!user && (activeTab === 'login' || activeTab === 'register')) {
    if (activeTab === 'register') {
      return (
        <Register
          onNavigateToLogin={() => navigateToTab('login')}
          onRegisterSuccess={() => navigateToTab('dashboard')}
        />
      );
    }
    return (
      <Login
        onNavigateToRegister={() => navigateToTab('register')}
        onLoginSuccess={() => navigateToTab('dashboard')}
      />
    );
  }

  // Render active main content tab
  const renderActiveTab = () => {
    switch (activeTab) {
      // 1. Discovery Home (Short Hub)
      case 'home':
        return (
          <LandingPage
            onNavigateToTab={navigateToTab}
            onNavigateToAuth={() => navigateToTab('login')}
          />
        );

      // 2. Dedicated Discovery Sub-Pages
      case 'explore':
        return (
          <ExamExplorer
            setActiveTab={navigateToTab}
            onOpenCompareWithExam={(ids) => {
              setCompareExamIds(ids);
              navigateToTab('compare');
            }}
          />
        );
      case 'upcoming':
        return <UpcomingExams setActiveTab={navigateToTab} />;
      case 'calendar':
        return <ExamCalendar setActiveTab={navigateToTab} />;
      case 'finder':
        return (
          <ExamFinder
            setActiveTab={navigateToTab}
            onOpenCompareWithExam={(ids) => {
              setCompareExamIds(ids);
              navigateToTab('compare');
            }}
          />
        );
      case 'compare':
        return (
          <ExamCompare
            initialExamIds={compareExamIds}
            setActiveTab={navigateToTab}
          />
        );
      case 'eligibility':
        return <EligibilityChecker setActiveTab={navigateToTab} />;
      case 'careers':
        return <CareerPaths setActiveTab={navigateToTab} />;
      case 'organizations':
        return <OrganizationsExplorer setActiveTab={navigateToTab} />;
      case 'preparation':
        return <PreparationHub defaultExamId="exam_upsc_cse" setActiveTab={navigateToTab} />;
      case 'ai-tools':
        return <AIToolsHub setActiveTab={navigateToTab} />;

      // 3. Aspirant OS Suite
      case 'dashboard':
        return <Dashboard setActiveTab={navigateToTab} />;
      case 'study-plan':
        return <StudyPlan />;
      case 'materials':
        return <StudyMaterials setActiveTab={navigateToTab} />;
      case 'questions':
        return <QuestionGenerator />;
      case 'tests':
        return <MockTests />;
      case 'pyqs':
        return <PYQ />;
      case 'performance':
        return <Performance setActiveTab={navigateToTab} />;
      case 'revision':
        return <Revision />;
      case 'current-affairs':
        return <CurrentAffairs setActiveTab={navigateToTab} />;
      case 'coach':
        return <AIExamCoach setActiveTab={navigateToTab} />;
      case 'tutor':
        return <AIDoubtSolver />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications setActiveTab={navigateToTab} onSelectExam={(id) => setSelectedExamModalId(id)} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage onNavigateToTab={navigateToTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={navigateToTab} />
      <div className="main-content">
        <Header
          setActiveTab={navigateToTab}
          onSelectExam={(id) => setSelectedExamModalId(id)}
        />
        {renderActiveTab()}
      </div>

      {/* Global Details Modal */}
      {selectedExamModalId && (
        <ExamDetailsModal
          examId={selectedExamModalId}
          onClose={() => setSelectedExamModalId(null)}
          onSelectRoadmap={() => {
            setSelectedExamModalId(null);
            navigateToTab('preparation');
          }}
        />
      )}
    </div>
  );
}
