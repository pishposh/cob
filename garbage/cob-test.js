'use strict';

let co  = require('co');
let cob = require('./index');
let util = require('util');

function f() {
    console.log("this:", util.inspect(this));
    console.log("args:", Array.prototype.slice.call(arguments));
}

function* g(a, b, c) {
    console.log("a, b, c:", a, b, c)
    console.log("this:", util.inspect(this, { depth: 0 }));
    console.log("args:", Array.prototype.slice.call(arguments));
    let n = yield Promise.resolve(4);
    return n * 2;
}


console.log("-------------------------------");
co.bind('blah')(g).then((v) => console.log(v));

console.log("-------------------------------");
cob.bind('blah')(g).then((v) => console.log(v));

let gp;

console.log("-------------------------------");
gp = co.wrap(g).bind("hi");
console.log("gp.length:", gp.length);
gp(1, 2, 3).then((v) => console.log(v));


console.log("-------------------------------");
gp = cob.awrap(g).bind("hi");
console.log("gp.length:", gp.length);
gp(1, 2, 3).then((v) => console.log(v));

// let gap = cob.awrap(g);
// console.log("gap.length:", gap.length);
// gap(1, 2, 3).then((v) => console.log(v));
