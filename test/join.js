var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('join', function(t) {
  t.plan(4);

  var db = level();
  var people = array(db);

  people.push('julian', function(err) {
    t.error(err);

    people.push('lena', function(err) {
      t.error(err);

      people.join('-', function(err, joined) {
        t.error(err);
        t.equal(joined, 'julian-lena');
      });
    });
  });
});

