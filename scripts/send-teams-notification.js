const fs = require('fs');
const xml2js = require('xml2js');
const https = require('https');

// Get dynamic info from GitHub Actions
const status = process.env.TEST_STATUS || 'unknown';
const triggeredBy = process.env.GITHUB_ACTOR || 'Unknown';
const runLink = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
const environment = process.env.ENVIRONMENT || 'Unknown';
const projectName = process.env.PROJECT_NAME || 'Playwright';
const webhookUrl = process.env.TEAMS_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('❌ TEAMS_WEBHOOK_URL is not set');
  process.exit(1);
}

// Read and parse JUnit XML
let xml;
try {
  xml = fs.readFileSync('test-results/junit-report.xml', 'utf-8');
} catch (error) {
  console.error('❌ JUnit report file not found:', error.message);
  process.exit(1);
}

xml2js.parseString(xml, (err, result) => {
  if (err) {
    console.error('❌ Failed to parse JUnit report:', err);
    process.exit(1);
  }

  const suites = result.testsuites.testsuite;
  let totalTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  let failedTestsList = [];

  if (!suites || (!Array.isArray(suites) && typeof suites !== 'object')) {
    console.error('❌ Invalid JUnit report structure: testsuites.testsuite is missing or invalid');
    process.exit(1);
  }

  const suitesArray = Array.isArray(suites) ? suites : [suites];

  // Iterate through each suite and accumulate the test counts
  suitesArray.forEach((suite) => {
    const suiteAttrs = suite.$;
    totalTests += parseInt(suiteAttrs.tests, 10);
    failedTests += parseInt(suiteAttrs.failures, 10);
    skippedTests += parseInt(suiteAttrs.skipped || 0, 10);

    // Collect names of failed tests
    if (suite.testcase) {
      suite.testcase.forEach((test) => {
        if (test.failure) {
          const name = test.$.name;
          const classname = test.$.classname;
          failedTestsList.push(`${classname} › ${name}`);
        }
      });
    }
  });

  const passedTests = totalTests - failedTests - skippedTests;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  // Determine color based on status
  const statusEmoji = status === 'success' ? '✅' : '❌';

  // Build failed tests section
  let failedTestsSection = [];
  if (failedTestsList.length > 0) {
    failedTestsSection = [
      {
        type: 'TextBlock',
        text: '**Failed Tests:**',
        weight: 'Bolder',
        size: 'Medium',
        spacing: 'Medium'
      },
      {
        type: 'TextBlock',
        text: failedTestsList.slice(0, 10).join('\n\n'),
        wrap: true,
        spacing: 'Small'
      }
    ];
    
    if (failedTestsList.length > 10) {
      failedTestsSection.push({
        type: 'TextBlock',
        text: `_...and ${failedTestsList.length - 10} more failed tests_`,
        isSubtle: true,
        spacing: 'Small'
      });
    }
  }

  // Build Adaptive Card payload
  const card = {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'Container',
              style: status === 'success' ? 'good' : 'attention',
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'TextBlock',
                          text: statusEmoji,
                          size: 'ExtraLarge'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'TextBlock',
                          text: `${projectName} Test Results`,
                          weight: 'Bolder',
                          size: 'Large'
                        },
                        {
                          type: 'TextBlock',
                          text: `Status: **${status.toUpperCase()}**`,
                          spacing: 'None'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'FactSet',
              facts: [
                {
                  title: '🌐 Environment:',
                  value: environment
                },
                {
                  title: '👤 Triggered by:',
                  value: triggeredBy
                }
              ],
              spacing: 'Medium'
            },
            {
              type: 'Container',
              style: 'emphasis',
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'TextBlock',
                          text: '📊 Test Summary',
                          weight: 'Bolder',
                          size: 'Medium'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'TextBlock',
                          text: `${passRate}% Pass Rate`,
                          weight: 'Bolder',
                          color: status === 'success' ? 'Good' : 'Attention'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'TextBlock',
                  text: `📝 Total Tests: ${totalTests}`,
                  spacing: 'Small'
                },
                {
                  type: 'TextBlock',
                  text: `✅ Passed: ${passedTests}`,
                  spacing: 'Small'
                },
                {
                  type: 'TextBlock',
                  text: `❌ Failed: ${failedTests}`,
                  spacing: 'Small'
                },
                {
                  type: 'TextBlock',
                  text: `⏭️ Skipped: ${skippedTests}`,
                  spacing: 'Small'
                }
              ],
              spacing: 'Medium'
            },
            ...failedTestsSection
          ],
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'View Full Report',
              url: runLink
            }
          ]
        }
      }
    ]
  };

  // Send to Teams webhook
  const payload = JSON.stringify(card);
  const url = new URL(webhookUrl);

  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log('✅ Teams notification sent successfully');
      } else {
        console.error(`❌ Teams notification failed with status ${res.statusCode}: ${data}`);
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error sending Teams notification:', error);
    process.exit(1);
  });

  req.write(payload);
  req.end();
});
