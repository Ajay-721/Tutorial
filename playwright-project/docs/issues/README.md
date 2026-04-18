# Issues — How This Works

## Issue Numbering

Issues are numbered sequentially starting from 001:

```
ISSUE-001
ISSUE-002
ISSUE-003
```

Always 3 digits with leading zeros. Never reuse a number. The next number is determined by counting rows in `issue-tracker.md`.

## File Naming Convention

Each issue gets its own document file:

```
docs/issues/ISSUE-001-short-title.md
docs/issues/ISSUE-002-short-title.md
```

Use kebab-case for the short title. Keep it brief (3–5 words).

## Agent Log Files

Each issue document contains logs from the 3-agent workflow:

| Section | What it contains |
|---------|-----------------|
| **Code Reviewer log** | Root cause analysis, files identified, plan of action |
| **Developer log** | Changes made, files edited, approach taken |
| **QA log** | Tests run, pass/fail results, edge cases checked |

## Tracking Issue Status

Status values used in `issue-tracker.md`:

| Status | Meaning |
|--------|---------|
| `Open` | Reported, not yet started |
| `In Progress` | Developer is working on it |
| `In Review` | QA is testing it |
| `Done` | Fixed and verified |
| `Closed` | Won't fix or duplicate |
