
var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('splice', function(t) {
  t.plan(6);

  var db = level();
  var people = array(db);

  people.push('julian', function(err) {
    t.error(err);

    people.push('lena', function(err) {
      t.error(err);

      people.splice('zV', 1, 'simon', function(err, removed) {
        t.error(err);
        t.deepEqual(removed, ['lena']);

        people.join('-', function(err, joined) {
          t.error(err);
          t.equal(joined, 'julian-simon');
        });
      });
    });
  });
});

