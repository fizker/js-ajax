require('mocha-as-promised')()
global.chai = require('chai')
global.expect = chai.expect
chai.use(require('chai-as-promised'))
require('./helpers/chai').addMethods(chai)
