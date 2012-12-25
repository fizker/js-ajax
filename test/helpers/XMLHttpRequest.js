module.exports = XMLHttpRequest

function XMLHttpRequest() {
	XMLHttpRequest._instances.push(this)
	sinon.fake(this, 'open')
	sinon.fake(this, 'setRequestHeader').andCallThrough
}

XMLHttpRequest._instances = []
XMLHttpRequest._reset = function reset() {
	XMLHttpRequest._instances = []
}

XMLHttpRequest.prototype =
{ open: open
, setRequestHeader: setRequestHeader
, _headers: {}
}

function open(method, url, async, user, password) {
}

function setRequestHeader(header, value) {
	this._headers[header] = value
}
