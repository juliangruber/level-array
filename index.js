var peek = require('level-peek');
var between = require('between');
var count = require('count-stream');
var join = require('join-stream');
var concat = require('concat-stream');
var once = require('once');
var Writable = require('stream').Writable
  || require('readable-stream').Writable;

module.exports = array;

function array(db) {
  if (!(this instanceof array)) return new array(db);
  this.db = db;
}

array.prototype.unshift = function(value, fn) {
  var self = this;

  peek.first(self.db, function(err, first) {
    if (err && err.message != 'range not found') return fn(err);
    var key = first && between(between.lo, first.key) || 'a';
    self.db.put(key, value, function(err) {
      if (err) return fn(err);
      fn(null, key);
    });
  });
};

array.prototype.shift = function(fn) {
  var self = this;

  peek.first(self.db, function(err, key, value) {
    if (err) return fn(err);

    self.db.del(key, function(err) {
      if (err) return fn(err);
      fn(null, value);
    });
  });
};

array.prototype.push = function(value, fn) {
  var self = this;

  peek.last(self.db, function(err, lastKey) {
    if (err && err.message != 'range not found') return fn(err);
    var key = lastKey && between(lastKey, between.hi) || 'z';
    self.db.put(key, value, function(err) {
      if (err) return fn(err);
      fn(null, key);
    });
  });
};

array.prototype.pop = function(fn) {
  var self = this;

  peek.last(self.db, function(err, key, value) {
    if (err) return fn(err);

    self.db.del(key, function(err) {
      if (err) return fn(err);
      fn(null, value);
    });
  });
};

array.prototype.length = function(fn) {
  fn = once(fn);
  this.createKeyStream()
    .on('error', fn)
    .pipe(count(function(length) {
      fn(null, length);
    }));
};

array.prototype.createKeyStream = function(opts) {
  return this.db.createKeyStream(opts);
};

array.prototype.createValueStream = function(opts) {
  return this.db.createValueStream(opts);
};

array.prototype.createReadStream = function(opts) {
  return this.db.createReadStream(opts);
};

array.prototype.join = function(sep, fn) {
  fn = once(fn);
  this.createValueStream()
    .on('error', fn)
    .pipe(join(sep))
    .pipe(concat(fn.bind(null, null)))
};

array.prototype.splice = function(index, remove/*, items.., fn*/) {
  var self = this;
  var args = [].slice.call(arguments);
  var fn = once(args.pop());
  var items = args.slice(2);
  var ops = [];
  var removed = [];

  if (remove === 0) {
    insert();
  } else {
    insert = once(insert);
    var w = Writable({ objectMode: true });
    w._write = function(obj, _, done) {
      removed.push(obj.value);
      ops.push({ type: 'del', key: obj.key });
      done();
    };
    w.on('finish', insert);

    self.createReadStream({ gte: index, limit: remove })
      .pipe(w);
  }

  function insert(err) {
    if (err) return fn(err);
    if (!items.length) return write();

    var a = index;
    var b = '';

    peek.first(self.db, { gte: index }, function(err, firstKey) {
      if (err) return fn(err);
      b = firstKey;

      for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        b = a != b
          ? between(a, b)
          : between.hi;

        ops.push({
          type: 'put',
          key: between(a, b),
          value: item
        });
      }

      write();
    });
  };

  function write() {
    self.db.batch(ops, function(err) {
      if (err) return fn(err);
      fn(null, removed);
    });
  };
};

array.prototype.indexOf = function (element, fn) {
  var stream = this.db.createReadStream();
  fn = once(fn);

  stream.on('data', function (obj) {
    if (element === obj.value) {
      fn(null, obj.key);
      stream.destroy();
    }
  })
  .on('end', function() {
    fn(null, -1);
  })
  .on('error', fn);
};

