# REST API Documentation — PrepAI Platform

## Authentication & User Profile
- `POST /api/auth/register` — Register new candidate with Smart Onboarding data
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/profile` — Fetch current candidate profile, target exam, and schedule
- `PUT /api/auth/profile` — Update candidate study hours and target exam

## Study Planning & Accountability
- `GET /api/study/plan` — Retrieve active daily plan and tasks
- `PATCH /api/study/tasks/:taskId` — Toggle task completion status
- `POST /api/study/plan/regenerate` — Dynamically rebalance plan to custom available hours
- `POST /api/study/plan/redistribute` — Automatically redistribute missed tasks

## Exams, Syllabus & Notes
- `GET /api/exams` — List all competitive examinations (UPSC, SSC, TNPSC, Banking, Railways, State PSC)
- `GET /api/exams/:examId/syllabus` — Fetch complete subject and topic hierarchy
- `GET /api/exams/:examId/syllabus-status` — Fetch topic completion and mastery progress
- `GET /api/exams/materials` — Retrieve master study notes with official citations

## Question Generation & PYQs
- `POST /api/questions/generate` — Generate calibrated MCQs and practice drills
- `POST /api/questions/adaptive-next` — Fetch next adaptive question based on ability
- `GET /api/questions/pyqs/:examId` — Retrieve previous year questions and weightage analysis

## Mock Tests & Evaluations
- `GET /api/tests` — List available mock exams and adaptive tests
- `GET /api/tests/:testId` — Fetch test questions with options
- `POST /api/tests/:testId/submit` — Submit answers, calculate score, and trigger post-test AI workflow
- `GET /api/tests/attempts/:attemptId/analysis` — Get post-test diagnostic report

## AI Coach & Concept Tutor
- `POST /api/coach/chat` — Conversational AI Coach query
- `POST /api/coach/tutor` — Concept explanation in 4 depth modes (Simple, Exam, Detailed, Quick Flash) with bilingual support
- `GET /api/coach/strategy` — Fetch 30/60/90-day milestone strategy roadmap

## Performance & Revision
- `GET /api/performance/dashboard` — Performance metrics, mistake taxonomy, and readiness score
- `GET /api/revision` — Spaced repetition queue and completed history
- `POST /api/revision/:revisionId/complete` — Mark revision complete and schedule next stage

## Current Affairs & Notifications
- `GET /api/current-affairs` — Verified government updates feed
- `POST /api/current-affairs/generate-questions` — Generate MCQs directly from news
- `GET /api/notifications/preferences` — Get email reminder settings
- `PUT /api/notifications/preferences` — Update email settings
- `POST /api/notifications/test-email` — Dispatch test daily digest
