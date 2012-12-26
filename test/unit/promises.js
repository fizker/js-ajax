describe('unit/promises.js', function() {
	var fajax
	  , Response = require('../helpers/Response')
	  , Q = require('q')
	before(function() {
		global.XMLHttpRequest = require('../helpers/XMLHttpRequest')
		fajax = require('../../src/ajax')
	})
	after(function() {
		delete global.XMLHttpRequest
	})

	describe('When `fajax.defer` is called', function() {
		before(function() {
			fajax.defer(Q.defer)
		})
		after(function() {
			fajax.reset()
		})
		it('should use that promise-version', function() {
			var promise = fajax('abc').promise
			expect(promise).to.have.property('then')
		})
		it('should resolve the promise when a response is given', function() {
			var ret = fajax('abc')
			  , promise = ret.promise
			  , request = ret.request
			request._load()
			return expect(promise.then(function() { return 'was called' }))
				.to.eventually.equal('was called')
		})
	})
	describe('When Q is included', function() {
		before(function() {
			global.Q = Q
		})
		after(function() {
			delete global.Q
		})
		it('should use that promise-version', function() {
			var promise = fajax('abc').promise
			expect(promise).to.have.property('then')
		})
		it('should resolve the promise when a response is given', function() {
			var ret = fajax('abc')
			  , promise = ret.promise
			  , request = ret.request
			request._load()
			return expect(promise.then(function() { return 'was called' }))
				.to.eventually.equal('was called')
		})
	})
	describe('When jQuery is included', function() {
		before(function() {
			global.jQuery = jQuery
			function jQuery() {}

			jQuery.Deferred = Deferred
			function Deferred() {
				var deferred = Q.defer()
				  , orgPromise = deferred.promise
				deferred.promise = function() { return orgPromise }
				return deferred
			}
		})
		after(function() {
			delete global.jQuery
		})
		it('should use that promise-version', function() {
			var promise = fajax('abc').promise
			expect(promise).to.have.property('then')
		})
		it('should resolve the promise when a response is given', function() {
			var ret = fajax('abc')
			  , promise = ret.promise
			  , request = ret.request
			request._load()
			return expect(promise.then(function() { return 'was called' }))
				.to.eventually.equal('was called')
		})
	})
})
