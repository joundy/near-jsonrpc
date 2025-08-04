/** @type {import("jest").Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  rootDir: "./",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    '^.+\.(js|jsx|mjs)$': 'babel-jest'
  },
  // Transform all node_modules
  transformIgnorePatterns: [],
  // Add module name mapping for better ESM support
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/**/constants.ts",
    "!src/**/types.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!**/node_modules/**"
  ],
};