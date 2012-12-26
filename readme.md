fajax
=====

A tiny ender-wrapper around XMLHttpRequest.

It is currently at 2888B unminified, 1427B minified and 751B minified and gzipped.

It can easily be included using ender!


Browser support
---------------

It is tested in the following browsers:

- Chrome v. 23
- Firefox v. 17
- Opera v. 12.11
- Safari v. 6
- IE v. 9
- IE v. 8

It does not work in IE7 or below out of the box when receiving `application/json`,
because `JSON.parse` is not supported. If this is a requirement, then use something
like [json2](https://github.com/douglascrockford/JSON-js) from
Douglas Crockford. Everything else seems to work.


Examples
--------

For a quick example, check [the manual test file](test/manual/browser.html).
It uses [jQuery][jquery] as a promise library and `fajax` for calling
the bundled server (placed in the same folder. It requires [node](http://nodejs.org)
to run).


API
---

Including this page in the browser (`window.fajax`) or through [ender][ender]
(`$.ajax` or `require('fajax')`) gives you access to the basic method.

It have two static methods:

1.  `fajax.defer(deferConstructor)`: Assigns a specific defer-function. More on
    this in the segment below.
2.  `fajax.defaults(newDefaults)`: Updates the defaults. Notice that this adds
    to the defaults, so

        fajax.defaults({ method: 'post' });
        fajax.defaults({ accept: 'application/json' })

    is the same as

        fajax.defaults(
        { method: 'post'
        , accept: 'application/json'
        })

The `fajax` function can take 3 arguments:

1.  An options dictionary (more on this below).
2.  A `string` of the url for the request. This can also be given as `url` in
    the options dictionary.
3.  A `function` that will be called when the request is complete. This can also
    be given as `onload` in the options dictionary.

The options dictionary supports the following keys:

 -  `headers`: A key-value based list of request headers to set.
 -  `accept`: The accept header. This defaults to the browsers normal value.
    If `accept` is set here, it will override the value in the headers-list.
 -  `method`: The http-method to use. It defaults to `GET`.


Support for promises
--------------------

There is rudimentary support for promises, but you have to supply the library to
be used.

It automatically picks up [jQuery][jquery] or [Q][q] if they are referenced in
global-scope (as either `jQuery` or `Q`).

If you need other libraries, or your library is not exposed globally, you can
set your own using `fajax(deferConstructor)`. It expects the given function to
return a deferred, which holds a `resolve()` and `reject()` method, as well as
a `promise` property for accessing the promise. This syntax equals [Q][q] exactly,
and it can actually be called like `fajax.defer(Q.defer)`.

For an example on how to use this with [ender][ender], you can look at
[the root client-side file](https://github.com/fizker/vp-lan/blob/master/client/js/index.js)
for [vp-lan](https://github.com/fizker/vp-lan), a project that was the requirement
behind this project.

[jquery]: http://jquery.com
[q]: http://documentup.com/kriskowal/q
[ender]: http://ender.jit.su
