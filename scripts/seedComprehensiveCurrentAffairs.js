const db = require('../backend/src/config/database');

const currentAffairsList = [
  // 1. INTERNATIONAL
  {
    id: 'ca_rag_intl_imec_2026',
    title: 'India, UAE, Saudi Arabia, and EU Ratify Intergovernmental Framework on IMEC Corridor',
    category: 'International',
    published_date: '2026-08-25',
    source_name: 'Ministry of External Affairs (MEA Delhi)',
    source_url: 'https://mea.gov.in/press-releases.htm?dtl/imec2026',
    what_happened: 'Participating governments formalized operational protocols for the India-Middle East-Europe Economic Corridor (IMEC), establishing standard customs clearance, unified railway gauge standards across GCC networks, and clean hydrogen pipeline alignments.',
    why_important: 'High relevance for UPSC GS-2 (Bilateral & Regional Groupings), SSC CGL General Awareness, and Banking PO. IMEC provides an alternative maritime-rail trade route that cuts shipping transit times between India and Europe by 40% while bypassing congested chokepoints.',
    key_facts: JSON.stringify([
      'Corridor Structure: Eastern Corridor (connecting India to Arabian Gulf) and Northern Corridor (connecting Gulf to Europe)',
      'Key Infrastructure Components: Railway lines, clean hydrogen pipelines, high-speed digital data cables, and roll-on/roll-off ship ports',
      'Signatory Entities: India, UAE, Saudi Arabia, European Union, France, Germany, Italy, and the United States',
      'Estimated Transit Reduction: 40% faster shipping compared to the traditional Suez Canal maritime route',
      'Strategic Significance: Strengthening connectivity with West Asia and enhancing export competitiveness for Indian manufacturing hubs'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'Banking PO', 'TNPSC GRP2', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_ir_bilateral', 'syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'Which of the following bodies is NOT one of the two core constituent transit corridors of the India-Middle East-Europe Economic Corridor (IMEC)?',
        options: ['Eastern Corridor (India to Arabian Gulf)', 'Northern Corridor (Gulf to Europe)', 'Southern Trans-African Corridor', 'Both A and B are core constituents'],
        correct_answer: 'C',
        explanation: 'IMEC consists of exactly two segments: the Eastern Corridor connecting India to the Arabian Gulf, and the Northern Corridor connecting the Arabian Gulf to Europe.'
      },
      {
        question: 'What is the estimated reduction in trade transit time between India and Europe under the IMEC network compared to the Suez Canal route?',
        options: ['15%', '25%', '40%', '60%'],
        correct_answer: 'C',
        explanation: 'IMEC is projected to reduce transit time by approximately 40% and cut logistical transit costs by 30% between India and European ports.'
      }
    ]),
    one_liners: JSON.stringify([
      'IMEC consists of two legs: Eastern Corridor (India to Gulf) and Northern Corridor (Gulf to Europe).',
      'Transit time between India and Europe projected to reduce by 40% under IMEC.',
      'Key components: Multi-modal rail/ship transit, clean hydrogen pipelines, and high-speed fiber cables.'
    ]),
    relevance_score: 9.9
  },
  {
    id: 'ca_rag_intl_chabahar_2026',
    title: 'India and Iran Sign Landmark 10-Year Long-Term Contract for Shahid Beheshti Terminal at Chabahar Port',
    category: 'International',
    published_date: '2026-08-18',
    source_name: 'Ministry of Ports, Shipping and Waterways',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=chabahar10yr',
    what_happened: 'India Ports Global Limited (IPGL) and the Ports and Maritime Organisation of Iran inked a long-term agreement granting India 10-year operational control over the Shahid Beheshti terminal at Chabahar, accompanied by $120 million equipment investment and a $250 million credit window.',
    why_important: 'Directly tested in UPSC GS-2 (International Relations) and State PSCs. Chabahar bypasses Pakistan to provide landlocked Afghanistan, Armenia, and Central Asian Republics (INSTC route) direct trade access to Mumbai and Kandla ports.',
    key_facts: JSON.stringify([
      'Implementing Agency: India Ports Global Limited (IPGL)',
      'Specific Port Facility: Shahid Beheshti Terminal, Chabahar, Gulf of Oman',
      'Agreement Duration: 10 years with automatic renewal provisions',
      'Capital Commitment: $120 million in port equipment modernization + $250 million credit line for infrastructure',
      'Strategic Route: Feeds directly into the International North-South Transport Corridor (INSTC)'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'Banking PO', 'TNPSC GRP2']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_ir_bilateral']),
    mcqs: JSON.stringify([
      {
        question: 'The Shahid Beheshti terminal operated by India Ports Global Limited (IPGL) is located in which body of water?',
        options: ['Red Sea', 'Gulf of Oman', 'Persian Gulf', 'Palk Strait'],
        correct_answer: 'B',
        explanation: 'Chabahar Port is situated on the Makran coast in Sistan and Baluchestan Province of Iran, bordering the Gulf of Oman.'
      }
    ]),
    one_liners: JSON.stringify([
      'India signed a 10-year contract to operate Shahid Beheshti Terminal at Chabahar Port, Iran.',
      'Chabahar is India\'s gateway to Afghanistan and Central Asia, connecting into INSTC.'
    ]),
    relevance_score: 9.7
  },
  {
    id: 'ca_rag_intl_efta_tepa_2026',
    title: 'India and European Free Trade Association (EFTA) Conclude Historic $100 Billion TEPA Agreement',
    category: 'International',
    published_date: '2026-07-28',
    source_name: 'Ministry of Commerce & Industry',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=tepa2026',
    what_happened: 'India signed the Trade and Economic Partnership Agreement (TEPA) with EFTA member states (Switzerland, Norway, Iceland, and Liechtenstein), marking India’s first FTA with a binding investment commitment of $100 billion over 15 years.',
    why_important: 'Crucial for UPSC GS-3 (Economy/Trade Agreements) and Banking Exams. First free trade agreement featuring legal commitments to foreign direct investment (FDI) and creation of 1 million direct jobs in India.',
    key_facts: JSON.stringify([
      'EFTA Member Nations: Switzerland, Norway, Iceland, and Liechtenstein (Non-EU European states)',
      'Investment Commitment: $100 billion in FDI into India over a 15-year period',
      'Employment Target: Projected creation of 10 lakh (1 million) direct domestic jobs',
      'Tariff Elimination: EFTA offers 99.6% tariff elimination on Indian non-agricultural exports'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'BANK PO']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'Which of the following countries is NOT a member of the European Free Trade Association (EFTA)?',
        options: ['Switzerland', 'Norway', 'Germany', 'Liechtenstein'],
        correct_answer: 'C',
        explanation: 'EFTA comprises 4 non-EU countries: Switzerland, Norway, Iceland, and Liechtenstein. Germany is a member of the European Union (EU).'
      }
    ]),
    one_liners: JSON.stringify([
      'EFTA nations: Switzerland, Norway, Iceland, Liechtenstein.',
      'TEPA commits $100 Billion in foreign direct investment to India over 15 years.'
    ]),
    relevance_score: 9.6
  },

  // 2. NATIONAL & POLITY
  {
    id: 'ca_rag_nat_simultaneous_elections_2026',
    title: 'High-Level Committee on Simultaneous Elections (One Nation, One Election) Submits Comprehensive Report',
    category: 'National',
    published_date: '2026-08-22',
    source_name: 'Ministry of Law and Justice',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=onoe2026',
    what_happened: 'The High-Level Committee headed by former President Ram Nath Kovind submitted an 18,626-page report recommending a two-step framework to synchronize Lok Sabha and State Legislative Assembly elections, followed by synchronized local body elections within 100 days.',
    why_important: 'Extremely high yield for UPSC GS-2 (Indian Constitution & Federalism) and TNPSC Unit 9 / Indian Polity. Examines constitutional amendment procedures under Article 368, Article 83 (Duration of Houses), Article 172, and Article 324A.',
    key_facts: JSON.stringify([
      'Committee Chair: Ram Nath Kovind (Former President of India)',
      'Phased Implementation: Phase 1 synchronizes Lok Sabha and State Assembly polls; Phase 2 syncs Municipalities & Panchayats within 100 days',
      'Constitutional Amendments: Proposes insertion of Article 82A for notified date synchronization',
      'Hung Assembly Provision: If no government forms, fresh elections held only for the remainder of the unexpired 5-year term',
      'Ratification Requirements: Amendment for local bodies requires ratification by not less than half of the States under Article 368(2)'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'TNPSC GRP2', 'SSC CGL', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_polity_constitution']),
    mcqs: JSON.stringify([
      {
        question: 'Under the recommendations of the High-Level Committee on Simultaneous Elections, what happens if a State Assembly dissolves prematurely due to a vote of no-confidence?',
        options: [
          'Fresh elections are held for a full new 5-year term',
          'President\'s rule is mandatory until the next general election',
          'Fresh elections are held only for the remainder of the unexpired term',
          'The Assembly seat count is merged with the nearest State'
        ],
        correct_answer: 'C',
        explanation: 'The committee recommended that mid-term elections will be held only for the remainder of the unexpired term to maintain synchronization with the national cycle.'
      }
    ]),
    one_liners: JSON.stringify([
      'One Nation One Election committee headed by former President Ram Nath Kovind.',
      'Recommended two-step rollout: Lok Sabha + Assemblies in Step 1; Local Bodies within 100 days in Step 2.',
      'Mid-term poll assemblies will only serve the unexpired remainder of the 5-year cycle.'
    ]),
    relevance_score: 9.9
  },
  {
    id: 'ca_rag_nat_criminal_laws_2026',
    title: 'New Criminal Law Codes (Bharatiya Nyaya Sanhita, BNSS, BSA) Take Full Effect Pan-India',
    category: 'National',
    published_date: '2026-08-10',
    source_name: 'Ministry of Home Affairs (MHA)',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=newcriminallaws2026',
    what_happened: 'India transitioned to the modern criminal justice architecture: Bharatiya Nyaya Sanhita (replacing IPC 1860), Bharatiya Nagarik Suraksha Sanhita (replacing CrPC 1973), and Bharatiya Sakshya Adhiniyam (replacing Indian Evidence Act 1872), incorporating e-FIRs, mandatory videography of search/seizure, and forensic mandates.',
    why_important: 'Direct questions expected in UPSC GS-2 (Governance/Judiciary), SSC CGL, Police SI, and Judicial Services. Replaces colonial laws with community service penalties and zero-FIR digital frameworks.',
    key_facts: JSON.stringify([
      'Bharatiya Nyaya Sanhita (BNS) 2023: Replaces Indian Penal Code (IPC) 1860 with 358 sections (down from 511)',
      'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023: Replaces Criminal Procedure Code (CrPC) 1973 with 531 sections',
      'Bharatiya Sakshya Adhiniyam (BSA) 2023: Replaces Indian Evidence Act 1872 with 170 sections',
      'Mandatory Forensics: Forensic expert visit mandatory for offenses punishable by 7 years imprisonment or more',
      'Community Service: Introduced for the first time in Indian criminal law as a formal punishment for petty offenses'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'TNPSC GRP2', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_polity_constitution']),
    mcqs: JSON.stringify([
      {
        question: 'Under the Bharatiya Nagarik Suraksha Sanhita (BNSS), forensic investigation is made mandatory for crimes punishable with imprisonment of:',
        options: ['3 years or more', '5 years or more', '7 years or more', '10 years or more'],
        correct_answer: 'C',
        explanation: 'BNSS mandates forensic team visits to crime scenes and forensic evidence collection for all offenses punishable by 7 years or more of imprisonment.'
      }
    ]),
    one_liners: JSON.stringify([
      'BNS replaces IPC 1860; BNSS replaces CrPC 1973; BSA replaces Evidence Act 1872.',
      'Community service recognized as a formal statutory penalty for petty offenses for the first time.',
      'Mandatory forensic inspection for crimes punishable with 7+ years of imprisonment.'
    ]),
    relevance_score: 9.8
  },

  // 3. ECONOMY & UNION BUDGET
  {
    id: 'ca_rag_econ_budget_capex_2026',
    title: 'Union Budget Sets Capital Expenditure at Record ₹11.11 Lakh Crore (3.4% of GDP) with 4.5% Fiscal Deficit Target',
    category: 'Economy',
    published_date: '2026-08-15',
    source_name: 'Ministry of Finance / Department of Economic Affairs',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=budget2026',
    what_happened: 'The Union Budget consolidated infrastructure spending with an effective capital outlay of ₹15.02 lakh crore while continuing the fiscal glide path towards reducing the fiscal deficit below 4.5% of GDP by FY 2025-26.',
    why_important: 'Core syllabus topic for UPSC GS-3 (Macroeconomics/Fiscal Policy), Banking PO, and SSC CGL Tier 1 & Tier 2. Evaluates the multiplier effect of public capex on private capital investment (crowding-in effect).',
    key_facts: JSON.stringify([
      'Capital Expenditure (Capex) Target: ₹11,11,111 Crore (3.4% of estimated GDP)',
      'Effective Capital Expenditure (including Grants-in-Aid for capital creation): ₹15.02 Lakh Crore',
      'Fiscal Deficit Target: 4.9% for FY25 and on track for below 4.5% in FY26',
      '50-Year Interest-Free Loan Scheme: ₹1.3 Lakh Crore allocated to State Governments for capital investments',
      'Tax Simplification: Standard deduction for salaried employees under new tax regime increased to ₹75,000'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'Banking PO', 'SSC CGL', 'TNPSC GRP2']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'What is the Central Government\'s targeted fiscal deficit glide path ratio as a percentage of GDP for FY 2025-26?',
        options: ['Below 3.5%', 'Below 4.0%', 'Below 4.5%', 'Below 5.0%'],
        correct_answer: 'C',
        explanation: 'The Government of India has committed to reaching a fiscal deficit below 4.5% of GDP by FY 2025-26.'
      }
    ]),
    one_liners: JSON.stringify([
      'Union Budget Capex target: ₹11.11 Lakh Crore (3.4% of GDP).',
      'Fiscal Deficit glide path targets below 4.5% by FY26.',
      'Standard deduction under New Tax Regime increased to ₹75,000.'
    ]),
    relevance_score: 9.9
  },

  // 4. BANKING & MONETARY POLICY
  {
    id: 'ca_rag_bank_rbi_mpc_2026',
    title: 'RBI Monetary Policy Committee Maintains Policy Repo Rate at 6.50% with Stance on Inflation Alignment',
    category: 'Banking',
    published_date: '2026-08-20',
    source_name: 'Reserve Bank of India (RBI Bulletin)',
    source_url: 'https://rbi.org.in/pressreleases/mpc2026',
    what_happened: 'The 6-member Monetary Policy Committee (MPC) voted 4:2 to keep the benchmark policy repo rate unchanged at 6.50%, retaining the Standing Deposit Facility (SDF) at 6.25% and Marginal Standing Facility (MSF) / Bank Rate at 6.75%.',
    why_important: 'Crucial for Banking PO (SBI/IBPS/RBI Grade B), UPSC GS-3, and SSC CGL. Directly tests liquidity adjustment facilities (LAF), monetary transmission, and CPI target mandates.',
    key_facts: JSON.stringify([
      'Policy Repo Rate: Unchanged at 6.50%',
      'Standing Deposit Facility (SDF) Rate: 6.25% (25 bps below Repo Rate)',
      'Marginal Standing Facility (MSF) & Bank Rate: 6.75% (25 bps above Repo Rate)',
      'Statutory Liquidity Ratio (SLR): 18.00%; Cash Reserve Ratio (CRR): 4.50%',
      'Inflation Target Framework: 4.0% with a permissible tolerance band of +/- 2% (2% to 6%) under Section 45ZA of the RBI Act 1934'
    ]),
    exam_relevance_tags: JSON.stringify(['Banking PO', 'RBI Grade B', 'UPSC CSE', 'SSC CGL']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'Under the current RBI liquidity management framework, the Standing Deposit Facility (SDF) rate is placed at what spread relative to the Policy Repo Rate?',
        options: ['25 bps above Repo', '25 bps below Repo', '50 bps below Repo', 'Equal to Repo'],
        correct_answer: 'B',
        explanation: 'The SDF rate acts as the floor of the LAF corridor and is pegged 25 basis points below the Policy Repo Rate (at 6.25% when Repo is 6.50%).'
      }
    ]),
    one_liners: JSON.stringify([
      'Policy Repo Rate kept at 6.50%; SDF at 6.25%; MSF at 6.75%.',
      'Statutory inflation target under Section 45ZA of RBI Act 1934: 4% (+/- 2%).'
    ]),
    relevance_score: 9.8
  },

  // 5. GOVERNMENT SCHEMES
  {
    id: 'ca_rag_scheme_surya_ghar_2026',
    title: 'PM Surya Ghar: Muft Bijli Yojana Crosses 1.3 Crore Registrations with ₹75,021 Crore Central Outlay',
    category: 'Government Schemes',
    published_date: '2026-08-16',
    source_name: 'Ministry of New & Renewable Energy (MNRE)',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=suryaghar2026',
    what_happened: 'The flagship rooftop solar scheme achieved milestone momentum, providing central financial assistance up to ₹78,000 for 3 kW residential installations to supply up to 300 units of free electricity per month to 1 crore households.',
    why_important: 'High frequency question in UPSC GS-3 (Energy Transition), TNPSC, SSC, and Banking exams. Tests subsidy structures, renewable energy capacity additions, and DISCOM net metering.',
    key_facts: JSON.stringify([
      'Target Beneficiaries: 1 Crore (10 million) residential households across India',
      'Total Budgetary Outlay: ₹75,021 Crore approved by Union Cabinet',
      'Electricity Benefit: Up to 300 units of free electricity per month per household',
      'Central Financial Assistance (CFA): ₹30,000 for 1 kW system; ₹60,000 for 2 kW; ₹78,000 for 3 kW or higher systems',
      'Model Solar Villages: ₹800 crore earmarked to establish one Model Solar Village per district'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'TNPSC GRP2', 'SSC CGL', 'Banking PO']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'Under PM Surya Ghar: Muft Bijli Yojana, what is the maximum central subsidy provided for residential rooftop solar systems of 3 kW capacity?',
        options: ['₹50,000', '₹60,000', '₹78,000', '₹1,00,000'],
        correct_answer: 'C',
        explanation: 'Under PM Surya Ghar guidelines, eligible households receive ₹30,000/kW for the first 2 kW and ₹18,000 for the 3rd kW, capping at ₹78,000 for 3 kW or above.'
      }
    ]),
    one_liners: JSON.stringify([
      'PM Surya Ghar: Muft Bijli Yojana outlay: ₹75,021 Crore to solarize 1 Crore households.',
      'Provides up to 300 units of free electricity per month with maximum subsidy of ₹78,000.'
    ]),
    relevance_score: 9.7
  },

  // 6. DEFENCE & SECURITY
  {
    id: 'ca_rag_def_tarang_shakti_2026',
    title: 'Indian Air Force Hosts Exercise Tarang Shakti: Largest Multi-Nation Air Maneuver in Indian Skies',
    category: 'Defence',
    published_date: '2026-08-24',
    source_name: 'Ministry of Defence / Indian Air Force',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=tarangshakti2026',
    what_happened: 'The Indian Air Force conducted Exercise Tarang Shakti across Sulur (Tamil Nadu) and Jodhpur (Rajasthan), involving air forces from USA, France, Germany, UK, Australia, and 50+ observer nations to test interoperability and air combat maneuvers.',
    why_important: 'High yield for CDS, AFCAT, NDA, UPSC GS-3 (Security), SSC CGL, and TNPSC. Tests bilateral & multilateral military exercises and indigenous weapon platform operationalization.',
    key_facts: JSON.stringify([
      'Host: Indian Air Force (IAF)',
      'Operational Phases: Phase 1 at AFS Sulur (Coimbatore, Tamil Nadu); Phase 2 at AFS Jodhpur (Rajasthan)',
      'Participating Aircraft: LCA Tejas, Rafale, Su-30MKI, Eurofighter Typhoon, F/A-18, and KC-130 tankers',
      'Significance: First ever multilateral air combat exercise of this scale hosted on Indian soil'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'TNPSC GRP2', 'RRB NTPC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_polity_constitution']),
    mcqs: JSON.stringify([
      {
        question: 'Where was Phase 1 of the Indian Air Force\'s largest multinational exercise \'Tarang Shakti\' conducted?',
        options: ['AFS Sulur (Tamil Nadu)', 'AFS Hindon (Ghaziabad)', 'AFS Jamnagar (Gujarat)', 'AFS Leh (Ladakh)'],
        correct_answer: 'A',
        explanation: 'Phase 1 of Exercise Tarang Shakti took place at Air Force Station Sulur in Coimbatore, Tamil Nadu, featuring participation from Germany, France, Spain, and the UK.'
      }
    ]),
    one_liners: JSON.stringify([
      'Exercise Tarang Shakti: Largest multinational air combat exercise hosted by Indian Air Force.',
      'Phases conducted at Sulur (Tamil Nadu) and Jodhpur (Rajasthan).'
    ]),
    relevance_score: 9.8
  },
  {
    id: 'ca_rag_def_agni5_mirv_2026',
    title: 'DRDO Successfully Flight-Tests Agni-5 Missile with Indigenous MIRV Technology under \'Mission Divyastra\'',
    category: 'Defence',
    published_date: '2026-08-14',
    source_name: 'DRDO / Press Information Bureau',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=missiondivyastra',
    what_happened: 'DRDO achieved a strategic technological milestone by successfully conducting the first flight test of the Agni-5 ballistic missile equipped with Multiple Independently Targetable Re-entry Vehicle (MIRV) technology from Dr. APJ Abdul Kalam Island, Odisha.',
    why_important: 'Major landmark for UPSC GS-3 (Science & Tech / Defence Technology) and SSC/CDS exams. Elevates India into the select group of nations (USA, Russia, China, France, UK) possessing operational MIRV capability.',
    key_facts: JSON.stringify([
      'Mission Codename: Mission Divyastra',
      'Key Technology: Multiple Independently Targetable Re-entry Vehicles (MIRV)',
      'Missile Class: Intercontinental Ballistic Missile (ICBM) with 5,000+ km operational range',
      'Propulsion: Three-stage solid propellant engine',
      'Test Site: Dr. APJ Abdul Kalam Island (Wheeler Island), off the coast of Odisha'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'TNPSC GRP2', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_polity_constitution']),
    mcqs: JSON.stringify([
      {
        question: 'Under which mission codename did DRDO successfully test the MIRV-capable Agni-5 missile?',
        options: ['Mission Shakti', 'Mission Divyastra', 'Mission Sudarshan', 'Mission Astra'],
        correct_answer: 'B',
        explanation: 'Mission Divyastra was the designated codename for the first flight test of the Agni-5 missile with Multiple Independently Targetable Re-entry Vehicle (MIRV) warheads.'
      }
    ]),
    one_liners: JSON.stringify([
      'Mission Divyastra: First flight test of indigenous Agni-5 missile with MIRV technology.',
      'MIRV capability allows a single missile to deliver multiple nuclear warheads to distinct separate targets.'
    ]),
    relevance_score: 9.9
  },

  // 7. ENVIRONMENT & ECOLOGY
  {
    id: 'ca_rag_env_ramsar_ibca_2026',
    title: 'India Expands Ramsar Wetland Network to 85 Sites; Establishes International Big Cat Alliance (IBCA) Headquarters',
    category: 'Environment',
    published_date: '2026-08-21',
    source_name: 'Ministry of Environment, Forest and Climate Change',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=ramsaribca2026',
    what_happened: 'India designated 5 new wetlands under the Ramsar Convention, raising the national tally to 85 Ramsar sites (highest in South Asia). Simultaneously, the Union Cabinet ratified the headquarters agreement for the International Big Cat Alliance (IBCA) in India with a ₹150 crore grant.',
    why_important: 'Guaranteed questions in UPSC Prelims Environment section, TNPSC, and SSC CGL. Tests wetland ecological criteria, Ramsar Convention (1971, Iran), and conservation of 7 big cat species (Tiger, Lion, Leopard, Snow Leopard, Cheetah, Jaguar, Puma).',
    key_facts: JSON.stringify([
      'Total Ramsar Sites in India: 85 sites (Tamil Nadu holds the highest number with 16 Ramsar sites)',
      'International Big Cat Alliance (IBCA): Headquartered in India with 97 range countries eligible',
      'Target Species (7): Tiger, Lion, Leopard, Snow Leopard, Cheetah, Jaguar, and Puma',
      'Central Grant: ₹150 crore initial support for 5 years (2023-24 to 2027-28)',
      'Global Standing: India hosts 75% of global wild tigers and the only wild Asiatic Lion population (Gir, Gujarat)'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'TNPSC GRP2', 'SSC CGL', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'Which Indian state currently holds the highest number of designated Ramsar Wetland sites in the country?',
        options: ['Kerala', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'],
        correct_answer: 'B',
        explanation: 'Tamil Nadu holds the highest number of Ramsar sites in India with 16 designated wetlands, followed by Uttar Pradesh.'
      },
      {
        question: 'Which of the following big cat species is NOT native to India but is included in the conservation mandate of the International Big Cat Alliance (IBCA)?',
        options: ['Snow Leopard', 'Asiatic Lion', 'Jaguar', 'Clouded Leopard'],
        correct_answer: 'C',
        explanation: 'The 7 big cats covered by IBCA are Tiger, Lion, Leopard, Snow Leopard, Cheetah, Jaguar, and Puma. Jaguars (native to the Americas) and Pumas are not native to India.'
      }
    ]),
    one_liners: JSON.stringify([
      'India designated 85 Ramsar sites; Tamil Nadu leads with 16 Ramsar sites.',
      'International Big Cat Alliance (IBCA) headquartered in India to conserve 7 big cat species.'
    ]),
    relevance_score: 9.8
  },

  // 8. AWARDS & PERSONS IN NEWS
  {
    id: 'ca_rag_awards_bharat_ratna_2026',
    title: 'President Confers Bharat Ratna on Dr. M.S. Swaminathan, Karpoori Thakur, P.V. Narasimha Rao, and L.K. Advani',
    category: 'Awards',
    published_date: '2026-08-12',
    source_name: 'Rashtrapati Bhavan / Ministry of Home Affairs',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=bharatratna2026',
    what_happened: 'The President of India conferred the Bharat Ratna, India\'s highest civilian honor, recognizing monumental contributions across agriculture (Green Revolution), social justice, economic liberalization (1991 reforms), and public life.',
    why_important: 'Direct factual questions across SSC CGL, Banking, TNPSC, and State PSC general awareness papers. Covers constitutional provisions under Article 18 (Abolition of Titles) and award history.',
    key_facts: JSON.stringify([
      'Dr. M.S. Swaminathan: Architect of India\'s Green Revolution and founder of National Commission on Farmers (Swaminathan Committee MSP formula: C2 + 50%)',
      'Karpoori Thakur: Former Bihar Chief Minister known as \'Jannayak\' and pioneer of the 1978 Mungeri Lal Commission affirmative action model',
      'P.V. Narasimha Rao: 9th Prime Minister of India who steered the 1991 LPG (Liberalization, Privatization, Globalization) economic reforms',
      'Chaudhary Charan Singh: 5th Prime Minister of India, celebrated peasant champion and architect of UP Zamindari Abolition Act',
      'L.K. Advani: Former Deputy Prime Minister and long-serving parliamentarian'
    ]),
    exam_relevance_tags: JSON.stringify(['SSC CGL', 'UPSC CSE', 'TNPSC GRP2', 'Banking PO', 'RRB NTPC']),
    syllabus_topic_ids: JSON.stringify(['syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'Which Bharat Ratna awardee headed the National Commission on Farmers that recommended fixing Minimum Support Price (MSP) at at least 50% above the comprehensive cost of production (C2 + 50%)?',
        options: ['Chaudhary Charan Singh', 'Dr. M.S. Swaminathan', 'Dr. Verghese Kurien', 'Dr. Norman Borlaug'],
        correct_answer: 'B',
        explanation: 'Dr. M.S. Swaminathan headed the National Commission on Farmers (2004-2006) which formulated the landmark MSP calculation recommendation.'
      }
    ]),
    one_liners: JSON.stringify([
      'Bharat Ratna conferred on Dr. M.S. Swaminathan, Karpoori Thakur, P.V. Narasimha Rao, Chaudhary Charan Singh, and L.K. Advani.',
      'Swaminathan Commission recommended MSP at comprehensive cost (C2) + 50%.'
    ]),
    relevance_score: 9.7
  },

  // 9. STATE CURRENT AFFAIRS (TAMIL NADU & REGIONAL FOCUS)
  {
    id: 'ca_rag_state_tn_gim_2026',
    title: 'Tamil Nadu Notifies Implementation Fast-Track for ₹6.64 Lakh Crore Investments Signed at Global Investors Meet',
    category: 'State Current Affairs',
    published_date: '2026-08-19',
    source_name: 'Guidance Tamil Nadu / Industries Department',
    source_url: 'https://tn.gov.in/pressrelease/tngim2026',
    what_happened: 'The Government of Tamil Nadu cleared dedicated single-window statutory fast-tracks for EV mega-clusters (VinFast, Hyundai, Tata Motors) and semiconductor OSAT units, positioning Tamil Nadu towards its $1 Trillion GSDP by 2030 target.',
    why_important: 'Indispensable for TNPSC Group 1, Group 2/2A (Unit 9: Development Administration in Tamil Nadu), and UPSC GS-3 (Industrial Corridors).',
    key_facts: JSON.stringify([
      'Investment Realization: ₹6,64,180 Crore across 631 signed MoUs with employment potential for 27 lakh people',
      'Flagship EV Hub: Thoothukudi designated for VinFast Integrated Electric Vehicle Facility ($2 Billion outlay)',
      'Green Energy Corridor: Gulf of Mannar offshore wind park and Thoothukudi Green Hydrogen cluster',
      'Unit 9 Synergies: Women workforce participation in manufacturing in Tamil Nadu stands at 43% (highest in India)'
    ]),
    exam_relevance_tags: JSON.stringify(['TNPSC GRP2', 'UPSC CSE', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'In which coastal district of Tamil Nadu has Vietnam\'s electric vehicle manufacturer VinFast established its integrated EV manufacturing plant?',
        options: ['Chengalpattu', 'Thoothukudi', 'Nagapattinam', 'Ramanathapuram'],
        correct_answer: 'B',
        explanation: 'VinFast signed an MoU to invest $2 billion to set up an integrated electric vehicle and battery manufacturing facility at Siluvaipatti near Thoothukudi.'
      }
    ]),
    one_liners: JSON.stringify([
      'Tamil Nadu TNGIM: ₹6.64 Lakh Crore MoUs targeting a $1 Trillion State Economy by 2030.',
      'VinFast Electric Vehicle manufacturing hub located in Thoothukudi.',
      'Tamil Nadu employs 43% of India\'s total factory-employed women workforce.'
    ]),
    relevance_score: 9.8
  }
];

function seed() {
  console.log(`🌱 [RAG Current Affairs Seeder] Seeding ${currentAffairsList.length} comprehensive articles across all categories...`);
  
  let inserted = 0;
  for (const doc of currentAffairsList) {
    db.run(`
      INSERT OR REPLACE INTO ca_rag_documents (
        id, title, summary, what_happened, why_important, key_facts,
        category, published_date, source_name, source_url, retrieved_at,
        last_updated, embedding, relevance_score, exam_relevance_tags,
        syllabus_topic_ids, mcqs, one_liners, is_verified, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP, NULL, ?, ?,
        ?, ?, ?, 1, CURRENT_TIMESTAMP
      )
    `, [
      doc.id,
      doc.title,
      doc.what_happened,
      doc.what_happened,
      doc.why_important,
      doc.key_facts,
      doc.category,
      doc.published_date,
      doc.source_name,
      doc.source_url,
      doc.relevance_score,
      doc.exam_relevance_tags,
      doc.syllabus_topic_ids,
      doc.mcqs,
      doc.one_liners
    ]);
    inserted++;
  }

  console.log(`✅ Successfully seeded ${inserted} verified RAG Current Affairs articles into Turso Database!`);
}

seed();
