var array = require('./');
var level = require('level');

var db = level(__dirname + '/db');

var people = array(db);

// add first
people.unshift('julian', fn);

// remove first
people.shift(fn);

// add last
people.push('julian', fn);

// remove last
people.pop(fn);

// get length
people.length(fn);

// read all
people.create{Read,Key,Value}Stream();

// join
people.join(seperator, fn);

// add/remove elements
people.splice(1, 1, 'foo', fn);

