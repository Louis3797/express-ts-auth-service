/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'text'],
  modulePathIgnorePatterns: [
    './dist',
    './coverage',
    './logs',
    './prisma',
    './assets',
    './node_modules',
    'index.ts',
    'app.ts',
    'src/validations', // no need for testing validations
    'src/routes'
  ],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json'
      }
    ]
  }
};
