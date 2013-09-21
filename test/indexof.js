
var test = require('tape');
var level = require('level-test')();
var array = require('..');

test('indexOf', function (t) {

  t.plan(8);

  var db = level();
  var cities = array(db);

  cities.push('new york', function (err) {
    t.error(err);

    cities.push('la', function (err) {
      t.error(err);

      cities.indexOf('new york', function (err, index) {
        t.error(err);
        t.notEqual(null, index);

        cities.indexOf('la', function (err, index) {
          t.error(err);
          t.notEqual(null, index);

          cities.indexOf('sfo', function (err, index) {
            t.error(err);
            t.equal(null, index);
          });
        });
      });



    });
  });
});
