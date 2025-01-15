const { defineConfig } = require('cypress');
const dotenv = require('dotenv')
dotenv.config()

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.airalo.com/en', 
    env: {
      apiBaseUrl: 'https://sandbox-partners-api.airalo.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    reporter: 'cypress-mochawesome-reporter',
    setupNodeEvents(on, config) {
      // Node event listeners can be implemented here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
