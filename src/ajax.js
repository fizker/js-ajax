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
		  , addEventListener = 'addEventListener'
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
		debugger
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
})()
