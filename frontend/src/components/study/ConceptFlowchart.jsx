import React from 'react';
import { ArrowRight, ArrowDown, Shield, TrendingUp, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function ConceptFlowchart({ topicCode, topicName }) {
  // Check which specific topic flowchart to render
  const code = (topicCode || '').toUpperCase();
  const name = (topicName || '').toLowerCase();

  if (code.includes('POL_01') || name.includes('fundamental right') || name.includes('writs') || name.includes('dpsp')) {
    return (
      <div style={{
        margin: '2rem 0',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Interactive Concept Architecture: Writs & Judicial Remedies
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Flow of Constitutional Enforcement under Articles 32 & 226
            </div>
          </div>
        </div>

        {/* Step 1: Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontWeight: 700,
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            🚨 Step 1: Violation of Fundamental Right or Unlawful Executive Action
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Step 2: Judicial Forum Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', width: '100%' }}>
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid #3b82f6',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2563eb' }}>Supreme Court (Art 32)</span>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Mandatory Remedy</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                • Enforces <strong>Fundamental Rights Only</strong><br />
                • Territorial Scope: <strong>All India</strong><br />
                • Dr. Ambedkar: "Heart & Soul of Constitution"
              </p>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid #8b5cf6',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#7c3aed' }}>High Court (Art 226)</span>
                <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed', fontSize: '0.7rem' }}>Discretionary</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                • Enforces <strong>FRs + Ordinary Legal Rights</strong><br />
                • Territorial Scope: <strong>Within State Boundary</strong><br />
                • Broader subject scope than Supreme Court
              </p>
            </div>
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Step 3: Five Prerogative Writs */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center' }}>
              Step 3: Appropriate Writ Instrument Issued by the Court
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {[
                { name: 'Habeas Corpus', meaning: '"To have the body"', desc: 'Against illegal detention by State or Private entity', color: '#ef4444' },
                { name: 'Mandamus', meaning: '"We Command"', desc: 'Compels public official to perform statutory duty', color: '#3b82f6' },
                { name: 'Prohibition', meaning: '"To Forbid"', desc: 'Issued to Lower Court to prevent exceeding jurisdiction', color: '#f59e0b' },
                { name: 'Certiorari', meaning: '"To be Certified"', desc: 'Quashes illegal order already passed by a tribunal', color: '#10b981' },
                { name: 'Quo-Warranto', meaning: '"By what authority"', desc: 'Prevents illegal usurpation of a public office', color: '#8b5cf6' }
              ].map((w, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: `3px solid ${w.color}`
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{w.name}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: w.color, fontStyle: 'italic', marginBottom: '0.25rem' }}>{w.meaning}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{w.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Step 4: Outcome */}
          <div style={{
            width: '100%',
            maxWidth: '480px',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            ✅ Step 4: Constitutional Remedy Enforced & Citizen Liberty Restored
          </div>
        </div>
      </div>
    );
  }

  if (code.includes('ECO_01') || name.includes('monetary') || name.includes('rbi') || name.includes('inflation')) {
    return (
      <div style={{
        margin: '2rem 0',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Macroeconomic Flowchart: RBI Monetary Policy Transmission
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              How RBI Interest Rate Corridor Controls Inflation & Market Liquidity
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          {/* Node 1: Headline Target */}
          <div style={{
            width: '100%',
            maxWidth: '480px',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid #3b82f6',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            🎯 Headline CPI Inflation Target: <strong>4.0% (± 2.0% Tolerance Band)</strong>
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Node 2: 6-Member MPC */}
          <div style={{
            width: '100%',
            maxWidth: '520px',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            textAlign: 'center',
            fontSize: '0.85rem'
          }}>
            <strong>6-Member Monetary Policy Committee (MPC)</strong><br />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>3 RBI Members (Governor Casting Vote) + 3 Central Govt Appointed Economists</span>
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Node 3: Policy Corridor */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', width: '100%' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>CEILING (+0.25%)</div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#b91c1c' }}>MSF Rate</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Overnight emergency loans</div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-light)', border: '2px solid var(--brand-primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)' }}>ANCHOR RATE</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-primary)' }}>Repo Rate</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Key Lending Benchmark</div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>FLOOR (-0.25%)</div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#047857' }}>SDF Rate</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Uncollateralized Absorption</div>
            </div>
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Node 4: Commercial Bank Transmission */}
          <div style={{
            width: '100%',
            maxWidth: '520px',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            textAlign: 'center',
            fontSize: '0.85rem'
          }}>
            🏦 <strong>Commercial Banking Transmission</strong> ➔ EBLR / MCLR Loan Rates Adjusted
          </div>

          <ArrowDown size={20} color="var(--text-muted)" />

          {/* Node 5: Market Equilibrium */}
          <div style={{
            width: '100%',
            maxWidth: '520px',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: '#065f46',
            fontWeight: 700
          }}>
            📈 Stable Economic Growth + Consumer Price Index Inflation Returns to 4% Target
          </div>
        </div>
      </div>
    );
  }

  if (code.includes('TN_01') || name.includes('thirukkural') || name.includes('irai matchi')) {
    return (
      <div style={{
        margin: '2rem 0',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Thirukkural Governance Architecture: இறைமாட்சி (Kural 385)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Four Essential Pillars of an Ideal State & Ethical Administration
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { step: 'Pillar 1', tamil: 'இயற்றல் (Iyattral)', title: 'Revenue Creation', desc: 'Identifying and developing legitimate, progressive sources of public wealth.', color: '#3b82f6' },
            { step: 'Pillar 2', tamil: 'ஈட்டல் (Eettal)', title: 'Wealth Collection', desc: 'Efficient, leak-proof, and just taxation without citizen harassment.', color: '#10b981' },
            { step: 'Pillar 3', tamil: 'காத்தல் (Kaathal)', title: 'Treasury Protection', desc: 'Robust defense and zero tolerance for administrative corruption.', color: '#f59e0b' },
            { step: 'Pillar 4', tamil: 'வகுத்தல் (Vaguthal)', title: 'Equitable Distribution', desc: 'Just allocation for defense, social welfare, public health & education.', color: '#8b5cf6' }
          ].map((p, i) => (
            <div key={i} style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: `2px solid ${p.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="badge" style={{ backgroundColor: `${p.color}20`, color: p.color, fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                  {p.step}
                </span>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {p.tamil}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: p.color, marginBottom: '0.35rem' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Universal Dynamic Concept Flowchart
  return (
    <div style={{
      margin: '2rem 0',
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-subtle)'
    }}>
      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={17} color="var(--brand-primary)" />
        <span>Systematic Examination Mastery Blueprint</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)' }}>STAGE 1</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Core Theoretical Definition</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Master statutory terms, constitutional clauses & keywords.</div>
        </div>

        <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>STAGE 2</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Official Gazette & Case Law</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Cross-reference Supreme Court precedents & PIB releases.</div>
        </div>

        <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>STAGE 3</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>PYQ Trap Elimination</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Solve recent 5-year questions & eliminate extreme distractors.</div>
        </div>
      </div>
    </div>
  );
}
