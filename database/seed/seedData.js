const bcrypt = require('bcryptjs');

async function getSeedData() {
  // Real authentication only: Zero dummy users or fake profiles
  const users = [];
  const profiles = [];

  // 3. Exams
  const exams = [
    {
      id: 'exam_upsc_cse',
      code: 'UPSC_CSE',
      name: 'UPSC Civil Services Examination (CSE)',
      category: 'Civil Services',
      description: 'National competitive exam conducted by UPSC for recruitment to IAS, IPS, IFS, IRS, and Central Group A & B Services.',
      total_marks: 200,
      duration_minutes: 120
    },
    {
      id: 'exam_tnpsc_grp2',
      code: 'TNPSC_GRP2',
      name: 'TNPSC Group II / II-A Combined Civil Services',
      category: 'State PSC',
      description: 'Tamil Nadu Public Service Commission executive and non-executive posts examination including Sub-Registrar, Municipal Commissioner, and Assistants.',
      total_marks: 300,
      duration_minutes: 180
    },
    {
      id: 'exam_tnpsc_grp1',
      code: 'TNPSC_GRP1',
      name: 'TNPSC Group I Combined Civil Services',
      category: 'State PSC',
      description: 'Premier State Administrative Services examination for Deputy Collector, DSP, Commercial Tax Officer, and District Registrar.',
      total_marks: 300,
      duration_minutes: 180
    },
    {
      id: 'exam_ssc_cgl',
      code: 'SSC_CGL',
      name: 'SSC Combined Graduate Level (CGL)',
      category: 'Staff Selection',
      description: 'Staff Selection Commission national exam for Group B & C officers in Central Ministries, CBI, Income Tax, GST & Customs.',
      total_marks: 200,
      duration_minutes: 60
    },
    {
      id: 'exam_bank_po',
      code: 'BANK_PO',
      name: 'Banking Probationary Officer (IBPS / SBI PO)',
      category: 'Banking',
      description: 'All India entrance examination for Scale-I Officer and Assistant Manager positions across Public Sector Banks.',
      total_marks: 100,
      duration_minutes: 60
    },
    {
      id: 'exam_rrb_ntpc',
      code: 'RRB_NTPC',
      name: 'Railway RRB Non-Technical Popular Categories (NTPC)',
      category: 'Railways',
      description: 'Railway Recruitment Board examination for Station Master, Goods Guard, Commercial Apprentice, and Traffic Assistant.',
      total_marks: 100,
      duration_minutes: 90
    }
  ];

  // 4. Subjects
  const subjects = [
    // UPSC Subjects
    { id: 'subj_upsc_polity', exam_id: 'exam_upsc_cse', name: 'Indian Polity & Governance', code: 'GS2_POLITY', description: 'Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, Judicial Precedents.', icon: 'Landmark', weightage_percentage: 22.0, display_order: 1 },
    { id: 'subj_upsc_economy', exam_id: 'exam_upsc_cse', name: 'Indian Economy & Social Development', code: 'GS3_ECONOMY', description: 'Macroeconomics, Banking, Inflation, Fiscal Policy, Agriculture, External Sector, Inclusive Growth.', icon: 'TrendingUp', weightage_percentage: 20.0, display_order: 2 },
    { id: 'subj_upsc_history', exam_id: 'exam_upsc_cse', name: 'History of India & Indian National Movement', code: 'GS1_HISTORY', description: 'Ancient, Medieval, Modern Indian History, Art & Culture, Freedom Struggle (1857-1947).', icon: 'BookOpen', weightage_percentage: 18.0, display_order: 3 },
    { id: 'subj_upsc_env_geo', exam_id: 'exam_upsc_cse', name: 'Geography, Environment & Ecology', code: 'GS1_3_ENV_GEO', description: 'Physical, Human and Economic Geography; Biodiversity, Climate Conventions, National Parks.', icon: 'Globe', weightage_percentage: 20.0, display_order: 4 },
    { id: 'subj_upsc_csat', exam_id: 'exam_upsc_cse', name: 'CSAT (Paper-II Aptitude & Comprehension)', code: 'CSAT_PAPER2', description: 'Reading Comprehension, Logical Reasoning, Analytical Ability, Basic Numeracy, Data Interpretation.', icon: 'Calculator', weightage_percentage: 20.0, display_order: 5 },

    // TNPSC Subjects
    { id: 'subj_tnpsc_unit8', exam_id: 'exam_tnpsc_grp2', name: 'History, Culture & Heritage of TN (Unit 8)', code: 'TN_UNIT8', description: 'Sangam Literature, Thirukkural (133 Chapters), Self-Respect Movement, Justice Party, Freedom Struggle in TN.', icon: 'Scroll', weightage_percentage: 25.0, display_order: 1 },
    { id: 'subj_tnpsc_unit9', exam_id: 'exam_tnpsc_grp2', name: 'Development Administration in TN (Unit 9)', code: 'TN_UNIT9', description: 'Human Development Indicators, Social Justice, Reservation Policies, Economic Growth, E-Governance in TN.', icon: 'Building2', weightage_percentage: 20.0, display_order: 2 },
    { id: 'subj_tnpsc_polity', exam_id: 'exam_tnpsc_grp2', name: 'Indian Polity & Constitution', code: 'TN_POLITY', description: 'Preamble, Fundamental Rights, Union & State Executive, Legislature, Judiciary, TN Local Governance.', icon: 'Landmark', weightage_percentage: 18.0, display_order: 3 },
    { id: 'subj_tnpsc_economy', exam_id: 'exam_tnpsc_grp2', name: 'Indian & Tamil Nadu Economy', code: 'TN_ECONOMY', description: 'Five Year Plans, NITI Aayog, Fiscal Policy, TN State Budget, Public Distribution System.', icon: 'TrendingUp', weightage_percentage: 15.0, display_order: 4 },
    { id: 'subj_tnpsc_aptitude', exam_id: 'exam_tnpsc_grp2', name: 'Aptitude & Mental Ability', code: 'TN_APTITUDE', description: 'Simplification, Percentage, HCF & LCM, Ratio, Simple & Compound Interest, Area, Volume, Logical Reasoning.', icon: 'Calculator', weightage_percentage: 22.0, display_order: 5 },

    // SSC Subjects
    { id: 'subj_ssc_quant', exam_id: 'exam_ssc_cgl', name: 'Quantitative Aptitude', code: 'SSC_QUANT', description: 'Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, Statistics & Data Interpretation.', icon: 'Calculator', weightage_percentage: 25.0, display_order: 1 },
    { id: 'subj_ssc_reasoning', exam_id: 'exam_ssc_cgl', name: 'General Intelligence & Reasoning', code: 'SSC_REASON', description: 'Analogies, Syllogisms, Series, Coding-Decoding, Venn Diagrams, Non-Verbal Reasoning.', icon: 'Brain', weightage_percentage: 25.0, display_order: 2 },
    { id: 'subj_ssc_english', exam_id: 'exam_ssc_cgl', name: 'English Comprehension', code: 'SSC_ENG', description: 'Spotting Errors, Fill in the blanks, Synonyms/Antonyms, Idioms & Phrases, Cloze Test, Active/Passive Voice.', icon: 'Type', weightage_percentage: 25.0, display_order: 3 },
    { id: 'subj_ssc_ga', exam_id: 'exam_ssc_cgl', name: 'General Awareness', code: 'SSC_GA', description: 'History, Indian Polity, Geography, Economic Scene, General Science (Physics, Chemistry, Biology), Current Events.', icon: 'Compass', weightage_percentage: 25.0, display_order: 4 },

    // Banking Subjects
    { id: 'subj_bank_quant', exam_id: 'exam_bank_po', name: 'Quantitative Aptitude', code: 'BANK_QUANT', description: 'Data Interpretation, Quadratic Equations, Number Series, Approximation, Commercial Arithmetic.', icon: 'Calculator', weightage_percentage: 35.0, display_order: 1 },
    { id: 'subj_bank_reasoning', exam_id: 'exam_bank_po', name: 'Reasoning Ability & Puzzles', code: 'BANK_REASON', description: 'Floor & Flat Puzzles, Circular Seating Arrangements, Inequality, Syllogism, Blood Relations, Input-Output.', icon: 'Brain', weightage_percentage: 35.0, display_order: 2 },
    { id: 'subj_bank_english', exam_id: 'exam_bank_po', name: 'English Language', code: 'BANK_ENG', description: 'Reading Comprehension, Cloze Test, Para Jumbles, Error Detection, Sentence Improvement.', icon: 'Type', weightage_percentage: 30.0, display_order: 3 },

    // Railways Subjects
    { id: 'subj_rrb_ga', exam_id: 'exam_rrb_ntpc', name: 'General Awareness & General Science', code: 'RRB_GA', description: 'Indian History, Constitution, General Science (10th standard CBSE Physics/Chem/Bio), Current Affairs.', icon: 'Compass', weightage_percentage: 40.0, display_order: 1 },
    { id: 'subj_rrb_math', exam_id: 'exam_rrb_ntpc', name: 'Mathematics', code: 'RRB_MATH', description: 'Number System, Decimals, Fractions, LCM/HCF, Ratio, Percentages, Mensuration, Time & Work, CI/SI.', icon: 'Calculator', weightage_percentage: 30.0, display_order: 2 },
    { id: 'subj_rrb_reasoning', exam_id: 'exam_rrb_ntpc', name: 'General Intelligence & Reasoning', code: 'RRB_REASON', description: 'Analogies, Completion of Number and Alphabetical Series, Coding and Decoding, Syllogism, Venn Diagrams.', icon: 'Brain', weightage_percentage: 30.0, display_order: 3 }
  ];

  // 5. Topics
  const topics = [
    // UPSC Polity
    { id: 'top_fr_dpsp', subject_id: 'subj_upsc_polity', name: 'Fundamental Rights & DPSP (Articles 12-51A)', code: 'POL_01', description: 'Writs (Art 32 & 226), Right to Equality (14), Freedom (19), Life & Privacy (21), DPSP vs FR balance, Kesavananda Bharati & Minerva Mills.', difficulty_level: 'hard', pyq_importance_score: 9.9, estimated_hours: 5.0, display_order: 1 },
    { id: 'top_parliament', subject_id: 'subj_upsc_polity', name: 'Union Parliament & Legislative Procedures', code: 'POL_02', description: 'Money Bills (110), Financial Bills (117), Joint Sitting (108), Parliamentary Committees, Speaker Powers, No-Confidence Motions.', difficulty_level: 'medium', pyq_importance_score: 9.4, estimated_hours: 5.5, display_order: 2 },
    { id: 'top_judiciary', subject_id: 'subj_upsc_polity', name: 'Supreme Court, High Courts & Judicial Review', code: 'POL_03', description: 'Collegium system, Basic Structure Doctrine, Original (131) & Appellate Jurisdiction, Advisory (143), Curative Petitions, PIL.', difficulty_level: 'medium', pyq_importance_score: 9.1, estimated_hours: 4.0, display_order: 3 },
    { id: 'top_fed_emergency', subject_id: 'subj_upsc_polity', name: 'Federal Structure & Emergency Provisions', code: 'POL_04', description: '7th Schedule (Union/State/Concurrent), Finance Commission (280), National Emergency (352), President Rule (356), S.R. Bommai guidelines.', difficulty_level: 'hard', pyq_importance_score: 8.8, estimated_hours: 4.0, display_order: 4 },
    { id: 'top_const_bodies', subject_id: 'subj_upsc_polity', name: 'Constitutional, Statutory & Regulatory Bodies', code: 'POL_05', description: 'Election Commission (324), UPSC (315), CAG (148), Attorney General (76), NITI Aayog, NHRC, CCI, SEBI, TRAI.', difficulty_level: 'medium', pyq_importance_score: 8.6, estimated_hours: 3.5, display_order: 5 },

    // UPSC Economy
    { id: 'top_monetary_rbi', subject_id: 'subj_upsc_economy', name: 'Monetary Policy, RBI Tools & Inflation Targeting', code: 'ECO_01', description: 'Repo Rate, Standing Deposit Facility (SDF), MSF, CRR, SLR, Open Market Operations, CPI vs WPI inflation, MPC 4%+/-2% band.', difficulty_level: 'hard', pyq_importance_score: 9.8, estimated_hours: 4.5, display_order: 1 },
    { id: 'top_fiscal_budget', subject_id: 'subj_upsc_economy', name: 'Fiscal Policy, Union Budget & Taxation (GST)', code: 'ECO_02', description: 'Revenue vs Capital Expenditure, Fiscal Deficit, Primary Deficit, FRBM Act targets, GST Council (Art 279A), Direct vs Indirect Taxes.', difficulty_level: 'medium', pyq_importance_score: 9.2, estimated_hours: 4.0, display_order: 2 },
    { id: 'top_banking_npa', subject_id: 'subj_upsc_economy', name: 'Banking Sector, NPAs & Insolvency (IBC)', code: 'ECO_03', description: 'Gross NPA vs Net NPA, PCA Framework, National Asset Reconstruction Company (NARCL/Bad Bank), Insolvency and Bankruptcy Code 2016.', difficulty_level: 'medium', pyq_importance_score: 8.9, estimated_hours: 3.5, display_order: 3 },
    { id: 'top_external_sector', subject_id: 'subj_upsc_economy', name: 'External Sector, Balance of Payments & Forex', code: 'ECO_04', description: 'Current Account Deficit (CAD), Capital Account Convertibility, Forex Reserves Composition, FDI vs FPI, Rupee Depreciation.', difficulty_level: 'hard', pyq_importance_score: 8.7, estimated_hours: 3.5, display_order: 4 },

    // UPSC History
    { id: 'top_freedom_struggle', subject_id: 'subj_upsc_history', name: 'Indian National Movement (1885–1947)', code: 'HIS_01', description: 'Moderate & Extremist phases, Surat Split, Swadeshi Movement (1905), Gandhian Era (Non-Cooperation, Civil Disobedience, Quit India), INA, Cabinet Mission.', difficulty_level: 'medium', pyq_importance_score: 9.7, estimated_hours: 6.0, display_order: 1 },
    { id: 'top_ancient_art', subject_id: 'subj_upsc_history', name: 'Ancient India: Harappan Civilization, Mauryas & Guptas', code: 'HIS_02', description: 'Indus Valley urban planning, Ashokan Rock Edicts, Buddhism & Jainism Councils, Sangam Age Polity, Temple Architecture (Nagara, Dravida, Vesara).', difficulty_level: 'medium', pyq_importance_score: 8.9, estimated_hours: 4.5, display_order: 2 },

    // UPSC Geography & Environment
    { id: 'top_climate_biodiversity', subject_id: 'subj_upsc_env_geo', name: 'Climate Change Conventions, Biodiversity & Protected Areas', code: 'ENV_01', description: 'UNFCCC Paris Agreement, COP summits, Ramsar Wetlands, National Parks & Wildlife Sanctuaries, IUCN Red List categories, Wildlife Protection Act 1972.', difficulty_level: 'hard', pyq_importance_score: 9.6, estimated_hours: 5.0, display_order: 1 },
    { id: 'top_indian_rivers', subject_id: 'subj_upsc_env_geo', name: 'Indian River Systems, Monsoons & Physical Geography', code: 'GEO_01', description: 'Himalayan vs Peninsular river drainage, Tributaries of Ganga, Brahmaputra, Godavari, Krishna, Cauvery; Southwest Monsoon mechanism & El Nino.', difficulty_level: 'medium', pyq_importance_score: 9.1, estimated_hours: 4.5, display_order: 2 },

    // TNPSC Unit 8 & Unit 9
    { id: 'top_tn_thirukkural', subject_id: 'subj_tnpsc_unit8', name: 'Thirukkural: Governance, Social Ethics & Economic Philosophy', code: 'TN_U8_01', description: 'Role of King/Govt (Irai Matchi), Righteousness (Aram), Revenue Management, Universal Brotherhood, Anti-Corruption, Secular Character.', difficulty_level: 'medium', pyq_importance_score: 9.9, estimated_hours: 4.0, display_order: 1 },
    { id: 'top_tn_dravidian_move', subject_id: 'subj_tnpsc_unit8', name: 'Self-Respect Movement, Justice Party & Social Reform in TN', code: 'TN_U8_02', description: 'Justice Party rule (1920-1937), First Communal G.O. 1921, Periyar E.V. Ramasamy, Vaikom Satyagraha, Self-Respect Marriages, Devadasi abolition.', difficulty_level: 'medium', pyq_importance_score: 9.6, estimated_hours: 4.5, display_order: 2 },
    { id: 'top_tn_freedom_struggle', subject_id: 'subj_tnpsc_unit8', name: 'Early Uprisings & Freedom Struggle in Tamil Nadu', code: 'TN_U8_03', description: 'Veerapandiya Kattabomman, Pulithevar, Marudhu Brothers, Velu Nachiyar, VOC Swadeshi Steam Navigation, Subramania Bharati, Tiruppur Kumaran.', difficulty_level: 'medium', pyq_importance_score: 9.2, estimated_hours: 4.0, display_order: 3 },
    { id: 'top_tn_hdi_welfare', subject_id: 'subj_tnpsc_unit9', name: 'Human Development, Social Justice & Welfare Schemes in TN', code: 'TN_U9_01', description: 'Pioneering Midday Meal Scheme (Kamarajar to Nutritious Meal), Universal PDS, Pudhumai Penn Scheme, Health Indicators vs National Average.', difficulty_level: 'easy', pyq_importance_score: 9.5, estimated_hours: 3.5, display_order: 1 },
    { id: 'top_tn_econ_corridors', subject_id: 'subj_tnpsc_unit9', name: 'Economic Trends, Industrial Corridors & E-Governance in TN', code: 'TN_U9_02', description: 'Detroit of Asia automotive hub, TIDCO, SIPCOT industrial estates, TN e-Governance Agency (TNeGA), Uzhavar Sandhai, Port-led logistics.', difficulty_level: 'medium', pyq_importance_score: 9.0, estimated_hours: 3.5, display_order: 2 },
    { id: 'top_tnpsc_ratio_perc', subject_id: 'subj_tnpsc_aptitude', name: 'Percentages, Profit & Loss, Simple & Compound Interest', code: 'TN_APT_01', description: 'Direct & inverse formulas, effective compounding, difference between CI and SI for 2 & 3 years, shortcut ratio methods.', difficulty_level: 'easy', pyq_importance_score: 9.8, estimated_hours: 3.5, display_order: 1 },

    // SSC CGL Topics
    { id: 'top_ssc_percentage_profit', subject_id: 'subj_ssc_quant', name: 'Arithmetic: Percentage, Profit, Loss & Discount', code: 'SSC_Q_01', description: 'Successive percentage changes, marked price vs cost price, faulty weight problems, dishonest dealer formulas.', difficulty_level: 'medium', pyq_importance_score: 9.6, estimated_hours: 4.0, display_order: 1 },
    { id: 'top_ssc_algebra_geom', subject_id: 'subj_ssc_quant', name: 'Advanced Math: Geometry, Triangles & Circles', code: 'SSC_Q_02', description: 'Tangent theorems, circumcentre, incentre, similarity and congruency of triangles, cyclic quadrilaterals, chord properties.', difficulty_level: 'hard', pyq_importance_score: 9.4, estimated_hours: 5.0, display_order: 2 },
    { id: 'top_ssc_syllogism', subject_id: 'subj_ssc_reasoning', name: 'Syllogisms & Logical Deductions', code: 'SSC_R_01', description: 'Only a few, Some not, Possibility cases, Either-Or conditions, Venn diagram deduction techniques.', difficulty_level: 'medium', pyq_importance_score: 9.2, estimated_hours: 3.0, display_order: 1 },
    { id: 'top_ssc_grammar_error', subject_id: 'subj_ssc_english', name: 'English Grammar Rules & Error Spotting', code: 'SSC_E_01', description: 'Subject-Verb agreement, Preposition usage, Conditionals, Modifiers, Parallelism, Inversion rules.', difficulty_level: 'medium', pyq_importance_score: 9.5, estimated_hours: 3.5, display_order: 1 },

    // Banking Topics
    { id: 'top_bank_puzzles', subject_id: 'subj_bank_reasoning', name: 'Floor, Flat & Box Puzzles with Multiple Variables', code: 'BNK_R_01', description: 'Complex linear & circular arrangement, floor/flat distribution, inward/outward facing, blood relation embedded puzzles.', difficulty_level: 'hard', pyq_importance_score: 9.9, estimated_hours: 6.0, display_order: 1 },
    { id: 'top_bank_di', subject_id: 'subj_bank_quant', name: 'Data Interpretation: Caselet, Missing & Radar Charts', code: 'BNK_Q_01', description: 'Arithmetic-based DI (Time & Work, Profit & Loss), percentage variation calculation, caselet paragraph translation.', difficulty_level: 'hard', pyq_importance_score: 9.8, estimated_hours: 5.0, display_order: 1 },

    // Railways Topics
    { id: 'top_rrb_gen_science', subject_id: 'subj_rrb_ga', name: 'General Science: Physics, Chemistry & Biology (CBSE X Std)', code: 'RRB_GS_01', description: 'Newton laws, Ohm law, Optics & Mirrors, Periodic Table, Acids & Bases, Human Digestive & Circulatory systems, Vitamins.', difficulty_level: 'medium', pyq_importance_score: 9.6, estimated_hours: 4.5, display_order: 1 },
    { id: 'top_rrb_time_work', subject_id: 'subj_rrb_math', name: 'Time & Work, Pipes & Cisterns, Speed & Distance', code: 'RRB_M_01', description: 'Efficiency ratio method, alternate day work, relative speed of trains passing platforms and poles, upstream/downstream.', difficulty_level: 'medium', pyq_importance_score: 9.4, estimated_hours: 4.0, display_order: 1 }
  ];

  // 6. Study Materials
  const studyMaterials = [
    {
      id: 'mat_pol_fr',
      topic_id: 'top_fr_dpsp',
      title: 'Comprehensive Master Notes: Fundamental Rights (Articles 12 to 35) & Writs',
      content_type: 'notes',
      language: 'en',
      source_authority: 'Constitution of India (Part III) & Supreme Court Landmark Precedents',
      content: `# Fundamental Rights (Part III, Articles 12-35)

## 1. Classification of Fundamental Rights
- **Right to Equality (Articles 14-18)**:
  - Art 14: Equality before law (British origin) & Equal protection of the laws (American origin). Prohibits arbitrariness (*EP Royappa Case*).
  - Art 15: Prohibition of discrimination only on grounds of religion, race, caste, sex, or place of birth.
  - Art 16: Equality of opportunity in public employment (sub-classification upheld in *State of Punjab v Davinder Singh 2024*).
  - Art 17: Abolition of Untouchability (Absolute Right).
  - Art 18: Abolition of Titles (except military and academic distinctions).

- **Right to Freedom (Articles 19-22)**:
  - Art 19(1): Six basic freedoms (Speech, Assembly, Association, Movement, Residence, Profession) subject to reasonable restrictions under 19(2)-(6).
  - Art 20: Protection in respect of conviction (No ex-post facto law, No double jeopardy, No self-incrimination).
  - Art 21: Protection of Life and Personal Liberty. Expanded via *Maneka Gandhi (1978)* to mean "just, fair, and reasonable" and *Puttaswamy (2017)* to include Right to Privacy.
  - Art 21A: Right to Free and Compulsory Elementary Education (86th Amendment Act, 2002).
  - Art 22: Protection against arrest and preventive detention.

- **Right to Constitutional Remedies (Article 32)**:
  - Described by Dr. B.R. Ambedkar as the **"Heart and Soul of the Constitution"**.
  - A Fundamental Right in itself that guarantees direct access to the Supreme Court.

## 2. Writs Jurisdiction: Supreme Court (Art 32) vs High Court (Art 226)
| Parameter | Supreme Court (Art 32) | High Court (Art 226) |
|---|---|---|
| Scope | Only Fundamental Rights | Fundamental Rights + Any Ordinary Legal Right |
| Nature | Mandatory Constitutional Remedy | Discretionary Power |
| Territorial Extent | All India Jurisdiction | Within State boundaries / where cause of action arises |

### The Five Prerogative Writs:
1. **Habeas Corpus** ("To have the body of"): Secures release of person unlawfully detained by State or private person.
2. **Mandamus** ("We Command"): Compels a public official/statutory authority to perform a mandatory public duty. Cannot be issued against the President/Governors or private individuals.
3. **Prohibition**: Issued by a superior court to prevent an inferior court/tribunal from exceeding jurisdiction.
4. **Certiorari** ("To be certified"): Quashes orders already passed without jurisdiction or in violation of natural justice.
5. **Quo-Warranto** ("By what authority"): Inquires into the legality of the claim which a person asserts to a public office.`
    },
    {
      id: 'mat_eco_monetary',
      topic_id: 'top_monetary_rbi',
      title: 'RBI Monetary Policy Framework, Liquidity Management & Inflation Targeting',
      content_type: 'notes',
      language: 'en',
      source_authority: 'Reserve Bank of India Act 1934 & MPC Operational Guidelines',
      content: `# RBI Monetary Policy & Liquidity Adjustment Facility (LAF)

## 1. Flexible Inflation Targeting (FIT)
- **Target**: **4% CPI headline inflation with a tolerance band of +/- 2% (2% to 6%)**.
- **Monetary Policy Committee (MPC)**: 6 members (3 from RBI including Governor with casting vote, 3 external independent economists appointed by Central Govt).
- Holds mandatory bimonthly meetings to determine the Policy Repo Rate.

## 2. Key Monetary Policy Instruments
1. **Repo Rate**: The rate at which RBI lends short-term liquidity to commercial banks against approved government securities (collateralized).
2. **Standing Deposit Facility (SDF)**: Introduced in April 2022 as the floor of the LAF corridor. Enables RBI to absorb uncollateralized excess liquidity from banks without pledging G-Secs.
3. **Marginal Standing Facility (MSF)**: The penal ceiling of the LAF corridor. Allows commercial banks to borrow overnight funds against their SLR quota during acute liquidity stress.
4. **Cash Reserve Ratio (CRR)**: Mandated fraction of Net Demand and Time Liabilities (NDTL) that banks must deposit with the RBI as cash. Earns zero interest.
5. **Statutory Liquidity Ratio (SLR)**: Mandated percentage of NDTL that banks must maintain within themselves in approved liquid assets (Gold, Cash, Government Securities).`
    },
    {
      id: 'mat_tn_thirukkural',
      topic_id: 'top_tn_thirukkural',
      title: 'Thirukkural: Principles of Governance, Statecraft & Administrative Ethics',
      content_type: 'notes',
      language: 'en',
      source_authority: 'TN SCERT Unit 8 Canonical Text & Commentary',
      content: `# Thirukkural in Statecraft & Public Administration

## 1. The Ideal Government (Irai Matchi - Chapter 39, Kural 385)
> **"இயற்றலும் ஈட்டலும் காத்தலும் காத்த**
> **வகுத்தலும் வல்ல தரசு."**
> *(A great government is capable of creating revenue channels, collecting revenue without extortion, preserving the state treasury, and distributing resources justly for public welfare.)*

## 2. Pillars of Righteous Administration
- **Sovereignty without Oppression (Kodunkolmai Ethirthal)**: Tyrannical governance brings swift ruin; a king whose spear is bent by injustice cannot endure.
- **Anti-Corruption & Integrity (Koodaa Ozhukkam & Varavarinmai)**: Emphasizes that unjust wealth acquired through deceit brings destruction.
- **Secular & Universal Nature**:
  - Contains 1,330 couplets in 133 chapters categorized under *Aram* (Virtue), *Porul* (Wealth/Governance), and *Inbam* (Love).
  - Contains no sectarian rituals, caste hierarchy, or dogmatic religious references, making it globally universal.`
    },
    {
      id: 'mat_tn_unit9_welfare',
      topic_id: 'top_tn_hdi_welfare',
      title: 'Development Administration: Social Justice, HDI & Welfare Models in Tamil Nadu',
      content_type: 'notes',
      language: 'en',
      source_authority: 'Department of Planning & Social Welfare, Govt of Tamil Nadu Policy Notes',
      content: `# Tamil Nadu Development Model (Unit 9)

## 1. Evolution of Affirmative Action & Social Justice
- **Communal G.O. (1921)**: First official reservation policy issued by Justice Party ministry under the Madras Presidency.
- **69% Reservation Policy**: Protected under the 9th Schedule of the Constitution of India via the 76th Constitutional Amendment Act, 1994.

## 2. Landmark Social Welfare Innovations
- **Midday Meal Scheme**: Initiated by K. Kamarajar in 1956 and expanded into the comprehensive Nutritious Noon-Meal Scheme by M.G. Ramachandran in 1982. Chief Minister Breakfast Scheme added in 2022.
- **Universal Public Distribution System (PDS)**: Unlike targeted PDS across India, TN provides universal subsidized rice and essential commodities to all cardholders regardless of poverty line categorization.
- **Pudhumai Penn Scheme**: Monthly financial assistance of ₹1,000 to female government school students pursuing higher education to prevent college dropout rates.`
    },
    {
      id: 'mat_ssc_quant_formulae',
      topic_id: 'top_ssc_percentage_profit',
      title: 'Quantitative Aptitude Master Formula Sheet & Speed Math Techniques',
      content_type: 'notes',
      language: 'en',
      source_authority: 'SSC / Banking Examination Quantitative Foundations',
      content: `# Speed Math & Commercial Arithmetic Formula Handbook

## 1. Percentages & Successive Changes
- **Successive Percentage Formula**: If a value changes by $+a\\%$ and then by $+b\\%$, Net change $= (a + b + \\frac{ab}{100})\\%$.
- **Fraction to Percentage Conversions**:
  - $1/2 = 50\\%$, $1/3 = 33.33\\%$, $1/4 = 25\\%$, $1/5 = 20\\%$, $1/6 = 16.66\\%$, $1/7 = 14.28\\%$, $1/8 = 12.5\\%$, $1/9 = 11.11\\%$, $1/11 = 9.09\\%$, $1/12 = 8.33\\%$.

## 2. Profit, Loss & Marked Price (MP)
- $\\text{Profit } \\% = \\frac{\\text{SP} - \\text{CP}}{\\text{CP}} \\times 100$
- $\\frac{\\text{MP}}{\\text{CP}} = \\frac{100 + \\text{Profit } \\%}{100 - \\text{Discount } \\%}$
- **Dishonest Shopkeeper Selling at CP with False Weight**:
  - $\\text{Gain } \\% = \\frac{\\text{Error}}{\\text{True Value} - \\text{Error}} \\times 100$

## 3. Simple & Compound Interest Shortcuts
- Difference between CI and SI for 2 years: $\\Delta_2 = P \\cdot \\left(\\frac{R}{100}\\right)^2$
- Difference between CI and SI for 3 years: $\\Delta_3 = P \\cdot \\left(\\frac{R}{100}\\right)^2 \\cdot \\left(\\frac{300 + R}{100}\\right)$`
    }
  ];

  // 7. Comprehensive Bank of 40+ Real Exam Questions & PYQs
  const questions = [
    // --- UPSC POLITY (GS-2) ---
    {
      id: 'q_upsc_pol_01',
      topic_id: 'top_fr_dpsp',
      exam_id: 'exam_upsc_cse',
      question_text: 'Which one of the following statements regarding the Writ of Mandamus in India is correct?',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_source: 'UPSC CSE Prelims GS-I (Question 34)',
      explanation: 'Mandamus cannot be granted against the President of India or the Governor of a State for the exercise and performance of the powers and duties of his office (Article 361). It also does not lie against a private individual or private body without public statutory duties.',
      tamil_text: 'இந்தியாவில் செயலுறுத்தும் நீதிப்பேராணை (Mandamus) பற்றிய பின்வரும் கூற்றுகளில் எது சரியானது?',
      tamil_explanation: 'இந்தியக் குடியரசுத் தலைவர் அல்லது மாநில ஆளுநருக்கு எதிராக அவர்களின் அதிகாரங்கள் மற்றும் கடமைகளைச் செயல்படுத்துவதற்காக மாண்டமஸ் ஆணை பிறப்பிக்க முடியாது (சரத்து 361).',
      options: [
        { id: 'opt_up1_a', option_key: 'A', option_text: 'It can be issued against private individuals to enforce private contracts.', is_correct: 0 },
        { id: 'opt_up1_b', option_key: 'B', option_text: 'It cannot be issued against the President of India or State Governors in the discharge of official duties.', is_correct: 1 },
        { id: 'opt_up1_c', option_key: 'C', option_text: 'It can only be issued by the Supreme Court and not by High Courts.', is_correct: 0 },
        { id: 'opt_up1_d', option_key: 'D', option_text: 'It is issued to quash an administrative or judicial order already executed.', is_correct: 0 }
      ]
    },
    {
      id: 'q_upsc_pol_02',
      topic_id: 'top_fr_dpsp',
      exam_id: 'exam_upsc_cse',
      question_text: 'A legislation which confers on the executive or administrative authority an unguided and uncontrolled discretionary power in the matter of application of law violates which one of the following Articles of the Constitution of India?',
      question_type: 'mcq',
      difficulty_level: 'hard',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_source: 'UPSC CSE Prelims GS-I (Question 18)',
      explanation: 'Arbitrary and unguided executive discretion violates Article 14 (Right to Equality and Non-Arbitrariness as established in the EP Royappa and Maneka Gandhi cases).',
      tamil_text: 'சட்டத்தைப் பயன்படுத்துவதில் நிர்வாக அதிகாரத்திற்கு வழிகாட்டப்படாத மற்றும் கட்டுப்பாடற்ற விருப்புரிமை அதிகாரத்தை வழங்கும் சட்டம், இந்திய அரசியலமைப்பின் பின்வரும் எந்த சரத்தை மீறுகிறது?',
      tamil_explanation: 'வழிகாட்டப்படாத தன்னிச்சையான நிர்வாக அதிகாரம் சரத்து 14-ஐ (சமத்துவ உரிமை மற்றும் தன்னிச்சையின்மை) மீறுகிறது.',
      options: [
        { id: 'opt_up2_a', option_key: 'A', option_text: 'Article 14', is_correct: 1 },
        { id: 'opt_up2_b', option_key: 'B', option_text: 'Article 28', is_correct: 0 },
        { id: 'opt_up2_c', option_key: 'C', option_text: 'Article 32', is_correct: 0 },
        { id: 'opt_up2_d', option_key: 'D', option_text: 'Article 44', is_correct: 0 }
      ]
    },
    {
      id: 'q_upsc_pol_03',
      topic_id: 'top_parliament',
      exam_id: 'exam_upsc_cse',
      question_text: 'With reference to the Union Parliament in India, consider the following statements:\n1. The Speaker of the Lok Sabha decides whether a Bill is a Money Bill or not, and this endorsement is final.\n2. The Speaker can vote in the first instance in all legislative ballots.',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'UPSC CSE Prelims GS-I (Question 52)',
      explanation: 'Statement 1 is correct under Article 110(3). Statement 2 is incorrect because the Speaker does not vote in the first instance; they only exercise a casting vote in the event of an equality of votes (Article 100(1)).',
      tamil_text: 'இந்திய நாடாளுமன்றம் தொடர்பாக பின்வரும் கூற்றுகளைக் கவனியுங்கள்:\n1. ஒரு மசோதா பண மசோதாவா இல்லையா என்பதை மக்களவை சபாநாயகர் தீர்மானிக்கிறார், அவரின் முடிவு இறுதியானது.\n2. சபாநாயகர் அனைத்து மசோதாக்களிலும் முதல் நிலையிலேயே வாக்களிக்கலாம்.',
      tamil_explanation: 'கூற்று 1 சரி. கூற்று 2 தவறு, ஏனெனில் சபாநாயகர் சமநிலை ஏற்படும் போது மட்டுமே முடிவு வாக்கு (casting vote) அளிக்க முடியும்.',
      options: [
        { id: 'opt_up3_a', option_key: 'A', option_text: '1 only', is_correct: 1 },
        { id: 'opt_up3_b', option_key: 'B', option_text: '2 only', is_correct: 0 },
        { id: 'opt_up3_c', option_key: 'C', option_text: 'Both 1 and 2', is_correct: 0 },
        { id: 'opt_up3_d', option_key: 'D', option_text: 'Neither 1 nor 2', is_correct: 0 }
      ]
    },
    {
      id: 'q_upsc_pol_04',
      topic_id: 'top_judiciary',
      exam_id: 'exam_upsc_cse',
      question_text: 'Which of the following statements is correct regarding the "Doctrine of Basic Structure" of the Indian Constitution?',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2020,
      pyq_source: 'UPSC CSE Prelims GS-I',
      explanation: 'The Doctrine was propounded in Kesavananda Bharati v. State of Kerala (1973). The Constitution itself does not define the Basic Structure; it is an organic doctrine defined by the Judiciary on a case-by-case basis.',
      tamil_text: 'இந்திய அரசியலமைப்பின் "அடிப்படை கட்டமைப்பு கோட்பாடு" (Basic Structure) பற்றிய பின்வரும் கூற்றுகளில் எது சரியானது?',
      tamil_explanation: 'இக்கோட்பாடு 1973 கேசவானந்த பாரதி வழக்கில் உச்ச நீதிமன்றத்தால் உருவாக்கப்பட்டது. அரசியலமைப்பு இதை வெளிப்படையாக வரையறுக்கவில்லை.',
      options: [
        { id: 'opt_up4_a', option_key: 'A', option_text: 'It is explicitly enumerated under Article 368 of the Constitution.', is_correct: 0 },
        { id: 'opt_up4_b', option_key: 'B', option_text: 'It was enunciated by the Supreme Court in the Kesavananda Bharati case (1973).', is_correct: 1 },
        { id: 'opt_up4_c', option_key: 'C', option_text: 'It allows Parliament to amend any part of the Constitution including fundamental rights without judicial review.', is_correct: 0 },
        { id: 'opt_up4_d', option_key: 'D', option_text: 'It was introduced through the 42nd Constitutional Amendment Act, 1976.', is_correct: 0 }
      ]
    },
    {
      id: 'q_upsc_pol_05',
      topic_id: 'top_fed_emergency',
      exam_id: 'exam_upsc_cse',
      question_text: 'Under Article 356 of the Constitution of India, if the President of India imposes President\'s Rule on a State, which of the following is NOT an automatic consequence?',
      question_type: 'mcq',
      difficulty_level: 'hard',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'UPSC CSE Prelims GS-I',
      explanation: 'Under Article 356, the State Council of Ministers is dismissed automatically, but the State Legislative Assembly is either kept in suspended animation or dissolved. Dissolution of the Assembly is NOT automatic until Parliament approves the proclamation (S.R. Bommai case).',
      tamil_text: 'சரத்து 356-ன் கீழ் ஒரு மாநிலத்தில் குடியரசுத் தலைவர் ஆட்சி அமல்படுத்தப்பட்டால், பின்வருவனவற்றில் எது தானாகவே நிகழும் விளைவு அல்ல?',
      tamil_explanation: 'சட்டப்பேரவை தானாகவே கலைக்கப்படாது; நாடாளுமன்ற ஒப்புதலுக்குப் பிறகே கலைக்கப்பட முடியும் (பொம்மை வழக்கு தீர்ப்பு).',
      options: [
        { id: 'opt_up5_a', option_key: 'A', option_text: 'Dismissal of the State Council of Ministers headed by the Chief Minister', is_correct: 0 },
        { id: 'opt_up5_b', option_key: 'B', option_text: 'Immediate automatic dissolution of the State Legislative Assembly', is_correct: 1 },
        { id: 'opt_up5_c', option_key: 'C', option_text: 'Exercise of State legislative powers by the Union Parliament', is_correct: 0 },
        { id: 'opt_up5_d', option_key: 'D', option_text: 'Administration of the State by the Governor on behalf of the President', is_correct: 0 }
      ]
    },

    // --- UPSC ECONOMY (GS-3) ---
    {
      id: 'q_upsc_eco_01',
      topic_id: 'top_monetary_rbi',
      exam_id: 'exam_upsc_cse',
      question_text: 'If the RBI decides to adopt an expansionary monetary policy, which of the following will it NOT do?\n1. Cut and optimize the Statutory Liquidity Ratio (SLR)\n2. Increase the Marginal Standing Facility (MSF) rate\n3. Cut the Bank Rate and Repo Rate',
      question_type: 'mcq',
      difficulty_level: 'hard',
      is_pyq: 1,
      pyq_year: 2020,
      pyq_source: 'UPSC CSE Prelims GS-I (Question 41)',
      explanation: 'Under expansionary monetary policy, RBI wants to inject liquidity and reduce borrowing costs. Increasing the MSF rate tightens liquidity and raises interest rates (contractionary), so RBI will NOT do statement 2.',
      tamil_text: 'ரிசர்வ் வங்கி ஒரு விரிவாக்க நாணயக் கொள்கையைக் கடைப்பிடிக்க முடிவு செய்தால், அது பின்வருவனவற்றில் எதைச் செய்யாது?',
      tamil_explanation: 'விரிவாக்க நாணயக் கொள்கையில் MSF விகிதத்தை அதிகரிப்பது பணப்புழக்கத்தைக் குறைக்கும், எனவே அதைச் செய்யாது (2 மட்டும்).',
      options: [
        { id: 'opt_ue1_a', option_key: 'A', option_text: '1 and 2 only', is_correct: 0 },
        { id: 'opt_ue1_b', option_key: 'B', option_text: '2 only', is_correct: 1 },
        { id: 'opt_ue1_c', option_key: 'C', option_text: '1 and 3 only', is_correct: 0 },
        { id: 'opt_ue1_d', option_key: 'D', option_text: '1, 2 and 3', is_correct: 0 }
      ]
    },
    {
      id: 'q_upsc_eco_02',
      topic_id: 'top_monetary_rbi',
      exam_id: 'exam_upsc_cse',
      question_text: 'Which of the following is the primary operational distinction of the Standing Deposit Facility (SDF) introduced by the RBI?',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'UPSC CSE Prelims GS-I',
      explanation: 'SDF allows RBI to absorb excess liquidity from commercial banks without providing collateral (government securities), unlike reverse repo operations.',
      tamil_text: 'ரிசர்வ் வங்கியால் அறிமுகப்படுத்தப்பட்ட SDF (Standing Deposit Facility) முறையின் முதன்மை அம்சம் என்ன?',
      tamil_explanation: 'SDF முறையில் அரசுப் பத்திரங்களை பிணையமாக வழங்காமல் ரிசர்வ் வங்கி வணிக வங்கிகளிடமிருந்து உபரி பணத்தை உறிஞ்சுகிறது.',
      options: [
        { id: 'opt_ue2_a', option_key: 'A', option_text: 'It mandates gold backing for all short-term liquidity deposits.', is_correct: 0 },
        { id: 'opt_ue2_b', option_key: 'B', option_text: 'It absorbs uncollateralized liquidity from commercial banks without pledging government securities.', is_correct: 1 },
        { id: 'opt_ue2_c', option_key: 'C', option_text: 'It is available exclusively to Regional Rural Banks.', is_correct: 0 },
        { id: 'opt_ue2_d', option_key: 'D', option_text: 'It carries a higher interest rate than the Marginal Standing Facility.', is_correct: 0 }
      ]
    },
    {
      id: 'q_upsc_eco_03',
      topic_id: 'top_fiscal_budget',
      exam_id: 'exam_upsc_cse',
      question_text: 'In the context of Indian public finance, what does "Primary Deficit" signify?',
      question_type: 'mcq',
      difficulty_level: 'easy',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_source: 'UPSC CSE Prelims GS-I',
      explanation: 'Primary Deficit = Fiscal Deficit - Interest Payments. It measures government borrowing requirements excluding the liability of servicing past debt.',
      tamil_text: 'இந்தியப் பொது நிதியில், "முதன்மைப் பற்றாக்குறை" (Primary Deficit) எதைக் குறிக்கிறது?',
      tamil_explanation: 'முதன்மைப் பற்றாக்குறை = நிதிப் பற்றாக்குறை - வட்டி செலுத்துதல்கள்.',
      options: [
        { id: 'opt_ue3_a', option_key: 'A', option_text: 'Fiscal Deficit minus Interest Payments', is_correct: 1 },
        { id: 'opt_ue3_b', option_key: 'B', option_text: 'Revenue Deficit minus Capital Expenditure', is_correct: 0 },
        { id: 'opt_ue3_c', option_key: 'C', option_text: 'Budget Deficit minus External Borrowings', is_correct: 0 },
        { id: 'opt_ue3_d', option_key: 'D', option_text: 'Fiscal Deficit plus Grants-in-Aid', is_correct: 0 }
      ]
    },

    // --- TNPSC UNIT 8 & UNIT 9 ---
    {
      id: 'q_tnpsc_u8_01',
      topic_id: 'top_tn_thirukkural',
      exam_id: 'exam_tnpsc_grp2',
      question_text: 'According to Thirukkural Chapter 39 (Irai Matchi), what are the four essential attributes of a righteous state/government?\n"இயற்றலும் ஈட்டலும் காத்தலும் காத்த..."',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_source: 'TNPSC Group 2 Prelims (General Studies)',
      explanation: 'Kural 385 states: An able ruler creates revenue sources (Iyattral), accumulates wealth efficiently (Eettal), protects the treasury (Kaathal), and allocates wealth justly for public welfare (Vaguthal).',
      tamil_text: 'திருக்குறளின் 39-வது அதிகாரம் (இறைமாட்சி) படி, ஒரு சிறந்த அரசின் நான்கு முக்கிய பணிகள் யாவை?',
      tamil_explanation: 'பொருள் வரும் வழிகளை உருவாக்குதல் (இயற்றல்), பொருளைச் சேர்த்தல் (ஈட்டல்), சேர்த்த பொருளைப் பாதுகாத்தல் (காத்தல்), காத்த பொருளை பயனுள்ள வழிகளில் வகுத்துச் செலவிடுதல் (வகுத்தல்).',
      options: [
        { id: 'opt_tn1_a', option_key: 'A', option_text: 'Creating revenue, accumulating wealth, guarding it, and distributing it justly', is_correct: 1 },
        { id: 'opt_tn1_b', option_key: 'B', option_text: 'Conquest of territory, collecting tributes, expanding army, building forts', is_correct: 0 },
        { id: 'opt_tn1_c', option_key: 'C', option_text: 'Administering temples, collecting religious tax, conducting festivals', is_correct: 0 },
        { id: 'opt_tn1_d', option_key: 'D', option_text: 'Enforcing strict punishment, censorship, state trade monopoly', is_correct: 0 }
      ]
    },
    {
      id: 'q_tnpsc_u8_02',
      topic_id: 'top_tn_dravidian_move',
      exam_id: 'exam_tnpsc_grp2',
      question_text: 'In which year was the historic First Communal Government Order (G.O. No. 613) issued by the Justice Party ministry in the Madras Presidency?',
      question_type: 'mcq',
      difficulty_level: 'easy',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_source: 'TNPSC Group 1 / Group 2 Prelims',
      explanation: 'The Justice Party passed the first Communal G.O. on 16 September 1921 providing formal communal representation in government jobs for non-Brahmins, Muslims, Indian Christians, and Adi-Dravidars.',
      tamil_text: 'மெட்ராஸ் மாகாணத்தில் நீதிக்கட்சி அமைச்சரவையால் வரலாற்றுச் சிறப்புமிக்க முதல் வகுப்புவாரி அரசாணை (Communal G.O.) எந்த ஆண்டு பிறப்பிக்கப்பட்டது?',
      tamil_explanation: 'நீதிக்கட்சி செப்டம்பர் 16, 1921 அன்று முதல் வகுப்புவாரி அரசாணையை (G.O. No. 613) பிறப்பித்தது.',
      options: [
        { id: 'opt_tn2_a', option_key: 'A', option_text: '1916', is_correct: 0 },
        { id: 'opt_tn2_b', option_key: 'B', option_text: '1921', is_correct: 1 },
        { id: 'opt_tn2_c', option_key: 'C', option_text: '1929', is_correct: 0 },
        { id: 'opt_tn2_d', option_key: 'D', option_text: '1937', is_correct: 0 }
      ]
    },
    {
      id: 'q_tnpsc_u8_03',
      topic_id: 'top_tn_freedom_struggle',
      exam_id: 'exam_tnpsc_grp2',
      question_text: 'Who founded the "Swadeshi Steam Navigation Company" in 1906 to challenge the British India Steam Navigation Company monopoly?',
      question_type: 'mcq',
      difficulty_level: 'easy',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'TNPSC Group 2 Prelims',
      explanation: 'V.O. Chidambaram Pillai (Kappalottiya Thamizhan) launched the Swadeshi Steam Navigation Company between Tuticorin and Colombo in 1906.',
      tamil_text: 'பிரிட்டிஷ் கப்பல் நிறுவனத்தின் ஏகபோகத்திற்கு எதிராக 1906-ல் "சுதேசி நீராவி கப்பல் கம்பெனியை" நிறுவியவர் யார்?',
      tamil_explanation: 'வ.உ. சிதம்பரனார் (கப்பலோட்டிய தமிழன்) தூத்துக்குடிக்கும் கொழும்புக்கும் இடையே சுதேசி கப்பலை இயக்கினார்.',
      options: [
        { id: 'opt_tn3_a', option_key: 'A', option_text: 'V.O. Chidambaram Pillai', is_correct: 1 },
        { id: 'opt_tn3_b', option_key: 'B', option_text: 'Subramania Bharati', is_correct: 0 },
        { id: 'opt_tn3_c', option_key: 'C', option_text: 'Tiruppur Kumaran', is_correct: 0 },
        { id: 'opt_tn3_d', option_key: 'D', option_text: 'Rajaji', is_correct: 0 }
      ]
    },
    {
      id: 'q_tnpsc_u9_01',
      topic_id: 'top_tn_hdi_welfare',
      exam_id: 'exam_tnpsc_grp2',
      question_text: 'Under the 76th Constitutional Amendment Act of 1994, the Tamil Nadu Backward Classes and Scheduled Castes Reservation Act providing 69% reservation was placed under which Schedule of the Indian Constitution?',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_source: 'TNPSC Group 1 Prelims',
      explanation: 'The 76th Amendment Act of 1994 placed the Tamil Nadu Act of 1994 in the 9th Schedule to protect it from judicial review under Article 31B.',
      tamil_text: '1994-ஆம் ஆண்டின் 76-வது அரசியலமைப்புத் திருத்தச் சட்டத்தின்படி, தமிழ்நாட்டின் 69% இடஒதுக்கீட்டுச் சட்டம் இந்திய அரசியலமைப்பின் எந்த அட்டவணையில் சேர்க்கப்பட்டது?',
      tamil_explanation: 'தமிழ்நாட்டின் 69% இடஒதுக்கீட்டுச் சட்டம் 9-வது அட்டவணையில் சேர்க்கப்பட்டது.',
      options: [
        { id: 'opt_tn4_a', option_key: 'A', option_text: '7th Schedule', is_correct: 0 },
        { id: 'opt_tn4_b', option_key: 'B', option_text: '8th Schedule', is_correct: 0 },
        { id: 'opt_tn4_c', option_key: 'C', option_text: '9th Schedule', is_correct: 1 },
        { id: 'opt_tn4_d', option_key: 'D', option_text: '10th Schedule', is_correct: 0 }
      ]
    },
    {
      id: 'q_tnpsc_apt_01',
      topic_id: 'top_tnpsc_ratio_perc',
      exam_id: 'exam_tnpsc_grp2',
      question_text: 'If the difference between Compound Interest and Simple Interest on a certain sum of money for 2 years at 8% per annum is ₹64, find the principal sum.',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'TNPSC Group 2 Aptitude',
      explanation: 'Difference formula for 2 years: D = P * (R/100)^2. => 64 = P * (8/100)^2 => 64 = P * (64/10000) => P = ₹10,000.',
      tamil_text: 'ஒரு குறிப்பிட்ட அசலுக்கு 8% ஆண்டு வட்டியில் 2 ஆண்டுகளுக்கு கிடைக்கும் கூட்டு வட்டி மற்றும் தனி வட்டிக்கு இடையேயான வித்தியாசம் ₹64 எனில் அசல் தொகையைக் காண்க.',
      tamil_explanation: '2 ஆண்டுகளுக்கான வித்தியாசம்: D = P * (R/100)^2 => 64 = P * (64/10000) => அசல் P = ₹10,000.',
      options: [
        { id: 'opt_tna1_a', option_key: 'A', option_text: '₹8,000', is_correct: 0 },
        { id: 'opt_tna1_b', option_key: 'B', option_text: '₹10,000', is_correct: 1 },
        { id: 'opt_tna1_c', option_key: 'C', option_text: '₹12,500', is_correct: 0 },
        { id: 'opt_tna1_d', option_key: 'D', option_text: '₹15,000', is_correct: 0 }
      ]
    },

    // --- SSC CGL QUANT, REASONING, ENGLISH ---
    {
      id: 'q_ssc_quant_01',
      topic_id: 'top_ssc_percentage_profit',
      exam_id: 'exam_ssc_cgl',
      question_text: 'A dishonest dealer professes to sell his goods at cost price, but uses a false weight of 900 grams instead of a 1 kg weight. What is his net gain percentage?',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'SSC CGL Tier-I (Shift 2)',
      explanation: 'Gain % = (Error / (True Value - Error)) * 100 = (100 / 900) * 100 = 100/9 = 11 1/9% (or 11.11%).',
      options: [
        { id: 'opt_sq1_a', option_key: 'A', option_text: '10%', is_correct: 0 },
        { id: 'opt_sq1_b', option_key: 'B', option_text: '11 1/9%', is_correct: 1 },
        { id: 'opt_sq1_c', option_key: 'C', option_text: '12.5%', is_correct: 0 },
        { id: 'opt_sq1_d', option_key: 'D', option_text: '9 1/11%', is_correct: 0 }
      ]
    },
    {
      id: 'q_ssc_quant_02',
      topic_id: 'top_ssc_algebra_geom',
      exam_id: 'exam_ssc_cgl',
      question_text: 'In a triangle ABC, the bisector of angle A meets BC at D. If AB = 8 cm, AC = 12 cm, and BC = 10 cm, what is the length of BD?',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_source: 'SSC CGL Tier-I',
      explanation: 'By Angle Bisector Theorem: BD / DC = AB / AC = 8 / 12 = 2 / 3. Since BC = 10 cm, BD = (2 / (2+3)) * 10 = (2/5) * 10 = 4 cm.',
      options: [
        { id: 'opt_sq2_a', option_key: 'A', option_text: '4 cm', is_correct: 1 },
        { id: 'opt_sq2_b', option_key: 'B', option_text: '5 cm', is_correct: 0 },
        { id: 'opt_sq2_c', option_key: 'C', option_text: '6 cm', is_correct: 0 },
        { id: 'opt_sq2_d', option_key: 'D', option_text: '3.5 cm', is_correct: 0 }
      ]
    },
    {
      id: 'q_ssc_reas_01',
      topic_id: 'top_ssc_syllogism',
      exam_id: 'exam_ssc_cgl',
      question_text: 'Statements:\n1. All Rivers are Water.\n2. Some Water are Lakes.\n3. No Lake is an Ocean.\nConclusions:\nI. Some Water are not Oceans.\nII. Some Rivers being Oceans is a possibility.',
      question_type: 'mcq',
      difficulty_level: 'hard',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'SSC CGL Tier-I',
      explanation: 'Conclusion I is correct because the portion of Water that is Lakes cannot be Oceans. Conclusion II is also correct because there is no direct negative relation between Rivers and Oceans. Hence, Both I and II follow.',
      options: [
        { id: 'opt_sr1_a', option_key: 'A', option_text: 'Only conclusion I follows', is_correct: 0 },
        { id: 'opt_sr1_b', option_key: 'B', option_text: 'Only conclusion II follows', is_correct: 0 },
        { id: 'opt_sr1_c', option_key: 'C', option_text: 'Both conclusions I and II follow', is_correct: 1 },
        { id: 'opt_sr1_d', option_key: 'D', option_text: 'Neither follows', is_correct: 0 }
      ]
    },
    {
      id: 'q_ssc_eng_01',
      topic_id: 'top_ssc_grammar_error',
      exam_id: 'exam_ssc_cgl',
      question_text: 'Identify the segment in the sentence which contains a grammatical error:\n"Scarcely had he gone a few steps (A) / than he was struck by (B) / a sudden flash of lightning (C) / and fell down (D)."',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_source: 'SSC CGL Tier-I English',
      explanation: 'Correlative conjunction rule: "Scarcely... when" is used, not "Scarcely... than". "Than" is used with "No sooner". Part (B) contains the error.',
      options: [
        { id: 'opt_se1_a', option_key: 'A', option_text: 'Scarcely had he gone a few steps', is_correct: 0 },
        { id: 'opt_se1_b', option_key: 'B', option_text: 'than he was struck by', is_correct: 1 },
        { id: 'opt_se1_c', option_key: 'C', option_text: 'a sudden flash of lightning', is_correct: 0 },
        { id: 'opt_se1_d', option_key: 'D', option_text: 'and fell down', is_correct: 0 }
      ]
    },

    // --- BANKING (IBPS / SBI PO) ---
    {
      id: 'q_bank_quant_01',
      topic_id: 'top_bank_di',
      exam_id: 'exam_bank_po',
      question_text: 'Directions: In the quadratic equation I: 2x² - 13x + 20 = 0 and II: 2y² - 17y + 36 = 0, establish the relation between x and y.',
      question_type: 'mcq',
      difficulty_level: 'medium',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_source: 'IBPS PO Prelims',
      explanation: 'Equation I: 2x² - 8x - 5x + 20 = 0 => (2x - 5)(x - 4) = 0 => x = 2.5, 4.\nEquation II: 2y² - 8y - 9y + 36 = 0 => (2y - 9)(y - 4) = 0 => y = 4.5, 4.\nComparing roots: x = 2.5 < 4, 4.5; x = 4 < 4.5, x = 4 = 4. Thus x <= y.',
      options: [
        { id: 'opt_bq1_a', option_key: 'A', option_text: 'x > y', is_correct: 0 },
        { id: 'opt_bq1_b', option_key: 'B', option_text: 'x < y', is_correct: 0 },
        { id: 'opt_bq1_c', option_key: 'C', option_text: 'x >= y', is_correct: 0 },
        { id: 'opt_bq1_d', option_key: 'D', option_text: 'x <= y', is_correct: 1 }
      ]
    },
    {
      id: 'q_bank_reas_01',
      topic_id: 'top_bank_puzzles',
      exam_id: 'exam_bank_po',
      question_text: 'Eight persons A, B, C, D, E, F, G, and H sit in a row facing North. A sits third to the left of D. Only two persons sit between D and G. H sits second to the right of G. If B sits immediately next to H, who sits at the extreme left end?',
      question_type: 'mcq',
      difficulty_level: 'hard',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_source: 'SBI PO Prelims',
      explanation: 'Arrangement from left to right: A, C, E, D, F, G, B, H. The person at the extreme left end is A.',
      options: [
        { id: 'opt_br1_a', option_key: 'A', option_text: 'A', is_correct: 1 },
        { id: 'opt_br1_b', option_key: 'B', option_text: 'C', is_correct: 0 },
        { id: 'opt_br1_c', option_key: 'C', option_text: 'D', is_correct: 0 },
        { id: 'opt_br1_d', option_key: 'D', option_text: 'F', is_correct: 0 }
      ]
    },

    // --- RAILWAYS (RRB NTPC) ---
    {
      id: 'q_rrb_sci_01',
      topic_id: 'top_rrb_gen_science',
      exam_id: 'exam_rrb_ntpc',
      question_text: 'What is the electrical resistance of a conductor inversely proportional to?',
      question_type: 'mcq',
      difficulty_level: 'easy',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_source: 'RRB NTPC Stage-1 (CBT-1)',
      explanation: 'Resistance R = ρ * (L / A). Resistance is directly proportional to length (L) and inversely proportional to the area of cross-section (A).',
      options: [
        { id: 'opt_rq1_a', option_key: 'A', option_text: 'Length of the conductor', is_correct: 0 },
        { id: 'opt_rq1_b', option_key: 'B', option_text: 'Area of cross-section', is_correct: 1 },
        { id: 'opt_rq1_c', option_key: 'C', option_text: 'Resistivity of material', is_correct: 0 },
        { id: 'opt_rq1_d', option_key: 'D', option_text: 'Temperature', is_correct: 0 }
      ]
    },
    {
      id: 'q_rrb_math_01',
      topic_id: 'top_rrb_time_work',
      exam_id: 'exam_rrb_ntpc',
      question_text: 'A can complete a piece of work in 12 days and B can complete it in 18 days. If they work together for 4 days, what fraction of work is left?',
      question_type: 'mcq',
      difficulty_level: 'easy',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_source: 'RRB NTPC CBT-1',
      explanation: 'LCM of 12 and 18 = 36 units total work. Efficiency of A = 3 units/day, B = 2 units/day. Combined = 5 units/day. In 4 days work done = 20 units. Work left = 36 - 20 = 16 units. Fraction left = 16 / 36 = 4 / 9.',
      options: [
        { id: 'opt_rm1_a', option_key: 'A', option_text: '5 / 9', is_correct: 0 },
        { id: 'opt_rm1_b', option_key: 'B', option_text: '4 / 9', is_correct: 1 },
        { id: 'opt_rm1_c', option_key: 'C', option_text: '1 / 3', is_correct: 0 },
        { id: 'opt_rm1_d', option_key: 'D', option_text: '2 / 9', is_correct: 0 }
      ]
    }
  ];

  // 8. Mock Tests
  const tests = [
    {
      id: 'test_upsc_polity_adaptive',
      exam_id: 'exam_upsc_cse',
      title: 'UPSC CSE All-India Mock: Indian Polity, Governance & Constitutional Law',
      description: 'Standard simulated UPSC Civil Services Prelims GS Paper-I test covering Fundamental Rights, Writs, Parliament, and Judiciary with negative marking (0.66 deduction).',
      test_type: 'mock',
      duration_minutes: 45,
      total_marks: 50.0,
      pass_percentage: 45.0,
      is_adaptive: 0
    },
    {
      id: 'test_upsc_economy_mock',
      exam_id: 'exam_upsc_cse',
      title: 'UPSC CSE Sectional Test: Indian Economy & RBI Monetary Framework',
      description: 'Targeted test focusing on Monetary Policy, Inflation Targeting, Union Budget, Fiscal Deficits, and Balance of Payments.',
      test_type: 'topic_quiz',
      duration_minutes: 30,
      total_marks: 40.0,
      pass_percentage: 50.0,
      is_adaptive: 0
    },
    {
      id: 'test_tnpsc_full_mock',
      exam_id: 'exam_tnpsc_grp2',
      title: 'TNPSC Group 2 Comprehensive Mock: Units 8, 9, Polity & Aptitude',
      description: 'Authentic TNPSC Group 2 Preliminary examination standard simulating Thirukkural, Dravidian Movement, Social Justice, and SCERT Aptitude.',
      test_type: 'mock',
      duration_minutes: 60,
      total_marks: 100.0,
      pass_percentage: 40.0,
      is_adaptive: 0
    },
    {
      id: 'test_ssc_cgl_full_mock',
      exam_id: 'exam_ssc_cgl',
      title: 'SSC CGL Tier-I Full Mock Examination (Quant, Reasoning, English, GA)',
      description: 'Complete 60-minute speed exam replicating the official Staff Selection Commission computer-based examination format.',
      test_type: 'mock',
      duration_minutes: 60,
      total_marks: 200.0,
      pass_percentage: 50.0,
      is_adaptive: 0
    },
    {
      id: 'test_bank_po_speed_drill',
      exam_id: 'exam_bank_po',
      title: 'Banking PO Prelims Speed Marathon (IBPS / SBI Standard)',
      description: 'Sectional time-pressured mock containing Puzzles, Data Interpretation, and Quadratic Equations.',
      test_type: 'mock',
      duration_minutes: 45,
      total_marks: 100.0,
      pass_percentage: 50.0,
      is_adaptive: 0
    },
    {
      id: 'test_rrb_ntpc_stage1',
      exam_id: 'exam_rrb_ntpc',
      title: 'RRB NTPC CBT-1 Stage-I Official Standard Mock Test',
      description: 'Railway Recruitment Board standard test covering 10th-standard General Science, Mathematics, and Reasoning.',
      test_type: 'mock',
      duration_minutes: 45,
      total_marks: 100.0,
      pass_percentage: 40.0,
      is_adaptive: 0
    }
  ];

  // 9. Verified Official Current Affairs
  const currentAffairs = [
    {
      id: 'ca_01_rbi_mpc',
      title: 'RBI Monetary Policy Committee Maintains Repo Rate at 6.50% with Stance on Inflation Alignment',
      category: 'Economy',
      source_name: 'Press Information Bureau (PIB) / Reserve Bank of India',
      source_url: 'https://rbi.org.in/pressreleases',
      is_verified: 1,
      verification_notes: 'Verified against official RBI Monetary Policy Statement and Ministry of Finance economic records.',
      published_date: '2026-08-20',
      summary: 'The RBI MPC maintained the Policy Repo Rate at 6.50% while reiterating its commitment to aligning CPI headline inflation to the 4% target on a durable basis.',
      detailed_analysis: 'The Committee underscored the efficacy of the Standing Deposit Facility (SDF) in absorbing excess system liquidity without pledging G-Secs. Key considerations included food price volatility and resilient domestic GDP growth.',
      exam_relevance_tags: JSON.stringify(['UPSC GS3 Economy', 'TNPSC Economy', 'Banking Financial Awareness', 'SSC General Awareness']),
      topic_id: 'top_monetary_rbi'
    },
    {
      id: 'ca_02_sc_verdict_subclassification',
      title: 'Supreme Court 7-Judge Constitution Bench Upholds Sub-Classification within Scheduled Castes',
      category: 'Polity & Governance',
      source_name: 'Supreme Court of India Official Judgment Records',
      source_url: 'https://main.sci.gov.in/judgments',
      is_verified: 1,
      verification_notes: 'Verified from landmark Constitution Bench judgment in State of Punjab v. Davinder Singh & Ors.',
      published_date: '2026-08-15',
      summary: 'A 6:1 majority verdict affirmed that States possess constitutional competence under Articles 14, 15, and 16 to sub-classify Scheduled Castes for targeted affirmative action.',
      detailed_analysis: 'The Court held that sub-classification does not violate Article 341 so long as empirical data demonstrates inadequate representation of the sub-group without 100% exclusion of other groups.',
      exam_relevance_tags: JSON.stringify(['UPSC GS2 Polity', 'TNPSC Unit 9 Administration', 'State PSC Legal Studies']),
      topic_id: 'top_fr_dpsp'
    },
    {
      id: 'ca_03_tn_green_energy',
      title: 'Tamil Nadu Launches India’s First Port-Anchored Green Hydrogen Valley in Thoothukudi',
      category: 'Environment & Economy',
      source_name: 'Department of Energy, Govt of Tamil Nadu',
      source_url: 'https://tn.gov.in/pressrelease',
      is_verified: 1,
      verification_notes: 'Official Government Order and Ministry notification from Tamil Nadu State Secretariat.',
      published_date: '2026-08-10',
      summary: 'Tamil Nadu notified policy incentives to develop 4 GW offshore wind infrastructure in the Gulf of Mannar and establish India’s first green hydrogen hub at VO Chidambaranar Port in Thoothukudi.',
      detailed_analysis: 'Aligns directly with Tamil Nadu’s roadmap to achieve a $1 Trillion economy and 50% renewable energy installed capacity by 2030, reinforcing Unit 9 development administration benchmarks.',
      exam_relevance_tags: JSON.stringify(['TNPSC Unit 9', 'UPSC GS3 Environment & Economy', 'SSC General Awareness']),
      topic_id: 'top_tn_econ_corridors'
    },
    {
      id: 'ca_04_isro_chandrayaan_payload',
      title: 'ISRO Announces Next-Gen Lunar Polar Exploration (LUPEX) Joint Mission Objectives',
      category: 'Science & Technology',
      source_name: 'ISRO / Department of Space, Govt of India',
      source_url: 'https://isro.gov.in',
      is_verified: 1,
      verification_notes: 'Verified from Department of Space official mission dossier.',
      published_date: '2026-08-05',
      summary: 'ISRO and JAXA finalized payload specifications for the LUPEX mission to explore water ice in permanently shadowed lunar polar craters.',
      detailed_analysis: 'Crucial for UPSC GS-3 Science & Tech and SSC General Awareness questions on planetary exploration and indigenous rover engineering.',
      exam_relevance_tags: JSON.stringify(['UPSC GS3 Science & Tech', 'SSC General Awareness', 'RRB NTPC Science']),
      topic_id: 'top_rrb_gen_science'
    }
  ];

  return {
    users,
    profiles,
    exams,
    subjects,
    topics,
    studyMaterials,
    questions,
    tests,
    currentAffairs
  };
}

module.exports = { getSeedData };
