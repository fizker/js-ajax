var fajax = (function() {
	/* Simple check to see if we are running node (used for the tests) */
	if(typeof(module) != 'undefined'
	&& module.exports
	&& typeof(exports) != 'undefined'
	) {
		module.exports = ajax
	}

	var defaults =
	    { method: 'GET'
	    , headers: {}
	    }
	  , orgDefaults = defaults
	  , defer

	ajax.defer = function(constr) {
		defer = constr
	}
	ajax.defaults = function(newDefaults) {
		normalizeHeaders(newDefaults)
		defaults = merge(defaults, newDefaults)
		if(defaults.accept) {
			defaults.headers.Accept = defaults.accept
			delete defaults.accept
		}
	}
	ajax.reset = function() {
		defaults = orgDefaults
		defer = null
	}

	return ajax

	function ajax(/*...args*/) {
		var args = Array.prototype.slice.call(arguments)
		var request = new XMLHttpRequest()
		  , addEventListener = 'addEventListener'
		  , opts = defaults
		  , arg
		while(arg = args.shift()) {
			if(typeof(arg) == 'string') {
				opts.url = arg
			} else if(typeof(arg) == 'function') {
				opts.onload = arg
			} else {
				opts = merge(opts, arg)
			}
		}
		normalizeHeaders(opts)
		if(request[addEventListener]) {
			request[addEventListener]('load', success)
		} else {
			/* Fuck IE8- */
			request.onreadystatechange = function() {
				if(request.readyState == 4) {
					success(request)
				}
			}
		}
		if(opts.accept) {
			opts.headers.Accept = opts.accept
		}
		for(var key in opts.headers) {
			request.setRequestHeader(key, opts.headers[key])
		}
		request.open(opts.method.toUpperCase(), opts.url, true, null, null)
		request.send()

		var ret = { request: request }
		  , deferred
		if(defer) {
			deferred = defer()
			ret.promise = deferred.promise
		} else if(typeof(Q) != 'undefined') {
			deferred = Q.defer()
			ret.promise = deferred.promise
		} else if(typeof(jQuery) != 'undefined') {
			deferred = new jQuery.Deferred
			ret.promise = deferred.promise()
		}
		return ret

		function success(req) {
			var res = req.target || req
			  , body = res.responseText
			if(res.getResponseHeader('content-type') == 'application/json') {
				body = JSON.parse(body)
			}
			res.body = body
			if(opts.onload) {
				opts.onload(res)
			}
			if(deferred) {
				deferred.resolve(res)
			}
		}
	}

	function merge(/*...args*/) {
		var args = Array.prototype.slice.call(arguments)
		  , ret = {}
		for(var i = 0, l = args.length; i < l; i++) {
			var a = args[i]
			for(var key in a) {
				ret[key] = a[key]
			}
		}
		return ret
	}

	function normalizeHeaders(opts) {
		var newHeaders = {}
		  , headers = opts.headers || {}
		for(var key in headers) {
			var transformedKey = transformKey(key)
			newHeaders[transformedKey] = headers[key]
		}
		opts.headers = newHeaders
	}

	function transformKey(key) {
		return key.toLowerCase().replace(/(^|-)([a-z])/g, function(entireString, firstMatch, secondMatch) {
			return firstMatch + secondMatch.toUpperCase()
		})
	}
})()
