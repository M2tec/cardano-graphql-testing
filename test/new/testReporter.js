import fs from "fs";

export default class AddressTimeReporter {
  onTestResult(test, testResult) {
    const results = testResult.testResults.map(r => ({
      address: r.fullName.match(/addr_[\w]+/g)?.[0] ?? "unknown",
      time: r.duration // in ms
    }));

    const path = "test-results.json";

    let existing = [];
    if (fs.existsSync(path)) {
      existing = JSON.parse(fs.readFileSync(path, "utf8"));
    }

    fs.writeFileSync(path, JSON.stringify([...existing, ...results], null, 2));
  }
}
