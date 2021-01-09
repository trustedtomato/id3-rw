// .eslintrc.js
module.exports = {
  extends: [
    'plugin:jest/recommended'
  ],
  plugins: [
    'jest'
  ],
  env: {
    jest: true
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  }
}
