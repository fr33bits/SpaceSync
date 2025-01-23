/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest', // I added later when trying to fix setupDatabase.ts imports so that setUPDatabase() could be imported in test files
  testEnvironment: "node",
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};