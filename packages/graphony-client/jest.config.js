/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  displayName: 'dom',
  resetMocks: false,
  setupFiles: ["jest-localstorage-mock", "fake-indexeddb/auto"],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/*.test.js'],
  transform: {
    "^.+\\.js$": "esbuild-jest"
  }
};
