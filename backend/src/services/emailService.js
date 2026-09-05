const nodemailer = require('nodemailer');
const db = require('../config/database');

// Configuration from Environment Variables
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'smtp';
const EMAIL_FROM = process.env.EMAIL_FROM || 'PrepAI Exam Alerts <alerts@prepai-gov-exams.in>';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const APP_BASE_URL = (process.env.CLIENT_URL || 'https://the-pitch-deck.vercel.app').replace(/\/+$/, '');

let cachedTransporter = null;
let lastPass = null;

function getTransporter() {
  const EMAIL_USER = (process.env.EMAIL_USER || 'preethika0809@gmail.com').trim();
  const rawPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim();
  // Strip any spaces from 16-character Google App Password (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
  const EMAIL_PASS = rawPass.replace(/[\s"']/g, '');
  const EMAIL_HOST = (process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
  const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  if (cachedTransporter && lastPass === EMAIL_PASS) {
    return cachedTransporter;
  }

  try {
    cachedTransporter = nodemailer.createTransport({
      service: EMAIL_HOST.includes('gmail') ? 'gmail' : undefined,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    lastPass = EMAIL_PASS;
    console.log(`📧 [Email Service] Initialized active SMTP transporter (${EMAIL_HOST}:${EMAIL_PORT}) for ${EMAIL_USER}`);
    return cachedTransporter;
  } catch (err) {
    console.warn('⚠️ [Email Service] SMTP transporter setup error:', err.message);
    return null;
  }
}

// Reusable styling helper for responsive HTML emails
function wrapEmailTemplate({ title, badge, content, ctaText, ctaUrl, secondaryCtaText, secondaryCtaUrl, language = 'en' }) {
  const footerText = {
    en: {
      platform: 'Pitch Deck Government Exam Intelligence Platform',
      note: 'All notifications are derived directly from verified official gazettes and commission releases.',
      prefNotice: 'You received this automated email because alerts are active on your registered Pitch Deck account. Manage notification channels in Account Settings.'
    },
    ta: {
      platform: 'Pitch Deck அரசுத் தேர்வுகள் தகவல் தளம்',
      note: 'அனைத்து அறிவிப்புகளும் அதிகாரப்பூர்வ அரசு அரசிதழ் மற்றும் தேர்வாணைய அறிவிப்புகளிலிருந்து நேரடியாக சரிபார்க்கப்பட்டவை.',
      prefNotice: 'உங்கள் Pitch Deck கணக்கில் மின்னஞ்சல் எச்சரிக்கைகள் இயக்கப்பட்டுள்ளதால் இந்த அறிவிப்பு அனுப்பப்பட்டுள்ளது.'
    },
    hi: {
      platform: 'Pitch Deck सरकारी परीक्षा सूचना मंच',
      note: 'सभी सूचनाएं सीधे सत्यापित आधिकारिक राजपत्रों और आयोग की विज्ञप्तियों से प्राप्त की जाती हैं।',
      prefNotice: 'आपको यह स्वचालित ईमेल इसलिए मिला क्योंकि आपके पंजीकृत Pitch Deck खाते पर अलर्ट सक्रिय हैं।'
    }
  }[language] || {
    platform: 'Pitch Deck Government Exam Intelligence Platform',
    note: 'All notifications are derived directly from verified official gazettes and commission releases.',
    prefNotice: 'You received this automated email because alerts are active on your registered Pitch Deck account. Manage notification channels in Account Settings.'
  };

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1e293b; }
    .container { max-width:600px; margin:20px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    .header { background:linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding:28px 24px; color:#ffffff; text-align:left; }
    .logo { font-size:22px; font-weight:800; letter-spacing:-0.5px; margin:0 0 6px 0; color:#ffffff; }
    .subtitle { font-size:13px; color:#bfdbfe; margin:0; }
    .badge { display:inline-block; padding:4px 12px; border-radius:9999px; background-color:#eff6ff; color:#2563eb; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:12px; }
    .badge-urgent { background-color:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
    .badge-success { background-color:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
    .content { padding:32px 24px; line-height:1.65; font-size:15px; color:#334155; }
    .card-box { background-color:#f1f5f9; border-radius:8px; padding:18px; margin:20px 0; border-left:4px solid #2563eb; }
    .btn { display:inline-block; padding:12px 24px; background-color:#2563eb; color:#ffffff !important; text-decoration:none; font-weight:700; font-size:14px; border-radius:8px; margin:6px; box-shadow:0 2px 6px rgba(37,99,235,0.3); }
    .btn-secondary { background-color:#475569; box-shadow:none; }
    .footer { background-color:#f8fafc; padding:20px 24px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid #e2e8f0; }
    .meta-row { margin-bottom:8px; font-size:14px; }
    .meta-label { color:#64748b; font-weight:600; width:150px; display:inline-block; }
    .meta-val { color:#0f172a; font-weight:700; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏛️ Pitch Deck Government Exam Alerts</div>
      <div class="subtitle">Official Recruitment • Deadlines • Hall Tickets • Results</div>
    </div>
    <div class="content">
      ${badge ? `<div class="badge ${badge.includes('🚨') || badge.includes('⚠️') ? 'badge-urgent' : badge.includes('✅') ? 'badge-success' : ''}">${badge}</div>` : ''}
      <h2 style="margin:0 0 16px 0; color:#0f172a; font-size:20px; font-weight:800;">${title}</h2>
      ${content}
      <div style="text-align:center; margin-top:24px;">
        ${ctaText && ctaUrl ? `<a href="${ctaUrl}" class="btn" target="_blank">${ctaText} →</a>` : ''}
        ${secondaryCtaText && secondaryCtaUrl ? `<a href="${secondaryCtaUrl}" class="btn btn-secondary" target="_blank">${secondaryCtaText}</a>` : ''}
      </div>
    </div>
    <div class="footer">
      <p style="margin:0 0 6px 0;"><strong>${footerText.platform}</strong></p>
      <p style="margin:0 0 8px 0;">${footerText.note}</p>
      <p style="margin:0; color:#94a3b8; font-size:11px;">${footerText.prefNotice}</p>
    </div>
  </div>
</body>
</html>
`;
}

const emailService = {
  // Core Dispatcher: sends real email and records audit log in database
  async sendEmail({ userId, recipientEmail, subject, notificationType, examId = null, htmlContent, language = 'en' }) {
    console.log(`📨 [Email Service] Sending '${notificationType}' email to ${recipientEmail} | Subject: "${subject}" (${language.toUpperCase()})`);

    const logId = `nlog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let status = 'sent';
    let providerMessageId = `sim_${Date.now()}`;
    let errorMessage = null;

    const activeTransporter = getTransporter();
    if (activeTransporter) {
      const fromAddress = process.env.EMAIL_FROM || `Pitch Deck Government Exam Intelligence <${process.env.EMAIL_USER || 'preethika0809@gmail.com'}>`;
      try {
        const info = await activeTransporter.sendMail({
          from: fromAddress,
          to: recipientEmail,
          subject,
          html: htmlContent
        });
        providerMessageId = info.messageId || providerMessageId;
        console.log(`✅ [Email Service] Dispatched via live SMTP to ${recipientEmail} (ID: ${providerMessageId})`);
      } catch (err) {
        // Immediate 1-time retry on socket reset / network glitch
        try {
          console.warn(`⚠️ [Email Service] Retrying SMTP dispatch to ${recipientEmail}... (${err.message})`);
          const retryTransporter = getTransporter();
          const retryInfo = await retryTransporter.sendMail({
            from: fromAddress,
            to: recipientEmail,
            subject,
            html: htmlContent
          });
          providerMessageId = retryInfo.messageId || providerMessageId;
          console.log(`✅ [Email Service] Dispatched via live SMTP on retry to ${recipientEmail} (ID: ${providerMessageId})`);
        } catch (retryErr) {
          status = 'failed';
          errorMessage = retryErr.message;
          console.error(`❌ [Email Service] SMTP dispatch failure to ${recipientEmail}:`, retryErr.message);
        }
      }
    } else {
      // In development / demo environment without active SMTP credentials, log simulated dispatch
      console.log(`📬 [Simulated Mailer] Email delivered to inbox of: ${recipientEmail} (Subject: "${subject}")`);
    }

    // Persist to notification_logs
    try {
      db.run(`
        INSERT INTO notification_logs (
          id, user_id, exam_id, notification_type, event_type, email, recipient_email, subject,
          language, sent_at, status, error_message, provider_message_id, retry_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, 0)
      `, [logId, userId, examId, notificationType, notificationType, recipientEmail, recipientEmail, subject, language, status, errorMessage, providerMessageId]);
    } catch (e) {
      console.warn('⚠️ [Email Service] Could not write notification_log:', e.message);
    }

    return {
      success: status === 'sent',
      logId,
      recipient: recipientEmail,
      subject,
      status,
      providerMessageId
    };
  },

  // 1. Template: Application Opened (APPLICATION_OPEN)
  renderApplicationOpenEmail({ user, exam, language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const examName = exam.name || exam.code;
    const org = exam.organization || 'Government Commission';
    const officialUrl = exam.official_url || 'https://india.gov.in';

    if (language === 'ta') {
      const subject = `📢 ${examName} விண்ணப்பப் பதிவு துவங்கியது — ${org}`;
      const content = `
        <p>வணக்கம் <strong>${userName}</strong>,</p>
        <p><strong>${org}</strong> தேர்வாணையம் நடத்தும் <strong>${examName}</strong> தேர்வுக்கான அதிகாரப்பூர்வ ஆன்லைன் விண்ணப்பப் பதிவு தற்போது துவங்கப்பட்டுள்ளது.</p>
        <div class="card-box">
          <div class="meta-row"><span class="meta-label">தேர்வாணையம்:</span> <span class="meta-val">${org}</span></div>
          <div class="meta-row"><span class="meta-label">கல்வித் தகுதி:</span> <span class="meta-val">${exam.qualification || 'Any Degree'}</span></div>
          <div class="meta-row"><span class="meta-label">சம்பள விகிதம்:</span> <span class="meta-val">${exam.in_hand_salary || exam.pay_level || 'அரசு விதிகளின்படி'}</span></div>
          <div class="meta-row"><span class="meta-label">மாநிலம்/பிரிவு:</span> <span class="meta-val">${exam.state || 'All India'} • ${exam.category}</span></div>
        </div>
        <p>கடைசி நேர சர்வர் நெரிசலைத் தவிர்க்க இன்றே விண்ணப்பிக்கவும்.</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: `${examName} விண்ணப்பப் பதிவு துவங்கியது`,
          badge: '📢 புதிய விண்ணப்பம்',
          content,
          ctaText: 'அதிகாரப்பூர்வமாக விண்ணப்பிக்க',
          ctaUrl: officialUrl,
          secondaryCtaText: 'பாடத்திட்டத்தை பார்க்க',
          secondaryCtaUrl: `${APP_BASE_URL}/syllabus`,
          language: 'ta'
        })
      };
    }

    if (language === 'hi') {
      const subject = `📢 ${examName} के लिए ऑनलाइन आवेदन शुरू — ${org}`;
      const content = `
        <p>नमस्ते <strong>${userName}</strong>,</p>
        <p><strong>${org}</strong> द्वारा <strong>${examName}</strong> के लिए आधिकारिक ऑनलाइन आवेदन प्रक्रिया शुरू हो गई है।</p>
        <div class="card-box">
          <div class="meta-row"><span class="meta-label">संगठन:</span> <span class="meta-val">${org}</span></div>
          <div class="meta-row"><span class="meta-label">योग्यता:</span> <span class="meta-val">${exam.qualification || 'स्नातक (Any Degree)'}</span></div>
          <div class="meta-row"><span class="meta-label">वेतनमान:</span> <span class="meta-val">${exam.in_hand_salary || exam.pay_level || 'सरकारी नियमानुसार'}</span></div>
          <div class="meta-row"><span class="meta-label">क्षेत्र/राज्य:</span> <span class="meta-val">${exam.state || 'All India'} • ${exam.category}</span></div>
        </div>
        <p>अंतिम तिथि से पहले अपना आवेदन पूरा करें।</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: `${examName} के लिए आवेदन शुरू`,
          badge: '📢 नई विज्ञप्ति',
          content,
          ctaText: 'आधिकारिक पोर्टल पर आवेदन करें',
          ctaUrl: officialUrl,
          secondaryCtaText: 'पाठ्यक्रम देखें',
          secondaryCtaUrl: `${APP_BASE_URL}/syllabus`,
          language: 'hi'
        })
      };
    }

    // Default English
    const subject = `📢 ${examName} Applications Are Now Open — ${org}`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Official applications for <strong>${examName}</strong> conducted by <strong>${org}</strong> are now active and open for submission.</p>
      <div class="card-box">
        <div class="meta-row"><span class="meta-label">Organization:</span> <span class="meta-val">${org}</span></div>
        <div class="meta-row"><span class="meta-label">Minimum Qualification:</span> <span class="meta-val">${exam.qualification || 'Any Degree'}</span></div>
        <div class="meta-row"><span class="meta-label">Pay Level / Salary:</span> <span class="meta-val">${exam.in_hand_salary || exam.pay_level || 'As per norms'}</span></div>
        <div class="meta-row"><span class="meta-label">Jurisdiction:</span> <span class="meta-val">${exam.state || 'All India'} • ${exam.category}</span></div>
      </div>
      <p>Submit your application early on the official recruitment portal to avoid last-minute server congestion.</p>
    `;
    return {
      subject,
      html: wrapEmailTemplate({
        title: `${examName} Applications Are Open`,
        badge: '📢 Applications Open',
        content,
        ctaText: 'Apply Officially',
        ctaUrl: officialUrl,
        secondaryCtaText: 'View Syllabus & Notes',
        secondaryCtaUrl: `${APP_BASE_URL}/syllabus`,
        language: 'en'
      })
    };
  },

  // 2. Template: Deadline Approaching (DEADLINE_7_DAYS, DEADLINE_3_DAYS, DEADLINE_1_DAY)
  renderDeadlineReminderEmail({ user, exam, daysRemaining = 3, deadlineDate = 'Soon', language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const examName = exam.name || exam.code;
    const org = exam.organization || 'Government Commission';
    const officialUrl = exam.official_url || 'https://india.gov.in';

    if (language === 'ta') {
      const urgencyText = daysRemaining === 1 ? '🚨 நாளை முடிகிறது' : `⏰ ${daysRemaining} நாட்களில் முடிகிறது`;
      const subject = daysRemaining === 1 ? `🚨 ${examName} விண்ணப்பக் கடைசி நாள் நாளை முடிகிறது!` : `⏰ ${examName} விண்ணப்பிக்க கடைசி ${daysRemaining} நாட்கள் மட்டுமே!`;
      const content = `
        <p>வணக்கம் <strong>${userName}</strong>,</p>
        <p><strong>${examName}</strong> தேர்வுக்கான விண்ணப்பக் கடைசி நாள் நெருங்கிவிட்டது.</p>
        <div class="card-box" style="border-left-color:${daysRemaining <= 1 ? '#dc2626' : '#f59e0b'};">
          <div class="meta-row"><span class="meta-label">தேர்வு:</span> <span class="meta-val">${examName}</span></div>
          <div class="meta-row"><span class="meta-label">கடைசி நாள்:</span> <span class="meta-val" style="color:#dc2626;">${deadlineDate}</span></div>
          <div class="meta-row"><span class="meta-label">மீதமுள்ள காலம்:</span> <span class="meta-val">${daysRemaining === 1 ? 'கடைசி 24 மணிநேரம்' : `${daysRemaining} நாட்கள்`}</span></div>
        </div>
        <p>கட்டணம் செலுத்துதல் மற்றும் விண்ணப்பப் படிவத்தை உடனடியாக சமர்ப்பிக்கவும்.</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: subject,
          badge: urgencyText,
          content,
          ctaText: 'இப்போதே விண்ணப்பிக்க',
          ctaUrl: officialUrl,
          language: 'ta'
        })
      };
    }

    if (language === 'hi') {
      const urgencyText = daysRemaining === 1 ? '🚨 कल अंतिम दिन' : `⏰ ${daysRemaining} दिन शेष`;
      const subject = daysRemaining === 1 ? `🚨 ${examName} आवेदन की अंतिम तिथि कल समाप्त हो रही है!` : `⏰ ${examName} आवेदन के लिए केवल ${daysRemaining} दिन शेष!`;
      const content = `
        <p>नमस्ते <strong>${userName}</strong>,</p>
        <p><strong>${examName}</strong> के लिए ऑनलाइन आवेदन की अंतिम तिथि अत्यंत निकट है।</p>
        <div class="card-box" style="border-left-color:${daysRemaining <= 1 ? '#dc2626' : '#f59e0b'};">
          <div class="meta-row"><span class="meta-label">परीक्षा:</span> <span class="meta-val">${examName}</span></div>
          <div class="meta-row"><span class="meta-label">अंतिम तिथि:</span> <span class="meta-val" style="color:#dc2626;">${deadlineDate}</span></div>
          <div class="meta-row"><span class="meta-label">समय शेष:</span> <span class="meta-val">${daysRemaining === 1 ? 'अंतिम 24 घंटे' : `${daysRemaining} दिन`}</span></div>
        </div>
        <p>कृपया बिना किसी देरी के तुरंत अपना आवेदन और शुल्क जमा करें।</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: subject,
          badge: urgencyText,
          content,
          ctaText: 'अभी आवेदन करें',
          ctaUrl: officialUrl,
          language: 'hi'
        })
      };
    }

    // Default English
    const urgencyBadge = daysRemaining === 1 ? '🚨 Closes Tomorrow' : `⏰ ${daysRemaining} Days Left`;
    const subject = daysRemaining === 1 ? `🚨 ${examName} Application Closes Tomorrow!` : `⏰ ${examName} Application Deadline in ${daysRemaining} Days`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>The application deadline for <strong>${examName}</strong> (${org}) is approaching fast.</p>
      <div class="card-box" style="border-left-color:${daysRemaining <= 1 ? '#dc2626' : '#f59e0b'};">
        <div class="meta-row"><span class="meta-label">Exam:</span> <span class="meta-val">${examName}</span></div>
        <div class="meta-row"><span class="meta-label">Official Deadline:</span> <span class="meta-val" style="color:#dc2626;">${deadlineDate}</span></div>
        <div class="meta-row"><span class="meta-label">Time Remaining:</span> <span class="meta-val">${daysRemaining === 1 ? 'Final 24 Hours' : `${daysRemaining} Days`}</span></div>
        <div class="meta-row"><span class="meta-label">Eligibility:</span> <span class="meta-val">${exam.qualification || 'Any Degree'}</span></div>
      </div>
      <p>Ensure your fee payment and document verification are completed before the server gateway closes.</p>
    `;
    return {
      subject,
      html: wrapEmailTemplate({
        title: subject,
        badge: urgencyBadge,
        content,
        ctaText: 'Apply Now Before Deadline',
        ctaUrl: officialUrl,
        secondaryCtaText: 'View Exam Details',
        secondaryCtaUrl: `${APP_BASE_URL}/discovery/exams`,
        language: 'en'
      })
    };
  },

  // 3. Template: Admit Card Released (ADMIT_CARD_RELEASED)
  renderAdmitCardEmail({ user, exam, language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const examName = exam.name || exam.code;
    const org = exam.organization || 'Government Commission';
    const officialUrl = exam.official_url || 'https://india.gov.in';

    if (language === 'ta') {
      const subject = `🎟️ ${examName} ஹால் டிக்கெட் / Admit Card வெளியானது`;
      const content = `
        <p>வணக்கம் <strong>${userName}</strong>,</p>
        <p><strong>${org}</strong> நடத்தியுள்ள <strong>${examName}</strong> தேர்வுக்கான அதிகாரப்பூர்வ ஹால் டிக்கெட் (Admit Card) தற்போது பதிவிறக்கத்திற்கு கிடைக்கிறது.</p>
        <div class="card-box" style="border-left-color:#10b981;">
          <div class="meta-row"><span class="meta-label">தேர்வு:</span> <span class="meta-val">${examName}</span></div>
          <div class="meta-row"><span class="meta-label">தேர்வு மையம்:</span> <span class="meta-val">ஹால் டிக்கெட்டில் குறிப்பிடப்பட்டுள்ளது</span></div>
          <div class="meta-row"><span class="meta-label">தேவையான ஆவணங்கள்:</span> <span class="meta-val">ஹால் டிக்கெட் அச்சு + அசல் அடையாள அட்டை</span></div>
        </div>
        <p>உங்கள் தேர்வு மையம், நேரம் மற்றும் வழிமுறைகளை உடனே சரிபார்க்கவும்.</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: `ஹால் டிக்கெட் வெளியானது: ${examName}`,
          badge: '🎟️ ஹால் டிக்கெட் தயார்',
          content,
          ctaText: 'ஹால் டிக்கெட் பதிவிறக்க',
          ctaUrl: officialUrl,
          language: 'ta'
        })
      };
    }

    if (language === 'hi') {
      const subject = `🎟️ ${examName} एडमिट कार्ड / हॉल टिकट जारी`;
      const content = `
        <p>नमस्ते <strong>${userName}</strong>,</p>
        <p><strong>${org}</strong> द्वारा <strong>${examName}</strong> के लिए आधिकारिक प्रवेश पत्र (Admit Card) जारी कर दिया गया है।</p>
        <div class="card-box" style="border-left-color:#10b981;">
          <div class="meta-row"><span class="meta-label">परीक्षा:</span> <span class="meta-val">${examName}</span></div>
          <div class="meta-row"><span class="meta-label">परीक्षा केंद्र:</span> <span class="meta-val">एडमिट कार्ड पर उल्लिखित</span></div>
          <div class="meta-row"><span class="meta-label">आवश्यक दस्तावेज:</span> <span class="meta-val">एडमिट कार्ड प्रिंट + मूल फोटो पहचान पत्र</span></div>
        </div>
        <p>कृपया समय रहते अपना एडमिट कार्ड डाउनलोड करें और परीक्षा केंद्र का विवरण जांचें।</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: `एडमिट कार्ड उपलब्ध: ${examName}`,
          badge: '🎟️ एडमिट कार्ड लाइव',
          content,
          ctaText: 'एडमिट कार्ड डाउनलोड करें',
          ctaUrl: officialUrl,
          language: 'hi'
        })
      };
    }

    // Default English
    const subject = `🎟️ Download Admit Card / Hall Ticket: ${examName}`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>The official Admit Card / Hall Ticket for <strong>${examName}</strong> has been released by <strong>${org}</strong>.</p>
      <div class="card-box" style="border-left-color:#10b981;">
        <div class="meta-row"><span class="meta-label">Examination:</span> <span class="meta-val">${examName}</span></div>
        <div class="meta-row"><span class="meta-label">Reporting Time & Shift:</span> <span class="meta-val">Specified on your Hall Ticket</span></div>
        <div class="meta-row"><span class="meta-label">Mandatory Items:</span> <span class="meta-val">Printed Admit Card + Original Photo ID + Passport Photos</span></div>
      </div>
      <p>Download your hall ticket and review your allocated test center and reporting rules.</p>
    `;
    return {
      subject,
      html: wrapEmailTemplate({
        title: `Admit Card Available: ${examName}`,
        badge: '🎟️ Hall Ticket Released',
        content,
        ctaText: 'Download Hall Ticket Officially',
        ctaUrl: officialUrl,
        secondaryCtaText: 'Quick Revision Notes',
        secondaryCtaUrl: `${APP_BASE_URL}/syllabus`,
        language: 'en'
      })
    };
  },

  // 4. Template: Exam Approaching / Exam Day (EXAM_7_DAYS, EXAM_1_DAY, EXAM_DAY)
  renderExamDateReminderEmail({ user, exam, daysRemaining = 7, examDate = 'Scheduled Date', language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const examName = exam.name || exam.code;
    const org = exam.organization || 'Government Commission';
    const officialUrl = exam.official_url || 'https://india.gov.in';

    const isToday = daysRemaining === 0;
    const isTomorrow = daysRemaining === 1;

    if (language === 'ta') {
      const subject = isToday
        ? `🎯 இன்று உங்கள் ${examName} தேர்வு — வாழ்த்துகள்!`
        : isTomorrow
        ? `🚨 நாளை ${examName} தேர்வு நடைபெறுகிறது!`
        : `📅 இன்னும் ${daysRemaining} நாட்களில் ${examName} தேர்வு!`;
      const content = `
        <p>வணக்கம் <strong>${userName}</strong>,</p>
        <p>${isToday ? `இன்று உங்கள் <strong>${examName}</strong> தேர்வு நாள். அமைதியாகவும் தன்னம்பிக்கையுடனும் தேர்வை எதிர்கொள்ளுங்கள்.` : `உங்கள் <strong>${examName}</strong> தேர்வுக்கான நாட்கள் நெருங்கிவிட்டன.`}</p>
        <div class="card-box" style="border-left-color:#2563eb;">
          <div class="meta-row"><span class="meta-label">தேர்வு நாள்:</span> <span class="meta-val">${examDate}</span></div>
          <div class="meta-row"><span class="meta-label">முக்கிய வழிகாட்டுதல்:</span> <span class="meta-val">நேரத்திற்கு முன்னதாக தேர்வு மையத்தை அடையவும்</span></div>
        </div>
        <p>கடைசி நேர மீள்பார்வைக்கு எங்கள் சுருக்கக் குறிப்புகளைப் பயன்படுத்தவும்.</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: subject,
          badge: isToday ? '🎯 தேர்வு நாள்' : `📅 ${daysRemaining} நாட்கள்`,
          content,
          ctaText: 'தேர்வுக் குறிப்புகளைப் பார்க்க',
          ctaUrl: `${APP_BASE_URL}/syllabus`,
          language: 'ta'
        })
      };
    }

    if (language === 'hi') {
      const subject = isToday
        ? `🎯 आज आपकी ${examName} परीक्षा है — शुभकामनाएं!`
        : isTomorrow
        ? `🚨 कल आपकी ${examName} परीक्षा है!`
        : `📅 ${examName} परीक्षा में केवल ${daysRemaining} दिन शेष`;
      const content = `
        <p>नमस्ते <strong>${userName}</strong>,</p>
        <p>${isToday ? `आज आपकी <strong>${examName}</strong> परीक्षा का दिन है। आत्मविश्वास और एकाग्रता के साथ परीक्षा दें।` : `आपकी <strong>${examName}</strong> परीक्षा निकट है।`}</p>
        <div class="card-box" style="border-left-color:#2563eb;">
          <div class="meta-row"><span class="meta-label">परीक्षा तिथि:</span> <span class="meta-val">${examDate}</span></div>
          <div class="meta-row"><span class="meta-label">महत्वपूर्ण निर्देश:</span> <span class="meta-val">समय से पूर्व परीक्षा केंद्र पर पहुंचें</span></div>
        </div>
        <p>अंतिम समय के त्वरित दोहराव के लिए नोट्स देखें।</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: subject,
          badge: isToday ? '🎯 परीक्षा दिवस' : `📅 ${daysRemaining} दिन शेष`,
          content,
          ctaText: 'रिवीजन नोट्स देखें',
          ctaUrl: `${APP_BASE_URL}/syllabus`,
          language: 'hi'
        })
      };
    }

    // Default English
    const subject = isToday
      ? `🎯 Your ${examName} Exam Is Today — Best of Luck!`
      : isTomorrow
      ? `🚨 ${examName} Exam Tomorrow — Final Preparation Checklist`
      : `📅 ${examName} Exam Is in ${daysRemaining} Days`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>${isToday ? `Today is the day for your <strong>${examName}</strong> examination. Stay calm, confident, and perform at your highest potential.` : `The examination date for <strong>${examName}</strong> (${org}) is approaching.`}</p>
      <div class="card-box" style="border-left-color:#2563eb;">
        <div class="meta-row"><span class="meta-label">Exam Date:</span> <span class="meta-val">${examDate}</span></div>
        <div class="meta-row"><span class="meta-label">Target Commission:</span> <span class="meta-val">${org}</span></div>
        <div class="meta-row"><span class="meta-label">Preparation Advice:</span> <span class="meta-val">Focus on high-yield formulas, PYQs, and calm revision</span></div>
      </div>
      <p>Access your curated revision sheets and memory cards below.</p>
    `;
    return {
      subject,
      html: wrapEmailTemplate({
        title: subject,
        badge: isToday ? '🎯 Exam Day' : `📅 ${daysRemaining} Days Countdown`,
        content,
        ctaText: 'Access Rapid Revision Studio',
        ctaUrl: `${APP_BASE_URL}/syllabus`,
        secondaryCtaText: 'Official Portal',
        secondaryCtaUrl: officialUrl,
        language: 'en'
      })
    };
  },

  // 5. Template: Exam Result Released (RESULT_RELEASED)
  renderResultEmail({ user, exam, language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const examName = exam.name || exam.code;
    const org = exam.organization || 'Government Commission';
    const officialUrl = exam.official_url || 'https://india.gov.in';

    if (language === 'ta') {
      const subject = `📢 ${examName} அதிகாரப்பூர்வ தேர்வு முடிவுகள் வெளியானது!`;
      const content = `
        <p>வணக்கம் <strong>${userName}</strong>,</p>
        <p><strong>${org}</strong> நடத்திய <strong>${examName}</strong> தேர்வுக்கான முடிவுகள் மற்றும் தரவரிசைப் பட்டியல் வெளியிடப்பட்டுள்ளது.</p>
        <div class="card-box" style="border-left-color:#8b5cf6;">
          <div class="meta-row"><span class="meta-label">தேர்வு:</span> <span class="meta-val">${examName}</span></div>
          <div class="meta-row"><span class="meta-label">அறிவிப்பு:</span> <span class="meta-val">முடிவுகள் மற்றும் மதிப்பெண் பட்டியல் நேரலையில் உள்ளது</span></div>
        </div>
        <p>உங்கள் பதிவு எண் கொண்டு தேர்வு முடிவுகளை உடனே சரிபார்க்கவும்.</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: `தேர்வு முடிவுகள் வெளியானது: ${examName}`,
          badge: '📢 தேர்வு முடிவுகள்',
          content,
          ctaText: 'முடிவுகளை சரிபார்க்க',
          ctaUrl: officialUrl,
          language: 'ta'
        })
      };
    }

    if (language === 'hi') {
      const subject = `📢 ${examName} परीक्षा परिणाम और कट-ऑफ घोषित!`;
      const content = `
        <p>नमस्ते <strong>${userName}</strong>,</p>
        <p><strong>${org}</strong> द्वारा <strong>${examName}</strong> के लिए आधिकारिक परिणाम और मेरिट सूची जारी कर दी गई है।</p>
        <div class="card-box" style="border-left-color:#8b5cf6;">
          <div class="meta-row"><span class="meta-label">परीक्षा:</span> <span class="meta-val">${examName}</span></div>
          <div class="meta-row"><span class="meta-label">विवरण:</span> <span class="meta-val">अंक और मेरिट सूची आधिकारिक पोर्टल पर उपलब्ध</span></div>
        </div>
        <p>कृपया आधिकारिक लिंक से अपना स्कोरकार्ड और कट-ऑफ देखें।</p>
      `;
      return {
        subject,
        html: wrapEmailTemplate({
          title: `परिणाम घोषित: ${examName}`,
          badge: '📢 परीक्षा परिणाम',
          content,
          ctaText: 'परिणाम व स्कोरकार्ड देखें',
          ctaUrl: officialUrl,
          language: 'hi'
        })
      };
    }

    // Default English
    const subject = `📢 ${examName} Official Result & Cutoff Declared`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>The official examination result and merit list for <strong>${examName}</strong> has been announced by <strong>${org}</strong>.</p>
      <div class="card-box" style="border-left-color:#8b5cf6;">
        <div class="meta-row"><span class="meta-label">Examination:</span> <span class="meta-val">${examName}</span></div>
        <div class="meta-row"><span class="meta-label">Status:</span> <span class="meta-val">Scorecards & Qualifying Cutoffs Active</span></div>
      </div>
      <p>Check your roll number and scorecard on the official commission portal.</p>
    `;
    return {
      subject,
      html: wrapEmailTemplate({
        title: `Official Result Declared: ${examName}`,
        badge: '📢 Result Out',
        content,
        ctaText: 'Check Official Result & Scorecard',
        ctaUrl: officialUrl,
        language: 'en'
      })
    };
  },

  // 6. Template: Daily RAG-Grounded Current Affairs Digest
  renderDailyCurrentAffairsEmail({ user, articles = [], language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const todayStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' });

    let itemsHtml = '';
    for (const art of articles.slice(0, 5)) {
      itemsHtml += `
        <div style="margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:11px; font-weight:800; color:#2563eb; text-transform:uppercase;">${art.category || 'National'} • Source: ${art.source_name || 'Verified Gazette'}</div>
          <div style="font-size:15px; font-weight:700; color:#0f172a; margin:4px 0;">${art.title}</div>
          <div style="font-size:13px; color:#475569; line-height:1.5;">${art.summary}</div>
        </div>
      `;
    }

    const subject = `⚡ Daily Exam Current Affairs Digest: ${todayStr}`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Here is your daily exam-oriented current affairs digest grounded from verified government gazettes and ministry releases:</p>
      <div class="card-box" style="border-left-color:#0284c7; background-color:#f8fafc;">
        ${itemsHtml || '<p>No new releases for today.</p>'}
      </div>
    `;

    return {
      subject,
      html: wrapEmailTemplate({
        title: `Daily Exam Current Affairs Digest`,
        badge: '⚡ Verified RAG Digest',
        content,
        ctaText: 'Open Full Current Affairs Studio',
        ctaUrl: `${APP_BASE_URL}/current-affairs`,
        language: 'en'
      })
    };
  },

  // 7. Template: Welcome & Exam Onboarding Email
  renderWelcomeEmail({ user, targetExam, language = 'en' }) {
    const userName = user?.name || 'Aspirant';
    const examName = targetExam?.name || targetExam?.code || 'Government Civil Services';
    const examOrg = targetExam?.organization || 'State & Central Recruitment Commissions';

    const subject = `🎉 Welcome to Pitch Deck, ${userName}! Your Journey for ${examName} Starts Now`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Welcome to <strong>Pitch Deck Government Examination Platform</strong>! Your candidate account has been successfully created and your adaptive study engine is now initialized.</p>
      
      <div class="card-box" style="border-left-color:#2563eb;">
        <div class="meta-row"><span class="meta-label">Candidate Name:</span> <span class="meta-val">${userName}</span></div>
        <div class="meta-row"><span class="meta-label">Registered Email:</span> <span class="meta-val">${user?.email}</span></div>
        <div class="meta-row"><span class="meta-label">Target Examination:</span> <span class="meta-val">${examName}</span></div>
        <div class="meta-row"><span class="meta-label">Commission/Body:</span> <span class="meta-val">${examOrg}</span></div>
        <div class="meta-row"><span class="meta-label">Account Status:</span> <span class="meta-val" style="color:#16a34a;">✅ Active & Verified</span></div>
      </div>

      <p style="margin-top:16px;"><strong>What you can do right now:</strong></p>
      <ul style="padding-left:20px; line-height:1.7;">
        <li>📅 <strong>Access Daily AI Study Plan:</strong> 5–8 personalized Pomodoro sessions dynamically mapped to your syllabus.</li>
        <li>📖 <strong>Explore 49+ Government Exams:</strong> Real-time official notifications, syllabus breakdown, and PYQs.</li>
        <li>⚡ <strong>Take Adaptive Mock Tests:</strong> Instant performance analytics and mistake elimination journals.</li>
      </ul>
    `;

    return {
      subject,
      html: wrapEmailTemplate({
        title: `Welcome to Pitch Deck, ${userName}!`,
        badge: '🎉 Candidate Account Active',
        content,
        ctaText: 'Launch Candidate Dashboard',
        ctaUrl: `${APP_BASE_URL}/dashboard`,
        secondaryCtaText: 'View Today\'s Study Plan',
        secondaryCtaUrl: `${APP_BASE_URL}/study-plan`,
        language: 'en'
      })
    };
  },

  // 8. Template: Login Notification & Daily Briefing
  renderLoginAlertEmail({ user, targetExam, loginTime }) {
    const userName = user?.name || 'Aspirant';
    const examName = targetExam?.name || targetExam?.code || 'Government Examination';
    const timeStr = loginTime || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const subject = `🔐 Sign-In Alert: Pitch Deck Examination Account Active (${timeStr})`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>We detected a successful sign-in to your Pitch Deck account on <strong>${timeStr} (IST)</strong>.</p>
      
      <div class="card-box" style="border-left-color:#059669;">
        <div class="meta-row"><span class="meta-label">Account Email:</span> <span class="meta-val">${user?.email}</span></div>
        <div class="meta-row"><span class="meta-label">Sign-In Time:</span> <span class="meta-val">${timeStr}</span></div>
        <div class="meta-row"><span class="meta-label">Active Target:</span> <span class="meta-val">${examName}</span></div>
      </div>

      <p style="margin-top:16px;">Keep up your preparation momentum! Click below to jump straight into your scheduled daily study sessions.</p>
    `;

    return {
      subject,
      html: wrapEmailTemplate({
        title: `Welcome Back, ${userName}!`,
        badge: '🔐 Sign-In Confirmed',
        content,
        ctaText: 'Continue Today\'s Preparation',
        ctaUrl: `${APP_BASE_URL}/dashboard`,
        secondaryCtaText: 'Review Practice Questions',
        secondaryCtaUrl: `${APP_BASE_URL}/tests`,
        language: 'en'
      })
    };
  },

  // 9. Template: Exam News & Recruitment Alert
  renderExamNewsEmail({ user, exam, newsTitle, newsSummary, newsUrl }) {
    const userName = user?.name || 'Aspirant';
    const examName = exam?.name || exam?.code || 'Government Examination';
    const org = exam?.organization || 'Official Recruitment Commission';
    const title = newsTitle || `Important Exam News: ${examName}`;

    const subject = `📢 Exam News Alert: ${title} — ${org}`;
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Here is an official recruitment and examination update regarding <strong>${examName}</strong> published by <strong>${org}</strong>.</p>
      
      <div class="card-box" style="border-left-color:#f59e0b; background-color:#fffbeb;">
        <div style="font-size:16px; font-weight:800; color:#b45309; margin-bottom:8px;">${title}</div>
        <p style="margin:0 0 10px 0; color:#78350f; line-height:1.5;">${newsSummary || 'New notifications, dates, or syllabus guidelines have been updated for this examination.'}</p>
        <div class="meta-row"><span class="meta-label">Examination:</span> <span class="meta-val">${examName}</span></div>
        <div class="meta-row"><span class="meta-label">Authority:</span> <span class="meta-val">${org}</span></div>
      </div>

      <p>Stay ahead of deadlines and review official notices immediately.</p>
    `;

    return {
      subject,
      html: wrapEmailTemplate({
        title,
        badge: '📢 Official Exam News',
        content,
        ctaText: 'View Official Notice',
        ctaUrl: newsUrl || exam?.official_url || `${APP_BASE_URL}/discovery/exams`,
        secondaryCtaText: 'Open Exam Calendar',
        secondaryCtaUrl: `${APP_BASE_URL}/discovery/calendar`,
        language: 'en'
      })
    };
  },

  // High-Level Helper: Send Welcome Email to candidate and notify preethika0809@gmail.com
  async sendWelcomeNotification({ user, targetExam, language = 'en' }) {
    if (!user || !user.email) return;
    const template = this.renderWelcomeEmail({ user, targetExam, language });

    // Send to candidate
    await this.sendEmail({
      userId: user.id,
      recipientEmail: user.email,
      subject: template.subject,
      notificationType: 'WELCOME',
      examId: targetExam?.id || null,
      htmlContent: template.html,
      language
    });

    // Also notify primary admin email (preethika0809@gmail.com) if different
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'preethika0809@gmail.com';
    if (adminEmail && adminEmail.toLowerCase() !== user.email.toLowerCase()) {
      await this.sendEmail({
        userId: user.id,
        recipientEmail: adminEmail,
        subject: `[Admin Alert] New Candidate Registered: ${user.name} (${user.email})`,
        notificationType: 'ADMIN_REGISTRATION_ALERT',
        examId: targetExam?.id || null,
        htmlContent: template.html,
        language: 'en'
      });
    }
  },

  // High-Level Helper: Send Sign-in Alert to candidate and preethika0809@gmail.com
  async sendLoginNotification({ user, targetExam, loginTime }) {
    if (!user || !user.email) return;
    const template = this.renderLoginAlertEmail({ user, targetExam, loginTime });

    // Send to candidate
    await this.sendEmail({
      userId: user.id,
      recipientEmail: user.email,
      subject: template.subject,
      notificationType: 'LOGIN_ALERT',
      examId: targetExam?.id || null,
      htmlContent: template.html,
      language: 'en'
    });

    // Also notify primary email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'preethika0809@gmail.com';
    if (adminEmail && adminEmail.toLowerCase() !== user.email.toLowerCase()) {
      await this.sendEmail({
        userId: user.id,
        recipientEmail: adminEmail,
        subject: `[Admin Alert] User Logged In: ${user.name} (${user.email})`,
        notificationType: 'ADMIN_LOGIN_ALERT',
        examId: targetExam?.id || null,
        htmlContent: template.html,
        language: 'en'
      });
    }
  },

  // High-Level Helper: Send Exam News Alert
  async sendExamNewsAlert({ exam, newsTitle, newsSummary, newsUrl, recipientEmail = null }) {
    const recipients = recipientEmail ? [recipientEmail] : ['preethika0809@gmail.com'];
    
    // Also fetch users targeting this exam
    if (exam && exam.id) {
      try {
        const targetedUsers = db.query(`
          SELECT DISTINCT u.email, u.name, u.id 
          FROM users u
          JOIN user_profiles up ON u.id = up.user_id
          WHERE up.target_exam_id = ? OR up.state = ?
        `, [exam.id, exam.state || 'All India']);
        
        targetedUsers.forEach(u => {
          if (!recipients.includes(u.email)) {
            recipients.push(u.email);
          }
        });
      } catch (e) {}
    }

    for (const email of recipients) {
      const template = this.renderExamNewsEmail({ user: { email, name: email.split('@')[0] }, exam, newsTitle, newsSummary, newsUrl });
      await this.sendEmail({
        recipientEmail: email,
        subject: template.subject,
        notificationType: 'EXAM_NEWS',
        examId: exam?.id || null,
        htmlContent: template.html,
        language: 'en'
      });
    }
  }
};

module.exports = emailService;
