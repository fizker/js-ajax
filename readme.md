fajax
=====

A tiny wrapper around XMLHttpRequest.


Browser support
---------------

It is tested in the following browsers:

- Chrome v. 23
- Firefox v. 17
- Opera v. 12.11
- Safari v. 6
- IE v. 9
- IE v. 8

It requires an ES6 compatible `Promise` implementation. You can shim this with
either `es6-shim` or `es6-promise`. The `Promise` constructor should be available
in global scope.


Note for IE8 and below: You need to supply a shim for Function.prototype.bind.

It does not work in IE7 or below out of the box when receiving `application/json`,
because `JSON.parse` is not supported. If this is a requirement, then use
something like [json2](https://github.com/douglascrockford/JSON-js) from
Douglas Crockford. Everything else seems to work.


Examples
--------

Using this could not be more simple:

    var fajax = require('fajax')
    fajax.defaults({
        baseUrl: 'http://my-server.com',
        accept: 'application/json'
    })
    fajax.get('/some-resource').then(function(xhr) {
        // if the server returns Content-Type: application/json,
        // this is already parsed for us
        var jsonBody = xhr.body
    })

    // Sometime later
    fajax.post('/some-action', { json: jsonBody })
        .then(function(xhr) {
            // Report success
        },
        // The promise is rejected if the status code is 400 or higher
        function(xhr) {
            // Handle validation error or the like
        })


API
---

Include this by calling `var fajax = require('fajax')`. This require that you
use a build-tool that is compatible with CommonJS, such as browserify or webpack.


The returned function have two static methods:

1.  `fajax.qs(queryStringCreator)`: Assigns a specific query-string creator
    function. This is used when `form` is specified in the options.

    For example, it is simple to use the excellent [qs][qs] library:

        // fajax and qs loaded via ender:
        $.ajax.qs($.stringify)
2.  `fajax.defaults(newDefaults)`: Updates the defaults. Notice that this adds
    to the defaults, so

        fajax.defaults({ method: 'post' });
        fajax.defaults({ accept: 'application/json' })

    is the same as

        fajax.defaults(
        { method: 'post'
        , accept: 'application/json'
        })

An interesting parameter in the defaults is `baseUrl`. This is resolved on the
url passed in when initiating a request, so this is an easy way to normalize
urls based on either a folder or a server.

    Example:
    fajax.defaults({ baseUrl: 'http://example.com' })
    fajax.get('/test') // -> GET to http://example.com/test

    fajax.defaults({ baseUrl: '/foo' })
    fajax.get('bar') // -> GET to <currentDomain>/foo/bar
    fajax.get('/absolute') // -> GET to <currentDomain>/absolute


The function itself can take 3 arguments:

1.  An options dictionary (more on this below).
2.  A `string` of the url for the request. This can also be given as `url` in
    the options dictionary.
3.  An optional `function` that will be called when the request is complete.
    This can also be given as `onload` in the options dictionary.

The options dictionary supports the following keys:

 -  `headers`: A key-value based list of request headers to set.
 -  `accept`: The accept header. This defaults to the browsers normal value.
    If `accept` is set here, it will override the value in the headers-list.
 -  `method`: The http-method to use. It defaults to `GET`.
 -  `body`: Sends some text to the server. It defaults the `Content-Type` header
    to `text/plain`, but won't override a specifically set header.
 -  `json`: Sends the given object as JSON. This requires JSON.stringify to be
    available in global scope.

    It will override `Content-Type` with `application/json`.
 -  `form`: Sends the given string or object as form-parameters.
    The basic implementation will only send a flat object, discarding any
    values that are not `String`, `Boolean` or `Number`.

    For a more extensive implementation, you can provide any function via the
    `fajax.qs(func)` function.

    It will override `Content-Type` with `application/x-www-form-urlencoded`.

It is also possible to initiate a request with `fajax.request()`.
It takes the method as the first parameter, but otherwise acts exactly like
`fajax()`.

For convenience, there are shorthands for the basic HTTP methods:

- `fajax.get()`
- `fajax.head()`
- `fajax.post()`
- `fajax.put()`
- `fajax.delete()` or `fajax.del()`
- `fajax.patch()`
- `fajax.options()`

They all act as the primary function (`fajax()`), except they also enforce the
`method` option.


[qs]: https://github.com/visionmedia/node-querystring
[node]: http://nodejs.org
