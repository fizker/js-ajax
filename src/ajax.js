module.exports = ajax

var merge = require('fmerge')
var urlHelper = require('url')

var defaults = {
	method: 'GET',
	headers: {},
	baseUrl: '',
}
var orgDefaults = defaults
var qs
var contentTypes = {
	json: /^application\/json/
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

	var url = opts.url
	if(opts.baseUrl) {
		url = opts.baseUrl
		var endpointUrl = urlHelper.resolve(global.location.pathname, opts.url)

		if(endpointUrl[0] == '/' && endpointUrl[1] != '/') {
			endpointUrl = endpointUrl.slice(1)
		}
		url = urlHelper.resolve(url, endpointUrl)
	}

	request.open(opts.method.toUpperCase(), url, true, null, null)

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

	var deferred = {
		resolve: function(ans) {
			deferred._ans = ans
		}
	}
	var ret = new Promise(function(resolve, reject) {
		deferred.resolve = resolve
		if(deferred._ans) {
			resolve(deferred._ans)
		}
	}).then(function(xhr) {
		delete xhr.then
		if(xhr.status >= 400) throw xhr
		return xhr
	})

	ret.promise = ret
	ret.request = request
	ret.xhr = request

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
		deferred.resolve(res)
	}
}

function normalizeHeaders(opts) {
	var newHeaders = {}
	var headers = opts.headers || {}
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

	if(opts.json !== undefined) {
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
