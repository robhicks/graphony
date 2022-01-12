/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  projects: [
    {
      clearMocks: true,
      collectCoverage: true,
      coverageDirectory: "coverage",
      displayName: 'dom',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/*.test.js'],
      transform: {
        "^.+\\.js$": "esbuild-jest"
      }
    },
    {
      clearMocks: true,
      collectCoverage: true,
      coverageDirectory: "coverage",
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/*.test.node.js'],
      transform: {
        "^.+\\.js$": "esbuild-jest"
      }
    }
  ],
};
