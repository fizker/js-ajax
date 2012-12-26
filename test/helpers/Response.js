module.exports = function(opts) {
	return new Response(opts)
}

function Response(opts) {
	this.opts = opts || {}
	this.opts.headers = Object.keys(this.opts.headers||{})
		.reduce(function(headers, key) {
			headers[key.toLowerCase()] = this.opts.headers[key]
			return headers
		}.bind(this), {})
	this.status = this.opts.status || 200
	this.response = this.opts.body || 'OK'
	if(typeof(this.response) != 'string') {
		this.response = JSON.stringify(this.response)
	}
}

Response.prototype =
{ getResponseHeader: getResponseHeader
}

function getResponseHeader(header) {
	return this.opts.headers[header.toLowerCase()]
}
