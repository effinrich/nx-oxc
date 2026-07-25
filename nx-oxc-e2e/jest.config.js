module.exports = {
  displayName: 'nx-oxc-e2e',
  preset: '../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/nx-oxc-e2e',
  globalSetup: '<rootDir>/../tools/scripts/start-local-registry.ts',
  globalTeardown: '<rootDir>/../tools/scripts/stop-local-registry.ts'
};
