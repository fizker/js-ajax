if(require.main !== module) {
	return
}
var http = require('http')
  , fs = require('fs')
http.createServer(function (req, res) {
	if(req.url == '/') {
		return fs.readFile('./browser.html', 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html' })
			res.end(data)
		})
	}
	if(req.url == '/ajax.js') {
		return fs.readFile('../../src/ajax.js', 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/javascript' })
			res.end(data)
		})
	}
	if(req.url == '/json') {
		res.writeHead(200, {'Content-Type': 'application/json' })
		res.end('{ "a":1, "b":2 }')
	}
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('method was: ' + req.method);
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');
