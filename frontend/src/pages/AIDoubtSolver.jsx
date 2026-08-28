import React, { useState } from 'react';
import { HelpCircle, Sparkles, BookOpen, Languages, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormattedText } from '../utils/textFormatter';

export default function AIDoubtSolver() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [explanationMode, setExplanationMode] = useState('exam_oriented');
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    try {
      setLoading(true);
      const res = await api.post('/coach/tutor', {
        query,
        explanationMode,
        language
      });
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error('Failed to solve doubt:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "Difference between Article 32 and Article 226 Writs",
    "How does Repo Rate hike control CPI Inflation?",
    "Explain Thirukkural's concept of an ideal state (Irai Matchi)",
    "Explain Doctrine of Severability vs Eclipse in Constitutional Law"
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Doubt Solver & Personal Concept Tutor</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Get personalized, multi-depth academic explanations with step-by-step problem breakdown.
        </p>
      </div>

      {/* Query Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSolve}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              What concept, question, or topic would you like explained?
            </label>
            <input
              type="text"
              placeholder="e.g. 'Explain the Writ of Mandamus and exceptions' or 'How does SDF differ from Reverse Repo?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', fontSize: '1rem', padding: '0.85rem 1.25rem' }}
            />
          </div>

          {/* Sample Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setQuery(sq); }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Controls: Mode & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Explanation Depth:</span>
              {[
                { id: 'simple', label: '🌱 Simple' },
                { id: 'exam_oriented', label: '🎯 Exam-Oriented' },
                { id: 'detailed', label: '📚 Detailed Deep-Dive' },
                { id: 'quick_revision', label: '⚡ Quick Flash' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setExplanationMode(m.id)}
                  className={`btn btn-sm ${explanationMode === m.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem' }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Languages size={15} />
                <span>{language === 'en' ? 'Language: English' : 'Language: தமிழ் (Tamil)'}</span>
              </button>

              <button type="submit" disabled={loading || !query.trim()} className="btn btn-primary btn-sm" style={{ padding: '0.55rem 1.25rem' }}>
                <Sparkles size={15} />
                <span>{loading ? 'Analyzing...' : 'Explain Concept'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                {result.title}
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Query: "{result.query}"
              </h2>
            </div>
          </div>

          {/* Main Explanation Body */}
          <div style={{ marginBottom: '1.75rem' }}>
            <FormattedText text={result.explanation} />
          </div>

          {/* Key Takeaways */}
          {result.keyPoints && result.keyPoints.length > 0 && (
            <div style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                <span>Key Examination Takeaways</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {result.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Pro Exam Tip Box */}
          {result.examTip && (
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-light)',
              border: '1px solid var(--warning-border)',
              color: 'var(--warning)',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}>
              💡 <strong>Pro Exam Tip:</strong> {result.examTip}
            </div>
          )}

          {/* Follow up */}
          {result.followUpQuestion && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              🎯 {result.followUpQuestion}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
