module.exports = XMLHttpRequest

var EventEmitter = require('events').EventEmitter
  , Response = require('./Response')

function XMLHttpRequest() {
	XMLHttpRequest._instances.push(this)
	sinon.fake(this, 'open').callsOriginal()
	sinon.fake(this, 'send').callsOriginal()
	sinon.fake(this, 'setRequestHeader').callsOriginal()
	this._emitter = new EventEmitter
	this._emit = this._emitter.emit.bind(this._emitter)
	this.addEventListener = this._emitter.on.bind(this._emitter)
	sinon.fake(this, 'addEventListener').callsOriginal()
}

XMLHttpRequest._instances = []
XMLHttpRequest._reset = function reset() {
	XMLHttpRequest._instances = []
}

XMLHttpRequest.prototype =
{ open: open
, setRequestHeader: setRequestHeader
, send: send
, _headers: {}
, _load: load
}

function load(res) {
	this._emit('load', { target: res || new Response })
}

function open(method, url, async, user, password) {
}
function send() {
}

function setRequestHeader(header, value) {
	this._headers[header] = value
}
