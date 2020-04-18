'use strict'
module.exports = {
  NODE_ENV: '"production"',
  API_HOSTNAME: JSON.stringify(''),
  // blank string to indicate the use of relative api paths in production environment
  DOMAIN_NAME: JSON.stringify('https://drawsome.pictures'),
  // DOMAIN_NAME: JSON.stringify('http://127.0.0.1:3000'),
}
