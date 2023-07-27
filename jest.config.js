/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts',
  ]
  ,
  collectCoverage: false,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests",
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
  clearMocks: true

};

export default config;
