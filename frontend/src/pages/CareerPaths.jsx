import React, { useState } from 'react';
import {
  Briefcase, ArrowRight, Sparkles, Compass, ShieldCheck,
  Award, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function CareerPaths({ setActiveTab }) {
  const [selectedExamId, setSelectedExamId] = useState(null);

  const careerTracks = [
    {
      id: 'admin',
      role: 'Civil & Administrative Leadership (IAS / State PCS)',
      headline: 'Lead district governance, formulate government policies, and oversee development programs.',
      recommendedExams: [
        { id: 'exam_upsc_cse', name: 'UPSC Civil Services Examination (CSE)', tag: 'IAS / IPS / IFS', salary: '₹75,000 - ₹1,20,000 / mo' },
        { id: 'exam_tnpsc_grp1', name: 'TNPSC Group 1 Combined Services', tag: 'Deputy Collector / DSP', salary: '₹68,000 - ₹85,000 / mo' },
        { id: 'exam_uppsc_pcs', name: 'UPPSC Combined Upper Subordinate (PCS)', tag: 'SDM / Dy SP', salary: '₹65,000 - ₹85,000 / mo' },
        { id: 'exam_tnpsc_grp2', name: 'TNPSC Group 2 / 2A Services', tag: 'Sub-Registrar / ASO', salary: '₹45,000 - ₹62,000 / mo' }
      ],
      qualifications: 'Any Graduate Degree (B.A, B.Sc, B.Com, B.E, etc.)',
      ladder: 'Assistant Collector → Sub-Collector → District Magistrate / Collector → Principal Secretary → Chief Secretary'
    },
    {
      id: 'police',
      role: 'Police & Law Enforcement Officer (IPS / Sub-Inspector)',
      headline: 'Maintain public law & order, criminal investigation, and anti-terror tactical command.',
      recommendedExams: [
        { id: 'exam_ssc_cpo', name: 'SSC Sub-Inspector (Delhi Police & CAPFs)', tag: 'SI in Delhi Police / BSF', salary: '₹50,000 - ₹62,000 / mo' },
        { id: 'exam_tnusrb_si', name: 'Tamil Nadu Police Sub-Inspector (TNUSRB)', tag: 'Taluk / AR Sub-Inspector', salary: '₹48,000 - ₹58,000 / mo' },
        { id: 'exam_upsc_capf', name: 'UPSC Central Armed Police Forces (AC)', tag: 'Assistant Commandant (BSF/CISF)', salary: '₹75,000 - ₹90,000 / mo' },
        { id: 'exam_rpf_si', name: 'Railway Protection Force SI (RPF)', tag: 'Railway Security Sub-Inspector', salary: '₹50,000 - ₹60,000 / mo' }
      ],
      qualifications: 'Any Degree + Physical Fitness Standards',
      ladder: 'Sub-Inspector → Inspector → Deputy Superintendent of Police (DSP) → Superintendent of Police (SP)'
    },
    {
      id: 'banking',
      role: 'Banking Regulatory & Commercial Leadership',
      headline: 'Monetary policy formulation, credit expansion, and institutional finance management.',
      recommendedExams: [
        { id: 'exam_rbi_grade_b', name: 'Reserve Bank of India Grade B Officer', tag: 'Central Bank Manager', salary: '₹1,15,000 - ₹1,35,000 / mo' },
        { id: 'exam_sbi_po', name: 'State Bank of India Probationary Officer', tag: 'SBI Scale-I Manager', salary: '₹68,000 - ₹82,000 / mo' },
        { id: 'exam_ibps_po', name: 'IBPS Probationary Officer (CRP PO)', tag: 'Public Sector Bank PO', salary: '₹55,000 - ₹68,000 / mo' },
        { id: 'exam_nabard_grade_a', name: 'NABARD Assistant Manager (Grade A)', tag: 'Rural Development Bank', salary: '₹85,000 - ₹1,00,000 / mo' }
      ],
      qualifications: 'Any Graduate Degree (min 60% for RBI/NABARD)',
      ladder: 'Probationary Officer → Branch Manager → Chief Manager → DGM → General Manager → Executive Director'
    },
    {
      id: 'defence',
      role: 'Defence Commissioned Officers (Army, Navy, Air Force)',
      headline: 'Lead frontline combat formations, fighter aircraft squadrons, and naval warships.',
      recommendedExams: [
        { id: 'exam_nda', name: 'National Defence Academy (NDA & NA)', tag: '12th Pass Cadet Entry', salary: '₹75,000 - ₹95,000 / mo' },
        { id: 'exam_cds', name: 'Combined Defence Services (CDS Exam)', tag: 'Graduate Officer Entry', salary: '₹75,000 - ₹95,000 / mo' },
        { id: 'exam_afcat', name: 'Air Force Common Admission Test (AFCAT)', tag: 'Flying Officer / Fighter Pilot', salary: '₹85,000 - ₹1,10,000 / mo' },
        { id: 'exam_coast_guard', name: 'Indian Coast Guard Navik / Yantrik', tag: 'Coastal Maritime Patrol', salary: '₹30,000 - ₹42,000 / mo' }
      ],
      qualifications: '12th (Physics/Math) or Any Degree / B.E',
      ladder: 'Lieutenant → Captain → Major → Lt Colonel → Colonel → Brigadier → Major General'
    },
    {
      id: 'technical',
      role: 'Space, Nuclear & PSU Scientific Engineering',
      headline: 'Design satellite launch vehicles, nuclear energy reactors, and defense missile systems.',
      recommendedExams: [
        { id: 'exam_gate', name: 'GATE (PSU Executive Trainee Recruitment)', tag: 'IOCL, ONGC, NTPC, BHEL', salary: '₹80,000 - ₹1,20,000 / mo' },
        { id: 'exam_isro_sc', name: 'ISRO Scientist / Engineer (SC)', tag: 'Space Research Engineer', salary: '₹78,000 - ₹95,000 / mo' },
        { id: 'exam_drdo_ceptam', name: 'DRDO Scientist B (RAC)', tag: 'Defence R&D Scientist', salary: '₹75,000 - ₹95,000 / mo' },
        { id: 'exam_barc_oces', name: 'BARC Scientific Officer (OCES/DGFS)', tag: 'Nuclear Energy Scientist', salary: '₹85,000 - ₹1,05,000 / mo' }
      ],
      qualifications: 'B.E / B.Tech in Civil, Mech, Electrical, ECE, CSE, etc.',
      ladder: 'Scientist / Engineer SC → Scientist SD → Scientist SE → Scientist SF → Outstanding Scientist'
    },
    {
      id: 'teaching',
      role: 'Teaching & Higher Academic Professorship',
      headline: 'Educate future generations in Central Schools, Universities, and Research Institutes.',
      recommendedExams: [
        { id: 'exam_ugc_net', name: 'UGC NET (Assistant Professor & JRF)', tag: 'University Professor / JRF', salary: '₹75,000 - ₹95,000 / mo' },
        { id: 'exam_ctet', name: 'Central Teacher Eligibility Test (CTET)', tag: 'KVS / NVS Eligibility', salary: '₹42,000 - ₹58,000 / mo' },
        { id: 'exam_kvs_recruitment', name: 'Kendriya Vidyalaya Sangathan (KVS)', tag: 'PGT / TGT / PRT Teacher', salary: '₹48,000 - ₹72,000 / mo' }
      ],
      qualifications: 'B.Ed / Master Degree / D.El.Ed',
      ladder: 'PRT/TGT Teacher → PGT Teacher → Vice Principal → Principal → Education Officer'
    }
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          color: '#ec4899',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Briefcase size={15} />
          <span>Role-Based Career Explorer</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Explore Government Career Paths
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.4rem auto 0 auto' }}>
          Discover government careers by what you want to become — from IAS leadership and space science to banking and defense command.
        </p>
      </div>

      {/* Career Tracks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {careerTracks.map(track => (
          <div
            key={track.id}
            className="card"
            style={{ padding: '2rem' }}
          >
            {/* Track Header */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {track.role}
                </h2>
                <span className="badge badge-primary">{track.qualifications}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', marginBottom: 0 }}>
                {track.headline}
              </p>
            </div>

            {/* Recommended Exams Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              {track.recommendedExams.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  style={{
                    padding: '1rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.15s, transform 0.15s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{ex.tag}</span>
                    </div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                      {ex.name}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--success)' }}>{ex.salary}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <span>View</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promotion Ladder Strip */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>📈 Career Promotion Ladder:</strong> {track.ladder}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
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
