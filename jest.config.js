/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom', // Use Node.js environment
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Use Babel for JS/TS files
  },
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
};
