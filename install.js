#!/usr/bin/env node

var fs = require('fs')
var uglify = require('uglify-js')
var browserify = require('browserify')

browserify()
	.require('./src/ajax.js', { expose: 'fajax' })
	.bundle(function(err, content) {
		var before =
';(function(root,factory) {\n\
if (typeof define === "function" && define.amd) {\n\
	// AMD. Register as an anonymous module.\n\
	define(factory);\n\
} else if (typeof exports === "object") {\n\
	// Node. Does not work with strict CommonJS, but\n\
	// only CommonJS-like enviroments that support module.exports,\n\
	// like Node.\n\
	module.exports = factory();\n\
} else {\n\
	// Browser globals (root is window)\n\
	root.fajax = factory();\n\
}}(this,function(){var require;'
		var after = 'return require("fajax")}));'

		var max = before + content + after

		var min = uglify.minify(max, { fromString: true }).code

		fs.writeFileSync('fajax.min.js', min)

		console.log('`fajax.min.js` created')
	})
