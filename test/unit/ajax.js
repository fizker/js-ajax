describe('unit/ajax.js', function() {
	var fajax
	  , Response = require('../helpers/Response')
	before(function() {
		global.XMLHttpRequest = require('../helpers/XMLHttpRequest')
		fajax = require('../../src/ajax')
	})
	after(function() {
		delete global.XMLHttpRequest
	})

	describe('When changing options', function() {
		it('should allow overriding defaults', function() {
			fajax.defaults({ method: 'abc' })
			var req = fajax('any url').request
			expect(req.open).to.have.been.calledWith('ABC')
			fajax.reset()
		})
		it('should send the new method blindly', function() {
			var prom = fajax({ method: 'abc', url: 'a' })
			  , req = prom.request
			expect(req.open).to.have.been.calledWith('ABC')
		})
	})

	describe('When response is type json', function() {
		var body
		before(function() {
			var prom = fajax('a', function(res) { body = res.body })
			  , request = prom.request
			request._load(new Response(
			{ headers: { 'Content-type': 'application/json' }
			, body: { a: 1, b: 2 }
			}))
		})
		it('should automatically parse it', function() {
			expect(body).to.deep.equal({ a: 1, b: 2 })
		})
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
			instance = fajax(opts).request
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
		it('should execute send on the XMLHttpRequest', function() {
			expect(instance.send)
				.to.have.been.called
		})
		it('should listen to the proper events', function() {
			expect(instance.addEventListener)
				.to.have.been.calledWith('load')
				.and.to.have.been.calledWith('error')
				.and.to.have.been.calledWith('progress')
		})
		describe('and data is loaded', function() {
			it('should call the callback', function() {
				var fakeEvent = new Response()
				instance._load(fakeEvent)
				expect(callback).to.have.been.calledWith(fakeEvent)
			})
		})
	})
})
