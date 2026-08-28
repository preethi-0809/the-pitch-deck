const db = require('../../backend/src/config/database');

const tutorAgent = {
  name: 'TutorAgent',
  description: 'AI Doubt Solver providing multi-depth concept explanations, step-by-step logic, and bilingual EN/TA solutions.',

  async explainConcept({ query, topicId = null, explanationMode = 'exam_oriented', language = 'en' }) {
    let topicContext = null;
    let materialContext = null;

    if (topicId) {
      topicContext = db.get('SELECT t.*, s.name as subject_name FROM topics t JOIN subjects s ON t.subject_id = s.id WHERE t.id = ?', [topicId]);
      materialContext = db.get('SELECT * FROM study_materials WHERE topic_id = ? LIMIT 1', [topicId]);
    }

    const modeHeaders = {
      simple: '🌱 Simple & Intuitive Explanation',
      exam_oriented: '🎯 High-Yield Exam-Oriented Analysis',
      detailed: '📚 Comprehensive Deep-Dive Explanation',
      quick_revision: '⚡ Quick Revision Flash Breakdown'
    };

    // Generate enriched response based on mode
    let explanationText = '';
    let keyPoints = [];
    let examTip = '';
    let followUpQuestion = '';

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('fundamental right') || lowerQuery.includes('art 32') || lowerQuery.includes('mandamus') || lowerQuery.includes('writs')) {
      if (explanationMode === 'simple') {
        explanationText = `Fundamental Rights are like constitutional guarantees given to every citizen against unfair government actions. Think of them as protective shields. If any authority takes away your basic freedom without legal justification, Article 32 allows you to go straight to the Supreme Court. The court issues special orders called **Writs** (like *Habeas Corpus* for unlawful detention, or *Mandamus* commanding a public officer to do their official duty).`;
        keyPoints = [
          'Part III of the Indian Constitution (Articles 12 to 35)',
          'Justiciable: Courts directly enforce them',
          'Article 32 is the remedy called "Heart and Soul of the Constitution" by Dr. Ambedkar'
        ];
        examTip = 'Remember: High Courts also have writ powers under Article 226, which is actually broader than Supreme Court Art 32 because High Courts can issue writs for ordinary legal rights too!';
        followUpQuestion = 'Would you like to test your understanding of the difference between Mandamus and Quo-Warranto with a quick MCQ?';
      } else if (explanationMode === 'quick_revision') {
        explanationText = `**Articles 12-35 (Part III)**:
- **Art 14**: Equality before Law (Rule of law - UK) & Equal protection of Laws (Substantive equality - USA).
- **Art 19**: 6 Democratic Freedoms (Speech, Assembly, Association, Movement, Residence, Profession).
- **Art 21**: Life & Personal Liberty (Includes Privacy, Clean Environment, Speedy Trial).
- **Art 32**: Constitutional Remedies (5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto).
- **Non-derogable Rights in Emergency**: Articles 20 & 21 can NEVER be suspended (44th Amendment 1978).`;
        keyPoints = ['Articles 20 & 21 never suspendable', 'Art 32 vs Art 226 distinction', 'Reasonable restrictions under 19(2)'];
        examTip = 'Frequent PYQ Trap: Mandamus does NOT lie against private bodies or the President/Governor.';
        followUpQuestion = 'Shall we look at previous year questions asked from Article 14 and Article 21?';
      } else {
        explanationText = `### Constitutional Analysis: Fundamental Rights & Judicial Review
Fundamental Rights in Part III (Articles 12-35) constitute the core bulwark of constitutional democracy in India. They represent negative obligations upon the State (preventing authoritarian tyranny) and positive liberties for citizens.

1. **Doctrine of Severability & Eclipse (Art 13)**: Laws inconsistent with Fundamental Rights are void to the extent of inconsistency.
2. **Expansion of Article 21**: Post-*Maneka Gandhi (1978)*, "Procedure established by law" was read alongside "Due Process of Law", establishing substantive fairness and non-arbitrariness (*E.P. Royappa*).
3. **Writ Architecture**:
   - *Habeas Corpus*: Commands production of an illegally detained person.
   - *Mandamus*: Compels statutory performance of a mandatory public duty.
   - *Certiorari*: Quashes judicial or quasi-judicial orders lacking jurisdiction.`;
        keyPoints = [
          'Maneka Gandhi (1978) introduced substantive due process into Art 21',
          'Puttaswamy (2017) declared Right to Privacy as intrinsic to Art 21',
          'Fundamental Rights are not absolute but subject to reasonable restrictions'
        ];
        examTip = 'For UPSC & State PSC Mains: Always balance individual liberty with State security and public order grounds under 19(2).';
        followUpQuestion = 'Would you like step-by-step guidance on structuring a 15-mark answer on Judicial Review vs Judicial Activism?';
      }
    } else if (lowerQuery.includes('repo') || lowerQuery.includes('inflation') || lowerQuery.includes('monetary') || lowerQuery.includes('rbi')) {
      if (explanationMode === 'simple') {
        explanationText = `When RBI wants to fight high inflation (rising prices), it increases the **Repo Rate**.
Think of the Repo Rate as the interest rate at which commercial banks borrow money from RBI. When RBI raises this rate, banks have to pay more to borrow, so they increase interest rates on loans for public cars, homes, and businesses. Because borrowing becomes costlier, people spend less, reducing demand in the market, which cools down prices!`;
        keyPoints = [
          'Repo Rate: Short-term lending rate by RBI to commercial banks',
          'High Repo Rate → Lower inflation, slower growth (Contractionary policy)',
          'Low Repo Rate → Boosts economy and loans, higher inflation risk (Expansionary policy)'
        ];
        examTip = 'Standing Deposit Facility (SDF) rate is 0.25% below the Repo Rate and operates without government collateral.';
        followUpQuestion = 'Do you want to know how Repo rate differs from Reverse Repo and MSF?';
      } else {
        explanationText = `### Monetary Policy Framework & Liquidity Adjustment (LAF)
Under the amended RBI Act (Section 45ZB), the Monetary Policy Committee (MPC) targets headline CPI inflation at **4% (+/- 2% tolerance band)**.

1. **Policy Corridor Structure**:
   - **Ceiling**: Marginal Standing Facility (MSF) rate = Repo Rate + 0.25%
   - **Benchmark**: Policy Repo Rate (Key policy rate)
   - **Floor**: Standing Deposit Facility (SDF) = Repo Rate - 0.25%
2. **Transmission Mechanism**:
   - Changes in repo rate flow to the Marginal Cost of Funds Based Lending Rate (MCLR) / External Benchmark Lending Rate (EBLR) of commercial banks.`;
        keyPoints = [
          'MPC consists of 6 members with 4-year tenure',
          'SDF absorbs excess uncollateralized banking liquidity',
          'Headline inflation target is based on Consumer Price Index (CPI Combined)'
        ];
        examTip = 'Exam Catch: Core Inflation excludes volatile Food and Fuel components, whereas RBI targets Headline CPI.';
        followUpQuestion = 'Shall we generate 3 practice MCQs on RBI liquidity tools?';
      }
    } else {
      // General dynamic academic response
      explanationText = `### Academic Analysis on: "${query}"

Here is the concept breakdown for **${topicContext ? topicContext.name : 'Target Topic'}**:

1. **Core Concept Definition**:
   In competitive exam curricula, this concept evaluates both conceptual clarity and practical administrative application.

2. **Key Theoretical & Empirical Framework**:
   - It forms an essential segment of high-yield exam weightage.
   - It directly connects fundamental principles with recent government policy frameworks and official regulatory guidelines.

3. **Step-by-Step Problem Solving Method**:
   - Identify the primary subject domain and syllabus keyword.
   - Cross-check statutory articles, constitutional clauses, or mathematical formulas.
   - Eliminate extreme options in prelims MCQs (e.g., words like 'always', 'never', 'solely').`;
      keyPoints = [
        'Master the fundamental definitions before attempting high-difficulty variants',
        'Link static principles with current government notifications',
        'Review standard previous year questions to identify recurring traps'
      ];
      examTip = 'Focus on clarity over rote memorization. State PSC & UPSC frequently ask assertion-reason variants of this concept.';
      followUpQuestion = `Would you like me to generate a 5-question adaptive quiz on this topic to test your retention?`;
    }

    if (language === 'ta') {
      explanationText += `\n\n*(தமிழ் விளக்கம்: இந்த தலைப்பின் முக்கிய கருத்துகள் உங்கள் பாடத்திட்டத்தின் அடிப்படையில் தொகுக்கப்பட்டுள்ளன. தேர்வில் கேட்கப்படும் முக்கிய வினாக்களுக்கு இது உதவும்.)*`;
    }

    return {
      title: modeHeaders[explanationMode] || modeHeaders.exam_oriented,
      explanationMode,
      query,
      explanation: explanationText,
      keyPoints,
      examTip,
      followUpQuestion,
      language
    };
  }
};

module.exports = tutorAgent;
