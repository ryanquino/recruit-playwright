const fs = require('fs');
const xml2js = require('xml2js');

async function mergeReports() {
  try {
    if (!fs.existsSync('./backup-reports/junit-report-original.xml')) {
      console.log('Original report not found, skipping merge');
      return;
    }
    
    if (!fs.existsSync('./test-results/junit-report.xml')) {
      console.log('Rerun report not found, skipping merge');
      return;
    }
    
    console.log('Merging JUnit reports...');
    
    const parser = new xml2js.Parser();
    const builder = new xml2js.Builder();
    
    const originalXml = fs.readFileSync('./backup-reports/junit-report-original.xml', 'utf8');
    const rerunXml = fs.readFileSync('./test-results/junit-report.xml', 'utf8');
    
    const originalData = await parser.parseStringPromise(originalXml);
    const rerunData = await parser.parseStringPromise(rerunXml);
    
    let originalTestsuites = originalData.testsuites?.testsuite || [];
    let rerunTestsuites = rerunData.testsuites?.testsuite || [];
    
    if (!Array.isArray(originalTestsuites)) originalTestsuites = [originalTestsuites];
    if (!Array.isArray(rerunTestsuites)) rerunTestsuites = [rerunTestsuites];
    
    const rerunTestMap = new Map();
    rerunTestsuites.forEach((suite) => {
      let testcases = suite.testcase || [];
      if (!Array.isArray(testcases)) testcases = [testcases];
      
      testcases.forEach(testcase => {
        const testName = testcase.$.name;
        const testClass = testcase.$.classname;
        const fullTestName = testClass + ' › ' + testName;
        rerunTestMap.set(fullTestName, testcase);
      });
    });
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    
    for (let i = 0; i < originalTestsuites.length; i++) {
      const originalSuite = originalTestsuites[i];
      
      let originalTestcases = originalSuite.testcase || [];
      if (!Array.isArray(originalTestcases)) originalTestcases = [originalTestcases];
      
      const mergedTestcases = originalTestcases.map(testcase => {
        const testName = testcase.$.name;
        const testClass = testcase.$.classname;
        const fullTestName = testClass + ' › ' + testName;
        
        const rerunResult = rerunTestMap.get(fullTestName);
        return rerunResult || testcase;
      });
      
      const suitePassed = mergedTestcases.filter(tc => !tc.failure && !tc.error).length;
      const suiteFailed = mergedTestcases.filter(tc => tc.failure || tc.error).length;
      
      originalSuite.testcase = mergedTestcases.length === 1 ? mergedTestcases[0] : mergedTestcases;
      originalSuite.$.tests = mergedTestcases.length;
      originalSuite.$.failures = suiteFailed;
      originalSuite.$.errors = 0;
      
      totalTests += mergedTestcases.length;
      totalPassed += suitePassed;
      totalFailed += suiteFailed;
    }
    
    if (originalData.testsuites.$) {
      originalData.testsuites.$.tests = totalTests;
      originalData.testsuites.$.failures = totalFailed;
      originalData.testsuites.$.errors = 0;
    }
    
    const mergedXml = builder.buildObject(originalData);
    fs.writeFileSync('./test-results/junit-report.xml', mergedXml);
    
    console.log('JUnit reports merged successfully');
    console.log('Total tests:', totalTests, 'Passed:', totalPassed, 'Failed:', totalFailed);
    
  } catch (error) {
    console.error('Error merging reports:', error);
    process.exit(1);
  }
}

mergeReports();
