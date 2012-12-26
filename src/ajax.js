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
		request.addEventListener('load', success)
		request.addEventListener('error', function() {})
		request.addEventListener('progress', function() {})
		request.open(opts.method, opts.url, true, null, null)
		request.send()
		return { request: request }

		function success(req) {
			var res = req.target
			  , body = res.response
			if(res.getResponseHeader('content-type') == 'application/json') {
				body = JSON.parse(body)
			}
			opts.onload(res, body)
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
