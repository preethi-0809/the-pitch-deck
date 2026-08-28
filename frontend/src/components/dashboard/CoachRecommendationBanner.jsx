import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CoachRecommendationBanner({ recommendation, onAskCoach }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.4rem 1.75rem',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
      marginBottom: '1.75rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#93c5fd', marginBottom: '0.2rem' }}>
            AI EXAM COACH RECOMMENDATION
          </div>
          <div style={{ fontSize: '0.98rem', fontWeight: 500, lineHeight: 1.45, color: '#f8fafc' }}>
            "{recommendation || 'Your Economy accuracy has decreased over recent attempts. Complete the Inflation & RBI revision before attempting another mock test.'}"
          </div>
        </div>
      </div>

      <button
        onClick={onAskCoach}
        style={{
          backgroundColor: '#ffffff',
          color: '#1e40af',
          fontWeight: 700,
          fontSize: '0.88rem',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
      >
        <span>Open AI Coach</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
