var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('push', function(t) {
  t.plan(3);

  var db = level();
  var people = array(db);

  people.push('julian', function(err, key) {
    t.error(err);
    t.equal(key, 'z');

    db.createValueStream().pipe(concat(function(keys) {
      t.equal(keys, 'julian');
    }));
  });
});

