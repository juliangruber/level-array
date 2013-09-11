var test = require('tape');
var level = require('level-test')();
var array = require('..');

test('length', function(t) {
  t.plan(4);

  var db = level();
  var people = array(db);

  people.push('julian', function(err) {
    t.error(err);
    people.push('lena', function(err) {
      t.error(err);
      people.length(function(err, length) {
        t.error(err);
        t.equal(length, 2);
      });
    });
  });
});

