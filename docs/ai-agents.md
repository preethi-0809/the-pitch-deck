# 15 Specialized AI Agents Specification

| # | Agent Name | Primary Responsibility | Data Tools Accessed |
|---|---|---|---|
| 1 | `ExamCoachAgent` | Central conversational orchestrator and advisor | `userDataTool`, `performanceTool`, `studyPlanTool`, `revisionTool` |
| 2 | `ExamStrategyAgent` | 30/60/90-day roadmaps and subject priority ranking | `userDataTool`, `syllabusTool`, `performanceTool` |
| 3 | `StudyPlannerAgent` | Daily & weekly schedule generator with hour budgeting | `studyPlanTool`, `syllabusTool`, `revisionTool` |
| 4 | `TutorAgent` | Multi-depth concept explainer (Simple, Exam, Detailed, Flash) | `syllabusTool`, `studyMaterials` |
| 5 | `QuestionGeneratorAgent` | Calibrated MCQ and descriptive problem generator | `questionTool`, `syllabusTool` |
| 6 | `AdaptiveTestAgent` | Dynamic real-time difficulty adjusting mock test engine | `questionTool`, `performanceTool` |
| 7 | `PerformanceAgent` | Post-test score, accuracy, and section pacing analytics | `performanceTool`, `testAttempts` |
| 8 | `WeaknessAgent` | Error taxonomy classification (Concept gap, careless, guessing) | `performanceTool`, `userMistakes`, `revisionTool` |
| 9 | `RevisionAgent` | 1-3-7-21-60 day spaced repetition scheduler | `revisionTool`, `userMistakes` |
| 10 | `CurrentAffairsAgent` | PIB / Govt bulletin verification and syllabus mapper | `currentAffairsTool`, `questionTool` |
| 11 | `PYQAnalysisAgent` | Previous year question weightage and repeat themes | `questionTool`, `pyqs` |
| 12 | `SyllabusTrackingAgent` | Topic mastery percentage and syllabus completion % | `syllabusTool`, `userProgress` |
| 13 | `TimeManagementAgent` | Question-solving speed vs exam benchmark pacing | `performanceTool` |
| 14 | `AccountabilityAgent` | Missed study session detection & rebalancing | `studyPlanTool` |
| 15 | `ExamReadinessAgent` | Holistic 0-100% Exam Readiness score computation | `syllabusTool`, `performanceTool`, `revisionTool` |
