const { test, expect } = require('../fixtures/candidates-fixture');
const RecycleBinPage = require('../../pages/candidates/recycle-bin.page');

test.describe('Candidate Resume Profile Tests', () => {
    test('[C15993] Contact ROSI Outreach test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.ROSITestCandidate);
        await candidateResumeProfilePage.contactROSIOutreach(candidateResumeProfileData.ROSIJobPosting);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.sendEmailSuccessAlert);
    });

    test('[C330] Add Comment test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.addComment(candidateResumeProfileData.comment);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.addCommentSuccessAlert);
    });

    test('[C13692] Send Email test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.sendEmail(candidateResumeProfileData.sendEmailTemplate);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.sendEmailSuccessAlert);
    });

    test('[C336] Employee Profile test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.employeeProfile(candidateResumeProfileData);
        await expect(candidateResumeProfilePage.getLabeledFieldLocator('Department')).toHaveText(candidateResumeProfileData.employeeProfileDepartment);
        await expect(candidateResumeProfilePage.getLabeledFieldLocator('Supervisor')).toHaveText(candidateResumeProfileData.employeeProfileSupervisor);
        await expect(candidateResumeProfilePage.getLabeledFieldLocator('Position Title')).toHaveText(candidateResumeProfileData.employeeProfilePositionTitle);
        await expect(candidateResumeProfilePage.getLabeledFieldLocator('Phone Number')).toHaveText(candidateResumeProfileData.employeeProfileWorkPhoneNo);
        await expect(candidateResumeProfilePage.getLabeledFieldLocator('Location')).toHaveText(candidateResumeProfileData.employeeProfileLocation);
    });

    test('[C339] Evaluation Ranking test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.evaluationRanking(candidateResumeProfileData.score);
        const score = await candidateResumeProfilePage.getRankingScoreValue();
        expect(score).toBe(candidateResumeProfileData.averageEvaluationRanking);
    });

    test('[C337] EEO Profile test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.eeoProfile(candidateResumeProfileData.score);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.eeoProfileSuccessAlert);
    });
});

test.describe.serial('Request and Complete Review', () => {
    test('[C331] Request Review test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.requestReview(candidateResumeProfileData.internalRecipient, candidateResumeProfileData.emailSubject);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.requestReviewSuccessAlert);
    });

    test('[C85566] Complete Review test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.candidateName);
        await candidateResumeProfilePage.completeReview(candidateResumeProfileData.comment);
        await expect(await candidateResumeProfilePage.isCompleteReviewButtonExist()).toBe(false);
    });
});

test.describe.serial('Create new Profile and Delete', () => {
    test('[C335] Change Job test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        const recycleBinPage = new RecycleBinPage(candidateResumeProfilePage.page);
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.changeJobCandidateName);
        await candidateResumeProfilePage.changeJob(candidateResumeProfileData.associateWithJobPosting);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.changeJobSuccessAlert);
        await candidateResumeProfilePage.deleteThisProfile(candidateResumeProfileData.changeJobTestJob);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.changeJobCandidateName + candidateResumeProfileData.deleteThisProfileSuccessAlert);
        await recycleBinPage.restore();
        await expect(await recycleBinPage.successToaster).toBeVisible();
    });
    
    test('[C334] Create New Profile test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
         const recycleBinPage = new RecycleBinPage(candidateResumeProfilePage.page);
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.newProfileCandidateName);
        await candidateResumeProfilePage.createNewProfile(candidateResumeProfileData.associateWithJobPosting);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.createNewProfileSuccessAlert);
        await candidateResumeProfilePage.deleteThisProfile(candidateResumeProfileData.changeJobTestJob);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.newProfileCandidateName + candidateResumeProfileData.deleteThisProfileSuccessAlert);
        await recycleBinPage.restore();
        await expect(await recycleBinPage.successToaster).toBeVisible();
    });

    test('[C345] Delete this Profile test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        const recycleBinPage = new RecycleBinPage(candidateResumeProfilePage.page);
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.newProfileCandidateName);
        await candidateResumeProfilePage.deleteThisProfile(candidateResumeProfileData.associateWithJobPosting);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.newProfileCandidateName + candidateResumeProfileData.deleteThisProfileSuccessAlert);
    }); 
});

test.describe.serial('Change and Remove Disposition tests', () => {
    test('[C342] Change Disposition test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.dispositionCandidateName);
        await candidateResumeProfilePage.changeDisposition(candidateResumeProfileData.disposition);
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.dispositionSuccessAlert);
        const dispositionValue = await candidateResumeProfilePage.getDispositionValue();
        await expect(dispositionValue).toBe(candidateResumeProfileData.disposition);
    });
    
    test('[C344] Remove Disposition test', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.dispositionCandidateName);
        await candidateResumeProfilePage.removeDisposition();
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.removeDispositionSuccessAlert);
    });
});

test.describe.serial('Change Hiring Stage', () => {
    test('[C117815] Hiring Stage - Without Job Association', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageNoJobCandidate);
        await expect(candidateResumeProfilePage.hiringStageDropdown).not.toBeVisible();
    });

    const hiringStageTests = [
        { id: 'C318', name: '3rd Party Sourced', group: 'Preliminary Stages' },
        { id: 'C319', name: 'Internet Applicant', group: 'Preliminary Stages' },
        { id: 'C320', name: 'Uploaded Candidates', group: 'Preliminary Stages' },
        { id: 'C321', name: 'Resume Review', group: 'Hiring Stages' },
        { id: 'C322', name: 'Interviewing', group: 'Hiring Stages' },
        { id: 'C117816', name: 'Talent Pool (consider for future)', group: 'Shared Stages' },
        { id: 'C117817', name: 'Talent Community', group: 'Shared Stages' },
        { id: 'C117818', name: 'Archives (do not consider)', group: 'Shared Stages' },
    ];

    for (const { id, name, group } of hiringStageTests) {
        test(`[${id}] ${group} - ${name} test`, async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
            await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageCandidate);
            await candidateResumeProfilePage.changeHiringStage(name);
            await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.hiringStageSuccessAlert);
        });
    }

    test('[C323] Hiring Stage - Offer Approval', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageCandidate);
        await candidateResumeProfilePage.changeHiringStageOfferApproval(candidateResumeProfileData.offerExpectedStartData, candidateResumeProfileData.offerSalaryAgreementField, candidateResumeProfileData.offerCityField, candidateResumeProfileData.offerPositionLocation, candidateResumeProfileData.offerApproverName, candidateResumeProfileData.hiringStageCandidate);
        await candidateResumeProfilePage.acceptOffer();
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageCandidate);
        await expect(candidateResumeProfilePage.getHiringStageDropdownValue()).toHaveText('Offer Approval');

    });

    const offerStagesTest = [
        { id: 'C324', name: 'Offer Extended', group: 'Offer Stages' },
        { id: 'C325', name: 'Background Screening', group: 'Offer Stages' },
    ];

    for (const { id, name, group } of offerStagesTest) {
        test(`[${id}] ${group} - ${name} test`, async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
            await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageCandidate);
            await candidateResumeProfilePage.changeHiringStage(name);
            await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.hiringStageSuccessAlert);
        });
    }

    test('[C326] Hiring Stage - Hired', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageCandidate);
        await candidateResumeProfilePage.changeHiringStageToHired();
        await expect(candidateResumeProfilePage.hiredStageLabel).toHaveText('Hired');
    });

    test('[C327] Hiring Stage - Offer Declined', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.hiringStageCandidate);
        await candidateResumeProfilePage.changeHiringStage('Offer Declined');
        await expect(candidateResumeProfilePage.successAlert).toHaveText(candidateResumeProfileData.hiringStageSuccessAlert);
    });
});

test.describe.serial('Candidate Resume Tabs tests', () => {
    test('[C301] View Summary Tab', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await expect(candidateResumeProfilePage.resumeSummaryTab).toHaveAttribute('aria-selected', 'true');
    });

    test('[C300] Edit Summary Tab', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await candidateResumeProfilePage.editSummaryResume(candidateResumeProfileData.summary);
        await expect(candidateResumeProfilePage.getSummaryLocators('Skill Set')).toContainText(candidateResumeProfileData.summary.skillSet);
        await expect(candidateResumeProfilePage.getSummaryLocators('College majors')).toContainText(candidateResumeProfileData.summary.universityDegree);
        await expect(candidateResumeProfilePage.getSummaryLocators('Certificates')).toContainText(candidateResumeProfileData.summary.professionalCertifications);
        await expect(candidateResumeProfilePage.getSummaryLocators('Current job type')).toContainText('Full-Time/Regular');
        await expect(candidateResumeProfilePage.getSummaryLocators('Desired job type')).toContainText('Full-Time/Regular');
        await expect(candidateResumeProfilePage.getSummaryLocators('Career level')).toContainText('Executive');
        await expect(candidateResumeProfilePage.getSummaryLocators('Willing to relocate?')).toContainText(candidateResumeProfileData.summary.relocationWillingness);
        await expect(candidateResumeProfilePage.getSummaryLocators('Salary requirements')).toContainText(candidateResumeProfileData.summary.salaryRequirement);
        await expect(candidateResumeProfilePage.getSummaryLocators('Years experience')).toContainText(candidateResumeProfileData.summary.yearsOfExperience);
    });

    test('[C303] View Resume/CV Tab', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await expect(await candidateResumeProfilePage.viewResumeCVTabContent()).toContainText(candidateResumeProfileData.resume.cvContent);
    });

    test('[C304] Edit Resume/CV Tab', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await candidateResumeProfilePage.editResumeCVTabContent(candidateResumeProfileData.resume.cvContent);
        await expect(await candidateResumeProfilePage.viewResumeCVTabContent()).toContainText(candidateResumeProfileData.resume.cvContent);
    });

    test('[C309] View activity status', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await candidateResumeProfilePage.updateActivityStatusTab(candidateResumeProfileData.activityStatus, 1);
        for (let i = 1; i <= 7; i++) {
            const values = await candidateResumeProfilePage.getActivityRowValues(i);
            expect(values.flagChecked).toBe(true);
            expect(values.initDate).toBe(candidateResumeProfileData.activityStatus.initiationDate);
            expect(values.compDate).toBe(candidateResumeProfileData.activityStatus.completedDate);
        }
    });

    test('[C310] Reset activity status', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await candidateResumeProfilePage.updateActivityStatusTab(candidateResumeProfileData.activityStatus, 0);
        for (let i = 1; i <= 7; i++) {
            const values = await candidateResumeProfilePage.getActivityRowValues(i);
            expect(values.flagChecked).toBe(false);
            expect(values.initDate).toBe('');
            expect(values.compDate).toBe('');
        }
    });

    test('[C307] Edit Evaluations Tab', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await candidateResumeProfilePage.editEvaluations(candidateResumeProfileData.score);
        const score = await candidateResumeProfilePage.getRankingScoreValue();
        expect(score).toBe(candidateResumeProfileData.averageEvaluationRanking);
    });

    test('[C308] View Evaluations Tab', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.resumeTabsCandidate);
        await candidateResumeProfilePage.viewEvaluationsTab();
        const score = await candidateResumeProfilePage.getRankingScoreValue();
        expect(score).toBe(candidateResumeProfileData.averageEvaluationRanking);
    });
});

test.describe.serial('Manage Notes', () => {
    test('[C92359] View Contact Notes - Link visibility and modal opening', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.notesTestCandidate);
        const isLinkVisibleAndClickable = await candidateResumeProfilePage.viewManageNotesLinkVisibility();
        await expect(isLinkVisibleAndClickable).toBe(true);
    });

    test('[C92360] View Contact Notes - Modal functionality in VIEW mode', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.notesTestCandidate);
        const isModalVisible = await candidateResumeProfilePage.isNotesModalVisible();
        await expect(isModalVisible).toBe(true);
        const isEmpty = await candidateResumeProfilePage.isNotesEmpty();
        await expect(isEmpty).toBe(true);
    });

    test('[C92362] View Contact Notes - Save and Cancel functionality', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.notesTestCandidate);
        await candidateResumeProfilePage.saveNotes(candidateResumeProfileData.notes);
        const isAlertVisible = await candidateResumeProfilePage.isUpdateAlertShown();
        await expect(isAlertVisible).toBe(true);
    });

    test('[C138831] Contact Notes - Datestamp on Note Input', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.notesTestCandidate);
        await candidateResumeProfilePage.saveNotes(candidateResumeProfileData.notes);
        await candidateResumeProfilePage.isUpdateAlertShown();

        const notesValue = await candidateResumeProfilePage.getNotesValue();
        expect(notesValue).toMatch(/^\[\d{2}-[A-Za-z]{3}-\d{4} \d{2}:\d{2}:\d{2}\] - /);
        expect(notesValue).toContain(candidateResumeProfileData.notes);
    });

    test('[C92361] View Contact Notes - EDIT mode functionality', async ({ candidateResumeProfilePage, candidateResumeProfileData }) => {
        await candidateResumeProfilePage.searchCandidateAndOpenCRP(candidateResumeProfileData.notesTestCandidate);
        await candidateResumeProfilePage.clearNotes();
        const isAlertVisible = await candidateResumeProfilePage.isUpdateAlertShown();
        await expect(isAlertVisible).toBe(true);
        const isEmpty = await candidateResumeProfilePage.isNotesEmpty();
        await expect(isEmpty).toBe(true);
    });

});