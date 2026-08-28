const db = require('../backend/src/config/database');

// Templates per Exam Category to generate authentic syllabus hierarchies and topic notes
const syllabusTemplates = {
  Healthcare: [
    {
      stage: 'CBT Stage 1 — Preliminary',
      subject: 'Nursing Sciences Core',
      topics: [
        {
          name: 'Medical-Surgical Nursing & Critical Care',
          subtopic: 'Hemodynamic Monitoring, BLS/ACLS Protocols, Mechanical Ventilation & Shock Management',
          description: 'High-yield clinical nursing module covering cardiovascular, respiratory emergencies, and post-operative critical care interventions.',
          priority: 'high',
          pyq_weightage: 9.8,
          concept: '### 1. Advanced Cardiovascular & Respiratory Nursing\n* **Cardiac Arrest Protocol (BLS/ACLS)**: Immediate CPR initiation with 30:2 compression-to-ventilation ratio at 100-120 bpm with depth of 5-6 cm in adults.\n* **Mechanical Ventilation Modes**: Assist-Control (AC), Synchronized Intermittent Mandatory Ventilation (SIMV), and PEEP (Positive End-Expiratory Pressure).\n* **Shock Classifications**: Hypovolemic (fluid deficit), Cardiogenic (pump failure), Septic (vasodilation with warm extremities early on), and Anaphylactic (IgE mediated).\n\n### 2. Acid-Base Imbalance & ABG Interpretation\n* Normal Ranges: pH (7.35-7.45), PaCO2 (35-45 mmHg), HCO3 (22-26 mEq/L).\n* ROME Rule: Respiratory Opposite (pH & PaCO2 opposite), Metabolic Equal (pH & HCO3 same direction).',
          formulas: [
            { name: 'Parkland Burn Fluid Formula', formula: 'Total Fluid (24h) = 4 mL x Body Weight (kg) x % Total Body Surface Area (TBSA) Burned', notes: 'First 50% given in first 8 hours; remaining 50% over next 16 hours.' },
            { name: 'IV Drop Rate Formula', formula: 'Drops/min = [Total Volume (mL) x Drop Factor (gtts/mL)] / Time in Minutes', notes: 'Microdrip = 60 gtts/mL; Macrodrip = 10-15 gtts/mL.' },
            { name: 'Mean Arterial Pressure (MAP)', formula: 'MAP = [Systolic BP + (2 x Diastolic BP)] / 3', notes: 'Minimum MAP >= 65 mmHg required for adequate organ perfusion.' }
          ],
          examples: [
            {
              question: 'A 70 kg patient presents with 40% second-degree burns. Using the Parkland formula, calculate the volume of Ringer Lactate to be administered in the first 8 hours.',
              step1: 'Total 24-hr Fluid = 4 mL x 70 kg x 40 = 11,200 mL.',
              step2: 'First 8 hours fluid requirement = 50% of total = 11,200 / 2 = 5,600 mL.',
              step3: 'Infusion rate for first 8 hours = 5,600 mL / 8 hours = 700 mL/hr.',
              answer: '5,600 mL (at 700 mL/hour).'
            }
          ],
          shortcuts: [
            '⚡ ABG ROME Mnemonic: Respiratory Opposite, Metabolic Equal.',
            '⚡ Parkland 50-50 Rule: First half fluid strictly within first 8 hours from time of injury, NOT hospital admission.'
          ],
          common_mistakes: [
            '⚠️ Calculating Parkland fluid timing from time of hospital arrival instead of actual time of burn injury.',
            '⚠️ Giving Potassium Chloride (KCl) via direct IV push — fatal! KCl must always be diluted and infused slowly.'
          ],
          quick_revision: '* Normal ABG: pH 7.35-7.45, PaCO2 35-45, HCO3 22-26.\n* Adult CPR: 30:2 ratio, 100-120 compressions/min, depth 5-6 cm.\n* Target MAP in sepsis: >= 65 mmHg.\n* Universal blood donor: O negative; Universal recipient: AB positive.',
          practice_questions: [
            {
              id: 'pq_msn_1',
              question: 'An arterial blood gas (ABG) report shows pH: 7.28, PaCO2: 54 mmHg, and HCO3: 24 mEq/L. This condition is diagnosed as:',
              options: ['Uncompensated Respiratory Acidosis', 'Compensated Metabolic Acidosis', 'Respiratory Alkalosis', 'Metabolic Alkalosis'],
              correct_index: 0,
              explanation: 'pH < 7.35 indicates acidosis; PaCO2 > 45 indicates respiratory etiology. Since HCO3 is normal (24), it is Uncompensated Respiratory Acidosis.'
            },
            {
              id: 'pq_msn_2',
              question: 'What is the antidote of choice for Heparin-induced acute toxicity?',
              options: ['Vitamin K', 'Protamine Sulfate', 'Naloxone', 'Flumazenil'],
              correct_index: 1,
              explanation: 'Protamine sulfate rapidly neutralizes the anticoagulant effect of unfractionated heparin and LMWH.'
            }
          ],
          source_authority: 'AIIMS NORCET Official Curriculum & Brunner & Suddarth Medical-Surgical Nursing'
        },
        {
          name: 'Pediatric & Obstetric Nursing',
          subtopic: 'Antenatal Assessment, High-Risk Labor, Neonatal Resuscitation & APGAR Score',
          description: 'Focuses on maternal health, labor stages, obstetrical emergencies, and neonatal growth milestones.',
          priority: 'high',
          pyq_weightage: 9.4,
          concept: '### 1. Obstetric Milestones & Antenatal Assessment\n* **Naegele\'s Rule (EDD)**: Estimated Date of Delivery = First Day of LMP + 9 Months + 7 Days (or LMP + 1 Year - 3 Months + 7 Days).\n* **Stages of Labor**: Stage 1 (Onset of true labor to full cervical dilatation 10 cm), Stage 2 (Full dilatation to delivery of baby), Stage 3 (Delivery of baby to expulsion of placenta), Stage 4 (First 1-2 hours observation for PPH).\n* **Postpartum Hemorrhage (PPH)**: Blood loss > 500 mL in vaginal delivery or > 1000 mL in C-section. Primary cause: Uterine atony (4 Ts: Tone, Trauma, Tissue, Thrombin).\n\n### 2. Neonatal Resuscitation & APGAR Scoring\n* Evaluated at 1 minute and 5 minutes after birth across 5 parameters (0-2 points each, max 10): Appearance (Skin Color), Pulse (Heart Rate), Grimace (Reflex Irritability), Activity (Muscle Tone), Respiration (Effort).',
          formulas: [
            { name: 'Naegele\'s Rule for EDD', formula: 'EDD = LMP + 7 Days + 9 Calendar Months', notes: 'Assumes regular 28-day menstrual cycle.' },
            { name: 'APGAR Score', formula: 'Score = Appearance (0-2) + Pulse (0-2) + Grimace (0-2) + Activity (0-2) + Respiration (0-2)', notes: '7-10 Normal; 4-6 Moderate Depression; 0-3 Severe Depression.' }
          ],
          examples: [
            {
              question: 'A pregnant woman reports her Last Menstrual Period (LMP) as June 10, 2025. Calculate her Estimated Date of Delivery (EDD).',
              step1: 'Add 7 days to date: June 10 + 7 days = June 17.',
              step2: 'Add 9 calendar months to June: June + 9 months = March of next year (2026).',
              step3: 'Resulting EDD = March 17, 2026.',
              answer: 'March 17, 2026.'
            }
          ],
          shortcuts: [
            '⚡ APGAR Mnemonic: Appearance, Pulse, Grimace, Activity, Respiration.',
            '⚡ 4Ts of PPH: Tone (Uterine Atony - 70%), Trauma (Lacerations), Tissue (Retained Placenta), Thrombin (Coagulopathy).'
          ],
          common_mistakes: [
            '⚠️ Giving Methylergometrine in hypertensive or pre-eclamptic mothers — contraindicated due to vasoconstrictive surge. Oxytocin is drug of choice.',
            '⚠️ Applying suction to neonatal nose before mouth — always suction mouth first, then nose, to prevent aspiration.'
          ],
          quick_revision: '* EDD = LMP + 9 months + 7 days.\n* APGAR score >= 7 is normal.\n* Magnesium Sulfate (MgSO4) is drug of choice for Eclampsia seizures.\n* PPH drug of choice: Oxytocin (10 IU IM/IV infusion).',
          practice_questions: [
            {
              id: 'pq_obg_1',
              question: 'What is the drug of choice for the prevention and management of convulsions in Eclampsia?',
              options: ['Diazepam', 'Magnesium Sulfate', 'Phenytoin', 'Sodium Valproate'],
              correct_index: 1,
              explanation: 'Magnesium Sulfate (MgSO4) is the gold standard drug of choice for eclampsia, acting as a central nervous system depressant and vasodilator.'
            }
          ],
          source_authority: 'DC Dutta Textbook of Obstetrics & AIIMS Clinical Protocols'
        },
        {
          name: 'Community Health & Infection Control',
          subtopic: 'Epidemiology, Bio-Medical Waste (BMW) Rules 2016, National Health Programs',
          description: 'Public health principles, immunization schedules, disease eradication targets, and hospital waste segregation.',
          priority: 'medium',
          pyq_weightage: 8.7,
          concept: '### 1. Bio-Medical Waste (BMW) Management Rules 2016\n* **Yellow Bag**: Human anatomical waste, soiled dressings, expired drugs, cytotoxic waste (Incineration/Plasma Pyrolysis).\n* **Red Bag**: Contaminated recyclable plastic waste (tubing, IV bottles, catheters, syringes without needles) -> Autoclaving/Microwaving followed by shredding.\n* **White Translucent (Puncture-Proof Container)**: Sharps including needles, scalpels, blades -> Autoclave/Dry heat sterilization.\n* **Blue Cardboard Box/Container**: Glassware (vials, ampoules) and metallic body implants -> Disinfection via Sodium Hypochlorite.\n\n### 2. Universal Immunization Programme (UIP)\n* At Birth: BCG (0.05 mL ID), OPV-0 (2 drops oral), Hepatitis B birth dose (0.5 mL IM within 24 hours).\n* 6, 10, 14 Weeks: Pentavalent (DPT + Hep B + Hib), OPV (1, 2, 3), Rotavirus, fIPV, PCV.\n* 9 Months: Measles-Rubella (MR-1), Vitamin A (1 Lakh IU), JE-1.',
          formulas: [
            { name: 'Infant Mortality Rate (IMR)', formula: 'IMR = (Number of infant deaths under 1 year / Total live births in that year) x 1,000', notes: 'Key demographic indicator.' },
            { name: 'Maternal Mortality Ratio (MMR)', formula: 'MMR = (Maternal deaths due to obstetric causes / Total live births) x 100,000', notes: 'Calculated per 1 Lakh live births.' }
          ],
          examples: [
            {
              question: 'Which waste container should be used to dispose of used IV infusion tubings, urine bags, and disposable syringes without needles?',
              step1: 'Identify material: Contaminated recyclable plastics.',
              step2: 'Consult BMW 2016 schedule: Plastics belong to Red container for autoclaving and recycling.',
              answer: 'Red Bag / Container.'
            }
          ],
          shortcuts: [
            '⚡ BMW Color Coding: Yellow = Anatomy/Infectious, Red = Recyclable Plastics, White = Sharps, Blue = Broken Glassware.'
          ],
          common_mistakes: [
            '⚠️ Discarding glass vials into yellow or red bags — glass must strictly go into Blue container or puncture-proof box.'
          ],
          quick_revision: '* BMW: Yellow (Anatomy), Red (Plastics), White (Sharps), Blue (Glassware).\n* MMR is calculated per 100,000 live births; IMR per 1,000 live births.\n* Cold chain ideal storage temperature: +2°C to +8°C (ILR: Ice-Lined Refrigerator).',
          practice_questions: [
            {
              id: 'pq_comm_1',
              question: 'Under the Bio-Medical Waste Management Rules 2016, discarded human placenta and infected cotton swabs must be segregated in which colored bag?',
              options: ['Red Bag', 'Yellow Bag', 'Blue Container', 'White Translucent Box'],
              correct_index: 1,
              explanation: 'Human anatomical waste and soiled items with blood or body fluids are collected in Yellow bags for deep burial or incineration.'
            }
          ],
          source_authority: 'Ministry of Health & Family Welfare (MoHFW) UIP Guidelines & BMW Rules 2016'
        }
      ]
    },
    {
      stage: 'CBT Stage 2 — Advanced Clinical Skills',
      subject: 'General Knowledge & Professional Reasoning',
      topics: [
        {
          name: 'Healthcare Policies, Bioethics & General Aptitude',
          subtopic: 'Ayushman Bharat (PM-JAY), Mental Health Care Act, Clinical Research Ethics',
          description: 'Evaluation of national healthcare mission policies, patient rights, and logical aptitude.',
          priority: 'medium',
          pyq_weightage: 8.0,
          concept: '### 1. Ayushman Bharat - PM-JAY\n* Provides health cover of **₹5 Lakh per family per year** for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.\n* Entirely centrally sponsored with 60:40 fund sharing between Centre and States (90:10 for NE & Himalayan states).\n\n### 2. Bioethics in Nursing\n* **Autonomy**: Respecting patient decisions and obtaining informed consent.\n* **Beneficence**: Acting in the best interest of the patient.\n* **Non-maleficence**: "Do no harm".\n* **Justice**: Fairness in healthcare resource allocation.',
          formulas: [],
          examples: [],
          shortcuts: ['⚡ 4 Core Bioethical Pillars: Autonomy, Beneficence, Non-Maleficence, Justice.'],
          common_mistakes: ['⚠️ Performing invasive clinical procedures without valid informed consent from alert patient.'],
          quick_revision: '* PM-JAY: ₹5 Lakh health cover per family per year.\n* Code of Ethics for Nurses formulated by International Council of Nurses (ICN) and Indian Nursing Council (INC).',
          practice_questions: [
            {
              id: 'pq_eth_1',
              question: 'Under the Ayushman Bharat PM-JAY scheme, what is the annual hospitalization health cover provided per eligible family?',
              options: ['₹2 Lakh', '₹3 Lakh', '₹5 Lakh', '₹10 Lakh'],
              correct_index: 2,
              explanation: 'PM-JAY provides financial protection up to ₹5,00,000 per family per year for secondary and tertiary healthcare services.'
            }
          ],
          source_authority: 'National Health Authority (NHA) & Indian Nursing Council'
        }
      ]
    }
  ],

  // Generic Blueprint for all other exam categories
  Standard: {
    stages: [
      {
        stage_name: 'Stage 1 — Preliminary / Tier 1 Examination',
        subjects: [
          {
            name: 'Quantitative Aptitude & Numerical Ability',
            topics: [
              {
                name: 'Percentage & Commercial Mathematics',
                subtopic: 'Fraction Conversion, Successive Discounts, Profit & Loss, Compound Interest',
                description: 'Core arithmetic module testing calculation speed, successive variations, and population growth models.',
                priority: 'high',
                pyq_weightage: 9.6,
                concept: 'Percentage means parts per hundred. Fundamental conversions: 1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%, 1/12=8.33%.\nSuccessive change formula: Net Change = (a + b + ab/100)%.',
                formulas: [
                  { name: 'Successive Change', formula: 'Net = a + b + (a*b)/100 %', notes: 'Increase is positive, decrease is negative' },
                  { name: 'Price-Consumption', formula: 'Reduction = [x / (100 + x)] * 100 %', notes: 'Constant expenditure rule' }
                ],
                examples: [
                  {
                    question: 'If length of a rectangle increases by 20% and breadth decreases by 10%, find net change in area.',
                    step1: 'Net = 20 - 10 + (20 * -10)/100 = 10 - 2 = +8%.',
                    answer: '8% increase.'
                  }
                ],
                shortcuts: ['⚡ 16.66% = 1/6 directly in rough sheet.'],
                common_mistakes: ['⚠️ Confusing increase TO 120% with increase BY 120%.'],
                quick_revision: '* Multiplicative factor: +20% -> x1.2; -10% -> x0.9.\n* Net change: a + b + ab/100.',
                practice_questions: [
                  {
                    id: 'pq_gen_pct_1',
                    question: 'A number is first increased by 20% and then decreased by 20%. The net percentage change is:',
                    options: ['No change', '4% decrease', '4% increase', '2% decrease'],
                    correct_index: 1,
                    explanation: 'Net change = +20 - 20 + (20 * -20)/100 = -4% (4% decrease).'
                  }
                ]
              },
              {
                name: 'Time, Speed, Distance & Work',
                subtopic: 'Relative Speed, Trains & Platforms, Pipes & Cisterns, Efficiency Ratio',
                description: 'Crucial speed-accuracy module assessing relative motion and unitary rate problems.',
                priority: 'high',
                pyq_weightage: 9.3,
                concept: 'Distance = Speed x Time. Conversion: 1 km/h = 5/18 m/s; 1 m/s = 18/5 km/h.\nRelative speed when moving in opposite direction = S1 + S2; same direction = |S1 - S2|.',
                formulas: [
                  { name: 'Speed Conversion', formula: 'km/h to m/s = Multiply by 5/18', notes: 'm/s to km/h = Multiply by 18/5' },
                  { name: 'Average Speed', formula: 'Avg Speed = (2 * S1 * S2) / (S1 + S2)', notes: 'For equal distance intervals' }
                ],
                examples: [
                  {
                    question: 'A train 150m long passes a pole in 15 seconds. Find speed of train in km/h.',
                    step1: 'Speed in m/s = 150m / 15s = 10 m/s.',
                    step2: 'Speed in km/h = 10 * (18/5) = 36 km/h.',
                    answer: '36 km/h.'
                  }
                ],
                shortcuts: ['⚡ Train passing platform: Distance = Length of Train + Length of Platform.'],
                common_mistakes: ['⚠️ Forgetting to convert km/h to m/s when distance is given in meters.'],
                quick_revision: '* Relative speed in opposite direction = S1 + S2.\n* Average speed for equal distance = 2xy / (x+y).',
                practice_questions: [
                  {
                    id: 'pq_gen_tsd_1',
                    question: 'A person travels from A to B at 60 km/h and returns at 40 km/h. The average speed for the entire trip is:',
                    options: ['50 km/h', '48 km/h', '45 km/h', '52 km/h'],
                    correct_index: 1,
                    explanation: 'Avg Speed = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.'
                  }
                ]
              }
            ]
          },
          {
            name: 'General Intelligence, Reasoning & Logic',
            topics: [
              {
                name: 'Logical Deductions, Syllogisms & Venn Diagrams',
                subtopic: 'Statement & Assumptions, 100-50 Rule, Either-Or Cases, Possibility Scenarios',
                description: 'Verbal reasoning testing structural deduction without assuming real-world truth.',
                priority: 'high',
                pyq_weightage: 9.2,
                concept: 'Syllogism propositions: A (All S are P - 100/50), E (No S is P - 100/100), I (Some S are P - 50/50), O (Some S are not P - 50/100).\nComplementary pairs for Either-Or: Some + No (I + E) or All + Some Not (A + O).',
                formulas: [],
                examples: [
                  {
                    question: 'Statements: All Mangoes are Fruits. Some Fruits are Sweet. Conclusion: Some Mangoes are Sweet.',
                    step1: 'Middle term "Fruits" is not distributed in either premise.',
                    step2: 'Hence definite conclusion cannot be drawn.',
                    answer: 'Conclusion does not follow.'
                  }
                ],
                shortcuts: ['⚡ Two positive statements can NEVER yield a negative definite conclusion.'],
                common_mistakes: ['⚠️ Assuming conclusion is true just because it matches real-world facts.'],
                quick_revision: '* All + All = All.\n* Some + All = Some.\n* Some + Some = No definite conclusion.',
                practice_questions: [
                  {
                    id: 'pq_gen_syl_1',
                    question: 'Statements: All Pens are Books. All Books are Pensils. Conclusions: I. All Pens are Pencils. II. Some Pencils are Pens.',
                    options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither follows'],
                    correct_index: 2,
                    explanation: 'All Pens -> Books -> Pencils, hence All Pens are Pencils (I follows) and Some Pencils are Pens (II follows).'
                  }
                ]
              },
              {
                name: 'Seating Arrangement, Puzzles & Direction Sense',
                subtopic: 'Linear & Circular Seating, North-South facing, Angle rotations, Shortest path Pythagoras',
                description: 'Spatial and analytical puzzle solving under time constraints.',
                priority: 'high',
                pyq_weightage: 9.0,
                concept: 'Direction compass: North (Top), South (Bottom), East (Right), West (Left).\nPythagoras Theorem: Shortest Distance = sqrt(Base^2 + Perpendicular^2).\nFacing Centre in circle: Clockwise = Left, Anti-clockwise = Right.',
                formulas: [
                  { name: 'Pythagoras Shortest Distance', formula: 'd = sqrt(x^2 + y^2)', notes: 'Calculate net north-south and east-west displacements' }
                ],
                examples: [
                  {
                    question: 'A man walks 4 km North, turns right and walks 3 km. How far is he from his starting point?',
                    step1: 'Distance = sqrt(4^2 + 3^2) = sqrt(16 + 9) = sqrt(25) = 5 km.',
                    answer: '5 km North-East.'
                  }
                ],
                shortcuts: ['⚡ Common Pythagorean triplets: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25).'],
                common_mistakes: ['⚠️ Mixing clockwise and counter-clockwise direction when people face outside the circle.'],
                quick_revision: '* Facing Centre: Right is Anti-Clockwise.\n* Shortest distance = sqrt(dx^2 + dy^2).',
                practice_questions: [
                  {
                    id: 'pq_gen_dir_1',
                    question: 'A person walks 8 km East, then 6 km South. What is the shortest distance from the start point?',
                    options: ['14 km', '10 km', '12 km', '9 km'],
                    correct_index: 1,
                    explanation: 'Distance = sqrt(8^2 + 6^2) = sqrt(64 + 36) = sqrt(100) = 10 km.'
                  }
                ]
              }
            ]
          },
          {
            name: 'General Awareness & Indian Polity/Constitution',
            topics: [
              {
                name: 'Indian Constitution, Fundamental Rights & Governance',
                subtopic: 'Preamble, Part III Fundamental Rights (Art 14-32), Writs, DPSP & Basic Structure',
                description: 'Comprehensive constitutional framework, institutional functions, and judicial review doctrines.',
                priority: 'high',
                pyq_weightage: 9.7,
                concept: 'The Indian Constitution was adopted on 26 November 1949 and came into force on 26 January 1950.\n* Part III: Fundamental Rights (Articles 12-35) - Justiciable in Supreme Court (Art 32) and High Courts (Art 226).\n* 5 Writs: Habeas Corpus ("To have the body"), Mandamus ("We command"), Prohibition, Certiorari, Quo-Warranto ("By what authority").\n* Kesavananda Bharati case (1973): Established Basic Structure Doctrine.',
                formulas: [],
                examples: [
                  {
                    question: 'Which constitutional amendment added the words "Socialist, Secular, and Integrity" to the Preamble of India?',
                    step1: 'Identify amendment: 42nd Constitutional Amendment Act, 1976 (Mini-Constitution).',
                    answer: '42nd Amendment Act 1976.'
                  }
                ],
                shortcuts: ['⚡ Right to Constitutional Remedies (Art 32) called "Heart and Soul of Constitution" by Dr. B.R. Ambedkar.'],
                common_mistakes: ['⚠️ Assuming Fundamental Rights are absolute — they are subject to reasonable restrictions under Art 19(2).'],
                quick_revision: '* Fundamental Rights: Part III, Arts 12-35.\n* DPSPs: Part IV, Arts 36-51 (Non-justiciable).\n* Fundamental Duties: Part IV-A, Art 51A (Swaran Singh Committee, 42nd Amendment).',
                practice_questions: [
                  {
                    id: 'pq_gen_pol_1',
                    question: 'Which writ is issued by the Supreme Court to secure the release of a person unlawfully detained?',
                    options: ['Mandamus', 'Habeas Corpus', 'Quo-Warranto', 'Certiorari'],
                    correct_index: 1,
                    explanation: 'Habeas Corpus (meaning "You may have the body") is issued against both public and private authorities for unlawful detention.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        stage_name: 'Stage 2 — Main / Advanced Examination',
        subjects: [
          {
            name: 'Domain Specialization & Applied Studies',
            topics: [
              {
                name: 'Indian Economy, Budgeting & Sustainable Development',
                subtopic: 'Fiscal Policy, RBI Monetary Instruments, GDP Deflator, Foreign Trade & Inflation',
                description: 'Macroeconomic stability, fiscal consolidation, balance of payments, and banking reforms.',
                priority: 'high',
                pyq_weightage: 9.5,
                concept: 'Fiscal Deficit = Total Expenditure - Total Receipts excluding borrowings.\nMonetary Policy Committee (MPC) targets headline CPI inflation at 4% +/- 2%.\nRepo rate is the rate at which RBI lends short-term funds to commercial banks against G-Secs.',
                formulas: [
                  { name: 'Fiscal Deficit', formula: 'Fiscal Deficit = Revenue Deficit + Capital Outlay + Net Lending - Non-Debt Capital Receipts', notes: 'Equals gross borrowing of Government' }
                ],
                examples: [],
                shortcuts: ['⚡ Monetary Policy transmission: Lower Repo -> Lower lending rates -> Higher investment & liquidity.'],
                common_mistakes: ['⚠️ Confusing Headline Inflation (includes volatile food & fuel) with Core Inflation (excludes food & fuel).'],
                quick_revision: '* Inflation target: 4% (+/- 2%) under RBI Act 1934 Section 45ZA.\n* Repo Rate at 6.50% (SDF at 6.25%, MSF at 6.75%).',
                practice_questions: [
                  {
                    id: 'pq_gen_econ_1',
                    question: 'The difference between total government expenditure and total revenue receipts plus non-debt capital receipts is known as:',
                    options: ['Revenue Deficit', 'Fiscal Deficit', 'Primary Deficit', 'Budget Deficit'],
                    correct_index: 1,
                    explanation: 'Fiscal Deficit represents the total borrowing requirements of the government from all sources.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

function seedAllExams() {
  console.log('🌱 [Universal Syllabus & Notes Seeder] Querying all 49 exams in database...');
  const exams = db.query('SELECT id, code, name, category, organization, qualification FROM exams');
  console.log(`Found ${exams.length} exams. Generating complete official syllabus hierarchies and note studios...`);

  let totalHierarchyInserted = 0;
  let totalNotesInserted = 0;

  for (const exam of exams) {
    // 1. Determine template based on category
    let templateStages = [];
    if (exam.category === 'Healthcare' || exam.id.includes('norcet') || exam.id.includes('nursing')) {
      templateStages = syllabusTemplates.Healthcare;
    } else {
      templateStages = syllabusTemplates.Standard.stages;
    }

    let displayOrder = 1;

    for (const stageObj of templateStages) {
      const stageName = stageObj.stage || stageObj.stage_name;
      const subjectsList = stageObj.subjects || [stageObj];

      for (let sIdx = 0; sIdx < subjectsList.length; sIdx++) {
        const subj = subjectsList[sIdx];
        const subjectName = subj.subject || subj.name;
        const topicsList = subj.topics || [];
        const cleanExamCode = exam.code.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
        const subjectCode = `${cleanExamCode}_SUBJ_${sIdx + 1}`;

        // Insert into legacy subjects table as well for backwards compatibility
        const subjectId = `sub_${exam.id}_${sIdx + 1}`;
        db.run(`
          INSERT OR REPLACE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order)
          VALUES (?, ?, ?, ?, ?, 'BookOpen', 25, ?)
        `, [subjectId, exam.id, subjectName, subjectCode, `Core syllabus module for ${subjectName}`, displayOrder]);

        for (let tIdx = 0; tIdx < topicsList.length; tIdx++) {
          const top = topicsList[tIdx];
          const topicId = `syl_${exam.id}_${sIdx + 1}_${tIdx + 1}`;
          const topicCode = `${cleanExamCode}_TOP_${sIdx + 1}_${tIdx + 1}`;

          // 2. Insert into syllabus_hierarchy
          db.run(`
            INSERT OR REPLACE INTO syllabus_hierarchy (
              id, exam_id, stage, subject, topic, subtopic, description,
              priority, pyq_weightage, display_order, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `, [
            topicId,
            exam.id,
            stageName,
            subjectName,
            top.name,
            top.subtopic || top.name,
            top.description || `Comprehensive module on ${top.name} for ${exam.name}.`,
            top.priority || 'high',
            top.pyq_weightage || 9.0,
            displayOrder
          ]);
          totalHierarchyInserted++;

          // 3. Insert into topic_notes with full markdown, formulas, examples, shortcuts, and MCQs
          db.run(`
            INSERT OR REPLACE INTO topic_notes (
              id, topic_id, exam_id, title, concept, formulas, examples,
              shortcuts, common_mistakes, quick_revision, practice_questions,
              source_authority, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [
            `note_${topicId}`,
            topicId,
            exam.id,
            `${top.name} — Complete Master Guide & Question Bank`,
            top.concept || `### 1. Overview of ${top.name}\n${top.description}\n\n* Key principles and exam-tested frameworks\n* High-probability exam models and case scenarios.`,
            JSON.stringify(top.formulas || []),
            JSON.stringify(top.examples || []),
            JSON.stringify(top.shortcuts || [`⚡ Master formula and high-speed problem solving shortcuts for ${top.name}.`]),
            JSON.stringify(top.common_mistakes || [`⚠️ Avoid rushing calculations without verifying units and negative marking caveats.`]),
            top.quick_revision || `* Quick 3-minute revision card for ${top.name}.\n* Revise all core terms and standard values before taking the mock test.`,
            JSON.stringify(top.practice_questions || []),
            top.source_authority || `${exam.organization} Official Syllabus & National Standard Standard Reference Bank`
          ]);
          totalNotesInserted++;

          // 4. Insert into legacy topics table for full compatibility
          db.run(`
            INSERT OR REPLACE INTO topics (
              id, subject_id, name, code, description, difficulty_level,
              pyq_importance_score, estimated_hours, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 4, ?)
          `, [
            topicId,
            subjectId,
            top.name,
            topicCode,
            top.description || `Module for ${top.name}`,
            top.priority === 'high' ? 'hard' : 'medium',
            top.pyq_weightage || 9.0,
            displayOrder
          ]);

          displayOrder++;
        }
      }
    }
  }

  console.log(`✅ Success! Seeded ${totalHierarchyInserted} syllabus topics and ${totalNotesInserted} rich topic note studios across all ${exams.length} exams!`);
}

seedAllExams();
