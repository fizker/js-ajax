describe('unit/ajax.js', function() {
	var fajax
	before(function() {
		global.XMLHttpRequest = require('../helpers/XMLHttpRequest')
		fajax = require('../../src/ajax')
	})
	after(function() {
		delete global.XMLHttpRequest
	})

	describe('When calling `fajax(url, callback)`', function() {
		before(function() {
			var callback = function() {}
			fajax('abc', callback)
		})
		it('should create a new XMLHttpRequest', function() {
			expect(XMLHttpRequest._instances).to.have.property('length', 1)
		})
		it('should execute open on the XMLHttpRequest', function() {
			expect(XMLHttpRequest._instances[0].open)
				.to.have.been.calledWith('abc')
		})
	})
})
