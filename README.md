# PrepAI — AI-Powered Government Exam Preparation Platform

A full-stack, production-ready **AI-Powered Government Exam Preparation Web Application** designed for Indian competitive examinations:
- **UPSC Civil Services (IAS/IPS/IFS)**
- **SSC (CGL, CHSL, MTS)**
- **TNPSC (Group 1, Group 2, Group 4)**
- **Banking (IBPS, SBI PO & Clerk)**
- **Railways (RRB NTPC, Group D)**
- **State PSCs**

The platform operates as a **Personal AI Government Exam Coach** that continuously executes the feedback loop:
**Assess → Plan → Learn → Practice → Test → Analyze → Identify Weakness → Revise → Re-plan**

---

## Key Features

1. **Smart Onboarding & Learner Adaptation**:
   - Supports College Students (6-8h/day), Working Professionals (1-3h weekdays / 5-6h weekends), Homemakers (flexible segmented blocks), and Full-time Graduates.
   - Automatically adapts daily workloads to available time and redistributes missed sessions without cognitive overload.

2. **15-Agent AI Architecture**:
   - **Exam Coach Agent**: Central conversational orchestrator answering personal queries.
   - **Exam Strategy Agent**: 30/60/90-day roadmaps & subject priority matrices.
   - **Study Planner Agent**: Generates realistic daily and weekly study plans.
   - **Personal Tutor Agent**: Multi-depth concept explainer (Simple, Exam-oriented, Detailed, Quick Revision) with bilingual (EN/TA) support.
   - **Question Generator Agent**: Syllabus-matched MCQs and practice drills.
   - **Adaptive Test Agent**: Dynamic difficulty progression with concept gap detection.
   - **Performance Analysis Agent**: Deep metrics, accuracy, and pace analysis.
   - **Mistake & Weakness Agent**: Error taxonomy classification (Concept gap, memory, confusion, misreading, careless, guessing, time panic).
   - **Smart Revision Agent**: 1-3-7-21-60 day spaced repetition queue.
   - **Current Affairs Agent**: Verified PIB/Govt news feed linked to syllabus topics.
   - **PYQ Analysis Agent**: Previous year question weightage and repeat themes.
   - **Syllabus Tracking Agent**: Real-time topic mastery index.
   - **Time Management Agent**: Question-solving speed vs exam pacing benchmarks.
   - **Accountability Agent**: Plan completion tracking and automatic task carry-over.
   - **Exam Readiness Agent**: 0-100% holistic readiness index.

3. **Mock Exam Simulator**:
   - Real exam interface with countdown clock, question palette (1-to-N), Mark for Review, instant evaluation, negative marking deductions, and post-test AI diagnostic reports.

4. **Official Source Authority**:
   - Master study notes with citations (PIB, NCERT, RBI, Supreme Court judgments).
   - Verified current affairs feed with MCQ extraction.

5. **Email Reminders & Notifications**:
   - Daily morning study plan digest, revision alerts, and test notifications with configurable preferences.

6. **Strictly NO Gamification**:
   - No leaderboards, coins, or badges. Pure focus on learning, preparation, performance, and improvement.

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Database Initialization & Seed Data
```bash
# Populate initial catalog for UPSC, SSC, TNPSC, Banking, Railways (SQLite)
node database/seed/seedRunner.js

# Or initialize enterprise MySQL database with full seed data:
npm run db:init-mysql
```

### Running the Application Locally
```bash
# 1. Unified Single Server (Frontend UI + Backend API on a single port: http://localhost:5000)
npm run app
# or
npm start

# 2. Dual Dev Servers with Hot Reloading (Backend on 5000, Vite on 5173)
npm run dev
```

### Pre-Configured Test Profiles
| Category | Email | Password | Schedule Profile |
|---|---|---|---|
| **Working Professional** | `prof@example.com` | `password123` | TNPSC Group 2 (2h weekdays, 5.5h weekends) |
| **Student** | `student@example.com` | `password123` | UPSC CSE (7h weekdays, 8h weekends) |
| **Homemaker** | `homemaker@example.com` | `password123` | SSC CGL (3h weekdays, 4h weekends) |
| **System Admin** | `admin@example.com` | `admin123` | Content & Question Management |

---

## Technology Stack
- **Frontend**: React 18, Vite, Lucide Icons, CSS Custom Properties (Dark/Light mode)
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Nodemailer, `mysql2`
- **Database**: SQLite (Node.js 24 standard library `node:sqlite`) + MySQL 8.x Enterprise Schema DDL & Dumps
- **AI Architecture**: 15 Specialized Agents, Tool Layer, Orchestration Engine & LLM facade
