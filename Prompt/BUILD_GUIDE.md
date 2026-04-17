# AI Ticket Management App — Modular Build Guide

## What This Is

This guide breaks a single large prompt into **7 focused modules** that you deliver
to an AI code assistant one at a time. Each module builds on the previous one, so the
app grows incrementally and stays verifiable at every step.

---

## The 7 Modules at a Glance

| # | Module | What Gets Built |
|---|--------|-----------------|
| 1 | Foundation | App skeleton, ticket data, shared components, 3-column layout + Summary panel |
| 2 | Triage Agent (Card 1) | Dup scan telemetry, duplicate vs no-duplicate display |
| 3 | Investigate Agent (Card 2) | RCA telemetry, error logs, root cause summary |
| 4 | Recommendation Agent (Card 3) | Knowledge Platform Search, resolution steps |
| 5 | LifecycleOps Agent (Card 4) | Pipeline health check, result panels, run logs |
| 6 | Support Ops Assistant (Col 3) | SLAs panel, KB chat, ticket ID search trigger |
| 7 | Details Tab | Classification, Reporter, Assignment, SLA, Tags, Records |

---

## How to Use These Prompts

### Step-by-step workflow

1. **Open a fresh AI chat** (Claude, GPT-4, etc.) with code generation capability.
2. **Give Module 1 first.** Ask the AI to produce the complete file.
3. **Copy the output** into `src/App.jsx` and verify it runs without errors.
4. **Give Module 2.** Paste the module prompt and say:
   > "Here is the current App.jsx. Now apply Module 2."
5. **Repeat** for each module in order (1 → 7).
6. After each module, **test the UI** before moving to the next module.

---

## File Reference

All module prompts are in this folder:

```
Prompt/
  BUILD_GUIDE.md          ← this file
  M01_foundation.md
  M02_triage_agent.md
  M03_investigate_agent.md
  M04_recommendation_agent.md
  M05_lifecycle_agent.md
  M06_support_ops.md
  M07_details_tab.md
```
