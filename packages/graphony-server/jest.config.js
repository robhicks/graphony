/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  displayName: 'node',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.test.js'],
  transform: {
    "^.+\\.js$": "esbuild-jest"
  }
};
