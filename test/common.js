global.chai = require('chai')
global.expect = chai.expect
chai.use(require('chai-as-promised'))

global.fzkes = require('fzkes')
chai.use(fzkes)

global.btoa = require('btoa')
