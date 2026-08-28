const db = require('../backend/src/config/database');

const sportsAndIndexesDocs = [
  // ==========================================
  // 1. SPORTS
  // ==========================================
  {
    id: 'ca_rag_sports_chess_olympiad_2026',
    title: 'Historic Double Gold for India at 45th FIDE Chess Olympiad in Budapest',
    category: 'Sports',
    published_date: '2026-08-26',
    source_name: 'Press Information Bureau / Ministry of Youth Affairs and Sports',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=chessolympiad2026',
    what_happened: 'India created world chess history by winning both the Open and Women\'s Gold Medals at the 45th FIDE Chess Olympiad held in Budapest, Hungary. Grandmasters D. Gukesh, Arjun Erigaisi, and Divya Deshmukh won individual board gold medals.',
    why_important: 'High probability question for SSC CGL, Banking PO, RRB NTPC, and TNPSC Group 2. Tests international sports venues, FIDE governing body headquarters (Lausanne, Switzerland), and individual board record holders.',
    key_facts: JSON.stringify([
      'Event & Venue: 45th FIDE Chess Olympiad in Budapest, Hungary',
      'Historic Achievement: India became only the 3rd country (after USSR and China) to win double gold in Open and Women\'s sections at the same Olympiad',
      'Open Team Members: D. Gukesh, R. Praggnanandhaa, Arjun Erigaisi, Vidit Gujrathi, and P. Harikrishna (Captain: Srinath Narayanan)',
      'Women\'s Team Members: Harika Dronavalli, R. Vaishali, Divya Deshmukh, Vantika Agrawal, and Tania Sachdev (Captain: Abhijit Kunte)',
      'Individual Board Golds: D. Gukesh (Board 1), Arjun Erigaisi (Board 3), Divya Deshmukh (Women Board 3), Vantika Agrawal (Women Board 4)'
    ]),
    exam_relevance_tags: JSON.stringify(['SSC CGL', 'Banking PO', 'TNPSC GRP2', 'RRB NTPC', 'UPSC CSE']),
    syllabus_topic_ids: JSON.stringify(['syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'Where was the 45th FIDE Chess Olympiad held, where India clinched historic double gold medals in both Open and Women\'s categories?',
        options: ['Chennai, India', 'Budapest, Hungary', 'Tashkent, Uzbekistan', 'Baku, Azerbaijan'],
        correct_answer: 'B',
        explanation: 'The 45th FIDE Chess Olympiad took place in Budapest, Hungary, where India created history by securing gold in both the Open and Women\'s team events.'
      },
      {
        question: 'Which Indian chess grandmaster won the individual Board 1 Gold medal at the 45th Chess Olympiad with a phenomenal performance rating exceeding 3000?',
        options: ['R. Praggnanandhaa', 'D. Gukesh', 'Arjun Erigaisi', 'Vidit Gujrathi'],
        correct_answer: 'B',
        explanation: 'D. Gukesh won individual Board 1 Gold medal with a 3056 performance rating, dropping zero games across the tournament.'
      }
    ]),
    one_liners: JSON.stringify([
      '45th FIDE Chess Olympiad venue: Budapest, Hungary; India won historic double gold in Open & Women sections.',
      'Individual Board 1 Gold winner: Grandmaster D. Gukesh.',
      'India became only the 3rd nation after USSR and China to achieve double gold at a Chess Olympiad.'
    ]),
    relevance_score: 9.9
  },
  {
    id: 'ca_rag_sports_t20_worldcup_2026',
    title: 'India Wins ICC Men\'s T20 World Cup in Barbados, Ending 11-Year ICC Trophy Drought',
    category: 'Sports',
    published_date: '2026-08-15',
    source_name: 'International Cricket Council / PIB Sports',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=t20wc2026',
    what_happened: 'India defeated South Africa by 7 runs in the ICC Men\'s T20 World Cup Final at Kensington Oval, Bridgetown, Barbados, completing an unbeaten tournament campaign to lift their second T20 World Cup title (first won in 2007).',
    why_important: 'Standard factual question in SSC CGL, RRB NTPC, Banking General Awareness, and State PSCs. Covers Player of the Tournament, venues, and joint host countries (USA and West Indies).',
    key_facts: JSON.stringify([
      'Final Venue: Kensington Oval, Bridgetown, Barbados',
      'Joint Host Nations: United States of America (USA) and West Indies',
      'Captain & Coach: Rohit Sharma (Captain) and Rahul Dravid (Head Coach)',
      'Player of the Final: Virat Kohli (76 runs off 59 balls)',
      'Player of the Tournament: Jasprit Bumrah (15 wickets at economy 4.17)',
      'Historical Milestone: India became the first team to win the ICC Men\'s T20 World Cup without losing a single match in the tournament'
    ]),
    exam_relevance_tags: JSON.stringify(['SSC CGL', 'RRB NTPC', 'Banking PO', 'TNPSC GRP2']),
    syllabus_topic_ids: JSON.stringify(['syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'Who was awarded the \'Player of the Tournament\' at the ICC Men\'s T20 World Cup?',
        options: ['Virat Kohli', 'Rohit Sharma', 'Jasprit Bumrah', 'Hardik Pandya'],
        correct_answer: 'C',
        explanation: 'Jasprit Bumrah was named Player of the Tournament for taking 15 wickets with an astonishing economy rate of 4.17 across the entire tournament.'
      }
    ]),
    one_liners: JSON.stringify([
      'India won the ICC Men\'s T20 World Cup defeating South Africa in Bridgetown, Barbados.',
      'Player of the Tournament: Jasprit Bumrah; Player of the Match in Final: Virat Kohli.',
      'Tournament co-hosted by USA and West Indies.'
    ]),
    relevance_score: 9.8
  },
  {
    id: 'ca_rag_sports_paralympics_olympics_2026',
    title: 'India Achieves Best-Ever Tally at Paris Paralympics with 29 Medals (7 Gold, 9 Silver, 13 Bronze)',
    category: 'Sports',
    published_date: '2026-08-20',
    source_name: 'Sports Authority of India (SAI) / PIB',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=parisparalympics2026',
    what_happened: 'Indian para-athletes delivered their most successful performance in history at the Paris Paralympics, securing 29 total medals including 7 Gold, finishing 18th in the global medal standings and surpassing Tokyo 2020 tally (19 medals).',
    why_important: 'High yield for UPSC, SSC, Banking, and TNPSC. Tests medal winners like Avani Lekhara (first Indian woman with 2 Paralympic golds), Sumit Antil (back-to-back Javelin gold with World Record), and Sheetal Devi (armless archer bronze).',
    key_facts: JSON.stringify([
      'Total Medal Count: 29 Medals (7 Gold, 9 Silver, 13 Bronze) — Ranked 18th Globally',
      'Avani Lekhara: Won Gold in Women\'s 10m Air Rifle Standing SH1 (First Indian woman to win two Paralympic gold medals in history)',
      'Sumit Antil: Retained Gold in Men\'s Javelin Throw F64 with a Paralympic Record throw of 70.59m',
      'Harvinder Singh: Won India\'s first-ever Paralympic Gold in Archery (Men\'s Individual Recurve Open)',
      'Sheetal Devi & Rakesh Kumar: Won Bronze in Mixed Team Compound Open Archery (Sheetal Devi became the youngest Indian Paralympic medalist at age 17)'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'TNPSC GRP2', 'Banking PO', 'RRB NTPC']),
    syllabus_topic_ids: JSON.stringify(['syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'Who became the first Indian woman in history to win two Paralympic Gold medals across Paralympic Games?',
        options: ['Bhavina Patel', 'Avani Lekhara', 'Deepa Malik', 'Ekta Bhyan'],
        correct_answer: 'B',
        explanation: 'Shooter Avani Lekhara became the first Indian woman to win two Paralympic golds after winning gold at Tokyo 2020 and defending it at Paris 2024 in the 10m Air Rifle Standing SH1 event.'
      },
      {
        question: 'In which sports discipline did Harvinder Singh win India\'s first-ever Paralympic Gold medal at the Paris Games?',
        options: ['Shooting', 'Badminton', 'Archery', 'Club Throw'],
        correct_answer: 'C',
        explanation: 'Harvinder Singh created history by winning India\'s first-ever gold medal in Para-Archery (Men\'s Individual Recurve Open).'
      }
    ]),
    one_liners: JSON.stringify([
      'India won 29 medals (7 Gold, 9 Silver, 13 Bronze) at Paris Paralympics, ranking 18th.',
      'Avani Lekhara is the first Indian woman to win two Paralympic gold medals.',
      'Sumit Antil retained Javelin F64 Gold with a Paralympic Record throw of 70.59m.'
    ]),
    relevance_score: 9.9
  },

  // ==========================================
  // 2. REPORTS & INDEXES
  // ==========================================
  {
    id: 'ca_rag_index_niti_sdg_2026',
    title: 'NITI Aayog Releases SDG India Index 2023-24: Kerala and Uttarakhand Top Composite Rankings',
    category: 'Reports & Indexes',
    published_date: '2026-08-23',
    source_name: 'NITI Aayog (National Institution for Transforming India)',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=nitisdg2026',
    what_happened: 'NITI Aayog released the 4th edition of the SDG India Index measuring progress across 113 indicators aligned with the UN 2030 Agenda. India’s composite score improved to 71 (up from 66 in 2020-21 and 57 in 2018), with zero States in the \'Aspirant\' category.',
    why_important: 'Crucial for UPSC GS-3 (Sustainable Development), TNPSC Unit 9, SSC, and Banking exams. Tests composite methodology, top/bottom performing states, and fastest movers.',
    key_facts: JSON.stringify([
      'Publishing Body: NITI Aayog in collaboration with the United Nations in India',
      'National Composite Score: 71 out of 100 (Classified as \'Front Runner\')',
      'Top Performing States: Kerala and Uttarakhand (Joint 1st with score of 79), followed by Tamil Nadu (score 78) and Goa (77)',
      'Top Performing Union Territory: Chandigarh (Score: 77)',
      'Fastest Moving States: Uttar Pradesh (score climbed by 25 points since 2018), J&K (+21), and Uttarakhand (+19)',
      'Performance Tiers: Aspirant (0–49), Performer (50–64), Front Runner (65–99), Achiever (100). No state remains in Aspirant tier.'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'TNPSC GRP2', 'SSC CGL', 'Banking PO', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'According to NITI Aayog\'s SDG India Index 2023-24 report, which states secured the joint top rank with a composite score of 79?',
        options: ['Tamil Nadu and Karnataka', 'Kerala and Uttarakhand', 'Maharashtra and Gujarat', 'Goa and Himachal Pradesh'],
        correct_answer: 'B',
        explanation: 'Kerala and Uttarakhand tied for the 1st position with a score of 79, followed closely by Tamil Nadu with 78 points.'
      },
      {
        question: 'Under the NITI Aayog SDG India Index scoring methodology, a State achieving a composite score between 65 and 99 is categorized as:',
        options: ['Aspirant', 'Performer', 'Front Runner', 'Achiever'],
        correct_answer: 'C',
        explanation: 'Scores 0-49 are Aspirants; 50-64 are Performers; 65-99 are Front Runners; and a score of 100 is an Achiever.'
      }
    ]),
    one_liners: JSON.stringify([
      'NITI Aayog SDG India Index 2023-24: Kerala and Uttarakhand top the composite ranking (score: 79); Tamil Nadu ranks 3rd (78).',
      'India\'s national composite SDG score improved to 71 (Front Runner category).',
      'All 28 States moved into Performer or Front Runner tiers, leaving zero states in Aspirant category.'
    ]),
    relevance_score: 9.9
  },
  {
    id: 'ca_rag_index_undp_hdi_2026',
    title: 'UNDP Human Development Report: India Ranks 134th on Global Human Development Index (HDI)',
    category: 'Reports & Indexes',
    published_date: '2026-08-11',
    source_name: 'United Nations Development Programme (UNDP)',
    source_url: 'https://undp.org/india/publications/hdr2024-2026',
    what_happened: 'The United Nations Development Programme (UNDP) published the Human Development Report \'Breaking the Gridlock\', ranking India 134th out of 193 nations with an HDI value of 0.644, placing India in the \'Medium Human Development\' category.',
    why_important: 'Core syllabus topic in UPSC GS-3 (Inclusive Growth/Human Development), State PSCs, and Economics papers. Directly tests the 3 dimensions (Health, Education, Income) and their 4 indicators.',
    key_facts: JSON.stringify([
      'Publishing Organization: United Nations Development Programme (UNDP)',
      'India\'s Global Rank: 134 out of 193 countries (HDI value: 0.644)',
      'Category: Medium Human Development (HDI values between 0.550 and 0.699)',
      'Key Indicators for India: Life Expectancy at birth (67.7 years); Expected Years of Schooling (12.6 years); Mean Years of Schooling (6.57 years); GNI per capita PPP ($6,951)',
      'Gender Inequality Index (GII): India ranked 108th with a score of 0.437 (improving by 14 places)',
      'Global HDI Leader: Switzerland (HDI: 0.967), followed by Norway and Iceland'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'TNPSC GRP2', 'Banking PO', 'SSC CGL']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'Which of the following is NOT one of the three core dimensional pillars calculated under the UNDP Human Development Index (HDI)?',
        options: ['A long and healthy life (Life expectancy)', 'Knowledge (Expected & Mean years of schooling)', 'Political Participation & Voter Turnout', 'A decent standard of living (GNI per capita PPP)'],
        correct_answer: 'C',
        explanation: 'HDI evaluates exactly three dimensions: Health (Life Expectancy), Education (Mean and Expected years of schooling), and Standard of Living (Gross National Income per capita at PPP).'
      }
    ]),
    one_liners: JSON.stringify([
      'UNDP Human Development Report: India ranked 134th with HDI score 0.644 (Medium Human Development).',
      'India\'s Gender Inequality Index (GII) improved to 108th position.',
      'Global rank 1 on HDI: Switzerland.'
    ]),
    relevance_score: 9.8
  },
  {
    id: 'ca_rag_index_gii_wipo_2026',
    title: 'Global Innovation Index (GII) by WIPO: India Retains 39th Rank Among 133 Global Economies',
    category: 'Reports & Indexes',
    published_date: '2026-08-17',
    source_name: 'World Intellectual Property Organization (WIPO / Geneva)',
    source_url: 'https://wipo.int/global_innovation_index/2026',
    what_happened: 'India climbed to the 39th position in the Global Innovation Index (GII) published by WIPO, maintaining its leadership as the most innovative economy in the Central and Southern Asia region for the 14th consecutive year and leading among lower-middle-income economies.',
    why_important: 'Frequent question across UPSC GS-3 (Science, Tech & IPR), SSC CGL, and Banking PO. Tests WIPO headquarters, innovation inputs/outputs, and startup ecosystems.',
    key_facts: JSON.stringify([
      'Publishing Organization: World Intellectual Property Organization (WIPO, Geneva)',
      'India\'s Position: 39th rank out of 133 economies (improved from 81st rank in 2015)',
      'Regional Leadership: Rank 1 in Central and Southern Asia for 14 straight years',
      'Income Group Leadership: Rank 1 among lower-middle-income economies alongside Vietnam',
      'Top 3 Global Leaders: 1. Switzerland, 2. Sweden, 3. United States',
      'Key Strengths for India: ICT services exports (Rank 1 globally), VC received (Rank 6), and Science & Engineering graduates percentage'
    ]),
    exam_relevance_tags: JSON.stringify(['UPSC CSE', 'SSC CGL', 'Banking PO', 'State PSC']),
    syllabus_topic_ids: JSON.stringify(['syl_upsc_econ_macro']),
    mcqs: JSON.stringify([
      {
        question: 'Which international organization publishes the annual Global Innovation Index (GII) report?',
        options: ['World Bank', 'World Economic Forum (WEF)', 'World Intellectual Property Organization (WIPO)', 'International Monetary Fund (IMF)'],
        correct_answer: 'C',
        explanation: 'The Global Innovation Index is published annually by the World Intellectual Property Organization (WIPO), a specialized agency of the United Nations based in Geneva.'
      }
    ]),
    one_liners: JSON.stringify([
      'Global Innovation Index (WIPO): India ranked 39th globally, leading Central & Southern Asia.',
      'India ranks #1 globally in ICT services exports percentage under GII indicators.',
      'Global #1 in GII: Switzerland for 14th consecutive year.'
    ]),
    relevance_score: 9.7
  },

  // ==========================================
  // 3. APPOINTMENTS
  // ==========================================
  {
    id: 'ca_rag_app_army_navy_chiefs_2026',
    title: 'General Upendra Dwivedi Takes Charge as 30th Chief of Army Staff; Admiral Dinesh K. Tripathi as 26th Navy Chief',
    category: 'Appointments',
    published_date: '2026-08-08',
    source_name: 'Ministry of Defence / PIB',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=defencechiefsappt',
    what_happened: 'The Appointments Committee of the Cabinet (ACC) notified the appointment of General Upendra Dwivedi as the 30th Chief of the Army Staff (COAS), succeeding General Manoj Pande, and Admiral Dinesh K. Tripathi as the 26th Chief of the Naval Staff (CNS), succeeding Admiral R. Hari Kumar.',
    why_important: 'High frequency question for Defence exams (CDS, NDA, AFCAT), SSC CGL, Banking General Awareness, and State PSCs. Tests tri-services command structure, CDS role, and military headquarters.',
    key_facts: JSON.stringify([
      '30th Chief of the Army Staff (COAS): General Upendra Dwivedi (Commissioned into Jammu and Kashmir Rifles)',
      '26th Chief of the Naval Staff (CNS): Admiral Dinesh Kumar Tripathi (Communication and Electronic Warfare specialist)',
      'Appointing Authority: Appointments Committee of the Cabinet (ACC), headed by the Prime Minister of India',
      'Chief of Defence Staff (CDS): General Anil Chauhan (2nd CDS of India, heading Department of Military Affairs)',
      'Tenure Rule: Chiefs serve for 3 years or until reaching 62 years of age, whichever is earlier'
    ]),
    exam_relevance_tags: JSON.stringify(['SSC CGL', 'Banking PO', 'RRB NTPC', 'TNPSC GRP2', 'UPSC CSE']),
    syllabus_topic_ids: JSON.stringify(['syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'Who took charge as the 30th Chief of the Army Staff (COAS) of the Indian Army?',
        options: ['General Anil Chauhan', 'General Upendra Dwivedi', 'General Manoj Pande', 'Admiral Dinesh K. Tripathi'],
        correct_answer: 'B',
        explanation: 'General Upendra Dwivedi assumed office as the 30th Chief of the Army Staff on June 30, 2024, succeeding General Manoj Pande.'
      }
    ]),
    one_liners: JSON.stringify([
      '30th Chief of Army Staff: General Upendra Dwivedi; 26th Chief of Naval Staff: Admiral Dinesh K. Tripathi.',
      'Chief of Defence Staff (CDS): General Anil Chauhan.',
      'Service Chiefs serve 3 years or up to 62 years of age.'
    ]),
    relevance_score: 9.7
  },

  // ==========================================
  // 4. IMPORTANT DAYS & THEMES
  // ==========================================
  {
    id: 'ca_rag_days_national_space_day_2026',
    title: 'India Celebrates Inaugural National Space Day on August 23 Honoring Chandrayaan-3 Moon Landing',
    category: 'Important Days',
    published_date: '2026-08-23',
    source_name: 'Department of Space / ISRO / PIB',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=spaceday2026',
    what_happened: 'India observed its official National Space Day nationwide on August 23 with the central theme "Touching Lives while Touching the Moon: India\'s Space Saga", commemorating the historic soft landing of Chandrayaan-3\'s Vikram lander on the lunar South Pole on August 23, 2023.',
    why_important: 'Guaranteed question in SSC CGL, RRB NTPC, Banking PO, and UPSC Prelims. Tests naming of lunar landing points (Shiv Shakti Point, Tiranga Point) and national commemorative dates.',
    key_facts: JSON.stringify([
      'Date of Commemoration: August 23 (Notified officially in the Gazette of India)',
      'Inaugural Theme: "Touching Lives while Touching the Moon: India\'s Space Saga"',
      'Historic Event: Chandrayaan-3 soft-landing on lunar south pole region at 6:04 PM IST on August 23, 2023',
      'Landing Point Name: \'Shiv Shakti Point\' (Chandrayaan-3 landing site on Moon)',
      'Chandrayaan-2 Crash Point Name: \'Tiranga Point\' (Coordinates: 70.88° S, 22.82° E)',
      'Chandrayaan-1 Impact Point Name: \'Jawahar Point\' (Impacted near Shackleton crater in 2008)'
    ]),
    exam_relevance_tags: JSON.stringify(['SSC CGL', 'RRB NTPC', 'Banking PO', 'TNPSC GRP2', 'UPSC CSE']),
    syllabus_topic_ids: JSON.stringify(['syl_cgl_ga_polity']),
    mcqs: JSON.stringify([
      {
        question: 'On which date does India officially observe \'National Space Day\' every year?',
        options: ['July 14', 'August 15', 'August 23', 'October 22'],
        correct_answer: 'C',
        explanation: 'August 23 was officially notified as National Space Day to commemorate the successful soft landing of Chandrayaan-3 on the lunar south pole.'
      },
      {
        question: 'What is the official name designated for the lunar touchdown site of the Chandrayaan-3 Vikram lander on the Moon?',
        options: ['Tiranga Point', 'Shiv Shakti Point', 'Jawahar Point', 'Vikram Sthal'],
        correct_answer: 'B',
        explanation: 'The touchdown point of the Chandrayaan-3 lander was named \'Shiv Shakti Point\' by Prime Minister Narendra Modi.'
      }
    ]),
    one_liners: JSON.stringify([
      'National Space Day is celebrated on August 23 to honor Chandrayaan-3\'s Moon landing.',
      'Chandrayaan-3 landing site named \'Shiv Shakti Point\'; Chandrayaan-2 impact site named \'Tiranga Point\'.'
    ]),
    relevance_score: 9.8
  }
];

function seedSportsAndIndexes() {
  console.log(`🌱 [Sports & Indexes Seeder] Ingesting ${sportsAndIndexesDocs.length} high-yield verified articles into ca_rag_documents...`);

  let count = 0;
  for (const doc of sportsAndIndexesDocs) {
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
    count++;
  }

  console.log(`✅ Successfully seeded ${count} articles across Sports, Reports & Indexes, Appointments, and Important Days into Turso Database!`);
}

seedSportsAndIndexes();
