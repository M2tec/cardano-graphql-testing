import fs from "fs";

const path = "./test-results.json";

// read the file
const raw = fs.readFileSync(path, "utf8");
const results = JSON.parse(raw);

// sort by time descending (slowest first)
results.sort((a, b) => b.time - a.time);

// print to console
console.table(results);

// overwrite file with sorted results (optional)
fs.writeFileSync(path, JSON.stringify(results, null, 2));

console.log(`✅ Results sorted by time (slowest → fastest) and saved back to ${path}`);
