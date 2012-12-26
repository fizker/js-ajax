describe('unit/ajax.js', function() {
	var fajax
	before(function() {
		global.XMLHttpRequest = require('../helpers/XMLHttpRequest')
		fajax = require('../../src/ajax')
	})
	after(function() {
		delete global.XMLHttpRequest
	})

	describe('When calling `fajax(opts)`', function() {
		var instance
		  , callback
		before(function() {
			XMLHttpRequest._reset()
			callback = sinon.fake()

			var opts =
			    { onload: callback
			    , url: 'abc'
			    }
			fajax(opts)
			instance = XMLHttpRequest._instances[0]
		})
		it('should properly assign the url and onload options', function() {
			expect(instance.open).to.have.been.calledWith('GET', 'abc')
		})
	})

	describe('When calling with `fajax(url, callback)`', function() {
		var instance
		  , callback
		before(function() {
			XMLHttpRequest._reset()
			callback = sinon.fake()
			fajax('abc', callback)
			instance = XMLHttpRequest._instances[0]
		})
		it('should create a new XMLHttpRequest', function() {
			expect(XMLHttpRequest._instances).to.have.property('length', 1)
		})
		it('should execute open on the XMLHttpRequest', function() {
			expect(instance.open)
				.to.have.been.calledWith('GET', 'abc', true, null, null)
		})
		it('should listen to the proper events', function() {
			expect(instance.addEventListener)
				.to.have.been.calledWith('load')
				.and.to.have.been.calledWith('error')
				.and.to.have.been.calledWith('progress')
		})
		describe('and data is loaded', function() {
			it('should call the callback', function() {
				var fakeEvent = {}
				instance._emitter.emit('load', fakeEvent)
				expect(callback).to.have.been.calledWith(fakeEvent)
			})
		})
	})
})
