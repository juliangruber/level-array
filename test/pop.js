var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('pop', function(t) {
  t.plan(4);

  var db = level();
  var people = array(db);

  people.push('julian', function(err) {
    t.error(err);

    people.pop(function(err, name) {
      t.error(err);
      t.equal(name, 'julian');

      db.createValueStream().pipe(concat(function(values) {
        t.notOk(values);
      }));
    });
  });
});

