'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOSTNAME: JSON.stringify('http://127.0.0.1:3000'),
  DOMAIN_NAME: JSON.stringify('http://127.0.0.1:3000'),
})
