export default {
  moduleFileExtensions: ["ts", "js", "json"],
  rootDir: "src",
  testRegex: ".spec.ts",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  // setupFiles: [],
};
