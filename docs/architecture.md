# System Architecture — AI-Powered Government Exam Preparation Platform

## High-Level Architecture

The platform is designed around a multi-agent orchestration architecture where specialized AI agents continuously execute the **Assess → Plan → Learn → Practice → Test → Analyze → Identify Weakness → Revise → Re-plan** feedback loop.

```
                    ┌─────────────────────────┐
                    │      React 18 SPA       │
                    │   (Responsive UI/UX)    │
                    └────────────┬────────────┘
                                 │ REST / JWT
                                 ▼
                    ┌─────────────────────────┐
                    │   Node.js / Express API │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌──────────────────┐            ┌──────────────────┐
       │ Database Layer   │            │ AI Orchestration │
       │ (SQLite / MySQL) │            │ (15 AI Agents)   │
       └──────────────────┘            └────────┬─────────┘
                                                │
                 ┌──────────────┬───────────────┼──────────────┬──────────────┐
                 ▼              ▼               ▼              ▼              ▼
            Planner Agent   Tutor Agent    Test Agent    Weakness Agent  Revision Agent
```

## Agent Interaction Workflow

1. **Test Completion**:
   `Candidate Completes Mock Test` → `PerformanceAgent evaluates scores & pacing` → `WeaknessAgent isolates root cause` → `RevisionAgent queues spaced repetition` → `StudyPlannerAgent updates daily timeline` → `ExamCoachAgent synthesizes guidance`.

2. **Personal Time Constraints**:
   - Handles students (6-8h), working professionals (1-3h weekdays / 5-6h weekends), and homemakers (segmented slots).
   - Automatically redistributes missed tasks without creating workload shocks.
