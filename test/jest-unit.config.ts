const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);

export default {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  testRegex: '.*\\.unit-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports/unit',
        outputName: `unit_log_${timestamp}.xml`,
      },
    ],
  ],
  globalTeardown: './teardown.ts',
};
