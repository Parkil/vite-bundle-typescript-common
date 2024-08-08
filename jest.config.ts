/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest'

const config: Config = {
  testEnvironment: "./FixJSDOMEnvironment.ts", // 기본값은 node jsdom 은 browser 와 비슷한 환경에서 테스트를 하고자 할때 사용
  collectCoverage: true, // Indicates whether the coverage information should be collected while executing the test
  coverageDirectory: "coverage", // The directory where Jest should output its coverage files
  coverageProvider: "v8", // Indicates which provider should be used to instrument code for coverage
  collectCoverageFrom: ["./src/impl_old/**/*", "./src/validation/**/*"], // test coverage 대상 패턴 지정
  coveragePathIgnorePatterns: ["index.ts", "type.ts"], // test coverage 에서 제외할 파일 / 패턴 지정
  watchAll: false, // 해당 패키지의 전체 파일을 coverage 대상으로 지정하는지 여부
  preset: "ts-jest",
  setupFiles: ["fake-indexeddb/auto"], // indexeddb 테스트를 위한 fake db 설정
  transform: { // the 'import.meta' meta-property is only allowed ~ 오류 대응
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    // Replicate as .env.local
                    VITE_LOG_SERVER_DOMAIN: 'http://localhost:3001',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
}

export default config
