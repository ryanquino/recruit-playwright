const { test: base, expect } = require('@playwright/test');

// Shared foundation for CX OpenSearch enabled/disabled parity tests.
// Kept separate from the existing single-host fixtures (job-list-fixture.js,
// etc.) because parity tests compare a response/behavior across two hosts
// within a single test, rather than being pre-navigated to one host by the
// fixture. Mirrors the pattern established on the (separate)
// automated-tests/rnd-21359-opensearch-parity branch, so theme-specific
// fixtures here (screener-questions-parity-fixture.js, etc.) stay consistent
// with that convention.
const ENABLED_BASE_URL = process.env.CX_BASE_URL || 'https://qa-recruiting-cx.silkroad-eng.com';
const DISABLED_BASE_URL = process.env.CX_TEST_BASE_URL || 'https://qa-recruiting-cx-test.silkroad-eng.com';

/** @type {import('@playwright/test').TestType<any, any>} */
const test = base.extend({
    openSearchEnabledBaseUrl: ENABLED_BASE_URL,
    openSearchDisabledBaseUrl: DISABLED_BASE_URL,
});

module.exports = { test, expect };
