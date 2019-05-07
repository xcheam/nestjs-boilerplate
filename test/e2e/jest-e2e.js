const baseJestConfig = require('../../jest.config')

module.exports = Object.assign(
  {},
  baseJestConfig,
  {
    "testMatch": [
      "**/*.e2e-spec.ts"
    ],
    "collectCoverageFrom": [
      "src/**/*.ts"
    ],
    "setupFiles": [
      "../setup.js"
    ]   
  }
)
