# Features — How This Works

## Feature Numbering

Features are numbered sequentially starting from 001:

```
FEAT-001
FEAT-002
FEAT-003
```

Always 3 digits with leading zeros. Never reuse a number. The next number is determined by counting rows in `feature-tracker.md`.

## File Naming Convention

Each feature gets its own document file:

```
docs/features/FEAT-001-short-title.md
docs/features/FEAT-002-short-title.md
```

Use kebab-case for the short title. Keep it brief (3–5 words).

## The 5-Agent Workflow

Each feature passes through 5 agents in order:

| Step | Agent | Responsibility |
|------|-------|---------------|
| 1 | **Code Reviewer** | Analyses codebase, identifies files to change, writes implementation plan |
| 2 | **UX Designer** | Defines UI behaviour, component structure, user flow |
| 3 | **Developer** | Implements the feature following the plan |
| 4 | **QA Engineer** | Writes and runs tests, verifies acceptance criteria |
| 5 | **Code Reviewer** | Final review — checks quality, consistency, and completeness |

## Tracking Feature Status

Status values used in `feature-tracker.md`:

| Status | Meaning |
|--------|---------|
| `Planned` | Accepted, not yet started |
| `In Progress` | Developer is building it |
| `In Review` | QA and final review underway |
| `Done` | Shipped and verified |
| `On Hold` | Paused — waiting on dependency or decision |
