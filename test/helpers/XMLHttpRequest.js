module.exports = XMLHttpRequest

var EventEmitter = require('events').EventEmitter

function XMLHttpRequest() {
	XMLHttpRequest._instances.push(this)
	sinon.fake(this, 'open')
	sinon.fake(this, 'setRequestHeader')
	this._emitter = new EventEmitter
	this.addEventListener = this._emitter.on.bind(this._emitter)
	sinon.fake(this, 'addEventListener')
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
