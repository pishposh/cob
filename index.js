'use strict';

let Promise = require('bluebird');

// like tj's co(), I think?:
module.exports = function (gen) {
    return Promise.coroutine(gen).call(this); // allow binding 'this'
}

// wrap without preserving function.length:
module.exports.wrap = function wrap(gen) {
    return Promise.coroutine(gen);
};

// wrap preserving function.length, but uglier and slower:
module.exports.awrap = function awrap(gen) {
    return giveArity(Promise.coroutine(gen), gen.length);
};

// wrap generator for use as Express middleware, sending any thrown errors to next(err):
module.exports.middleware = function middleware(gen) {
    let cr = Promise.coroutine(gen);
    if (gen.length <= 3) { // because Express inspects the handler's signature
        return function (req, res, next) {
            cr(req, res, next).catch(next);
        }
    } else {
        return function (err, req, res, next) {
            cr(err, req, res, next).catch(next);
        }
    }
}

// thanks to @Eric at <http://stackoverflow.com/a/13271752/3707798> for this, which alas is
// necessary until babel (or v8) supports configurable 'length' property of functions (ES6):
function giveArity(f, n) {
    let arglist = [];
    for (let i = 0; i < n; i++) { arglist[i] = "arg" + i }
    return eval("'use strict'; (function (" + arglist.join(",") + ") { return f.apply(this, arguments); })");
}
