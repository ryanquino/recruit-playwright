// @ts-check
const { test, expect } = require('../fixtures/job-list-ats-posting-fixture');
const RssFeedPage = require('../../pages/jobs/rss-feed.page');

// Reconciles the CX job list against the ATS, which is the source of truth for
// what is posted where. Every other job-list check in this suite compares CX
// to CX — the OpenSearch enabled/disabled parity suite compares two hosts, and
// [SM-01]/[RS-01] compare a portal against its own sitemap/feed. All of those
// are symmetric: if the index is wrong, both sides are wrong together and the
// comparison still passes. This is the only check that asks something outside
// CX whether a job belongs on the portal at all.
//
// DIRECTION: CX -> ATS only. For each sampled job the portal is showing, the
// ATS must agree it is posted there. That catches a stale index still
// advertising a job the ATS has pulled — the class behind the 264k monthly
// dead-link hits, and behind [SM-01]'s three days of an empty sitemap.
//
// The other direction (a job the ATS posts to the portal but CX never shows)
// is the more valuable half and is NOT covered here: Job Tracking has no
// career-site filter, so enumerating "jobs targeting portal X" out of 1600+
// means opening all 1600. Closing that needs a per-portal job source — the CX
// Admin is the obvious candidate — not more test code.
//
// SAMPLED, not exhaustive: the first N jobs the portal lists, because each one
// costs an ATS page load. Deterministic rather than random so a failure is
// reproducible; the trade-off is that it only ever exercises the head of the
// list, and a stale entry further down goes unseen. That is an accepted limit
// of a smoke-budget check, not an oversight — a full sweep belongs in its own
// opt-in project alongside rss-freshness.
test.describe('Job List — ATS posting reconciliation', () => {
    test('[C31349] Jobs shown on the career portal are still posted to it in the ATS', { tag: '@smoke' }, async ({ jobsListPage, atsJobDetailsPage, jobListAtsPostingData }) => {
        test.slow();
        const { portalCode, portalName, sampleSize } = jobListAtsPostingData;

        const cards = await jobsListPage.getAllResultCardsAcrossPages();
        expect(cards.length, `no jobs on ${portalName} to reconcile — the portal is empty or the index is unreachable`).toBeGreaterThan(0);

        const sample = cards
            .map(card => ({ title: card.title, jobId: RssFeedPage.extractJobId(card.href) }))
            .filter(job => job.jobId)
            .slice(0, sampleSize);
        expect(sample.length, 'no job ids could be parsed from the portal job links').toBeGreaterThan(0);

        // One login for the whole sample; getCareerSitePortalCodes() then
        // drives the same page from job to job.
        await atsJobDetailsPage.goToAtsAndLogin();

        const notPosted = [];
        for (const job of sample) {
            const portalCodes = await atsJobDetailsPage.getCareerSitePortalCodes(job.jobId);
            if (!portalCodes.includes(portalCode)) {
                notPosted.push(
                    `${job.jobId} "${job.title}" — ATS lists ${portalCodes.length ? portalCodes.join(', ') : 'no career sites'}`
                );
            }
        }

        expect(
            notPosted,
            `${notPosted.length} of ${sample.length} sampled jobs are shown on ${portalName} but the ATS does not post them there:\n  ${notPosted.join('\n  ')}`
        ).toEqual([]);
    });
});
