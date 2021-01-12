module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    dumpio: true
  },
  server: {
    command: 'webpack serve',
    port: 8080
  }
}
