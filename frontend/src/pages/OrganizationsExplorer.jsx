import React, { useState } from 'react';
import {
  Building, ExternalLink, ArrowRight, Compass, ShieldCheck,
  CheckCircle2, Search, ChevronRight, BookOpen
} from 'lucide-react';
import ExamDetailsModal from '../components/discovery/ExamDetailsModal';

export default function OrganizationsExplorer({ setActiveTab }) {
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const organizations = [
    {
      id: 'upsc',
      code: 'UPSC',
      name: 'Union Public Service Commission',
      hq: 'Dholpur House, Shahjahan Road, New Delhi',
      about: 'India’s premier central recruitment agency responsible for appointments to All India Services and Central Group A & B Services.',
      website: 'https://upsc.gov.in',
      exams: [
        { id: 'exam_upsc_cse', code: 'UPSC CSE', name: 'Civil Services Examination (IAS/IPS)' },
        { id: 'exam_upsc_ese', code: 'UPSC ESE', name: 'Engineering Services Examination' },
        { id: 'exam_upsc_capf', code: 'UPSC CAPF', name: 'Central Armed Police Forces (AC)' },
        { id: 'exam_upsc_ies_iss', code: 'UPSC IES/ISS', name: 'Indian Economic & Statistical Service' },
        { id: 'exam_epfo_eo_ao', code: 'EPFO EO/AO', name: 'Enforcement Officer / Accounts Officer' }
      ]
    },
    {
      id: 'ssc',
      code: 'SSC',
      name: 'Staff Selection Commission',
      hq: 'CGO Complex, Lodhi Road, New Delhi',
      about: 'Conducts national examinations for recruitment to Group B (Non-Gazetted) and Group C posts in various Ministries and Departments.',
      website: 'https://ssc.gov.in',
      exams: [
        { id: 'exam_ssc_cgl', code: 'SSC CGL', name: 'Combined Graduate Level Examination' },
        { id: 'exam_ssc_chsl', code: 'SSC CHSL', name: 'Combined Higher Secondary Level (10+2)' },
        { id: 'exam_ssc_mts', code: 'SSC MTS', name: 'Multi-Tasking Staff & Havaldar' },
        { id: 'exam_ssc_cpo', code: 'SSC CPO', name: 'Sub-Inspector in Delhi Police & CAPFs' },
        { id: 'exam_ssc_je', code: 'SSC JE', name: 'Junior Engineer (Civil/Mech/Elec)' }
      ]
    },
    {
      id: 'rrb',
      code: 'RRB',
      name: 'Railway Recruitment Control Board',
      hq: 'Rail Bhavan, New Delhi (21 Zonal RRBs)',
      about: 'Coordinates recruitment for technical, supervisory, operational, and station management cadres across Indian Railways.',
      website: 'https://rrbcdg.gov.in',
      exams: [
        { id: 'exam_rrb_ntpc', code: 'RRB NTPC', name: 'Non-Technical Popular Categories' },
        { id: 'exam_rrb_alp', code: 'RRB ALP', name: 'Assistant Loco Pilot' },
        { id: 'exam_rrb_je', code: 'RRB JE', name: 'Junior Engineer & Material Superintendent' },
        { id: 'exam_rpf_si', code: 'RPF SI', name: 'Railway Protection Force Sub-Inspector' }
      ]
    },
    {
      id: 'ibps',
      code: 'IBPS',
      name: 'Institute of Banking Personnel Selection',
      hq: 'Kandivali East, Mumbai, Maharashtra',
      about: 'Apex testing agency conducting common recruitment processes for Public Sector Banks, Regional Rural Banks, and financial entities.',
      website: 'https://ibps.in',
      exams: [
        { id: 'exam_ibps_po', code: 'IBPS PO', name: 'Probationary Officer (CRP PO/MT)' }
      ]
    },
    {
      id: 'rbi',
      code: 'RBI',
      name: 'Reserve Bank of India Services Board',
      hq: 'Byculla, Mumbai, Maharashtra',
      about: 'Recruitment board for managerial and executive officers in India’s central banking and monetary authority.',
      website: 'https://rbi.org.in',
      exams: [
        { id: 'exam_rbi_grade_b', code: 'RBI Grade B', name: 'Officers in Grade B (General/DEPR/DSIM)' }
      ]
    },
    {
      id: 'sbi',
      code: 'SBI',
      name: 'State Bank of India (Central Recruitment)',
      hq: 'State Bank Bhavan, Nariman Point, Mumbai',
      about: 'India’s largest commercial Fortune 500 bank recruiting Probationary Officers, Specialist Officers, and Junior Associates.',
      website: 'https://sbi.co.in/careers',
      exams: [
        { id: 'exam_sbi_po', code: 'SBI PO', name: 'State Bank Probationary Officer' }
      ]
    },
    {
      id: 'isro',
      code: 'ISRO',
      name: 'Indian Space Research Organisation (ICRB)',
      hq: 'Antariksh Bhavan, New BEL Road, Bengaluru',
      about: 'India’s national space agency recruiting scientists and engineers for launch vehicle, satellite, and planetary mission design.',
      website: 'https://isro.gov.in/careers',
      exams: [
        { id: 'exam_isro_sc', code: 'ISRO SC', name: 'Scientist / Engineer SC Recruitment' }
      ]
    },
    {
      id: 'drdo',
      code: 'DRDO',
      name: 'Defence Research & Development Organisation (RAC)',
      hq: 'DRDO Bhawan, Rajaji Marg, New Delhi',
      about: 'Premier agency for military research and defense technology development under Ministry of Defence.',
      website: 'https://rac.gov.in',
      exams: [
        { id: 'exam_drdo_ceptam', code: 'DRDO RAC', name: 'Scientist B Recruitment through GATE' }
      ]
    },
    {
      id: 'tnpsc',
      code: 'TNPSC',
      name: 'Tamil Nadu Public Service Commission',
      hq: 'Frazer Bridge Road, VOC Nagar, Chennai, Tamil Nadu',
      about: 'Constitutional recruitment body for the civil services and public departments of the Government of Tamil Nadu.',
      website: 'https://tnpsc.gov.in',
      exams: [
        { id: 'exam_tnpsc_grp1', code: 'TNPSC Group 1', name: 'Combined Civil Services (Deputy Collector/DSP)' },
        { id: 'exam_tnpsc_grp2', code: 'TNPSC Group 2/2A', name: 'Sub-Registrar & Assistant Section Officer' },
        { id: 'exam_tnpsc_grp4', code: 'TNPSC Group 4', name: 'Village Administrative Officer (VAO) & JA' }
      ]
    },
    {
      id: 'tnusrb',
      code: 'TNUSRB',
      name: 'Tamil Nadu Uniformed Services Recruitment Board',
      hq: 'Old COP Building, Pantheon Road, Egmore, Chennai',
      about: 'Statutory board conducting recruitment for Police Sub-Inspectors, Constables, Jail Warders, and Firemen in Tamil Nadu.',
      website: 'https://tnusrb.tn.gov.in',
      exams: [
        { id: 'exam_tnusrb_si', code: 'TNUSRB SI', name: 'Police Sub-Inspector (Taluk, AR & TSP)' },
        { id: 'exam_tnusrb_constable', code: 'TNUSRB Constable', name: 'Police Constable & Fireman' }
      ]
    }
  ];

  const filteredOrgs = organizations.filter(org => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return org.name.toLowerCase().includes(q) ||
           org.code.toLowerCase().includes(q) ||
           org.about.toLowerCase().includes(q);
  });

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
          backgroundColor: 'rgba(2, 132, 199, 0.1)',
          color: '#0284c7',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Building size={15} />
          <span>Official Recruiting Authorities</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Government Recruiting Organizations
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.4rem auto 0 auto' }}>
          Explore official commissions, central ministries, banking boards, and state agencies conducting examinations.
        </p>

        {/* Search */}
        <div style={{ maxWidth: '480px', margin: '1.5rem auto 0 auto', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search organizations (e.g. UPSC, SSC, ISRO, TNPSC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredOrgs.map(org => (
          <div
            key={org.id}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{org.code}</span>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--brand-primary)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Official Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                {org.name}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                📍 {org.hq}
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {org.about}
              </p>

              {/* Conducted Exams */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Conducted Examinations ({org.exams.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {org.exams.map(ex => (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedExamId(ex.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ex.name}</span>
                      <ChevronRight size={14} color="var(--brand-primary)" />
                    </div>
                  ))}
                </div>
              </div>
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
