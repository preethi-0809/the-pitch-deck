import React, { useState } from 'react';
import {
  Sparkles, Search, CheckCircle2, ArrowRight, ShieldCheck,
  TrendingUp, BookOpen, Layers, Scale, HelpCircle, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function AIToolsHub({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('eligibility'); // 'eligibility' | 'matchups' | 'syllabus'

  // Natural Language Eligibility State
  const [nlQuery, setNlQuery] = useState('I am 22 years old and completed B.E in Tamil Nadu looking for high salary government job.');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlResult, setNlResult] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);

  // Selected Career Matchup
  const [selectedMatchup, setSelectedMatchup] = useState('cgl_vs_upsc');

  const careerMatchups = {
    cgl_vs_upsc: {
      title: 'SSC CGL vs UPSC Civil Services (CSE)',
      tagline: 'Direct Group-B Inspection vs Elite Administrative Leadership',
      aspects: [
        { title: 'Core Profile', upsc: 'District Administration (IAS), Law & Order (IPS), Policy Formation (Joint Secretary)', ssc: 'Excise/GST Inspection, Income Tax, Desk Intelligence (IB/CBI), Section Officer (MEA)' },
        { title: 'Selection Difficulty', upsc: 'Extreme (0.1% selection ratio across 3 rigorous subjective & interview tiers)', ssc: 'High Competition (Speed-based Objective CBT Tier-1 & Tier-2)' },
        { title: 'Preparation Timeline', upsc: '12 to 18 months of intensive daily 6–8 hours study with optional subject', ssc: '6 to 9 months focused on Math, Reasoning, English and General Awareness' },
        { title: 'Starting Pay & Perks', upsc: 'Level 10 (₹56,100 Basic + Apex Perks + Official Vehicle & Bungalow)', ssc: 'Level 7 / Level 8 (₹44,900–₹47,600 Basic + Standard HRA/DA)' },
        { title: 'Career Growth', upsc: 'Can reach Principal Secretary / Chief Secretary / Cabinet Secretary', ssc: 'Joint Commissioner / Additional Commissioner (towards late career)' },
        { title: 'Best Choice For You', upsc: 'Aspirants seeking deep policy impact, leadership, and public administration prestige.', ssc: 'Candidates wanting rapid job security, predictable desk hours, and metro posting.' }
      ]
    },
    rbi_vs_sbi: {
      title: 'RBI Grade B vs SBI Probationary Officer (PO)',
      tagline: 'Central Bank Macro-Regulation vs High-Powered Commercial Banking',
      aspects: [
        { title: 'Core Profile', upsc: 'Monetary Policy, Foreign Exchange Regulation, Financial Supervision at RBI Headquarters', ssc: 'Branch operations, Credit underwriting, Retail & Corporate lending, Public customer dealing' },
        { title: 'Work-Life Balance', upsc: 'Predictable 9:30 AM to 5:30 PM corporate hours in Tier-1 metros (Mumbai, Delhi, Chennai)', ssc: 'Dynamic & demanding branch hours with frequent rural/semi-urban transfers' },
        { title: 'Salary & Compensation', upsc: '₹1,15,000–₹1,35,000 in-hand + Premium RBI leased housing in BKC/Colaba', ssc: '₹68,000–₹82,000 in-hand + Bank accommodation + Faster Scale promotions' },
        { title: 'Exam Pattern Focus', upsc: 'Phase-2 Economic & Social Issues (ESI) + Finance & Management Descriptive', ssc: 'Speed-intensive Quant, Data Interpretation, High-level Logical Puzzles' },
        { title: 'Best Choice For You', upsc: 'Aspirants passionate about economics, macro-finance, and metropolitan lifestyle.', ssc: 'Dynamic leaders aiming for rapid promotions (can reach Executive Director/MD).' }
      ]
    },
    gate_vs_psc: {
      title: 'GATE (PSU Entry) vs State PSC Engineering (AE/AEE)',
      tagline: 'Maharatna Executive Trainee vs State Government Executive Engineer',
      aspects: [
        { title: 'Core Profile', upsc: 'IOCL, ONGC, NTPC, BHEL Refinery Operations, Power Grid Project Management', ssc: 'State PWD, Highway Department, Water Resources, Rural Development Engineering' },
        { title: 'Job Stability & Local Postings', upsc: 'All-India transfers near major industrial plants and offshore platforms', ssc: 'Home-state postings throughout career with strong local administrative authority' },
        { title: 'Starting In-Hand Salary', upsc: '₹85,000–₹1,10,000 / month + High Performance Related Pay (PRP bonuses)', ssc: '₹55,000–₹68,000 / month (Level 13/14 State Pay Commission)' },
        { title: 'Exam Syllabi Depth', upsc: 'Deep technical mathematical concepts, NAT numericals, and core engineering theory', ssc: 'State General Studies + Technical Objective Questions + Local Language' },
        { title: 'Best Choice For You', upsc: 'Technical purists wanting high compensation and corporate-style PSU environment.', ssc: 'Engineers who prioritize staying within their home state and local public authority.' }
      ]
    }
  };

  const handleRunNlCheck = async (e) => {
    if (e) e.preventDefault();
    if (!nlQuery.trim()) return;

    try {
      setNlLoading(true);
      const res = await api.post('/discovery/ai-eligibility', { query: nlQuery });
      if (res.success) {
        setNlResult(res.data);
      }
    } catch (err) {
      console.error('Error running NL eligibility:', err);
    } finally {
      setNlLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={15} />
          <span>Intelligent Aspirant Decision Tools</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          AI Eligibility & Career Decision Suite
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
          Instant natural language eligibility checking, syllabus priority breakdown, and head-to-head career matchup guides.
        </p>
      </div>

      {/* Navigation Subtabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveSubTab('eligibility')}
          className={`btn ${activeSubTab === 'eligibility' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Sparkles size={15} />
          <span>Natural Language Eligibility Checker</span>
        </button>
        <button
          onClick={() => setActiveSubTab('matchups')}
          className={`btn ${activeSubTab === 'matchups' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Scale size={15} />
          <span>AI Career Matchups (SSC vs UPSC, RBI vs SBI)</span>
        </button>
      </div>

      {/* SUBTAB 1: NATURAL LANGUAGE ELIGIBILITY CHECKER */}
      {activeSubTab === 'eligibility' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Ask Any Eligibility Query in Plain English
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Type your age, degree, state, or career interest. The AI will parse your parameters and match you against official gazette rules.
            </p>

            <form onSubmit={handleRunNlCheck}>
              <textarea
                rows={3}
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="e.g. I am 23 years old B.E Mechanical graduate from Tamil Nadu looking for officer level job with 60k salary..."
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try example:</span>
                  {[
                    '21 yr old 12th pass looking for defence',
                    '24 yr old B.Com graduate for Banking PO',
                    '22 yr old B.Tech CSE in Tamil Nadu'
                  ].map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNlQuery(ex)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        color: 'var(--brand-primary)'
                      }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                <button type="submit" disabled={nlLoading} className="btn btn-primary">
                  <Sparkles size={15} />
                  <span>{nlLoading ? 'Analyzing...' : 'Check My Eligibility'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* NL Results View */}
          {nlResult && (
            <div>
              {/* Extracted Entities Tag Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-light)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  Parsed Parameters:
                </span>
                <span className="badge badge-secondary">Age: {nlResult.extracted_entities?.detected_age} Yrs</span>
                <span className="badge badge-secondary">Qualification: {nlResult.extracted_entities?.detected_qualification}</span>
                <span className="badge badge-secondary">State: {nlResult.extracted_entities?.detected_state}</span>
              </div>

              {/* Eligible Exams List */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Eligible Government Examinations ({nlResult.eligible_exams?.length || 0})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {nlResult.eligible_exams && nlResult.eligible_exams.map(exam => (
                  <div
                    key={exam.id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary">{exam.code}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--success)' }}>
                          {exam.match_score}% Match
                        </span>
                      </div>
                      <h4
                        onClick={() => setSelectedExamId(exam.id)}
                        style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', cursor: 'pointer' }}
                      >
                        {exam.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {exam.organization}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        • <strong>Salary:</strong> {exam.in_hand_salary || `₹${exam.salary_min}+`}<br />
                        • <strong>Age Limit:</strong> {exam.age_min}–{exam.age_max} Years<br />
                        • <strong>Qualification:</strong> {exam.qualification}
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => setSelectedExamId(exam.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%' }}
                      >
                        <span>View Full Profile</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CAREER MATCHUPS */}
      {activeSubTab === 'matchups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Matchup Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'cgl_vs_upsc', label: 'SSC CGL vs UPSC CSE' },
              { id: 'rbi_vs_sbi', label: 'RBI Grade B vs SBI PO' },
              { id: 'gate_vs_psc', label: 'GATE PSU vs State PSC Engineering' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMatchup(m.id)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  backgroundColor: selectedMatchup === m.id ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  color: selectedMatchup === m.id ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedMatchup === m.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Matchup Content Card */}
          {careerMatchups[selectedMatchup] && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {careerMatchups[selectedMatchup].title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '0.35rem' }}>
                  {careerMatchups[selectedMatchup].tagline}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {careerMatchups[selectedMatchup].aspects.map((aspect, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: 'var(--brand-primary)', fontSize: '0.92rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      {aspect.title}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Option A</div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {aspect.upsc}
                        </div>
                      </div>

                      <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Option B</div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {aspect.ssc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
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
