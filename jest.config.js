module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 'context.ts', 'fixtures', 'utils'],
  globalSetup: '<rootDir>/node_modules/@databases/mysql-test/jest/globalSetup',
  globalTeardown: '<rootDir>/node_modules/@databases/mysql-test/jest/globalTeardown'
}
