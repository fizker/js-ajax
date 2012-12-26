if(require.main !== module) {
	return
}
var http = require('http')
  , fs = require('fs')
http.createServer(function (req, res) {
	if(req.url == '/') {
		return fs.readFile(__dirname + '/browser.html', 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html' })
			res.end(data)
		})
	}
	if(req.url == '/ajax.js') {
		return fs.readFile(__dirname + '/../../src/ajax.js', 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/javascript' })
			res.end(data)
		})
	}
	if(req.url == '/json') {
		res.writeHead(200, {'Content-Type': 'application/json' })
		res.end('{ "a":1, "b":2 }')
		return
	}
	if(req.url == '/status-500') {
		res.writeHead(500, {'Content-Type': 'text/plain'})
		res.end('Server error')
		return
	}
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('method was: ' + req.method);
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');
