# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests (all browsers)
npx playwright test

# Run tests in a single browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

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

**Browsers:** Chromium, Firefox, and WebKit run in parallel by default (`fullyParallel: true`). CI enforces single-worker and 2 retries.

**Inspection scripts** (`inspect-modal.js`, `tmp-inspect-*.js`) are standalone Node scripts used to probe live DOM during test development — they use the bare `playwright` API (not `@playwright/test`) and are not picked up by the test runner.
