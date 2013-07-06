#!/usr/bin/env node

var fs = require('fs')
var uglify = require('uglify-js')
var min = uglify.minify('./src/ajax.js').code

fs.writeFileSync('fajax.min.js', min)

console.log('`fajax.min.js` created')
