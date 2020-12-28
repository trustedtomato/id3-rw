module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
  },
  server: {
    command: 'webpack serve',
    port: 8080
  },
}