const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  testRegex: '.*\\.integration-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports/integration',
        outputName: `integration_log_${timestamp}.xml`,
      },
    ],
  ],
  globalTeardown: './teardown.ts',
};
