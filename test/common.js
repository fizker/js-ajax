global.chai = require('chai')
global.expect = chai.expect
chai.use(require('chai-as-promised'))

global.fzkes = require('fzkes')
chai.use(fzkes)

global.btoa = require('btoa')

global.Promise = require('es6-promise').Promise
