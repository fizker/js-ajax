fajax
=====

A tiny ender-wrapper around XMLHttpRequest.

It is currently at 2023B unminified, 995B minified and 913B minified and gzipped.


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

[jquery]: http://jquery.com
[q]: http://documentup.com/kriskowal/q
