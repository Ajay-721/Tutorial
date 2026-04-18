# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# DEFAULT — run tests (Chromium only)
npx playwright test --project=chromium

# Browser compatibility test (only when user requests it)
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=edge

# Run a single test file
npx playwright test tests/example.spec.js

# Run a single test by name
npx playwright test -g "login works"

# Run in headed mode (see the browser)
npx playwright test --headed

# Debug a test interactively
npx playwright test --debug

# Open HTML report after a run
npx playwright show-report

# Inspect page DOM (helper scripts, not test runner)
node inspect-modal.js
node tmp-inspect-login.js
```

## Architecture

**Target app:** `https://perfumy-api.onrender.com/` — a perfume e-commerce SPA. All tests run against this live URL (no local dev server).

**Test helpers in `tests/example.spec.js`:**
- `closeWelcomeModal(page)` — dismisses the `#welcome-modal` / `#welcome-modal-backdrop` that appears on every fresh page load. Must be called before most interactions.
- `login(page, email, password)` — clicks the Login button, fills the dialog, submits. Skips gracefully if already logged in.

**Test credentials:** `ramu@yopmail.com` / `Ramu@098` — shared test account used across all tests.

**Timeouts:** Global test timeout is 60 s, expect timeout is 60 s, navigation timeout is 60 s. The hosted app on Render can be slow to cold-start — these generous timeouts account for that.

**Browsers:** Always run tests on **Chromium only** by default. Only run multi-browser when the user explicitly asks for a browser compatibility test — in that order: Chrome → Firefox → WebKit → Edge.

```bash
# Default — always use this unless told otherwise
npx playwright test --project=chromium

# Browser compatibility test (only when user requests it)
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=edge
```

**Inspection scripts** (`inspect-modal.js`, `tmp-inspect-*.js`) are standalone Node scripts used to probe live DOM during test development — they use the bare `playwright` API (not `@playwright/test`) and are not picked up by the test runner.

## Bug Report Workflow

**Triggers:** `new bug` / `raise bug` / `report bug` / `I found a bug`

Do NOT start working immediately. Run this interview — ask **one question at a time**, wait for the answer before asking the next.

| # | Question | Stored as |
|---|----------|-----------|
| 1 | "What is the bug about? Describe it in one sentence." | `BUG_TITLE` |
| 2 | "What exactly happens that shouldn't happen? Tell me what you see." | `WHAT_HAPPENS` |
| 3 | "What should happen instead?" | `WHAT_SHOULD_HAPPEN` |
| 4 | "How can I reproduce this bug? Walk me through the steps." | `HOW_TO_REPRODUCE` |
| 5 | "Who is affected? 1. All users  2. Users who played more than one day  3. Admin only  4. Specific game category only  5. Not sure" | `AFFECTED_USERS` |
| 6 | "What is the priority? 1. Critical — app completely broken  2. High — core feature broken  3. Medium — annoying but app works  4. Low — minor issue" | `PRIORITY` |

After all answers are collected, show this summary and wait for confirmation:

```
Here is your bug report — shall I proceed?

Title: [BUG_TITLE]
Priority: [PRIORITY]
What happens: [WHAT_HAPPENS]
What should happen: [WHAT_SHOULD_HAPPEN]
Steps to reproduce: [HOW_TO_REPRODUCE]
Affected users: [AFFECTED_USERS]

Type YES to start the agents or type EDIT to change anything.
```

Only after the user types **YES**:
- Auto-assign next ISSUE-ID from `issue-tracker.md`
- Auto-generate branch name from BUG_TITLE (`fix/short-title-kebab-case`)
- Run the full 3-agent bug workflow

---

## Feature Request Workflow

**Triggers:** `new feature` / `add feature` / `feature request` / `I want to add`

Do NOT start working immediately. Run this interview — ask **one question at a time**, wait for the answer before asking the next.

| # | Question | Stored as |
|---|----------|-----------|
| 1 | "What feature do you want to add? Describe it in one or two sentences." | `FEATURE_TITLE` |
| 2 | "Who will use this feature? 1. Regular users  2. Admin only  3. Both" | `WHO` |
| 3 | "Why do we need this feature? What problem does it solve or what value does it add?" | `WHY` |
| 4 | "What should NOT be included in this feature right now? What are we leaving for later?" | `OUT_OF_SCOPE` |
| 5 | "What is the priority? 1. High — needed before next launch  2. Medium — important but not urgent  3. Low — nice to have" | `PRIORITY` |
| 6 | "Do you have any design or UX preference for how this should look or behave? Or type SKIP to let the UX agent decide." | `UX_NOTES` |

After all answers are collected, show this summary and wait for confirmation:

```
Here is your feature request — shall I proceed?

Title: [FEATURE_TITLE]
Who: [WHO]
Why: [WHY]
Priority: [PRIORITY]
Out of scope: [OUT_OF_SCOPE]
UX notes: [UX_NOTES]

Type YES to start the agents or type EDIT to change anything.
```

Only after the user types **YES**:
- Auto-assign next FEAT-ID from `feature-tracker.md`
- Auto-generate branch name from FEATURE_TITLE (`feature/short-title-kebab-case`)
- Run the full 5-agent feature workflow

---

## Issue and Feature Numbering

### 1. AUTO NUMBERING

Before creating any new issue or feature document, the agent must:

- Read `docs/issues/issue-tracker.md` and count existing data rows to get the next issue number
- Read `docs/features/feature-tracker.md` and count existing data rows to get the next feature number
- Use that number for ISSUE-ID or FEAT-ID
- Never ask the user for a number
- Never reuse an existing number

### 2. NUMBER FORMAT

```
Issues:   ISSUE-001, ISSUE-002, ISSUE-003...
Features: FEAT-001,  FEAT-002,  FEAT-003...
```

Always 3 digits with leading zeros.

### 3. BRANCH NAMING

Agent automatically generates the branch name from the title:

```
Bug:     fix/[short-title-kebab-case]
Feature: feature/[short-title-kebab-case]
```

Example: "Math Challenge repeats" → `fix/math-challenge-repeats`

Never ask the user for a branch name.

### 4. TRACKER UPDATE

After every completed issue or feature the agent **must** update the relevant tracker file automatically, adding a new row with all columns filled in:

`docs/issues/issue-tracker.md` — for bugs  
`docs/features/feature-tracker.md` — for features
