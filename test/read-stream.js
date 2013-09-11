var test = require('tape');
var level = require('level-test')();
var array = require('..');
var concat = require('concat-stream');

test('read stream', function(t) {
  t.plan(3);

  var db = level();
  var people = array(db);

  people.push('julian', function(err) {
    t.error(err);
    people.push('lena', function(err) {
      t.error(err);

      var peeps = [];
      people.createReadStream()
      .on('data', function(person) {
        peeps.push(person);
      })
      .on('end', function() {
        t.deepEqual(peeps, [
          { key: 'z', value: 'julian' },
          { key: 'zV', value: 'lena' }
        ]);
      });
    });
  });
});

