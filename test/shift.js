var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('shift', function(t) {
  t.plan(4);

  var db = level();
  var people = array(db);

  people.unshift('julian', function(err) {
    t.error(err);

    people.shift(function(err, name) {
      t.error(err);
      t.equal(name, 'julian');

      db.createValueStream().pipe(concat(function(values) {
        t.notOk(values);
      }));
    });
  });
});

