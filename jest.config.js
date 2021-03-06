module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  maxConcurrency: 1,
  forceExit: true,
};
