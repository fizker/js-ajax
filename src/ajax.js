var fajax = (function() {
	if(typeof(module) != 'undefined'
	&& module.exports
	&& typeof(exports) != 'undefined'
	) {
		module.exports = ajax
	}

	var defaults =
	    { method: 'GET'
	    }
	  , orgDefaults = defaults
	  , defer

	ajax.defer = function(constr) {
		defer = constr
	}
	ajax.defaults = function(newDefaults) {
		defaults = merge(defaults, newDefaults)
	}
	ajax.reset = function() {
		defaults = orgDefaults
		defer = null
	}

	return ajax

	function ajax(/*...args*/) {
		var args = arguments
		var opts =
		      args.length == 1
		    ? args[0]
		    : { url: args[0]
		      , onload: args[1]
		      }
		  , opts = merge(defaults, opts)
		  , request = new XMLHttpRequest()
		request.addEventListener('load', success.bind(this))
		request.addEventListener('error', function() {})
		request.addEventListener('progress', function() {})
		request.open(opts.method.toUpperCase(), opts.url, true, null, null)
		request.send()

		var ret = { request: request }
		if(defer) {
			this.deferred = defer()
			ret.promise = this.deferred.promise
		} else if(typeof(Q) != 'undefined') {
			this.deferred = Q.defer()
			ret.promise = this.deferred.promise
		} else if(typeof(jQuery) != 'undefined') {
			this.deferred = new jQuery.Deferred
			ret.promise = this.deferred.promise()
		}
		return ret

		function success(req) {
			var res = req.target
			  , body = res.response
			if(res.getResponseHeader('content-type') == 'application/json') {
				body = JSON.parse(body)
			}
			res.body = body
			if(opts.onload) {
				opts.onload(res)
			}
			if(this.deferred) {
				this.deferred.resolve(res)
			}
		}
	}

	function merge(/*...args*/) {
		var args = Array.prototype.slice.call(arguments)
		return args.reduce(function(ret, a) {
			for(var key in a) {
				ret[key] = a[key]
			}
			return ret
		}, {})
	}
})()
