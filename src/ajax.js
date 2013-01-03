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
	  , qs
	  , contentTypes =
	    { json: /^application\/json/
	    }

	ajax.defer = function(constr) {
		defer = constr
	}
	ajax.qs = function(func) {
		qs = func
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
		qs = null
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
		prepareBody(opts)
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
		request.open(opts.method.toUpperCase(), opts.url, true, null, null)
		if(opts.accept) {
			opts.headers.Accept = opts.accept
		}
		for(var key in opts.headers) {
			request.setRequestHeader(key, opts.headers[key])
		}
		request.send(opts.body)

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
			if(contentTypes.json.test(res.getResponseHeader('content-type'))) {
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

	function prepareBody(opts) {
		if(opts.form) {
			opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
			if(typeof(opts.form) != 'object') {
				opts.body = opts.form.toString()
				return
			}
			if(qs) {
				opts.body = qs(opts.form)
				return
			}
			opts.body = Object.keys(opts.form)
				.map(function(key) {
					var value = opts.form[key]
					if(typeof(value) == 'object' || value == null) {
						return null
					}
					return key + '=' + encodeURIComponent(value)
				})
				.filter(function(value) {
					return !!value
				})
				.join('&')
			return
		}
		if(opts.json) {
			opts.body = JSON.stringify(opts.json)
			opts.headers['Content-Type'] = 'application/json'
			return
		}
		if(opts.body && !opts.headers['Content-Type']) {
			opts.headers['Content-Type'] = 'text/plain; charset=utf-8'
			return
		}
	}

	function transformKey(key) {
		return key.toLowerCase().replace(/(^|-)([a-z])/g, function(entireString, firstMatch, secondMatch) {
			return firstMatch + secondMatch.toUpperCase()
		})
	}
})()
