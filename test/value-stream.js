
var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('value stream', function(t) {
  t.plan(3);

  var db = level();
  var people = array(db);

  people.push('julian', function(err) {
    t.error(err);
    people.push('lena', function(err) {
      t.error(err);

      var peeps = [];
      people.createKeyStream()
      .on('data', function(person) {
        peeps.push(person);
      })
      .on('end', function() {
        t.deepEqual(peeps, [
          'julian', 'lena'
        ]);
      });
    });
  });
});

