
export default {
  testEnvironment: "node",

  // collect coverage if you want
  collectCoverage: false,

  // reporter setup (keep default + your custom reporter)
  reporters: [
    "default",
    "./test/new/testReporter.js"
  ],

//   // handle TypeScript + ESM if needed
//   transform: {
//     "^.+\\.(t|j)sx?$": ["@swc/jest"],
//   },

  // optional: ignore build/dist files
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // increase timeout if queries are slow
  testTimeout: 30000
};

