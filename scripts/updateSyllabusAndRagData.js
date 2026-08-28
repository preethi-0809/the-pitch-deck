const fs = require('fs');
const path = require('path');
const { getDiscoveryExams } = require('../database/seed/discoveryExamsData');
const exams = getDiscoveryExams();

const templates = {
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
          concept: '### 1. Obstetric Milestones & Antenatal Assessment\n* **Naegele\'s Rule (EDD)**: Estimated Date of Delivery = First Day of LMP + 9 Months + 7 Days.\n* **Stages of Labor**: Stage 1 (Onset of true labor to full cervical dilatation 10 cm), Stage 2 (Full dilatation to delivery of baby), Stage 3 (Delivery of baby to expulsion of placenta), Stage 4 (First 1-2 hours observation for PPH).\n* **Postpartum Hemorrhage (PPH)**: Blood loss > 500 mL in vaginal delivery or > 1000 mL in C-section. Primary cause: Uterine atony (4 Ts: Tone, Trauma, Tissue, Thrombin).\n\n### 2. Neonatal Resuscitation & APGAR Scoring\n* Evaluated at 1 minute and 5 minutes after birth across 5 parameters (0-2 points each, max 10): Appearance, Pulse, Grimace, Activity, Respiration.',
          formulas: [
            { name: 'Naegele\'s Rule for EDD', formula: 'EDD = LMP + 7 Days + 9 Calendar Months', notes: 'Assumes regular 28-day menstrual cycle.' },
            { name: 'APGAR Score', formula: 'Score = Appearance (0-2) + Pulse (0-2) + Grimace (0-2) + Activity (0-2) + Respiration (0-2)', notes: '7-10 Normal; 4-6 Moderate Depression; 0-3 Severe Depression.' }
          ],
          examples: [
            {
              question: 'A pregnant woman reports LMP as June 10, 2025. Calculate her Estimated Date of Delivery (EDD).',
              step1: 'June 10 + 7 days = June 17.',
              step2: 'June + 9 months = March 2026.',
              answer: 'March 17, 2026.'
            }
          ],
          shortcuts: [
            '⚡ APGAR Mnemonic: Appearance, Pulse, Grimace, Activity, Respiration.',
            '⚡ 4Ts of PPH: Tone (Uterine Atony - 70%), Trauma, Tissue, Thrombin.'
          ],
          common_mistakes: [
            '⚠️ Giving Methylergometrine in hypertensive mothers — contraindicated due to vasoconstrictive surge.',
            '⚠️ Suctioning nose before mouth — always suction mouth first, then nose.'
          ],
          quick_revision: '* EDD = LMP + 9 months + 7 days.\n* APGAR score >= 7 is normal.\n* Magnesium Sulfate (MgSO4) is drug of choice for Eclampsia seizures.\n* PPH drug of choice: Oxytocin (10 IU IM/IV infusion).',
          practice_questions: [
            {
              id: 'pq_obg_1',
              question: 'What is the drug of choice for the prevention and management of convulsions in Eclampsia?',
              options: ['Diazepam', 'Magnesium Sulfate', 'Phenytoin', 'Sodium Valproate'],
              correct_index: 1,
              explanation: 'Magnesium Sulfate (MgSO4) is the gold standard drug of choice for eclampsia.'
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
          concept: '### 1. Bio-Medical Waste (BMW) Management Rules 2016\n* **Yellow Bag**: Human anatomical waste, soiled dressings, expired drugs, cytotoxic waste (Incineration).\n* **Red Bag**: Contaminated recyclable plastic waste (tubing, IV bottles, catheters, syringes without needles) -> Autoclaving.\n* **White Translucent**: Sharps including needles, scalpels -> Autoclave/Dry heat sterilization.\n* **Blue Cardboard Box**: Glassware (vials, ampoules) -> Sodium Hypochlorite disinfection.',
          formulas: [],
          examples: [],
          shortcuts: ['⚡ BMW Color Coding: Yellow = Anatomy, Red = Plastics, White = Sharps, Blue = Glassware.'],
          common_mistakes: ['⚠️ Discarding glass vials into yellow or red bags — glass must go into Blue container.'],
          quick_revision: '* BMW: Yellow (Anatomy), Red (Plastics), White (Sharps), Blue (Glassware).\n* Cold chain ideal storage temperature: +2°C to +8°C.',
          practice_questions: [
            {
              id: 'pq_comm_1',
              question: 'Under the Bio-Medical Waste Management Rules 2016, discarded human placenta must be segregated in which colored bag?',
              options: ['Red Bag', 'Yellow Bag', 'Blue Container', 'White Translucent Box'],
              correct_index: 1,
              explanation: 'Human anatomical waste is collected in Yellow bags for deep burial or incineration.'
            }
          ],
          source_authority: 'MoHFW UIP Guidelines & BMW Rules 2016'
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
          concept: '### 1. Ayushman Bharat - PM-JAY\n* Provides health cover of **₹5 Lakh per family per year** for secondary and tertiary care hospitalization.\n\n### 2. Bioethics in Nursing\n* Autonomy, Beneficence, Non-maleficence, and Justice.',
          formulas: [],
          examples: [],
          shortcuts: ['⚡ 4 Core Bioethical Pillars: Autonomy, Beneficence, Non-Maleficence, Justice.'],
          common_mistakes: ['⚠️ Performing invasive clinical procedures without valid informed consent.'],
          quick_revision: '* PM-JAY: ₹5 Lakh health cover per family per year.',
          practice_questions: [
            {
              id: 'pq_eth_1',
              question: 'Under the Ayushman Bharat PM-JAY scheme, what is the annual hospitalization health cover provided per eligible family?',
              options: ['₹2 Lakh', '₹3 Lakh', '₹5 Lakh', '₹10 Lakh'],
              correct_index: 2,
              explanation: 'PM-JAY provides financial protection up to ₹5,00,000 per family per year.'
            }
          ],
          source_authority: 'National Health Authority (NHA) & Indian Nursing Council'
        }
      ]
    }
  ],
  Standard: [
    {
      stage: 'Stage 1 — Preliminary / Tier 1 Examination',
      subject: 'Quantitative Aptitude & Numerical Ability',
      topics: [
        {
          name: 'Percentage & Commercial Mathematics',
          subtopic: 'Fraction Conversion, Successive Discounts, Profit & Loss, Compound Interest',
          description: 'Core arithmetic module testing calculation speed, successive variations, and population growth models.',
          priority: 'high',
          pyq_weightage: 9.6,
          concept: 'Percentage means parts per hundred. 1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%, 1/12=8.33%.\nNet Change = (a + b + ab/100)%.',
          formulas: [
            { name: 'Successive Change', formula: 'Net = a + b + (a*b)/100 %', notes: 'Increase is positive, decrease is negative' },
            { name: 'Price-Consumption', formula: 'Reduction = [x / (100 + x)] * 100 %', notes: 'Constant expenditure rule' }
          ],
          examples: [
            {
              question: 'If length increases by 20% and breadth decreases by 10%, find net change in area.',
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
          ],
          source_authority: 'NCERT Class 9-10 Mathematics & Quantitative Aptitude by R.S. Aggarwal'
        },
        {
          name: 'Time, Speed, Distance & Work',
          subtopic: 'Relative Speed, Trains & Platforms, Pipes & Cisterns, Efficiency Ratio',
          description: 'Crucial speed-accuracy module assessing relative motion and unitary rate problems.',
          priority: 'high',
          pyq_weightage: 9.3,
          concept: 'Distance = Speed x Time. Conversion: 1 km/h = 5/18 m/s; 1 m/s = 18/5 km/h.\nRelative speed opposite = S1 + S2; same direction = |S1 - S2|.',
          formulas: [
            { name: 'Speed Conversion', formula: 'km/h to m/s = Multiply by 5/18', notes: 'm/s to km/h = Multiply by 18/5' },
            { name: 'Average Speed', formula: 'Avg Speed = (2 * S1 * S2) / (S1 + S2)', notes: 'For equal distance intervals' }
          ],
          examples: [
            {
              question: 'A person travels at 60 km/h and returns at 40 km/h. Find average speed.',
              step1: 'Avg Speed = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.',
              answer: '48 km/h.'
            }
          ],
          shortcuts: ['⚡ Train passing platform: Distance = Length of Train + Length of Platform.'],
          common_mistakes: ['⚠️ Forgetting to convert km/h to m/s.'],
          quick_revision: '* Relative speed opposite direction = S1 + S2.\n* Average speed = 2xy / (x+y).',
          practice_questions: [
            {
              id: 'pq_gen_tsd_1',
              question: 'A train 150m long passes a pole in 15 seconds. Speed in km/h is:',
              options: ['30 km/h', '36 km/h', '40 km/h', '45 km/h'],
              correct_index: 1,
              explanation: 'Speed = (150/15) * (18/5) = 10 * 3.6 = 36 km/h.'
            }
          ],
          source_authority: 'Fast Track Objective Arithmetic by Rajesh Verma'
        }
      ]
    },
    {
      stage: 'Stage 1 — Preliminary / Tier 1 Examination',
      subject: 'General Intelligence, Reasoning & Logic',
      topics: [
        {
          name: 'Logical Deductions, Syllogisms & Venn Diagrams',
          subtopic: 'Statement & Assumptions, 100-50 Rule, Either-Or Cases, Possibility Scenarios',
          description: 'Verbal reasoning testing structural deduction without assuming real-world truth.',
          priority: 'high',
          pyq_weightage: 9.2,
          concept: 'Syllogism propositions: All (100/50), No (100/100), Some (50/50), Some Not (50/100).\nComplementary pairs: Some + No or All + Some Not.',
          formulas: [],
          examples: [],
          shortcuts: ['⚡ Two positive statements can NEVER yield a negative definite conclusion.'],
          common_mistakes: ['⚠️ Assuming conclusion is true just because it matches real-world facts.'],
          quick_revision: '* All + All = All; Some + All = Some.',
          practice_questions: [
            {
              id: 'pq_gen_syl_1',
              question: 'Statements: All Pens are Books. All Books are Pencils. Conclusions: I. All Pens are Pencils.',
              options: ['Follows', 'Does not follow', 'Either follows', 'Neither'],
              correct_index: 0,
              explanation: 'All Pens -> Books -> Pencils, hence All Pens are Pencils follows.'
            }
          ],
          source_authority: 'A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal'
        }
      ]
    },
    {
      stage: 'Stage 1 — Preliminary / Tier 1 Examination',
      subject: 'General Awareness & Indian Polity/Constitution',
      topics: [
        {
          name: 'Indian Constitution, Fundamental Rights & Governance',
          subtopic: 'Preamble, Part III Fundamental Rights (Art 14-32), Writs, DPSP & Basic Structure',
          description: 'Comprehensive constitutional framework, institutional functions, and judicial review doctrines.',
          priority: 'high',
          pyq_weightage: 9.7,
          concept: 'Part III: Fundamental Rights (Articles 12-35) - Justiciable in Supreme Court (Art 32) and High Courts (Art 226).\n5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto.\nKesavananda Bharati case (1973): Established Basic Structure Doctrine.',
          formulas: [],
          examples: [],
          shortcuts: ['⚡ Right to Constitutional Remedies (Art 32) called Heart and Soul of Constitution by Dr. Ambedkar.'],
          common_mistakes: ['⚠️ Fundamental Rights are subject to reasonable restrictions under Art 19(2).'],
          quick_revision: '* Fundamental Rights: Part III, Arts 12-35.\n* DPSPs: Part IV, Arts 36-51.',
          practice_questions: [
            {
              id: 'pq_gen_pol_1',
              question: 'Which writ is issued by the Supreme Court to secure the release of an unlawfully detained person?',
              options: ['Mandamus', 'Habeas Corpus', 'Quo-Warranto', 'Certiorari'],
              correct_index: 1,
              explanation: 'Habeas Corpus is issued against unlawful detention.'
            }
          ],
          source_authority: 'Indian Polity by M. Laxmikanth (McGraw Hill 7th Edition)'
        }
      ]
    },
    {
      stage: 'Stage 2 — Main / Advanced Examination',
      subject: 'Domain Specialization & Applied Studies',
      topics: [
        {
          name: 'Indian Economy, Budgeting & Sustainable Development',
          subtopic: 'Fiscal Policy, RBI Monetary Instruments, GDP Deflator, Foreign Trade & Inflation',
          description: 'Macroeconomic stability, fiscal consolidation, balance of payments, and banking reforms.',
          priority: 'high',
          pyq_weightage: 9.5,
          concept: 'Fiscal Deficit = Total Expenditure - Total Receipts excluding borrowings.\nMonetary Policy Committee (MPC) targets headline CPI inflation at 4% +/- 2%.\nRepo rate is the rate at which RBI lends short-term funds against G-Secs.',
          formulas: [],
          examples: [],
          shortcuts: ['⚡ Monetary Policy transmission: Lower Repo -> Lower lending rates -> Higher investment.'],
          common_mistakes: ['⚠️ Headline Inflation includes food & fuel; Core Inflation excludes food & fuel.'],
          quick_revision: '* Inflation target: 4% (+/- 2%) under RBI Act 1934 Section 45ZA.\n* Repo Rate at 6.50%.',
          practice_questions: [
            {
              id: 'pq_gen_econ_1',
              question: 'The difference between total government expenditure and total revenue receipts plus non-debt capital receipts is:',
              options: ['Revenue Deficit', 'Fiscal Deficit', 'Primary Deficit', 'Trade Deficit'],
              correct_index: 1,
              explanation: 'Fiscal Deficit represents the total borrowing requirements of the government.'
            }
          ],
          source_authority: 'Indian Economy by Ramesh Singh (McGraw Hill 16th Edition)'
        }
      ]
    }
  ]
};

const syllabusHierarchyData = [];
const topicNotesData = [];

for (const exam of exams) {
  const isHealthcare = exam.category === 'Healthcare' || exam.id.includes('norcet') || exam.id.includes('nursing');
  const stageList = isHealthcare ? templates.Healthcare : templates.Standard;

  let displayOrder = 1;
  for (let sIdx = 0; sIdx < stageList.length; sIdx++) {
    const stg = stageList[sIdx];
    const stageName = stg.stage;
    const subjectName = stg.subject;

    for (let tIdx = 0; tIdx < stg.topics.length; tIdx++) {
      const top = stg.topics[tIdx];
      const topicId = 'syl_' + exam.id + '_' + (sIdx + 1) + '_' + (tIdx + 1);

      syllabusHierarchyData.push({
        id: topicId,
        exam_id: exam.id,
        stage: stageName,
        subject: subjectName,
        topic: top.name,
        subtopic: top.subtopic || top.name,
        description: top.description,
        priority: top.priority || 'high',
        pyq_weightage: top.pyq_weightage || 9.0,
        display_order: displayOrder
      });

      topicNotesData.push({
        id: 'note_' + topicId,
        topic_id: topicId,
        exam_id: exam.id,
        title: top.name + ' — Complete Master Guide & Question Bank',
        concept: top.concept,
        formulas: JSON.stringify(top.formulas || []),
        examples: JSON.stringify(top.examples || []),
        shortcuts: JSON.stringify(top.shortcuts || []),
        common_mistakes: JSON.stringify(top.common_mistakes || []),
        quick_revision: top.quick_revision,
        practice_questions: JSON.stringify(top.practice_questions || []),
        source_authority: top.source_authority || (exam.organization + ' Official Syllabus Standard')
      });

      displayOrder++;
    }
  }
}

const existingFile = require('../database/seed/syllabusAndRagData');
const caRagDocumentsData = existingFile.caRagDocumentsData;
const caSourcesData = existingFile.caSourcesData;

const outputContent = '// Auto-generated Universal Syllabus, Topic Notes & RAG Data for all 49 Exams\n' +
  'const syllabusHierarchyData = ' + JSON.stringify(syllabusHierarchyData, null, 2) + ';\n\n' +
  'const topicNotesData = ' + JSON.stringify(topicNotesData, null, 2) + ';\n\n' +
  'const caRagDocumentsData = ' + JSON.stringify(caRagDocumentsData, null, 2) + ';\n\n' +
  'const caSourcesData = ' + JSON.stringify(caSourcesData, null, 2) + ';\n\n' +
  'module.exports = { syllabusHierarchyData, topicNotesData, caRagDocumentsData, caSourcesData };\n';

fs.writeFileSync(path.resolve(__dirname, '../database/seed/syllabusAndRagData.js'), outputContent, 'utf-8');
console.log('✅ Successfully updated database/seed/syllabusAndRagData.js with ' + syllabusHierarchyData.length + ' syllabus topics and ' + topicNotesData.length + ' topic notes!');
