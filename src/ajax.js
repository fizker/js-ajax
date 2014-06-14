var fajax = (function() {
	/* Simple check to see if we are running node (used for the tests) */
	if(typeof(module) != 'undefined'
	&& module.exports
	&& typeof(exports) != 'undefined'
	) {
		module.exports = ajax
	}

	var merge = require('fmerge')

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

	ajax.request = function(method/*, ...args*/) {
		var args = Array.prototype.slice.call(arguments)
		var options = getOptions(args)
		options.method = method.toUpperCase()
		return this(options)
	}
	ajax.get = ajax.request.bind(ajax, 'GET')
	ajax.post = ajax.request.bind(ajax, 'POST')
	ajax.put = ajax.request.bind(ajax, 'PUT')
	ajax.del = ajax['delete'] = ajax.request.bind(ajax, 'DELETE')
	ajax.patch = ajax.request.bind(ajax, 'PATCH')
	ajax.options = ajax.request.bind(ajax, 'OPTIONS')
	ajax.head = ajax.request.bind(ajax, 'HEAD')

	return ajax

	function getOptions(args) {
		var opts = {}
		var arg
		while(arg = args.shift()) {
			if(typeof(arg) == 'string') {
				opts.url = arg
			} else if(typeof(arg) == 'function') {
				opts.onload = arg
			} else {
				opts = merge(opts, arg)
			}
		}
		return merge(defaults, opts)
	}

	function ajax(/*...args*/) {
		var args = Array.prototype.slice.call(arguments)
		var request = new XMLHttpRequest()
		var addEventListener = 'addEventListener'
		var opts = getOptions(args)

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

		if(opts.auth) {
			var auth = opts.auth
			opts.headers.Authorization = 'Basic '
				+ btoa(auth.username + ':' +  auth.password)
		}
		if(opts.accept) {
			opts.headers.Accept = opts.accept
		}
		for(var key in opts.headers) {
			request.setRequestHeader(key, opts.headers[key])
		}
		request.send(opts.body)

		var ret = { request: request }
		var deferred
		if(defer) {
			deferred = defer()
			ret.promise = deferred.promise
		} else if(typeof(Q) != 'undefined') {
			deferred = Q.defer()
			ret.promise = deferred.promise
		} else if(typeof(Promise) != 'undefined') {
			deferred = {
				resolve: function(ans) {
					deferred._ans = ans
				}
			}
			ret.promise = new Promise(function(resolve, reject) {
				deferred.resolve = resolve
				if(deferred._ans) {
					resolve(deferred._ans)
				}
			})
			deferred = function() {}
		} else if(typeof(jQuery) != 'undefined') {
			deferred = new jQuery.Deferred
			ret.promise = deferred.promise()
		}

		if(ret.promise) {
			ret.promise = ret.promise.then(function(xhr) {
				delete xhr.then
				return xhr
			})
			ret.then = ret.promise.then
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
			opts.method = 'POST'
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
